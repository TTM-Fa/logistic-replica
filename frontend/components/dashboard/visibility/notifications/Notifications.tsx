"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { RULES, type Channel, type EventType } from "./notificationsData";

/**
 * Notifications — the "Notification rules" page. A list of alert rules,
 * each with its trigger, scope, delivery channels, recent activity, and a
 * working on/off switch (local state). Single page, no sub-tabs.
 */

// Event → accent tone + inline icon.
const EVENT_META: Record<EventType, { tone: "alert" | "warn" | "info" | "ok"; icon: React.ReactNode }> = {
  delay: {
    tone: "alert",
    icon: <path d="M12 7v5l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  eta: {
    tone: "warn",
    icon: <path d="M3 12a9 9 0 1 0 9-9M3 12H1m2 0a9 9 0 0 1 .6-3M12 7v5l3 2M3 5l1 3 3-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  untracked: {
    tone: "warn",
    icon: <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 11.5-5.3M19 8a7 7 0 0 1-.8 3.3M3 3l18 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  temp: {
    tone: "info",
    icon: <path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
  arrival: {
    tone: "ok",
    icon: <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
  },
  departed: {
    tone: "info",
    icon: <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  },
};

const CHANNEL_ICON: Record<Channel, React.ReactNode> = {
  email: <path d="M3 6h18v12H3zM3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  sms: <path d="M4 5h16v11H9l-4 3v-3H4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  push: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
};

export function Notifications() {
  const { t } = useLanguage();

  // Local on/off state for each rule, seeded from the data.
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(RULES.map((r) => [r.id, r.enabled])),
  );
  const toggle = (id: string) => setEnabled((p) => ({ ...p, [id]: !p[id] }));

  const activeCount = useMemo(() => Object.values(enabled).filter(Boolean).length, [enabled]);
  const pausedCount = RULES.length - activeCount;
  const weekTriggers = useMemo(
    () => RULES.reduce((s, r) => s + (enabled[r.id] ? r.triggers : 0), 0),
    [enabled],
  );

  // "35m ago" / "2h ago" / "2d ago".
  const lastSeen = (min: number | null) => {
    if (min == null) return t("visibility.no.never");
    let v: number, unit: string;
    if (min < 60) { v = min; unit = t("visibility.tr.unit_m"); }
    else if (min < 1440) { v = Math.floor(min / 60); unit = t("visibility.tr.unit_h"); }
    else { v = Math.floor(min / 1440); unit = t("visibility.no.unit_d"); }
    return `${v}${unit} ${t("visibility.vm.ago")}`;
  };

  return (
    <div className="ro-page vis-no">
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="visibility.no.title" /></h1>
          <p className="ro-header__sub"><T id="visibility.no.sub" /></p>
        </div>
        <div className="ro-header__actions">
          <button type="button" className="ro-action is-primary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="ro-action__label"><T id="visibility.no.add" /></span>
          </button>
        </div>
      </header>

      {/* Summary */}
      <div className="vis-fl-summary">
        <div className="vis-fl-stat vis-fl-stat--ok">
          <span className="vis-fl-stat__value">{activeCount}</span>
          <span className="vis-fl-stat__label"><T id="visibility.no.sum.active" /></span>
        </div>
        <div className="vis-fl-stat vis-fl-stat--muted">
          <span className="vis-fl-stat__value">{pausedCount}</span>
          <span className="vis-fl-stat__label"><T id="visibility.no.sum.paused" /></span>
        </div>
        <div className="vis-fl-stat vis-fl-stat--info">
          <span className="vis-fl-stat__value">{weekTriggers}</span>
          <span className="vis-fl-stat__label"><T id="visibility.no.sum.week" /></span>
        </div>
      </div>

      {/* Rule list */}
      <div className="vis-no-list">
        {RULES.map((r) => {
          const meta = EVENT_META[r.event];
          const on = enabled[r.id];
          return (
            <article key={r.id} className={`vis-no-rule${on ? "" : " is-off"}`}>
              <span className={`vis-no-rule__icon vis-no-rule__icon--${meta.tone}`} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">{meta.icon}</svg>
              </span>

              <div className="vis-no-rule__body">
                <h3 className="vis-no-rule__name"><T id={`visibility.no.ev.${r.event}.name`} /></h3>
                <p className="vis-no-rule__desc"><T id={`visibility.no.ev.${r.event}.desc`} /></p>
                <div className="vis-no-rule__meta">
                  <span className="vis-no-tag">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
                      <path d="M3 7h18M6 12h12M10 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <T id={`visibility.no.scope.${r.scope}`} />
                  </span>
                  <span className="vis-no-channels">
                    {r.channels.map((ch) => (
                      <span key={ch} className="vis-no-channel" title={t(`visibility.no.ch.${ch}`)}>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none">{CHANNEL_ICON[ch]}</svg>
                      </span>
                    ))}
                  </span>
                  <span className="vis-no-rule__last">
                    <T id="visibility.no.last" />: {lastSeen(r.lastMin)}
                    {r.triggers > 0 && <span className="vis-no-rule__count"> · {r.triggers} {t("visibility.no.times")}</span>}
                  </span>
                </div>
              </div>

              {/* On/off switch */}
              <button
                type="button"
                role="switch"
                aria-checked={on}
                className={`vis-no-switch${on ? " is-on" : ""}`}
                onClick={() => toggle(r.id)}
                aria-label={t(on ? "visibility.no.on" : "visibility.no.off")}
                title={t(on ? "visibility.no.on" : "visibility.no.off")}
              >
                <span className="vis-no-switch__knob" aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
