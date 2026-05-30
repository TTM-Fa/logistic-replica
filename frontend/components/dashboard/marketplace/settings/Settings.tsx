"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * Settings — the Marketplace → Settings page. Account preferences grouped
 * into cards: notification rules (per-event frequency + email/push
 * toggles), general preferences, marketplace defaults, and security.
 * Toggles + selects are interactive (local state); all mock.
 */

// Notification events with their default delivery config.
const NOTIF_EVENTS = [
  { key: "lane", freq: "instant", email: true, push: true },
  { key: "rfq", freq: "daily", email: true, push: false },
  { key: "spot", freq: "instant", email: false, push: true },
  { key: "bid", freq: "instant", email: true, push: true },
  { key: "digest", freq: "weekly", email: true, push: false },
] as const;

const FREQS = ["instant", "hourly", "daily", "weekly", "off"];

type NotifState = Record<string, { freq: string; email: boolean; push: boolean }>;

export function Settings() {
  const { t } = useLanguage();

  const [notif, setNotif] = useState<NotifState>(() =>
    Object.fromEntries(NOTIF_EVENTS.map((n) => [n.key, { freq: n.freq, email: n.email, push: n.push }])),
  );
  const [twoFA, setTwoFA] = useState(true);

  const setFreq = (key: string, freq: string) => setNotif((p) => ({ ...p, [key]: { ...p[key], freq } }));
  const toggleCh = (key: string, ch: "email" | "push") =>
    setNotif((p) => ({ ...p, [key]: { ...p[key], [ch]: !p[key][ch] } }));

  return (
    <div className="ro-page mp-set">
      <header className="ro-header">
        <div className="ro-header__text">
          <h1 className="ro-header__title"><T id="marketplace.set.title" /></h1>
          <p className="ro-header__sub"><T id="marketplace.set.sub" /></p>
        </div>
      </header>

      <div className="mp-set-grid">
        {/* ─── Notifications ────────────────────────────────────── */}
        <section className="mp-card mp-set-notif">
          <h2 className="mp-card__title"><T id="marketplace.set.notif.title" /></h2>
          <p className="mp-set-cardsub"><T id="marketplace.set.notif.sub" /></p>

          <div className="mp-set-nhead">
            <span />
            <span className="mp-set-nhead__lbl"><T id="marketplace.set.notif.frequency" /></span>
            <span className="mp-set-nhead__lbl"><T id="marketplace.set.notif.email" /></span>
            <span className="mp-set-nhead__lbl"><T id="marketplace.set.notif.push" /></span>
          </div>

          {NOTIF_EVENTS.map((n) => {
            const s = notif[n.key];
            return (
              <div key={n.key} className="mp-set-nrow">
                <div className="mp-set-nrow__info">
                  <span className="mp-set-nrow__name"><T id={`marketplace.set.notif.ev.${n.key}`} /></span>
                </div>
                <div className="vis-fl-select mp-set-freq">
                  <select value={s.freq} onChange={(e) => setFreq(n.key, e.target.value)} aria-label={t("marketplace.set.notif.frequency")}>
                    {FREQS.map((f) => <option key={f} value={f}>{t(`marketplace.set.freq.${f}`)}</option>)}
                  </select>
                </div>
                <Switch on={s.email} onClick={() => toggleCh(n.key, "email")} label={t("marketplace.set.notif.email")} />
                <Switch on={s.push} onClick={() => toggleCh(n.key, "push")} label={t("marketplace.set.notif.push")} />
              </div>
            );
          })}
        </section>

        {/* ─── Side column ──────────────────────────────────────── */}
        <div className="mp-set-side">
          {/* Preferences */}
          <section className="mp-card">
            <h2 className="mp-card__title"><T id="marketplace.set.pref.title" /></h2>
            <div className="mp-set-fields">
              <Field labelKey="marketplace.set.pref.timezone">
                <select defaultValue="riyadh" aria-label={t("marketplace.set.pref.timezone")}>
                  <option value="riyadh">Riyadh — GMT+3</option>
                  <option value="dubai">Dubai — GMT+4</option>
                  <option value="doha">Doha — GMT+3</option>
                  <option value="kuwait">Kuwait — GMT+3</option>
                </select>
              </Field>
              <Field labelKey="marketplace.set.pref.currency">
                <select defaultValue="SAR" aria-label={t("marketplace.set.pref.currency")}>
                  <option value="SAR">SAR — Saudi Riyal</option>
                  <option value="AED">AED — UAE Dirham</option>
                  <option value="QAR">QAR — Qatari Riyal</option>
                  <option value="USD">USD — US Dollar</option>
                </select>
              </Field>
              <Field labelKey="marketplace.set.pref.units">
                <select defaultValue="km" aria-label={t("marketplace.set.pref.units")}>
                  <option value="km">{t("marketplace.set.units.km")}</option>
                  <option value="mi">{t("marketplace.set.units.mi")}</option>
                </select>
              </Field>
              <Field labelKey="marketplace.set.pref.dateformat">
                <select defaultValue="dmy" aria-label={t("marketplace.set.pref.dateformat")}>
                  <option value="dmy">DD/MM/YYYY</option>
                  <option value="mdy">MM/DD/YYYY</option>
                  <option value="ymd">YYYY-MM-DD</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Marketplace defaults */}
          <section className="mp-card">
            <h2 className="mp-card__title"><T id="marketplace.set.def.title" /></h2>
            <div className="mp-set-fields">
              <Field labelKey="marketplace.set.def.equipment">
                <select defaultValue="any" aria-label={t("marketplace.set.def.equipment")}>
                  <option value="any">{t("marketplace.set.def.any")}</option>
                  <option value="reefer">{t("visibility.fl.type.reefer")}</option>
                  <option value="curtain">{t("visibility.fl.type.curtain")}</option>
                  <option value="flatbed">{t("visibility.fl.type.flatbed")}</option>
                  <option value="box">{t("visibility.fl.type.box")}</option>
                  <option value="tanker">{t("visibility.fl.type.tanker")}</option>
                </select>
              </Field>
              <Field labelKey="marketplace.set.def.region">
                <select defaultValue="ksa" aria-label={t("marketplace.set.def.region")}>
                  <option value="ksa">{t("marketplace.set.region.ksa")}</option>
                  <option value="uae">{t("marketplace.set.region.uae")}</option>
                  <option value="qa">{t("marketplace.set.region.qa")}</option>
                  <option value="gcc">{t("marketplace.set.region.gcc")}</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Security */}
          <section className="mp-card">
            <h2 className="mp-card__title"><T id="marketplace.set.sec.title" /></h2>
            <div className="mp-set-secrow">
              <div className="mp-set-secrow__text">
                <span className="mp-set-secrow__name"><T id="marketplace.set.sec.twofa" /></span>
                <span className="mp-set-secrow__desc"><T id="marketplace.set.sec.twofa_desc" /></span>
              </div>
              <Switch on={twoFA} onClick={() => setTwoFA((v) => !v)} label={t("marketplace.set.sec.twofa")} />
            </div>
            <div className="mp-set-secrow">
              <div className="mp-set-secrow__text">
                <span className="mp-set-secrow__name"><T id="marketplace.set.sec.password" /></span>
                <span className="mp-set-secrow__desc"><T id="marketplace.set.sec.password_desc" /></span>
              </div>
              <button type="button" className="mp-rfq-ghost"><T id="marketplace.set.sec.change" /></button>
            </div>
            <div className="mp-set-secrow mp-set-secrow--last">
              <div className="mp-set-secrow__text">
                <span className="mp-set-secrow__name"><T id="marketplace.set.sec.sessions" /></span>
                <span className="mp-set-secrow__desc"><T id="marketplace.set.sec.sessions_desc" /></span>
              </div>
              <button type="button" className="mp-rfq-ghost"><T id="marketplace.set.sec.manage" /></button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Switch({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      title={label}
      className={`vis-no-switch mp-set-switch${on ? " is-on" : ""}`}
      onClick={onClick}
    >
      <span className="vis-no-switch__knob" aria-hidden="true" />
    </button>
  );
}

function Field({ labelKey, children }: { labelKey: string; children: React.ReactNode }) {
  return (
    <label className="mp-set-field">
      <span className="mp-set-field__label"><T id={labelKey} /></span>
      <div className="vis-fl-select mp-set-field__select">{children}</div>
    </label>
  );
}
