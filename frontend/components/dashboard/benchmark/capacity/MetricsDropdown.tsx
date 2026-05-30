"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { METRICS, type MetricCategory, type MetricKey } from "./capacityData";

/**
 * MetricsDropdown — categorized multi-select popover for the Capacity page.
 *
 * UX pattern (matches the screenshot Taha provided):
 *   - Closed: a button that shows "Metrics: N selected ▾"
 *   - Open:   a popover listing all 8 metrics grouped by category
 *             (General / CONTRACT / SPOT), each with a checkbox
 *   - Max 3 metrics can be checked at once; over-limit checkboxes
 *     become disabled until the user unchecks something
 *   - At the bottom: Cancel (revert) + gold Save (commit)
 *
 * Pending state is held locally — only committed via onSave when the
 * user clicks Save. Cancel and outside-click both discard pending.
 */

interface MetricsDropdownProps {
  selected: Set<MetricKey>;
  onSave: (next: Set<MetricKey>) => void;
}

const MAX_SELECTED = 3;

// Pre-group the metric list once at module load
const GROUPED: Record<MetricCategory, typeof METRICS> = {
  general: METRICS.filter((m) => m.category === "general"),
  contract: METRICS.filter((m) => m.category === "contract"),
  spot: METRICS.filter((m) => m.category === "spot"),
};

export function MetricsDropdown({ selected, onSave }: MetricsDropdownProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  // Pending checkboxes — only committed via onSave
  const [pending, setPending] = useState<Set<MetricKey>>(new Set(selected));
  const wrapRef = useRef<HTMLDivElement>(null);

  // Whenever the dropdown opens, reset pending to match committed
  useEffect(() => {
    if (open) setPending(new Set(selected));
  }, [open, selected]);

  // Close on outside click (any mousedown outside the wrap)
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const togglePending = (key: MetricKey) => {
    setPending((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else if (next.size < MAX_SELECTED) {
        next.add(key);
      }
      // If already 3 selected and user tries to add a new one, nothing happens
      // (the checkbox will be disabled, so this is just a safety net)
      return next;
    });
  };

  const handleSave = () => {
    if (pending.size === 0) return; // require at least 1 metric
    onSave(pending);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="cap-md" ref={wrapRef}>
      {/* Trigger button — shows the committed count, not the pending count */}
      <button
        type="button"
        className="cap-md__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="cap-md__trigger-label">
          <T id="capacity.filter.metrics" />:
        </span>
        <span className="cap-md__trigger-count">
          {selected.size} <T id="capacity.filter.selected" />
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="cap-md__popover" role="dialog" aria-label={t("capacity.filter.metrics")}>
          {/* "Choose up to 3 metrics:" hint */}
          <p className="cap-md__hint">
            <T id="capacity.filter.choose_up_to_3" />
          </p>

          {/* General metrics (no category header) */}
          <div className="cap-md__group">
            {GROUPED.general.map((m) => (
              <MetricCheckbox
                key={m.key}
                labelKey={m.labelKey}
                checked={pending.has(m.key)}
                disabled={!pending.has(m.key) && pending.size >= MAX_SELECTED}
                onToggle={() => togglePending(m.key)}
              />
            ))}
          </div>

          {/* CONTRACT category */}
          <div className="cap-md__category">
            <T id="capacity.filter.category.contract" />
          </div>
          <div className="cap-md__group">
            {GROUPED.contract.map((m) => (
              <MetricCheckbox
                key={m.key}
                labelKey={m.labelKey}
                checked={pending.has(m.key)}
                disabled={!pending.has(m.key) && pending.size >= MAX_SELECTED}
                onToggle={() => togglePending(m.key)}
              />
            ))}
          </div>

          {/* SPOT category */}
          <div className="cap-md__category">
            <T id="capacity.filter.category.spot" />
          </div>
          <div className="cap-md__group">
            {GROUPED.spot.map((m) => (
              <MetricCheckbox
                key={m.key}
                labelKey={m.labelKey}
                checked={pending.has(m.key)}
                disabled={!pending.has(m.key) && pending.size >= MAX_SELECTED}
                onToggle={() => togglePending(m.key)}
              />
            ))}
          </div>

          {/* Action row */}
          <div className="cap-md__actions">
            <button
              type="button"
              className="cap-md__btn"
              onClick={handleCancel}
            >
              <T id="capacity.filter.cancel" />
            </button>
            <button
              type="button"
              className="cap-md__btn cap-md__btn--primary"
              onClick={handleSave}
              disabled={pending.size === 0}
            >
              <T id="capacity.filter.save" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Single checkbox row ──────────────────────────────────────────────
function MetricCheckbox({
  labelKey,
  checked,
  disabled,
  onToggle,
}: {
  labelKey: string;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <label className={`cap-md__option${disabled ? " is-disabled" : ""}${checked ? " is-checked" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
        className="cap-md__check"
      />
      <span className="cap-md__check-visual" aria-hidden="true">
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="cap-md__option-label">
        <T id={labelKey} />
      </span>
    </label>
  );
}
