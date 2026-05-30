"use client";

import { T } from "@/lib/T";
import { INTEGRATIONS, type Integration } from "./vehiclesData";

/**
 * Integrations — the "Integrations" sub-page of Vehicle Management.
 * A catalogue of telematics / GPS providers shown as cards: connected
 * ones show how many vehicles feed through them; available ones offer a
 * Connect action.
 */
export function Integrations() {
  const connected = INTEGRATIONS.filter((i) => i.status === "connected");
  const available = INTEGRATIONS.filter((i) => i.status === "available");

  return (
    <div className="ro-page vis-vm">
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="visibility.vm.int.title" /></h1>
          <p className="ro-header__sub"><T id="visibility.vm.int.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label"><T id="visibility.vm.add_integration" /></span>
          </button>
        </div>
      </header>

      {/* Connected providers */}
      <section aria-label="Connected">
        <h2 className="vis-vm-sech">
          <T id="visibility.vm.int.connected" />
          <span className="vis-vm-sech__count">{connected.length}</span>
        </h2>
        <div className="vis-vm-intgrid">
          {connected.map((it) => <IntegrationCard key={it.id} it={it} />)}
        </div>
      </section>

      {/* Available providers */}
      <section aria-label="Available">
        <h2 className="vis-vm-sech">
          <T id="visibility.vm.int.available" />
          <span className="vis-vm-sech__count">{available.length}</span>
        </h2>
        <div className="vis-vm-intgrid">
          {available.map((it) => <IntegrationCard key={it.id} it={it} />)}
        </div>
      </section>
    </div>
  );
}

function IntegrationCard({ it }: { it: Integration }) {
  const isConnected = it.status === "connected";
  return (
    <article className={`vis-vm-int${isConnected ? " is-connected" : ""}`}>
      <div className="vis-vm-int__top">
        <span className="vis-vm-int__logo" aria-hidden="true">{it.name.charAt(0)}</span>
        {isConnected && (
          <span className="vis-tr-chip vis-tr-chip--ok">
            <span className="vis-tr-chip__dot" aria-hidden="true" />
            <T id="visibility.vm.int.connected" />
          </span>
        )}
      </div>
      <h3 className="vis-vm-int__name">{it.name}</h3>
      <span className="vis-vm-int__cat"><T id={`visibility.vm.int.category.${it.category}`} /></span>

      <div className="vis-vm-int__foot">
        {isConnected ? (
          <span className="vis-vm-int__count">
            {it.vehicles} <T id="visibility.vm.int.vehicles" />
          </span>
        ) : (
          <span className="vis-vm-int__count vis-vm-int__count--muted">—</span>
        )}
        <button type="button" className={`vis-vm-int__btn${isConnected ? "" : " is-primary"}`}>
          <T id={isConnected ? "visibility.vm.int.manage" : "visibility.vm.int.connect"} />
        </button>
      </div>
    </article>
  );
}
