/**
 * Lane Overview chart injection — replaces frozen SVG with live Recharts.
 * Matches the original Transporeon Insights design closely.
 */
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { COLORS, parseWeek, formatCW, formatCWFull, formatValue, getMetricFamilies, getMetrics, getDatapoints } from './shared.js';
import './lane-overview.css';

const FAMILY_META = {
  'spot-price':     { label: 'Spot Price',     color: COLORS.spot },
  'contract-price': { label: 'Contract Price', color: COLORS.contract },
  'diesel-price':   { label: 'Diesel Price',   color: COLORS.diesel },
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
    const { year, week } = parseWeek(row.date);
    const bucket = frequency === 'Monthly'
      ? `${year}-M${String(Math.ceil(week / 4.345)).padStart(2, '0')}`
      : `${year}-Q${Math.ceil(week / 13)}`;
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
    <div className="lo-tooltip">
      <div className="lo-tooltip-header">{formatCWFull(label)}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="lo-tooltip-row">
          <span className="lo-tooltip-dot" style={{ background: p.color }} />
          <span className="lo-tooltip-label">{FAMILY_META[p.dataKey]?.label ?? p.dataKey}</span>
          <span className="lo-tooltip-value">€{p.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function LaneOverviewChart({ allFamilies }) {
  const [hoveredDate, setHoveredDate] = useState(null);
  const [datePreset, setDatePreset] = useState('last-2-years');
  const [frequency, setFrequency] = useState('Weekly');
  const [region, setRegion] = useState({ from: 'DE', to: 'DE' });
  const scrollRef = useRef(null);
  const colWidth = 64;
  const stickyWidth = 130;

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
    for (const [familyId] of Object.entries(FAMILY_META)) {
      const family = allFamilies.find(f => f.metricFamilyId === familyId);
      if (!family) continue;
      const dps = getDatapoints(getMetrics(family)[0]);
      for (const [dateStr, value] of dps) {
        if (!byDate[dateStr]) byDate[dateStr] = { date: dateStr };
        byDate[dateStr][familyId] = value;
      }
    }
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [allFamilies]);

  const allData = useMemo(() => {
    const weeksBack = DATE_RANGE_WEEKS[datePreset] ?? 104;
    const sliced = rawData.slice(-weeksBack);
    return aggregate(sliced, frequency);
  }, [rawData, datePreset, frequency]);

  const hoveredRow = hoveredDate ? allData.find(r => r.date === hoveredDate) : null;

  // Scroll table so the hovered column stays centered in the visible area
  useEffect(() => {
    if (!hoveredDate || !scrollRef.current) return;
    const idx = allData.findIndex(r => r.date === hoveredDate);
    if (idx < 0) return;
    const el = scrollRef.current;
    const colLeft = idx * colWidth; // offset from sticky col edge
    const visibleWidth = el.clientWidth - stickyWidth;
    const target = colLeft - visibleWidth / 2 + colWidth / 2;
    el.scrollLeft = Math.max(0, target);
  }, [hoveredDate, allData]);

  return (
    <div>
      {/* Hover summary bar */}
      <div style={{ height: 28, display: 'flex', alignItems: 'center', gap: 20, padding: '0 4px', fontSize: 12 }}>
        {hoveredRow ? (
          <>
            <span style={{ fontWeight: 600, color: '#333' }}>{formatCWFull(hoveredRow.date)}</span>
            {Object.entries(FAMILY_META).map(([id, { label, color }]) => hoveredRow[id] != null && (
              <span key={id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                <span style={{ color: '#555' }}>{label}: <strong style={{ color: '#222' }}>€{hoveredRow[id].toFixed(2)}</strong></span>
              </span>
            ))}
          </>
        ) : (
          <span style={{ color: '#bbb', fontSize: 11 }}>Hover over chart to see values</span>
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
                let label;
                if (frequency === 'Weekly') {
                  if (!isFirstWeekOfMonth(date)) return null;
                  label = formatMonthYear(date);
                } else {
                  const row = allData.find(r => r.date === date);
                  label = row?._bucket?.split('-').slice(1).join(' ') ?? '';
                }
                return (
                  <text x={props.x} y={props.y + 12} textAnchor="middle" fontSize={11} fill="#888">{label}</text>
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
              tickFormatter={v => `€${v.toFixed(2)}`}
              width={60}
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

      {/* Table — all data, scrollable */}
      <div ref={scrollRef} style={{ overflowX: 'auto', marginTop: 16 }}>
        <table className="lo-table" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 130, minWidth: 130 }} />
            {allData.map(row => <col key={row.date} style={{ width: 64, minWidth: 64 }} />)}
          </colgroup>
          <thead>
            <tr>
              <th className="lo-metric-col" style={{ position: 'sticky', left: 0, zIndex: 4 }}>Metric</th>
              {allData.map(row => {
                const { week, year } = parseWeek(row.date);
                const isHot = row.date === hoveredDate;
                const label = frequency === 'Weekly'
                  ? { top: `CW ${week}`, sub: String(year) }
                  : frequency === 'Monthly'
                    ? { top: `M${row._bucket?.split('-M')[1] ?? ''}`, sub: row._bucket?.split('-')[0] }
                    : { top: row._bucket?.split('-')[1] ?? '', sub: row._bucket?.split('-')[0] };
                return (
                  <th key={row.date} className={`lo-cw-col${isHot ? ' highlighted' : ''}`}>
                    <div className="lo-cw-header">
                      <span className="lo-cw-num">{label.top}</span>
                      <span className="lo-cw-year">{label.sub}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Object.entries(FAMILY_META).map(([id, { label, color }]) => (
              <tr key={id}>
                <td className="lo-metric-col" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 3 }}>
                  <span className="lo-metric-dot" style={{ background: color }} />
                  {label}
                </td>
                {allData.map((row, i) => {
                  const val = row[id];
                  const prev = i > 0 ? allData[i - 1][id] : null;
                  const pct = val != null && prev != null ? (val - prev) / prev * 100 : null;
                  const isHot = row.date === hoveredDate;
                  return (
                    <td key={row.date} className={`lo-cw-col${isHot ? ' highlighted' : ''}`} style={{ padding: '6px 4px' }}>
                      {val != null ? (
                        <>
                          <div className="lo-cell-value" style={{ fontSize: 12 }}>{val.toFixed(2)}</div>
                          {pct != null && (
                            <div style={{ fontSize: 10, color: pct > 0 ? '#e53935' : pct < 0 ? '#43a047' : '#aaa', marginTop: 1 }}>
                              {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
                            </div>
                          )}
                        </>
                      ) : '—'}
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

async function init() {
  const chartEl = document.querySelector('[data-testid="lane-rate-comparison-chart"]');
  if (!chartEl) return;

  chartEl.style.visibility = 'visible';
  // Fix container constraints that clip the chart
  chartEl.style.overflow = 'visible';
  chartEl.style.minHeight = '520px';
  // Also fix inner wrapper
  const inner = chartEl.querySelector('.emcwrd5');
  if (inner) inner.style.overflow = 'visible';

  chartEl.innerHTML = '<div class="lo-loading">Loading chart…</div>';

  let data;
  try {
    const res = await fetch('/api-data/lane-overview/metrics.json');
    data = await res.json();
  } catch (e) {
    chartEl.innerHTML = `<div class="lo-error">Failed to load chart data: ${e.message}</div>`;
    return;
  }

  const tableEl = document.querySelector('[data-testid="metric-overview-table"]');
  if (tableEl) tableEl.style.display = 'none';

  // Remove watermark
  document.querySelectorAll('.c1ocs50').forEach(el => { el.style.display = 'none'; });

  chartEl.innerHTML = '';
  chartEl.style.overflow = 'visible';
  createRoot(chartEl).render(<LaneOverviewChart allFamilies={getMetricFamilies(data)} />);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
