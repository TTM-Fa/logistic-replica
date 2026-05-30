"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { CostsTable } from "./CostsTable";
import { StackedAreaChart, type StackSeries } from "./StackedAreaChart";
import { ViewModeToggle, type ViewMode } from "./ViewModeToggle";
import {
  COMPONENTS,
  COUNTRIES,
  FORECAST_COUNT,
  generateQuarterLabels,
  getCostsData,
  toPercentageData,
  type ComponentKey,
} from "./costsData";

/**
 * MarketCosts — pan-GCC view at /dashboard/benchmark/costs/market.
 *
 * Filter bar: Period · View mode (indexation/percentage) · Country · Export
 * Chart:      Stacked-area of 5 cost components over 20 quarters
 *             (4 final quarters labelled "Forecast")
 * Table:      Cost index total row + 5 component rows × 20 quarters
 *
 * "View mode" toggles between indexation (absolute, default) and
 * percentage (each component as share of total).
 */

type Period = "1y" | "2y" | "5y";

const PERIOD_OPTIONS: { key: Period; quarters: number; labelKey: string }[] = [
  { key: "1y", quarters: 4,  labelKey: "costs.filter.period.1y" },
  { key: "2y", quarters: 8,  labelKey: "costs.filter.period.2y" },
  { key: "5y", quarters: 20, labelKey: "costs.filter.period.5y" },
];

export function MarketCosts() {
  const { t } = useLanguage();

  const [country, setCountry] = useState("GCC");
  const [period, setPeriod] = useState<Period>("5y");
  const [viewMode, setViewMode] = useState<ViewMode>("indexation");

  // ── Pull base data + labels ────────────────────────────────────
  const allData = useMemo(() => getCostsData(country), [country]);
  const allQuarterLabels = useMemo(() => generateQuarterLabels(), []);

  // ── Slice for selected period ─────────────────────────────────
  const periodCfg = PERIOD_OPTIONS.find((p) => p.key === period)!;
  const sliceStart = Math.max(0, allQuarterLabels.length - periodCfg.quarters);
  const quarterLabels = useMemo(
    () => allQuarterLabels.slice(sliceStart),
    [allQuarterLabels, sliceStart],
  );
  const slicedData = useMemo(() => {
    const out = {} as Record<ComponentKey, number[]>;
    (Object.keys(allData) as ComponentKey[]).forEach((k) => {
      out[k] = allData[k].slice(sliceStart);
    });
    return out;
  }, [allData, sliceStart]);

  // ── Apply view mode: percentage normalises per quarter ─────────
  const viewData = useMemo(
    () => (viewMode === "percentage" ? toPercentageData(slicedData) : slicedData),
    [viewMode, slicedData],
  );

  // ── Build chart series from current view data ──────────────────
  const chartSeries: StackSeries[] = useMemo(
    () =>
      COMPONENTS.map((c) => ({
        name: t(c.labelKey),
        color: c.color,
        values: viewData[c.key],
      })),
    [viewData, t],
  );

  // Forecast starts at quarterLabels.length - FORECAST_COUNT (clamped)
  const forecastStartIndex = Math.max(0, quarterLabels.length - FORECAST_COUNT);

  const xLabels = quarterLabels.map((q) => q.short);
  const countryName = COUNTRIES.find((c) => c.code === country)?.name ?? country;

  return (
    <div className="ro-page cst-page">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title cap-title">
            <T id="costs.market.title" />
            <button type="button" className="cap-help-btn" aria-label={t("costs.help")} title={t("costs.help")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </h1>
          <p className="ro-header__sub"><T id="costs.market.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action" title={t("costs.action.fullscreen")}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="costs.action.fullscreen" /></span>
          </button>
        </div>
      </header>

      {/* ─── Filter bar ───────────────────────────────────────── */}
      <div className="cap-filterbar">
        {/* Period */}
        <div className="cap-filterbar__pill">
          <select
            className="cap-filterbar__pill-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            aria-label={t("costs.filter.period")}
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p.key} value={p.key}>{t(p.labelKey)}</option>
            ))}
          </select>
        </div>

        {/* View mode (indexation / percentage) */}
        <ViewModeToggle value={viewMode} onChange={setViewMode} />

        {/* Country */}
        <div className="cap-filterbar__pill">
          <label className="cap-filterbar__pill-label">
            <T id="costs.filter.country" />:
          </label>
          <select
            className="cap-filterbar__pill-select"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label={t("costs.filter.country")}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="cap-filterbar__spacer" />

        {/* Export */}
        <button type="button" className="cap-filterbar__export">
          <T id="costs.action.export" />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ─── Chart card ───────────────────────────────────────── */}
      <section className="ro-card cap-chart-card" aria-label={t("costs.chart.aria")}>
        <header className="cap-chart-header">
          <p className="cap-chart-hint"><T id="costs.chart.hint" /></p>
          <div className="cap-chart-meta">
            <span className="cap-chart-meta__lane">{countryName}</span>
            <span className="cap-chart-meta__period">· {t(periodCfg.labelKey)}</span>
          </div>
        </header>
        <StackedAreaChart
          series={chartSeries}
          xLabels={xLabels}
          forecastStartIndex={forecastStartIndex}
          yUnit={viewMode === "percentage" ? "%" : ""}
          height={380}
        />
      </section>

      {/* ─── Data table ───────────────────────────────────────── */}
      <CostsTable
        data={viewData}
        quarterLabels={quarterLabels}
        viewMode={viewMode}
      />
    </div>
  );
}
