"use client";

import { useMemo, useRef, useState } from "react";

/**
 * StackedAreaChart — Insights-style stacked area visualization for the
 * Costs pages. 5 series stacked vertically, with a distinct "Forecast"
 * region on the right side (dashed divider + "Forecast" label).
 *
 * Hand-rolled SVG so we don't depend on a charting library; gives us
 * full control over forecast visuals and matches our lean bundle.
 *
 * Hover anywhere on the chart → vertical guide line at the nearest
 * quarter + a floating tooltip listing each series' value at that
 * quarter plus the running total.
 *
 * The legend at the bottom is clickable to toggle individual series
 * (their layer disappears from the stack — others restack).
 */

export type StackSeries = {
  /** Display name (also shown in the legend) */
  name: string;
  /** Numeric values, one per X position (same length as xLabels) */
  values: number[];
  /** Fill color for the stacked layer */
  color: string;
};

interface Props {
  series: StackSeries[];
  xLabels: string[];
  /** Index where the forecast region begins (0-based) */
  forecastStartIndex: number;
  /** Suffix shown next to Y-axis ticks and tooltip values ("%" or "") */
  yUnit?: string;
  /** Chart pixel height (width fills the container) */
  height?: number;
  /** Optional render the total value next to a series name in tooltip */
  showTotalInTooltip?: boolean;
}

