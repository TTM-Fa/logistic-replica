"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { CITIES, type CityId, type ConnStatus, type ManagedVehicle } from "./vehiclesData";

/**
 * VehicleTable — shared connection table for the My Vehicles and Partner
 * Vehicles sub-pages.
 *
 * `mode` swaps the second column: "my" shows the body Type, "partner"
 * shows the owning Carrier. Everything else (telematics provider,
 * connection status chip, last-seen) is identical.
 */

const STATUS_TONE: Record<ConnStatus, "ok" | "warn" | "muted"> = {
  connected: "ok",
  no_signal: "warn",
  pending: "muted",
};

export function VehicleTable({
  vehicles,
  mode,
}: {
  vehicles: ManagedVehicle[];
  mode: "my" | "partner";
}) {
  const { t, lang } = useLanguage();
  const cityName = (id: CityId) => (lang === "ar" ? CITIES[id].nameAr : CITIES[id].name);

  // "12m ago" / "3h 20m ago" from minutes.
  const lastSeen = (min: number | null) => {
    if (min == null) return "—";
    const h = Math.floor(min / 60);
    const m = min % 60;
    const dur = [h > 0 ? `${h}${t("visibility.tr.unit_h")}` : "", m > 0 ? `${m}${t("visibility.tr.unit_m")}` : ""]
      .filter(Boolean)
      .join(" ");
    return `${dur} ${t("visibility.vm.ago")}`;
  };

  if (vehicles.length === 0) {
    return <div className="vis-vm-empty"><T id="visibility.vm.empty" /></div>;
  }

  return (
    <div className="vis-vm-tablewrap">
      <table className="vis-vm-table">
        <thead>
          <tr>
            <th><T id="visibility.vm.col.vehicle" /></th>
            <th><T id={mode === "my" ? "visibility.vm.col.type" : "visibility.vm.col.carrier"} /></th>
            <th><T id="visibility.vm.col.telematics" /></th>
            <th><T id="visibility.vm.col.status" /></th>
            <th><T id="visibility.vm.col.last_seen" /></th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              {/* Vehicle */}
              <td>
                <div className="vis-vm-veh">
                  <span className="vis-vm-veh__plate">{v.plate}</span>
                  <span className="vis-vm-veh__name">{v.name}</span>
                </div>
              </td>

              {/* Type or Carrier */}
              <td>
                {mode === "my" ? (
                  <span className="vis-vm-type"><T id={`visibility.fl.type.${v.type}`} /></span>
                ) : (
                  <span className="vis-vm-carrier">{lang === "ar" ? v.carrierAr : v.carrier}</span>
                )}
              </td>

              {/* Telematics provider */}
              <td>
                {v.provider ? (
                  <span className="vis-vm-provider">
                    <span className="vis-vm-provider__badge" aria-hidden="true">{v.provider.charAt(0)}</span>
                    {v.provider}
                  </span>
                ) : (
                  <span className="vis-vm-provider vis-vm-provider--none"><T id="visibility.vm.not_connected" /></span>
                )}
              </td>

              {/* Status */}
              <td>
                <span className={`vis-tr-chip vis-tr-chip--${STATUS_TONE[v.status]}`}>
                  {v.status === "connected" && <span className="vis-tr-chip__dot" aria-hidden="true" />}
                  <T id={`visibility.vm.status.${v.status}`} />
                </span>
              </td>

              {/* Last seen */}
              <td>
                {v.lastSeenMin == null ? (
                  <span className="vis-vm-lastseen vis-vm-lastseen--none">—</span>
                ) : (
                  <span className="vis-vm-lastseen">
                    <span className="vis-vm-lastseen__city">{cityName(v.lastCity)}</span>
                    <span className="vis-vm-lastseen__time">{lastSeen(v.lastSeenMin)}</span>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
