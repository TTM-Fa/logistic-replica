"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * ViewModeToggle — small segmented control for switching between
 * the two visualisation modes on the Costs pages:
 *
 *   - "indexation":  absolute index values (default; stack sums to total cost index)
 *   - "percentage":  each component as % of the total (everything sums to 100%)
 *
 * Matches the toggle visible in the Insights "Market Costs" screenshots
 * (two icon buttons side by side, next to the period filter).
 */

export type ViewMode = "indexation" | "percentage";

export function ViewModeToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="cst-view-toggle" role="radiogroup" aria-label={t("costs.view.label")}>
      <button
        type="button"
        role="radio"
        aria-checked={value === "indexation"}
        className={`cst-view-toggle__btn${value === "indexation" ? " is-active" : ""}`}
        onClick={() => onChange("indexation")}
        title={t("costs.view.indexation")}
        aria-label={t("costs.view.indexation")}
      >
        {/* Bars icon = index values */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 19V9M12 19V5M19 19v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === "percentage"}
        className={`cst-view-toggle__btn${value === "percentage" ? " is-active" : ""}`}
        onClick={() => onChange("percentage")}
        title={t("costs.view.percentage")}
        aria-label={t("costs.view.percentage")}
      >
        {/* Percent symbol */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="2" />
          <path d="M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
