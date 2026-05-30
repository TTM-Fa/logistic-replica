"use client";

import { useMemo, useRef, useState } from "react";

/**
 * ForecastChart — purpose-built chart for the Rates → Forecast page.
 *
 * What it shows:
 *   - The historical spot-price series (solid gold line)
 *   - The forecast extension (dashed gold line) attached to the end of history
 *   - A shaded confidence band around the forecast (cone of uncertainty)
 *   - A vertical "Now" marker at the boundary between history and forecast
 *
 * Hover tracking shows a tooltip with the exact value at the hovered week
 * plus the band's upper/lower bounds when hovering inside the forecast region.
 *
 * Like the other chart in this module, hand-rolled SVG — no chart library.
 */

export function ForecastChart({
  history,
  forecast,
  upper,
  lower,
  historyLabels,
  forecastLabels,
  yUnit = "QAR",
  height = 360,
}: {
  history: number[];
  forecast: number[];
  upper: number[];
  lower: number[];
  historyLabels: string[];
  forecastLabels: string[];
  yUnit?: string;
  height?: number;
}) {
  // ── Build a single combined timeline so X-axis math is straightforward ──
  // The "now" boundary sits between the last history index and the first
  // forecast index. Conceptually it's at index = history.length - 1 + 0.5,
  // but we just draw it on the integer boundary.
  const allLabels = useMemo(
    () => [...historyLabels, ...forecastLabels],
    [historyLabels, forecastLabels],
  );
  const periods = allLabels.length;
  const historyEnd = history.length - 1; // last historical index
  const forecastStart = history.length;  // first forecast index

  // Combined Y arrays — history values for history indices, forecast values
  // for forecast indices. We thread the last history value into the first
  // forecast point so the dashed line attaches cleanly.
  const mainValues = useMemo(() => [...history, ...forecast], [history, forecast]);
  // Bands only exist over the forecast range; left side is null
  const upperFull = useMemo(
    () => [...Array(history.length).fill(null), ...upper] as (number | null)[],
    [history.length, upper],
  );
  const lowerFull = useMemo(
    () => [...Array(history.length).fill(null), ...lower] as (number | null)[],
    [history.length, lower],
  );

  // ── Chart geometry ────────────────────────────────────────────────
  const VB_W = 1000;
  const VB_H = 360;
  const PAD_L = 64;
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 36;
  const innerW = VB_W - PAD_L - PAD_R;
  const innerH = VB_H - PAD_T - PAD_B;
  const xStep = periods > 1 ? innerW / (periods - 1) : 0;

  // ── Y scale (covers main values AND the upper/lower band) ────────
  const { yMin, yMax, yRange } = useMemo(() => {
    const all = [
      ...mainValues,
      ...upper,
      ...lower,
    ];
    const rawMin = Math.min(...all);
    const rawMax = Math.max(...all);
    const pad = (rawMax - rawMin) * 0.08 || 1;
    const lo = Math.floor(rawMin - pad);
    const hi = Math.ceil(rawMax + pad);
    return { yMin: lo, yMax: hi, yRange: hi - lo || 1 };
  }, [mainValues, upper, lower]);

  const x = (i: number) => PAD_L + i * xStep;
  const y = (v: number) => PAD_T + innerH - ((v - yMin) / yRange) * innerH;

  // Y-axis ticks
  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount }, (_, i) => {
    const value = yMin + (yRange * i) / (tickCount - 1);
    return { value, y: y(value) };
  });

  // X-axis labels — sparse
  const xLabelStride = Math.max(1, Math.ceil(periods / 9));

  // ── Confidence band polygon: upper-forward then lower-backward ───
  const bandPoints = useMemo(() => {
    const pts: string[] = [];
    // Walk upper side forward, including the last history point so the band
    // starts cleanly at "now"
    pts.push(`${x(historyEnd)},${y(history[history.length - 1])}`);
    for (let i = 0; i < upper.length; i++) {
      pts.push(`${x(forecastStart + i)},${y(upper[i])}`);
    }
    // Walk lower side backward back to "now"
    for (let i = lower.length - 1; i >= 0; i--) {
      pts.push(`${x(forecastStart + i)},${y(lower[i])}`);
    }
    pts.push(`${x(historyEnd)},${y(history[history.length - 1])}`);
    return pts.join(" ");
  }, [history, upper, lower, historyEnd, forecastStart]);

  // ── Polylines: solid history, dashed forecast ────────────────────
  const historyLine = history.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const forecastLine = [
    `${x(historyEnd)},${y(history[history.length - 1])}`,
    ...forecast.map((v, i) => `${x(forecastStart + i)},${y(v)}`),
  ].join(" ");

  // ── Hover ────────────────────────────────────────────────────────
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || periods === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xPxToVb = (e.clientX - rect.left) * (VB_W / rect.width);
    const dataX = (xPxToVb - PAD_L) / xStep;
    setHoverIndex(Math.max(0, Math.min(periods - 1, Math.round(dataX))));
  };
  const isInForecast = hoverIndex !== null && hoverIndex >= forecastStart;
  const hoveredValue =
    hoverIndex !== null ? mainValues[hoverIndex] : null;
  const hoveredUpper =
    hoverIndex !== null && isInForecast
      ? upperFull[hoverIndex]
      : null;
  const hoveredLower =
    hoverIndex !== null && isInForecast
      ? lowerFull[hoverIndex]
      : null;

  return (
    <div className="bm-chart">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="bm-chart__svg"
        style={{ height }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
        role="img"
        aria-label="Spot rate forecast chart"
      >
        {/* Grid + Y-axis ticks */}
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
            <text x={PAD_L - 8} y={t.y + 4} textAnchor="end" className="bm-chart__tick">
              {Math.round(t.value).toLocaleString()} {yUnit}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {allLabels.map((label, i) =>
          i % xLabelStride === 0 || i === periods - 1 ? (
            <text key={i} x={x(i)} y={VB_H - 10} textAnchor="middle" className="bm-chart__tick">
              {label}
            </text>
          ) : null,
        )}

        {/* Confidence band — gold fill at low opacity */}
        <polygon
          points={bandPoints}
          fill="var(--d-accent)"
          fillOpacity="0.14"
        />

        {/* History line — solid gold */}
        <polyline
          points={historyLine}
          fill="none"
          stroke="var(--d-accent)"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Forecast line — dashed gold */}
        <polyline
          points={forecastLine}
          fill="none"
          stroke="var(--d-accent)"
          strokeWidth="2.25"
          strokeDasharray="6 5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* "Now" vertical marker */}
        <line
          x1={x(historyEnd)}
          x2={x(historyEnd)}
          y1={PAD_T}
          y2={PAD_T + innerH}
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeDasharray="3 4"
        />
        <text
          x={x(historyEnd) + 6}
          y={PAD_T + 14}
          className="bm-chart__tick"
          style={{ fill: "var(--d-text-muted)", fontWeight: 700 }}
        >
          NOW
        </text>

        {/* Hover guide */}
        {hoverIndex !== null && (
          <g>
            <line
              x1={x(hoverIndex)}
              x2={x(hoverIndex)}
              y1={PAD_T}
              y2={PAD_T + innerH}
              stroke="currentColor"
              strokeOpacity="0.25"
            />
            <circle
              cx={x(hoverIndex)}
              cy={y(mainValues[hoverIndex])}
              r="4"
              fill="var(--d-accent)"
              stroke="var(--d-bg-card)"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {hoverIndex !== null && hoveredValue !== null && (
        <div
          className="bm-chart__tooltip"
          style={{ left: `${Math.min(95, (x(hoverIndex) / VB_W) * 100)}%` }}
        >
          <div className="bm-chart__tooltip-label">
            {allLabels[hoverIndex]} {isInForecast ? "· FORECAST" : ""}
          </div>
          <div className="bm-chart__tooltip-rows">
            <div className="bm-chart__tooltip-row">
              <span
                className="bm-chart__tooltip-swatch"
                style={{ background: "var(--d-accent)" }}
              />
              <span className="bm-chart__tooltip-name">
                {isInForecast ? "Predicted" : "Spot"}
              </span>
              <span className="bm-chart__tooltip-value">
                {hoveredValue.toLocaleString()} {yUnit}
              </span>
            </div>
            {isInForecast && hoveredUpper !== null && hoveredLower !== null && (
              <div className="bm-chart__tooltip-row">
                <span
                  className="bm-chart__tooltip-swatch"
                  style={{ background: "var(--d-accent)", opacity: 0.4 }}
                />
                <span className="bm-chart__tooltip-name">Range</span>
                <span className="bm-chart__tooltip-value">
                  {hoveredLower.toLocaleString()} – {hoveredUpper.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
