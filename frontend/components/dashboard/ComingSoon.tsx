"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * Shared "coming soon" page used by every sub-dashboard route until its
 * real UI is built. Keeps each stub page file tiny — they just hand a
 * `model` key in and this renders the appropriate placeholder.
 */
export function ComingSoon({
  model,
}: {
  model: "visibility" | "marketplace" | "benchmark";
}) {
  const { t } = useLanguage();

  return (
    <main className="dash-main">
      <div className="dash-container">
        <Link href="/dashboard" className="dash-back-link">
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

        <div className="dash-soon">
          <span className="dash-soon__eyebrow">
            <T id={`dashboard.${model}.eyebrow`} />
          </span>
          <h1 className="dash-soon__title">
            <T id={`dashboard.${model}.title`} />
          </h1>
          <p className="dash-soon__desc">
            <T id={`dashboard.${model}.desc`} />
          </p>
          <div className="dash-soon__badge" aria-hidden="true">
            <span className="dash-soon__badge-dot" />
            <T id="dashboard.coming_soon" />
          </div>
        </div>
      </div>
    </main>
  );
}
