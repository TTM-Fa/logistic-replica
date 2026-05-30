"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  ALL_CITIES,
  LANES,
  generateWeekLabels,
  getForecastForLane,
} from "./mockData";
import { ForecastChart } from "./ForecastChart";

/**
 * RatesForecast — the Spot Rate Forecast page at
 * /dashboard/benchmark/rates/forecast.
 *
 * Layout (top → bottom):
 *   1. Header (title + sub + action toolbar) — same pattern as Overview
 *   2. Filter bar — Lane (from / swap / to) + Horizon (forecast length)
 *   3. KPI strip — predicted next-week + change vs current + ±confidence
 *   4. Chart card — history + dashed forecast + shaded confidence band
 *   5. Model-accuracy mini card — placeholder stats for the underlying model
 */

type Horizon = "4w" | "12w" | "26w" | "52w";

const HORIZON_OPTIONS: { key: Horizon; weeks: number; labelKey: string }[] = [
  { key: "4w",  weeks: 4,  labelKey: "forecast.horizon.4w" },
  { key: "12w", weeks: 12, labelKey: "forecast.horizon.12w" },
  { key: "26w", weeks: 26, labelKey: "forecast.horizon.26w" },
  { key: "52w", weeks: 52, labelKey: "forecast.horizon.52w" },
];