export function StackedAreaChart({
  series,
  xLabels,
  forecastStartIndex,
  yUnit = "",
  height = 360,
  showTotalInTooltip = true,
}: Props) {
  // ── Legend / visibility state ────────────────────────────────────
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const visible = useMemo(
    () => series.filter((s) => !hidden.has(s.name)),
    [series, hidden],
  );

  // ── Hover state ──────────────────────────────────────────────────
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // ── Geometry ─────────────────────────────────────────────────────
  const VB_W = 1000;
  const VB_H = 360;
  const PAD_L = 56;
  const PAD_R = 16;
  const PAD_T = 28; // a bit more on top for the "Forecast" label
  const PAD_B = 36;
  const innerW = VB_W - PAD_L - PAD_R;
  const innerH = VB_H - PAD_T - PAD_B;
  const periods = xLabels.length;
  const xStep = periods > 1 ? innerW / (periods - 1) : 0;

  // ── Compute stacked cumulative values per X position ─────────────
  // stackTops[s][i] = top of layer s at index i = sum of values of
  // layers 0..s. stackBottoms[s][i] = same but for s-1 (or 0 for s=0).
  const { stackTops, stackBottoms, yMax } = useMemo(() => {
    const tops: number[][] = [];
    const bottoms: number[][] = [];
    let runningTotal = new Array(periods).fill(0);
    for (let s = 0; s < visible.length; s++) {
      const layerBottom = runningTotal.slice();
      const layerTop = layerBottom.map((b, i) => b + visible[s].values[i]);
      bottoms.push(layerBottom);
      tops.push(layerTop);
      runningTotal = layerTop;
    }
    const max = runningTotal.reduce((m, v) => Math.max(m, v), 0) || 1;
    return { stackTops: tops, stackBottoms: bottoms, yMax: max };
  }, [visible, periods]);

  // ── Coordinate helpers ───────────────────────────────────────────
  const x = (i: number) => PAD_L + i * xStep;
  const y = (v: number) => PAD_T + innerH - (v / yMax) * innerH;

  // ── Y-axis ticks (5 evenly spaced) ──────────────────────────────
  const tickCount = 5;
  const yTicks = useMemo(
    () =>
      Array.from({ length: tickCount }, (_, i) => {
        const value = (yMax * i) / (tickCount - 1);
        return { value, y: y(value) };
      }),
    [yMax],
  );

  // ── X-axis label sampling ──────────────────────────────────────
  const xLabelStride = Math.max(1, Math.ceil(periods / 12));

  // ── Hover tracking ─────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || periods === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xPxToVb = (e.clientX - rect.left) * (VB_W / rect.width);
    const dataX = (xPxToVb - PAD_L) / xStep;
    const i = Math.max(0, Math.min(periods - 1, Math.round(dataX)));
    setHoverIndex(i);
  };
  const handleMouseLeave = () => setHoverIndex(null);

  const toggleSeries = (name: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  // ── Build polygon path for each layer ──────────────────────────
  const buildPolygon = (layerIdx: number) => {
    const tops = stackTops[layerIdx];
    const bottoms = stackBottoms[layerIdx];
    const topPoints = tops.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const botPoints = bottoms
      .map((v, i) => `${x(i)},${y(v)}`)
      .reverse()
      .join(" ");
    return `${topPoints} ${botPoints}`;
  };

  // ── Forecast divider position ──────────────────────────────────
  const forecastX = forecastStartIndex >= 0 && forecastStartIndex < periods
    ? x(forecastStartIndex)
    : null;

  // ── Tooltip data ───────────────────────────────────────────────
  const tooltipTotal = useMemo(() => {
    if (hoverIndex === null) return 0;
    return visible.reduce((sum, s) => sum + s.values[hoverIndex], 0);
  }, [hoverIndex, visible]);

  // Q/Q change for total
  const tooltipQoQ = useMemo(() => {
    if (hoverIndex === null || hoverIndex === 0) return null;
    const prevTotal = visible.reduce((sum, s) => sum + s.values[hoverIndex - 1], 0);
    return prevTotal !== 0 ? ((tooltipTotal - prevTotal) / prevTotal) * 100 : null;
  }, [hoverIndex, visible, tooltipTotal]);

  return (
    <div className="cst-chart">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="cst-chart__svg"
        style={{ height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label="Cost components stacked area chart"
      >
        {/* Y-axis grid + tick labels */}
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
              className="cst-chart__tick"
            >
              {Math.round(t.value)}
              {yUnit ? ` ${yUnit}` : ""}
            </text>
          </g>
        ))}

        {/* Stacked area layers (drawn bottom→top so top layer is on top) */}
        {visible.map((s, layerIdx) => (
          <g key={s.name}>
            <polygon
              points={buildPolygon(layerIdx)}
              fill={s.color}
              fillOpacity="0.78"
              stroke={s.color}
              strokeWidth="1.2"
              strokeOpacity="0.9"
            />
          </g>
        ))}

        {/* Forecast region indicator: vertical dashed line + light overlay */}
        {forecastX !== null && (
          <g>
            {/* Light shaded overlay over the forecast area */}
            <rect
              x={forecastX}
              y={PAD_T}
              width={VB_W - PAD_R - forecastX}
              height={innerH}
              fill="currentColor"
              fillOpacity="0.06"
            />
            {/* Vertical dashed divider */}
            <line
              x1={forecastX}
              x2={forecastX}
              y1={PAD_T}
              y2={PAD_T + innerH}
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            {/* "Forecast" label at top, just right of the divider */}
            <text
              x={forecastX + 8}
              y={PAD_T - 8}
              className="cst-chart__forecast-label"
            >
              Forecast
            </text>
          </g>
        )}

        {/* X-axis labels (sampled) */}
        {xLabels.map((label, i) =>
          i % xLabelStride === 0 || i === periods - 1 ? (
            <text
              key={i}
              x={x(i)}
              y={VB_H - 10}
              textAnchor="middle"
              className="cst-chart__tick"
            >
              {label}
            </text>
          ) : null,
        )}

        {/* Hover guide line */}
        {hoverIndex !== null && (
          <line
            x1={x(hoverIndex)}
            x2={x(hoverIndex)}
            y1={PAD_T}
            y2={PAD_T + innerH}
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        )}
      </svg>

      {/* Floating tooltip */}
      {hoverIndex !== null && visible.length > 0 && (
        <div
          className="cst-chart__tooltip"
          style={{
            left: `${Math.min(95, (x(hoverIndex) / VB_W) * 100)}%`,
          }}
        >
          <div className="cst-chart__tooltip-label">
            {xLabels[hoverIndex]}
            {forecastStartIndex >= 0 && hoverIndex >= forecastStartIndex && (
              <span className="cst-chart__tooltip-forecast">· Forecast</span>
            )}
          </div>
          {showTotalInTooltip && (
            <div className="cst-chart__tooltip-total">
              <span className="cst-chart__tooltip-name">Cost index</span>
              <span className="cst-chart__tooltip-value">
                {tooltipTotal.toFixed(2)}
                {yUnit ? ` ${yUnit}` : ""}
                {tooltipQoQ !== null && (
                  <span
                    className={
                      tooltipQoQ > 0
                        ? "cst-chart__tooltip-qoq is-up"
                        : tooltipQoQ < 0
                          ? "cst-chart__tooltip-qoq is-down"
                          : "cst-chart__tooltip-qoq"
                    }
                  >
                    ({tooltipQoQ > 0 ? "+" : ""}
                    {tooltipQoQ.toFixed(2)}%)
                  </span>
                )}
              </span>
            </div>
          )}
          <div className="cst-chart__tooltip-rows">
            {visible.map((s) => {
              const v = s.values[hoverIndex];
              return (
                <div key={s.name} className="cst-chart__tooltip-row">
                  <span
                    className="cst-chart__tooltip-swatch"
                    style={{ background: s.color }}
                    aria-hidden="true"
                  />
                  <span className="cst-chart__tooltip-name">{s.name}</span>
                  <span className="cst-chart__tooltip-value">
                    {v.toFixed(2)}
                    {yUnit ? ` ${yUnit}` : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend (clickable to toggle each layer) */}
      <div className="cst-chart__legend">
        {series.map((s) => {
          const isHidden = hidden.has(s.name);
          return (
            <button
              key={s.name}
              type="button"
              className={`cst-chart__legend-item${isHidden ? " is-hidden" : ""}`}
              onClick={() => toggleSeries(s.name)}
              aria-pressed={!isHidden}
              title={isHidden ? `Show ${s.name}` : `Hide ${s.name}`}
            >
              <span
                className="cst-chart__legend-swatch"
                style={{ background: s.color }}
                aria-hidden="true"
              />
              <span className="cst-chart__legend-name">{s.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
