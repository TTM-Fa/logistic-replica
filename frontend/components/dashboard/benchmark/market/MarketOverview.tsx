"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { LineChart, type Series } from "../rates/LineChart";
import { KPIStrip } from "./KPIStrip";
import { MarketTable } from "./MarketTable";
import {
  METRICS,
  REGIONS,
  generateMonthLabels,
  getMarketData,
  type MetricKey,
} from "./marketData";

/**
 * MarketOverview — page at /dashboard/benchmark/market/overview.
 *
 * Top-down (matches the Insights "Markets" screenshot):
 *   1. Header: page title with inline Help + fullscreen toggle
 *   2. Filter bar: Period · Frequency · Country · Export · Add to dashboard
 *   3. KPI strip: 5 metric cards with current value + M/M + YoY changes
 *   4. Chart card: time-series of all 5 metrics overlaid, monthly cadence
 *   5. Data table: rows per metric, columns per month, value + % change cells
 *
 * The chart's legend is clickable (inherited from LineChart) so the user
 * can toggle metrics on/off; the data table follows the same visibility
 * set so chart and table always agree.
 */

type Period = "1y" | "2y" | "all";
type Frequency = "weekly" | "monthly";

const PERIOD_OPTIONS: { key: Period; months: number; labelKey: string }[] = [
  { key: "1y",  months: 12, labelKey: "market.filter.period.1y" },
  { key: "2y",  months: 24, labelKey: "market.filter.period.2y" },
  { key: "all", months: 24, labelKey: "market.filter.period.all" },
];

export function MarketOverview() {
  const { t } = useLanguage();

  // ── Filter state ─────────────────────────────────────────────────
  const [region, setRegion] = useState("GCC");
  const [period, setPeriod] = useState<Period>("2y");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  // Which metrics are visible in the chart + table. Default: all 5 on.
  const [visibleMetrics, setVisibleMetrics] = useState<Set<MetricKey>>(
    new Set<MetricKey>(METRICS.map((m) => m.key)),
  );

  // ── Data + labels ────────────────────────────────────────────────
  const allData = useMemo(() => getMarketData(region), [region]);
  const allMonthLabels = useMemo(() => generateMonthLabels(), []);

  // ── Slice for period ─────────────────────────────────────────────
  const periodCfg = PERIOD_OPTIONS.find((p) => p.key === period)!;
  const sliceStart = Math.max(0, allMonthLabels.length - periodCfg.months);
  const monthLabels = useMemo(
    () => allMonthLabels.slice(sliceStart),
    [allMonthLabels, sliceStart],
  );
  const slicedData = useMemo(() => {
    const out = {} as Record<MetricKey, number[]>;
    (Object.keys(allData) as MetricKey[]).forEach((k) => {
      out[k] = allData[k].slice(sliceStart);
    });
    return out;
  }, [allData, sliceStart]);

  // ── Build the chart series ─────────────────────────────────────
  const chartSeries: Series[] = useMemo(() => {
    return METRICS.filter((m) => visibleMetrics.has(m.key)).map((m) => ({
      name: t(m.labelKey),
      color: m.color,
      values: slicedData[m.key],
    }));
  }, [visibleMetrics, slicedData, t]);

  const xLabels = monthLabels.map((m) =>
    m.short === "Jan" ? `${m.short} '${String(m.year).slice(-2)}` : m.short,
  );

  const regionName = REGIONS.find((r) => r.code === region)?.name ?? region;

  return (
    <div className="ro-page mk-page">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title cap-title">
            <T id="market.title" />
            <button type="button" className="cap-help-btn" aria-label={t("market.help")} title={t("market.help")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </h1>
          <p className="ro-header__sub"><T id="market.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action" title={t("market.action.fullscreen")}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="market.action.fullscreen" /></span>
          </button>
        </div>
      </header>

      {/* ─── Filter bar (Insights pill layout) ────────────────── */}
      <div className="cap-filterbar" aria-label={t("market.filters")}>
        {/* Period */}
        <div className="cap-filterbar__pill">
          <select
            className="cap-filterbar__pill-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            aria-label={t("market.filter.period")}
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p.key} value={p.key}>{t(p.labelKey)}</option>
            ))}
          </select>
        </div>

        {/* Frequency */}
        <div className="cap-filterbar__pill">
          <select
            className="cap-filterbar__pill-select"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as Frequency)}
            aria-label={t("market.filter.frequency")}
          >
            <option value="monthly">{t("market.frequency.monthly")}</option>
            <option value="weekly">{t("market.frequency.weekly")}</option>
          </select>
        </div>

        {/* Country */}
        <div className="cap-filterbar__pill">
          <label className="cap-filterbar__pill-label">
            <T id="market.filter.country" />:
          </label>
          <select
            className="cap-filterbar__pill-select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            aria-label={t("market.filter.country")}
          >
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>{r.name}</option>
            ))}
          </select>
        </div>

        <div className="cap-filterbar__spacer" />

        {/* Export */}
        <button type="button" className="cap-filterbar__export">
          <T id="market.action.export" />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Add to dashboard — saves the current view to My Reports */}
        <button type="button" className="mk-add-to-dash">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <T id="market.action.add_to_dashboard" />
        </button>
      </div>

      {/* ─── 5-KPI strip ─────────────────────────────────────── */}
      <KPIStrip data={slicedData} />

      {/* ─── Chart card ──────────────────────────────────────── */}
      <section className="ro-card cap-chart-card" aria-label={t("market.chart.aria")}>
        <header className="cap-chart-header">
          <p className="cap-chart-hint"><T id="market.chart.hint" /></p>
          <div className="cap-chart-meta">
            <span className="cap-chart-meta__lane">{regionName}</span>
            <span className="cap-chart-meta__period">· {t(periodCfg.labelKey)}</span>
          </div>
        </header>
        <LineChart
          series={chartSeries}
          xLabels={xLabels}
          yUnit=""
          height={380}
        />
      </section>

      {/* ─── Data table ──────────────────────────────────────── */}
      <MarketTable
        visibleMetrics={visibleMetrics}
        data={slicedData}
        monthLabels={monthLabels}
      />
    </div>
  );
}
