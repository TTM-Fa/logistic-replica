"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  SHARED_VIEWS,
  SHARE_DOMAIN,
  viewStats,
  type SharedView,
  type ViewStatus,
} from "./sharedViewsData";

/**
 * SharedViews — the "Shared views" page. A grid of customer-facing
 * tracking links you've created, each with its scope, recipient, a
 * copyable public link, status, and open stats. Single page, no sub-tabs.
 */

const STATUS_TONE: Record<ViewStatus, "ok" | "warn" | "muted"> = {
  active: "ok",
  paused: "warn",
  expired: "muted",
};

export function SharedViews() {
  const { t, lang } = useLanguage();
  const stats = viewStats(SHARED_VIEWS);

  // Which card just had its link copied (for the transient "Copied!" label).
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fmt = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

  const lastSeen = (min: number | null) => {
    if (min == null) return t("visibility.sv.never");
    let v: number, unit: string;
    if (min < 60) { v = min; unit = t("visibility.tr.unit_m"); }
    else if (min < 1440) { v = Math.floor(min / 60); unit = t("visibility.tr.unit_h"); }
    else { v = Math.floor(min / 1440); unit = t("visibility.no.unit_d"); }
    return `${v}${unit} ${t("visibility.vm.ago")}`;
  };

  const copyLink = (view: SharedView) => {
    const url = `https://${SHARE_DOMAIN}/${view.slug}`;
    // Clipboard API may be unavailable (insecure context / sandbox). Guard
    // the call so the "Copied!" confirmation still shows regardless.
    try {
      const result = navigator.clipboard?.writeText(url);
      if (result && typeof result.catch === "function") result.catch(() => {});
    } catch {
      /* ignore — clipboard not available */
    }
    setCopiedId(view.id);
    window.setTimeout(() => setCopiedId((c) => (c === view.id ? null : c)), 1600);
  };

  return (
    <div className="ro-page vis-sv">
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="visibility.sv.title" /></h1>
          <p className="ro-header__sub"><T id="visibility.sv.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label"><T id="visibility.sv.add" /></span>
          </button>
        </div>
      </header>

      {/* Summary */}
      <div className="vis-fl-summary">
        <div className="vis-fl-stat vis-fl-stat--ok">
          <span className="vis-fl-stat__value">{stats.active}</span>
          <span className="vis-fl-stat__label"><T id="visibility.sv.sum.active" /></span>
        </div>
        <div className="vis-fl-stat vis-fl-stat--info">
          <span className="vis-fl-stat__value">{fmt(stats.opens)}</span>
          <span className="vis-fl-stat__label"><T id="visibility.sv.sum.opens" /></span>
        </div>
        <div className="vis-fl-stat vis-fl-stat--muted">
          <span className="vis-fl-stat__value">{fmt(stats.shipments)}</span>
          <span className="vis-fl-stat__label"><T id="visibility.sv.sum.shipments" /></span>
        </div>
      </div>

      {/* Shared-view cards */}
      <div className="vis-sv-grid">
        {SHARED_VIEWS.map((v) => {
          const url = `${SHARE_DOMAIN}/${v.slug}`;
          const copied = copiedId === v.id;
          return (
            <article key={v.id} className="vis-sv-card">
              <div className="vis-sv-card__head">
                <h3 className="vis-sv-card__name">{lang === "ar" ? v.nameAr : v.name}</h3>
                <span className={`vis-tr-chip vis-tr-chip--${STATUS_TONE[v.status]}`}>
                  {v.status === "active" && <span className="vis-tr-chip__dot" aria-hidden="true" />}
                  <T id={`visibility.sv.status.${v.status}`} />
                </span>
              </div>

              {/* Scope */}
              <p className="vis-sv-card__scope">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
                  <path d="M3 7h18M6 12h12M10 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {lang === "ar" ? v.scopeAr : v.scope}
              </p>

              {/* Recipient */}
              <div className="vis-sv-card__recipient">
                <span className="vis-sv-card__avatar" aria-hidden="true">
                  {(lang === "ar" ? v.customerAr : v.customer).charAt(0)}
                </span>
                <div className="vis-sv-card__recipient-text">
                  <span className="vis-sv-card__shared"><T id="visibility.sv.shared_with" /></span>
                  <span className="vis-sv-card__customer">{lang === "ar" ? v.customerAr : v.customer}</span>
                </div>
              </div>

              {/* Public link + copy */}
              <div className="vis-sv-card__link">
                <span className="vis-sv-card__url" dir="ltr">{url}</span>
                <button
                  type="button"
                  className={`vis-sv-card__copy${copied ? " is-copied" : ""}`}
                  onClick={() => copyLink(v)}
                  aria-label={t("visibility.sv.copy")}
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <T id="visibility.sv.copied" />
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
                        <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                      <T id="visibility.sv.copy" />
                    </>
                  )}
                </button>
              </div>

              {/* Footer stats */}
              <div className="vis-sv-card__stats">
                <span className="vis-sv-stat">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
                    <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  {fmt(v.shipments)} <T id="visibility.sv.shipments" />
                </span>
                <span className="vis-sv-stat">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  {fmt(v.views)} <T id="visibility.sv.views" />
                </span>
                <span className="vis-sv-stat vis-sv-stat--last">
                  <T id="visibility.sv.last_viewed" />: {lastSeen(v.lastMin)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
