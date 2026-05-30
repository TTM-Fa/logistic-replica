"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * MarketplaceHome — the Freight Marketplace welcome hub.
 *
 *   - Welcome header
 *   - Quick-stats strip (open loads, lane opportunities, RFQs, your bids)
 *   - Three procurement entry cards (Spot · Lane Requests · RFQ)
 *   - Side column: account-verification progress + recent activity feed
 *
 * All demo data. Class prefix `.mp-` (the benchmark Market page owns `.mk-`).
 */

const STATS = [
  { key: "loads", value: "1,240", labelKey: "marketplace.home.stat.loads", tone: "info" },
  { key: "lanes", value: "38", labelKey: "marketplace.home.stat.lanes", tone: "ok" },
  { key: "rfqs", value: "6", labelKey: "marketplace.home.stat.rfqs", tone: "violet" },
  { key: "bids", value: "12", labelKey: "marketplace.home.stat.bids", tone: "muted" },
] as const;

const ENTRIES = [
  {
    key: "spot",
    href: "/dashboard/marketplace/spot",
    count: "1,240",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "lanes",
    href: "/dashboard/marketplace/lanes",
    count: "38",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <circle cx="5" cy="19" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="19" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M6.7 17.3L17.3 6.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "rfq",
    href: "/dashboard/marketplace/rfq",
    count: "6",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M6 2h8l4 4v16H6zM14 2v4h4M9 13h6M9 17h6M9 9h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// Verification checklist (3 of 4 done → 75%).
const VERIFY = [
  { key: "company", done: true },
  { key: "insurance", done: true },
  { key: "licence", done: true },
  { key: "bank", done: false },
];

const ACTIVITY = [
  { id: "a1", tone: "ok", textKey: "marketplace.home.act1.text", timeKey: "marketplace.home.act1.time" },
  { id: "a2", tone: "info", textKey: "marketplace.home.act2.text", timeKey: "marketplace.home.act2.time" },
  { id: "a3", tone: "violet", textKey: "marketplace.home.act3.text", timeKey: "marketplace.home.act3.time" },
  { id: "a4", tone: "muted", textKey: "marketplace.home.act4.text", timeKey: "marketplace.home.act4.time" },
];

export function MarketplaceHome() {
  const doneCount = VERIFY.filter((v) => v.done).length;
  const verifyPct = Math.round((doneCount / VERIFY.length) * 100);

  return (
    <div className="ro-page mp-home">
      {/* ─── Welcome ────────────────────────────────────────────── */}
      <section className="mp-welcome">
        <span className="mp-welcome__eyebrow"><T id="marketplace.home.eyebrow" /></span>
        <h1 className="mp-welcome__title">
          <T id="marketplace.home.welcome" />, <span className="mp-welcome__name"><T id="dashboard.user.name" /></span>
        </h1>
        <p className="mp-welcome__sub"><T id="marketplace.home.sub" /></p>
      </section>

      {/* ─── Quick stats ────────────────────────────────────────── */}
      <div className="vis-fl-summary">
        {STATS.map((s) => (
          <div key={s.key} className={`vis-fl-stat vis-fl-stat--${s.tone}`}>
            <span className="vis-fl-stat__value">{s.value}</span>
            <span className="vis-fl-stat__label"><T id={s.labelKey} /></span>
          </div>
        ))}
      </div>

      {/* ─── 2-column body ──────────────────────────────────────── */}
      <div className="mp-home__grid">
        {/* Entry cards */}
        <section className="mp-entries" aria-label="Procurement">
          {ENTRIES.map((e) => (
            <Link key={e.key} href={e.href} className="mp-entry">
              <span className="mp-entry__icon" aria-hidden="true">{e.icon}</span>
              <div className="mp-entry__body">
                <span className="mp-entry__eyebrow"><T id={`marketplace.home.${e.key}.eyebrow`} /></span>
                <h2 className="mp-entry__title"><T id={`marketplace.home.${e.key}.title`} /></h2>
                <p className="mp-entry__desc"><T id={`marketplace.home.${e.key}.desc`} /></p>
                <span className="mp-entry__badge">
                  <strong>{e.count}</strong> <T id={`marketplace.home.${e.key}.badge`} />
                </span>
              </div>
              <span className="mp-entry__cta" aria-hidden="true">
                <T id={`marketplace.home.${e.key}.cta`} />
                <svg viewBox="0 0 14 14" width="13" height="13" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </section>

        {/* Side column */}
        <div className="mp-home__side">
          {/* Verification */}
          <section className="mp-card mp-verify" aria-label="Verification">
            <header className="mp-verify__head">
              <h3 className="mp-card__title"><T id="marketplace.home.verify.title" /></h3>
              <span className="mp-verify__pct">{verifyPct}%</span>
            </header>
            <div className="mp-verify__bar" aria-hidden="true">
              <div className="mp-verify__fill" style={{ width: `${verifyPct}%` }} />
            </div>
            <ul className="mp-verify__list">
              {VERIFY.map((v) => (
                <li key={v.key} className={`mp-verify__item${v.done ? " is-done" : ""}`}>
                  <span className="mp-verify__check" aria-hidden="true">
                    {v.done ? (
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" /></svg>
                    )}
                  </span>
                  <T id={`marketplace.home.verify.${v.key}`} />
                </li>
              ))}
            </ul>
            <button type="button" className="ro-action is-primary mp-verify__btn">
              <T id="marketplace.home.verify.complete" />
            </button>
          </section>

          {/* Recent activity */}
          <section className="mp-card mp-activity" aria-label="Recent activity">
            <h3 className="mp-card__title"><T id="marketplace.home.activity.title" /></h3>
            <ul className="mp-activity__list">
              {ACTIVITY.map((a) => (
                <li key={a.id} className="mp-activity__item">
                  <span className={`mp-activity__dot mp-activity__dot--${a.tone}`} aria-hidden="true" />
                  <div className="mp-activity__text">
                    <p><T id={a.textKey} /></p>
                    <span className="mp-activity__time"><T id={a.timeKey} /></span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
