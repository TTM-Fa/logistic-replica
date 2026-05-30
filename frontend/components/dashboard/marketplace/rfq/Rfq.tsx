"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  RFQS,
  TABS,
  matchesTab,
  tabCounts,
  type Rfq as RfqType,
  type RfqStatus,
  type TabKey,
} from "./rfqData";

/**
 * Rfq — the Marketplace → RFQ (tender events) page.
 *
 * A stat strip, status tabs (All · Open · Closing soon · In evaluation ·
 * Awarded) with live counts, and a grid of tender cards. Each card shows
 * the tender's scope, key figures (lanes, annual volume, term, regions),
 * round progress, and the relevant deadline / status action. Mock data.
 */

const STATUS_TONE: Record<RfqStatus, "ok" | "warn" | "info" | "muted"> = {
  open: "ok",
  closing: "warn",
  evaluation: "info",
  awarded: "muted",
};

const SUMMARY = [
  { key: "open", labelKey: "marketplace.rfq.sum.open", tone: "ok" },
  { key: "closing", labelKey: "marketplace.rfq.sum.closing", tone: "alert" },
  { key: "awarded", labelKey: "marketplace.rfq.sum.awarded", tone: "muted" },
] as const;

export function Rfq() {
  const { t, lang } = useLanguage();
  const fmt = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

  const [tab, setTab] = useState<TabKey>("all");
  const counts = useMemo(() => tabCounts(RFQS), []);
  const rows = useMemo(() => RFQS.filter((r) => matchesTab(r, tab)), [tab]);

  return (
    <div className="ro-page mp-rfq">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="marketplace.rfq.title" /></h1>
          <p className="ro-header__sub"><T id="marketplace.rfq.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label"><T id="marketplace.rfq.create" /></span>
          </button>
        </div>
      </header>

      {/* ─── Stats ──────────────────────────────────────────────── */}
      <div className="vis-fl-summary">
        {SUMMARY.map((s) => (
          <div key={s.key} className={`vis-fl-stat vis-fl-stat--${s.tone}`}>
            <span className="vis-fl-stat__value">{counts[s.key]}</span>
            <span className="vis-fl-stat__label"><T id={s.labelKey} /></span>
          </div>
        ))}
      </div>

      {/* ─── Status tabs ────────────────────────────────────────── */}
      <nav className="vis-tr-tabs" aria-label={t("marketplace.rfq.tabs_aria")}>
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

      {/* ─── Tender cards ───────────────────────────────────────── */}
      {rows.length === 0 ? (
        <div className="vis-vm-empty"><T id="marketplace.rfq.empty" /></div>
      ) : (
        <div className="mp-rfq-list">
          {rows.map((r) => <Card key={r.id} r={r} fmt={fmt} t={t} lang={lang} />)}
        </div>
      )}
    </div>
  );
}

function Card({ r, fmt, t, lang }: { r: RfqType; fmt: (n: number) => string; t: (id: string) => string; lang: string }) {
  const tone = STATUS_TONE[r.status];
  const isOpen = r.status === "open" || r.status === "closing";

  return (
    <article className="mp-rfq-card">
      {/* Header */}
      <div className="mp-rfq-card__head">
        <span className={`vis-tr-chip vis-tr-chip--${tone}`}>
          {r.status === "open" && <span className="vis-tr-chip__dot" aria-hidden="true" />}
          <T id={`marketplace.rfq.status.${r.status}`} />
        </span>
        <span className="mp-rfq-card__round">
          <T id="marketplace.rfq.round" /> {fmt(r.round)} <T id="marketplace.rfq.of" /> {fmt(r.totalRounds)}
        </span>
      </div>

      <h2 className="mp-rfq-card__title">{lang === "ar" ? r.nameAr : r.name}</h2>
      <p className="mp-rfq-card__shipper">{lang === "ar" ? r.shipperAr : r.shipper}</p>
      <p className="mp-rfq-card__desc">{lang === "ar" ? r.descAr : r.desc}</p>

      {/* Metrics */}
      <div className="mp-rfq-card__grid">
        <Metric labelKey="marketplace.rfq.f.lanes" value={fmt(r.lanes)} />
        <Metric labelKey="marketplace.rfq.f.volume" value={`${fmt(r.annualVolume)} ${t("marketplace.rfq.per_year")}`} />
        <Metric labelKey="marketplace.rfq.f.term" value={`${fmt(r.termMonths)} ${t("marketplace.lanes.months")}`} />
        <Metric labelKey="marketplace.rfq.f.regions" value={lang === "ar" ? r.regionsAr : r.regions} />
      </div>

      {/* Footer */}
      <div className="mp-rfq-card__foot">
        {isOpen && r.deadlineDays != null ? (
          <span className={`mp-lane-deadline mp-lane-deadline--${r.deadlineDays <= 3 ? "alert" : r.deadlineDays <= 10 ? "warn" : "ok"}`}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <T id="marketplace.rfq.deadline" />: {t("marketplace.lanes.in")} {fmt(r.deadlineDays)}{t("visibility.no.unit_d")}
          </span>
        ) : (
          <span className="mp-rfq-card__closed">
            <T id={r.status === "awarded" ? "marketplace.rfq.closed_awarded" : "marketplace.rfq.closed_eval"} />
          </span>
        )}

        {isOpen ? (
          <button type="button" className="mp-lane-details"><T id="marketplace.rfq.participate" /></button>
        ) : (
          <button type="button" className="mp-rfq-ghost"><T id="marketplace.rfq.details" /></button>
        )}
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
