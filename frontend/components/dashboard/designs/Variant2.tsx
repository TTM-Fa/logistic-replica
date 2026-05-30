"use client";

import Link from "next/link";

/**
 * Variant 2 — "Bento"
 *
 * Dark, modern, asymmetric grid. Mixes the 3 models with stat tiles and
 * quick-action tiles in a single bento-style grid (different tile sizes
 * arranged like a Japanese lunchbox — hence "bento").
 *
 * Layout (desktop, 4-column grid):
 *
 *   ┌──────── VISIBILITY (2x2 big tile) ─────────┐ ┌── KPI ──┐ ┌── KPI ──┐
 *   │                                            │ └─────────┘ └─────────┘
 *   │                                            │ ┌── MARKETPLACE ──────┐
 *   │                                            │ │ (2x1 wide)          │
 *   └────────────────────────────────────────────┘ └─────────────────────┘
 *   ┌──── BENCHMARK (2x1 wide) ────┐ ┌── QUICK ACTIONS (2x1 wide) ─────┐
 *   └──────────────────────────────┘ └─────────────────────────────────┘
 *
 * All CSS classes are prefixed `.v2-` to keep this variant isolated.
 */

export function Variant2() {
  return (
    <main className="dash-main v2-shell">
      <BackToDesigns />

      <header className="v2-header">
        <p className="eyebrow v2-header__eyebrow">BENTO · YOUR WORKSPACE</p>
        <h1 className="v2-header__heading">
          Welcome back, <span className="v2-header__name">Nasser</span>
        </h1>
      </header>

      <div className="v2-grid">
        {/* BIG VISIBILITY TILE — spans 2x2 */}
        <Link href="/dashboard/visibility" className="v2-tile v2-tile--visibility">
          <div className="v2-tile__top">
            <span className="v2-tile__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </span>
            <span className="v2-tile__live" aria-hidden="true">
              <span className="v2-tile__live-dot" /> LIVE
            </span>
          </div>
          <div className="v2-tile__body">
            <h3 className="v2-tile__title">Visibility</h3>
            <p className="v2-tile__desc">
              247 active shipments across 12 corridors. Click to open the live tracker.
            </p>
          </div>
          {/* Mini-map placeholder — a fake route line */}
          <div className="v2-tile__minimap" aria-hidden="true">
            <svg viewBox="0 0 240 100" width="100%" height="100%" fill="none" preserveAspectRatio="none">
              <path d="M10 80 Q 60 10, 130 50 T 230 30" stroke="#FCBA02" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="10" cy="80" r="4" fill="#FCBA02" />
              <circle cx="130" cy="50" r="3" fill="#FCBA02" opacity="0.7" />
              <circle cx="230" cy="30" r="4" fill="#FCBA02" />
            </svg>
          </div>
        </Link>

        {/* TWO STAT TILES (top right) */}
        <div className="v2-tile v2-tile--stat">
          <span className="v2-stat__value">94%</span>
          <span className="v2-stat__label">On-time</span>
          <span className="v2-stat__delta">↑ 2.1%</span>
        </div>
        <div className="v2-tile v2-tile--stat">
          <span className="v2-stat__value">QAR 1.2M</span>
          <span className="v2-stat__label">This month</span>
          <span className="v2-stat__delta">↑ 8.4%</span>
        </div>

        {/* MARKETPLACE — wide tile */}
        <Link href="/dashboard/marketplace" className="v2-tile v2-tile--marketplace">
          <div className="v2-tile__top">
            <span className="v2-tile__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 14h6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </span>
            <span className="v2-tile__pill">12 OFFERS</span>
          </div>
          <h3 className="v2-tile__title">Marketplace</h3>
          <p className="v2-tile__desc">12 carriers bidding now on your active lanes.</p>
        </Link>

        {/* RATE BENCHMARK — wide tile */}
        <Link href="/dashboard/benchmark" className="v2-tile v2-tile--benchmark">
          <div className="v2-tile__top">
            <span className="v2-tile__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="v2-tile__pill">−4% VS MARKET</span>
          </div>
          <h3 className="v2-tile__title">Rate Benchmark</h3>
          <p className="v2-tile__desc">You&apos;re paying 4% under regional median this week. 🎯</p>
        </Link>

        {/* QUICK ACTIONS tile */}
        <div className="v2-tile v2-tile--actions">
          <h4 className="v2-actions__heading">Quick actions</h4>
          <div className="v2-actions__row">
            <button type="button" className="v2-action-btn">+ New shipment</button>
            <button type="button" className="v2-action-btn">Get a quote</button>
            <button type="button" className="v2-action-btn">Invite team</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function BackToDesigns() {
  return (
    <Link href="/dashboard/designs" className="v2-back-link">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to designs
    </Link>
  );
}
