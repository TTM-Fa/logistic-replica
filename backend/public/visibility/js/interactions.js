/**
 * Visibility — interactions.js
 * Wires up navigation, tabs, dropdowns, search, banners, and tooltips
 * for the frozen HTML replica of app.sixfold.com.
 *
 * Pages: dashboards, transports, data-network, analytics,
 *        vehicle-management, fleet, notifications, shared-views
 */
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // Utility: active dropdown tracker (only one at a time)
  // ─────────────────────────────────────────────────────────────
  let activeDropdown = null;
  document.addEventListener('click', () => {
    if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
  });

  function openDropdownPanel(anchor, innerHtml, onSelect) {
    if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
    const panel = document.createElement('div');
    panel.className = '__vis_dropdown';
    panel.innerHTML = innerHtml;
    Object.assign(panel.style, {
      position: 'absolute',
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      zIndex: '9999',
      minWidth: '200px',
      overflow: 'hidden',
    });
    document.body.appendChild(panel);
    const rect = anchor.getBoundingClientRect();
    panel.style.top = (rect.bottom + window.scrollY + 4) + 'px';
    panel.style.left = (rect.left + window.scrollX) + 'px';
    panel.addEventListener('click', e => e.stopPropagation());
    activeDropdown = panel;
    return panel;
  }

  // ─────────────────────────────────────────────────────────────
  // 1. SIDEBAR NAVIGATION
  // Each page has <nav data-test-id="sideMenuNav"> with <a> links.
  // Active item: aria-current="true"
  // ─────────────────────────────────────────────────────────────
  const NAV_ITEMS = {
    dashboards:               'dashboards.html',
    roadTransports:           'transports.html',
    visibilityControlCenter:  'data-network.html',
    analytics:                'analytics.html',
    connectedVehicles:        'vehicle-management.html',
    fleetMonitor:             'fleet.html',
    notifications:            'notifications.html',
    'shared-views':           'shared-views.html',
  };

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('[data-test-id="sideMenuNav"] a[data-test-id]').forEach(link => {
    const testId = link.getAttribute('data-test-id');
    const target = NAV_ITEMS[testId];
    if (!target) return;

    // Fix href to relative .html
    link.setAttribute('href', target);
    link.style.cursor = 'pointer';

    // Set active state
    if (target === currentPage) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }

    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = target;
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. SIDEBAR COLLAPSE / EXPAND
  // Button with "Expand navigation" text or aria-controls="_r_1_"
  // ─────────────────────────────────────────────────────────────
  (function () {
    const sidebar = document.querySelector('header');
    if (!sidebar) return;
    const collapseBtn = sidebar.querySelector('button[aria-controls]')
      || Array.from(sidebar.querySelectorAll('button')).find(b =>
        b.textContent.includes('Expand navigation') || b.textContent.includes('Collapse'));
    if (!collapseBtn) return;

    let collapsed = false;
    const navEl = sidebar.querySelector('nav[data-test-id="sideMenuNav"]');
    const textSpans = navEl ? navEl.querySelectorAll('.xhxs2b0') : [];
    const helpBtn = sidebar.querySelector('[data-test-id="helpCenter"]');
    const companyBtn = sidebar.querySelector('[data-test-id="companySwitcher"]');

    collapseBtn.style.cursor = 'pointer';
    collapseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      collapsed = !collapsed;
      this.setAttribute('aria-expanded', String(!collapsed));

      // Toggle sidebar width
      const sidebarInner = sidebar.closest('._1ohrhg10') || sidebar.parentElement;
      if (collapsed) {
        if (sidebarInner) sidebarInner.style.width = '64px';
        textSpans.forEach(s => s.style.display = 'none');
        if (helpBtn) helpBtn.querySelector('.xhxs2b0')?.style && (helpBtn.querySelector('.xhxs2b0').style.display = 'none');
        if (companyBtn) companyBtn.querySelector('.xhxs2b0')?.style && (companyBtn.querySelector('.xhxs2b0').style.display = 'none');
        // Rotate chevron
        const svg = this.querySelector('svg');
        if (svg) svg.style.transform = 'rotate(180deg)';
      } else {
        if (sidebarInner) sidebarInner.style.width = '';
        textSpans.forEach(s => s.style.display = '');
        if (helpBtn) helpBtn.querySelector('.xhxs2b0')?.style && (helpBtn.querySelector('.xhxs2b0').style.display = '');
        if (companyBtn) companyBtn.querySelector('.xhxs2b0')?.style && (companyBtn.querySelector('.xhxs2b0').style.display = '');
        const svg = this.querySelector('svg');
        if (svg) svg.style.transform = '';
      }
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 3. TAB NAVIGATION
  // vehicle-management: _7lkwi95 tabs (Dedicated vehicles, etc.)
  // data-network: _7lkwi95 tabs (Providing/Receiving visibility)
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('a._7lkwi95, a[class*="_7lkwi95"]').forEach(tab => {
    tab.style.cursor = 'pointer';
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      // Update active state on siblings
      const parent = this.closest('nav') || this.parentElement;
      if (parent) {
        parent.querySelectorAll('a._7lkwi95, a[class*="_7lkwi95"]').forEach(t => {
          t.setAttribute('aria-current', 'false');
          t.classList.remove('_7lkwi93');
        });
      }
      this.setAttribute('aria-current', 'true');
      this.classList.add('_7lkwi93');

      // Dispatch event for tab change
      document.dispatchEvent(new CustomEvent('vis:tab', {
        detail: { href: this.getAttribute('href'), text: this.textContent.trim() }
      }));
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 4. HELP CENTER BUTTON
  // data-test-id="helpCenter" → opens a help panel/dialog
  // ─────────────────────────────────────────────────────────────
  (function () {
    const helpBtn = document.querySelector('[data-test-id="helpCenter"]');
    if (!helpBtn) return;
    helpBtn.style.cursor = 'pointer';
    helpBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));

      if (!expanded) {
        const html = `
          <div style="padding:16px 20px;width:280px;">
            <div style="font-weight:600;font-size:15px;margin-bottom:12px;color:#333;">Help Center</div>
            <a href="https://intercom.help/sixfold" target="_blank" style="display:block;padding:10px 0;color:#0073e6;text-decoration:none;border-bottom:1px solid #eee;">
              📖 Knowledge Base
            </a>
            <a href="https://help.platform.example.com" target="_blank" style="display:block;padding:10px 0;color:#0073e6;text-decoration:none;border-bottom:1px solid #eee;">
              🔧 Help
            </a>
            <div style="padding:10px 0;color:#888;font-size:12px;">
              Need help? Contact your account manager.
            </div>
          </div>
        `;
        openDropdownPanel(helpBtn, html);
      } else {
        if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
      }
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 5. COMPANY SWITCHER
  // data-test-id="companySwitcher" → dropdown with company info
  // ─────────────────────────────────────────────────────────────
  (function () {
    const compBtn = document.querySelector('[data-test-id="companySwitcher"]');
    if (!compBtn) return;
    compBtn.style.cursor = 'pointer';
    compBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));

      if (!expanded) {
        const html = `
          <div style="padding:16px 20px;width:260px;">
            <div style="font-weight:600;font-size:14px;color:#333;margin-bottom:8px;">Account</div>
            <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #eee;">
              <span style="width:36px;height:36px;border-radius:50%;background:#0073e6;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">AA</span>
              <div>
                <div style="font-weight:500;font-size:13px;color:#333;">Demo Company</div>
                <div style="font-size:12px;color:#888;">demo@platform.example.com</div>
              </div>
            </div>
            <div style="padding:10px 0;font-size:13px;color:#555;cursor:pointer;" onmouseover="this.style.color='#0073e6'" onmouseout="this.style.color='#555'">
              ⚙️ Settings
            </div>
            <div style="padding:10px 0;font-size:13px;color:#e53935;cursor:pointer;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
              🚪 Sign out
            </div>
          </div>
        `;
        openDropdownPanel(compBtn, html);
      } else {
        if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
      }
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 6. NOTIFICATION BANNER DISMISS
  // [data-testid="notification-boundary-announcement-container"]
  // ─────────────────────────────────────────────────────────────
  (function () {
    const banner = document.querySelector('[data-testid="notification-boundary-announcement-container"]');
    if (!banner) return;
    // Find close/dismiss button or the CTA button
    const buttons = banner.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        banner.style.transition = 'opacity 0.3s, max-height 0.3s';
        banner.style.opacity = '0';
        banner.style.maxHeight = '0';
        banner.style.overflow = 'hidden';
        setTimeout(() => { banner.style.display = 'none'; }, 350);
      });
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 7. SEARCH INPUTS
  // input[name="search"] on transports, fleet, data-network,
  // vehicle-management, dashboards
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('input[name="search"], input[type="search"]').forEach(input => {
    let debounceTimer = null;
    input.style.cursor = 'text';
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        document.dispatchEvent(new CustomEvent('vis:search', {
          detail: { query: this.value, page: currentPage }
        }));
      }, 300);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        clearTimeout(debounceTimer);
        document.dispatchEvent(new CustomEvent('vis:search', {
          detail: { query: this.value, page: currentPage }
        }));
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 8. GENERIC BUTTONS — "Add" buttons, action buttons
  // Matches: Add notification rule, Add shared view, etc.
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('button').forEach(btn => {
    const text = btn.textContent.trim();
    // Make all buttons clickable
    btn.style.cursor = 'pointer';

    // "Add" buttons dispatch events
    if (/^add\b/i.test(text) || text.includes('+')) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const action = text.toLowerCase().replace(/\s+/g, '-');
        document.dispatchEvent(new CustomEvent('vis:action', {
          detail: { action, text, page: currentPage }
        }));
      });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 9. FLEET DIALOG (Allocate vehicle modal)
  // section[role="dialog"] on fleet.html
  // ─────────────────────────────────────────────────────────────
  (function () {
    const dialog = document.querySelector('section[role="dialog"]');
    if (!dialog) return;

    // Hide dialog by default (it's embedded in the frozen HTML)
    dialog.style.display = 'none';
    const backdrop = dialog.previousElementSibling;
    if (backdrop && backdrop.getAttribute('aria-hidden') === 'true') {
      backdrop.style.display = 'none';
    }

    // Find trigger button (Allocate)
    document.querySelectorAll('button').forEach(btn => {
      if (/allocate/i.test(btn.textContent)) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          dialog.style.display = '';
          if (backdrop) backdrop.style.display = '';
          document.dispatchEvent(new CustomEvent('vis:dialog', {
            detail: { action: 'open', dialog: 'allocate-vehicle' }
          }));
        });
      }
    });

    // Close buttons inside dialog
    dialog.querySelectorAll('button').forEach(btn => {
      const text = btn.textContent.trim().toLowerCase();
      if (text === 'cancel' || text === 'close' || text === '×' || text === '') {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          dialog.style.display = 'none';
          if (backdrop) backdrop.style.display = 'none';
          document.dispatchEvent(new CustomEvent('vis:dialog', {
            detail: { action: 'close', dialog: 'allocate-vehicle' }
          }));
        });
      }
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && dialog.style.display !== 'none') {
        dialog.style.display = 'none';
        if (backdrop) backdrop.style.display = 'none';
      }
    });
  })();

  // ─────────────────────────────────────────────────────────────
  // 10. TOOLTIPS — elements with title or data-tooltip
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('[title]').forEach(el => {
    el.style.cursor = el.style.cursor || 'default';
  });

  // ─────────────────────────────────────────────────────────────
  // 11. TABLE SORT HEADERS
  // Some tables have sortable column headers
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('th[role="columnheader"], th[aria-sort]').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', function () {
      const currentSort = this.getAttribute('aria-sort');
      // Reset siblings
      const row = this.closest('tr');
      if (row) row.querySelectorAll('th[aria-sort]').forEach(h => h.setAttribute('aria-sort', 'none'));
      // Toggle
      if (currentSort === 'ascending') {
        this.setAttribute('aria-sort', 'descending');
      } else {
        this.setAttribute('aria-sort', 'ascending');
      }
      document.dispatchEvent(new CustomEvent('vis:sort', {
        detail: { column: this.textContent.trim(), direction: this.getAttribute('aria-sort') }
      }));
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 12. EXTERNAL LINKS — open in new tab
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="https://"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  // ─────────────────────────────────────────────────────────────
  // 13. MAKE ALL INTERACTIVE ELEMENTS FEEL CLICKABLE
  // ─────────────────────────────────────────────────────────────
  const clickableSelectors = [
    'a[href]',
    'button',
    '[role="button"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[role="option"]',
    '[role="checkbox"]',
    '[role="radio"]',
  ];
  document.querySelectorAll(clickableSelectors.join(',')).forEach(el => {
    if (!el.style.cursor || el.style.cursor === 'auto') {
      el.style.cursor = 'pointer';
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 14. DATA-NETWORK TABS — fix absolute URLs
  // Tabs use paths like /companies/321090/data-network/...
  // Rewrite them to stay on data-network.html
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href*="/companies/"]').forEach(link => {
    const href = link.getAttribute('href');
    link.style.cursor = 'pointer';
    link.addEventListener('click', function (e) {
      e.preventDefault();
      // For tabs within the same page, just toggle active state
      const parent = this.closest('nav') || this.parentElement;
      if (parent) {
        parent.querySelectorAll('a').forEach(a => {
          a.setAttribute('aria-current', 'false');
          a.classList.remove('_7lkwi93');
        });
      }
      this.setAttribute('aria-current', 'true');
      this.classList.add('_7lkwi93');
      document.dispatchEvent(new CustomEvent('vis:tab', {
        detail: { href, text: this.textContent.trim() }
      }));
    });
  });

  console.log('[visibility-interactions] Initialized on', currentPage);
})();
