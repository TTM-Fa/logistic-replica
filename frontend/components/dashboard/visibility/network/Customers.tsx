"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { CUSTOMERS, type CustomerStatus } from "./networkData";

/**
 * Customers — Data Network sub-page listing the companies you share live
 * shipment visibility with (your downstream shippers / customers).
 */

const STATUS_TONE: Record<CustomerStatus, "ok" | "warn"> = {
  active: "ok",
  pending: "warn",
};

export function Customers() {
  const { t, lang } = useLanguage();

  return (
    <div className="ro-page vis-nw">
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="visibility.nw.cust.title" /></h1>
          <p className="ro-header__sub"><T id="visibility.nw.cust.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label"><T id="visibility.nw.cust.add" /></span>
          </button>
        </div>
      </header>

      <div className="vis-vm-tablewrap">
        <table className="vis-vm-table">
          <thead>
            <tr>
              <th><T id="visibility.nw.col.customer" /></th>
              <th><T id="visibility.nw.col.reference" /></th>
              <th><T id="visibility.nw.col.shared_views" /></th>
              <th><T id="visibility.nw.col.access" /></th>
              <th><T id="visibility.nw.col.status" /></th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((u) => (
              <tr key={u.id}>
                <td>
                  <span className="vis-nw-customer">
                    <span className="vis-nw-customer__logo" aria-hidden="true">
                      {(lang === "ar" ? u.companyAr : u.company).charAt(0)}
                    </span>
                    <span className="vis-nw-company">{lang === "ar" ? u.companyAr : u.company}</span>
                  </span>
                </td>
                <td><span className="vis-vm-veh__plate">{u.reference}</span></td>
                <td>
                  <span className="vis-nw-views">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" />
                      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    {u.sharedViews}
                  </span>
                </td>
                <td>
                  <span className={`vis-nw-access vis-nw-access--${u.access}`}>
                    <T id={`visibility.nw.access.${u.access}`} />
                  </span>
                </td>
                <td>
                  <span className={`vis-tr-chip vis-tr-chip--${STATUS_TONE[u.status]}`}>
                    {u.status === "active" && <span className="vis-tr-chip__dot" aria-hidden="true" />}
                    <T id={`visibility.nw.cust.${u.status}`} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
