"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  ALL_CITIES,
  LANES,
  generateWeekLabels,
  getRateSeriesForLane,
} from "./mockData";
import {
  FilterBar,
  METRIC_OPTIONS,
  type Frequency,
  type MetricKey,
  type Period,
} from "./FilterBar";
import { LineChart, type Series } from "./LineChart";
import { RateTable } from "./RateTable";

/**
 * RatesOverview — the main analytical page at
 * /dashboard/benchmark/rates/overview.
 *
 * Layout (top → bottom):
 *   1. Page header: title + sub + action row (Help / Fullscreen /
 *      Export / Add to dashboard — all placeholder buttons in v1)
 *   2. Filter bar: lane (from / swap / to), period, frequency,
 *      metric multi-select
 *   3. Chart card: multi-series time-series chart with hover tooltip
 *      and clickable legend
 *   4. Data table: same series as the chart, in tabular form
 *
 * All filter state lives here in this component so changes immediately
 * re-render both the chart and the table.
 */

export function RatesOverview() {
  const { t } = useLanguage();

  // ── Filter state ──────────────────────────────────────────────────
  const [fromCode, setFromCode] = useState("DOH");
  const [toCode, setToCode] = useState("RUH");
  const [period, setPeriod] = useState<Period>("1y");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [selectedMetrics, setSelectedMetrics] = useState<Set<MetricKey>>(
    new Set(["spot", "contract", "diesel", "yours"]),
  );

  // ── Resolve the lane key from from/to ────────────────────────────
  // If the user picks a combo that has no matching mock lane, we fall
  // back to the first lane so the chart always shows something.
  const laneKey = useMemo(() => {
    const exact = LANES.find((l) => l.fromCode === fromCode && l.toCode === toCode);
    if (exact) return exact.key;
    return LANES[0].key;
  }, [fromCode, toCode]);

  const fromCity = ALL_CITIES.find((c) => c.code === fromCode)?.name ?? fromCode;
  const toCity = ALL_CITIES.find((c) => c.code === toCode)?.name ?? toCode;

  // ── Pull series + week labels for the current lane ───────────────
  const allWeekLabels = useMemo(() => generateWeekLabels(), []);
  const allSeries = useMemo(() => getRateSeriesForLane(laneKey), [laneKey]);

  // ── Period → how many weeks to show (slice off the end) ──────────
  const periodWeeks: Record<Period, number> = {
    "12w": 12,
    "6m": 26,
    "1y": 52,
    "2y": 104,
  };
  const shownCount = Math.min(periodWeeks[period], allWeekLabels.length);
  const sliceStart = allWeekLabels.length - shownCount;

  // ── Build the chart input — only selected metrics, sliced to period ──
  const chartSeries: Series[] = useMemo(() => {
    return METRIC_OPTIONS
      .filter((m) => selectedMetrics.has(m.key))
      .map((m) => ({
        name: t(`rates.metric.${m.key}`),
        color: m.color,
        dashed: m.dashed,
        values: allSeries[m.key].slice(sliceStart),
      }));
  }, [allSeries, selectedMetrics, sliceStart, t]);

  const xLabels = useMemo(
    () => allWeekLabels.slice(sliceStart).map((w) => w.cw),
    [allWeekLabels, sliceStart],
  );

  // ── Swap from↔to ─────────────────────────────────────────────────
  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  return (
    <div className="ro-page">
      {/* ─── Page header: title + action row ───────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title">
            <T id="rates.overview.title" />
          </h1>
          <p className="ro-header__sub">
            <T id="rates.overview.sub" />
          </p>
        </div>
        <div className="ro-header__actions" role="toolbar" aria-label="Page actions">
          <ActionButton id="rates.action.help" title={t("rates.action.help")}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ActionButton>
          <ActionButton id="rates.action.fullscreen" title={t("rates.action.fullscreen")}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
              <path
                d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ActionButton>
          <ActionButton id="rates.action.export" title={t("rates.action.export")}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
              <path
                d="M12 4v12M7 11l5 5 5-5M5 20h14"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ActionButton>
          <ActionButton id="rates.action.pin" title={t("rates.action.pin")} primary>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </ActionButton>
        </div>
      </header>

      {/* ─── Filter bar ─────────────────────────────────────────── */}
      <FilterBar
        fromCode={fromCode}
        toCode={toCode}
        period={period}
        frequency={frequency}
        selectedMetrics={selectedMetrics}
        onFromChange={setFromCode}
        onToChange={setToCode}
        onSwap={handleSwap}
        onPeriodChange={setPeriod}
        onFrequencyChange={setFrequency}
        onMetricsChange={setSelectedMetrics}
      />

      {/* ─── Chart card ─────────────────────────────────────────── */}
      <section className="ro-card" aria-label="Rate trend chart">
        <header className="ro-card__header">
          <div>
            <span className="ro-card__eyebrow">
              <T id="rates.chart.eyebrow" />
            </span>
            <h2 className="ro-card__heading">
              {fromCity} → {toCity}
            </h2>
            <p className="ro-card__sub">
              {chartSeries.length} {chartSeries.length === 1 ? "metric" : "metrics"} ·{" "}
              {shownCount} weeks shown ·{" "}
              <T id={`rates.frequency.${frequency}`} />
            </p>
          </div>
        </header>
        <LineChart series={chartSeries} xLabels={xLabels} yUnit="QAR" />
      </section>

      {/* ─── Data table ─────────────────────────────────────────── */}
      <section className="ro-card" aria-label="Rate data table">
        <header className="ro-card__header">
          <div>
            <span className="ro-card__eyebrow">
              <T id="rates.table.eyebrow" />
            </span>
            <h2 className="ro-card__heading">
              <T id="rates.table.heading" />
            </h2>
            <p className="ro-card__sub">
              <T id="rates.table.sub" />
            </p>
          </div>
        </header>
        <RateTable series={chartSeries} xLabels={xLabels} yUnit="QAR" />
      </section>
    </div>
  );
}

// ─── Action button (used in the header toolbar) ─────────────────────
function ActionButton({
  id,
  title,
  primary,
  children,
}: {
  id: string;
  title: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`ro-action${primary ? " is-primary" : ""}`}
      title={title}
      aria-label={title}
    >
      {children}
      <span className="ro-action__label">
        <T id={id} />
      </span>
    </button>
  );
}
