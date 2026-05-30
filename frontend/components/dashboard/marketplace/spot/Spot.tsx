"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  CITIES,
  EQUIPMENT_TYPES,
  LOADS,
  spotStats,
  type CityId,
  type Equipment,
  type SpotLoad,
} from "./spotData";

/**
 * Spot — the Marketplace load board ("Spot shipment finder").
 *
 * A stat strip, a working toolbar (search · equipment filter · sort), and
 * a load-board table: each row is an available GCC spot load with its
 * route itinerary, equipment, distance, shipper, rate, a live offer
 * deadline countdown, and a "Place bid" action. All mock data.
 */

type SortKey = "deadline" | "rate" | "distance";

const SUMMARY = [
  { key: "open", labelKey: "marketplace.spot.sum.open", tone: "info" },
  { key: "fresh", labelKey: "marketplace.spot.sum.fresh", tone: "ok" },
  { key: "closing", labelKey: "marketplace.spot.sum.closing", tone: "alert" },
] as const;

export function Spot() {
  const { t, lang } = useLanguage();
  const cityName = (id: CityId) => (lang === "ar" ? CITIES[id].nameAr : CITIES[id].name);
  const fmt = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

  const [query, setQuery] = useState("");
  const [equip, setEquip] = useState<Equipment | "all">("all");
  const [sort, setSort] = useState<SortKey>("deadline");

  const stats = useMemo(() => spotStats(LOADS), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = LOADS.filter((l) => {
      if (equip !== "all" && l.equipment !== equip) return false;
      if (q) {
        const hay = [l.ref, l.shipper, l.shipperAr, CITIES[l.from].name, CITIES[l.from].nameAr, CITIES[l.to].name, CITIES[l.to].nameAr].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "rate") return b.rate - a.rate;
      if (sort === "distance") return a.distanceKm - b.distanceKm;
      return a.deadlineMin - b.deadlineMin;
    });
    return list;
  }, [query, equip, sort]);

  // Deadline "2h 33m" + urgency tone.
  const deadline = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return [h > 0 ? `${h}${t("visibility.tr.unit_h")}` : "", `${m}${t("visibility.tr.unit_m")}`].filter(Boolean).join(" ");
  };
  const deadlineTone = (min: number) => (min < 60 ? "alert" : min < 180 ? "warn" : "ok");

  return (
    <div className="ro-page mp-spot">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="marketplace.spot.title" /></h1>
          <p className="ro-header__sub"><T id="marketplace.spot.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="marketplace.spot.refresh" /></span>
          </button>
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label"><T id="marketplace.spot.create" /></span>
          </button>
        </div>
      </header>

      {/* ─── Stats ──────────────────────────────────────────────── */}
      <div className="vis-fl-summary">
        {SUMMARY.map((s) => (
          <div key={s.key} className={`vis-fl-stat vis-fl-stat--${s.tone}`}>
            <span className="vis-fl-stat__value">{stats[s.key]}</span>
            <span className="vis-fl-stat__label"><T id={s.labelKey} /></span>
          </div>
        ))}
      </div>

      {/* ─── Toolbar ────────────────────────────────────────────── */}
      <div className="vis-nw-toolbar">
        <div className="vis-tr-search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input type="search" className="vis-tr-search__input" placeholder={t("marketplace.spot.search")} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t("marketplace.spot.search")} />
        </div>
        <div className="vis-fl-select">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path d="M1 16V7h12v9M13 10h4l3 3v3h-7M5 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 5 19zM16 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 16 19z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <select value={equip} onChange={(e) => setEquip(e.target.value as Equipment | "all")} aria-label={t("marketplace.spot.equipment")}>
            <option value="all">{t("marketplace.spot.equip.all")}</option>
            {EQUIPMENT_TYPES.map((eq) => (
              <option key={eq} value={eq}>{t(`visibility.fl.type.${eq}`)}</option>
            ))}
          </select>
        </div>
        <div className="vis-fl-select">
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t("marketplace.spot.sort")}>
            <option value="deadline">{t("marketplace.spot.sort.deadline")}</option>
            <option value="rate">{t("marketplace.spot.sort.rate")}</option>
            <option value="distance">{t("marketplace.spot.sort.distance")}</option>
          </select>
        </div>
        <span className="vis-nw-toolbar__count"><strong>{rows.length}</strong> <T id="marketplace.spot.loads" /></span>
      </div>

      {/* ─── Load board ─────────────────────────────────────────── */}
      <div className="vis-vm-tablewrap">
        <table className="vis-vm-table mp-spot-table">
          <thead>
            <tr>
              <th><T id="marketplace.spot.col.route" /></th>
              <th><T id="marketplace.spot.col.equipment" /></th>
              <th><T id="marketplace.spot.col.distance" /></th>
              <th><T id="marketplace.spot.col.shipper" /></th>
              <th><T id="marketplace.spot.col.rate" /></th>
              <th><T id="marketplace.spot.col.deadline" /></th>
              <th aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="vis-nw-emptycell"><T id="marketplace.spot.empty" /></td></tr>
            ) : (
              rows.map((l) => <Row key={l.id} l={l} shipperName={lang === "ar" ? l.shipperAr : l.shipper} cityName={cityName} fmt={fmt} t={t} deadline={deadline} deadlineTone={deadlineTone} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({
  l, shipperName, cityName, fmt, t, deadline, deadlineTone,
}: {
  l: SpotLoad;
  shipperName: string;
  cityName: (id: CityId) => string;
  fmt: (n: number) => string;
  t: (id: string) => string;
  deadline: (min: number) => string;
  deadlineTone: (min: number) => string;
}) {
  return (
    <tr>
      {/* Route itinerary */}
      <td>
        <div className="mp-spot-route">
          {l.isNew && <span className="mp-spot-new"><T id="marketplace.spot.new" /></span>}
          <div className="mp-spot-stop">
            <span className="mp-spot-stop__dot mp-spot-stop__dot--from" aria-hidden="true" />
            <span className="mp-spot-stop__city">{cityName(l.from)}</span>
            <span className="mp-spot-stop__when">{t(`marketplace.spot.day.${l.pickupDay}`)} · {l.timeWindow}</span>
          </div>
          <div className="mp-spot-stop">
            <span className="mp-spot-stop__dot mp-spot-stop__dot--to" aria-hidden="true" />
            <span className="mp-spot-stop__city">{cityName(l.to)}</span>
            <span className="mp-spot-stop__when">{t(`marketplace.spot.day.${l.dropDay}`)} · {l.timeWindow}</span>
          </div>
        </div>
      </td>

      {/* Equipment */}
      <td>
        <div className="mp-spot-equip">
          <span className="vis-tr-chip vis-tr-chip--muted"><T id={`visibility.fl.type.${l.equipment}`} /></span>
          <span className="mp-spot-equip__detail">
            {l.pallets > 0 ? `${l.pallets} ${t("marketplace.spot.pallets")} · ` : ""}{fmt(l.weightT)} {t("marketplace.spot.tonnes")}
            {l.temp ? ` · ${l.temp}` : ""}
          </span>
        </div>
      </td>

      {/* Distance */}
      <td><span className="mp-spot-dist">{fmt(l.distanceKm)} {t("marketplace.spot.km")}</span></td>

      {/* Shipper */}
      <td><span className="vis-nw-company">{shipperName}</span></td>

      {/* Rate */}
      <td>
        <span className="mp-spot-rate">
          <span className="mp-spot-rate__cur">SAR</span> {fmt(l.rate)}
        </span>
      </td>

      {/* Deadline countdown */}
      <td>
        <span className={`mp-spot-deadline mp-spot-deadline--${deadlineTone(l.deadlineMin)}`}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {deadline(l.deadlineMin)}
        </span>
      </td>

      {/* Bid */}
      <td>
        <button type="button" className="mp-spot-bid"><T id="marketplace.spot.bid" /></button>
      </td>
    </tr>
  );
}
