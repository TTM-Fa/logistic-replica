/**
 * Rates Overview chart injection — replaces frozen SVG with live Recharts.
 * Matches the Transporeon Insights design:
 *   - Area chart with filled regions (Spot = blue, Contract = peach)
 *   - Single Y-axis (€), spread only in the table
 *   - Vertical grid lines, legend bottom-right
 *   - Rich tooltip card
 *   - Weekly / Monthly / Quarterly aggregation via tpr:select
 */
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { parseWeek, formatCWFull } from './shared.js';
import './rates.css';

const CHART_METRICS = {
  'spot-price':     { label: 'Spot Price',     color: '#3b82f6', fillColor: 'rgba(59,130,246,0.18)' },
  'contract-price': { label: 'Contract Price', color: '#f59e0b', fillColor: 'rgba(245,158,11,0.13)' },
};

const TABLE_METRICS = {
  'spot-price':          { label: 'Spot Price',          color: '#3b82f6', fmt: v => v.toFixed(2) },
  'contract-price':      { label: 'Contract Price',      color: '#f59e0b', fmt: v => v.toFixed(2) },
  'spot-offer-spread':   { label: 'Spot Offer Spread',   color: null,      fmt: v => `${v.toFixed(2)}%` },
};

const DATE_RANGE_WEEKS = {
  'last-2-years': 104, 'last-13-months': 57, 'last-3-months': 13, 'custom': 104,
};

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatMonthYear(isoStr) {
  const d = new Date(isoStr);
  return `${MONTHS_SHORT[d.getUTCMonth()]} '${String(d.getUTCFullYear()).slice(2)}`;
}

function formatMonthYearFull(isoStr) {
  const d = new Date(isoStr);
  const m = MONTHS_SHORT[d.getUTCMonth()];
  const y = d.getUTCFullYear();
  return `${m} '${String(y).slice(2)}`;
}

function isQuarterBoundary(isoStr) {
  const d = new Date(isoStr);
  const prev = new Date(d - 7 * 24 * 60 * 60 * 1000);
  const qNow = Math.floor(d.getUTCMonth() / 3);
  const qPrev = Math.floor(prev.getUTCMonth() / 3);
  return qNow !== qPrev || d.getUTCFullYear() !== prev.getUTCFullYear();
}

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
    for (const id of [...Object.keys(CHART_METRICS), 'spot-offer-spread']) {
      if (row[id] != null) {
        grouped[bucket][id] = ((grouped[bucket][id] ?? 0) * grouped[bucket]._n + row[id]) / (grouped[bucket]._n + 1);
      }
    }
    grouped[bucket]._n++;
  }
  return Object.values(grouped).sort((a, b) => a._bucket.localeCompare(b._bucket));
}

// X-axis label logic: show quarter boundaries for weekly, month for monthly
function shouldShowXLabel(isoStr, frequency) {
  if (frequency === 'Weekly') return isQuarterBoundary(isoStr);
  return true; // show all labels for Monthly/Quarterly
}

function xLabel(row, frequency) {
  if (frequency === 'Quarterly') {
    return row._bucket?.split('-').slice(1).join(' ') ?? '';
  }
  if (frequency === 'Monthly') {
    const d = new Date(row.date);
    return `${MONTHS_SHORT[d.getUTCMonth()]} '${String(d.getUTCFullYear()).slice(2)}`;
  }
  return formatMonthYear(row.date);
}

