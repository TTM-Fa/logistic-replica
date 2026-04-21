/**
 * Spot vs Contract table injection — replaces the Virtuoso-rendered table
 * with a clean, sortable React table.
 * Shows lanes with Contract Price, Spot Price, Diff (€/km) for 4 weeks.
 */
import { createRoot } from 'react-dom/client';
import { useState, useMemo, useEffect } from 'react';
import './rates.css';

const SORT_FIELDS = ['contract', 'spot', 'diff'];

function SortIcon({ direction }) {
  if (!direction) return <span className="svc-sort-icon">⇅</span>;
  return <span className="svc-sort-icon">{direction === 'asc' ? '↑' : '↓'}</span>;
}

function SpotVsContractTable({ data }) {
  const { cwHeaders, lanes } = data;
  const [sortKey, setSortKey] = useState(null);
  const [region, setRegion] = useState({ from: 'DE', to: 'DE' });

  useEffect(() => {
    const onRegion = e => setRegion(prev => ({ ...prev, [e.detail.field]: e.detail.code }));
    document.addEventListener('tpr:region', onRegion);
    return () => document.removeEventListener('tpr:region', onRegion);
  }, []);

  const sortedLanes = useMemo(() => {
    if (!sortKey) return lanes;
    const { week, field, dir } = sortKey;
    return [...lanes].sort((a, b) => {
      const aVal = a.weeks[week]?.[field] ?? 0;
      const bVal = b.weeks[week]?.[field] ?? 0;
      return dir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [lanes, sortKey]);

  function handleSort(week, field) {
    setSortKey(prev => {
      if (prev?.week === week && prev?.field === field) {
        // Toggle direction or clear
        if (prev.dir === 'asc') return { week, field, dir: 'desc' };
        return null; // reset
      }
      return { week, field, dir: 'asc' };
    });
  }

  function diffColor(val) {
    if (val == null) return {};
    if (val < 0) return { color: '#e53935' }; // negative = spot cheaper than contract
    if (val > 0) return { color: '#43a047' };
    return {};
  }

  return (
    <div className="svc-container">
      <div className="svc-table-wrapper">
        <table className="svc-table">
          <thead>
            {/* CW header row */}
            <tr>
              <th className="svc-rank-col" rowSpan={2}>#</th>
              <th className="svc-lane-col" rowSpan={2}>Lane</th>
              {cwHeaders.map((cw, i) => (
                <th key={i} colSpan={3} className="svc-cw-header">{cw}</th>
              ))}
            </tr>
            {/* Sub-column headers */}
            <tr>
              {cwHeaders.map((_, weekIdx) => (
                SORT_FIELDS.map(field => {
                  const label = field === 'contract' ? 'Contract' : field === 'spot' ? 'Spot' : 'Diff.';
                  const isActive = sortKey?.week === weekIdx && sortKey?.field === field;
                  return (
                    <th
                      key={`${weekIdx}-${field}`}
                      className={`svc-sub-header ${isActive ? 'active' : ''}`}
                      onClick={() => handleSort(weekIdx, field)}
                      title={`Sort by ${label}`}
                    >
                      {label} <SortIcon direction={isActive ? sortKey.dir : null} />
                    </th>
                  );
                })
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedLanes.map((lane, i) => (
              <tr key={lane.rank} className={i % 2 === 0 ? 'svc-row-even' : ''}>
                <td className="svc-rank-col">{lane.rank}.</td>
                <td className="svc-lane-col">
                  <div className="svc-lane-name">
                    {lane.lane.from} → {lane.lane.to}
                  </div>
                  <div className="svc-lane-distance">Distance: {lane.lane.distance}km</div>
                </td>
                {lane.weeks.map((w, wi) => (
                  <Fragment key={wi}>
                    <td className="svc-price-cell">€{w.contract.toFixed(2)}</td>
                    <td className="svc-price-cell">€{w.spot.toFixed(2)}</td>
                    <td className="svc-diff-cell" style={diffColor(w.diff)}>
                      {w.diff < 0 ? '-' : ''}€{Math.abs(w.diff).toFixed(2)}
                    </td>
                  </Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Need Fragment import
import { Fragment } from 'react';

// ── Mount ──
async function init() {
  // Find the table container — the Virtuoso-based table
  const tableEl = document.querySelector('[data-testid="spot-vs-contract-table"]')
    || document.querySelector('table');
  if (!tableEl) {
    console.warn('[spot-vs-contract] Table container not found');
    return;
  }

  // Walk up to the parent that contains the whole scrollable table area
  let container = tableEl;
  for (let depth = 0; depth < 5 && container.parentElement; depth++) {
    container = container.parentElement;
    // Stop at a reasonably high container that holds the table section
    if (container.querySelector('[data-testid="spot-vs-contract-table"]') && container.children.length <= 3) break;
  }

  container.style.visibility = 'visible';
  container.innerHTML = '<div class="rt-loading">Loading table…</div>';

  let data;
  try {
    const res = await fetch('/api-data/rates/spot-vs-contract.json');
    data = await res.json();
  } catch (e) {
    container.innerHTML = `<div class="rt-error">Failed to load data: ${e.message}</div>`;
    return;
  }

  // Remove watermark
  document.querySelectorAll('.c1ocs50, ._1p8blt30').forEach(el => { el.style.display = 'none'; });

  container.innerHTML = '';
  createRoot(container).render(<SpotVsContractTable data={data} />);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
