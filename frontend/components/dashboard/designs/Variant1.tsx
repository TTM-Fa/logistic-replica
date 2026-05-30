"use client";

import Link from "next/link";

/**
 * Variant 1 — "Spotlight"
 *
 * Light & bright SaaS feel. The page reads top-down:
 *   1. Welcome hero strip with gold gradient + greeting
 *   2. The 3 models as large horizontal cards (the hero of the page)
 *   3. A 4-KPI strip with mock numbers
 *   4. Recent activity feed (mock shipment status updates)
 *
 * All CSS classes are prefixed `.v1-` to keep this variant's styles
 * isolated from the other variants.
 */

const MODELS = [
  {
    key: "visibility",
    href: "/dashboard/visibility",
    title: "Visibility",
    desc: "Track every shipment in real time across ports, carriers, and customs.",
    badge: "LIVE TRACKING",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "marketplace",
    href: "/dashboard/marketplace",
    title: "Marketplace",
    desc: "Compare bids from regional carriers and book on transparent terms.",
    badge: "12 OFFERS WAITING",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 14h6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "benchmark",
    href: "/dashboard/benchmark",
    title: "Rate Benchmark",
    desc: "See how your freight rates compare to the regional market.",
    badge: "WEEKLY UPDATE",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const KPIS = [
  { value: "247", label: "Active shipments" },
  { value: "94%", label: "On-time rate" },
  { value: "12", label: "Corridors live" },
  { value: "QAR 1.2M", label: "Volume this month" },
];

// Recent activity feed — simulated shipment status updates
const ACTIVITY = [
  { id: "SHN-2847", action: "Cleared customs at Hamad Port", time: "2 min ago", status: "ok" },
  { id: "SHN-2841", action: "Picked up from Jebel Ali warehouse", time: "18 min ago", status: "ok" },
  { id: "SHN-2839", action: "Delayed at UAE-Saudi border", time: "1 h ago", status: "warn" },
  { id: "SHN-2832", action: "Delivered to consignee (Doha)", time: "3 h ago", status: "done" },
];

export function Variant1() {
  return (
    <main className="dash-main v1-shell">
      <BackToDesigns />

      {/* Welcome hero — gold gradient with greeting */}
      <section className="v1-hero">
        <div className="v1-hero__content">
          <p className="eyebrow v1-hero__eyebrow">SPOTLIGHT · YOUR WORKSPACE</p>
          <h1 className="v1-hero__heading">
            Good morning, <span className="v1-hero__name">Nasser</span>
          </h1>
          <p className="v1-hero__sub">
            Three models, one workspace. Pick where you want to start — or check the activity below.
          </p>
        </div>
        <div className="v1-hero__decor" aria-hidden="true">
          <span className="v1-hero__orb v1-hero__orb--big" />
          <span className="v1-hero__orb v1-hero__orb--small" />
        </div>
      </section>

      {/* 3 model cards in a horizontal row */}
      <section className="v1-models" aria-label="Models">
        {MODELS.map((m) => (
          <Link key={m.key} href={m.href} className="v1-model-card">
            <span className="v1-model-card__icon" aria-hidden="true">{m.icon}</span>
            <h3 className="v1-model-card__title">{m.title}</h3>
            <p className="v1-model-card__desc">{m.desc}</p>
            <span className="v1-model-card__badge">{m.badge}</span>
            <span className="v1-model-card__cta">
              Open
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </section>

      {/* KPI strip with gold dividers */}
      <section className="v1-kpis" aria-label="Key metrics">
        {KPIS.map((k, i) => (
          <div key={i} className="v1-kpi">
            <span className="v1-kpi__value">{k.value}</span>
            <span className="v1-kpi__label">{k.label}</span>
          </div>
        ))}
      </section>

      {/* Recent activity feed */}
      <section className="v1-activity" aria-label="Recent activity">
        <header className="v1-activity__header">
          <h2 className="v1-activity__heading">Recent activity</h2>
          <a href="#" onClick={(e) => e.preventDefault()} className="v1-activity__link">View all →</a>
        </header>
        <ul className="v1-activity__list">
          {ACTIVITY.map((a, i) => (
            <li key={i} className={`v1-activity-item v1-activity-item--${a.status}`}>
              <span className="v1-activity-item__dot" aria-hidden="true" />
              <span className="v1-activity-item__id">{a.id}</span>
              <span className="v1-activity-item__action">{a.action}</span>
              <span className="v1-activity-item__time">{a.time}</span>
            </li>
          ))}
        </ul>
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
