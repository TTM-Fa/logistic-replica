"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  CITIES,
  SHIPMENTS,
  TABS,
  type CityId,
  type Shipment,
  type ShipmentStatus,
  type TabKey,
  matchesTab,
  tabCounts,
} from "./transportsData";

// Leaflet touches `window`, so the map is loaded client-side only. The
// placeholder keeps the panel's size stable while the map chunk loads.
const GccLeafletMap = dynamic(
  () => import("./GccLeafletMap").then((m) => m.GccLeafletMap),
  {
    ssr: false,
    loading: () => <div className="vis-tr-map vis-tr-map--loading" />,
  },
);

/**
 * TransportsView — the Visibility → Transports page.
 *
 * Layout:
 *   - Header (title + search)
 *   - Status tabs (All · Tracking · On time · Delayed · … · Cancelled),
 *     each with a live count; clicking one filters the list.
 *   - Toolbar (Saved filters · Filter · Export · count · Sort by)
 *   - Split body: scrollable shipment list (left) + stylized GCC route
 *     map (right). Selecting a row follows it on the map.
 *
 * All data is mock (see transportsData.ts).
 */

// Which tone each status chip uses (maps to .vis-tr-chip--<tone> CSS).
const STATUS_TONE: Record<ShipmentStatus, "ok" | "alert" | "warn" | "muted" | "info"> = {
  on_time:   "ok",
  delayed:   "alert",
  unknown:   "warn",
  upcoming:  "info",
  untracked: "warn",
  completed: "muted",
  cancelled: "muted",
};

type SortKey = "eta" | "ref" | "status";

