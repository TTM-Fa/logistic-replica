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
import { LineChart, type Series } from "./LineChart";

/**
 * RatesSpotVsContract — page at /dashboard/benchmark/rates/spot-vs-contract.
 *
 * Compares the spot price (volatile, market-driven) against the contract
 * price (steady, negotiated rate) for a given lane.
 *
 * Two display modes:
 *   - Absolute  → both lines plotted in QAR
 *   - Percentage → single line showing (spot - contract) / contract * 100,
 *                  with a horizontal zero-reference line so you can see
 *                  when spot crossed above/below contract
 *
 * KPI strip at the top surfaces the current state ("spot is X% above
 * contract right now"), the period average, the biggest swing in the
 * window, and a short advisory note.
 */

type Period = "12w" | "6m" | "1y" | "2y";
type Mode = "absolute" | "percentage";

const PERIOD_OPTIONS: { key: Period; weeks: number; labelKey: string }[] = [
  { key: "12w", weeks: 12, labelKey: "rates.filter.period.12w" },
  { key: "6m",  weeks: 26, labelKey: "rates.filter.period.6m" },
  { key: "1y",  weeks: 52, labelKey: "rates.filter.period.1y" },
  { key: "2y",  weeks: 104,labelKey: "rates.filter.period.2y" },
];

