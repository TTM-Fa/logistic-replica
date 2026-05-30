"use client";

import Link from "next/link";

/**
 * Variant 3 — "Operator's Desk"
 *
 * Workspace-style, data-dense, what an ops team actually wants to see at
 * 8 AM. Reads top-down:
 *
 *   1. KPI band (4 numbers, gold accents)
 *   2. The 3 models as horizontal pill-buttons (compact)
 *   3. Mock "Recent Shipments" table (5 rows)
 *   4. Right-side notifications panel (in a 2-column section below)
 *
 * Classes prefixed `.v3-`.
 */

const KPIS = [
  { value: "247", label: "Active shipments", delta: "+18 today" },
  { value: "94%", label: "On-time rate", delta: "↑ 2.1% w/w" },
  { value: "12", label: "Live corridors", delta: "GCC + 1" },
  { value: "QAR 1.2M", label: "Volume MTD", delta: "↑ 8.4%" },
];

const MODELS = [
  {
    key: "visibility",
    title: "Visibility",
    href: "/dashboard/visibility",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "marketplace",
    title: "Marketplace",
    href: "/dashboard/marketplace",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
        <path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 14h6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "benchmark",
    title: "Rate Benchmark",
    href: "/dashboard/benchmark",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// Mock shipments table — placeholder data
const SHIPMENTS = [
  { id: "SHN-2847", lane: "Jebel Ali → Doha", status: "In transit", statusKind: "transit", eta: "Today, 18:30", carrier: "Al-Bahar Logistics" },
  { id: "SHN-2841", lane: "Khalifa Port → Riyadh", status: "At customs", statusKind: "warn", eta: "Tomorrow, 09:00", carrier: "Gulf Freight Co." },
  { id: "SHN-2839", lane: "Hamad Port → Mecca", status: "Delayed", statusKind: "alert", eta: "+2 days", carrier: "DesertLine Express" },
  { id: "SHN-2832", lane: "Doha → Manama", status: "Delivered", statusKind: "ok", eta: "Earlier today", carrier: "Trans-Arabia Cargo" },
  { id: "SHN-2828", lane: "Sohar → Doha", status: "In transit", statusKind: "transit", eta: "Today, 22:15", carrier: "Al-Bahar Logistics" },
];

const NOTIFS = [
  { type: "alert", text: "SHN-2839 delayed at UAE-Saudi border — manual review needed", time: "1 h ago" },
  { type: "info", text: "New offer received for the Doha → Riyadh lane (3 carriers)", time: "2 h ago" },
  { type: "ok", text: "Weekly benchmark report is ready — you're 4% under market", time: "Today" },
];

export function Variant3() {
  return (
    <main className="dash-main v3-shell">
      <BackToDesigns />

      <header className="v3-header">
        <div>
          <p className="eyebrow v3-header__eyebrow">OPERATOR'S DESK</p>
          <h1 className="v3-header__heading">
            Good morning, <span className="v3-header__name">Nasser</span>
          </h1>
        </div>
        <div className="v3-header__date" aria-hidden="true">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </header>

      {/* KPI band */}
      <section className="v3-kpis" aria-label="Key metrics">
        {KPIS.map((k, i) => (
          <div key={i} className="v3-kpi">
            <span className="v3-kpi__label">{k.label}</span>
            <span className="v3-kpi__value">{k.value}</span>
            <span className="v3-kpi__delta">{k.delta}</span>
          </div>
        ))}
      </section>

      {/* Models as horizontal pill buttons */}
      <section className="v3-models" aria-label="Models">
        <span className="v3-models__label">JUMP TO</span>
        {MODELS.map((m) => (
          <Link key={m.key} href={m.href} className="v3-model-pill">
            {m.icon}
            {m.title}
          </Link>
        ))}
      </section>

      {/* Two-column: shipments table + notifications */}
      <div className="v3-split">
        <section className="v3-table-card" aria-label="Recent shipments">
          <header className="v3-table-card__header">
            <h2 className="v3-table-card__heading">Recent shipments</h2>
            <a href="#" onClick={(e) => e.preventDefault()} className="v3-table-card__link">View all →</a>
          </header>
          <div className="v3-table-wrap">
            <table className="v3-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Lane</th>
                  <th>Status</th>
                  <th>ETA</th>
                  <th>Carrier</th>
                </tr>
              </thead>
              <tbody>
                {SHIPMENTS.map((s) => (
                  <tr key={s.id}>
                    <td className="v3-table__id">{s.id}</td>
                    <td>{s.lane}</td>
                    <td>
                      <span className={`v3-status v3-status--${s.statusKind}`}>{s.status}</span>
                    </td>
                    <td className="v3-table__eta">{s.eta}</td>
                    <td className="v3-table__carrier">{s.carrier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="v3-notifs" aria-label="Notifications">
          <header className="v3-notifs__header">
            <h2 className="v3-notifs__heading">Notifications</h2>
            <span className="v3-notifs__badge">3 new</span>
          </header>
          <ul className="v3-notifs__list">
            {NOTIFS.map((n, i) => (
              <li key={i} className={`v3-notif v3-notif--${n.type}`}>
                <span className="v3-notif__dot" aria-hidden="true" />
                <div>
                  <p className="v3-notif__text">{n.text}</p>
                  <span className="v3-notif__time">{n.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function BackToDesigns() {
  return (
    <Link href="/dashboard/designs" className="dash-back-link" style={{ marginBottom: "1.5rem" }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to designs
    </Link>
  );
}
