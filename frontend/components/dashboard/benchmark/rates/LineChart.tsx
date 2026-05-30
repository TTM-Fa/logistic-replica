"use client";

import { useMemo, useRef, useState } from "react";

/**
 * LineChart — multi-series SVG time-series chart with hover tooltip
 * and a clickable legend to toggle series visibility.
 *
 * Why hand-rolled SVG instead of a chart library?
 *   - Zero bundle bloat. No d3, no recharts, no chart.js.
 *   - Theme-aware "for free" via CSS variables (we use `currentColor` +
 *     stroke colors passed in via props).
 *   - Every line is here — easy to tweak any behavior.
 *
 * Inputs:
 *   - `series`: list of named, colored numeric series (all same length)
 *   - `xLabels`: one label per X position (typically calendar weeks)
 *   - `yUnit`:   unit shown next to Y-axis ticks, e.g. "QAR"
 *   - `height`:  pixel height of the chart area (width fills container)
 */

export type Series = {
  /** Stable identifier — also shown in the legend */
  name: string;
  /** Y values, one per X position (must match xLabels.length) */
  values: number[];
  /** Stroke color — accepts CSS variables, e.g. "var(--d-accent)" or hex */
  color: string;
  /** Optional dashed line, used for "your rate" overlays */
  dashed?: boolean;
};

export function LineChart({
  series,
  xLabels,
  yUnit = "",
  height = 320,
}: {
  series: Series[];
  xLabels: string[];
  yUnit?: string;
  height?: number;
}) {
  // ── Legend state: which series are currently HIDDEN ────────────────
  // Default: all series visible. Clicking a legend item toggles its
  // membership in this set.
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const visible = useMemo(
    () => series.filter((s) => !hidden.has(s.name)),
    [series, hidden],
  );

  // ── Hover state: which X-index the user is hovering over ─────────
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // ── Chart geometry ────────────────────────────────────────────────
  // We use a fixed viewBox so calculations are simple; the SVG scales
  // to its container via `preserveAspectRatio="none"`.
  const VB_W = 1000;
  const VB_H = 360;
  const PAD_L = 64;
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 36;
  const innerW = VB_W - PAD_L - PAD_R;
  const innerH = VB_H - PAD_T - PAD_B;

  const periods = xLabels.length;
  const xStep = periods > 1 ? innerW / (periods - 1) : 0;

  // ── Y-axis scale (computed from VISIBLE series only) ─────────────
  // We pad by ~8% top and bottom so lines don't kiss the chart edges.
  const { yMin, yMax, yRange } = useMemo(() => {
    if (visible.length === 0) return { yMin: 0, yMax: 1, yRange: 1 };
    const all = visible.flatMap((s) => s.values);
    const rawMin = Math.min(...all);
    const rawMax = Math.max(...all);
    const pad = (rawMax - rawMin) * 0.08 || 1;
    const lo = Math.floor(rawMin - pad);
    const hi = Math.ceil(rawMax + pad);
    return { yMin: lo, yMax: hi, yRange: hi - lo || 1 };
  }, [visible]);

  // ── Coordinate helpers ────────────────────────────────────────────
  const x = (i: number) => PAD_L + i * xStep;
  const y = (v: number) => PAD_T + innerH - ((v - yMin) / yRange) * innerH;

  // ── Y-axis ticks (5 evenly spaced) ────────────────────────────────
  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount }, (_, i) => {
    const value = yMin + (yRange * i) / (tickCount - 1);
    return { value, y: y(value) };
  });

  // ── X-axis labels — show every Nth so they don't overlap ─────────
  const xLabelStride = Math.max(1, Math.ceil(periods / 9));

  // ── Mouse tracking → nearest X index ──────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || periods === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    // Convert the cursor's pixel position to viewBox X coordinate
    const xPxToVb = (e.clientX - rect.left) * (VB_W / rect.width);
    const dataX = (xPxToVb - PAD_L) / xStep;
    const i = Math.max(0, Math.min(periods - 1, Math.round(dataX)));
    setHoverIndex(i);
  };
  const handleMouseLeave = () => setHoverIndex(null);

  // ── Toggle a series on/off via legend click ──────────────────────
  const toggleSeries = (name: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  // ── Build polyline points string per series ──────────────────────
  const polyPoints = (s: Series) =>
    s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  return (
    <div className="bm-chart">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="bm-chart__svg"
        style={{ height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label="Rate trend chart"
      >
        {/* Horizontal grid lines + Y-axis tick labels */}
        {yTicks.map((t, i) => (
          <g key={i}>
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
              y={t.y + 4}
              textAnchor="end"
              className="bm-chart__tick"
            >
              {Math.round(t.value).toLocaleString()}
              {yUnit ? ` ${yUnit}` : ""}
            </text>
          </g>
        ))}

        {/* X-axis labels — sampled every Nth */}
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

        {/* One polyline per visible series */}
        {visible.map((s) => (
          <polyline
            key={s.name}
            points={polyPoints(s)}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeDasharray={s.dashed ? "6 4" : "0"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Hover guide: vertical line + dot per visible series at the hovered X */}
        {hoverIndex !== null && (
          <g>
            <line
              x1={x(hoverIndex)}
              x2={x(hoverIndex)}
              y1={PAD_T}
              y2={PAD_T + innerH}
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="1"
            />
            {visible.map((s) => (
              <circle
                key={s.name}
                cx={x(hoverIndex)}
                cy={y(s.values[hoverIndex])}
                r="4"
                fill={s.color}
                stroke="var(--d-bg-card)"
                strokeWidth="2"
              />
            ))}
          </g>
        )}
      </svg>

      {/* Floating tooltip — positioned via CSS using the hover index ratio */}
      {hoverIndex !== null && visible.length > 0 && (
        <div
          className="bm-chart__tooltip"
          style={{
            // Position: from the left edge of the chart area, follow the
            // hovered point. Cap at 80% so it never escapes off the right.
            left: `${Math.min(95, ((x(hoverIndex) / VB_W) * 100))}%`,
          }}
        >
          <div className="bm-chart__tooltip-label">{xLabels[hoverIndex]}</div>
          <div className="bm-chart__tooltip-rows">
            {visible.map((s) => (
              <div key={s.name} className="bm-chart__tooltip-row">
                <span
                  className="bm-chart__tooltip-swatch"
                  style={{ background: s.color }}
                  aria-hidden="true"
                />
                <span className="bm-chart__tooltip-name">{s.name}</span>
                <span className="bm-chart__tooltip-value">
                  {s.values[hoverIndex].toLocaleString()}
                  {yUnit ? ` ${yUnit}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend — each item is a clickable toggle */}
      <div className="bm-chart__legend">
        {series.map((s) => {
          const isHidden = hidden.has(s.name);
          return (
            <button
              key={s.name}
              type="button"
              className={`bm-chart__legend-item${isHidden ? " is-hidden" : ""}`}
              onClick={() => toggleSeries(s.name)}
              aria-pressed={!isHidden}
              title={isHidden ? `Show ${s.name}` : `Hide ${s.name}`}
            >
              <span
                className="bm-chart__legend-swatch"
                style={{
                  background: s.color,
                  borderStyle: s.dashed ? "dashed" : "solid",
                }}
                aria-hidden="true"
              />
              <span className="bm-chart__legend-name">{s.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
