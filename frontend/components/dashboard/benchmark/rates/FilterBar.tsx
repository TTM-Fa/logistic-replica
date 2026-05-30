"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { ALL_CITIES } from "./mockData";

/**
 * FilterBar — controls the rate query (lane / period / frequency / metrics).
 *
 * v1 uses plain HTML <select> elements and chip buttons — no custom
 * dropdowns yet. The controls are fully wired so the parent component
 * (RatesOverview) can react to changes and re-render the chart + table.
 *
 * The component is purely "controlled" — all state lives in the parent.
 */

export type Frequency = "weekly" | "monthly" | "daily";
export type Period = "12w" | "6m" | "1y" | "2y";
export type MetricKey = "spot" | "contract" | "diesel" | "yours";

export const PERIOD_OPTIONS: { key: Period; labelKey: string }[] = [
  { key: "12w", labelKey: "rates.filter.period.12w" },
  { key: "6m",  labelKey: "rates.filter.period.6m" },
  { key: "1y",  labelKey: "rates.filter.period.1y" },
  { key: "2y",  labelKey: "rates.filter.period.2y" },
];

export const METRIC_OPTIONS: { key: MetricKey; labelKey: string; color: string; dashed?: boolean }[] = [
  { key: "spot",     labelKey: "rates.metric.spot",     color: "var(--d-accent)" },
  { key: "contract", labelKey: "rates.metric.contract", color: "#3B82F6" },
  { key: "diesel",   labelKey: "rates.metric.diesel",   color: "#22C55E" },
  { key: "yours",    labelKey: "rates.metric.yours",    color: "var(--d-text)", dashed: true },
];

export function FilterBar({
  fromCode,
  toCode,
  period,
  frequency,
  selectedMetrics,
  onFromChange,
  onToChange,
  onSwap,
  onPeriodChange,
  onFrequencyChange,
  onMetricsChange,
}: {
  fromCode: string;
  toCode: string;
  period: Period;
  frequency: Frequency;
  selectedMetrics: Set<MetricKey>;
  onFromChange: (code: string) => void;
  onToChange: (code: string) => void;
  onSwap: () => void;
  onPeriodChange: (p: Period) => void;
  onFrequencyChange: (f: Frequency) => void;
  onMetricsChange: (m: Set<MetricKey>) => void;
}) {
  const { t } = useLanguage();

  const toggleMetric = (key: MetricKey) => {
    const next = new Set(selectedMetrics);
    if (next.has(key)) {
      // Don't allow zero metrics — chart would be empty
      if (next.size > 1) next.delete(key);
    } else {
      next.add(key);
    }
    onMetricsChange(next);
  };

  return (
    <div className="bm-filterbar" aria-label="Rate filters">
      {/* Lane picker: From [city] ⇄ To [city] */}
      <div className="bm-filterbar__group">
        <label className="bm-filterbar__label">
          <T id="rates.filter.from" />
        </label>
        <select
          className="bm-filterbar__select"
          value={fromCode}
          onChange={(e) => onFromChange(e.target.value)}
          aria-label={t("rates.filter.from")}
        >
          {ALL_CITIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="bm-filterbar__swap"
        onClick={onSwap}
        aria-label={t("rates.filter.swap")}
        title={t("rates.filter.swap")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 4L3 8l4 4M21 8H3M17 20l4-4-4-4M3 16h18"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="bm-filterbar__group">
        <label className="bm-filterbar__label">
          <T id="rates.filter.to" />
        </label>
        <select
          className="bm-filterbar__select"
          value={toCode}
          onChange={(e) => onToChange(e.target.value)}
          aria-label={t("rates.filter.to")}
        >
          {ALL_CITIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Vertical divider */}
      <span className="bm-filterbar__sep" aria-hidden="true" />

      {/* Period — chip selector */}
      <div className="bm-filterbar__group">
        <label className="bm-filterbar__label">
          <T id="rates.filter.period" />
        </label>
        <div className="bm-filterbar__chips" role="radiogroup" aria-label={t("rates.filter.period")}>
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              role="radio"
              aria-checked={period === opt.key}
              className={`bm-filterbar__chip${period === opt.key ? " is-active" : ""}`}
              onClick={() => onPeriodChange(opt.key)}
            >
              <T id={opt.labelKey} />
            </button>
          ))}
        </div>
      </div>

      {/* Frequency dropdown */}
      <div className="bm-filterbar__group">
        <label className="bm-filterbar__label">
          <T id="rates.filter.frequency" />
        </label>
        <select
          className="bm-filterbar__select"
          value={frequency}
          onChange={(e) => onFrequencyChange(e.target.value as Frequency)}
          aria-label={t("rates.filter.frequency")}
        >
          <option value="daily"><T id="rates.frequency.daily" /></option>
          <option value="weekly"><T id="rates.frequency.weekly" /></option>
          <option value="monthly"><T id="rates.frequency.monthly" /></option>
        </select>
      </div>

      {/* Spacer pushes metrics to the far end */}
      <div className="bm-filterbar__spacer" />

      {/* Metric multi-select */}
      <div className="bm-filterbar__group">
        <label className="bm-filterbar__label">
          <T id="rates.filter.metrics" />
        </label>
        <div className="bm-filterbar__metrics" role="group" aria-label={t("rates.filter.metrics")}>
          {METRIC_OPTIONS.map((m) => {
            const checked = selectedMetrics.has(m.key);
            return (
              <button
                key={m.key}
                type="button"
                className={`bm-filterbar__metric${checked ? " is-on" : ""}`}
                onClick={() => toggleMetric(m.key)}
                aria-pressed={checked}
              >
                <span
                  className="bm-filterbar__metric-swatch"
                  style={{
                    background: checked ? m.color : "transparent",
                    borderColor: m.color,
                    borderStyle: m.dashed ? "dashed" : "solid",
                  }}
                  aria-hidden="true"
                />
                <T id={m.labelKey} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
