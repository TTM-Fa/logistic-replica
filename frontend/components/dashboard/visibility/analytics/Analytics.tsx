"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { LineChart, type Series } from "../../benchmark/rates/LineChart";
import {
  CARRIER_PERF,
  METRICS,
  SUMMARY,
  TIMELINE,
  WEEKS,
  pct,
  type CarrierPerf,
} from "./analyticsData";

/**
 * Analytics — the "Tracking Performance" page. Headline KPIs, a weekly
 * performance timeline (reusing the benchmark LineChart), and a
 * per-carrier performance table. Single page, no sub-tabs.
 */

// KPI cards built from the headline summary.
const KPIS = [
  { key: "tracked", labelKey: "visibility.an.kpi.tracked", value: SUMMARY.tracked, tone: "ok" },
  { key: "untracked", labelKey: "visibility.an.kpi.untracked", value: SUMMARY.total - SUMMARY.tracked, tone: "alert" },
  { key: "allocated", labelKey: "visibility.an.kpi.allocated", value: SUMMARY.allocated, tone: "info" },
  { key: "stops_eta", labelKey: "visibility.an.kpi.stops_eta", value: SUMMARY.allStopsEta, tone: "violet" },
] as const;

// Colour a performance rate by health.
function rateTone(rate: number) {
  if (rate >= 85) return "ok";
  if (rate >= 70) return "mid";
  if (rate >= 50) return "warn";
  return "alert";
}

export function Analytics() {
  const { t, lang } = useLanguage();
  const [scope, setScope] = useState<"customers" | "carriers">("carriers");
  const [period, setPeriod] = useState<"30" | "90">("90");

  const fmt = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

  // Chart series (percentages) + week labels.
  const series: Series[] = useMemo(
    () => METRICS.map((m) => ({ name: t(m.labelKey), color: m.color, values: TIMELINE[m.key] })),
    [t],
  );
  const xLabels = useMemo(
    () => Array.from({ length: WEEKS }, (_, i) => `${t("visibility.an.wk")} ${i + 1}`),
    [t],
  );

  return (
    <div className="ro-page vis-an">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="visibility.an.title" /></h1>
          <p className="ro-header__sub"><T id="visibility.an.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <div className="vis-fl-select">
            <select value={period} onChange={(e) => setPeriod(e.target.value as "30" | "90")} aria-label={t("visibility.an.period")}>
              <option value="30">{t("visibility.an.period.30")}</option>
              <option value="90">{t("visibility.an.period.90")}</option>
            </select>
          </div>
          <button type="button" className="ro-action">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="visibility.an.export" /></span>
          </button>
        </div>
      </header>

      {/* ─── Scope toggle ───────────────────────────────────────── */}
      <div className="vis-fl-toggle" role="tablist" aria-label={t("visibility.an.scope")}>
        <button type="button" role="tab" aria-selected={scope === "customers"} className={`vis-fl-toggle__btn${scope === "customers" ? " is-active" : ""}`} onClick={() => setScope("customers")}>
          <T id="visibility.an.scope.customers" />
        </button>
        <button type="button" role="tab" aria-selected={scope === "carriers"} className={`vis-fl-toggle__btn${scope === "carriers" ? " is-active" : ""}`} onClick={() => setScope("carriers")}>
          <T id="visibility.an.scope.carriers" />
        </button>
      </div>

      {/* ─── KPI cards ──────────────────────────────────────────── */}
      <div className="vis-an-kpis">
        {KPIS.map((k) => (
          <div key={k.key} className={`vis-an-kpi vis-an-kpi--${k.tone}`}>
            <span className="vis-an-kpi__pct">{pct(k.value, SUMMARY.total)}%</span>
            <span className="vis-an-kpi__label"><T id={k.labelKey} /></span>
            <span className="vis-an-kpi__frac">
              {fmt(k.value)} / {fmt(SUMMARY.total)} <T id="visibility.an.transports" />
            </span>
          </div>
        ))}
      </div>

      {/* ─── Performance timeline ───────────────────────────────── */}
      <section className="ro-card">
        <header className="ro-card__header">
          <div>
            <h2 className="ro-card__heading"><T id="visibility.an.timeline" /></h2>
            <p className="ro-card__sub"><T id="visibility.an.timeline_sub" /></p>
          </div>
        </header>
        <LineChart series={series} xLabels={xLabels} yUnit="%" height={340} />
      </section>

      {/* ─── Carrier performance table ──────────────────────────── */}
      <section className="vis-an-tablesec">
        <h2 className="vis-vm-sech">
          <T id="visibility.an.by_carrier" />
          <span className="vis-vm-sech__count">{CARRIER_PERF.length}</span>
        </h2>
        <div className="vis-vm-tablewrap">
          <table className="vis-vm-table">
            <thead>
              <tr>
                <th><T id="visibility.an.col.carrier" /></th>
                <th><T id="visibility.an.col.transports" /></th>
                <th><T id="visibility.an.m.allocated" /></th>
                <th><T id="visibility.an.m.tracked" /></th>
                <th><T id="visibility.an.m.stops_eta" /></th>
              </tr>
            </thead>
            <tbody>
              {CARRIER_PERF.map((c) => (
                <tr key={c.id}>
                  <td><span className="vis-nw-company">{lang === "ar" ? c.nameAr : c.name}</span></td>
                  <td><span className="vis-an-count">{fmt(c.transports)}</span></td>
                  <RateCell value={c.allocated} of={c.transports} fmt={fmt} />
                  <RateCell value={c.tracked} of={c.transports} fmt={fmt} />
                  <RateCell value={c.allStopsEta} of={c.transports} fmt={fmt} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// A table cell showing a health-colored percentage + the raw count.
function RateCell({ value, of, fmt }: { value: number; of: number; fmt: (n: number) => string }) {
  const rate = pct(value, of);
  return (
    <td>
      <div className="vis-an-rate">
        <span className={`vis-an-rate__pct vis-an-rate__pct--${rateTone(rate)}`}>{rate}%</span>
        <span className="vis-an-rate__count">{fmt(value)}</span>
      </div>
    </td>
  );
}
