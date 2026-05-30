"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { CITIES, type CityId, type Vehicle } from "./fleetData";

/**
 * FleetRoster — the readable "list" view of the Fleet monitor.
 *
 * One row per vehicle, split into three clear zones:
 *   1. Vehicle  — status dot, name, plate, body type, driver
 *   2. Now      — the current trip (route + progress bar + ETA) or, when
 *                 not driving, a status chip with a short description
 *   3. Next     — the next scheduled departure, or "no upcoming trips"
 *
 * All values are static data (progress/ETA live in fleetData), so this
 * renders identically on server and client — no hydration concerns.
 */

// Maps a vehicle status to the chip tone (reuses .vis-tr-chip--<tone>).
const STATUS_TONE: Record<Vehicle["status"], "ok" | "info" | "warn" | "muted"> = {
  driving: "ok",
  idle: "muted",
  loading: "info",
  maintenance: "warn",
};

export function FleetRoster({ vehicles }: { vehicles: Vehicle[] }) {
  const { t, lang } = useLanguage();
  const cityName = (id: CityId) => (lang === "ar" ? CITIES[id].nameAr : CITIES[id].name);

  // "3h 20m" from a minute count, with translated unit letters.
  const fmtDur = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return [h > 0 ? `${h}${t("visibility.tr.unit_h")}` : "", m > 0 ? `${m}${t("visibility.tr.unit_m")}` : ""]
      .filter(Boolean)
      .join(" ");
  };

  if (vehicles.length === 0) {
    return (
      <div className="vis-fl-roster">
        <div className="vis-fl-empty">
          <T id="visibility.fl.empty" />
        </div>
      </div>
    );
  }

  return (
    <div className="vis-fl-roster">
      {vehicles.map((v) => {
        const driver = lang === "ar" ? v.driverAr : v.driver;
        const tone = v.active?.delayed ? "alert" : STATUS_TONE[v.status];
        return (
          <article key={v.id} className="vis-fl-rrow">
            {/* 1 — Vehicle identity */}
            <div className="vis-fl-rrow__veh">
              <span className={`vis-fl-vehicle__dot vis-fl-vehicle__dot--${v.status}`} aria-hidden="true" />
              <div className="vis-fl-rrow__vehinfo">
                <span className="vis-fl-rrow__name">{v.name}</span>
                <span className="vis-fl-rrow__sub">
                  <span className="vis-fl-vehicle__plate">{v.plate}</span>
                  <span className="vis-fl-rrow__type">
                    <T id={`visibility.fl.type.${v.type}`} />
                  </span>
                </span>
                <span className="vis-fl-rrow__driver">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                  {driver}
                </span>
              </div>
            </div>

            {/* 2 — Current activity */}
            <div className="vis-fl-rrow__now">
              {v.active ? (
                <>
                  <div className="vis-fl-rrow__route">
                    <span className="vis-fl-rrow__city">{cityName(v.active.from)}</span>
                    <svg className="vis-fl-trip__arrow" viewBox="0 0 24 14" width="20" height="12" fill="none" aria-hidden="true">
                      <path d="M1 7h20M16 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="vis-fl-rrow__city">{cityName(v.active.to)}</span>
                    <span className={`vis-tr-chip vis-tr-chip--${tone}`}>
                      <span className="vis-tr-chip__dot" aria-hidden="true" />
                      <T id={v.active.delayed ? "visibility.fl.status.delayed" : "visibility.fl.status.in_transit"} />
                    </span>
                  </div>
                  <div className="vis-fl-rprog" aria-hidden="true">
                    <div
                      className={`vis-fl-rprog__fill vis-fl-rprog__fill--${v.active.delayed ? "alert" : "ok"}`}
                      style={{ width: `${Math.round(v.active.progress * 100)}%` }}
                    />
                  </div>
                  <div className="vis-fl-rrow__meta">
                    <span>{Math.round(v.active.progress * 100)}%</span>
                    <span className="vis-fl-rrow__dot-sep" aria-hidden="true">·</span>
                    <span>
                      <T id="visibility.fl.r.eta" /> {fmtDur(v.active.etaMin)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="vis-fl-rrow__static">
                  <span className={`vis-tr-chip vis-tr-chip--${STATUS_TONE[v.status]}`}>
                    <T id={`visibility.fl.status.${v.status}`} />
                  </span>
                  <span className="vis-fl-rrow__statictext">
                    {v.status === "idle" && <T id="visibility.fl.r.available" />}
                    {v.status === "loading" && (
                      <>
                        <T id="visibility.fl.r.loading_at" /> {cityName(v.currentCity)}
                      </>
                    )}
                    {v.status === "maintenance" && <T id="visibility.fl.r.in_maintenance" />}
                  </span>
                </div>
              )}
            </div>

            {/* 3 — Next scheduled trip */}
            <div className="vis-fl-rrow__next">
              {v.next ? (
                <>
                  <span className="vis-fl-rrow__nextlabel">
                    <T id="visibility.fl.r.next" />
                  </span>
                  <span className="vis-fl-rrow__nextroute">
                    {cityName(v.next.from)}
                    <svg className="vis-fl-trip__arrow" viewBox="0 0 24 14" width="16" height="10" fill="none" aria-hidden="true">
                      <path d="M1 7h20M16 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {cityName(v.next.to)}
                  </span>
                  <span className="vis-fl-rrow__nexttime">
                    <T id="visibility.fl.r.departs_in" /> {fmtDur(v.next.departsInMin)}
                  </span>
                </>
              ) : (
                <span className="vis-fl-rrow__noupcoming">
                  <T id="visibility.fl.r.no_upcoming" />
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
