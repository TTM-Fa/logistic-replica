"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { ALL_CITIES, LANES, getRateSeriesForLane } from "../rates/mockData";

/**
 * RateOnDemand — shared component for both rate lookup sub-pages:
 *   /dashboard/benchmark/rate-on-demand/spot
 *   /dashboard/benchmark/rate-on-demand/contract
 *
 * Form on top (From / To / Equipment / Trip type) → results below.
 * The form is "live" — every input change re-derives the result
 * instantly. No real submit step.
 *
 * Mode-specific bottom section:
 *   - spot:     volatility note + "refresh for latest" hint
 *   - contract: term-length selector (6mo / 12mo) + estimated savings
 */

type Mode = "spot" | "contract";
type Equipment = "40ft" | "40ft-reefer" | "20ft" | "40ft-hc" | "flatbed";
type TripType = "one-way" | "round";
type Term = "6m" | "12m";

const EQUIPMENT_OPTIONS: { key: Equipment; labelKey: string; mult: number }[] = [
  { key: "40ft",        labelKey: "rod.equipment.40ft",    mult: 1.00 },
  { key: "40ft-reefer", labelKey: "rod.equipment.reefer",  mult: 1.35 },
  { key: "20ft",        labelKey: "rod.equipment.20ft",    mult: 0.78 },
  { key: "40ft-hc",     labelKey: "rod.equipment.hc",      mult: 1.08 },
  { key: "flatbed",     labelKey: "rod.equipment.flatbed", mult: 1.15 },
];

const TERM_OPTIONS: { key: Term; months: number; labelKey: string }[] = [
  { key: "6m",  months: 6,  labelKey: "rod.term.6m" },
  { key: "12m", months: 12, labelKey: "rod.term.12m" },
];

