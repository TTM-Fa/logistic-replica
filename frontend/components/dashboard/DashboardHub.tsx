"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * DashboardHub — the simple, clean main dashboard.
 *
 * Top to bottom:
 *   1. Welcome box  — time-based greeting + name + today's date
 *   2. Three model cards (Visibility · Marketplace · Rate Benchmark)
 *      with just an icon + name. Nothing else.
 *   3. Two side-by-side panels: Latest news + Notifications
 *
 * No KPIs / stats — the user explicitly didn't want them.
 *
 * The page reacts to dark/light mode automatically via CSS variables
 * (see globals.css — every dashboard color is `var(--d-*)`).
 */

// ─── Models — keep this list in sync with the sub-routes ──────────────
const MODELS: { key: "visibility" | "marketplace" | "benchmark"; href: string; icon: React.ReactNode }[] = [
  {
    key: "visibility",
    href: "/dashboard/visibility",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "marketplace",
    href: "/dashboard/marketplace",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden="true">
        <path
          d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 14h6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "benchmark",
    href: "/dashboard/benchmark",
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" aria-hidden="true">
        <path
          d="M4 20V10M10 20V4M16 20v-7M22 20H2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

// ─── News & Notifications ─────────────────────────────────────────────
// Mocked content — when the backend is wired, these arrays are replaced
// with data fetched from the API. Each item has an `id` so the keys are
// stable for React.

const NEWS = [
  { id: "n1", titleKey: "dashboard.news1.title", timeKey: "dashboard.news1.time" },
  { id: "n2", titleKey: "dashboard.news2.title", timeKey: "dashboard.news2.time" },
  { id: "n3", titleKey: "dashboard.news3.title", timeKey: "dashboard.news3.time" },
];

const NOTIFICATIONS = [
  { id: "x1", textKey: "dashboard.notif1.text", timeKey: "dashboard.notif1.time", kind: "info" as const },
  { id: "x2", textKey: "dashboard.notif2.text", timeKey: "dashboard.notif2.time", kind: "ok" as const },
  { id: "x3", textKey: "dashboard.notif3.text", timeKey: "dashboard.notif3.time", kind: "alert" as const },
];

// ─── Helpers ──────────────────────────────────────────────────────────
/**
 * Pick the right greeting key based on the current local hour.
 *   Morning   = 5 AM – 11:59 AM
 *   Afternoon = 12 PM – 4:59 PM
 *   Evening   = 5 PM – 4:59 AM
 */
function getGreetingKey(hour: number): string {
  if (hour >= 5 && hour < 12) return "dashboard.greeting.morning";
  if (hour >= 12 && hour < 17) return "dashboard.greeting.afternoon";
  return "dashboard.greeting.evening";
}

/**
 * Format today's date in a friendly form: "Tuesday, May 13, 2026" in
 * English / "الثلاثاء، 13 مايو 2026" in Arabic.
 */
function formatDate(date: Date, lang: "en" | "ar"): string {
  const locale = lang === "ar" ? "ar" : "en-US";
  return date.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function DashboardHub() {
  const { lang, t } = useLanguage();

  // Date is stored in state because formatDate uses the user's locale —
  // we want the value computed on the client (avoids SSR hydration mismatch
  // when the server's locale differs from the browser's).
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const greetingKey = now ? getGreetingKey(now.getHours()) : "dashboard.greeting.morning";
  const dateString = now ? formatDate(now, lang) : "";

  return (
    <main className="dash-main">
      {/* ─── 1. Welcome box ─────────────────────────────────────── */}
      <section className="dh-welcome" aria-label="Welcome">
        <div className="dh-welcome__text">
          <p className="dh-welcome__sub">
            <T id="dashboard.welcome.again" />
          </p>
          <h1 className="dh-welcome__heading">
            <T id={greetingKey} />,{" "}
            <span className="dh-welcome__name">
              <T id="dashboard.user.name" />
            </span>
          </h1>
        </div>
        {/* Date sits on the right on desktop; below the greeting on mobile.
            Rendered only after mount so server/client output matches. */}
        <div className="dh-welcome__date" aria-label="Today's date">
          <span className="dh-welcome__date-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M3 10h18M8 3v4M16 3v4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="dh-welcome__date-text">{dateString || "\u00A0"}</span>
        </div>
      </section>

      {/* ─── 2-column grid: models (left) | news + notifications (right) ── */}
      <div className="dh-page-grid">
        {/* LEFT — three big glass-pill model cards, stacked vertically.
            Hovering any one applies the focus-blur-siblings effect
            (the other two dim and softly blur). */}
        <section className="dh-models" aria-label="Models">
          {MODELS.map((m) => (
            <Link key={m.key} href={m.href} className="dh-model-card">
              <span className="dh-model-card__icon" aria-hidden="true">{m.icon}</span>
              <div className="dh-model-card__body">
                <h3 className="dh-model-card__name">
                  <T id={`dashboard.${m.key}.title`} />
                </h3>
                <p className="dh-model-card__desc">
                  <T id={`dashboard.${m.key}.desc`} />
                </p>
              </div>
              {/* Explore-on-hover pill (per the `explore-hover-pill` skill) */}
              <span className="dh-model-card__explore" aria-hidden="true">
                <T id="dashboard.explore" />
                <svg
                  className="dh-model-card__explore-arrow"
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </section>

        {/* RIGHT — news on top, notifications underneath */}
        <div className="dh-content">
        {/* News */}
        <section className="dh-panel" aria-label="Latest news">
          <header className="dh-panel__header">
            <span className="dh-panel__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 11v2a3 3 0 0 0 3 3h1l4 4V4l-4 4H6a3 3 0 0 0-3 3zM17 8a5 5 0 0 1 0 8M19 5a8 8 0 0 1 0 14"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className="dh-panel__title">
              <T id="dashboard.news.heading" />
            </h2>
          </header>
          <ul className="dh-panel__list">
            {NEWS.map((item) => (
              <li key={item.id} className="dh-news-item">
                <p className="dh-news-item__title">
                  <T id={item.titleKey} />
                </p>
                <span className="dh-news-item__time">
                  <T id={item.timeKey} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Notifications */}
        <section className="dh-panel" aria-label="Notifications">
          <header className="dh-panel__header">
            <span className="dh-panel__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className="dh-panel__title">
              <T id="dashboard.notifications.heading" />
            </h2>
          </header>
          <ul className="dh-panel__list">
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className={`dh-notif dh-notif--${n.kind}`}>
                <span className="dh-notif__dot" aria-hidden="true" />
                <div>
                  <p className="dh-notif__text">
                    <T id={n.textKey} />
                  </p>
                  <span className="dh-notif__time">
                    <T id={n.timeKey} />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
        </div>
      </div>
    </main>
  );
}
