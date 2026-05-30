"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { LineChart, MiniBar, type Series } from "./charts";

/**
 * RateBenchmarkHub — main page at /dashboard/benchmark.
 *
 * What it shows (top to bottom):
 *   1. Header strip — back link, eyebrow, big page heading + sub, filter pills
 *   2. Featured lanes strip — 4 most-watched GCC corridors with current
 *      spot rate + week-over-week change
 *   3. 2-column main: Lane trend chart (Doha → Riyadh, 12 weeks) on the
 *      left + Top movers (gainers/losers) panel on the right
 *   4. Lane comparison strip — 3 lanes side-by-side: market rate vs your
 *      rate, with a "+ Add lane" placeholder
 *
 * All numbers are mock / placeholder data designed to look realistic for
 * a GCC freight operator. They are clearly synthetic — replace with real
 * API data when the backend is wired.
 *
 * The component itself is theme-aware via the global `--d-*` CSS tokens,
 * so light/dark just works.
 */

// ─── Mock data ────────────────────────────────────────────────────────
// Replace with real API responses when the backend is wired.

const FEATURED_LANES = [
  { lane: "Doha → Riyadh",       rate: 1850, unit: "QAR/trip", deltaPct: +2.1, primary: true },
  { lane: "Doha → Dubai",        rate: 2640, unit: "QAR/trip", deltaPct: -4.2, primary: false },
  { lane: "Riyadh → Jeddah",     rate: 1240, unit: "QAR/trip", deltaPct: +0.8, primary: false },
  { lane: "Dubai → Riyadh",      rate: 2840, unit: "QAR/trip", deltaPct: +3.4, primary: false },
];

// 12 weeks of trend data for the primary lane (Doha → Riyadh)
const TREND_X_LABELS = ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12"];
const TREND_SERIES: Series[] = [
  {
    name: "Spot price",
    color: "var(--d-accent)", // gold
    values: [1740, 1755, 1720, 1700, 1735, 1780, 1810, 1790, 1820, 1840, 1860, 1850],
  },
  {
    name: "Contract price",
    color: "#3B82F6", // blue
    values: [1780, 1780, 1785, 1785, 1790, 1790, 1795, 1795, 1800, 1800, 1810, 1810],
  },
  {
    name: "Diesel index",
    color: "#22C55E", // green
    values: [1620, 1640, 1655, 1670, 1690, 1700, 1710, 1730, 1745, 1760, 1770, 1785],
  },
  {
    name: "Your rate",
    color: "var(--d-text)", // adapts to theme
    values: [1735, 1755, 1730, 1715, 1745, 1770, 1795, 1790, 1810, 1825, 1840, 1820],
    dashed: true,
  },
];

// "Top movers" — biggest weekly price changes across the GCC market.
// In freight, price ↑ is BAD for the buyer (costs more) — so we colour
// gainers red and losers green to match operator intuition.
const TOP_MOVERS_UP = [
  { lane: "Khalifa Port → Hamad Port", deltaPct: +8.4, rate: 1280 },
  { lane: "Sohar → Doha",              deltaPct: +5.1, rate: 1520 },
  { lane: "Jeddah → Doha",             deltaPct: +3.4, rate: 2980 },
];

const TOP_MOVERS_DOWN = [
  { lane: "Doha → Dubai",              deltaPct: -4.2, rate: 2640 },
  { lane: "Riyadh → Dammam",           deltaPct: -2.1, rate:  860 },
  { lane: "Dubai → Sharjah",           deltaPct: -0.8, rate:  340 },
];

// Lane comparison — the "are you over- or under-paying?" widget
const COMPARISON_LANES = [
  { lane: "Doha → Riyadh",         market: 1850, yours: 1820 },
  { lane: "Doha → Dubai",          market: 2640, yours: 2710 },
  { lane: "Khalifa Port → Hamad",  market:  920, yours:  880 },
];

// ─── Helpers ──────────────────────────────────────────────────────────

