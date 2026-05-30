"use client";

/**
 * Lightweight inline-SVG chart components for the Rate Benchmark dashboard.
 *
 * Why SVG and not a chart library?
 *   - Tiny bundle. No d3, no recharts, no chart.js.
 *   - Themes "for free" via the parent's CSS variables (we use `currentColor`
 *     plus stroke colors set in CSS, so dark mode just works).
 *   - Easy to read, easy to tweak — every line is here.
 *
 * All charts are responsive: the SVG uses a `viewBox` so it scales to its
 * container width while preserving the aspect ratio.
 */

// ─── LineChart ──────────────────────────────────────────────────────────
//
// Multi-series line chart. Each series is a list of numeric Y values
// sampled at the same X-spacing (one value per period). The chart auto-
// scales the Y-axis to fit all series with a small padding above and below.

export type Series = {
  /** Display name shown in the legend (e.g. "Spot price") */
  name: string;
  /** Y values, equally spaced on the X axis (one per period) */
  values: number[];
  /** CSS stroke color for the line (e.g. "var(--d-accent)" or a hex) */
  color: string;
  /** Optional dashed style — useful for "your lane" overlays */
  dashed?: boolean;
};

export function LineChart({
  series,
  xLabels,
  yUnit = "",
  height = 240,
}: {
  series: Series[];
  /** Labels for the X axis (one per period). Length must match series.values */
  xLabels: string[];
  /** Unit shown next to Y-axis ticks, e.g. "QAR" */
  yUnit?: string;
  /** Pixel height — the SVG width is 100% (controlled by viewBox) */
  height?: number;
}) {
  // ── 1. Compute the global min/max across every series ─────────────
  const allValues = series.flatMap((s) => s.values);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  // Pad the range by ~8% top/bottom so lines don't kiss the chart edges
  const pad = (rawMax - rawMin) * 0.08 || 1;
  const yMin = Math.floor(rawMin - pad);
  const yMax = Math.ceil(rawMax + pad);
  const yRange = yMax - yMin || 1;

  // ── 2. Chart geometry inside the viewBox ──────────────────────────
  const VB_W = 800;
  const VB_H = 300;
  const PAD_L = 56; // left axis label space
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 32; // bottom for x labels
  const innerW = VB_W - PAD_L - PAD_R;
  const innerH = VB_H - PAD_T - PAD_B;

  const periods = xLabels.length;
  const xStep = innerW / Math.max(periods - 1, 1);

  // Convert (period index, value) → SVG (x, y)
  const x = (i: number) => PAD_L + i * xStep;
  const y = (v: number) => PAD_T + innerH - ((v - yMin) / yRange) * innerH;

  // ── 3. Y-axis grid lines + labels (5 ticks) ───────────────────────
  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const value = yMin + (yRange * i) / (tickCount - 1);
    return { value, y: y(value) };
  });

  // ── 4. X-axis labels — show every Nth so they don't overlap ───────
  const xLabelStride = Math.ceil(periods / 7);

  return (
    <div className="bm-chart-wrap" style={{ height }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="bm-chart"
        role="img"
        aria-label="Rate trend chart"
      >
        {/* Horizontal grid + Y-axis tick labels */}
        {ticks.map((t, i) => (
          <g key={i} className="bm-chart__grid">
            <line
              x1={PAD_L}
              x2={VB_W - PAD_R}
              y1={t.y}
              y2={t.y}
              stroke="currentColor"
              strokeOpacity="0.10"
              strokeDasharray={i === 0 ? "0" : "3 4"}
            />
            <text
              x={PAD_L - 8}
              y={t.y + 3}
              textAnchor="end"
              className="bm-chart__tick"
            >
              {Math.round(t.value)}
              {yUnit ? ` ${yUnit}` : ""}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map((label, i) =>
          i % xLabelStride === 0 || i === periods - 1 ? (
            <text
              key={i}
              x={x(i)}
              y={VB_H - 10}
              textAnchor="middle"
              className="bm-chart__tick"
            >
              {label}
            </text>
          ) : null,
        )}

        {/* One polyline per series */}
        {series.map((s, si) => {
          const points = s.values
            .map((v, i) => `${x(i)},${y(v)}`)
            .join(" ");
          return (
            <g key={si}>
              <polyline
                points={points}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeDasharray={s.dashed ? "6 4" : "0"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data points as small dots — only on the last value to keep
                  the chart calm; users can hover to see exact values via
                  the legend (no per-point tooltips in v1). */}
              <circle cx={x(periods - 1)} cy={y(s.values[periods - 1])} r="3" fill={s.color} />
            </g>
          );
        })}
      </svg>

      {/* Legend below the chart */}
      <div className="bm-chart__legend">
        {series.map((s) => (
          <span key={s.name} className="bm-chart__legend-item">
            <span
              className="bm-chart__legend-swatch"
              style={{
                background: s.color,
                borderStyle: s.dashed ? "dashed" : "solid",
              }}
              aria-hidden="true"
            />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── MiniBar ────────────────────────────────────────────────────────────
//
// A small horizontal bar — used in the lane comparison strip to show
// "market rate" as a filled bar with the buyer's own rate marked as a
// vertical line on top. Renders cleanly at small sizes.

export function MiniBar({
  marketValue,
  yourValue,
  max,
  unit = "QAR",
  color = "var(--d-accent)",
}: {
  /** The market median rate (the bar fill represents this) */
  marketValue: number;
  /** Your own rate (drawn as a vertical line marker) */
  yourValue: number;
  /** Scale ceiling — typically the max of all bars in the group */
  max: number;
  /** Unit label (e.g. "QAR") */
  unit?: string;
  /** Fill color for the market bar */
  color?: string;
}) {
  const marketPct = Math.min((marketValue / max) * 100, 100);
  const yourPct = Math.min((yourValue / max) * 100, 100);

  return (
    <div className="bm-bar" role="img" aria-label={`Market ${marketValue} ${unit}, you ${yourValue} ${unit}`}>
      <div className="bm-bar__track">
        <div
          className="bm-bar__fill"
          style={{ width: `${marketPct}%`, background: color }}
        />
        <div
          className="bm-bar__marker"
          style={{ left: `${yourPct}%` }}
          title={`Your rate: ${yourValue} ${unit}`}
        />
      </div>
    </div>
  );
}
