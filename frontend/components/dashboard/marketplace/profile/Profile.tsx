"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import {
  COMPANY,
  DOCUMENTS,
  EQUIPMENT,
  REGIONS,
  STATS,
  verificationPct,
  type DocItem,
  type DocStatus,
} from "./profileData";

/**
 * Profile — the Marketplace → Profile page (your carrier company profile).
 * Hero identity, performance stats, company details + operating profile,
 * verification progress, and a documents list. Mock data.
 */

const DOC_TONE: Record<DocStatus, "ok" | "warn" | "alert"> = {
  valid: "ok",
  expiring: "warn",
  missing: "alert",
};

export function Profile() {
  const { t, lang } = useLanguage();
  const name = lang === "ar" ? COMPANY.nameAr : COMPANY.name;
  const verifyPct = verificationPct(DOCUMENTS);

  return (
    <div className="ro-page mp-pf">
      {/* ─── Hero ───────────────────────────────────────────────── */}
      <section className="mp-pf-hero">
        <span className="mp-pf-hero__avatar" aria-hidden="true">{name.charAt(0)}</span>
        <div className="mp-pf-hero__id">
          <div className="mp-pf-hero__nameline">
            <h1 className="mp-pf-hero__name">{name}</h1>
            {COMPANY.verified && (
              <span className="mp-pf-verified" title={t("marketplace.pf.verified")}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
                  <path d="M12 2l2.5 1.8 3-.2 1 2.9 2.4 1.8-1 2.9 1 2.9-2.4 1.8-1 2.9-3-.2L12 22l-2.5-1.8-3 .2-1-2.9L3.1 16l1-2.9-1-2.9 2.4-1.8 1-2.9 3 .2L12 2z" fill="currentColor" opacity="0.18" />
                  <path d="M8.5 12l2.5 2.5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <T id="marketplace.pf.verified" />
              </span>
            )}
          </div>
          <div className="mp-pf-hero__meta">
            <span className="vis-tr-chip vis-tr-chip--info"><T id="marketplace.pf.type.carrier" /></span>
            <span className="mp-pf-hero__metaitem">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /></svg>
              {lang === "ar" ? COMPANY.locationAr : COMPANY.location}
            </span>
            <span className="mp-pf-hero__metaitem">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              <T id="marketplace.pf.member_since" /> {COMPANY.memberSince}
            </span>
          </div>
        </div>
        <button type="button" className="ro-action mp-pf-hero__edit">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="ro-action__label"><T id="marketplace.pf.edit" /></span>
        </button>
      </section>

      {/* ─── Stats ──────────────────────────────────────────────── */}
      <div className="vis-fl-summary">
        {STATS.map((s) => (
          <div key={s.key} className={`vis-fl-stat vis-fl-stat--${s.tone}`}>
            <span className="vis-fl-stat__value">{s.value}</span>
            <span className="vis-fl-stat__label"><T id={s.labelKey} /></span>
          </div>
        ))}
      </div>

      {/* ─── Body ───────────────────────────────────────────────── */}
      <div className="mp-pf-grid">
        {/* Left column */}
        <div className="mp-pf-col">
          <section className="mp-card">
            <h2 className="mp-card__title"><T id="marketplace.pf.details.title" /></h2>
            <dl className="mp-pf-dl">
              <Detail labelKey="marketplace.pf.d.legal" value={lang === "ar" ? COMPANY.legalNameAr : COMPANY.legalName} />
              <Detail labelKey="marketplace.pf.d.reg" value={COMPANY.registration} mono />
              <Detail labelKey="marketplace.pf.d.hq" value={lang === "ar" ? COMPANY.locationAr : COMPANY.location} />
              <Detail labelKey="marketplace.pf.d.fleet" value={`${COMPANY.fleetSize} ${t("marketplace.pf.vehicles")}`} />
              <Detail labelKey="marketplace.pf.d.founded" value={COMPANY.founded} />
            </dl>
          </section>

          <section className="mp-card">
            <h2 className="mp-card__title"><T id="marketplace.pf.operating.title" /></h2>
            <div className="mp-pf-block">
              <span className="mp-pf-block__label"><T id="marketplace.pf.regions" /></span>
              <div className="mp-pf-chips">
                {REGIONS.map((r) => (
                  <span key={r.en} className="vis-tr-chip vis-tr-chip--muted">{lang === "ar" ? r.ar : r.en}</span>
                ))}
              </div>
            </div>
            <div className="mp-pf-block">
              <span className="mp-pf-block__label"><T id="marketplace.pf.equipment" /></span>
              <div className="mp-pf-chips">
                {EQUIPMENT.map((e) => (
                  <span key={e} className="vis-tr-chip vis-tr-chip--info"><T id={`visibility.fl.type.${e}`} /></span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="mp-pf-col">
          {/* Verification */}
          <section className="mp-card mp-verify">
            <header className="mp-verify__head">
              <h2 className="mp-card__title"><T id="marketplace.pf.verify.title" /></h2>
              <span className="mp-verify__pct">{verifyPct}%</span>
            </header>
            <div className="mp-verify__bar" aria-hidden="true">
              <div className="mp-verify__fill" style={{ width: `${verifyPct}%` }} />
            </div>
            <p className="mp-pf-verify-note">
              <T id={verifyPct === 100 ? "marketplace.pf.verify.done" : "marketplace.pf.verify.note"} />
            </p>
            {verifyPct < 100 && (
              <button type="button" className="ro-action is-primary mp-verify__btn">
                <T id="marketplace.pf.verify.complete" />
              </button>
            )}
          </section>

          {/* Documents */}
          <section className="mp-card">
            <h2 className="mp-card__title"><T id="marketplace.pf.docs.title" /></h2>
            <ul className="mp-pf-docs">
              {DOCUMENTS.map((d) => <DocRow key={d.key} d={d} t={t} />)}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Detail({ labelKey, value, mono }: { labelKey: string; value: string; mono?: boolean }) {
  return (
    <div className="mp-pf-dl__row">
      <dt className="mp-pf-dl__key"><T id={labelKey} /></dt>
      <dd className={`mp-pf-dl__val${mono ? " is-mono" : ""}`}>{value}</dd>
    </div>
  );
}

function DocRow({ d, t }: { d: DocItem; t: (id: string) => string }) {
  const sub =
    d.status === "valid" && d.expiryYear
      ? `${t("marketplace.pf.docs.expires")} ${d.expiryYear}`
      : d.status === "expiring" && d.expiresInDays != null
      ? `${t("marketplace.pf.docs.expires")} ${t("marketplace.lanes.in")} ${d.expiresInDays}${t("visibility.no.unit_d")}`
      : t("marketplace.pf.docs.not_uploaded");

  return (
    <li className="mp-pf-doc">
      <span className="mp-pf-doc__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M6 2h8l4 4v16H6zM14 2v4h4M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <div className="mp-pf-doc__text">
        <span className="mp-pf-doc__name"><T id={`marketplace.pf.doc.${d.key}`} /></span>
        <span className="mp-pf-doc__sub">{sub}</span>
      </div>
      {d.status === "missing" ? (
        <button type="button" className="mp-pf-doc__upload"><T id="marketplace.pf.docs.upload" /></button>
      ) : (
        <span className={`vis-tr-chip vis-tr-chip--${DOC_TONE[d.status]}`}>
          <T id={`marketplace.pf.docs.${d.status}`} />
        </span>
      )}
    </li>
  );
}
