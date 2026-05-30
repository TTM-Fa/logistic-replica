"use client";

import { T } from "@/lib/T";
import { VehicleTable } from "./VehicleTable";
import { vehiclesByGroup } from "./vehiclesData";

/**
 * PartnerVehicles — the "Partner Vehicles" sub-page of Vehicle Management.
 * Vehicles partner carriers have dedicated to you, with an explanatory
 * note and an "Invite carriers" action.
 */
export function PartnerVehicles() {
  const vehicles = vehiclesByGroup("partner");

  return (
    <div className="ro-page vis-vm">
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="visibility.vm.partner.title" /></h1>
          <p className="ro-header__sub"><T id="visibility.vm.partner.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="visibility.vm.invite" /></span>
          </button>
        </div>
      </header>

      {/* Explanatory note */}
      <div className="vis-vm-note">
        <span className="vis-vm-note__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="vis-vm-note__text"><T id="visibility.vm.partner.note" /></p>
      </div>

      <VehicleTable vehicles={vehicles} mode="partner" />
    </div>
  );
}
