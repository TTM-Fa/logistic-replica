"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { VehicleTable } from "./VehicleTable";
import { connCounts, vehiclesByGroup } from "./vehiclesData";

/**
 * MyVehicles — the "My Vehicles" sub-page of Vehicle Management.
 * Your dedicated fleet + a summary of GPS connection health, then the
 * connection table.
 */

const SUMMARY = [
  { key: "connected", labelKey: "visibility.vm.sum.connected", tone: "ok" },
  { key: "no_signal", labelKey: "visibility.vm.sum.no_signal", tone: "warn" },
  { key: "pending", labelKey: "visibility.vm.sum.pending", tone: "muted" },
] as const;

export function MyVehicles() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  const all = vehiclesByGroup("dedicated");
  const q = query.trim().toLowerCase();
  const vehicles = q
    ? all.filter((v) => `${v.plate} ${v.name} ${v.provider}`.toLowerCase().includes(q))
    : all;
  const counts = connCounts(all);

  return (
    <div className="ro-page vis-vm">
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="visibility.vm.my.title" /></h1>
          <p className="ro-header__sub"><T id="visibility.vm.my.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <div className="vis-tr-search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              className="vis-tr-search__input"
              placeholder={t("visibility.vm.search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t("visibility.vm.search")}
            />
          </div>
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label"><T id="visibility.vm.add_vehicle" /></span>
          </button>
        </div>
      </header>

      {/* Connection summary */}
      <div className="vis-fl-summary">
        {SUMMARY.map((s) => (
          <div key={s.key} className={`vis-fl-stat vis-fl-stat--${s.tone}`}>
            <span className="vis-fl-stat__value">{counts[s.key]}</span>
            <span className="vis-fl-stat__label"><T id={s.labelKey} /></span>
          </div>
        ))}
      </div>

      <VehicleTable vehicles={vehicles} mode="my" />
    </div>
  );
}
