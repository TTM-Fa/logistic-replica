/**
 * Capacity chart injection — replaces frozen SVG with live Recharts.
 * 2 metrics: Capacity Index, Spot Price Index (both are index values, not €)
 */
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { parseWeek, formatCWFull } from './shared.js';
import './rates.css';

const FAMILY_META = {
  'capacity-index':    { label: 'Capacity Index',    color: '#10b981' },
  'spot-price-index':  { label: 'Spot Price Index',  color: '#0073e6' },
};

const DATE_RANGE_WEEKS = {
  'last-2-years': 104, 'last-13-months': 57, 'last-3-months': 13, 'custom': 104,
};

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Aggregate weekly data into monthly or quarterly averages
function aggregate(data, frequency) {
  if (frequency === 'Weekly') return data;
  const grouped = {};
  for (const row of data) {
    const d = new Date(row.date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const bucket = frequency === 'Monthly'
      ? `${year}-${String(month).padStart(2, '0')}`
      : `${year}-Q${Math.floor(month / 3) + 1}`;
    if (!grouped[bucket]) grouped[bucket] = { date: row.date, _n: 0, _bucket: bucket };
    for (const id of Object.keys(FAMILY_META)) {
      if (row[id] != null) {
        grouped[bucket][id] = ((grouped[bucket][id] ?? 0) * grouped[bucket]._n + row[id]) / (grouped[bucket]._n + 1);
      }
    }
    grouped[bucket]._n++;
  }
  return Object.values(grouped).sort((a, b) => a._bucket.localeCompare(b._bucket));
}

function formatMonthYear(isoStr) {
  const d = new Date(isoStr);
  return `${MONTHS_SHORT[d.getUTCMonth()]} '${String(d.getUTCFullYear()).slice(2)}`;
}

function isFirstWeekOfMonth(isoStr) {
  const d = new Date(isoStr);
  const prev = new Date(d - 7 * 24 * 60 * 60 * 1000);
  return d.getUTCMonth() !== prev.getUTCMonth();
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rt-tooltip">
      <div className="rt-tooltip-header">{formatCWFull(label)}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="rt-tooltip-row">
          <span className="rt-tooltip-dot" style={{ background: p.color }} />
          <span className="rt-tooltip-label">{FAMILY_META[p.dataKey]?.label ?? p.dataKey}</span>
          <span className="rt-tooltip-value">{p.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function CapacityChart({ data: capData }) {
  const [hoveredDate, setHoveredDate] = useState(null);
  const [datePreset, setDatePreset] = useState('last-2-years');
  const [frequency, setFrequency] = useState('Weekly');
  const [region, setRegion] = useState({ from: 'DE', to: 'DE' });
  const scrollRef = useRef(null);
  const colWidth = 64;
  const stickyWidth = 150;

  useEffect(() => {
    const onDate = e => setDatePreset(e.detail.preset);
    const onSelect = e => { if (e.detail.field === 'Frequency') setFrequency(e.detail.value); };
    const onRegion = e => setRegion(prev => ({ ...prev, [e.detail.field]: e.detail.code }));
    document.addEventListener('tpr:date', onDate);
    document.addEventListener('tpr:select', onSelect);
    document.addEventListener('tpr:region', onRegion);
    return () => {
      document.removeEventListener('tpr:date', onDate);
      document.removeEventListener('tpr:select', onSelect);
      document.removeEventListener('tpr:region', onRegion);
    };
  }, []);

  const rawData = useMemo(() => {
    const byDate = {};
    for (const [familyId, points] of Object.entries(capData)) {
      for (const [dateStr, value] of points) {
        if (!byDate[dateStr]) byDate[dateStr] = { date: dateStr };
        byDate[dateStr][familyId] = value;
      }
    }
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [capData]);

  const allData = useMemo(() => {
    const weeksBack = DATE_RANGE_WEEKS[datePreset] ?? 104;
    const sliced = rawData.slice(-weeksBack);
    return aggregate(sliced, frequency);
  }, [rawData, datePreset, frequency]);

  const hoveredRow = hoveredDate ? allData.find(r => r.date === hoveredDate) : null;

  useEffect(() => {
    if (!hoveredDate || !scrollRef.current) return;
    const idx = allData.findIndex(r => r.date === hoveredDate);
    if (idx < 0) return;
    const el = scrollRef.current;
    const visibleWidth = el.clientWidth - stickyWidth;
    el.scrollLeft = Math.max(0, idx * colWidth - visibleWidth / 2 + colWidth / 2);
  }, [hoveredDate, allData]);

  return (
    <div>
      {/* Hover bar */}
      <div className="rt-hover-bar">
        {hoveredRow ? (
          <>
            <span className="rt-hover-date">{formatCWFull(hoveredRow.date)}</span>
            {Object.entries(FAMILY_META).map(([id, { label, color }]) => hoveredRow[id] != null && (
              <span key={id} className="rt-hover-metric">
                <span className="rt-hover-dot" style={{ background: color }} />
                <span className="rt-hover-label">{label}:</span>
                <strong className="rt-hover-value">{hoveredRow[id].toFixed(2)}</strong>
              </span>
            ))}
          </>
        ) : (
          <span className="rt-hover-placeholder">Hover over chart to see values</span>
        )}
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 420 }}>
        <ResponsiveContainer>
          <LineChart
            data={allData}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            onMouseMove={s => s?.activeLabel && setHoveredDate(s.activeLabel)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            <CartesianGrid stroke="#eee" vertical={false} />
            <XAxis
              dataKey="date"
              tick={props => {
                const date = props.payload.value;
                if (frequency === 'Weekly') {
                  if (!isFirstWeekOfMonth(date)) return null;
                  return (
                    <text x={props.x} y={props.y + 12} textAnchor="middle" fontSize={11} fill="#888">
                      {formatMonthYear(date)}
                    </text>
                  );
                }
                const row = allData.find(r => r.date === date);
                const label = frequency === 'Monthly'
                  ? formatMonthYear(date)
                  : (row?._bucket?.split('-').slice(1).join(' ') ?? '');
                return (
                  <text x={props.x} y={props.y + 12} textAnchor="middle" fontSize={11} fill="#888">
                    {label}
                  </text>
                );
              }}
              interval={0}
              axisLine={{ stroke: '#e8e8e8' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#888' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => v.toFixed(0)}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ccc', strokeWidth: 1, strokeDasharray: '4 2' }} />
            <Legend
              layout="horizontal"
              align="right"
              verticalAlign="top"
              iconType="circle"
              formatter={v => <span style={{ color: '#555', fontSize: 12 }}>{FAMILY_META[v]?.label ?? v}</span>}
              wrapperStyle={{ paddingBottom: 4 }}
            />
            {Object.entries(FAMILY_META).map(([id, { color }]) => (
              <Line
                key={id}
                type="monotone"
                dataKey={id}
                stroke={color}
                dot={false}
                strokeWidth={1.8}
                connectNulls
                isAnimationActive
                animationDuration={700}
                animationEasing="ease-out"
                activeDot={{ r: 4, strokeWidth: 0, fill: color }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div ref={scrollRef} className="rt-table-wrapper">
        <table className="rt-table" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: stickyWidth, minWidth: stickyWidth }} />
            {allData.map(row => <col key={row.date} style={{ width: colWidth, minWidth: colWidth }} />)}
          </colgroup>
          <thead>
            <tr>
              <th className="rt-metric-col">Metric</th>
              {allData.map(row => {
                const { week, year } = parseWeek(row.date);
                const isHot = row.date === hoveredDate;
                let label;
                if (frequency === 'Weekly') {
                  label = { top: `CW ${week}`, sub: String(year) };
                } else if (frequency === 'Monthly') {
                  label = { top: `M${row._bucket?.split('-')[1]}`, sub: row._bucket?.split('-')[0] };
                } else {
                  label = { top: row._bucket?.split('-')[1] ?? '', sub: row._bucket?.split('-')[0] };
                }
                return (
                  <th key={row.date} className={`rt-cw-col${isHot ? ' highlighted' : ''}`}>
                    <div className="rt-cw-header">
                      <span className="rt-cw-num">{label.top}</span>
                      <span className="rt-cw-year">{label.sub}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Object.entries(FAMILY_META).map(([id, { label, color }]) => (
              <tr key={id}>
                <td className="rt-metric-col rt-sticky">
                  <span className="rt-metric-dot" style={{ background: color }} />
                  {label}
                </td>
                {allData.map((row, i) => {
                  const val = row[id];
                  const prev = i > 0 ? allData[i - 1][id] : null;
                  const pct = val != null && prev != null ? (val - prev) / prev * 100 : null;
                  const isHot = row.date === hoveredDate;
                  return (
                    <td key={row.date} className={`rt-cw-col${isHot ? ' highlighted' : ''}`}>
                      {val != null && (
                        <>
                          <div className="rt-cell-value">{val.toFixed(2)}</div>
                          {pct != null && (
                            <div className={`rt-cell-change ${pct > 0 ? 'up' : pct < 0 ? 'down' : ''}`}>
                              {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Mount ──
async function init() {
  // Capacity page uses metric-comparison-chart
  const chartEl = document.querySelector('[data-testid="metric-comparison-chart"]')
    || document.querySelector('[data-testid="spot-contract-comparison-chart"]')
    || document.querySelector('.emcwrd5');
  if (!chartEl) {
    console.warn('[capacity] Chart container not found');
    return;
  }

  chartEl.style.visibility = 'visible';
  chartEl.style.overflow = 'visible';
  chartEl.style.minHeight = '520px';
  chartEl.style.background = '#fff';
  const inner = chartEl.querySelector('.emcwrd5');
  if (inner) inner.style.overflow = 'visible';

  chartEl.innerHTML = '<div class="rt-loading">Loading chart…</div>';

  let data;
  try {
    const res = await fetch('/api-data/capacity/metrics.json');
    data = await res.json();
  } catch (e) {
    chartEl.innerHTML = `<div class="rt-error">Failed to load data: ${e.message}</div>`;
    return;
  }

  // Hide frozen table
  const tableEl = document.querySelector('[data-testid="metric-overview-table"]')
    || document.querySelector('[data-testid="spot-contract-overview-table"]');
  if (tableEl) tableEl.style.display = 'none';

  // Remove watermark
  document.querySelectorAll('.c1ocs50, ._1p8blt30').forEach(el => { el.style.display = 'none'; });

  chartEl.innerHTML = '';
  createRoot(chartEl).render(<CapacityChart data={data} />);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
