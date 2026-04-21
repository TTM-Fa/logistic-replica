/**
 * Transporeon Visibility — interactions.js
 * Handles all interactive elements for the frozen HTML replica of app.sixfold.com.
 */
(function () {
  'use strict';

  // ---- helpers ----
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // Popup helper — creates a dialog rendered in a portal div (like the original React app)
  function createPopup(id, htmlContent, triggerEl) {
    let popup = document.getElementById(id);
    if (popup) { popup.remove(); return null; } // toggle off

    popup = document.createElement('div');
    popup.id = id;
    popup.setAttribute('role', 'dialog');

    const inner = document.createElement('div');
    inner.innerHTML = htmlContent;
    popup.appendChild(inner);

    Object.assign(popup.style, {
      position: 'fixed', zIndex: '99999',
      background: 'var(--_7msrlr70, #fff)',
      border: '1px solid var(--_7msrlr7b, #e0e0e0)',
      borderRadius: '8px', padding: '8px 0',
      boxShadow: '0 4px 16px rgba(0,0,0,.15)',
      minWidth: '200px', fontSize: '14px',
      fontFamily: '"Open Sans", Inter, sans-serif',
      color: 'var(--_7msrlr5x, #1a1a1a)',
    });
    document.body.appendChild(popup);

    // Position next to trigger
    const r = triggerEl.getBoundingClientRect();
    const left = r.right + 8;
    const top = Math.min(r.top, window.innerHeight - popup.offsetHeight - 16);
    popup.style.left = left + 'px';
    popup.style.top = Math.max(8, top) + 'px';
    return popup;
  }

  function removePopup(id) {
    const p = document.getElementById(id);
    if (p) p.remove();
  }

  // Shared menu-item style
  const menuItemCSS = 'display:flex; align-items:center; gap:8px; padding:10px 16px; text-decoration:none; color:inherit; cursor:pointer; border:none; background:none; width:100%; font:inherit; text-align:left;';
  const menuItemHover = 'background-color:var(--_7msrlr65, #ffeab6);';

  // ========================================================================
  // 1. SIDEBAR NAVIGATION
  // ========================================================================
  function initSidebar() {
    const header = document.getElementById('_r_1_');
    const nav = $('nav[data-test-id="sideMenuNav"]');
    const collapseBtn = $('button[aria-controls="_r_1_"]');
    const main = $('main');
    if (!header || !nav) return;

    // Set active nav item
    const page = location.pathname.split('/').pop() || 'index.html';
    $$('a[data-test-id]', nav).forEach(a => {
      const href = a.getAttribute('href');
      const match = href === page || href === page.replace('.html', '');
      a.setAttribute('aria-current', match ? 'true' : 'false');
      if (match) a.classList.add('_1gaf6f3d');
    });

    // Find the logo area and inject "Transporeon Visibility" title if missing
    const logoWrapper = header.querySelector('.n19amu5');
    let titleDiv = logoWrapper?.nextElementSibling;
    if (logoWrapper && (!titleDiv || !titleDiv.textContent.includes('Transporeon'))) {
      titleDiv = document.createElement('div');
      titleDiv.textContent = 'Transporeon Visibility';
      titleDiv.className = 'tv-sidebar-title';
      titleDiv.style.cssText = 'font-weight:600; font-size:14px; line-height:1.3; display:none;';
      logoWrapper.parentElement.appendChild(titleDiv);
    }

    // Collapse/expand
    if (collapseBtn) {
      // Get the text span inside collapse button
      const btnTextSpan = collapseBtn.querySelector('.xhxs2b0') || collapseBtn.querySelector('span:last-child');

      collapseBtn.addEventListener('click', () => {
        const expanding = !header.classList.contains('n19amu0');
        header.classList.toggle('n19amu0', expanding);
        collapseBtn.setAttribute('aria-expanded', String(expanding));

        // Adjust main content offset
        if (main) {
          main.style.marginInlineStart = expanding ? '256px' : '65px';
        }

        // Show/hide "Transporeon Visibility" title
        const title = header.querySelector('.tv-sidebar-title');
        if (title) title.style.display = expanding ? 'block' : 'none';

        // Update button text
        if (btnTextSpan) btnTextSpan.textContent = expanding ? 'Collapse navigation' : 'Expand navigation';

        // Show/hide ALL nav text labels (they use xhxs2b0 = visually-hidden)
        $$('.xhxs2b0', header).forEach(span => {
          if (span === btnTextSpan) return; // skip button's own span
          span.style.cssText = expanding
            ? 'clip:auto; clip-path:none; height:auto; width:auto; position:static; overflow:visible; white-space:nowrap;'
            : '';
        });
      });
    }
  }

  // ========================================================================
  // 2. HEADER BUTTONS (Help, Company Switcher)
  // ========================================================================
  function initHeaderButtons() {
    const helpBtn = $('[data-test-id="helpCenter"]');
    const companyBtn = $('[data-test-id="companySwitcher"]');

    // SVG sprite path
    const sprite = '/js/sprite.c65451261fa5bb76c97c.svg';
    const icon = (name) => `<svg width="16" height="16" focusable="false" style="flex-shrink:0;"><use href="${sprite}#${name}"></use></svg>`;

    // Match the original: Get Started, Help Center, Contact Support, Send feedback
    const helpHTML = `<ul style="list-style:none; margin:0; padding:0;">
      <li><a href="index.html" style="${menuItemCSS}">${icon('small-rocket')}Get Started</a></li>
      <li><a href="https://intercom.help/sixfold/en/" target="_blank" rel="noopener noreferrer" style="${menuItemCSS}">${icon('small-book')}Help Center</a></li>
      <li><button style="${menuItemCSS}">${icon('small-pencil')}Contact Support</button></li>
      <li><button style="${menuItemCSS}">${icon('small-heart')}Send feedback</button></li>
    </ul>`;

    // Match the original: user info + Settings + Log out
    const companyHTML = `<div style="padding:12px 16px;">
      <div style="font-weight:600;">Abdulaziz Aladba</div>
      <div style="font-size:12px; color:var(--_7msrlr6d, #6e6e73);">logistics@syndicategroup.com.qa</div>
      <div style="font-size:12px; color:var(--_7msrlr6d, #6e6e73); margin-top:2px;">Syndicate Market · Carrier</div>
    </div>
    <div style="border-top:1px solid var(--_7msrlr7b, #e0e0e0);"></div>
    <div style="padding:4px 0;">
      <div style="padding:6px 16px; font-size:12px; color:var(--_7msrlr6d, #6e6e73);">Language: English</div>
      <a href="#" style="${menuItemCSS}">Settings</a>
      <a href="#" style="${menuItemCSS}">Log out</a>
    </div>`;

    // Add hover effects to menu items
    function addHoverEffects(popup) {
      if (!popup) return;
      popup.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => { el.style.backgroundColor = 'var(--_7msrlr65, #ffeab6)'; });
        el.addEventListener('mouseleave', () => { el.style.backgroundColor = ''; });
      });
    }

    helpBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      removePopup('popup-company');
      companyBtn?.setAttribute('aria-expanded', 'false');
      const p = createPopup('popup-help', helpHTML, helpBtn);
      helpBtn.setAttribute('aria-expanded', p ? 'true' : 'false');
      addHoverEffects(p);
    });

    companyBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      removePopup('popup-help');
      helpBtn?.setAttribute('aria-expanded', 'false');
      const p = createPopup('popup-company', companyHTML, companyBtn);
      companyBtn.setAttribute('aria-expanded', p ? 'true' : 'false');
      addHoverEffects(p);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#popup-help') && !e.target.closest('[data-test-id="helpCenter"]')) {
        removePopup('popup-help');
        helpBtn?.setAttribute('aria-expanded', 'false');
      }
      if (!e.target.closest('#popup-company') && !e.target.closest('[data-test-id="companySwitcher"]')) {
        removePopup('popup-company');
        companyBtn?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ========================================================================
  // 3. TABS (transports, data-network, vehicle-management, analytics)
  // ========================================================================
  function initTabs() {
    const allTabs = $$('a._7lkwi95, a._7lkwi93');
    if (!allTabs.length) return;

    allTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        // Find sibling tabs (same parent UL)
        const ul = tab.closest('ul') || tab.parentElement?.parentElement;
        const siblings = ul ? $$('a._7lkwi95, a._7lkwi93', ul) : allTabs;

        siblings.forEach(t => {
          if (t === tab) {
            t.classList.add('_7lkwi93');
            t.setAttribute('aria-current', 'true');
          } else {
            t.classList.remove('_7lkwi93');
            t.setAttribute('aria-current', 'false');
          }
        });
      });
    });
  }

  // ========================================================================
  // 4. DROPDOWN BUTTONS (aria-haspopup)
  // ========================================================================
  function initDropdowns() {
    const triggers = $$('[aria-haspopup]').filter(el =>
      !el.matches('[data-test-id="helpCenter"]') &&
      !el.matches('[data-test-id="companySwitcher"]')
    );

    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasExpanded = btn.getAttribute('aria-expanded') === 'true';
        // Close all other dropdowns
        triggers.forEach(b => b.setAttribute('aria-expanded', 'false'));
        btn.setAttribute('aria-expanded', String(!wasExpanded));
      });
    });

    document.addEventListener('click', () => {
      triggers.forEach(b => b.setAttribute('aria-expanded', 'false'));
    });
  }

  // ========================================================================
  // 5. SEARCH INPUTS
  // ========================================================================
  function initSearch() {
    $$('input[name="search"]').forEach(input => {
      let timer;
      const dispatch = () => {
        document.dispatchEvent(new CustomEvent('search', {
          detail: { query: input.value.trim(), context: input.getAttribute('placeholder') || '' }
        }));
      };
      input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(dispatch, 300); });
      input.addEventListener('keypress', (e) => { if (e.key === 'Enter') dispatch(); });
    });
  }

  // ========================================================================
  // 6. BANNER DISMISS
  // ========================================================================
  function initBanner() {
    const container = $('[data-testid="notification-boundary-announcement-container"]');
    const btn = container?.querySelector('button');
    btn?.addEventListener('click', () => {
      const banner = container.querySelector('.glb6s86') || container.firstElementChild;
      if (banner) {
        banner.style.transition = 'all 0.3s ease-out';
        banner.style.opacity = '0';
        banner.style.height = '0';
        banner.style.overflow = 'hidden';
        setTimeout(() => { container.innerHTML = ''; }, 300);
      }
    });
  }

  // ========================================================================
  // 7. DIALOGS
  // ========================================================================
  function initDialogs() {
    $$('section[role="dialog"]').forEach(dialog => {
      const close = () => {
        dialog.style.transition = 'opacity 0.2s';
        dialog.style.opacity = '0';
        setTimeout(() => { dialog.style.display = 'none'; }, 200);
      };
      const closeBtn = dialog.querySelector('button[class*="y082k13"]');
      closeBtn?.addEventListener('click', close);
      dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    });
  }

  // ========================================================================
  // 8. BUTTON FEEDBACK & CURSOR
  // ========================================================================
  function initButtons() {
    $$('button, a[href], [role="button"]').forEach(el => {
      el.style.cursor = 'pointer';
    });

    // Hover ripple on action buttons
    $$('button.y082k11').forEach(btn => {
      btn.addEventListener('mouseenter', () => { btn.style.filter = 'brightness(0.95)'; });
      btn.addEventListener('mouseleave', () => { btn.style.filter = ''; });
      btn.addEventListener('mousedown', () => { btn.style.transform = 'scale(0.98)'; });
      btn.addEventListener('mouseup', () => { btn.style.transform = ''; });
    });
  }

  // ========================================================================
  // 9. TABLE SORT HEADERS
  // ========================================================================
  function initTableSort() {
    $$('th[aria-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const current = th.getAttribute('aria-sort');
        // Reset siblings
        th.closest('tr')?.querySelectorAll('th[aria-sort]').forEach(s => s.setAttribute('aria-sort', 'none'));
        th.setAttribute('aria-sort', current === 'ascending' ? 'descending' : 'ascending');
      });
    });
  }

  // ========================================================================
  // INIT
  // ========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initHeaderButtons();
    initTabs();
    initDropdowns();
    initSearch();
    initBanner();
    initDialogs();
    initButtons();
    initTableSort();
    console.log('[visibility-interactions] Initialized on', location.pathname.split('/').pop());
  });
})();