function formatDelta(pct: number): string {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

/** "Up" delta = price went up = bad for buyer = red.
 *  "Down" delta = price went down = good for buyer = green. */
function deltaClass(pct: number): string {
  if (pct > 0) return "bm-delta--up";
  if (pct < 0) return "bm-delta--down";
  return "bm-delta--flat";
}

// ─── Component ────────────────────────────────────────────────────────

export function RateBenchmarkHub() {
  // Compute the comparison-strip max so all bars share a scale
  const compareMax = Math.max(...COMPARISON_LANES.map((c) => Math.max(c.market, c.yours))) * 1.1;

  return (
    <main className="dash-main bm-shell">
      {/* ─── Header ───────────────────────────────────────────── */}
      <Link href="/dashboard" className="dash-back-link" style={{ marginBottom: "1.5rem" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M12 7H2M6 3L2 7l4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <T id="dashboard.back" />
      </Link>

      <header className="bm-header">
        <div>
          <p className="eyebrow bm-header__eyebrow">
            <T id="benchmark.eyebrow" />
          </p>
          <h1 className="bm-header__heading">
            <T id="benchmark.heading" />
          </h1>
          <p className="bm-header__sub">
            <T id="benchmark.sub" />
          </p>
        </div>

        {/* Filter pills — non-functional in v1, just visual.
            Will become real dropdowns once filter state is wired up. */}
        <div className="bm-filters" aria-label="Filters">
          <FilterPill label="benchmark.filter.region" value="GCC" />
          <FilterPill label="benchmark.filter.mode" value="Road" />
          <FilterPill label="benchmark.filter.period" value="12 weeks" />
        </div>
      </header>

      {/* ─── 1. Featured lanes strip ─────────────────────────── */}
      <section className="bm-featured" aria-label="Featured lanes">
        {FEATURED_LANES.map((lane) => (
          <article
            key={lane.lane}
            className={`bm-featured-card${lane.primary ? " bm-featured-card--primary" : ""}`}
          >
            <span className="bm-featured-card__lane">{lane.lane}</span>
            <span className="bm-featured-card__rate">
              {lane.rate.toLocaleString()}{" "}
              <span className="bm-featured-card__unit">{lane.unit}</span>
            </span>
            <span className={`bm-delta ${deltaClass(lane.deltaPct)}`}>
              <DeltaArrow up={lane.deltaPct > 0} />
              {formatDelta(lane.deltaPct)}{" "}
              <span className="bm-delta__period">
                <T id="benchmark.vs_last_week" />
              </span>
            </span>
          </article>
        ))}
      </section>

      {/* ─── 2. Main split: trend chart (left) + top movers (right) ─── */}
      <div className="bm-split">
        {/* Lane trend chart */}
        <section className="bm-card bm-card--trend" aria-label="Rate trend">
          <header className="bm-card__header">
            <div>
              <span className="bm-card__eyebrow">
                <T id="benchmark.trend.eyebrow" />
              </span>
              <h2 className="bm-card__heading">Doha → Riyadh</h2>
              <p className="bm-card__sub">
                <T id="benchmark.trend.sub" />
              </p>
            </div>
            <button type="button" className="bm-card__action">
              <T id="benchmark.change_lane" />
            </button>
          </header>
          <LineChart series={TREND_SERIES} xLabels={TREND_X_LABELS} yUnit="QAR" />
        </section>

        {/* Top movers */}
        <section className="bm-card bm-card--movers" aria-label="Top movers">
          <header className="bm-card__header">
            <div>
              <span className="bm-card__eyebrow">
                <T id="benchmark.movers.eyebrow" />
              </span>
              <h2 className="bm-card__heading">
                <T id="benchmark.movers.heading" />
              </h2>
            </div>
          </header>

          {/* Gainers (price up = red, bad for buyer) */}
          <div className="bm-movers-group">
            <h3 className="bm-movers-group__heading bm-movers-group__heading--up">
              <T id="benchmark.movers.gainers" />
            </h3>
            <ul className="bm-movers-list">
              {TOP_MOVERS_UP.map((m) => (
                <li key={m.lane} className="bm-mover">
                  <span className="bm-mover__lane">{m.lane}</span>
                  <span className="bm-mover__rate">
                    {m.rate.toLocaleString()} <span className="bm-mover__unit">QAR</span>
                  </span>
                  <span className={`bm-delta ${deltaClass(m.deltaPct)}`}>
                    <DeltaArrow up />
                    {formatDelta(m.deltaPct)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Losers (price down = green, good for buyer) */}
          <div className="bm-movers-group">
            <h3 className="bm-movers-group__heading bm-movers-group__heading--down">
              <T id="benchmark.movers.losers" />
            </h3>
            <ul className="bm-movers-list">
              {TOP_MOVERS_DOWN.map((m) => (
                <li key={m.lane} className="bm-mover">
                  <span className="bm-mover__lane">{m.lane}</span>
                  <span className="bm-mover__rate">
                    {m.rate.toLocaleString()} <span className="bm-mover__unit">QAR</span>
                  </span>
                  <span className={`bm-delta ${deltaClass(m.deltaPct)}`}>
                    <DeltaArrow up={false} />
                    {formatDelta(m.deltaPct)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* ─── 3. Lane comparison strip ─────────────────────────── */}
      <section className="bm-card bm-card--compare" aria-label="Lane comparison">
        <header className="bm-card__header">
          <div>
            <span className="bm-card__eyebrow">
              <T id="benchmark.compare.eyebrow" />
            </span>
            <h2 className="bm-card__heading">
              <T id="benchmark.compare.heading" />
            </h2>
            <p className="bm-card__sub">
              <T id="benchmark.compare.sub" />
            </p>
          </div>
          <button type="button" className="bm-card__action">
            + <T id="benchmark.compare.add" />
          </button>
        </header>

        {/* Each row: lane name | bar (market fill + your-marker) | numbers */}
        <ul className="bm-compare-list">
          {COMPARISON_LANES.map((c) => {
            const diffPct = ((c.yours - c.market) / c.market) * 100;
            return (
              <li key={c.lane} className="bm-compare-row">
                <span className="bm-compare-row__lane">{c.lane}</span>
                <div className="bm-compare-row__bar">
                  <MiniBar
                    marketValue={c.market}
                    yourValue={c.yours}
                    max={compareMax}
                  />
                </div>
                <span className="bm-compare-row__market">
                  {c.market.toLocaleString()} QAR
                </span>
                <span className="bm-compare-row__yours">
                  <T id="benchmark.compare.you" />:{" "}
                  <strong>{c.yours.toLocaleString()} QAR</strong>{" "}
                  <span className={`bm-delta ${deltaClass(diffPct)}`}>
                    <DeltaArrow up={diffPct > 0} />
                    {formatDelta(diffPct)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

// ─── Small helper components ──────────────────────────────────────────

function FilterPill({ label, value }: { label: string; value: string }) {
  return (
    <button type="button" className="bm-filter-pill">
      <span className="bm-filter-pill__label">
        <T id={label} />
      </span>
      <span className="bm-filter-pill__value">{value}</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path
          d="M2 4l3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function DeltaArrow({ up }: { up: boolean }) {
  return (
    <svg
      className="bm-delta__arrow"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
    >
      {up ? (
        <path d="M5 2v6M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 8V2M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
