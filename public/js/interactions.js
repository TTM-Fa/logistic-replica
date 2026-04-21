/**
 * interactions.js — Adds interactivity to scraped Market Insights pa *
 * Cross-checked against live screenshots:
 *  lane-overview-from-dropdown-expanded.png   → From/To region dropdown (tree)
 *  lane-overview-frequency-dropdown.png       → Frequency: Weekly/Monthly/Quarterly
 *  lane-overview-metrics-dropdown.png         → Metrics multi-select panel (max 3)
 *  lane-overview-custom-datepicker.png        → Date range picker + dual-year calendar
 *  lane-overview-chart-tooltip.png            → SVG chart hover tooltip
 *  lane-overview-more-info-popover.png        → "More information" popover per metric row
 *  lane-overview-add-to-dashboard-dialog.png  → Add to dashboard confirmation
 *  lane-overview-contact-support.png          → Contact support sidepanel
 *  lane-overview-contact-category.png         → Contact category dropdown
 *  lane-overview-collapsed-nav.png            → Collapse/expand sidebar
 *  lane-comparison-edit-lanes.png             → Edit lanes dialog (unique to Lane Comparison)
 *  lane-comparison-metric-dropdown.png        → Single-metric selector dropdown
 *  lane-comparison-chart-tooltip.png          → Multi-lane comparison tooltip
 *  yearly-comparison-years-dropdown.png       → Years multi-select (max 4, older disabled)
 *  top-movers-overview.png                    → Paywall overlay
 *  top-movers-contact-sales.png               → Contact sales right-panel dialog
 *  top-movers-contact-sales-topics.png        → Topic dropdown in contact sales
 */
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // SHARED TOOLTIP (floating, follows mouse)
  // ─────────────────────────────────────────────────────────────
  const tooltip = document.createElement('div');
  tooltip.id = '__tpr_tooltip';
  tooltip.style.cssText = [
    'position:fixed',
    'background:#1a1a2e',
    'color:#fff',
    'padding:6px 10px',
    'border-radius:4px',
    'font-size:12px',
    'font-family:inherit',
    'pointer-events:none',
    'z-index:99999',
    'opacity:0',
    'transition:opacity 0.15s',
    'max-width:260px',
    'white-space:nowrap',
    'box-shadow:0 2px 8px rgba(0,0,0,0.25)',
  ].join(';');
  document.body.appendChild(tooltip);

  function showTooltip(text, anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    tooltip.textContent = text;
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top  = rect.bottom + 6 + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.opacity = '1';
  }
  function hideTooltip() { tooltip.style.opacity = '0'; }

  function normalizeFieldLabel(text) {
    return (text || '').replace(/\s+/g, ' ').replace(/:+$/, '').trim();
  }

  function getComboboxFieldName(combobox) {
    const labelledBy = combobox.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelEl = document.getElementById(labelledBy);
      if (labelEl) return normalizeFieldLabel(labelEl.textContent);
    }

    let node = combobox;
    for (let depth = 0; depth < 5 && node; depth += 1, node = node.parentElement) {
      const label = node.querySelector('label');
      if (label) {
        const text = normalizeFieldLabel(label.textContent);
        if (text) return text;
      }

      let prev = node.previousElementSibling;
      while (prev) {
        const text = normalizeFieldLabel(prev.textContent);
        if (text) return text;
        prev = prev.previousElementSibling;
      }
    }

    return '';
  }

  function hasFieldContext(combobox, fieldName) {
    let node = combobox;
    for (let depth = 0; depth < 7 && node; depth += 1, node = node.parentElement) {
      const text = normalizeFieldLabel(node.textContent || '');
      if (!text) continue;
      if (text.includes(fieldName)) {
        const comboCount = node.querySelectorAll('[role="combobox"]').length;
        if (comboCount === 1) return true;
      }
    }
    return false;
  }

  function bindSimpleSelectCombobox(fieldName, options) {
    document.querySelectorAll('[role="combobox"]').forEach(combobox => {
      if (combobox.dataset.tprSelectBound === fieldName) return;
      const directName = getComboboxFieldName(combobox);
      if (directName !== fieldName && !hasFieldContext(combobox, fieldName)) return;

      const triggerWrapper = combobox.closest('[class*="p02t267"], [class*="p02t261"], [class*="p02t26l"]')
        || combobox.parentElement
        || combobox;
      const displayDiv = triggerWrapper.querySelector('.p02t26t')
        || combobox.parentElement?.querySelector('.p02t26t')
        || combobox.previousElementSibling?.querySelector?.('.p02t26t');

      if (!displayDiv) return;

      triggerWrapper.style.cursor = 'pointer';
      combobox.dataset.tprSelectBound = fieldName;

      triggerWrapper.addEventListener('click', function (e) {
        e.stopPropagation();
        if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; return; }

        const currentValue = displayDiv.textContent.trim();
        const optionsHTML = options.map(option =>
          `<div data-val="${option}" style="padding:10px 16px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;${option === currentValue ? 'background:#fff7e6;font-weight:600;' : ''}"
               onmouseover="this.style.background='${option === currentValue ? '#fff7e6' : '#f9fafb'}'"
               onmouseout="this.style.background='${option === currentValue ? '#fff7e6' : ''}'">
            <span>${option}</span>
            ${option === currentValue ? '<svg width="14" height="14"><use href="/assets/images/sprite.c65451261fa5bb76c97c.svg#small-check"/></svg>' : ''}
          </div>`
        ).join('');

        openDropdownPanel(triggerWrapper, optionsHTML, val => {
          displayDiv.textContent = val;
          document.dispatchEvent(new CustomEvent('tpr:select', { detail: { field: fieldName, value: val } }));
        });
      });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // SHARED OVERLAY MODAL FACTORY
  // Creates a full-screen semi-transparent backdrop + dialog box.
  // ─────────────────────────────────────────────────────────────
  function createOverlay(contentHTML, opts) {
    opts = opts || {};
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'background:rgba(0,0,0,0.45)',
      'z-index:9000',
      'display:flex',
      opts.align === 'right' ? 'justify-content:flex-end' : 'justify-content:center',
      'align-items:' + (opts.align === 'right' ? 'stretch' : 'center'),
    ].join(';');

    const box = document.createElement('div');
    box.style.cssText = [
      'background:#fff',
      'border-radius:' + (opts.align === 'right' ? '0' : '8px'),
      'padding:24px',
      'max-width:' + (opts.align === 'right' ? '420px' : '560px'),
      'width:100%',
      'box-shadow:0 8px 32px rgba(0,0,0,0.2)',
      'overflow-y:auto',
      'max-height:100vh',
      'font-family:inherit',
      'font-size:14px',
      'color:#222',
    ].join(';');

    box.innerHTML = contentHTML;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Close on backdrop click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });

    // Close via × button if present
    const closeBtn = box.querySelector('[data-close]');
    if (closeBtn) closeBtn.addEventListener('click', () => overlay.remove());

    return { overlay, box };
  }

  // ─────────────────────────────────────────────────────────────
  // SHARED DROPDOWN PANEL FACTORY
  // Opens an inline dropdown panel anchored below a trigger button.
  // ─────────────────────────────────────────────────────────────
  let activeDropdown = null;

  function openDropdownPanel(triggerEl, contentHTML, onItemClick) {
    if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }

    const rect = triggerEl.getBoundingClientRect();
    const panel = document.createElement('div');
    panel.className = '__tpr_dropdown';
    panel.style.cssText = [
      'position:fixed',
      'top:' + (rect.bottom + 2) + 'px',
      'left:' + rect.left + 'px',
      'min-width:' + Math.max(rect.width, 160) + 'px',
      'background:#fff',
      'border:1px solid #e5e7eb',
      'border-radius:6px',
      'box-shadow:0 4px 16px rgba(0,0,0,0.14)',
      'z-index:9100',
      'overflow:hidden',
      'font-family:inherit',
      'font-size:14px',
      'color:#222',
    ].join(';');

    panel.innerHTML = contentHTML;
    document.body.appendChild(panel);
    activeDropdown = panel;

    if (onItemClick) {
      panel.querySelectorAll('[data-val]').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function () {
          onItemClick(this.dataset.val, this.textContent.trim());
          panel.remove();
          activeDropdown = null;
        });
      });
    }

    // Close on outside click
    function outsideClick(e) {
      if (!panel.contains(e.target) && !triggerEl.contains(e.target)) {
        panel.remove();
        activeDropdown = null;
        document.removeEventListener('click', outsideClick, true);
      }
    }
    setTimeout(() => document.addEventListener('click', outsideClick, true), 0);
    return panel;
  }

  // ─────────────────────────────────────────────────────────────
  // 1. SIDEBAR SUBMENU EXPAND / COLLAPSE
  // CSS: ._688zmra:not(._688zmr0) { display:none }
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('button[aria-controls][aria-expanded]').forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const controlled = document.getElementById(this.getAttribute('aria-controls'));
      if (!controlled) return;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      controlled.classList.toggle('_688zmr0', !isExpanded);
      const useEl = this.querySelector('use');
      if (useEl) {
        const href = useEl.getAttribute('href') || '';
        useEl.setAttribute('href', isExpanded
          ? href.replace('chevron-up', 'chevron-down')
          : href.replace('chevron-down', 'chevron-up'));
      }
      const textSpan = this.querySelector('._18ctzv8n');
      if (textSpan) {
        textSpan.textContent = isExpanded
          ? textSpan.textContent.replace('Collapse', 'Expand')
          : textSpan.textContent.replace('Expand', 'Collapse');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. COLLAPSE / EXPAND SIDEBAR NAVIGATION
  // Screenshot: lane-overview-collapsed-nav.png
  // Button text: "Collapse navigation" / "Expand navigation"
  // ─────────────────────────────────────────────────────────────
  (function () {
    const navBtn = Array.from(document.querySelectorAll('button')).find(b =>
      /collapse navigation|expand navigation/i.test(b.textContent));
    if (!navBtn) return;

    const nav = document.querySelector('nav, [role="navigation"]');
    const sidebar = nav ? nav.closest('[class]') : null;

    navBtn.style.cursor = 'pointer';
    navBtn.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') !== 'false';
      this.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      const textSpan = this.querySelector('._18ctzv8n');
      if (textSpan) {
        textSpan.textContent = isExpanded ? 'Expand navigation' : 'Collapse navigation';
      }
      if (sidebar) {
        sidebar.style.transition = 'width 0.2s';
        sidebar.style.overflow = 'hidden';
        if (isExpanded) {
          sidebar.dataset.origWidth = sidebar.style.width || '';
          sidebar.style.width = '56px';
          // Hide text labels, show only icons
          sidebar.querySelectorAll('._18ctzv8n, ._688zmra').forEach(el => {
            el.style.display = 'none';
          });
        } else {
          sidebar.style.width = sidebar.dataset.origWidth || '';
          sidebar.querySelectorAll('._18ctzv8n, ._688zmra').forEach(el => {
            el.style.display = '';
          });
        }
      }
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 3. TOGGLE FULLSCREEN
  // Screenshot: lane-overview-fullscreen.png
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('button').forEach(btn => {
    if (/toggle fullscreen/i.test(btn.textContent)) {
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function () {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 4. TAB NAVIGATION (Standard / Reefer)
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('[role="tab"]').forEach(tab => {
    tab.style.cursor = 'pointer';
    tab.addEventListener('click', function (e) {
      const tablist = this.closest('[role="tablist"]');
      if (tablist) {
        tablist.querySelectorAll('[role="tab"]').forEach(t => t.setAttribute('aria-selected', 'false'));
      }
      this.setAttribute('aria-selected', 'true');
      const href = this.getAttribute('href') || this.querySelector('a')?.getAttribute('href');
      if (href && href.endsWith('.html')) {
        e.preventDefault();
        window.location.href = href;
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4b. €/km | Index RADIO TOGGLE
  // HTML: button[role="radio"][data-value="eur-km|index"]
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('[role="radio"]').forEach(radio => {
    radio.style.cursor = 'pointer';
    radio.addEventListener('click', function () {
      const group = this.closest('[role="radiogroup"]');
      if (group) {
        group.querySelectorAll('[role="radio"]').forEach(r => r.setAttribute('aria-checked', 'false'));
      }
      this.setAttribute('aria-checked', 'true');
      const value = this.dataset.value || this.textContent.trim();
      document.dispatchEvent(new CustomEvent('tpr:unit', { detail: { value } }));
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. FROM / TO REGION DROPDOWN
  // Screenshot: lane-overview-from-dropdown-expanded.png
  // HTML: div[role="combobox"][data-testid="region-dropdown-from|to"]
  // Opens a tree with "Germany (DE)" → sub-regions (Whole country,
  // Central, East, Northeast, Northwest, Southeast, Southwest, West)
  // ─────────────────────────────────────────────────────────────
  const REGIONS = {
    'AF': 'Afghanistan', 'AL': 'Albania', 'AT': 'Austria', 'BA': 'Bosnia and Herzegovina',
    'BE': 'Belgium', 'BG': 'Bulgaria', 'BY': 'Belarus', 'CH': 'Switzerland',
    'CY': 'Cyprus', 'CZ': 'Czech Republic', 'DE': 'Germany', 'DK': 'Denmark',
    'EE': 'Estonia', 'ES': 'Spain', 'FI': 'Finland', 'FR': 'France',
    'GB': 'United Kingdom', 'GR': 'Greece', 'HR': 'Croatia', 'HU': 'Hungary',
    'IE': 'Ireland', 'IT': 'Italy', 'LT': 'Lithuania', 'LU': 'Luxembourg',
    'LV': 'Latvia', 'MD': 'Moldova', 'ME': 'Montenegro', 'MK': 'North Macedonia',
    'MT': 'Malta', 'NL': 'Netherlands', 'NO': 'Norway', 'PL': 'Poland',
    'PT': 'Portugal', 'RO': 'Romania', 'RS': 'Serbia', 'RU': 'Russia',
    'SE': 'Sweden', 'SI': 'Slovenia', 'SK': 'Slovakia', 'TR': 'Turkey',
    'UA': 'Ukraine',
  };

  const DE_REGIONS = ['Whole country', 'Central', 'East', 'Northeast', 'Northwest', 'Southeast', 'Southwest', 'West'];
  const PL_REGIONS = ['Whole country', 'Central', 'East', 'North', 'South', 'West'];
  const FR_REGIONS = ['Whole country', 'Central', 'East', 'North', 'Northeast', 'Northwest', 'South', 'West'];
  const COUNTRY_SUB_REGIONS = { DE: DE_REGIONS, PL: PL_REGIONS, FR: FR_REGIONS };

  function buildRegionDropdownHTML(currentCode) {
    const countryEntries = Object.entries(REGIONS).map(([code, name]) => {
      const isSelected = code === currentCode;
      const subs = COUNTRY_SUB_REGIONS[code] || [];
      const subHTML = subs.length ? `
        <div class="__tpr_subs" style="padding-left:16px;">
          ${subs.map(s => `<div data-val="${code}:${s}" style="padding:6px 12px;cursor:pointer;font-size:13px;color:#444;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">${s}</div>`).join('')}
        </div>` : '';
      return `
        <div style="border-bottom:1px solid #f0f0f0">
          <div data-val="${code}" data-has-subs="${subs.length > 0}"
               style="padding:8px 12px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;${isSelected ? 'background:#fff7e6;font-weight:600;' : ''}"
               onmouseover="this.style.background='${isSelected ? '#fff7e6' : '#f9fafb'}'"
               onmouseout="this.style.background='${isSelected ? '#fff7e6' : ''}'">
            <span>${name} (${code})</span>
            ${isSelected ? '<svg width="14" height="14"><use href="/assets/images/sprite.c65451261fa5bb76c97c.svg#small-check"/></svg>' : ''}
            ${subs.length ? '<svg width="14" height="14"><use href="/assets/images/sprite.c65451261fa5bb76c97c.svg#small-chevron-right"/></svg>' : ''}
          </div>
          ${isSelected ? subHTML : ''}
        </div>`;
    }).join('');

    return `
      <div style="max-height:300px;overflow-y:auto;">
        ${countryEntries}
      </div>`;
  }

  document.querySelectorAll('[role="combobox"][data-testid^="region-dropdown"]').forEach(combobox => {
    combobox.style.cursor = 'pointer';
    const hiddenInput = combobox.parentElement.querySelector('input[type="hidden"]');
    const displaySpan = combobox.querySelector('span');
    const isFrom = combobox.dataset.testid === 'region-dropdown-from';
    const currentCode = hiddenInput ? hiddenInput.value : 'DE';

    // Also make the parent wrapper (the chevron + label container) clickable
    const wrapper = combobox.closest('[class*="c3lk2j"]') || combobox.parentElement;
    if (wrapper) wrapper.style.cursor = 'pointer';

    combobox.addEventListener('click', function (e) {
      e.stopPropagation();
      if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; return; }

      const panel = openDropdownPanel(
        this,
        buildRegionDropdownHTML(hiddenInput ? hiddenInput.value : 'DE'),
        null
      );
      panel.style.minWidth = '220px';
      panel.style.maxHeight = '320px';
      panel.style.overflowY = 'auto';

      panel.querySelectorAll('[data-val]').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function (ev) {
          ev.stopPropagation();
          const val = this.dataset.val;
          const [code, sub] = val.split(':');
          const name = REGIONS[code] || code;
          const label = sub && sub !== 'Whole country' ? `${name} (${code}), ${sub}` : `${name} (${code})`;

          if (displaySpan) displaySpan.textContent = label;
          if (hiddenInput) hiddenInput.value = code;
          combobox.setAttribute('aria-expanded', 'false');
          document.dispatchEvent(new CustomEvent('tpr:region', { detail: { field: isFrom ? 'from' : 'to', code, sub: sub || 'ALL' } }));

          // If country has subs, show them (toggle expansion)
          if (this.dataset.hasSubs === 'true') {
            let subsDiv = this.nextElementSibling;
            if (subsDiv && subsDiv.classList.contains('__tpr_subs')) {
              subsDiv.style.display = subsDiv.style.display === 'none' ? '' : 'none';
            }
            return; // don't close
          }
          panel.remove();
          activeDropdown = null;
        });
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 6. DATE RANGE PICKER
  // Screenshot: lane-overview-custom-datepicker.png
  // Button: data-testid="date-select-dropdown"
  // Options: Last 2 years, Last 13 months, Last 3 months, Custom
  // Custom shows dual-year calendar with Apply button
  // ─────────────────────────────────────────────────────────────
  (function () {
    const dateOptions = [
      { val: 'last-2-years',   label: 'Last 2 years' },
      { val: 'last-13-months', label: 'Last 13 months' },
      { val: 'last-3-months',  label: 'Last 3 months' },
      { val: 'custom',         label: 'Custom' },
    ];

    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    function buildCalendarHTML(year) {
      const rows = [];
      for (let r = 0; r < 4; r++) {
        const cells = MONTHS.slice(r * 3, r * 3 + 3).map(m => {
          const isDisabled = (year === new Date().getFullYear() && MONTHS.indexOf(m) > new Date().getMonth());
          return `<td data-year="${year}" data-month="${m}"
                     style="padding:8px 12px;cursor:${isDisabled ? 'default' : 'pointer'};border-radius:4px;text-align:center;color:${isDisabled ? '#bbb' : '#222'};font-size:13px;"
                     ${isDisabled ? '' : `onmouseover="this.style.background='#fff7e6'" onmouseout="this.style.background=''"` }>${m}</td>`;
        }).join('');
        rows.push(`<tr>${cells}</tr>`);
      }
      return `<table style="border-collapse:collapse;width:100%"><tbody>${rows.join('')}</tbody></table>`;
    }

    function buildDatePickerHTML(selectedPreset, fromYear, toYear) {
      const now = new Date();
      const optionsHTML = dateOptions.map(o =>
        `<div data-val="${o.val}" style="padding:8px 14px;cursor:pointer;${selectedPreset === o.val ? 'background:#fff7e6;font-weight:600;' : ''}"
             onmouseover="this.style.background='${selectedPreset === o.val ? '#fff7e6' : '#f9fafb'}'"
             onmouseout="this.style.background='${selectedPreset === o.val ? '#fff7e6' : ''}'">
          ${o.label}${selectedPreset === o.val ? ' <svg width="12" height="12"><use href="/assets/images/sprite.c65451261fa5bb76c97c.svg#small-check"/></svg>' : ''}
        </div>`
      ).join('');

      const calY1 = fromYear || (now.getFullYear() - 1);
      const calY2 = toYear   || now.getFullYear();
      const calHTML = selectedPreset === 'custom' ? `
        <div style="display:flex;gap:24px;padding:16px;border-top:1px solid #eee;">
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <button data-cal-prev style="background:none;border:none;cursor:pointer;font-size:16px">&#8592;</button>
              <span style="font-weight:600">${calY1}</span>
              <span style="width:24px"></span>
            </div>
            ${buildCalendarHTML(calY1)}
          </div>
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <span style="width:24px"></span>
              <span style="font-weight:600">${calY2}</span>
              <button data-cal-next style="background:none;border:none;cursor:pointer;font-size:16px">&#8594;</button>
            </div>
            ${buildCalendarHTML(calY2)}
          </div>
        </div>
        <div style="padding:8px 16px 16px;text-align:right;border-top:1px solid #eee;">
          <button data-apply-date style="background:#f59e0b;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">Apply</button>
        </div>` : '';

      return `
        <div style="display:flex;">
          <div style="border-right:1px solid #eee;padding:8px 0;min-width:160px;">
            <div style="padding:6px 14px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Choose period</div>
            ${optionsHTML}
          </div>
          <div style="flex:1;">${calHTML}</div>
        </div>`;
    }

    document.querySelectorAll('[data-testid="date-select-dropdown"]').forEach(btn => {
      btn.style.cursor = 'pointer';
      let selectedPreset = 'last-2-years';
      let calFromYear = new Date().getFullYear() - 1;
      let calToYear   = new Date().getFullYear();

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; return; }

        const panel = openDropdownPanel(btn, buildDatePickerHTML(selectedPreset, calFromYear, calToYear), null);
        panel.style.minWidth = '480px';
        panel.style.maxWidth = '700px';
        panel.style.padding = '0';

        function rebuildPanel() {
          panel.innerHTML = buildDatePickerHTML(selectedPreset, calFromYear, calToYear);
          attachEvents();
        }

        function attachEvents() {
          panel.querySelectorAll('[data-val]').forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function (ev) {
              ev.stopPropagation();
              selectedPreset = this.dataset.val;
              if (selectedPreset !== 'custom') {
                // Update button text
                const labelSpan = btn.querySelector('.o57mr5, ._18ctzv8n');
                if (labelSpan) labelSpan.textContent = dateOptions.find(o => o.val === selectedPreset)?.label || '';
                panel.remove(); activeDropdown = null;
                document.dispatchEvent(new CustomEvent('tpr:date', { detail: { preset: selectedPreset } }));
              } else {
                rebuildPanel();
              }
            });
          });

          const prevBtn = panel.querySelector('[data-cal-prev]');
          const nextBtn = panel.querySelector('[data-cal-next]');
          if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); calFromYear--; calToYear--; rebuildPanel(); });
          if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); calFromYear++; calToYear++; rebuildPanel(); });

          const applyBtn = panel.querySelector('[data-apply-date]');
          if (applyBtn) {
            applyBtn.addEventListener('click', e => {
              e.stopPropagation();
              const labelSpan = btn.querySelector('.o57mr5, ._18ctzv8n');
              if (labelSpan) labelSpan.textContent = 'Custom';
              panel.remove(); activeDropdown = null;
            });
          }
        }

        attachEvents();
      });
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 7. FREQUENCY DROPDOWN (Weekly / Monthly / Quarterly)
  // Screenshot: lane-overview-frequency-dropdown.png
  // HTML: react-select combobox with label "Frequency"
  // ─────────────────────────────────────────────────────────────
  (function () {
    const FREQ_OPTIONS = ['Weekly', 'Monthly', 'Quarterly'];
    bindSimpleSelectCombobox('Frequency', FREQ_OPTIONS);
  })();

  // ─────────────────────────────────────────────────────────────
  // 8. METRICS MULTI-SELECT PANEL (up to 3)
  // Screenshot: lane-overview-metrics-dropdown.png
  // Button: id ends in "-button" with text "Metrics: N selected"
  // Panel sections: header "Choose up to 3 metrics:", then groups
  // Spot / Contract each with €/km and Index; plus Diesel Price,
  // Spot Offers Index, Contracted Load Rejection Rate
  // Cancel / Save buttons at bottom
  // ─────────────────────────────────────────────────────────────
  (function () {
    const ALL_METRICS = [
      { val: 'spot-offers',    label: 'Spot Offers Index',                grp: null },
      { val: 'load-rejection', label: 'Contracted Load Rejection Rate',   grp: null },
      { val: 'diesel',         label: 'Diesel Price',                     grp: null },
      { val: 'contract-km',    label: 'Contract Price €/km',              grp: 'Contract' },
      { val: 'contract-idx',   label: 'Contract Price Index',             grp: 'Contract' },
      { val: 'spot-km',        label: 'Spot Price €/km',                  grp: 'Spot' },
      { val: 'spot-idx',       label: 'Spot Price Index',                 grp: 'Spot' },
    ];

    // Default selection (as seen in screenshots: Diesel Price + Contract Price €/km + Spot Price €/km)
    let selectedMetrics = new Set(['diesel', 'contract-km', 'spot-km']);

    document.querySelectorAll('button[id$="-button"]').forEach(btn => {
      const labelSpan = btn.querySelector('._18ctzv8n');
      if (!labelSpan) return;
      const text = btn.textContent;
      if (!/Metrics:/i.test(text)) return;

      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; return; }

        let tempSelected = new Set(selectedMetrics);

        function buildMetricsHTML() {
          const grpOrder = [null, 'Contract', 'Spot'];
          let html = `<div style="padding:8px 12px 4px;font-size:12px;color:#888;">Choose up to 3 metrics:</div>`;
          grpOrder.forEach(grp => {
            const items = ALL_METRICS.filter(m => m.grp === grp);
            if (grp) html += `<div style="padding:4px 12px;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;">${grp}</div>`;
            items.forEach(m => {
              const checked = tempSelected.has(m.val);
              const disabled = !checked && tempSelected.size >= 3;
              html += `<div data-metric="${m.val}" style="padding:8px 12px;cursor:${disabled ? 'default' : 'pointer'};display:flex;align-items:center;gap:8px;${checked ? 'background:#fff7e6;font-weight:600;' : ''}${disabled ? 'opacity:0.4;' : ''}"
                          onmouseover="this.style.background='${checked ? '#fff7e6' : disabled ? '' : '#f9fafb'}'"
                          onmouseout="this.style.background='${checked ? '#fff7e6' : ''}'">
                <span style="width:16px;height:16px;border:2px solid #d1d5db;border-radius:3px;display:inline-flex;align-items:center;justify-content:center;background:${checked ? '#f59e0b' : '#fff'};border-color:${checked ? '#f59e0b' : '#d1d5db'};">
                  ${checked ? '<svg width="10" height="10" fill="#fff"><use href="/assets/images/sprite.c65451261fa5bb76c97c.svg#small-check"/></svg>' : ''}
                </span>
                ${m.label}
              </div>`;
            });
          });
          html += `<div style="padding:10px 12px;display:flex;justify-content:space-between;border-top:1px solid #eee;margin-top:4px;">
            <button data-metrics-cancel style="background:none;border:1px solid #d1d5db;padding:6px 16px;border-radius:4px;cursor:pointer;font-size:13px;">Cancel</button>
            <button data-metrics-save style="background:#f59e0b;color:#fff;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">Save</button>
          </div>`;
          return html;
        }

        const panel = openDropdownPanel(btn, buildMetricsHTML(), null);
        panel.style.minWidth = '220px';
        panel.style.maxWidth = '320px';

        function rebuildMetrics() {
          panel.innerHTML = buildMetricsHTML();
          attachMetricEvents();
        }

        function attachMetricEvents() {
          panel.querySelectorAll('[data-metric]').forEach(item => {
            item.addEventListener('click', function (ev) {
              ev.stopPropagation();
              const val = this.dataset.metric;
              if (tempSelected.has(val)) {
                tempSelected.delete(val);
              } else if (tempSelected.size < 3) {
                tempSelected.add(val);
              }
              rebuildMetrics();
            });
          });
          const cancelBtn = panel.querySelector('[data-metrics-cancel]');
          const saveBtn   = panel.querySelector('[data-metrics-save]');
          if (cancelBtn) cancelBtn.addEventListener('click', e => { e.stopPropagation(); panel.remove(); activeDropdown = null; });
          if (saveBtn) saveBtn.addEventListener('click', e => {
            e.stopPropagation();
            selectedMetrics = new Set(tempSelected);
            const countSpan = btn.querySelector('.o57mr5');
            if (countSpan) countSpan.textContent = selectedMetrics.size + ' selected';
            else if (labelSpan) {
              const match = labelSpan.textContent.match(/(Metrics:\s*)\d+/);
              if (match) labelSpan.textContent = labelSpan.textContent.replace(/\d+ selected/, selectedMetrics.size + ' selected');
            }
            panel.remove(); activeDropdown = null;
          });
        }

        attachMetricEvents();
      });
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 9. SINGLE METRIC DROPDOWN (Lane Comparison / Yearly Comparison)
  // Screenshot: lane-comparison-metric-dropdown.png
  // React-select combobox labelled "Metric" — single select
  // ─────────────────────────────────────────────────────────────
  (function () {
    const SINGLE_METRICS = [
      'Spot Price €/km',
      'Spot Price Index',
      'Contract Price €/km',
      'Contract Price Index',
      'Spot Offers Index',
      'Contracted Load Rejection Rate',
      'Diesel Price',
    ];

    bindSimpleSelectCombobox('Metric', SINGLE_METRICS);
  })();

  // ─────────────────────────────────────────────────────────────
  // 10. YEARS MULTI-SELECT (Yearly Comparison only, max 4)
  // Screenshot: yearly-comparison-years-dropdown.png
  // Button text: "Years: N selected"
  // Years listed: 2026, 2025, 2024, 2023 (checked), 2022-2019 (disabled when 4 selected)
  // ─────────────────────────────────────────────────────────────
  (function () {
    const currentYear = new Date().getFullYear();
    const ALL_YEARS = [currentYear, currentYear-1, currentYear-2, currentYear-3,
                       currentYear-4, currentYear-5, currentYear-6, currentYear-7];
    let selectedYears = new Set([currentYear-3, currentYear-2, currentYear-1, currentYear]);

    document.querySelectorAll('button').forEach(btn => {
      if (!/Years:\s*\d+\s*selected/i.test(btn.textContent)) return;
      btn.style.cursor = 'pointer';

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; return; }

        let tempSelected = new Set(selectedYears);

        function buildYearsHTML() {
          const header = `<div style="padding:6px 14px;font-size:12px;color:#888;">Choose up to 4 years:</div>`;
          const items = ALL_YEARS.map(y => {
            const checked  = tempSelected.has(y);
            const disabled = !checked && tempSelected.size >= 4;
            return `<div data-year="${y}" style="padding:9px 14px;cursor:${disabled ? 'default' : 'pointer'};display:flex;align-items:center;justify-content:space-between;${disabled ? 'opacity:0.45;' : checked ? '' : ''}"
                        onmouseover="this.style.background='${disabled ? '' : '#f9fafb'}'" onmouseout="this.style.background=''">
              <span style="font-weight:${checked ? '600' : '400'}">${y}</span>
              ${checked ? '<svg width="14" height="14"><use href="/assets/images/sprite.c65451261fa5bb76c97c.svg#small-check"/></svg>' : ''}
            </div>`;
          }).join('');
          return header + items;
        }

        const panel = openDropdownPanel(btn, buildYearsHTML(), null);
        panel.style.minWidth = '180px';

        function rebuildYears() {
          panel.innerHTML = buildYearsHTML();
          attachYearEvents();
        }

        function attachYearEvents() {
          panel.querySelectorAll('[data-year]').forEach(item => {
            item.addEventListener('click', function (ev) {
              ev.stopPropagation();
              const y = parseInt(this.dataset.year, 10);
              if (tempSelected.has(y)) {
                if (tempSelected.size > 1) tempSelected.delete(y);
              } else if (tempSelected.size < 4) {
                tempSelected.add(y);
              }
              selectedYears = new Set(tempSelected);
              document.dispatchEvent(new CustomEvent('tpr:years', { detail: { years: [...selectedYears] } }));
              // Update button label immediately
              const countSpan = btn.querySelector('.o57mr5');
              if (countSpan) countSpan.textContent = selectedYears.size + ' selected';
              rebuildYears();
            });
          });
        }

        attachYearEvents();
      });
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 11. EDIT LANES DIALOG (Lane Comparison only)
  // Screenshot: lane-comparison-edit-lanes.png
  // Button text: "Edit lanes" (amber/gold background)
  // Dialog: "At least one lane should be selected, up to 4 maximum"
  // Rows: From dropdown + ⇄ swap + To dropdown + 🗑 delete
  // + empty row for new lane; Cancel / Save buttons
  // ─────────────────────────────────────────────────────────────
  (function () {
    document.querySelectorAll('button').forEach(btn => {
      if (btn.textContent.trim() !== 'Edit lanes') return;
      btn.style.cursor = 'pointer';

      btn.addEventListener('click', function () {
        const lanesData = [
          { from: 'Germany (DE), Central', to: 'Germany (DE), East' },
          { from: 'Germany (DE), East',    to: 'Germany (DE), Central' },
          { from: '', to: '' },
        ];

        function buildLanesDialogHTML() {
          const rows = lanesData.map((lane, i) => {
            const hasData = lane.from || lane.to;
            return `
              <div class="__lane_row" data-idx="${i}" style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
                <select data-lane-from="${i}" style="flex:1;padding:8px 10px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;cursor:pointer;">
                  ${hasData || true ? `<option value="${lane.from}">${lane.from || 'From'}</option>` : '<option value="">From</option>'}
                  <option>Germany (DE), Central</option>
                  <option>Germany (DE), East</option>
                  <option>Germany (DE), Northeast</option>
                  <option>Germany (DE), Northwest</option>
                  <option>Germany (DE), Southeast</option>
                  <option>Germany (DE), Southwest</option>
                  <option>Germany (DE), West</option>
                  <option>Poland (PL)</option>
                  <option>France (FR)</option>
                </select>
                <button data-swap-lane="${i}" style="background:none;border:none;cursor:pointer;padding:4px;font-size:16px;" title="Swap from and to">⇄</button>
                <select data-lane-to="${i}" style="flex:1;padding:8px 10px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;cursor:pointer;${!lane.from ? 'background:#f9fafb;color:#aaa;' : ''}">
                  ${!lane.from ? '<option value="">To</option>' : `<option value="${lane.to}">${lane.to || 'To'}</option>`}
                  ${lane.from ? `<option>Germany (DE), Central</option><option>Germany (DE), East</option>` : ''}
                </select>
                ${hasData ? `<button data-delete-lane="${i}" style="background:none;border:none;cursor:pointer;padding:4px;color:#666;" title="Delete lane">
                  <svg width="16" height="16"><use href="/assets/images/sprite.c65451261fa5bb76c97c.svg#small-trash"/></svg>
                </button>` : '<div style="width:24px"></div>'}
              </div>`;
          }).join('');

          return `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
              <h2 style="margin:0;font-size:16px;font-weight:600;">Edit lanes</h2>
              <button data-close style="background:none;border:none;cursor:pointer;font-size:18px;color:#888;line-height:1;">×</button>
            </div>
            <p style="font-size:13px;color:#666;margin:0 0 14px;">At least one lane should be selected, up to 4 maximum</p>
            <div id="__lane_rows">${rows}</div>
            <div style="display:flex;justify-content:space-between;margin-top:16px;padding-top:14px;border-top:1px solid #eee;">
              <button data-cancel-lanes style="background:none;border:1px solid #d1d5db;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;">Cancel</button>
              <button data-save-lanes style="background:#f59e0b;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">Save</button>
            </div>`;
        }

        const { overlay, box } = createOverlay(buildLanesDialogHTML());
        box.style.maxWidth = '640px';

        box.addEventListener('click', function (e) {
          const target = e.target.closest('[data-swap-lane], [data-delete-lane], [data-cancel-lanes], [data-save-lanes]');
          if (!target) return;
          if (target.hasAttribute('data-swap-lane')) {
            const idx = parseInt(target.dataset.swapLane);
            const [a, b] = [lanesData[idx].from, lanesData[idx].to];
            lanesData[idx].from = b; lanesData[idx].to = a;
            box.innerHTML = buildLanesDialogHTML();
          } else if (target.hasAttribute('data-delete-lane')) {
            const idx = parseInt(target.dataset.deleteLane);
            lanesData.splice(idx, 1);
            box.innerHTML = buildLanesDialogHTML();
          } else if (target.hasAttribute('data-cancel-lanes') || target.hasAttribute('data-save-lanes')) {
            overlay.remove();
          }
        });
      });
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 12. MORE INFORMATION POPOVER (metric table rows)
  // Screenshot: lane-overview-more-info-popover.png
  // Button: aria-haspopup="dialog" with text "More information"
  // Opens a bubble: description text + "Learn more about this metric." + "Last update: N hours ago"
  // ─────────────────────────────────────────────────────────────
  const METRIC_DESCRIPTIONS = {
    'Spot Price': 'The average freight rate paid for spot loads on this corridor.',
    'Contract Price': 'The average freight rate for contract loads on this corridor.',
    'Diesel Price': 'The average diesel retail price in the origin country.',
    'Spot Price Index': 'Spot price relative to a baseline period (100 = baseline).',
    'Contract Price Index': 'Contract price relative to a baseline period (100 = baseline).',
    'Spot Offers Index': 'Number of spot price offers relative to a baseline period.',
    'Contracted Load Rejection Rate': 'Share of contracted loads rejected by carriers.',
  };

  let activePopover = null;

  document.querySelectorAll('button[aria-haspopup="dialog"]').forEach(btn => {
    if (!/more information/i.test(btn.textContent)) return;
    btn.style.cursor = 'pointer';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (activePopover) { activePopover.remove(); activePopover = null; return; }

      // Find metric name from parent row
      const row = this.closest('tr, [role="row"], span');
      const rowText = row ? row.textContent : '';
      let desc = 'Metric information.';
      for (const [key, val] of Object.entries(METRIC_DESCRIPTIONS)) {
        if (rowText.includes(key)) { desc = val; break; }
      }

      const popover = document.createElement('div');
      popover.style.cssText = [
        'position:absolute',
        'background:#fff',
        'border:1px solid #e5e7eb',
        'border-radius:6px',
        'padding:12px 14px',
        'max-width:280px',
        'font-size:13px',
        'color:#333',
        'z-index:8000',
        'box-shadow:0 4px 16px rgba(0,0,0,0.12)',
        'line-height:1.5',
      ].join(';');

      const rect = this.getBoundingClientRect();
      popover.style.top  = (window.scrollY + rect.bottom + 4) + 'px';
      popover.style.left = (window.scrollX + rect.left) + 'px';

      popover.innerHTML = `
        <div>${desc}</div>
        <div style="margin-top:6px;"><a href="#" onclick="return false" style="color:#f59e0b;font-size:12px;">Learn more about this metric.</a></div>
        <div style="margin-top:4px;color:#999;font-size:11px;">Last update: 3 hours ago</div>`;

      document.body.appendChild(popover);
      activePopover = popover;

      function closePopover(ev) {
        if (!popover.contains(ev.target)) {
          popover.remove(); activePopover = null;
          document.removeEventListener('click', closePopover, true);
        }
      }
      setTimeout(() => document.addEventListener('click', closePopover, true), 0);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 13. ADD TO DASHBOARD BUTTON
  // Screenshot: lane-overview-add-to-dashboard-dialog.png
  // Button text: "Add to dashboard"
  // Opens confirmation dialog: "Add this view to a dashboard?" + Cancel/Add
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('button').forEach(btn => {
    if (!/add to dashboard/i.test(btn.textContent)) return;
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', function () {
      createOverlay(`
        <div style="text-align:center;">
          <div style="font-size:32px;margin-bottom:12px;">📊</div>
          <h2 style="margin:0 0 8px;font-size:16px;font-weight:600;">Add to dashboard</h2>
          <p style="color:#666;font-size:14px;margin:0 0 20px;">This view will be added to your default dashboard.</p>
          <div style="display:flex;gap:10px;justify-content:center;">
            <button data-close style="border:1px solid #d1d5db;background:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;">Cancel</button>
            <button data-close style="background:#f59e0b;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">Add</button>
          </div>
        </div>`);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 14. CONTACT SUPPORT SIDEPANEL
  // Screenshot: lane-overview-contact-support.png, lane-overview-contact-category.png
  // Link: "Contact support" or data-action="contact-support"
  // Panel slides in from right: topic dropdown + message textarea + Submit
  // Categories: I have feedback, I have a question, I have a problem, Other
  // ─────────────────────────────────────────────────────────────
  (function () {
    const SUPPORT_CATEGORIES = ['I have feedback', 'I have a question', 'I have a problem', 'Other'];

    function openContactSupportPanel() {
      const { overlay, box } = createOverlay(`
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid #eee;">
          <h2 style="margin:0;font-size:16px;font-weight:600;">Contact support</h2>
          <button data-close style="background:none;border:none;cursor:pointer;font-size:20px;color:#888;line-height:1;">×</button>
        </div>
        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;">Category</label>
          <select id="__support_cat" style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;cursor:pointer;">
            <option value="">Select a category</option>
            ${SUPPORT_CATEGORIES.map(c => `<option>${c}</option>`).join('')}
          </select>
        </div>
        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;">Your message</label>
          <textarea placeholder="Please tell us how we can help you" style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;min-height:120px;resize:vertical;box-sizing:border-box;"></textarea>
        </div>
        <button style="background:#f59e0b;color:#fff;border:none;padding:10px 24px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;" onclick="this.closest('[style*=fixed]') && this.closest('[style*=fixed]').remove()">Submit</button>`,
        { align: 'right' });
    }

    // Wire up "Contact support" links and buttons
    document.querySelectorAll('a, button').forEach(el => {
      const text = el.textContent.trim();
      const isSupport = text === 'Contact support'
        || el.dataset.action === 'contact-support'
        || el.getAttribute('href')?.includes('contact-support');
      if (!isSupport) return;
      el.style.cursor = 'pointer';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openContactSupportPanel();
      });
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 15. CONTACT SALES DIALOG (Top Movers paywall)
  // Screenshot: top-movers-contact-sales.png, top-movers-contact-sales-topics.png
  // Button: "Contact sales"
  // Right-panel: "Contact sales" heading + "What would you like to discuss"
  //   dropdown (Book a demo / Upgrade my subscription / Sales consultation / Other)
  //   + "Your message" textarea + Submit button
  // ─────────────────────────────────────────────────────────────
  (function () {
    const SALES_TOPICS = ['Book a demo', 'Upgrade my subscription', 'Sales consultation', 'Other'];

    document.querySelectorAll('button').forEach(btn => {
      if (btn.textContent.trim() !== 'Contact sales') return;
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function () {
        createOverlay(`
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid #eee;">
            <h2 style="margin:0;font-size:16px;font-weight:600;">Contact sales</h2>
            <button data-close style="background:none;border:none;cursor:pointer;font-size:20px;color:#888;line-height:1;">×</button>
          </div>
          <p style="font-size:14px;color:#444;margin:0 0 20px;">We are here to assist you. Please provide more details below &amp; we will reach out to you.</p>
          <div style="margin-bottom:16px;">
            <label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;">What would you like to discuss</label>
            <select style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;cursor:pointer;color:#888;">
              <option value="">Select topic</option>
              ${SALES_TOPICS.map(t => `<option>${t}</option>`).join('')}
            </select>
          </div>
          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:13px;font-weight:500;margin-bottom:6px;">Your message</label>
            <textarea placeholder="Please tell us how we can help you" style="width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;min-height:120px;resize:vertical;box-sizing:border-box;"></textarea>
          </div>
          <button data-close style="background:#fff;color:#222;border:1px solid #d1d5db;padding:10px 28px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">Submit</button>`,
          { align: 'right' });
      });
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 16. HELP BUTTON → HELP SIDEPANEL
  // Screenshot: lane-overview-help-panel.png
  // Button: "Help" (with question-mark icon)
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.trim() !== 'Help') return;
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', function () {
      createOverlay(`
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #eee;">
          <h2 style="margin:0;font-size:16px;font-weight:600;">Help center</h2>
          <button data-close style="background:none;border:none;cursor:pointer;font-size:20px;color:#888;line-height:1;">×</button>
        </div>
        <nav style="font-size:12px;color:#999;margin-bottom:16px;">
          <span style="cursor:pointer;color:#f59e0b;">Help</span> › <span style="cursor:pointer;color:#f59e0b;">Knowledge Center</span> › Lane Overview
        </nav>
        <h3 style="font-size:14px;font-weight:600;margin:0 0 8px;">Lane Overview</h3>
        <p style="font-size:13px;color:#555;line-height:1.6;margin:0 0 16px;">
          The Lane Overview shows freight market data for a specific origin–destination pair.
          Select the From and To regions using the dropdowns, choose a date range and frequency,
          and pick up to 3 metrics to compare.
        </p>
        <h4 style="font-size:13px;font-weight:600;margin:0 0 8px;">Related articles</h4>
        <ul style="padding:0;list-style:none;margin:0;">
          <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#3b82f6;cursor:pointer;">How to read the lane price chart</li>
          <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#3b82f6;cursor:pointer;">Understanding Spot Price vs Contract Price</li>
          <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#3b82f6;cursor:pointer;">Exporting data from Market Insights</li>
          <li style="padding:8px 0;font-size:13px;color:#3b82f6;cursor:pointer;">Adding views to your dashboard</li>
        </ul>`,
        { align: 'right' });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 17. CHART HOVER TOOLTIP
  // Screenshot: lane-overview-chart-tooltip.png
  // The chart is an <img> or SVG. On mousemove over the chart area,
  // show a floating tooltip with mock metric data.
  // ─────────────────────────────────────────────────────────────
  (function () {
    const CHART_TOOLTIP_DATA = [
      { metric: 'Contract Price (€/km)', value: '€1.97', period: 'CW9, Feb \'25',  wow: '-€0.00 (0%) Since CW8, Feb \'25',  yoy: '-€0.01 (-1%) Since CW9, Feb \'24',  transports: '<11500', dist: '341 kms' },
      { metric: 'Spot Price (€/km)',     value: '€1.80', period: 'CW11, Mar \'26', wow: '+€0.03 (+1.6%) Since CW10',          yoy: '+€0.04 (+2.3%) Since CW11, \'25',   transports: '<8000',  dist: '341 kms' },
      { metric: 'Diesel Price (€/l)',    value: '€1.61', period: 'CW11, Mar \'26', wow: '-€0.01 (-0.7%) Since CW10',          yoy: '-€0.08 (-4.7%) Since CW11, \'25',   transports: null,     dist: null },
    ];

    let chartTooltipEl = document.createElement('div');
    chartTooltipEl.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:8500',
      'display:none',
      'background:#fff',
      'border:1px solid #e5e7eb',
      'border-radius:6px',
      'padding:10px 14px',
      'font-size:12px',
      'color:#333',
      'box-shadow:0 4px 16px rgba(0,0,0,0.12)',
      'min-width:220px',
      'line-height:1.6',
    ].join(';');
    document.body.appendChild(chartTooltipEl);

    let chartTooltipIdx = 0;

    function getSeriesPaths(chart) {
      return Array.from(chart.querySelectorAll('path[stroke], polyline[stroke], line[stroke]')).filter(path => {
        const stroke = (path.getAttribute('stroke') || '').trim();
        if (!stroke) return false;
        if (stroke.includes('rgba(0, 0, 0, 0.18)')) return false; // grid lines
        if (stroke === 'none') return false;
        return true;
      });
    }

    function resetSeriesStyles(paths) {
      paths.forEach(path => {
        path.style.opacity = '';
        path.style.strokeWidth = path.dataset.tprBaseStrokeWidth || path.getAttribute('stroke-width') || '';
        path.style.filter = '';
      });
    }

    function bindChartHover(chart) {
      if (chart.dataset.tprChartBound === 'true') return;
      chart.dataset.tprChartBound = 'true';
      chart.style.cursor = 'crosshair';

      const seriesPaths = getSeriesPaths(chart);
      seriesPaths.forEach(path => {
        const base = path.getAttribute('stroke-width') || '2';
        path.dataset.tprBaseStrokeWidth = base;
        path.style.transition = 'stroke-width 0.12s ease, filter 0.12s ease, opacity 0.12s ease';
      });

      chart.addEventListener('mouseenter', function () {
        chartTooltipEl.style.display = 'block';
        seriesPaths.forEach(path => {
          path.style.opacity = '0.45';
        });
      });

      chart.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const offsetX = typeof e.offsetX === 'number' ? e.offsetX : (e.clientX - rect.left);
        const offsetY = typeof e.offsetY === 'number' ? e.offsetY : (e.clientY - rect.top);
        chartTooltipIdx = Math.floor((offsetX / (rect.width || 400)) * CHART_TOOLTIP_DATA.length);
        chartTooltipIdx = Math.max(0, Math.min(chartTooltipIdx, CHART_TOOLTIP_DATA.length - 1));
        const d = CHART_TOOLTIP_DATA[chartTooltipIdx];

        if (seriesPaths.length) {
          const xRatio = Math.max(0, Math.min(1, offsetX / (rect.width || 1)));
          let winner = null;
          let winnerDist = Number.POSITIVE_INFINITY;

          seriesPaths.forEach(path => {
            try {
              const totalLength = path.getTotalLength();
              if (!totalLength || !Number.isFinite(totalLength)) return;
              const point = path.getPointAtLength(totalLength * xRatio);
              const dist = Math.abs(point.y - offsetY);
              if (dist < winnerDist) {
                winnerDist = dist;
                winner = path;
              }
            } catch (_) {
              // Ignore unsupported SVG path methods.
            }
          });

          seriesPaths.forEach(path => {
            const base = parseFloat(path.dataset.tprBaseStrokeWidth || '2');
            if (winner && path === winner) {
              path.style.opacity = '1';
              path.style.strokeWidth = String(Math.max(base + 1.2, 3));
              path.style.filter = 'brightness(1.08)';
            } else {
              path.style.opacity = '0.35';
              path.style.strokeWidth = String(base);
              path.style.filter = '';
            }
          });
        }

        chartTooltipEl.innerHTML = `
          <div style="font-weight:600;margin-bottom:4px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f97316;margin-right:5px;"></span>
            ${d.metric}
          </div>
          <div style="font-size:15px;font-weight:700;display:flex;justify-content:space-between;">
            <span>${d.value}</span>
            <span style="font-size:11px;font-weight:400;color:#888;">${d.period}</span>
          </div>
          <div style="color:${d.wow.startsWith('+') ? '#16a34a' : '#dc2626'};font-size:11px;">▼ ${d.wow}</div>
          <div style="color:${d.yoy.startsWith('+') ? '#16a34a' : '#dc2626'};font-size:11px;">▼ ${d.yoy}</div>
          ${d.transports ? `<div style="color:#888;font-size:11px;display:flex;justify-content:space-between;margin-top:4px;"><span>Transports: ${d.transports}</span><span>${d.dist}</span></div>` : ''}`;

        chartTooltipEl.style.left = (e.clientX + 14) + 'px';
        chartTooltipEl.style.top  = (e.clientY - 20) + 'px';

        // Keep tooltip within viewport
        const tooltipRect = chartTooltipEl.getBoundingClientRect();
        if (tooltipRect.right > window.innerWidth - 8) {
          chartTooltipEl.style.left = (e.clientX - tooltipRect.width - 14) + 'px';
        }
      });

      chart.addEventListener('mouseleave', function () {
        chartTooltipEl.style.display = 'none';
        resetSeriesStyles(seriesPaths);
      });
    }

    document.querySelectorAll('[data-testid*="chart"]').forEach(container => {
      bindChartHover(container.querySelector('svg') || container);
    });

    document.querySelectorAll('img[alt="chart"], img[alt*="chart"], img[alt*="Chart"], [class*="chart"] img, [class*="reachart"] svg, canvas').forEach(bindChartHover);
  })();

  // ─────────────────────────────────────────────────────────────
  // 18. BUTTON HOVER STATES & CURSOR
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll([
    'button',
    '[role="tab"]',
    '[role="menuitem"]',
    '[role="option"]',
    '[tabindex="0"]',
    'a[href]',
    '[role="combobox"]',
  ].join(',')).forEach(el => { el.style.cursor = 'pointer'; });

  // ─────────────────────────────────────────────────────────────
  // 19. BUTTON TOOLTIPS
  // Map confirmed button texts → tooltip text from live screenshots
  // ─────────────────────────────────────────────────────────────
  const BUTTON_TOOLTIPS = {
    'Export':                      'This option is only available in the paid version',
    'Toggle fullscreen':           'Toggle fullscreen mode',
    'Swap from and to':            'Swap origin and destination',
    'Enable email notifications':  'Enable email notifications for this page',
    'Copy link':                   'Copy link to clipboard',
    'Log out':                     'Log out of your account',
  };

  document.querySelectorAll('button').forEach(btn => {
    const text = (btn.querySelector('._18ctzv8n')?.textContent || btn.textContent).trim();
    const tipText = BUTTON_TOOLTIPS[text];
    if (!tipText) return;
    btn.addEventListener('mouseenter', () => showTooltip(tipText, btn));
    btn.addEventListener('mouseleave', hideTooltip);
  });

  // ─────────────────────────────────────────────────────────────
  // 20. KEYBOARD SUPPORT
  // Escape closes dropdowns, popovers, and overlays
  // ─────────────────────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
      if (activePopover)  { activePopover.remove();  activePopover  = null; }
      document.querySelectorAll('[style*="position:fixed"][style*="background:rgba"]').forEach(el => el.remove());
      hideTooltip();
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 21. FORM SUBMIT PREVENTION
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => e.preventDefault());
  });

  // ─────────────────────────────────────────────────────────────
  // 22. MOCK API PROBE (non-blocking, dev only)
  // ─────────────────────────────────────────────────────────────
  (async function () {
    try {
      const res = await fetch('/api/v1/viewer', { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        const v = await res.json();
        console.log(`[mock-api] Connected — User: ${v.customerName} (${v.email})`);
      }
    } catch (_) { /* not running — pages work statically */ }
  })();

  console.log('[interactions.js] v2 loaded — all Lanes interactions active');
})();