export function RatesSpotVsContract() {
  const { t } = useLanguage();

  // ── State ──────────────────────────────────────────────────────────
  const [fromCode, setFromCode] = useState("DOH");
  const [toCode, setToCode] = useState("RUH");
  const [period, setPeriod] = useState<Period>("1y");
  const [mode, setMode] = useState<Mode>("absolute");

  // ── Resolve lane ───────────────────────────────────────────────────
  const laneKey = useMemo(() => {
    const exact = LANES.find((l) => l.fromCode === fromCode && l.toCode === toCode);
    return exact?.key ?? LANES[0].key;
  }, [fromCode, toCode]);

  const fromCity = ALL_CITIES.find((c) => c.code === fromCode)?.name ?? fromCode;
  const toCity = ALL_CITIES.find((c) => c.code === toCode)?.name ?? toCode;

  // ── Slice data to the chosen period ────────────────────────────────
  const periodWeeks = PERIOD_OPTIONS.find((p) => p.key === period)!.weeks;
  const allSeries = useMemo(() => getRateSeriesForLane(laneKey), [laneKey]);
  const allWeeks = useMemo(() => generateWeekLabels(), []);
  const sliceStart = allWeeks.length - Math.min(periodWeeks, allWeeks.length);

  const spotSlice = useMemo(() => allSeries.spot.slice(sliceStart), [allSeries, sliceStart]);
  const contractSlice = useMemo(() => allSeries.contract.slice(sliceStart), [allSeries, sliceStart]);
  const xLabels = useMemo(
    () => allWeeks.slice(sliceStart).map((w) => w.cw),
    [allWeeks, sliceStart],
  );

  // ── Build chart series depending on mode ───────────────────────────
  const chartSeries: Series[] = useMemo(() => {
    if (mode === "absolute") {
      return [
        { name: t("rates.metric.spot"),     color: "var(--d-accent)", values: spotSlice },
        { name: t("rates.metric.contract"), color: "#3B82F6",         values: contractSlice },
      ];
    }
    // Percentage: single line of (spot - contract) / contract * 100
    const spread = spotSlice.map((s, i) => {
      const c = contractSlice[i];
      return Math.round(((s - c) / c) * 1000) / 10; // one decimal place
    });
    return [
      { name: t("svc.spread.label"), color: "var(--d-accent)", values: spread },
    ];
  }, [mode, spotSlice, contractSlice, t]);

  // ── KPI calculations ───────────────────────────────────────────────
  const currentSpot = spotSlice[spotSlice.length - 1];
  const currentContract = contractSlice[contractSlice.length - 1];
  const currentSpreadPct = ((currentSpot - currentContract) / currentContract) * 100;

  // Spread series for stats (always computed regardless of display mode)
  const spreadSeries = useMemo(
    () =>
      spotSlice.map((s, i) => ((s - contractSlice[i]) / contractSlice[i]) * 100),
    [spotSlice, contractSlice],
  );
  const avgSpread =
    spreadSeries.reduce((a, b) => a + b, 0) / spreadSeries.length;
  const maxAboveContract = Math.max(...spreadSeries);
  const maxBelowContract = Math.min(...spreadSeries);
  const biggestSwing = Math.abs(maxAboveContract - maxBelowContract);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  // Sign-aware classes for the colored deltas
  const spreadClass =
    currentSpreadPct > 0.5
      ? "kpi-delta--up"
      : currentSpreadPct < -0.5
        ? "kpi-delta--down"
        : "kpi-delta--flat";

  return (
    <div className="ro-page">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="svc.title" /></h1>
          <p className="ro-header__sub"><T id="svc.sub" /></p>
        </div>
        <div className="ro-header__actions" role="toolbar" aria-label="Page actions">
          <button type="button" className="ro-action" title={t("rates.action.help")}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="rates.action.help" /></span>
          </button>
          <button type="button" className="ro-action" title={t("rates.action.export")}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
              <path d="M12 4v12M7 11l5 5 5-5M5 20h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="rates.action.export" /></span>
          </button>
          <button type="button" className="ro-action is-primary" title={t("rates.action.pin")}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label"><T id="rates.action.pin" /></span>
          </button>
        </div>
      </header>

      {/* ─── Filter bar ─────────────────────────────────────────── */}
      <div className="bm-filterbar" aria-label="Filters">
        <div className="bm-filterbar__group">
          <label className="bm-filterbar__label"><T id="rates.filter.from" /></label>
          <select className="bm-filterbar__select" value={fromCode} onChange={(e) => setFromCode(e.target.value)}>
            {ALL_CITIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
        <button type="button" className="bm-filterbar__swap" onClick={handleSwap} title={t("rates.filter.swap")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 4L3 8l4 4M21 8H3M17 20l4-4-4-4M3 16h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="bm-filterbar__group">
          <label className="bm-filterbar__label"><T id="rates.filter.to" /></label>
          <select className="bm-filterbar__select" value={toCode} onChange={(e) => setToCode(e.target.value)}>
            {ALL_CITIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
        <span className="bm-filterbar__sep" aria-hidden="true" />
        <div className="bm-filterbar__group">
          <label className="bm-filterbar__label"><T id="rates.filter.period" /></label>
          <div className="bm-filterbar__chips" role="radiogroup">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={period === opt.key}
                className={`bm-filterbar__chip${period === opt.key ? " is-active" : ""}`}
                onClick={() => setPeriod(opt.key)}
              >
                <T id={opt.labelKey} />
              </button>
            ))}
          </div>
        </div>
        <div className="bm-filterbar__spacer" />
        <div className="bm-filterbar__group">
          <label className="bm-filterbar__label"><T id="svc.mode.label" /></label>
          <div className="bm-filterbar__chips" role="radiogroup">
            <button
              type="button"
              role="radio"
              aria-checked={mode === "absolute"}
              className={`bm-filterbar__chip${mode === "absolute" ? " is-active" : ""}`}
              onClick={() => setMode("absolute")}
            >
              <T id="svc.mode.absolute" />
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === "percentage"}
              className={`bm-filterbar__chip${mode === "percentage" ? " is-active" : ""}`}
              onClick={() => setMode("percentage")}
            >
              <T id="svc.mode.percentage" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── KPI strip ──────────────────────────────────────────── */}
      <section className="fc-kpis" aria-label="Spread summary">
        <div className="fc-kpi">
          <span className="fc-kpi__label"><T id="svc.kpi.current" /></span>
          <span className={`fc-kpi__value ${spreadClass}`}>
            {currentSpreadPct > 0 ? "+" : ""}{currentSpreadPct.toFixed(1)}%
          </span>
          <span className="fc-kpi__hint">
            <T id={currentSpreadPct >= 0 ? "svc.kpi.current.above" : "svc.kpi.current.below"} />
          </span>
        </div>
        <div className="fc-kpi">
          <span className="fc-kpi__label"><T id="svc.kpi.average" /></span>
          <span className="fc-kpi__value">
            {avgSpread > 0 ? "+" : ""}{avgSpread.toFixed(1)}%
          </span>
          <span className="fc-kpi__hint"><T id="svc.kpi.average.hint" /></span>
        </div>
        <div className="fc-kpi">
          <span className="fc-kpi__label"><T id="svc.kpi.swing" /></span>
          <span className="fc-kpi__value">{biggestSwing.toFixed(1)}%</span>
          <span className="fc-kpi__hint">
            <T id="svc.kpi.swing.hint" />
          </span>
        </div>
        <div className="fc-kpi">
          <span className="fc-kpi__label"><T id="svc.kpi.advisory" /></span>
          <span className="fc-kpi__value fc-kpi__value--small">
            <T id={currentSpreadPct >= 1.5 ? "svc.advisory.lock" : currentSpreadPct <= -1.5 ? "svc.advisory.spot" : "svc.advisory.neutral"} />
          </span>
          <span className="fc-kpi__hint"><T id="svc.kpi.advisory.hint" /></span>
        </div>
      </section>

      {/* ─── Chart card ─────────────────────────────────────────── */}
      <section className="ro-card" aria-label="Spot vs Contract chart">
        <header className="ro-card__header">
          <div>
            <span className="ro-card__eyebrow">
              <T id={mode === "absolute" ? "svc.chart.eyebrow.abs" : "svc.chart.eyebrow.pct"} />
            </span>
            <h2 className="ro-card__heading">{fromCity} → {toCity}</h2>
            <p className="ro-card__sub">
              <T id={mode === "absolute" ? "svc.chart.sub.abs" : "svc.chart.sub.pct"} />
            </p>
          </div>
        </header>
        <LineChart series={chartSeries} xLabels={xLabels} yUnit={mode === "absolute" ? "QAR" : "%"} />
      </section>

      {/* ─── Explainer card ─────────────────────────────────────── */}
      <section className="ro-card svc-explain" aria-label="What this means">
        <header className="ro-card__header">
          <div>
            <span className="ro-card__eyebrow"><T id="svc.explain.eyebrow" /></span>
            <h2 className="ro-card__heading"><T id="svc.explain.heading" /></h2>
          </div>
        </header>
        <div className="svc-explain__grid">
          <div className="svc-explain__cell">
            <span className="svc-explain__title"><T id="svc.explain.spot.title" /></span>
            <p className="svc-explain__body"><T id="svc.explain.spot.body" /></p>
          </div>
          <div className="svc-explain__cell">
            <span className="svc-explain__title"><T id="svc.explain.contract.title" /></span>
            <p className="svc-explain__body"><T id="svc.explain.contract.body" /></p>
          </div>
          <div className="svc-explain__cell">
            <span className="svc-explain__title"><T id="svc.explain.spread.title" /></span>
            <p className="svc-explain__body"><T id="svc.explain.spread.body" /></p>
          </div>
        </div>
      </section>
    </div>
  );
}
