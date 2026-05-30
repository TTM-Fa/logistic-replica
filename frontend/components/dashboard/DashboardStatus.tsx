"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * DashboardStatus (right column of the hub)
 *
 * A vertical stack of small status / quick-info cards. Five cards total,
 * mirroring the Transporeon pattern:
 *
 *   1. Help              — pointer to the help/docs area
 *   2. Release notes     — what's new in the latest release
 *   3. Offers            — count of transports awaiting an offer (mocked 0)
 *   4. Unconfirmed       — count of transports awaiting confirmation (mocked 0)
 *   5. System status     — green dot + "All systems operational"
 *
 * Counts are placeholder 0s until the backend is wired. The "value"
 * shown on each card comes through the translations file, so a real
 * backend hook later just replaces those strings with live numbers.
 */

const CARDS: {
  key: "help" | "release" | "offers" | "unconfirmed" | "system";
  icon: React.ReactNode;
  hasValue?: boolean; // cards 3 and 4 show a big "0" number; the others are pure description cards
  variant?: "system"; // last card has special green-dot styling
}[] = [
  {
    key: "help",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "release",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6M9 9h2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "offers",
    hasValue: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="7" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "unconfirmed",
    hasValue: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 22h14a2 2 0 0 0 2-2V8l-7-6H5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2zM9 11l3 3 6-6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "system",
    variant: "system",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M12 8v4M12 16h.01"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function DashboardStatus() {
  return (
    <aside className="dash-status" aria-label="Quick status">
      {CARDS.map((card) => (
        <article
          key={card.key}
          className={`dash-status-card${
            card.variant ? ` dash-status-card--${card.variant}` : ""
          }`}
        >
          <header className="dash-status-card__header">
            <span className="dash-status-card__icon" aria-hidden="true">
              {card.icon}
            </span>
            <h4 className="dash-status-card__title">
              <T id={`dashboard.status.${card.key}.title`} />
            </h4>
          </header>

          {/* Cards 3 and 4 show a big "0" before the description, like
              Transporeon's "0 Transports waiting for your offer". */}
          {card.hasValue && (
            <p className="dash-status-card__value">
              <T id={`dashboard.status.${card.key}.value`} />
            </p>
          )}

          <p className="dash-status-card__desc">
            {/* System-status card has its own pulsing green dot before the text */}
            {card.variant === "system" && (
              <span className="dash-status-card__dot" aria-hidden="true" />
            )}
            <T id={`dashboard.status.${card.key}.desc`} />
          </p>
        </article>
      ))}
    </aside>
  );
}
