"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { FleetRoster } from "./FleetRoster";
import {
  VEHICLES,
  fleetCounts,
  filterVehicles,
  type GroupFilter,
  type StatusFilter,
} from "./fleetData";

// Leaflet map is client-only.
const FleetMap = dynamic(() => import("./FleetMap").then((m) => m.FleetMap), {
  ssr: false,
  loading: () => <div className="vis-fl-map vis-fl-map--loading" />,
});

/**
 * FleetMonitor — the Visibility → Fleet page ("Fleet monitor").
 *
 * Header + toolbar (vehicle-group filter · status filter · List/Map view
 * toggle · available count), a fleet status summary strip, then either
 * the readable vehicle roster or the Leaflet position map. Mock data.
 */

type ViewMode = "list" | "map";

// Status summary cards. `tone` maps to .vis-fl-stat--<tone>.
const SUMMARY: { key: keyof ReturnType<typeof fleetCounts>; labelKey: string; tone: string }[] = [
  { key: "driving", labelKey: "visibility.fl.sum.driving", tone: "ok" },
  { key: "delayed", labelKey: "visibility.fl.sum.delayed", tone: "alert" },
  { key: "loading", labelKey: "visibility.fl.sum.loading", tone: "info" },
  { key: "idle", labelKey: "visibility.fl.sum.idle", tone: "muted" },
  { key: "maintenance", labelKey: "visibility.fl.sum.maintenance", tone: "warn" },
];

export function FleetMonitor() {
  const { t } = useLanguage();
  const [group, setGroup] = useState<GroupFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [view, setView] = useState<ViewMode>("list");

  const vehicles = useMemo(
    () => filterVehicles(VEHICLES, group, status),
    [group, status],
  );
  const counts = useMemo(() => fleetCounts(vehicles), [vehicles]);
  const availableCount = counts.driving + counts.idle;

  return (
    <div className="ro-page vis-fl">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title">
            <T id="visibility.fl.title" />
          </h1>
          <p className="ro-header__sub">
            <T id="visibility.fl.sub" />
          </p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label">
              <T id="visibility.fl.allocate" />
            </span>
          </button>
        </div>
      </header>

      {/* ─── Status summary strip ───────────────────────────────── */}
      <div className="vis-fl-summary">
        {SUMMARY.map((s) => (
          <div key={s.key} className={`vis-fl-stat vis-fl-stat--${s.tone}`}>
            <span className="vis-fl-stat__value">{counts[s.key]}</span>
            <span className="vis-fl-stat__label">
              <T id={s.labelKey} />
            </span>
          </div>
        ))}
      </div>

      {/* ─── Toolbar ────────────────────────────────────────────── */}
      <div className="vis-fl-toolbar">
        {/* Group filter */}
        <div className="vis-fl-select">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path d="M1 16V7h12v9M13 10h4l3 3v3h-7M5 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 5 19zM16 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 16 19z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <select value={group} onChange={(e) => setGroup(e.target.value as GroupFilter)} aria-label={t("visibility.fl.filter.group")}>
            <option value="all">{t("visibility.fl.group.all")}</option>
            <option value="dedicated">{t("visibility.fl.group.dedicated")}</option>
            <option value="partner">{t("visibility.fl.group.partner")}</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="vis-fl-select">
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} aria-label={t("visibility.fl.filter.status")}>
            <option value="all">{t("visibility.fl.status.all")}</option>
            <option value="driving">{t("visibility.fl.status.driving")}</option>
            <option value="idle">{t("visibility.fl.status.idle")}</option>
            <option value="loading">{t("visibility.fl.status.loading")}</option>
            <option value="maintenance">{t("visibility.fl.status.maintenance")}</option>
          </select>
        </div>

        {/* View toggle */}
        <div className="vis-fl-toggle" role="tablist" aria-label={t("visibility.fl.view")}>
          <button
            type="button"
            role="tab"
            aria-selected={view === "list"}
            className={`vis-fl-toggle__btn${view === "list" ? " is-active" : ""}`}
            onClick={() => setView("list")}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <T id="visibility.fl.list" />
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "map"}
            className={`vis-fl-toggle__btn${view === "map" ? " is-active" : ""}`}
            onClick={() => setView("map")}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <T id="visibility.fl.map" />
          </button>
        </div>

        <span className="vis-fl-toolbar__count">
          <strong>{availableCount}</strong> <T id="visibility.fl.available" />
        </span>
      </div>

      {/* ─── View ───────────────────────────────────────────────── */}
      {view === "list" ? (
        <FleetRoster vehicles={vehicles} />
      ) : (
        <FleetMap vehicles={vehicles} />
      )}
    </div>
  );
}
