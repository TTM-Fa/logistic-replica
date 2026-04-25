/**
 * Lane Comparison chart injection — 2 lanes on one chart.
 */
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { COLORS, parseWeek, formatCW, formatCWFull, formatValue, getMetricFamilies, getMetrics, getDatapoints, metricLabel } from './shared.js';

const LINE_COLORS = [COLORS.lane1, COLORS.lane2];
const DATE_RANGE_WEEKS = { 'last-2-years': 104, 'last-13-months': 57, 'last-3-months': 13, 'custom': 104 };
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function aggregate(data, frequency, metricKeys) {
  if (frequency === 'Weekly') return data;
  const grouped = {};
  for (const row of data) {
    const { year, week } = parseWeek(row.date);
    const bucket = frequency === 'Monthly'
      ? `${year}-M${String(Math.ceil(week / 4.345)).padStart(2, '0')}`
      : `${year}-Q${Math.ceil(week / 13)}`;
    if (!grouped[bucket]) grouped[bucket] = { date: row.date, _n: 0, _bucket: bucket };
    for (const key of metricKeys) {
      if (row[key] != null) {
        grouped[bucket][key] = ((grouped[bucket][key] ?? 0) * grouped[bucket]._n + row[key]) / (grouped[bucket]._n + 1);
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

function CustomTooltip({ active, payload, label, lines }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="lo-tooltip">
      <div className="lo-tooltip-header">{formatCWFull(label)}</div>
      {payload.map((p, i) => (
        <div key={p.dataKey} className="lo-tooltip-row">
          <span className="lo-tooltip-dot" style={{ background: p.color }} />
          <span className="lo-tooltip-label">{lines[i]?.label ?? p.dataKey}</span>
          <span className="lo-tooltip-value">€{p.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function LaneComparisonChart({ allFamilies }) {
  const [hoveredDate, setHoveredDate] = useState(null);
  const [datePreset, setDatePreset] = useState('last-2-years');
  const [frequency, setFrequency] = useState('Weekly');
  const [region, setRegion] = useState({ from: 'DE', to: 'DE' });
  const scrollRef = useRef(null);
  const colWidth = 64;
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

  const spotFamily = allFamilies.find(f => f.metricFamilyId === 'spot-price');
  const metrics = getMetrics(spotFamily);

  const lines = metrics.map((m, i) => ({
    key: `lane${i}`, label: metricLabel(m), color: LINE_COLORS[i] ?? '#888',
  }));

  const rawData = useMemo(() => {
    const byDate = {};
    metrics.forEach((m, i) => {
      for (const [dateStr, value] of getDatapoints(m)) {
        if (!byDate[dateStr]) byDate[dateStr] = { date: dateStr };
        byDate[dateStr][`lane${i}`] = value;
      }
    });
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const allData = useMemo(() => {
    const sliced = rawData.slice(-(DATE_RANGE_WEEKS[datePreset] ?? 104));
    return aggregate(sliced, frequency, lines.map(l => l.key));
  }, [rawData, datePreset, frequency]);
  const hoveredRow = hoveredDate ? allData.find(r => r.date === hoveredDate) : null;

  useEffect(() => {
    if (!hoveredDate || !scrollRef.current) return;
    const idx = allData.findIndex(r => r.date === hoveredDate);
    if (idx < 0) return;
    const el = scrollRef.current;
    const target = idx * colWidth - (el.clientWidth - stickyWidth) / 2 + colWidth / 2;
    el.scrollLeft = Math.max(0, target);
  }, [hoveredDate, allData]);

  return (
    <div>
      <div style={{ height: 28, display: 'flex', alignItems: 'center', gap: 20, padding: '0 4px', fontSize: 12 }}>
        {hoveredRow ? (
          <>
            <span style={{ fontWeight: 600, color: '#333' }}>{formatCWFull(hoveredRow.date)}</span>
            {lines.map(({ key, label, color }) => hoveredRow[key] != null && (
              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                <span style={{ color: '#555' }}>{label}: <strong style={{ color: '#222' }}>€{hoveredRow[key].toFixed(2)}</strong></span>
              </span>
            ))}
          </>
        ) : <span style={{ color: '#bbb', fontSize: 11 }}>Hover over chart to see values</span>}
      </div>

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
                return <text x={props.x} y={props.y + 12} textAnchor="middle" fontSize={11} fill="#888">{label}</text>;
              }}
              interval={0} axisLine={{ stroke: '#e8e8e8' }} tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v.toFixed(2)}`} width={60} />
            <Tooltip content={<CustomTooltip lines={lines} />} cursor={{ stroke: '#ccc', strokeWidth: 1, strokeDasharray: '4 2' }} />
            <Legend
              layout="horizontal" align="right" verticalAlign="top" iconType="circle"
              formatter={v => <span style={{ color: '#555', fontSize: 12 }}>{lines.find(l => l.key === v)?.label ?? v}</span>}
              wrapperStyle={{ paddingBottom: 4 }}
            />
            {lines.map(({ key, color }) => (
              <Line key={key} type="monotone" dataKey={key} stroke={color} dot={false} strokeWidth={1.8} connectNulls
                isAnimationActive animationDuration={700} animationEasing="ease-out"
                activeDot={{ r: 4, strokeWidth: 0, fill: color }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div ref={scrollRef} style={{ overflowX: 'auto', marginTop: 16 }}>
        <table className="lo-table" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 160, minWidth: 160 }} />
            {allData.map(row => <col key={row.date} style={{ width: 64, minWidth: 64 }} />)}
          </colgroup>
          <thead>
            <tr>
              <th className="lo-metric-col" style={{ position: 'sticky', left: 0, zIndex: 4 }}>Lane</th>
              {allData.map(row => {
                const { week, year } = parseWeek(row.date);
                const label = frequency === 'Weekly'
                  ? { top: `CW ${week}`, sub: String(year) }
                  : frequency === 'Monthly'
                    ? { top: `M${row._bucket?.split('-M')[1] ?? ''}`, sub: row._bucket?.split('-')[0] }
                    : { top: row._bucket?.split('-')[1] ?? '', sub: row._bucket?.split('-')[0] };
                return (
                  <th key={row.date} className={`lo-cw-col${row.date === hoveredDate ? ' highlighted' : ''}`}>
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
            {lines.map(({ key, label, color }) => (
              <tr key={key}>
                <td className="lo-metric-col" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 3 }}>
                  <span className="lo-metric-dot" style={{ background: color }} />
                  {label}
                </td>
                {allData.map((row, i) => {
                  const val = row[key];
                  const prev = i > 0 ? allData[i - 1][key] : null;
                  const pct = val != null && prev != null ? (val - prev) / prev * 100 : null;
                  return (
                    <td key={row.date} className={`lo-cw-col${row.date === hoveredDate ? ' highlighted' : ''}`} style={{ padding: '6px 4px' }}>
                      {val != null ? (
                        <>
                          <div className="lo-cell-value" style={{ fontSize: 12 }}>{val.toFixed(2)}</div>
                          {pct != null && <div style={{ fontSize: 10, color: pct > 0 ? '#e53935' : pct < 0 ? '#43a047' : '#aaa', marginTop: 1 }}>{pct > 0 ? '+' : ''}{pct.toFixed(1)}%</div>}
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
  const chartEl = document.querySelector('[data-testid="lanes-comparison"]');
  if (!chartEl) return;
  chartEl.style.visibility = 'visible';
  chartEl.style.overflow = 'visible';
  chartEl.style.minHeight = '520px';
  chartEl.innerHTML = '<div class="lo-loading">Loading chart…</div>';

  let data;
  try {
    const res = await fetch('/api-data/lane-comparison/metrics.json');
    data = await res.json();
  } catch (e) {
    chartEl.innerHTML = `<div class="lo-error">Failed to load data: ${e.message}</div>`;
    return;
  }

  const tableEl = document.querySelector('[data-testid="spot-contract-overview-table"]');
  if (tableEl) tableEl.style.display = 'none';

  // Remove watermark
  document.querySelectorAll('.c1ocs50').forEach(el => { el.style.display = 'none'; });

  chartEl.innerHTML = '';
  chartEl.style.overflow = 'visible';
  createRoot(chartEl).render(<LaneComparisonChart allFamilies={getMetricFamilies(data)} />);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
