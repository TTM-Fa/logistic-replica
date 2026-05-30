"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  CARRIERS,
  onboardingCounts,
  type ConsentStatus,
  type OnboardStatus,
} from "./networkData";

/**
 * CarrierNetwork — default sub-page of Data Network. Shows the carriers
 * you exchange visibility with: an onboarding-status summary, filters,
 * and a table with onboarding + GPS-consent status per company.
 */

const ONBOARD_TONE: Record<OnboardStatus, "ok" | "info" | "warn" | "alert"> = {
  accepted: "ok",
  invited: "info",
  pending: "warn",
  declined: "alert",
};
const CONSENT_TONE: Record<ConsentStatus, "ok" | "warn" | "alert"> = {
  granted: "ok",
  pending: "warn",
  declined: "alert",
};

const SUMMARY = [
  { key: "accepted", labelKey: "visibility.nw.sum.accepted", tone: "ok" },
  { key: "invited", labelKey: "visibility.nw.sum.invited", tone: "info" },
  { key: "pending", labelKey: "visibility.nw.sum.pending", tone: "warn" },
  { key: "declined", labelKey: "visibility.nw.sum.declined", tone: "alert" },
] as const;

export function CarrierNetwork() {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [onboard, setOnboard] = useState<OnboardStatus | "all">("all");
  const [consent, setConsent] = useState<ConsentStatus | "all">("all");

  const counts = useMemo(() => onboardingCounts(CARRIERS), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CARRIERS.filter((c) => {
      if (onboard !== "all" && c.onboarding !== onboard) return false;
      if (consent !== "all" && c.consent !== consent) return false;
      if (q && !`${c.company} ${c.companyAr} ${c.reference} ${c.relationId}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, onboard, consent]);

  return (
    <div className="ro-page vis-nw">
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="visibility.nw.carriers.title" /></h1>
          <p className="ro-header__sub"><T id="visibility.nw.carriers.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="visibility.nw.download" /></span>
          </button>
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="visibility.nw.invite" /></span>
          </button>
        </div>
      </header>

      {/* Onboarding summary */}
      <div className="vis-fl-summary">
        {SUMMARY.map((s) => (
          <div key={s.key} className={`vis-fl-stat vis-fl-stat--${s.tone}`}>
            <span className="vis-fl-stat__value">{counts[s.key]}</span>
            <span className="vis-fl-stat__label"><T id={s.labelKey} /></span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="vis-nw-toolbar">
        <div className="vis-tr-search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input type="search" className="vis-tr-search__input" placeholder={t("visibility.nw.search_carrier")} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t("visibility.nw.search_carrier")} />
        </div>
        <div className="vis-fl-select">
          <select value={onboard} onChange={(e) => setOnboard(e.target.value as OnboardStatus | "all")} aria-label={t("visibility.nw.filter.onboarding")}>
            <option value="all">{t("visibility.nw.onboarding.all")}</option>
            <option value="accepted">{t("visibility.nw.ob.accepted")}</option>
            <option value="invited">{t("visibility.nw.ob.invited")}</option>
            <option value="pending">{t("visibility.nw.ob.pending")}</option>
            <option value="declined">{t("visibility.nw.ob.declined")}</option>
          </select>
        </div>
        <div className="vis-fl-select">
          <select value={consent} onChange={(e) => setConsent(e.target.value as ConsentStatus | "all")} aria-label={t("visibility.nw.filter.consent")}>
            <option value="all">{t("visibility.nw.consent.all")}</option>
            <option value="granted">{t("visibility.nw.cs.granted")}</option>
            <option value="pending">{t("visibility.nw.cs.pending")}</option>
            <option value="declined">{t("visibility.nw.cs.declined")}</option>
          </select>
        </div>
        <span className="vis-nw-toolbar__count">
          <strong>{rows.length}</strong> <T id="visibility.nw.count_company" />
        </span>
      </div>

      {/* Carrier table */}
      <div className="vis-vm-tablewrap">
        <table className="vis-vm-table">
          <thead>
            <tr>
              <th><T id="visibility.nw.col.company" /></th>
              <th><T id="visibility.nw.col.reference" /></th>
              <th><T id="visibility.nw.col.relation" /></th>
              <th><T id="visibility.nw.col.vehicles" /></th>
              <th><T id="visibility.nw.col.onboarding" /></th>
              <th><T id="visibility.nw.col.consent" /></th>
              <th aria-label={t("visibility.nw.actions")} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="vis-nw-emptycell"><T id="visibility.nw.empty" /></td></tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id}>
                  <td><span className="vis-nw-company">{lang === "ar" ? c.companyAr : c.company}</span></td>
                  <td><span className="vis-vm-veh__plate">{c.reference}</span></td>
                  <td><span className="vis-nw-relation">{c.relationId}</span></td>
                  <td>{c.vehicles > 0 ? c.vehicles : <span className="vis-nw-muted">—</span>}</td>
                  <td>
                    <span className={`vis-tr-chip vis-tr-chip--${ONBOARD_TONE[c.onboarding]}`}>
                      <T id={`visibility.nw.ob.${c.onboarding}`} />
                    </span>
                  </td>
                  <td>
                    <span className={`vis-tr-chip vis-tr-chip--${CONSENT_TONE[c.consent]}`}>
                      <T id={`visibility.nw.cs.${c.consent}`} />
                    </span>
                  </td>
                  <td>
                    <button type="button" className="vis-nw-rowbtn" aria-label={t("visibility.nw.actions")}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                        <circle cx="5" cy="12" r="1.6" fill="currentColor" />
                        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                        <circle cx="19" cy="12" r="1.6" fill="currentColor" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
