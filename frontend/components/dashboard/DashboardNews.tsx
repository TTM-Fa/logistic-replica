"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * DashboardNews (center column of the hub)
 *
 * A "Stay informed" panel with stacked promotional/news cards. In the
 * Transporeon original these are large photo-led banners; we don't have
 * brand photos yet, so each card uses a tasteful gradient background
 * with a label pill + title overlay instead. When we have real photos
 * later, swap the gradient `background:` rule in `.dash-news-card`
 * for a `background-image: url(...)` instead.
 */

const CARDS: {
  key: "platform" | "waitlist";
  badge: string; // translation key for the small pill label
  title: string; // translation key for the headline
  href: string;
  variant: "gold" | "dark";
}[] = [
  {
    key: "platform",
    badge: "dashboard.news.platform.badge",
    title: "dashboard.news.platform.title",
    href: "/about",
    variant: "gold",
  },
  {
    key: "waitlist",
    badge: "dashboard.news.waitlist.badge",
    title: "dashboard.news.waitlist.title",
    href: "/#waitlist",
    variant: "dark",
  },
];

export function DashboardNews() {
  return (
    <section className="dash-news" aria-label="News and announcements">
      <header className="dash-news__header">
        <span className="dash-news__icon" aria-hidden="true">
          {/* Megaphone icon */}
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
        <h2 className="dash-news__title">
          <T id="dashboard.news.heading" />
        </h2>
      </header>

      <div className="dash-news__stack">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className={`dash-news-card dash-news-card--${card.variant}`}
          >
            <span className="dash-news-card__badge">
              <T id={card.badge} />
            </span>
            <h3 className="dash-news-card__title">
              <T id={card.title} />
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
