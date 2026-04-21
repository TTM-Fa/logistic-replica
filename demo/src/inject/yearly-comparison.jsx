/**
 * Yearly Comparison chart injection.
 * X-axis = ISO week number (1–53), one line per year.
 * 2022 is skipped (<5 pts). 2026 (current partial year) shown as dashed.
 */
import { createRoot } from 'react-dom/client';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { COLORS, parseWeek, formatValue, getMetricFamilies, getMetrics, getDatapoints } from './shared.js';

const YEAR_COLORS = {
  2022: COLORS.year2022, 2023: COLORS.year2023, 2024: COLORS.year2024,
  2025: COLORS.year2025, 2026: COLORS.year2026,
};
const CURRENT_YEAR = new Date().getFullYear();
const MIN_POINTS = 5; // skip years with fewer data points

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const items = payload.filter(p => p.value != null).sort((a, b) => b.value - a.value);
  return (
    <div className="lo-tooltip">
      <div className="lo-tooltip-header">CW {label}</div>
      {items.map(p => (
        <div key={p.dataKey} className="lo-tooltip-row">
          <span className="lo-tooltip-dot" style={{ background: p.color }} />
          <span className="lo-tooltip-label">{p.name}</span>
          <span className="lo-tooltip-value">€{p.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function YearlyComparisonChart({ allFamilies }) {
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const [selectedYears, setSelectedYears] = useState(null); // null = all years
  const [region, setRegion] = useState({ from: 'DE', to: 'DE' });
  const scrollRef = useRef(null);
  const colWidth = 64;
  const stickyWidth = 80;

  const spotFamily = allFamilies.find(f => f.metricFamilyId === 'spot-price');
  const dps = getDatapoints(getMetrics(spotFamily)[0]);

  useEffect(() => {
    const onYears = e => setSelectedYears(e.detail.years);
    const onRegion = e => setRegion(prev => ({
      ...prev,
      [e.detail.field]: e.detail.code,
    }));
    document.addEventListener('tpr:years', onYears);
    document.addEventListener('tpr:region', onRegion);
    return () => {
      document.removeEventListener('tpr:years', onYears);
      document.removeEventListener('tpr:region', onRegion);
    };
  }, []);

  const { years, chartData } = useMemo(() => {
    const byYear = {};
    for (const [dateStr, value] of dps) {
      const { year, week } = parseWeek(dateStr);
      if (!byYear[year]) byYear[year] = {};
      byYear[year][week] = value;
    }

    // Filter out years with too few data points, then apply user selection
    const years = Object.keys(byYear)
      .map(Number)
      .filter(y => Object.keys(byYear[y]).length >= MIN_POINTS)
      .filter(y => selectedYears == null || selectedYears.includes(y))
      .sort();

    const allWeeks = [...new Set(
      years.flatMap(y => Object.keys(byYear[y]).map(Number))
    )].sort((a, b) => a - b);

    const chartData = allWeeks.map(week => {
      const row = { week };
      for (const year of years) {
        if (byYear[year]?.[week] != null) row[year] = byYear[year][week];
      }
      return row;
    });

    return { years, chartData, byYear };
  }, [selectedYears]);

  const tableData = chartData;
  const hoveredRow = hoveredWeek != null ? chartData.find(r => r.week === hoveredWeek) : null;

  useEffect(() => {
    if (hoveredWeek == null || !scrollRef.current) return;
    const idx = tableData.findIndex(r => r.week === hoveredWeek);
    if (idx < 0) return;
    const el = scrollRef.current;
    const target = idx * colWidth - (el.clientWidth - stickyWidth) / 2 + colWidth / 2;
    el.scrollLeft = Math.max(0, target);
  }, [hoveredWeek]);

  return (
    <div>
      <div style={{ height: 28, display: 'flex', alignItems: 'center', gap: 20, padding: '0 4px', fontSize: 12 }}>
        {hoveredRow ? (
          <>
            <span style={{ fontWeight: 600, color: '#333' }}>CW {hoveredRow.week}</span>
            {years.map(year => hoveredRow[year] != null && (
              <span key={year} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: YEAR_COLORS[year] ?? '#888', display: 'inline-block' }} />
                <span style={{ color: '#555' }}>{year}: <strong style={{ color: '#222' }}>€{hoveredRow[year].toFixed(2)}</strong></span>
              </span>
            ))}
          </>
        ) : <span style={{ color: '#bbb', fontSize: 11 }}>Hover over chart to see values</span>}
      </div>

      <div style={{ width: '100%', height: 420 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            onMouseMove={s => s?.activeLabel != null && setHoveredWeek(Number(s.activeLabel))}
            onMouseLeave={() => setHoveredWeek(null)}
          >
            <CartesianGrid stroke="#eee" vertical={false} />
            <XAxis
              dataKey="week"
              tickFormatter={w => `CW ${w}`}
              tick={{ fontSize: 11, fill: '#888' }}
              interval={7}
              axisLine={{ stroke: '#e8e8e8' }}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v.toFixed(2)}`} width={60} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ccc', strokeWidth: 1, strokeDasharray: '4 2' }} />
            <Legend
              layout="horizontal" align="right" verticalAlign="top" iconType="circle"
              formatter={v => <span style={{ color: '#555', fontSize: 12 }}>{v}</span>}
              wrapperStyle={{ paddingBottom: 4 }}
            />
            {years.map(year => (
              <Line
                key={year}
                type="monotone"
                dataKey={year}
                name={String(year)}
                stroke={YEAR_COLORS[year] ?? '#888'}
                dot={false}
                strokeWidth={year === CURRENT_YEAR ? 2.2 : 1.8}
                strokeDasharray={year === CURRENT_YEAR ? '6 3' : undefined}
                connectNulls
                isAnimationActive
                animationDuration={700}
                animationEasing="ease-out"
                activeDot={{ r: 4, strokeWidth: 0, fill: YEAR_COLORS[year] ?? '#888' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table — last 20 weeks, all years */}
      <div ref={scrollRef} style={{ overflowX: 'auto', marginTop: 16 }}>
        <table className="lo-table" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 80, minWidth: 80 }} />
            {tableData.map(row => <col key={row.week} style={{ width: 64, minWidth: 64 }} />)}
          </colgroup>
          <thead>
            <tr>
              <th className="lo-metric-col" style={{ position: 'sticky', left: 0, zIndex: 4 }}>Year</th>
              {tableData.map(row => (
                <th key={row.week} className={`lo-cw-col${hoveredWeek === row.week ? ' highlighted' : ''}`}>
                  <span className="lo-cw-num">CW {row.week}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map(year => (
              <tr key={year}>
                <td className="lo-metric-col" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 3 }}>
                  <span className="lo-metric-dot" style={{ background: YEAR_COLORS[year] ?? '#888' }} />
                  {year}
                </td>
                {tableData.map((row, i) => {
                  const val = row[year];
                  const prev = i > 0 ? tableData[i - 1][year] : null;
                  const pct = val != null && prev != null ? (val - prev) / prev * 100 : null;
                  return (
                    <td key={row.week} className={`lo-cw-col${hoveredWeek === row.week ? ' highlighted' : ''}`} style={{ padding: '6px 4px' }}>
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
  const chartEl = document.querySelector('[data-testid="yearly-comparison"]');
  if (!chartEl) return;
  chartEl.style.visibility = 'visible';
  chartEl.style.overflow = 'visible';
  chartEl.style.minHeight = '520px';
  chartEl.innerHTML = '<div class="lo-loading">Loading chart…</div>';

  let data;
  try {
    const res = await fetch('/api-data/yearly-comparison/metrics.json');
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
  createRoot(chartEl).render(<YearlyComparisonChart allFamilies={getMetricFamilies(data)} />);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
