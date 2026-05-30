"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { LineChart, type Series } from "../rates/LineChart";
import { CapacityTable } from "./CapacityTable";
import { MetricsDropdown } from "./MetricsDropdown";
import {
  COUNTRIES,
  METRICS,
  generateCapacityWeekLabels,
  getCapacityData,
  getMetric,
  type MetricKey,
} from "./capacityData";

/**
 * Capacity — main page at /dashboard/benchmark/capacity.
 *
 * Top-down structure (matches the screenshot Taha provided):
 *   1. Header strip: page title with inline Help icon + fullscreen toggle
 *   2. Filter bar:   From / ⇄ swap / To / Period / Frequency / Metrics ▾ / Export
 *   3. Chart card:   "Hover over chart to see values" hint, then the
 *                    multi-series LineChart with the selected metrics
 *   4. Data table:   wide horizontal table with value + W/W % change cells
 */

type Period = "12w" | "6m" | "1y" | "2y";
type Frequency = "weekly" | "monthly" | "daily";

const PERIOD_OPTIONS: { key: Period; weeks: number; labelKey: string }[] = [
  { key: "12w", weeks: 12,  labelKey: "capacity.filter.period.12w" },
  { key: "6m",  weeks: 26,  labelKey: "capacity.filter.period.6m" },
  { key: "1y",  weeks: 52,  labelKey: "capacity.filter.period.1y" },
  { key: "2y",  weeks: 104, labelKey: "capacity.filter.period.2y" },
];

export function Capacity() {
  const { t } = useLanguage();

  // ── Filter state ─────────────────────────────────────────────────
  const [fromCountry, setFromCountry] = useState("QA");
  const [toCountry, setToCountry]     = useState("SA");
  const [period, setPeriod]           = useState<Period>("2y");
  const [frequency, setFrequency]     = useState<Frequency>("weekly");
  // Two defaults so the chart isn't empty on first paint
  const [selectedMetrics, setSelectedMetrics] = useState<Set<MetricKey>>(
    new Set<MetricKey>(["capacity_index", "spot_price_index"]),
  );

  // ── Data + week labels ───────────────────────────────────────────
  const allData = useMemo(
    () => getCapacityData(fromCountry, toCountry),
    [fromCountry, toCountry],
  );
  const allWeekLabels = useMemo(() => generateCapacityWeekLabels(), []);

  // ── Slice to selected period ─────────────────────────────────────
  const periodCfg = PERIOD_OPTIONS.find((p) => p.key === period)!;
  const sliceStart = Math.max(0, allWeekLabels.length - periodCfg.weeks);
  const weekLabels = useMemo(
    () => allWeekLabels.slice(sliceStart),
    [allWeekLabels, sliceStart],
  );
  const slicedData = useMemo(() => {
    const out = {} as Record<MetricKey, number[]>;
    (Object.keys(allData) as MetricKey[]).forEach((k) => {
      out[k] = allData[k].slice(sliceStart);
    });
    return out;
  }, [allData, sliceStart]);

  // ── Build chart series from selected metrics ─────────────────────
  const chartSeries: Series[] = useMemo(() => {
    return METRICS.filter((m) => selectedMetrics.has(m.key)).map((m) => ({
      name: t(m.labelKey),
      color: m.color,
      values: slicedData[m.key],
    }));
  }, [selectedMetrics, slicedData, t]);

  const xLabels = weekLabels.map((w) => w.cw);

  const handleSwap = () => {
    const tmp = fromCountry;
    setFromCountry(toCountry);
    setToCountry(tmp);
  };

  const fromCountryName = COUNTRIES.find((c) => c.code === fromCountry)?.name ?? fromCountry;
  const toCountryName   = COUNTRIES.find((c) => c.code === toCountry)?.name   ?? toCountry;

  return (
    <div className="ro-page">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title cap-title">
            <T id="capacity.title" />
            <button
              type="button"
              className="cap-help-btn"
              aria-label={t("capacity.help")}
              title={t("capacity.help")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                <path
                  d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </h1>
          <p className="ro-header__sub">
            <T id="capacity.sub" />
          </p>
        </div>
        <div className="ro-header__actions" role="toolbar" aria-label={t("capacity.actions")}>
          <button
            type="button"
            className="ro-action"
            title={t("capacity.action.fullscreen")}
            aria-label={t("capacity.action.fullscreen")}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
              <path
                d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ro-action__label">
              <T id="capacity.action.fullscreen" />
            </span>
          </button>
        </div>
      </header>

      {/* ─── Filter bar (matches the Insights screenshot layout) ──── */}
      <div className="cap-filterbar" aria-label={t("capacity.filters")}>
        {/* From */}
        <div className="cap-filterbar__pill">
          <label className="cap-filterbar__pill-label">
            <T id="capacity.filter.from" />:
          </label>
          <select
            className="cap-filterbar__pill-select"
            value={fromCountry}
            onChange={(e) => setFromCountry(e.target.value)}
            aria-label={t("capacity.filter.from")}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Swap */}
        <button
          type="button"
          className="cap-filterbar__swap"
          onClick={handleSwap}
          aria-label={t("capacity.filter.swap")}
          title={t("capacity.filter.swap")}
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

        {/* To */}
        <div className="cap-filterbar__pill">
          <label className="cap-filterbar__pill-label">
            <T id="capacity.filter.to" />:
          </label>
          <select
            className="cap-filterbar__pill-select"
            value={toCountry}
            onChange={(e) => setToCountry(e.target.value)}
            aria-label={t("capacity.filter.to")}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Period */}
        <div className="cap-filterbar__pill">
          <select
            className="cap-filterbar__pill-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            aria-label={t("capacity.filter.period")}
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p.key} value={p.key}>
                {t(p.labelKey)}
              </option>
            ))}
          </select>
        </div>

        {/* Frequency */}
        <div className="cap-filterbar__pill">
          <select
            className="cap-filterbar__pill-select"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as Frequency)}
            aria-label={t("capacity.filter.frequency")}
          >
            <option value="daily">{t("capacity.frequency.daily")}</option>
            <option value="weekly">{t("capacity.frequency.weekly")}</option>
            <option value="monthly">{t("capacity.frequency.monthly")}</option>
          </select>
        </div>

        {/* Metrics — categorized multi-select dropdown */}
        <MetricsDropdown selected={selectedMetrics} onSave={setSelectedMetrics} />

        {/* Spacer pushes Export to the far right */}
        <div className="cap-filterbar__spacer" />

        {/* Export */}
        <button
          type="button"
          className="cap-filterbar__export"
          aria-label={t("capacity.action.export")}
        >
          <T id="capacity.action.export" />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ─── Chart ──────────────────────────────────────────────── */}
      <section className="ro-card cap-chart-card" aria-label={t("capacity.chart.aria")}>
        <header className="cap-chart-header">
          <p className="cap-chart-hint">
            <T id="capacity.chart.hint" />
          </p>
          <div className="cap-chart-meta">
            <span className="cap-chart-meta__lane">
              {fromCountryName} → {toCountryName}
            </span>
            <span className="cap-chart-meta__period">
              · {t(periodCfg.labelKey)}
            </span>
          </div>
        </header>
        {chartSeries.length > 0 ? (
          <LineChart series={chartSeries} xLabels={xLabels} yUnit="" height={360} />
        ) : (
          <div className="cap-chart-empty">
            <T id="capacity.chart.empty" />
          </div>
        )}
      </section>

      {/* ─── Data table ─────────────────────────────────────────── */}
      <CapacityTable
        selectedMetrics={selectedMetrics}
        data={slicedData}
        weekLabels={weekLabels}
      />
    </div>
  );
}