export function RateOnDemand({ mode }: { mode: Mode }) {
  const { t } = useLanguage();

  // ── Form state ───────────────────────────────────────────────────
  const [fromCode, setFromCode] = useState("DOH");
  const [toCode, setToCode] = useState("RUH");
  const [equipment, setEquipment] = useState<Equipment>("40ft");
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [term, setTerm] = useState<Term>("12m");

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  // ── Derive result from form inputs ──────────────────────────────
  const result = useMemo(() => {
    // Match an exact GCC lane if we have one; otherwise pick the closest
    // existing lane as a fallback so the page never goes blank.
    const lane =
      LANES.find((l) => l.fromCode === fromCode && l.toCode === toCode) ?? LANES[0];
    const series = getRateSeriesForLane(lane.key);
    const baseSeries = mode === "spot" ? series.spot : series.contract;
    const baseRate = baseSeries[baseSeries.length - 1];

    // Equipment multiplier (reefer is most expensive, 20ft is cheapest)
    const equipMult = EQUIPMENT_OPTIONS.find((e) => e.key === equipment)!.mult;
    // Round-trip is approximately 1.85x one-way (small discount vs 2x)
    const tripMult = tripType === "round" ? 1.85 : 1;

    const rate = Math.round(baseRate * equipMult * tripMult);

    // Confidence range: ±5% for spot (volatile), ±2% for contract (steady)
    const confPct = mode === "spot" ? 0.05 : 0.02;
    const lower = Math.round(rate * (1 - confPct));
    const upper = Math.round(rate * (1 + confPct));

    // Sparkline data — last 8 weekly values for the chosen rate type
    const sparkData = baseSeries.slice(-8).map((v) => Math.round(v * equipMult * tripMult));

    // Change over the sparkline window
    const change = ((sparkData[sparkData.length - 1] - sparkData[0]) / sparkData[0]) * 100;

    // Pseudo-deterministic distance + carrier count derived from lane key
    // (just so they don't all look identical)
    const seed = lane.fromCode.charCodeAt(0) + lane.toCode.charCodeAt(0);
    const distance = 280 + ((seed * 17) % 700);
    const transitDays = Math.max(1, Math.round(distance / 700));
    const carriers = 8 + (seed % 14);

    // Volatility = std-dev of the spark window as % of mean
    const mean = sparkData.reduce((a, b) => a + b, 0) / sparkData.length;
    const variance =
      sparkData.reduce((s, v) => s + (v - mean) ** 2, 0) / sparkData.length;
    const volatility = (Math.sqrt(variance) / mean) * 100;

    // Contract-mode: estimate savings vs current spot (using spot baseline)
    const spotNow = series.spot[series.spot.length - 1] * equipMult * tripMult;
    const savingsPct = ((spotNow - rate) / spotNow) * 100;

    return {
      lane,
      rate,
      lower,
      upper,
      sparkData,
      change,
      distance,
      transitDays,
      carriers,
      volatility,
      savingsPct,
    };
  }, [fromCode, toCode, equipment, tripType, mode]);

  const fromCity = ALL_CITIES.find((c) => c.code === fromCode)?.name ?? fromCode;
  const toCity = ALL_CITIES.find((c) => c.code === toCode)?.name ?? toCode;

  const titleKey = mode === "spot" ? "rod.spot.title" : "rod.contract.title";
  const subKey   = mode === "spot" ? "rod.spot.sub"   : "rod.contract.sub";
  const rateLabelKey =
    mode === "spot" ? "rod.result.label.spot" : "rod.result.label.contract";

  // Change indicator color: up = bad for buyer = red, down = good = green
  const changeClass =
    result.change > 0.5
      ? "kpi-delta--up"
      : result.change < -0.5
        ? "kpi-delta--down"
        : "kpi-delta--flat";

  return (
    <div className="ro-page">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id={titleKey} /></h1>
          <p className="ro-header__sub"><T id={subKey} /></p>
        </div>
        <div className="ro-header__actions" role="toolbar" aria-label="Page actions">
          <button type="button" className="ro-action" title={t("rates.action.help")}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="rates.action.help" /></span>
          </button>
          <button type="button" className="ro-action is-primary" title={t("rod.action.save")}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
              <path d="M5 5v14l7-3 7 3V5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="rod.action.save" /></span>
          </button>
        </div>
      </header>

      {/* ─── Lookup form card ──────────────────────────────────── */}
      <section className="ro-card" aria-label="Rate lookup form">
        <header className="ro-card__header">
          <div>
            <span className="ro-card__eyebrow"><T id="rod.form.eyebrow" /></span>
            <h2 className="ro-card__heading"><T id="rod.form.heading" /></h2>
            <p className="ro-card__sub"><T id="rod.form.sub" /></p>
          </div>
        </header>

        <div className="rod-form" role="group" aria-label="Rate lookup inputs">
          {/* From */}
          <div className="rod-form__group">
            <label className="rod-form__label" htmlFor="rod-from"><T id="rates.filter.from" /></label>
            <select
              id="rod-from"
              className="rod-form__select"
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
            >
              {ALL_CITIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="rod-form__swap"
            onClick={handleSwap}
            aria-label={t("rates.filter.swap")}
            title={t("rates.filter.swap")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 4L3 8l4 4M21 8H3M17 20l4-4-4-4M3 16h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* To */}
          <div className="rod-form__group">
            <label className="rod-form__label" htmlFor="rod-to"><T id="rates.filter.to" /></label>
            <select
              id="rod-to"
              className="rod-form__select"
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
            >
              {ALL_CITIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Equipment */}
          <div className="rod-form__group">
            <label className="rod-form__label" htmlFor="rod-equip"><T id="rod.form.equipment" /></label>
            <select
              id="rod-equip"
              className="rod-form__select"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value as Equipment)}
            >
              {EQUIPMENT_OPTIONS.map((eq) => (
                <option key={eq.key} value={eq.key}>{t(eq.labelKey)}</option>
              ))}
            </select>
          </div>

          {/* Trip type — segmented */}
          <div className="rod-form__group">
            <label className="rod-form__label"><T id="rod.form.trip" /></label>
            <div className="rod-form__chips" role="radiogroup">
              <button
                type="button"
                role="radio"
                aria-checked={tripType === "one-way"}
                className={`rod-form__chip${tripType === "one-way" ? " is-active" : ""}`}
                onClick={() => setTripType("one-way")}
              >
                <T id="rod.trip.oneway" />
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={tripType === "round"}
                className={`rod-form__chip${tripType === "round" ? " is-active" : ""}`}
                onClick={() => setTripType("round")}
              >
                <T id="rod.trip.round" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Result card ────────────────────────────────────────── */}
      <section className="rod-result" aria-label="Lookup result">
        {/* Top: big rate + range + change + sparkline + lane meta */}
        <div className="rod-result__top">
          <div className="rod-result__main">
            <span className="rod-result__label"><T id={rateLabelKey} /></span>
            <div className="rod-result__rate">
              <span className="rod-result__rate-num">{result.rate.toLocaleString()}</span>
              <span className="rod-result__rate-unit">
                QAR
                {tripType === "round" ? <T id="rod.result.unit.round" /> : <T id="rod.result.unit.oneway" />}
              </span>
            </div>
            <div className="rod-result__range">
              <T id="rod.result.range" />: {result.lower.toLocaleString()} – {result.upper.toLocaleString()} QAR
            </div>
            <div className={`rod-result__change ${changeClass}`}>
              <DeltaArrow up={result.change > 0} />
              {result.change > 0 ? "+" : ""}{result.change.toFixed(1)}%{" "}
              <span className="rod-result__change-note">
                <T id="rod.result.change_8w" />
              </span>
            </div>
          </div>

          <div className="rod-result__chart">
            <MiniSparkline data={result.sparkData} />
            <span className="rod-result__chart-label">
              <T id="rod.result.spark_label" />
            </span>
          </div>
        </div>

        {/* Middle: lane meta strip */}
        <div className="rod-result__meta">
          <div className="rod-meta">
            <span className="rod-meta__label"><T id="rod.result.lane" /></span>
            <span className="rod-meta__value">{fromCity} → {toCity}</span>
          </div>
          <div className="rod-meta">
            <span className="rod-meta__label"><T id="rod.result.distance" /></span>
            <span className="rod-meta__value">{result.distance.toLocaleString()} km</span>
          </div>
          <div className="rod-meta">
            <span className="rod-meta__label"><T id="rod.result.transit" /></span>
            <span className="rod-meta__value">{result.transitDays} {result.transitDays === 1 ? t("rod.result.day") : t("rod.result.days")}</span>
          </div>
          <div className="rod-meta">
            <span className="rod-meta__label"><T id="rod.result.carriers" /></span>
            <span className="rod-meta__value">{result.carriers} <T id="rod.result.carriers_unit" /></span>
          </div>
        </div>

        {/* Bottom: mode-specific section */}
        {mode === "spot" ? (
          <div className="rod-mode rod-mode--spot">
            <div className="rod-mode__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="rod-mode__text">
              <span className="rod-mode__heading"><T id="rod.spot.volatility.heading" /></span>
              <span className="rod-mode__body">
                ±{result.volatility.toFixed(1)}% <T id="rod.spot.volatility.body" />
              </span>
            </div>
            <button type="button" className="rod-mode__cta">
              <T id="rod.action.refresh" /> ↻
            </button>
          </div>
        ) : (
          <div className="rod-mode rod-mode--contract">
            <div className="rod-mode__text">
              <span className="rod-mode__heading"><T id="rod.contract.term.heading" /></span>
              <div className="rod-form__chips" role="radiogroup">
                {TERM_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    role="radio"
                    aria-checked={term === opt.key}
                    className={`rod-form__chip${term === opt.key ? " is-active" : ""}`}
                    onClick={() => setTerm(opt.key)}
                  >
                    <T id={opt.labelKey} />
                  </button>
                ))}
              </div>
              <span className="rod-mode__body">
                <T id="rod.contract.savings.label" />:{" "}
                <strong className={result.savingsPct > 0 ? "kpi-delta--down" : "kpi-delta--up"}>
                  {result.savingsPct > 0 ? "−" : "+"}{Math.abs(result.savingsPct).toFixed(1)}%
                </strong>{" "}
                <T id="rod.contract.savings.note" />
              </span>
            </div>
            <button type="button" className="rod-mode__cta is-primary">
              <T id="rod.action.lock" /> →
            </button>
          </div>
        )}

        {/* Footer: link to full lane analysis */}
        <Link href="/dashboard/benchmark/rates/overview" className="rod-result__link">
          <T id="rod.result.view_lane" /> →
        </Link>
      </section>
    </div>
  );
}

// ─── Tiny inline sparkline (last 8 weeks) ────────────────────────────
function MiniSparkline({ data }: { data: number[] }) {
  const W = 180;
  const H = 56;
  const PAD = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (W - PAD * 2) / Math.max(data.length - 1, 1);
  const points = data
    .map((v, i) => {
      const x = PAD + i * step;
      const y = PAD + (H - PAD * 2) - ((v - min) / range) * (H - PAD * 2);
      return `${x},${y}`;
    })
    .join(" ");

  // Area underneath the line, gold-tinted fill
  const lastIndex = data.length - 1;
  const area = `${PAD},${H} ${points} ${PAD + lastIndex * step},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="rod-spark" role="img" aria-label="Recent rate trend">
      <polygon points={area} fill="var(--d-accent)" fillOpacity="0.14" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--d-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={PAD + lastIndex * step}
        cy={PAD + (H - PAD * 2) - ((data[lastIndex] - min) / range) * (H - PAD * 2)}
        r="3"
        fill="var(--d-accent)"
      />
    </svg>
  );
}

function DeltaArrow({ up }: { up: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      {up ? (
        <path d="M5 2v6M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 8V2M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
