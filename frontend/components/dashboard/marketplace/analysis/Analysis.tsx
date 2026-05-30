"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { ANALYSES, analysisSummary, type Analysis as AnalysisItem, type AnalysisStatus } from "./analysisData";

/**
 * Analysis — the Marketplace → Analysis page. A summary strip + a grid of
 * saved freight cost/rate analyses. Each card shows its type, scope,
 * headline result, status, and Open/Export actions. Mock data.
 */

const STATUS_TONE: Record<AnalysisStatus, "ok" | "warn" | "muted"> = {
  ready: "ok",
  running: "warn",
  draft: "muted",
};

// Type → accent icon.
const TYPE_ICON: Record<AnalysisItem["type"], React.ReactNode> = {
  rate_benchmark: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  lane_cost: <path d="M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6.5 17.5l11-11M12 21a9 9 0 0 1 0-18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />,
  spend: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  savings: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
};

export function Analysis() {
  const { t, lang } = useLanguage();
  const fmt = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  const sum = analysisSummary(ANALYSES);

  const STATS = [
    { value: fmt(sum.total), labelKey: "marketplace.an.sum.total", tone: "info" },
    { value: fmt(sum.lanes), labelKey: "marketplace.an.sum.lanes", tone: "ok" },
    { value: "SAR 2.3M", labelKey: "marketplace.an.sum.savings", tone: "violet" },
  ] as const;

  return (
    <div className="ro-page mp-an">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="marketplace.an.title" /></h1>
          <p className="ro-header__sub"><T id="marketplace.an.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label"><T id="marketplace.an.create" /></span>
          </button>
        </div>
      </header>

      {/* ─── Stats ──────────────────────────────────────────────── */}
      <div className="vis-fl-summary">
        {STATS.map((s) => (
          <div key={s.labelKey} className={`vis-fl-stat vis-fl-stat--${s.tone}`}>
            <span className="vis-fl-stat__value">{s.value}</span>
            <span className="vis-fl-stat__label"><T id={s.labelKey} /></span>
          </div>
        ))}
      </div>

      {/* ─── Analysis cards ─────────────────────────────────────── */}
      <div className="mp-an-list">
        {ANALYSES.map((a) => (
          <article key={a.id} className="mp-an-card">
            <div className="mp-an-card__head">
              <span className="mp-an-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">{TYPE_ICON[a.type]}</svg>
              </span>
              <span className={`vis-tr-chip vis-tr-chip--${STATUS_TONE[a.status]}`}>
                {a.status === "running" && <span className="vis-tr-chip__dot" aria-hidden="true" />}
                <T id={`marketplace.an.status.${a.status}`} />
              </span>
            </div>

            <span className="mp-an-card__type"><T id={`marketplace.an.type.${a.type}`} /></span>
            <h2 className="mp-an-card__name">{lang === "ar" ? a.nameAr : a.name}</h2>
            <p className="mp-an-card__scope">
              {lang === "ar" ? a.scopeAr : a.scope} · {fmt(a.lanes)} {t("marketplace.an.lanes")}
            </p>

            {/* Headline result */}
            <div className="mp-an-card__result">
              <span className={`mp-an-card__value mp-an-card__value--${a.resultTone}`}>{a.resultValue}</span>
              <span className="mp-an-card__rlabel"><T id={a.resultLabelKey} /></span>
            </div>

            {/* Footer */}
            <div className="mp-an-card__foot">
              <span className="mp-an-card__updated">
                <T id="marketplace.an.updated" />: {a.updatedDaysAgo === 0 ? t("marketplace.spot.day.today") : `${fmt(a.updatedDaysAgo)}${t("visibility.no.unit_d")} ${t("visibility.vm.ago")}`}
              </span>
              <div className="mp-an-card__actions">
                <button type="button" className="mp-rfq-ghost" title={t("marketplace.an.export")} aria-label={t("marketplace.an.export")}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button type="button" className="mp-lane-details"><T id="marketplace.an.open" /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
