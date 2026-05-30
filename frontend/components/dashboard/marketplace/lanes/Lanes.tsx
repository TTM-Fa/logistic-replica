"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  CITIES,
  EQUIPMENT_TYPES,
  LANES,
  laneStats,
  type CityId,
  type Equipment,
  type LaneRequest,
} from "./lanesData";

/**
 * Lanes — the Marketplace → Lane Requests ("Opportunities") page.
 *
 * A stat strip, a working toolbar (search · equipment · My favourites ·
 * sort), and a list of lane-request opportunity cards. Each card can be
 * favourited (local state). All mock data.
 */

type SortKey = "deadline" | "shipments" | "newest";

const SUMMARY = [
  { key: "open", labelKey: "marketplace.lanes.sum.open", tone: "info" },
  { key: "fresh", labelKey: "marketplace.lanes.sum.new", tone: "ok" },
  { key: "closing", labelKey: "marketplace.lanes.sum.closing", tone: "alert" },
] as const;

const deadlineTone = (days: number) => (days <= 3 ? "alert" : days <= 10 ? "warn" : "ok");

export function Lanes() {
  const { t, lang } = useLanguage();
  const cityName = (id: CityId) => (lang === "ar" ? CITIES[id].nameAr : CITIES[id].name);
  const fmt = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

  const [query, setQuery] = useState("");
  const [equip, setEquip] = useState<Equipment | "all">("all");
  const [favOnly, setFavOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("deadline");
  const [favs, setFavs] = useState<Set<string>>(new Set());

  const toggleFav = (id: string) =>
    setFavs((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const stats = useMemo(() => laneStats(LANES), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = LANES.filter((l) => {
      if (equip !== "all" && l.equipment !== equip) return false;
      if (favOnly && !favs.has(l.id)) return false;
      if (q) {
        const hay = [l.shipper, l.shipperAr, CITIES[l.from].name, CITIES[l.from].nameAr, CITIES[l.to].name, CITIES[l.to].nameAr].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "shipments") return b.shipments - a.shipments;
      if (sort === "newest") return a.postedDaysAgo - b.postedDaysAgo;
      return a.deadlineDays - b.deadlineDays;
    });
    return list;
  }, [query, equip, favOnly, sort, favs]);

  return (
    <div className="ro-page mp-lanes">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="marketplace.lanes.title" /></h1>
          <p className="ro-header__sub"><T id="marketplace.lanes.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="marketplace.lanes.download" /></span>
          </button>
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label"><T id="marketplace.lanes.create" /></span>
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
          <input type="search" className="vis-tr-search__input" placeholder={t("marketplace.lanes.search")} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t("marketplace.lanes.search")} />
        </div>
        <div className="vis-fl-select">
          <select value={equip} onChange={(e) => setEquip(e.target.value as Equipment | "all")} aria-label={t("marketplace.spot.equipment")}>
            <option value="all">{t("marketplace.spot.equip.all")}</option>
            {EQUIPMENT_TYPES.map((eq) => (
              <option key={eq} value={eq}>{t(`visibility.fl.type.${eq}`)}</option>
            ))}
          </select>
        </div>
        <button type="button" className={`mp-lane-favbtn${favOnly ? " is-on" : ""}`} onClick={() => setFavOnly((v) => !v)} aria-pressed={favOnly}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill={favOnly ? "currentColor" : "none"} aria-hidden="true">
            <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 21.4l1.1-6.5L2.6 9.8l6.5-.9L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <T id="marketplace.lanes.favorites" />
        </button>
        <div className="vis-fl-select">
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t("marketplace.lanes.sort")}>
            <option value="deadline">{t("marketplace.lanes.sort.deadline")}</option>
            <option value="shipments">{t("marketplace.lanes.sort.shipments")}</option>
            <option value="newest">{t("marketplace.lanes.sort.newest")}</option>
          </select>
        </div>
        <span className="vis-nw-toolbar__count"><strong>{rows.length}</strong> <T id="marketplace.lanes.count" /></span>
      </div>

      {/* ─── Opportunity cards ──────────────────────────────────── */}
      {rows.length === 0 ? (
        <div className="vis-vm-empty"><T id="marketplace.lanes.empty" /></div>
      ) : (
        <div className="mp-lane-list">
          {rows.map((l) => (
            <Card key={l.id} l={l} fav={favs.has(l.id)} onFav={() => toggleFav(l.id)} cityName={cityName} fmt={fmt} t={t} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

function Card({
  l, fav, onFav, cityName, fmt, t, lang,
}: {
  l: LaneRequest;
  fav: boolean;
  onFav: () => void;
  cityName: (id: CityId) => string;
  fmt: (n: number) => string;
  t: (id: string) => string;
  lang: string;
}) {
  const shipper = lang === "ar" ? l.shipperAr : l.shipper;
  const tone = deadlineTone(l.deadlineDays);

  return (
    <article className="mp-lane-card">
      {/* Header */}
      <div className="mp-lane-card__head">
        <div className="mp-lane-card__title-wrap">
          {l.isNew && <span className="mp-spot-new mp-lane-card__new"><T id="marketplace.lanes.new" /></span>}
          <h2 className="mp-lane-card__title">
            {cityName(l.from)}
            <svg className="mp-lane-card__arrow" viewBox="0 0 24 14" width="22" height="13" fill="none" aria-hidden="true">
              <path d="M1 7h20M16 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {cityName(l.to)}
          </h2>
          <p className="mp-lane-card__shipper">{shipper}</p>
        </div>
        <button type="button" className={`mp-lane-star${fav ? " is-on" : ""}`} onClick={onFav} aria-pressed={fav} aria-label={t("marketplace.lanes.favorite")} title={t("marketplace.lanes.favorite")}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill={fav ? "currentColor" : "none"} aria-hidden="true">
            <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 21.4l1.1-6.5L2.6 9.8l6.5-.9L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Chips */}
      <div className="mp-lane-card__chips">
        <span className="vis-tr-chip vis-tr-chip--muted">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true"><path d="M1 16V7h12v9M13 10h4l3 3v3h-7M5 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 5 19zM16 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 16 19z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <T id="marketplace.lanes.mode.road" />
        </span>
        <span className="vis-tr-chip vis-tr-chip--muted"><T id={`visibility.fl.type.${l.equipment}`} /></span>
        <span className="vis-tr-chip vis-tr-chip--info"><T id={`marketplace.lanes.scope.${l.scope}`} /></span>
      </div>

      {/* Meta grid */}
      <div className="mp-lane-card__grid">
        <Metric labelKey="marketplace.lanes.f.lane" value={l.stops > 0 ? `${l.stops} ${t("marketplace.lanes.stops")}` : t("marketplace.lanes.direct")} />
        <Metric labelKey="marketplace.lanes.f.shipments" value={`${fmt(l.shipments)} ${t("marketplace.lanes.shipments")}`} />
        <Metric labelKey="marketplace.lanes.f.contract" value={`${fmt(l.contractMonths)} ${t("marketplace.lanes.months")}`} />
        <Metric labelKey="marketplace.lanes.f.posted" value={l.postedDaysAgo === 0 ? t("marketplace.spot.day.today") : `${fmt(l.postedDaysAgo)}${t("visibility.no.unit_d")} ${t("visibility.vm.ago")}`} />
      </div>

      {/* Footer */}
      <div className="mp-lane-card__foot">
        <span className={`mp-lane-deadline mp-lane-deadline--${tone}`}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <T id="marketplace.lanes.deadline" />: {t("marketplace.lanes.in")} {fmt(l.deadlineDays)}{t("visibility.no.unit_d")}
        </span>
        <button type="button" className="mp-lane-details"><T id="marketplace.lanes.details" /></button>
      </div>
    </article>
  );
}

function Metric({ labelKey, value }: { labelKey: string; value: string }) {
  return (
    <div className="mp-lane-metric">
      <span className="mp-lane-metric__label"><T id={labelKey} /></span>
      <span className="mp-lane-metric__value">{value}</span>
    </div>
  );
}
