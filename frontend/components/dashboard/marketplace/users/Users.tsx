"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { ROLES, USERS, userStats, type Role, type TeamUser, type UserStatus } from "./usersData";

/**
 * Users — the Marketplace → User Management page. A stat strip, a working
 * toolbar (search + role filter), and a users table (avatar, role chip,
 * status chip, last active, actions). Mock data.
 */

const STATUS_TONE: Record<UserStatus, "ok" | "warn" | "muted"> = {
  active: "ok",
  invited: "warn",
  inactive: "muted",
};

const SUMMARY = [
  { key: "total", labelKey: "marketplace.um.sum.total", tone: "info" },
  { key: "active", labelKey: "marketplace.um.sum.active", tone: "ok" },
  { key: "pending", labelKey: "marketplace.um.sum.pending", tone: "warn" },
] as const;

export function Users() {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "all">("all");

  const stats = useMemo(() => userStats(USERS), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return USERS.filter((u) => {
      if (role !== "all" && u.role !== role) return false;
      if (q && !`${u.name} ${u.nameAr} ${u.email}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, role]);

  const lastActive = (min: number | null) => {
    if (min == null) return t("marketplace.um.invited_sent");
    let v: number, unit: string;
    if (min < 60) { v = min; unit = t("visibility.tr.unit_m"); }
    else if (min < 1440) { v = Math.floor(min / 60); unit = t("visibility.tr.unit_h"); }
    else { v = Math.floor(min / 1440); unit = t("visibility.no.unit_d"); }
    return `${v}${unit} ${t("visibility.vm.ago")}`;
  };

  return (
    <div className="ro-page mp-um">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="marketplace.um.title" /></h1>
          <p className="ro-header__sub"><T id="marketplace.um.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ro-action__label"><T id="marketplace.um.invite" /></span>
          </button>
        </div>
      </header>

      {/* ─── Stats ──────────────────────────────────────────────── */}
      <div className="vis-fl-summary">
        {SUMMARY.map((s) => (
          <div key={s.key} className={`vis-fl-stat vis-fl-stat--${s.tone}`}>
            <span className="vis-fl-stat__value">{stats[s.key]}</span>
            <span className="vis-fl-stat__label"><T id={s.labelKey} /></span>
          </div>
        ))}
      </div>

      {/* ─── Toolbar ────────────────────────────────────────────── */}
      <div className="vis-nw-toolbar">
        <div className="vis-tr-search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input type="search" className="vis-tr-search__input" placeholder={t("marketplace.um.search")} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t("marketplace.um.search")} />
        </div>
        <div className="vis-fl-select">
          <select value={role} onChange={(e) => setRole(e.target.value as Role | "all")} aria-label={t("marketplace.um.role_filter")}>
            <option value="all">{t("marketplace.um.all_roles")}</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{t(`marketplace.um.role.${r}`)}</option>
            ))}
          </select>
        </div>
        <span className="vis-nw-toolbar__count"><strong>{rows.length}</strong> <T id="marketplace.um.count" /></span>
      </div>

      {/* ─── Users table ────────────────────────────────────────── */}
      <div className="vis-vm-tablewrap">
        <table className="vis-vm-table">
          <thead>
            <tr>
              <th><T id="marketplace.um.col.user" /></th>
              <th><T id="marketplace.um.col.role" /></th>
              <th><T id="marketplace.um.col.status" /></th>
              <th><T id="marketplace.um.col.last" /></th>
              <th aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="vis-nw-emptycell"><T id="marketplace.um.empty" /></td></tr>
            ) : (
              rows.map((u) => <Row key={u.id} u={u} name={lang === "ar" ? u.nameAr : u.name} lastActive={lastActive} t={t} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ u, name, lastActive, t }: { u: TeamUser; name: string; lastActive: (m: number | null) => string; t: (id: string) => string }) {
  return (
    <tr>
      <td>
        <div className="mp-um-user">
          <span className="mp-um-user__avatar" aria-hidden="true">{name.charAt(0)}</span>
          <div className="mp-um-user__text">
            <span className="mp-um-user__name">{name}</span>
            <span className="mp-um-user__email" dir="ltr">{u.email}</span>
          </div>
        </div>
      </td>
      <td>
        <span className={`vis-tr-chip vis-tr-chip--${u.role === "admin" ? "info" : "muted"}`}>
          <T id={`marketplace.um.role.${u.role}`} />
        </span>
      </td>
      <td>
        <span className={`vis-tr-chip vis-tr-chip--${STATUS_TONE[u.status]}`}>
          {u.status === "active" && <span className="vis-tr-chip__dot" aria-hidden="true" />}
          <T id={`marketplace.um.status.${u.status}`} />
        </span>
      </td>
      <td><span className="mp-um-last">{lastActive(u.lastMin)}</span></td>
      <td>
        <button type="button" className="vis-nw-rowbtn" aria-label={t("marketplace.um.actions")}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <circle cx="5" cy="12" r="1.6" fill="currentColor" />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" />
            <circle cx="19" cy="12" r="1.6" fill="currentColor" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
