"use client";

import Link from "next/link";

/**
 * Variant 4 — "Magazine"
 *
 * Editorial / premium feel — the dashboard reads like a beautifully
 * designed magazine spread. Sections, top-down:
 *
 *   1. Big featured "story" banner using the visibility map image
 *      (image we already have in /public/illustrations/visibility-map.jpg).
 *   2. The 3 models as a horizontal strip below the feature.
 *   3. Two-column section: top carriers leaderboard + tip-of-the-day card.
 *   4. Mini KPI strip at the bottom.
 *
 * Classes prefixed `.v4-`.
 */

const MODELS = [
  { key: "visibility", title: "Visibility", desc: "Live shipment tracking", href: "/dashboard/visibility" },
  { key: "marketplace", title: "Marketplace", desc: "Carrier offers & bids", href: "/dashboard/marketplace" },
  { key: "benchmark", title: "Rate Benchmark", desc: "Market rate intelligence", href: "/dashboard/benchmark" },
];

const CARRIERS = [
  { name: "Al-Bahar Logistics", lanes: 28, rating: 4.8, accent: "#FCBA02" },
  { name: "Gulf Freight Co.", lanes: 19, rating: 4.6, accent: "#22C55E" },
  { name: "DesertLine Express", lanes: 14, rating: 4.4, accent: "#3B82F6" },
  { name: "Trans-Arabia Cargo", lanes: 11, rating: 4.5, accent: "#A855F7" },
];

const KPIS = [
  { value: "247", label: "Active shipments" },
  { value: "94%", label: "On-time" },
  { value: "QAR 1.2M", label: "MTD volume" },
  { value: "12", label: "Corridors" },
];

export function Variant4() {
  return (
    <main className="dash-main v4-shell">
      <BackToDesigns />

      {/* FEATURED banner — uses the visibility map as background */}
      <section className="v4-feature">
        <div
          className="v4-feature__bg"
          aria-hidden="true"
          style={{ backgroundImage: "url('/illustrations/visibility-map.jpg')" }}
        />
        <div className="v4-feature__overlay" aria-hidden="true" />
        <div className="v4-feature__content">
          <span className="v4-feature__badge">FEATURED · THIS WEEK</span>
          <h1 className="v4-feature__heading">
            The Jebel Ali → Doha corridor is moving 30% faster.
          </h1>
          <p className="v4-feature__sub">
            New customs lane reduced average crossing time from 14h to 9h. Read the full report inside Visibility.
          </p>
          <Link href="/dashboard/visibility" className="v4-feature__cta">
            Open Visibility →
          </Link>
        </div>
      </section>

      {/* 3 models in a horizontal strip */}
      <section className="v4-models" aria-label="Models">
        {MODELS.map((m, i) => (
          <Link key={m.key} href={m.href} className="v4-model">
            <span className="v4-model__num">{`0${i + 1}`}</span>
            <div className="v4-model__body">
              <h3 className="v4-model__title">{m.title}</h3>
              <p className="v4-model__desc">{m.desc}</p>
            </div>
            <span className="v4-model__arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </section>

      {/* Two-column: top carriers + tip of the day */}
      <div className="v4-split">
        <section className="v4-leaderboard" aria-label="Top carriers">
          <header className="v4-leaderboard__header">
            <h2 className="v4-leaderboard__heading">Top carriers this month</h2>
            <span className="v4-leaderboard__sub">By active lanes</span>
          </header>
          <ul className="v4-leaderboard__list">
            {CARRIERS.map((c, i) => (
              <li key={c.name} className="v4-carrier">
                <span className="v4-carrier__rank" style={{ color: c.accent }}>{`#${i + 1}`}</span>
                <span className="v4-carrier__name">{c.name}</span>
                <span className="v4-carrier__bar" aria-hidden="true">
                  <span style={{ width: `${(c.lanes / 28) * 100}%`, background: c.accent }} />
                </span>
                <span className="v4-carrier__lanes">{c.lanes} lanes</span>
                <span className="v4-carrier__rating">★ {c.rating}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="v4-tip" aria-label="Tip of the day">
          <span className="v4-tip__label">TIP OF THE DAY</span>
          <h3 className="v4-tip__heading">Pin your busiest lane</h3>
          <p className="v4-tip__body">
            Open the Visibility model and pin a corridor — you'll get instant alerts whenever a shipment on that route deviates from its plan.
          </p>
          <a href="#" onClick={(e) => e.preventDefault()} className="v4-tip__link">
            Show me how →
          </a>
        </section>
      </div>

      {/* Mini KPI strip at the bottom */}
      <section className="v4-kpis" aria-label="Quick stats">
        {KPIS.map((k, i) => (
          <div key={i} className="v4-kpi">
            <span className="v4-kpi__value">{k.value}</span>
            <span className="v4-kpi__label">{k.label}</span>
          </div>
        ))}
      </section>
    </main>
  );
}

function BackToDesigns() {
  return (
    <Link href="/dashboard/designs" className="dash-back-link" style={{ marginBottom: "1.5rem" }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to designs
    </Link>
  );
}
