"use client";

import type { Series } from "./LineChart";

/**
 * RateTable — wide horizontal table mirroring the chart data.
 *
 * Each row is a metric (Spot, Contract, etc.) shown with its color
 * swatch. Each column is a calendar week. With ~104 weeks the table
 * scrolls horizontally — the first column (metric name) stays sticky
 * on the left so you always know what row you're reading.
 *
 * The "more info" popover trigger and per-cell tooltips live in
 * future passes — v1 is just the numbers.
 */
export function RateTable({
  series,
  xLabels,
  yUnit = "QAR",
}: {
  series: Series[];
  xLabels: string[];
  yUnit?: string;
}) {
  if (series.length === 0) {
    return (
      <div className="bm-table-empty">
        Select at least one metric to see data.
      </div>
    );
  }

  return (
    <div className="bm-table-wrap">
      <table className="bm-table">
        <thead>
          <tr>
            <th className="bm-table__metric-head" scope="col">
              Metric
            </th>
            {xLabels.map((label, i) => (
              <th key={i} className="bm-table__week-head" scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {series.map((s) => (
            <tr key={s.name}>
              {/* Metric name cell — sticky on the left during horizontal scroll */}
              <th className="bm-table__metric-cell" scope="row">
                <span
                  className="bm-table__swatch"
                  style={{
                    background: s.color,
                    borderStyle: s.dashed ? "dashed" : "solid",
                  }}
                  aria-hidden="true"
                />
                {s.name}
              </th>
              {/* Numeric value per week */}
              {s.values.map((v, i) => (
                <td key={i} className="bm-table__cell">
                  {v.toLocaleString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="bm-table__unit">
        Values shown in {yUnit} per trip. Scroll horizontally to see all weeks.
      </p>
    </div>
  );
}
