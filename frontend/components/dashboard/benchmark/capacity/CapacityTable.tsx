"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { METRICS, type MetricKey, type WeekLabel } from "./capacityData";

/**
 * CapacityTable — wide horizontal table mirroring the chart data,
 * with one row per visible metric and one column per calendar week.
 *
 * Each cell shows the value on top (e.g. "95.26") and the W/W percent
 * change below it in green/red (e.g. "+2.6%" / "−1.0%").
 *
 * Column headers stack the CW and the year (e.g. "CW36" over "2024").
 * The first column (metric name + color dot) is sticky on the left so
 * it stays visible while you scroll the table horizontally.
 */
export function CapacityTable({
  selectedMetrics,
  data,
  weekLabels,
}: {
  selectedMetrics: Set<MetricKey>;
  data: Record<MetricKey, number[]>;
  weekLabels: WeekLabel[];
}) {
  const { t } = useLanguage();
  const visibleMetrics = METRICS.filter((m) => selectedMetrics.has(m.key));

  if (visibleMetrics.length === 0) {
    return (
      <div className="cap-table-empty">
        <T id="capacity.table.empty" />
      </div>
    );
  }

  return (
    <div className="cap-table-wrap">
      <table className="cap-table">
        <thead>
          <tr>
            {/* Top-left header cell (sticky) */}
            <th className="cap-table__metric-head" scope="col">
              <T id="capacity.table.metric" />
            </th>
            {weekLabels.map((w, i) => (
              <th key={i} className="cap-table__week-head" scope="col">
                <span className="cap-table__cw">{w.cw}</span>
                <span className="cap-table__year">{w.year}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleMetrics.map((m) => (
            <tr key={m.key}>
              {/* Metric row label — sticky on the left edge */}
              <th className="cap-table__metric-cell" scope="row">
                <span
                  className="cap-table__dot"
                  style={{ background: m.color }}
                  aria-hidden="true"
                />
                <T id={m.labelKey} />
              </th>
              {/* Value + change cells */}
              {data[m.key].map((value, i) => {
                // W/W change vs the previous cell. The first cell has no prior
                // value, so we render "—" instead of a change.
                const prev = i > 0 ? data[m.key][i - 1] : null;
                const change =
                  prev !== null && prev !== 0 ? ((value - prev) / prev) * 100 : null;

                // Threshold of ±0.05% to call it "flat" — avoids noisy +0.0%
                let changeClass = "cap-table__change--flat";
                if (change !== null) {
                  if (change > 0.05) changeClass = "cap-table__change--up";
                  else if (change < -0.05) changeClass = "cap-table__change--down";
                }

                return (
                  <td key={i} className="cap-table__cell">
                    <span className="cap-table__value">
                      {value.toFixed(m.decimals)}
                      {m.yUnit === "%" ? "%" : ""}
                    </span>
                    <span className={`cap-table__change ${changeClass}`}>
                      {change === null
                        ? "—"
                        : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="cap-table__caption">
        <T id="capacity.table.caption" />
      </p>
    </div>
  );
}
