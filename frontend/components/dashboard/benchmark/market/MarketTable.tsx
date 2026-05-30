"use client";

import { T } from "@/lib/T";
import { METRICS, type MetricKey, type MonthLabel } from "./marketData";

/**
 * MarketTable — wide horizontal table mirroring the chart data.
 *
 * One row per visible metric; one column per month. Each cell shows the
 * value on top and the month-over-month percent change below it in
 * green/red. First column (metric name + color dot) sticks on the left
 * while the user scrolls through months.
 */
export function MarketTable({
  visibleMetrics,
  data,
  monthLabels,
}: {
  visibleMetrics: Set<MetricKey>;
  data: Record<MetricKey, number[]>;
  monthLabels: MonthLabel[];
}) {
  const rows = METRICS.filter((m) => visibleMetrics.has(m.key));

  if (rows.length === 0) {
    return (
      <div className="mk-table-empty">
        <T id="market.table.empty" />
      </div>
    );
  }

  return (
    <div className="mk-table-wrap">
      <table className="mk-table">
        <thead>
          <tr>
            <th className="mk-table__metric-head" scope="col">
              <T id="market.table.metric" />
            </th>
            {monthLabels.map((m, i) => (
              <th key={i} className="mk-table__month-head" scope="col">
                <span className="mk-table__month">{m.short}</span>
                <span className="mk-table__year">{m.year}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((metric) => (
            <tr key={metric.key}>
              <th className="mk-table__metric-cell" scope="row">
                <span
                  className="mk-table__dot"
                  style={{ background: metric.color }}
                  aria-hidden="true"
                />
                <T id={metric.labelKey} />
              </th>
              {data[metric.key].map((value, i) => {
                const prev = i > 0 ? data[metric.key][i - 1] : null;
                const change =
                  prev !== null && prev !== 0
                    ? ((value - prev) / prev) * 100
                    : null;
                let changeClass = "mk-table__change--flat";
                if (change !== null) {
                  if (change > 0.05) changeClass = "mk-table__change--up";
                  else if (change < -0.05) changeClass = "mk-table__change--down";
                }
                return (
                  <td key={i} className="mk-table__cell">
                    <span className="mk-table__value">{value.toFixed(2)}</span>
                    <span className={`mk-table__change ${changeClass}`}>
                      {change === null
                        ? "—"
                        : `${change > 0 ? "+" : ""}${change.toFixed(2)}%`}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mk-table__caption">
        <T id="market.table.caption" />
      </p>
    </div>
  );
}