export function TransportsView() {
  const { t, lang } = useLanguage();

  const [tab, setTab] = useState<TabKey>("all");
  const [sort, setSort] = useState<SortKey>("eta");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>("s1");

  const cityName = (id: CityId) =>
    lang === "ar" ? CITIES[id].nameAr : CITIES[id].name;

  const counts = useMemo(() => tabCounts(SHIPMENTS), []);

  // Filter by tab + free-text search, then sort.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = SHIPMENTS.filter((s) => matchesTab(s, tab));
    if (q) {
      list = list.filter((s) => {
        const hay = [
          s.ref,
          s.carrier,
          s.carrierAr,
          s.plate,
          CITIES[s.from].name,
          CITIES[s.from].nameAr,
          CITIES[s.to].name,
          CITIES[s.to].nameAr,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }
    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sort === "ref") return a.ref.localeCompare(b.ref);
      if (sort === "status") return a.status.localeCompare(b.status);
      // eta: nulls (no ETA) sink to the bottom
      const av = a.etaMin ?? Number.POSITIVE_INFINITY;
      const bv = b.etaMin ?? Number.POSITIVE_INFINITY;
      return av - bv;
    });
    return sorted;
  }, [tab, sort, query]);

  // Keep the map selection valid as the list changes.
  const selectedVisible = visible.some((s) => s.id === selectedId);
  const mapSelectedId = selectedVisible ? selectedId : null;

  return (
    <div className="ro-page vis-tr">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title">
            <T id="visibility.tr.title" />
          </h1>
          <p className="ro-header__sub">
            <T id="visibility.tr.sub" />
          </p>
        </div>
        <div className="vis-tr-search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className="vis-tr-search__input"
            placeholder={t("visibility.tr.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t("visibility.tr.search")}
          />
        </div>
      </header>

      {/* ─── Status tabs ────────────────────────────────────────── */}
      <nav className="vis-tr-tabs" aria-label={t("visibility.tr.tabs_aria")}>
        {TABS.map((tb) => (
          <button
            key={tb.key}
            type="button"
            className={`vis-tr-tab${tab === tb.key ? " is-active" : ""}`}
            onClick={() => setTab(tb.key)}
            aria-current={tab === tb.key ? "true" : undefined}
          >
            <T id={tb.labelKey} />
            <span className="vis-tr-tab__count">{counts[tb.key]}</span>
          </button>
        ))}
      </nav>

      {/* ─── Toolbar ────────────────────────────────────────────── */}
      <div className="vis-tr-toolbar">
        <button type="button" className="vis-tr-tool">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path d="M5 4h14v3l-5 5v6l-4 2v-8L5 7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          </svg>
          <T id="visibility.tr.saved_filters" />
          <svg viewBox="0 0 10 10" width="9" height="9" fill="none" aria-hidden="true">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="vis-tr-tool">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path d="M3 5h18M6 12h12M10 19h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <T id="visibility.tr.filter" />
        </button>
        <button type="button" className="vis-tr-tool">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path d="M12 3v12M7 10l5 5 5-5M5 21h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <T id="visibility.tr.export" />
        </button>

        <span className="vis-tr-toolbar__count">
          {visible.length} <T id="visibility.tr.count_label" />
        </span>

        <div className="vis-tr-toolbar__spacer" />

        <label className="vis-tr-sort">
          <span className="vis-tr-sort__label">
            <T id="visibility.tr.sort" />:
          </span>
          <select
            className="vis-tr-sort__select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="eta">{t("visibility.tr.sort.eta")}</option>
            <option value="ref">{t("visibility.tr.sort.ref")}</option>
            <option value="status">{t("visibility.tr.sort.status")}</option>
          </select>
        </label>
      </div>

      {/* ─── Split body: list (left) + map (right) ──────────────── */}
      <div className="vis-tr-body">
        <div className="vis-tr-list" role="list">
          {visible.length === 0 ? (
            <div className="vis-tr-empty">
              <T id="visibility.tr.empty" />
            </div>
          ) : (
            visible.map((s) => (
              <ShipmentRow
                key={s.id}
                s={s}
                selected={s.id === mapSelectedId}
                onSelect={() => setSelectedId(s.id)}
                cityName={cityName}
                carrierName={lang === "ar" ? s.carrierAr : s.carrier}
                t={t}
              />
            ))
          )}
        </div>

        <GccLeafletMap shipments={visible} selectedId={mapSelectedId} />
      </div>
    </div>
  );
}

// ─── A single shipment row in the list ────────────────────────────────
function ShipmentRow({
  s,
  selected,
  onSelect,
  cityName,
  carrierName,
  t,
}: {
  s: Shipment;
  selected: boolean;
  onSelect: () => void;
  cityName: (id: CityId) => string;
  carrierName: string;
  t: (id: string) => string;
}) {
  const tone = STATUS_TONE[s.status];

  // ETA / status line shown under the route.
  const etaText = (() => {
    if (s.status === "completed") return t("visibility.tr.delivered");
    if (s.status === "cancelled") return t("visibility.tr.status.cancelled");
    if (s.status === "upcoming") return t("visibility.tr.not_started");
    if (s.etaMin == null) return "—";
    const h = Math.floor(s.etaMin / 60);
    const m = s.etaMin % 60;
    const parts = [
      h > 0 ? `${h}${t("visibility.tr.unit_h")}` : "",
      m > 0 ? `${m}${t("visibility.tr.unit_m")}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `${t("visibility.tr.eta")} · ${parts}`;
  })();

  const updatedText =
    s.updatedMin == null
      ? t("visibility.tr.no_signal")
      : `${s.updatedMin} ${t("visibility.tr.min_ago")}`;

  return (
    <button
      type="button"
      role="listitem"
      className={`vis-tr-card${selected ? " is-selected" : ""}`}
      onClick={onSelect}
    >
      <div className="vis-tr-card__top">
        <span className="vis-tr-card__ref">{s.ref}</span>
        <span className={`vis-tr-chip vis-tr-chip--${tone}`}>
          {s.tracking && (s.status === "on_time" || s.status === "delayed") && (
            <span className="vis-tr-chip__dot" aria-hidden="true" />
          )}
          <T id={`visibility.tr.status.${s.status}`} />
        </span>
      </div>

      {/* Route */}
      <div className="vis-tr-card__route">
        <span className="vis-tr-card__city">{cityName(s.from)}</span>
        <svg className="vis-tr-card__arrow" viewBox="0 0 24 14" width="22" height="13" fill="none" aria-hidden="true">
          <path d="M1 7h20M16 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="vis-tr-card__city">{cityName(s.to)}</span>
      </div>

      {/* Progress bar */}
      <div className="vis-tr-card__progress" aria-hidden="true">
        <div
          className={`vis-tr-card__progress-fill vis-tr-card__progress-fill--${tone}`}
          style={{ width: `${Math.round(s.progress * 100)}%` }}
        />
      </div>

      {/* Meta footer */}
      <div className="vis-tr-card__meta">
        <span className="vis-tr-card__carrier">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
            <path d="M1 16V7h12v9M13 10h4l3 3v3h-7M5 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 5 19zM16 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 16 19z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="vis-tr-card__carrier-name">{carrierName}</span>
          <span className="vis-tr-card__plate">{s.plate}</span>
        </span>
        <span className="vis-tr-card__eta">{etaText}</span>
      </div>

      <div className="vis-tr-card__updated">
        <span className={`vis-tr-card__updated-dot${s.tracking ? " is-live" : ""}`} aria-hidden="true" />
        {updatedText}
      </div>
    </button>
  );
}
