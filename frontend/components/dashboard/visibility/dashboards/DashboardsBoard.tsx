"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * DashboardsBoard — the Visibility "Dashboards" landing page.
 *
 * A customizable board of KPI "count" widgets. Each widget shows a single
 * operational number (e.g. shipments out for delivery today) plus a row of
 * status chips and a link through to the matching shipment list.
 *
 * Everything here is mock/demo data — when the backend is wired, the
 * WIDGETS array is replaced with values fetched from the API. The board
 * selector and "New widget" button are styled but inert for now (Phase 2
 * shell); they exist so the page reads as a real, interactive product.
 */

// ─── Status chip tones ────────────────────────────────────────────────
// Maps to the .vis-db-chip--<tone> CSS modifier. Keep in sync with CSS.
type Tone = "ok" | "alert" | "info" | "muted";

type Chip = { labelKey: string; tone: Tone };

type Widget = {
  id: string;
  titleKey: string;
  value: number;
  /** Drives the big-number color: ok=green, alert=red, info=gold. */
  accent: "ok" | "alert" | "info";
  icon: React.ReactNode;
  chips: Chip[];
};

// Small inline icons (18px). Stroke uses currentColor so the icon picks up
// the widget's accent color set on the wrapper.
const ic = {
  pickup: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  delivery: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M1 16V6h13v10M14 9h4l3 3v4h-7M5 20a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 5 20zM17 20a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 17 20z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  delayed: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  untracked: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 11.5-5.3M19 8a7 7 0 0 1-.8 3.3M3 3l18 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  completed: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  vehicles: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M1 16V6h13v10M14 9h4l3 3v4h-7M5 20a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 5 20zM17 20a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 17 20z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ─── Demo widgets ─────────────────────────────────────────────────────
const WIDGETS: Widget[] = [
  {
    id: "pickup",
    titleKey: "visibility.db.w.pickup.title",
    value: 24,
    accent: "info",
    icon: ic.pickup,
    chips: [
      { labelKey: "visibility.db.tag.tracking", tone: "info" },
      { labelKey: "visibility.db.tag.on_time", tone: "ok" },
      { labelKey: "visibility.db.tag.towards_pickup", tone: "muted" },
    ],
  },
  {
    id: "delivery",
    titleKey: "visibility.db.w.delivery.title",
    value: 18,
    accent: "info",
    icon: ic.delivery,
    chips: [
      { labelKey: "visibility.db.tag.tracking", tone: "info" },
      { labelKey: "visibility.db.tag.on_time", tone: "ok" },
      { labelKey: "visibility.db.tag.towards_delivery", tone: "muted" },
    ],
  },
  {
    id: "delayed",
    titleKey: "visibility.db.w.delayed.title",
    value: 3,
    accent: "alert",
    icon: ic.delayed,
    chips: [
      { labelKey: "visibility.db.tag.tracking", tone: "info" },
      { labelKey: "visibility.db.tag.delayed", tone: "alert" },
      { labelKey: "visibility.db.tag.towards_delivery", tone: "muted" },
    ],
  },
  {
    id: "untracked",
    titleKey: "visibility.db.w.untracked.title",
    value: 7,
    accent: "alert",
    icon: ic.untracked,
    chips: [
      { labelKey: "visibility.db.tag.awaiting_gps", tone: "alert" },
      { labelKey: "visibility.db.tag.action_needed", tone: "muted" },
    ],
  },
  {
    id: "completed",
    titleKey: "visibility.db.w.completed.title",
    value: 142,
    accent: "ok",
    icon: ic.completed,
    chips: [
      { labelKey: "visibility.db.tag.delivered", tone: "ok" },
      { labelKey: "visibility.db.tag.this_week", tone: "muted" },
    ],
  },
  {
    id: "vehicles",
    titleKey: "visibility.db.w.vehicles.title",
    value: 31,
    accent: "ok",
    icon: ic.vehicles,
    chips: [
      { labelKey: "visibility.db.tag.live_gps", tone: "ok" },
      { labelKey: "visibility.db.tag.moving", tone: "info" },
    ],
  },
];

// Board presets shown in the selector. Inert for now — switching changes
// only the displayed name (Phase 2 shell).
const BOARDS = [
  { key: "ops", labelKey: "visibility.db.board.ops" },
  { key: "delivery", labelKey: "visibility.db.board.delivery" },
  { key: "fleet", labelKey: "visibility.db.board.fleet" },
];

export function DashboardsBoard() {
  const { t, lang } = useLanguage();
  const [board, setBoard] = useState("ops");
  const [bannerOpen, setBannerOpen] = useState(true);

  // Numbers are rendered with the locale's grouping (e.g. 1,142 / ١٬١٤٢).
  const fmt = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

  return (
    <div className="ro-page vis-db">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title">
            <T id="visibility.db.title" />
          </h1>
          <p className="ro-header__sub">
            <T id="visibility.db.sub" />
          </p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action is-primary" title={t("visibility.db.new_widget")}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label">
              <T id="visibility.db.new_widget" />
            </span>
          </button>
          <button type="button" className="ro-action" aria-label={t("visibility.db.menu")} title={t("visibility.db.menu")}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <circle cx="5" cy="12" r="1.6" fill="currentColor" />
              <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              <circle cx="19" cy="12" r="1.6" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {/* ─── Board selector + meta row ──────────────────────────── */}
      <div className="vis-db__bar">
        <div className="vis-db__select">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
            <rect x="14" y="3" width="7" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
            <rect x="3" y="14" width="7" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
            <rect x="14" y="14" width="7" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
          </svg>
          <select
            className="vis-db__select-input"
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            aria-label={t("visibility.db.select.aria")}
          >
            {BOARDS.map((b) => (
              <option key={b.key} value={b.key}>{t(b.labelKey)}</option>
            ))}
          </select>
        </div>
        <span className="vis-db__tag">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <T id="visibility.db.visibility" />
        </span>
        <span className="vis-db__updated">
          <span className="vis-db__updated-dot" aria-hidden="true" />
          <T id="visibility.db.updated" />
        </span>
      </div>

      {/* ─── Welcome banner (dismissible) ───────────────────────── */}
      {bannerOpen && (
        <div className="vis-db-banner" role="note">
          <span className="vis-db-banner__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="vis-db-banner__text">
            <h2 className="vis-db-banner__title">
              <T id="visibility.db.banner.title" />
            </h2>
            <p className="vis-db-banner__sub">
              <T id="visibility.db.banner.text" />
            </p>
          </div>
          <button
            type="button"
            className="vis-db-banner__close"
            onClick={() => setBannerOpen(false)}
            aria-label={t("visibility.db.banner.dismiss")}
            title={t("visibility.db.banner.dismiss")}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* ─── Widget grid ────────────────────────────────────────── */}
      <div className="vis-db-grid">
        {WIDGETS.map((w) => (
          <article key={w.id} className={`vis-db-card vis-db-card--${w.accent}`}>
            <div className="vis-db-card__head">
              <span className="vis-db-card__icon" aria-hidden="true">{w.icon}</span>
              <h3 className="vis-db-card__title">
                <T id={w.titleKey} />
              </h3>
              <button type="button" className="vis-db-card__menu" aria-label={t("visibility.db.menu")} title={t("visibility.db.menu")}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                  <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </button>
            </div>

            <div className="vis-db-card__value">{fmt(w.value)}</div>

            <div className="vis-db-card__meta">
              {w.chips.map((c) => (
                <span key={c.labelKey} className={`vis-db-chip vis-db-chip--${c.tone}`}>
                  <T id={c.labelKey} />
                </span>
              ))}
            </div>

            <a href="/dashboard/visibility/transports" className="vis-db-card__link">
              <T id="visibility.db.card.view" />
              <svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </article>
        ))}

        {/* Add-widget tile */}
        <button type="button" className="vis-db-add">
          <span className="vis-db-add__plus" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="vis-db-add__title">
            <T id="visibility.db.add.title" />
          </span>
          <span className="vis-db-add__text">
            <T id="visibility.db.add.text" />
          </span>
        </button>
      </div>
    </div>
  );
}
