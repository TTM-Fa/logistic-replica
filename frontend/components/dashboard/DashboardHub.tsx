"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * DashboardHub — the main workspace landing page.
 *
 * Intentionally focused: a slim welcome line, then the three product
 * models as big hero cards. No news / activity feeds — the models are the
 * point of this page. Each card shows what lives inside the model and
 * links straight into it.
 *
 * Reacts to dark/light automatically via the `--d-*` CSS variables.
 */

// ─── Models — keep in sync with the sub-routes ────────────────────────
// `inside` lists a few key sections per model (reusing existing nav label
// keys) so each card previews what's in there.
const MODELS: {
  key: "visibility" | "marketplace" | "benchmark";
  href: string;
  inside: string[];
  icon: React.ReactNode;
}[] = [
  {
    key: "visibility",
    href: "/dashboard/visibility",
    inside: [
      "visibility.nav.transports",
      "visibility.nav.fleet",
      "visibility.nav.analytics",
      "visibility.nav.network",
    ],
    icon: (
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" aria-hidden="true">
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
    inside: [
      "marketplace.nav.spot",
      "marketplace.nav.lanes",
      "marketplace.nav.rfq",
      "marketplace.nav.analysis",
    ],
    icon: (
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" aria-hidden="true">
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
    inside: [
      "benchmark.nav.market",
      "benchmark.nav.rates",
      "benchmark.nav.capacity",
      "benchmark.nav.costs",
    ],
    icon: (
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" aria-hidden="true">
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

// ─── Helpers ──────────────────────────────────────────────────────────
function getGreetingKey(hour: number): string {
  if (hour >= 5 && hour < 12) return "dashboard.greeting.morning";
  if (hour >= 12 && hour < 17) return "dashboard.greeting.afternoon";
  return "dashboard.greeting.evening";
}

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
  const { lang } = useLanguage();

  // Computed on the client to avoid SSR/locale hydration mismatches.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const greetingKey = now ? getGreetingKey(now.getHours()) : "dashboard.greeting.morning";
  const dateString = now ? formatDate(now, lang) : "";

  return (
    <main className="dash-main">
      {/* ─── Welcome line ───────────────────────────────────────── */}
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
        <div className="dh-welcome__date" aria-label="Today's date">
          <span className="dh-welcome__date-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
              <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span className="dh-welcome__date-text">{dateString || " "}</span>
        </div>
      </section>

      {/* ─── Section heading ────────────────────────────────────── */}
      <div className="dh-models-head">
        <h2 className="dh-models-head__title">
          <T id="dashboard.models.heading" />
        </h2>
        <p className="dh-models-head__sub">
          <T id="dashboard.models.sub" />
        </p>
      </div>

      {/* ─── Three model cards (the hero of this page) ──────────── */}
      <section className="dh-models" aria-label="Models">
        {MODELS.map((m) => (
          <Link key={m.key} href={m.href} className="dh-model-card">
            <span className="dh-model-card__icon" aria-hidden="true">{m.icon}</span>
            <h3 className="dh-model-card__name">
              <T id={`dashboard.${m.key}.title`} />
            </h3>
            <p className="dh-model-card__desc">
              <T id={`dashboard.${m.key}.desc`} />
            </p>

            <ul className="dh-model-card__tags" aria-label="Inside">
              {m.inside.map((k) => (
                <li key={k} className="dh-model-card__tag">
                  <T id={k} />
                </li>
              ))}
            </ul>

            <span className="dh-model-card__explore">
              <T id="dashboard.explore" />
              <svg
                className="dh-model-card__explore-arrow"
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
