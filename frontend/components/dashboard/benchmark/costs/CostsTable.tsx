"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  COMPONENTS,
  totalAtQuarter,
  type ComponentKey,
  type QuarterLabel,
} from "./costsData";
import type { ViewMode } from "./ViewModeToggle";

/**
 * CostsTable — wide horizontal table below the stacked-area chart.
 *
 *   - Row 0: "Cost index" — total of all components per quarter
 *   - Rows 1..5: individual cost components, color-dotted
 *
 * Each cell stacks the value on top with the Q/Q percent change below.
 * Forecast quarters get a small "Forecast" tag in the column header so
 * the user can tell at a glance which side of the divider they're on.
 */
export function CostsTable({
  data,
  quarterLabels,
  viewMode,
}: {
  data: Record<ComponentKey, number[]>;
  quarterLabels: QuarterLabel[];
  viewMode: ViewMode;
}) {
  const { t } = useLanguage();

  // ── Compute totals row ──────────────────────────────────────────
  // In indexation: total = sum of components (the cost index).
  // In percentage: total is always 100% by construction.
  const totals = quarterLabels.map((_, i) =>
    viewMode === "percentage" ? 100 : totalAtQuarter(data, i),
  );

  const suffix = viewMode === "percentage" ? "%" : "";

  // Helper: format change cell — Q/Q (vs prior quarter in this same series)
  const changeCell = (value: number, prev: number | null) => {
    if (prev === null || prev === 0) return { text: "—", cls: "cst-table__change--flat" };
    const change = ((value - prev) / prev) * 100;
    const cls =
      change > 0.05 ? "cst-table__change--up"
        : change < -0.05 ? "cst-table__change--down"
          : "cst-table__change--flat";
    const sign = change > 0 ? "+" : "";
    return { text: `${sign}${change.toFixed(2)}%`, cls };
  };

  return (
    <div className="cst-table-wrap">
      <table className="cst-table">
        <thead>
          <tr>
            <th className="cst-table__metric-head" scope="col">
              <T id="costs.table.metric" />
            </th>
            {quarterLabels.map((q, i) => (
              <th key={i} className="cst-table__quarter-head" scope="col">
                <span className="cst-table__q">{q.short}</span>
                {q.isForecast && (
                  <span className="cst-table__forecast-tag">
                    <T id="costs.table.forecast" />
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Cost index row (totals) */}
          <tr className="cst-table__total-row">
            <th className="cst-table__metric-cell cst-table__total-cell" scope="row">
              <T id="costs.table.cost_index" />
            </th>
            {totals.map((value, i) => {
              const prev = i > 0 ? totals[i - 1] : null;
              const ch = changeCell(value, prev);
              return (
                <td key={i} className="cst-table__cell">
                  <span className="cst-table__value">
                    {value.toFixed(2)}{suffix}
                  </span>
                  <span className={`cst-table__change ${ch.cls}`}>{ch.text}</span>
                </td>
              );
            })}
          </tr>
          {/* One row per component */}
          {COMPONENTS.map((comp) => (
            <tr key={comp.key}>
              <th className="cst-table__metric-cell" scope="row">
                <span
                  className="cst-table__dot"
                  style={{ background: comp.color }}
                  aria-hidden="true"
                />
                <T id={comp.labelKey} />
              </th>
              {data[comp.key].map((value, i) => {
                const prev = i > 0 ? data[comp.key][i - 1] : null;
                const ch = changeCell(value, prev);
                return (
                  <td key={i} className="cst-table__cell">
                    <span className="cst-table__value">
                      {value.toFixed(2)}{suffix}
                    </span>
                    <span className={`cst-table__change ${ch.cls}`}>{ch.text}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="cst-table__caption">
        <T id={viewMode === "percentage" ? "costs.table.caption_pct" : "costs.table.caption_index"} />
      </p>
    </div>
  );
}
