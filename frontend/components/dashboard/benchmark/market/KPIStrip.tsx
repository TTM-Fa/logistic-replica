"use client";

import { T } from "@/lib/T";
import { METRICS, computeKpiStats, type MetricKey } from "./marketData";

/**
 * KPIStrip — the 5 metric cards shown above the Market Overview chart.
 *
 * Each card shows:
 *   - Metric label
 *   - Big current value
 *   - Two stacked change indicators: M/M (vs last month) + YoY
 *
 * Convention used everywhere: price/cost UP = bad for buyer = red,
 * DOWN = good for buyer = green. Capacity index is reversed (high
 * capacity = loose market = good for buyer), but we leave the coloring
 * the same since both interpretations are valid; the user reads the
 * direction with the metric in mind.
 */
export function KPIStrip({
  data,
}: {
  data: Record<MetricKey, number[]>;
}) {
  return (
    <div className="mk-kpis" role="group" aria-label="Market indices">
      {METRICS.map((metric) => {
        const stats = computeKpiStats(data[metric.key]);
        return (
          <article key={metric.key} className="mk-kpi" style={{ "--mk-kpi-color": metric.color } as React.CSSProperties}>
            <span className="mk-kpi__label">
              <span className="mk-kpi__dot" aria-hidden="true" />
              <T id={metric.labelKey} />
            </span>
            <span className="mk-kpi__value">{stats.current.toFixed(2)}</span>
            <div className="mk-kpi__deltas">
              <ChangeRow abs={stats.momAbs} pct={stats.momPct} period="market.kpi.mom" />
              <ChangeRow abs={stats.yoyAbs} pct={stats.yoyPct} period="market.kpi.yoy" />
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ─── One row inside the deltas stack ────────────────────────────────
function ChangeRow({
  abs,
  pct,
  period,
}: {
  abs: number;
  pct: number;
  period: string;
}) {
  const dirClass =
    pct > 0.05 ? "is-up" : pct < -0.05 ? "is-down" : "is-flat";
  const sign = abs >= 0 ? "+" : "";
  return (
    <span className={`mk-kpi__change ${dirClass}`}>
      <span className="mk-kpi__change-val">
        {sign}{abs.toFixed(2)}
      </span>
      <span className="mk-kpi__change-pct">
        / {sign}{pct.toFixed(2)}%
      </span>
      <span className="mk-kpi__change-period">
        <T id={period} />
      </span>
    </span>
  );
}