export function RatesForecast() {
  const { t } = useLanguage();

  // ── State ──────────────────────────────────────────────────────────
  const [fromCode, setFromCode] = useState("DOH");
  const [toCode, setToCode] = useState("RUH");
  const [horizon, setHorizon] = useState<Horizon>("12w");

  // ── Resolve lane ───────────────────────────────────────────────────
  const laneKey = useMemo(() => {
    const exact = LANES.find((l) => l.fromCode === fromCode && l.toCode === toCode);
    return exact?.key ?? LANES[0].key;
  }, [fromCode, toCode]);

  const fromCity = ALL_CITIES.find((c) => c.code === fromCode)?.name ?? fromCode;
  const toCity = ALL_CITIES.find((c) => c.code === toCode)?.name ?? toCode;

  // ── Build forecast data + labels ───────────────────────────────────
  const horizonWeeks = HORIZON_OPTIONS.find((h) => h.key === horizon)!.weeks;
  const forecast = useMemo(
    () => getForecastForLane(laneKey, horizonWeeks, 26),
    [laneKey, horizonWeeks],
  );

  // History labels: last 26 weeks of the existing timeline
  const allWeeks = useMemo(() => generateWeekLabels(), []);
  const historyLabels = useMemo(
    () => allWeeks.slice(-26).map((w) => w.cw),
    [allWeeks],
  );
  // Forecast labels: synthesise next N weeks (CW+1, CW+2, etc.)
  const forecastLabels = useMemo(() => {
    const labels: string[] = [];
    const last = allWeeks[allWeeks.length - 1];
    const lastNum = parseInt(last.cw.replace("CW", ""), 10);
    for (let i = 1; i <= horizonWeeks; i++) {
      const wk = ((lastNum + i - 1) % 52) + 1;
      labels.push(`CW${wk}`);
    }
    return labels;
  }, [allWeeks, horizonWeeks]);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  // ── Format helpers ─────────────────────────────────────────────────
  const sign = (n: number) => (n > 0 ? "+" : "");
  const fmt = (n: number) => n.toLocaleString();
  const deltaClass =
    forecast.changePct > 0.5
      ? "kpi-delta--up"
      : forecast.changePct < -0.5
        ? "kpi-delta--down"
        : "kpi-delta--flat";

  return (
    <div className="ro-page">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title">
            <T id="forecast.title" />
          </h1>
          <p className="ro-header__sub">
            <T id="forecast.sub" />
          </p>
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

      {/* ─── Filter bar (slim — just lane + horizon) ─────────────── */}
      <div className="bm-filterbar" aria-label="Forecast filters">
        <div className="bm-filterbar__group">
          <label className="bm-filterbar__label"><T id="rates.filter.from" /></label>
          <select
            className="bm-filterbar__select"
            value={fromCode}
            onChange={(e) => setFromCode(e.target.value)}
          >
            {ALL_CITIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <button type="button" className="bm-filterbar__swap" onClick={handleSwap} title={t("rates.filter.swap")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 4L3 8l4 4M21 8H3M17 20l4-4-4-4M3 16h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="bm-filterbar__group">
          <label className="bm-filterbar__label"><T id="rates.filter.to" /></label>
          <select
            className="bm-filterbar__select"
            value={toCode}
            onChange={(e) => setToCode(e.target.value)}
          >
            {ALL_CITIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <span className="bm-filterbar__sep" aria-hidden="true" />
        <div className="bm-filterbar__group">
          <label className="bm-filterbar__label"><T id="forecast.filter.horizon" /></label>
          <div className="bm-filterbar__chips" role="radiogroup">
            {HORIZON_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={horizon === opt.key}
                className={`bm-filterbar__chip${horizon === opt.key ? " is-active" : ""}`}
                onClick={() => setHorizon(opt.key)}
              >
                <T id={opt.labelKey} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── KPI strip (predicted / change / confidence) ─────────── */}
      <section className="fc-kpis" aria-label="Forecast summary">
        <div className="fc-kpi">
          <span className="fc-kpi__label"><T id="forecast.kpi.next" /></span>
          <span className="fc-kpi__value">
            {fmt(forecast.nextWeek)} <span className="fc-kpi__unit">QAR</span>
          </span>
          <span className="fc-kpi__hint"><T id="forecast.kpi.next.hint" /></span>
        </div>
        <div className="fc-kpi">
          <span className="fc-kpi__label"><T id="forecast.kpi.change" /></span>
          <span className={`fc-kpi__value ${deltaClass}`}>
            {sign(forecast.changePct)}{forecast.changePct.toFixed(1)}%
          </span>
          <span className="fc-kpi__hint">
            <T id="forecast.kpi.change.hint" /> {fmt(forecast.current)} QAR
          </span>
        </div>
        <div className="fc-kpi">
          <span className="fc-kpi__label"><T id="forecast.kpi.confidence" /></span>
          <span className="fc-kpi__value">±{forecast.confidencePct.toFixed(1)}%</span>
          <span className="fc-kpi__hint"><T id="forecast.kpi.confidence.hint" /></span>
        </div>
        <div className="fc-kpi">
          <span className="fc-kpi__label"><T id="forecast.kpi.horizon" /></span>
          <span className="fc-kpi__value">{horizonWeeks}w</span>
          <span className="fc-kpi__hint"><T id="forecast.kpi.horizon.hint" /></span>
        </div>
      </section>

      {/* ─── Chart card ─────────────────────────────────────────── */}
      <section className="ro-card" aria-label="Forecast chart">
        <header className="ro-card__header">
          <div>
            <span className="ro-card__eyebrow"><T id="forecast.chart.eyebrow" /></span>
            <h2 className="ro-card__heading">{fromCity} → {toCity}</h2>
            <p className="ro-card__sub">
              <T id="forecast.chart.sub" />
            </p>
          </div>
        </header>
        <ForecastChart
          history={forecast.history}
          forecast={forecast.forecast}
          upper={forecast.upper}
          lower={forecast.lower}
          historyLabels={historyLabels}
          forecastLabels={forecastLabels}
          yUnit="QAR"
        />
        {/* Legend — explains the dashed/solid/band distinction */}
        <div className="fc-legend" aria-hidden="true">
          <span className="fc-legend__item">
            <span className="fc-legend__line fc-legend__line--solid" /> <T id="forecast.legend.history" />
          </span>
          <span className="fc-legend__item">
            <span className="fc-legend__line fc-legend__line--dashed" /> <T id="forecast.legend.predicted" />
          </span>
          <span className="fc-legend__item">
            <span className="fc-legend__band" /> <T id="forecast.legend.range" />
          </span>
        </div>
      </section>

      {/* ─── Model accuracy mini card ───────────────────────────── */}
      <section className="ro-card fc-accuracy" aria-label="Model accuracy">
        <header className="ro-card__header">
          <div>
            <span className="ro-card__eyebrow"><T id="forecast.accuracy.eyebrow" /></span>
            <h2 className="ro-card__heading"><T id="forecast.accuracy.heading" /></h2>
            <p className="ro-card__sub"><T id="forecast.accuracy.sub" /></p>
          </div>
        </header>
        <div className="fc-accuracy__grid">
          <div className="fc-accuracy__cell">
            <span className="fc-accuracy__value">92%</span>
            <span className="fc-accuracy__label"><T id="forecast.accuracy.last4" /></span>
          </div>
          <div className="fc-accuracy__cell">
            <span className="fc-accuracy__value">87%</span>
            <span className="fc-accuracy__label"><T id="forecast.accuracy.last12" /></span>
          </div>
          <div className="fc-accuracy__cell">
            <span className="fc-accuracy__value">12k+</span>
            <span className="fc-accuracy__label"><T id="forecast.accuracy.trained" /></span>
          </div>
          <div className="fc-accuracy__cell">
            <span className="fc-accuracy__value">±2.4%</span>
            <span className="fc-accuracy__label"><T id="forecast.accuracy.mape" /></span>
          </div>
        </div>
      </section>
    </div>
  );
}