function CustomTooltip({ active, payload, label, allData }) {
  if (!active || !payload?.length) return null;
  const { week, year } = parseWeek(label);
  const spot = payload.find(p => p.dataKey === 'spot-price')?.value;
  const contract = payload.find(p => p.dataKey === 'contract-price')?.value;
  const row = allData?.find(r => r.date === label);
  const spread = row?.['spot-offer-spread'];

  // Calculate change from previous week
  const idx = allData?.findIndex(r => r.date === label) ?? -1;
  const prev = idx > 0 ? allData[idx - 1] : null;
  const spotDiff = spot != null && prev?.['spot-price'] != null ? spot - prev['spot-price'] : null;
  const spotPct = spotDiff != null && prev['spot-price'] ? (spotDiff / prev['spot-price'] * 100) : null;

  return (
    <div className="rt-tooltip-card">
      <div className="rt-tooltip-card-header">
        <span className="rt-tooltip-card-dot" style={{ background: '#3b82f6' }} />
        <span className="rt-tooltip-card-title">Spot Price <span className="rt-tooltip-card-unit">(€/km)</span></span>
      </div>
      <div className="rt-tooltip-card-row-main">
        <span className="rt-tooltip-card-price">€{spot?.toFixed(2) ?? '—'}</span>
        <span className="rt-tooltip-card-cw">CW{week}, {formatMonthYearFull(label)}</span>
      </div>
      {spotDiff != null && (
        <div className={`rt-tooltip-card-change ${spotDiff < 0 ? 'down' : 'up'}`}>
          <span className="rt-tooltip-card-arrow">{spotDiff < 0 ? '▼' : '▲'}</span>
          {spotDiff < 0 ? '-' : '+'}€{Math.abs(spotDiff).toFixed(2)}
          <span className="rt-tooltip-card-pct">({spotPct < 0 ? '' : '+'}{spotPct?.toFixed(0)}%)</span>
          <span className="rt-tooltip-card-since">Since CW{prev ? parseWeek(prev.date).week : '?'}</span>
        </div>
      )}
      {spread != null && (
        <div className="rt-tooltip-card-spread">
          <strong>Spot Offer Spread</strong> <span>{spread.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}

function RatesOverviewChart({ data: ratesData }) {
  const [hoveredDate, setHoveredDate] = useState(null);
  const [datePreset, setDatePreset] = useState('last-2-years');
  const [frequency, setFrequency] = useState('Weekly');
  const [region, setRegion] = useState({ from: 'DE', to: 'DE' });
  const scrollRef = useRef(null);
  const colWidth = 80;
  const stickyWidth = 160;

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
    for (const [familyId, points] of Object.entries(ratesData)) {
      for (const [dateStr, value] of points) {
        if (!byDate[dateStr]) byDate[dateStr] = { date: dateStr };
        byDate[dateStr][familyId] = value;
      }
    }
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [ratesData]);

  const allData = useMemo(() => {
    const weeksBack = DATE_RANGE_WEEKS[datePreset] ?? 104;
    const sliced = rawData.slice(-weeksBack);
    return aggregate(sliced, frequency);
  }, [rawData, datePreset, frequency]);

  const hoveredRow = hoveredDate ? allData.find(r => r.date === hoveredDate) : null;

  // Scroll sync
  useEffect(() => {
    if (!hoveredDate || !scrollRef.current) return;
    const idx = allData.findIndex(r => r.date === hoveredDate);
    if (idx < 0) return;
    const el = scrollRef.current;
    const visibleWidth = el.clientWidth - stickyWidth;
    el.scrollLeft = Math.max(0, idx * colWidth - visibleWidth / 2 + colWidth / 2);
  }, [hoveredDate, allData]);

  // Y-axis domain: computed from visible price data only
  const priceDomain = useMemo(() => {
    const vals = allData.flatMap(r => [r['spot-price'], r['contract-price']]).filter(v => v != null);
    if (!vals.length) return [1.7, 2.5];
    const min = Math.floor(Math.min(...vals) * 10) / 10;
    const max = Math.ceil(Math.max(...vals) * 10) / 10;
    return [min, max];
  }, [allData]);

  // Vertical grid lines at quarter boundaries
  const verticalTicks = useMemo(() => {
    if (frequency !== 'Weekly') return undefined;
    return allData.filter(r => isQuarterBoundary(r.date)).map(r => r.date);
  }, [allData, frequency]);

  return (
    <div className="rt-chart-outer">
      {/* Chart */}
      <div style={{ width: '100%', height: 460, position: 'relative' }}>
        <ResponsiveContainer>
          <ComposedChart
            data={allData}
            margin={{ top: 10, right: 16, left: 0, bottom: 30 }}
            onMouseMove={s => s?.activeLabel && setHoveredDate(s.activeLabel)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            <CartesianGrid
              stroke="#e8e8e8"
              vertical={frequency === 'Weekly'}
              verticalPoints={verticalTicks}
              horizontalCoordinatesGenerator={undefined}
            />
            <XAxis
              dataKey="date"
              tick={props => {
                const date = props.payload.value;
                if (frequency === 'Weekly') {
                  if (!isQuarterBoundary(date)) return null;
                  return (
                    <text x={props.x} y={props.y + 14} textAnchor="middle" fontSize={11} fill="#888">
                      {formatMonthYear(date)}
                    </text>
                  );
                }
                const row = allData.find(r => r.date === date);
                return (
                  <text x={props.x} y={props.y + 14} textAnchor="middle" fontSize={11} fill="#888">
                    {xLabel(row || { date, _bucket: '' }, frequency)}
                  </text>
                );
              }}
              interval={0}
              axisLine={{ stroke: '#d0d0d0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#888' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `€${v.toFixed(2)}`}
              width={56}
              domain={priceDomain}
            />
            <Tooltip
              content={<CustomTooltip allData={allData} />}
              cursor={{ stroke: '#999', strokeWidth: 1 }}
              isAnimationActive={false}
            />

            {/* Contract area (behind) */}
            <Area
              type="monotone"
              dataKey="contract-price"
              stroke={CHART_METRICS['contract-price'].color}
              fill={CHART_METRICS['contract-price'].fillColor}
              strokeWidth={1.5}
              dot={false}
              connectNulls
              isAnimationActive
              animationDuration={700}
              activeDot={{ r: 4, strokeWidth: 0, fill: CHART_METRICS['contract-price'].color }}
            />
            {/* Spot area (front) */}
            <Area
              type="monotone"
              dataKey="spot-price"
              stroke={CHART_METRICS['spot-price'].color}
              fill={CHART_METRICS['spot-price'].fillColor}
              strokeWidth={2}
              dot={false}
              connectNulls
              isAnimationActive
              animationDuration={700}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: CHART_METRICS['spot-price'].color }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend — bottom-right inside chart */}
        <div className="rt-legend-overlay">
          {Object.entries(CHART_METRICS).map(([id, { label, color }]) => (
            <span key={id} className="rt-legend-item">
              <span className="rt-legend-dot" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
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
              <th className="rt-metric-col" />
              {allData.map(row => {
                const { week, year } = parseWeek(row.date);
                const isHot = row.date === hoveredDate;
                let label;
                if (frequency === 'Weekly') {
                  label = { top: `CW${week}`, sub: isHot ? formatMonthYearFull(row.date) : '' };
                } else if (frequency === 'Monthly') {
                  label = { top: `M${row._bucket?.split('-')[1]}`, sub: row._bucket?.split('-')[0] };
                } else {
                  label = { top: row._bucket?.split('-')[1] ?? '', sub: row._bucket?.split('-')[0] };
                }
                return (
                  <th key={row.date} className={`rt-cw-col${isHot ? ' highlighted' : ''}`}>
                    <div className="rt-cw-header">
                      <span className="rt-cw-num">{label.top}</span>
                      {label.sub && <span className="rt-cw-year">{label.sub}</span>}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Object.entries(TABLE_METRICS).map(([id, { label, color, fmt }]) => (
              <tr key={id}>
                <td className="rt-metric-col rt-sticky">
                  {color && <span className="rt-metric-dot" style={{ background: color }} />}
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
                          <div className="rt-cell-value">{fmt(val)}</div>
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
  const chartEl = document.querySelector('[data-testid="spot-contract-comparison-chart"]')
    || document.querySelector('[data-testid="spot-contract-comparison"]')
    || document.querySelector('.emcwrd5');
  if (!chartEl) {
    console.warn('[rates-overview] Chart container not found');
    return;
  }

  chartEl.style.visibility = 'visible';
  chartEl.style.overflow = 'visible';
  chartEl.style.minHeight = '600px';
  chartEl.style.background = '#fff';
  const inner = chartEl.querySelector('.emcwrd5');
  if (inner) inner.style.overflow = 'visible';

  chartEl.innerHTML = '<div class="rt-loading">Loading chart…</div>';

  let data;
  try {
    const res = await fetch('/api-data/rates/metrics.json');
    data = await res.json();
  } catch (e) {
    chartEl.innerHTML = `<div class="rt-error">Failed to load data: ${e.message}</div>`;
    return;
  }

  // Hide frozen table
  const tableEl = document.querySelector('[data-testid="spot-contract-overview-table"]');
  if (tableEl) tableEl.style.display = 'none';

  // Remove watermark: hide the centered SVG watermark overlay and sidebar branding
  document.querySelectorAll('.c1ocs50, ._1p8blt30').forEach(el => { el.style.display = 'none'; });
  document.querySelectorAll('._1ie0trf4, ._1ie0trf5').forEach(el => { el.style.visibility = 'hidden'; });

  chartEl.innerHTML = '';
  createRoot(chartEl).render(<RatesOverviewChart data={data} />);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
