/**
 * interactions.js — Marketplace UI interactions for offline replica
 *
 * Handles: sidebar, tabs, dropdowns, MUI dialogs, filter chips,
 * header popovers, tooltips, dead-link prevention.
 * No real API calls — purely cosmetic for demo purposes.
 */
(function () {
  'use strict';

  // ── MUI Dialog / Modal ───────────────────────────────────────────────

  function dismissDialog(dialogRoot) {
    if (!dialogRoot) return;
    dialogRoot.style.display = 'none';
    // Also hide the MUI backdrop that may be a sibling or ancestor
    const backdrop = dialogRoot.querySelector('.MuiBackdrop-root');
    if (backdrop) backdrop.style.display = 'none';
    // If the dialog container is a presentation wrapper, hide it too
    const container = dialogRoot.closest('.MuiModal-root');
    if (container) container.style.display = 'none';
    // Remove body scroll lock
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    // Re-enable the root content
    const root = document.getElementById('root');
    if (root) root.removeAttribute('aria-hidden');
  }

  function initDialogs() {
    // "Remind Me Later" and close/cancel buttons inside dialogs
    document.querySelectorAll('[role="dialog"]').forEach(dialog => {
      dialog.querySelectorAll('button').forEach(btn => {
        const text = (btn.textContent || '').trim().toLowerCase();
        if (text === 'remind me later' || text === 'cancel' || text === 'close' ||
            btn.getAttribute('aria-label') === 'close' || btn.getAttribute('aria-label') === 'Close') {
          btn.addEventListener('click', () => dismissDialog(dialog.closest('.MuiDialog-root, .MuiModal-root') || dialog));
        }
      });
    });

    // Click on MUI backdrop to dismiss
    document.querySelectorAll('.MuiBackdrop-root').forEach(backdrop => {
      backdrop.addEventListener('click', () => {
        const modal = backdrop.closest('.MuiModal-root, .MuiDialog-root');
        if (modal) dismissDialog(modal);
      });
    });
  }

  // ── Tab Navigation (MUI & generic) ───────────────────────────────────

  function initTabs() {
    document.querySelectorAll('[role="tablist"]').forEach(tablist => {
      const tabs = tablist.querySelectorAll('[role="tab"]');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => {
            t.setAttribute('aria-selected', 'false');
            t.classList.remove('Mui-selected');
            t.tabIndex = -1;
          });
          tab.setAttribute('aria-selected', 'true');
          tab.classList.add('Mui-selected');
          tab.tabIndex = 0;

          // Toggle related tabpanels
          const panelId = tab.getAttribute('aria-controls');
          if (panelId) {
            tablist.closest('[role="tabpanel"]')?.parentElement
              ?.querySelectorAll('[role="tabpanel"]')
              ?.forEach(p => p.hidden = true);
            const panel = document.getElementById(panelId);
            if (panel) panel.hidden = false;
          }

          // Move the MUI tab indicator bar
          const indicator = tablist.querySelector('.MuiTabs-indicator');
          if (indicator) {
            indicator.style.left = tab.offsetLeft + 'px';
            indicator.style.width = tab.offsetWidth + 'px';
          }
        });
      });
    });
  }

  // ── Filter Chips (Spot / Lane Request pages) ─────────────────────────

  function initFilterChips() {
    // Skip chips handled by page-specific handlers
    const managedChipIds = new Set([
      'all_Filters_chip', 'buyer_filter_chip', 'location_filter_chip', 'timeline_filter_chip', 'equipmentType_filter_chip',
      'transportMode_filter_chip', 'myFavorites_filter_chip'
    ]);
    document.querySelectorAll('.MuiChip-root, button[class*="MuiChip"]').forEach(chip => {
      if (managedChipIds.has(chip.id)) return;
      chip.addEventListener('click', () => {
        chip.classList.toggle('MuiChip-colorPrimary');
        chip.classList.toggle('MuiChip-filled');
      });
    });
  }

  // ── Dropdown / Select menus ──────────────────────────────────────────

  let activePopup = null;

  function closePopup() {
    if (activePopup) {
      activePopup.cleanup();
      activePopup = null;
    }
  }

  function initDropdowns() {
    document.querySelectorAll('[role="combobox"], [aria-haspopup="listbox"]').forEach(el => {
      el.addEventListener('click', () => {
        const isOpen = el.getAttribute('aria-expanded') === 'true';
        closePopup();
        if (!isOpen) {
          el.setAttribute('aria-expanded', 'true');
          const popupId = el.getAttribute('aria-controls') || el.getAttribute('aria-owns');
          const popup = popupId && document.getElementById(popupId);
          if (popup) {
            popup.style.display = '';
            popup.hidden = false;
            activePopup = { cleanup: () => { popup.style.display = 'none'; el.setAttribute('aria-expanded', 'false'); } };
          }
        } else {
          el.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ── Header Buttons (Notifications, Chat, Help, User) ────────────────

  function initHeaderButtons() {
    const headerBtns = document.querySelectorAll(
      '#notificationBtn, button[aria-label="Notifications"], ' +
      'button[aria-label="Chat Inbox"], ' +
      'button[aria-label="Help"]'
    );
    headerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // For static demo: just show a brief "no new items" toast
        showToast(btn.getAttribute('aria-label') || 'Info');
      });
    });

    // User menu button
    const userBtn = document.querySelector('[data-testid="desktopUserInfo"] button[class*="MuiIconButton"]');
    if (userBtn) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('User menu');
      });
    }
  }

  function showToast(label) {
    const existing = document.getElementById('mp-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'mp-toast';
    toast.textContent = label + ' — offline demo';
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: #333; color: #fff; padding: 10px 24px; border-radius: 6px;
      font-size: 14px; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,.25);
      transition: opacity .3s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; }, 2000);
    setTimeout(() => toast.remove(), 2400);
  }

  // ── "Go To" Action Buttons (Home page) ───────────────────────────────

  function initGoToButtons() {
    const goToMap = {
      'Go To Spot': 'spot-spotShipment.html',
      'Go To RFQ': 'rfq.html',
      'Go To Lane Requests': 'laneRequest.html',
      'Go To Profile': 'profile-tpa-company-649040.html',
      'Complete Verification': 'profile-tpa-company-649040.html',
      'Complete Profile': 'profile-tpa-company-649040.html',
      'Get Started': 'profile-tpa-company-649040.html',
    };

    document.querySelectorAll('button').forEach(btn => {
      const text = (btn.textContent || '').trim().replace(/\s+/g, ' ');
      for (const [label, target] of Object.entries(goToMap)) {
        if (text.startsWith(label)) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = target;
          });
          break;
        }
      }
    });
  }

  // ── MUI Drawer (Help drawer) ─────────────────────────────────────────

  function initDrawers() {
    document.querySelectorAll('[data-testid="helpDrawer"]').forEach(drawer => {
      const paper = drawer.querySelector('.MuiDrawer-paper');
      if (paper) paper.style.visibility = 'hidden';
    });
  }

  // ── Tooltips ─────────────────────────────────────────────────────────

  function initTooltips() {
    document.querySelectorAll('[title]').forEach(el => {
      if (el.dataset._ttBound) return;
      el.dataset._ttBound = '1';

      let tip = null;
      el.addEventListener('mouseenter', () => {
        const text = el.getAttribute('title');
        if (!text) return;
        el.dataset._origTitle = text;
        el.removeAttribute('title');

        tip = document.createElement('div');
        tip.textContent = text;
        tip.style.cssText =
          'position:fixed;z-index:99999;pointer-events:none;' +
          'background:#333;color:#fff;padding:6px 10px;border-radius:4px;' +
          'font-size:12px;max-width:250px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.2)';
        document.body.appendChild(tip);

        const r = el.getBoundingClientRect();
        tip.style.top = (r.bottom + 6) + 'px';
        tip.style.left = (r.left + r.width / 2 - tip.offsetWidth / 2) + 'px';
      });
      el.addEventListener('mouseleave', () => {
        if (tip) { tip.remove(); tip = null; }
        if (el.dataset._origTitle) {
          el.setAttribute('title', el.dataset._origTitle);
          delete el.dataset._origTitle;
        }
      });
    });
  }

  // ── Global: close popups on outside click ────────────────────────────

  document.addEventListener('click', (e) => {
    if (activePopup && !e.target.closest('[role="combobox"], [aria-haspopup], [role="listbox"]')) {
      closePopup();
    }
  });

  // ── Prevent default navigation for dead links ────────────────────────

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Allow local .html navigation
    if (href && href.endsWith('.html')) return;
    // Block external, hash, and javascript: links
    if (href === '#' || href === 'javascript:void(0)' || (href && href.startsWith('http'))) {
      e.preventDefault();
    }
  });

  // ── Spot Page: Row Click → Detail Drawer ──────────────────────────────

  function parseRowData(card) {
    const stacks = card.querySelectorAll(':scope > .MuiStack-root > .MuiStack-root');
    const texts = [];
    stacks.forEach(s => {
      s.querySelectorAll('p, div.MuiBox-root').forEach(el => {
        const t = (el.textContent || '').trim();
        if (t && t !== 'time_slot_not_reserved') texts.push(t);
      });
    });

    // Parse structured data from the card's child stacks
    const allP = card.querySelectorAll('p');
    const pTexts = Array.from(allP).map(p => (p.textContent || '').trim()).filter(Boolean);

    // Get structured sections
    const mainStack = card.querySelector('.MuiStack-root');
    const sections = mainStack ? mainStack.children : [];
    const data = { loading: {}, unloading: {}, distance: '', equipment: '', specs: '', shipper: '', deadline: '' };

    if (sections.length >= 6) {
      // Loading (index 0)
      const loadLoc = sections[0].querySelector('p');
      const loadTime = sections[0].querySelector('.MuiBox-root.css-0');
      data.loading.location = loadLoc ? loadLoc.textContent.trim() : '';
      data.loading.time = loadTime ? loadTime.textContent.trim() : '';

      // Unloading (index 1)
      const unloadLoc = sections[1].querySelector('p');
      const unloadTime = sections[1].querySelector('.MuiBox-root.css-0');
      data.unloading.location = unloadLoc ? unloadLoc.textContent.trim() : '';
      data.unloading.time = unloadTime ? unloadTime.textContent.trim() : '';

      // Distance (index 2)
      const distP = sections[2].querySelector('p');
      data.distance = distP ? distP.textContent.trim() : '';

      // Equipment (index 3)
      const eqPs = sections[3].querySelectorAll('p');
      data.equipment = eqPs[0] ? eqPs[0].textContent.trim() : '';
      data.specs = eqPs[1] ? eqPs[1].textContent.trim() : '';

      // Shipper (index 4)
      const shipP = sections[4].querySelector('p');
      data.shipper = shipP ? shipP.textContent.trim() : '';

      // Deadline (index 5)
      const deadP = sections[5].querySelector('p');
      data.deadline = deadP ? deadP.textContent.trim() : '';
    }

    return data;
  }

  function createDetailDrawer() {
    const drawer = document.createElement('div');
    drawer.id = 'spot-detail-drawer';
    drawer.style.cssText = `
      position: fixed; top: 0; right: -600px; width: 600px; height: 100%;
      background: #fff; box-shadow: -4px 0 24px rgba(0,0,0,.15);
      z-index: 99998; transition: right .3s cubic-bezier(.4,0,.2,1);
      overflow-y: auto; font-family: "Open Sans", Roboto, sans-serif;
    `;

    document.body.appendChild(drawer);
    return drawer;
  }

  function generateUUID() {
    return 'spot_' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getCompanyInitials(name) {
    if (!name) return '??';
    const words = name.split(/[\s.]+/).filter(w => w.length > 1 && w !== 'z' && w !== 'o');
    return (words[0] || '?')[0].toUpperCase() + (words[1] || '?')[0].toUpperCase();
  }

  function openDetailDrawer(data, rowIndex) {
    let drawer = document.getElementById('spot-detail-drawer');
    if (!drawer) {
      drawer = createDetailDrawer();
    }

    const uuid = generateUUID();
    const routeTitle = (data.loading.location || '—') + ' - ' + (data.unloading.location || '—');
    const initials = getCompanyInitials(data.shipper);
    const companyName = data.shipper ? data.shipper.replace(/\s*\(\d+\)/, '') : '—';
    const companyId = data.shipper ? (data.shipper.match(/\((\d+)\)/) || [])[1] || '' : '';
    const fakeEmail = companyName.toLowerCase().replace(/[^a-z]/g, '').substring(0, 8) + '@logistics.com';

    // Parse specs for details table
    const specParts = (data.specs || '').split(',').map(s => s.trim()).filter(Boolean);
    const palletInfo = specParts.find(s => s.includes('pallet')) || '';
    const tonInfo = specParts.find(s => s.includes('Tonnes')) || '';
    const meterInfo = specParts.find(s => s.includes('meter')) || '';

    drawer.innerHTML = `
      <div style="display:flex;flex-direction:column;height:100%;">
        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #e0e0e0;flex-shrink:0;">
          <h2 style="margin:0;font-size:20px;font-weight:600;color:#252a2e;">Offer details</h2>
          <button id="spot-drawer-close" style="background:none;border:none;cursor:pointer;padding:6px;font-size:22px;color:#6a6e73;line-height:1;" title="Close">✕</button>
        </div>

        <div style="overflow-y:auto;flex:1;padding:0;">
          <!-- ID + Route Title -->
          <div style="padding:16px 24px;border-bottom:1px solid #e8e8e8;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span style="color:#6a6e73;font-size:12px;">▲</span>
              <span style="font-size:12px;color:#6a6e73;">ID: ${uuid}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="color:#0063a3;font-size:12px;">◆</span>
              <h3 style="margin:0;font-size:18px;font-weight:600;color:#252a2e;">${routeTitle}</h3>
            </div>
          </div>

          <!-- Verification Warning -->
          <div style="margin:16px 24px;padding:12px 16px;background:#fef3f0;border:1px solid #f5c6cb;border-radius:6px;display:flex;align-items:center;gap:12px;">
            <span style="color:#c62828;font-size:18px;">⊘</span>
            <span style="font-size:13px;color:#252a2e;flex:1;">Verification Incomplete – some documents are still missing</span>
            <a href="#" style="font-size:13px;color:#0063a3;font-weight:600;text-decoration:none;white-space:nowrap;" onclick="event.preventDefault()">Complete Verification</a>
          </div>

          <!-- Company Info + Offer Section -->
          <div style="display:flex;gap:0;margin:0 24px 16px;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
            <!-- Company Info (left) -->
            <div style="flex:1;padding:20px;border-right:1px solid #e0e0e0;">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                <div style="width:44px;height:44px;border-radius:50%;background:#5c8a8a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:16px;flex-shrink:0;">${initials}</div>
                <div style="font-size:14px;font-weight:600;color:#252a2e;">${companyName}</div>
              </div>
              <div style="font-size:13px;color:#0063a3;margin-bottom:16px;">${fakeEmail}</div>
              <button style="width:100%;padding:10px 16px;background:#fff;border:1px solid #c1c7cd;border-radius:6px;font-size:13px;font-weight:500;color:#252a2e;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;" onclick="this.closest('#spot-detail-drawer').querySelector('#spot-drawer-close').click();">
                <span style="font-size:14px;">🔒</span> Message Us
              </button>
            </div>
            <!-- Your Offer (right) -->
            <div style="width:220px;padding:20px;background:#fafafa;">
              <div style="font-size:14px;font-weight:600;color:#252a2e;margin-bottom:12px;">Your offer</div>
              <div style="position:relative;margin-bottom:12px;">
                <input id="spot-offer-input" type="text" placeholder="Your offer (all in) *" style="width:100%;padding:10px 50px 10px 12px;border:1px solid #c1c7cd;border-radius:6px;font-size:13px;box-sizing:border-box;outline:none;" onfocus="this.style.borderColor='#0063a3'" onblur="this.style.borderColor='#c1c7cd'">
                <span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:13px;color:#6a6e73;">EUR</span>
              </div>
              <button id="spot-submit-offer-btn" style="width:100%;padding:10px 16px;background:#0063a3;color:#fff;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                <span style="font-size:14px;">🔒</span> Submit Your Offer
              </button>
            </div>
          </div>

          <!-- Route Visualization -->
          <div style="padding:0 24px 16px;">
            <div style="display:flex;gap:16px;">
              <!-- Distance column -->
              <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:60px;">
                <span style="font-size:14px;font-weight:600;color:#252a2e;">${data.distance || '—'}</span>
              </div>
              <!-- Route stops -->
              <div style="flex:1;position:relative;">
                <!-- Loading stop -->
                <div style="display:flex;align-items:flex-start;gap:12px;padding-bottom:24px;position:relative;">
                  <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
                    <div style="width:28px;height:28px;border-radius:50%;background:#c62828;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;">📦</div>
                    <div style="width:2px;height:32px;background:#c1c7cd;"></div>
                  </div>
                  <div>
                    <div style="font-size:14px;font-weight:600;color:#252a2e;">${data.loading.location || '—'}</div>
                    <div style="font-size:13px;color:#6a6e73;margin-top:2px;">${data.loading.time || '—'}${data.loading.time ? '&nbsp;&nbsp;<span style="display:inline-block;padding:2px 8px;background:#e8f5e9;color:#2e7d32;border-radius:4px;font-size:11px;font-weight:600;">Fixed</span>' : ''}</div>
                  </div>
                </div>
                <!-- Unloading stop -->
                <div style="display:flex;align-items:flex-start;gap:12px;">
                  <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
                    <div style="width:28px;height:28px;border-radius:50%;background:#0063a3;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;">📍</div>
                  </div>
                  <div>
                    <div style="font-size:14px;font-weight:600;color:#252a2e;">${data.unloading.location || '—'}</div>
                    <div style="font-size:13px;color:#6a6e73;margin-top:2px;">${data.unloading.time || '—'}${data.unloading.time ? '&nbsp;&nbsp;<span style="display:inline-block;padding:2px 8px;background:#e8f5e9;color:#2e7d32;border-radius:4px;font-size:11px;font-weight:600;">Fixed</span>' : ''}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Details Table -->
          <div style="padding:0 24px 24px;">
            <h4 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#252a2e;">Details</h4>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;width:45%;">Equipment type</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${data.equipment || '—'}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;">Offer submission deadline</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${data.deadline || '—'}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;">Shipment details</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${data.specs || '—'}</td>
              </tr>
              ${tonInfo ? `<tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;">Weight</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${tonInfo}</td>
              </tr>` : ''}
              ${palletInfo ? `<tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;">Pallet spaces</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${palletInfo}</td>
              </tr>` : ''}
              ${meterInfo ? `<tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;">Loading meters</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${meterInfo}</td>
              </tr>` : ''}
              <tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;">Commodity</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">General Cargo</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `;

    // Open animation
    requestAnimationFrame(() => {
      drawer.style.right = '0';
    });

    // Close button
    drawer.querySelector('#spot-drawer-close').addEventListener('click', closeDetailDrawer);

    // Submit offer
    drawer.querySelector('#spot-submit-offer-btn').addEventListener('click', () => {
      const val = drawer.querySelector('#spot-offer-input').value;
      if (val) {
        showToast('Offer of ' + val + ' EUR submitted');
      } else {
        showToast('Please enter an offer amount');
      }
    });
  }

  function closeDetailDrawer() {
    const drawer = document.getElementById('spot-detail-drawer');
    if (drawer) drawer.style.right = '-600px';
    // Remove selected state from rows
    document.querySelectorAll('.spotFinderListItemCard.spot-row-selected').forEach(r => {
      r.classList.remove('spot-row-selected');
      r.style.borderColor = '';
      r.style.boxShadow = '';
    });
  }

  function initSpotRowClicks() {
    const rows = document.querySelectorAll('.spotfinderListItem');
    if (!rows.length) return;

    // Inject hover/selection styles
    const style = document.createElement('style');
    style.textContent = `
      .spotFinderListItemCard { cursor: pointer; transition: border-color .15s, box-shadow .15s, background .15s; }
      .spotFinderListItemCard:hover { background: #f5f8fa !important; }
      .spotFinderListItemCard.spot-row-selected { border-left: 3px solid #0063a3 !important; background: #f0f4f8 !important; }
      @keyframes spot-refresh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    rows.forEach((row, idx) => {
      const card = row.querySelector('.spotFinderListItemCard');
      if (!card) return;

      card.addEventListener('click', () => {
        // Deselect previous
        document.querySelectorAll('.spotFinderListItemCard.spot-row-selected').forEach(r => {
          r.classList.remove('spot-row-selected');
          r.style.borderColor = '';
          r.style.boxShadow = '';
        });
        // Select this
        card.classList.add('spot-row-selected');
        const data = parseRowData(card);
        openDetailDrawer(data, idx + 1);
      });
    });
  }

  // ── Spot Page: Filter Chip Interactions ──────────────────────────────

  function initSpotFilterChips() {
    const chipIds = ['buyer_filter_chip', 'location_filter_chip', 'timeline_filter_chip', 'equipmentType_filter_chip'];
    const allChip = document.getElementById('all_Filters_chip');
    if (!allChip) return; // Not on Spot page

    // All Filters chip → show toast (would open full filter panel)
    allChip.addEventListener('click', () => {
      showToast('Filters panel');
    });

    // Individual filter chips → toggle "active" look + show dropdown
    chipIds.forEach(id => {
      const chip = document.getElementById(id);
      if (!chip) return;

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = chip.classList.contains('MuiChip-colorPrimary');

        // Close any existing filter dropdown
        const existing = document.getElementById('spot-filter-dropdown');
        if (existing) existing.remove();

        if (isActive) {
          // Deactivate
          chip.classList.remove('MuiChip-colorPrimary', 'MuiChip-clickableColorPrimary', 'MuiChip-filledPrimary');
          chip.classList.add('MuiChip-colorDefault', 'MuiChip-clickableColorDefault', 'MuiChip-filledDefault');
          chip.className = chip.className.replace(/css-\w+/g, '').trim();
          chip.classList.add('css-14lv3qg');
          // Toggle caret
          const caret = chip.querySelector('i[data-testid="icon"]:last-of-type');
          if (caret && caret.textContent.trim() === 'caret_up_bold') caret.textContent = 'caret_down_bold';
        } else {
          // Activate
          chip.classList.remove('MuiChip-colorDefault', 'MuiChip-clickableColorDefault', 'MuiChip-filledDefault');
          chip.classList.add('MuiChip-colorPrimary', 'MuiChip-clickableColorPrimary', 'MuiChip-filledPrimary');
          chip.className = chip.className.replace(/css-\w+/g, '').trim();
          chip.classList.add('css-1cr9x2p');
          // Toggle caret
          const caret = chip.querySelector('i[data-testid="icon"]:last-of-type');
          if (caret && caret.textContent.trim() === 'caret_down_bold') caret.textContent = 'caret_up_bold';

          // Show dropdown
          showFilterDropdown(chip, id);
        }
      });
    });
  }

  function showFilterDropdown(chip, chipId) {
    const existing = document.getElementById('spot-filter-dropdown');
    if (existing) existing.remove();

    const labels = {
      buyer_filter_chip: { title: 'Shipper', items: ['Linktis Sp. z o.o.', 'Express Heroes UAB', 'No Limit Sp. z o.o.', 'IGNA SP.Z O.O. SP.K.'] },
      location_filter_chip: { title: 'Location', items: ['Spain (ES)', 'Germany (DE)', 'France (FR)', 'Italy (IT)', 'Poland (PL)', 'Belgium (BE)', 'Austria (AT)', 'Romania (RO)'] },
      timeline_filter_chip: { title: 'Timeline', items: ['Today', 'Tomorrow', 'This week', 'Next week', 'Custom range'] },
      equipmentType_filter_chip: { title: 'Equipment Type', items: ['Single Temp Fridge Trailer', '13.6 Curtain Trailer', '13.6 Box Trailer', 'Mega Trailer'] },
    };

    const cfg = labels[chipId] || { title: 'Filter', items: [] };
    const rect = chip.getBoundingClientRect();

    const dropdown = document.createElement('div');
    dropdown.id = 'spot-filter-dropdown';
    dropdown.style.cssText = `
      position: fixed; top: ${rect.bottom + 6}px; left: ${rect.left}px;
      min-width: 220px; max-width: 300px; background: #fff;
      border: 1px solid #e0e0e0; border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,.12); z-index: 99999;
      font-family: "Open Sans", Roboto, sans-serif; overflow: hidden;
    `;

    dropdown.innerHTML = `
      <div style="padding:12px 16px;border-bottom:1px solid #e8e8e8;font-size:13px;font-weight:600;color:#252a2e;">${cfg.title}</div>
      <div style="padding:8px 0;max-height:240px;overflow-y:auto;">
        ${cfg.items.map((item, i) => `
          <label style="display:flex;align-items:center;gap:10px;padding:8px 16px;cursor:pointer;font-size:13px;color:#252a2e;transition:background .1s;"
                 onmouseenter="this.style.background='#f0f3f5'" onmouseleave="this.style.background=''">
            <input type="checkbox" ${i === 0 ? 'checked' : ''} style="accent-color:#0063a3;width:16px;height:16px;">
            <span>${item}</span>
          </label>
        `).join('')}
      </div>
      <div style="padding:10px 16px;border-top:1px solid #e8e8e8;display:flex;gap:8px;justify-content:flex-end;">
        <button class="spot-filter-clear" style="padding:6px 12px;background:none;border:1px solid #c1c7cd;border-radius:4px;font-size:12px;cursor:pointer;color:#252a2e;">Clear</button>
        <button class="spot-filter-apply" style="padding:6px 12px;background:#0063a3;border:none;border-radius:4px;font-size:12px;cursor:pointer;color:#fff;font-weight:600;">Apply</button>
      </div>
    `;

    document.body.appendChild(dropdown);

    // Clear button
    dropdown.querySelector('.spot-filter-clear').addEventListener('click', () => {
      dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    });

    // Apply button
    dropdown.querySelector('.spot-filter-apply').addEventListener('click', () => {
      const checked = dropdown.querySelectorAll('input[type="checkbox"]:checked');
      if (checked.length > 0) {
        showToast(cfg.title + ': ' + checked.length + ' selected');
      }
      dropdown.remove();
    });

    // Close on outside click
    setTimeout(() => {
      const handler = (e) => {
        if (!dropdown.contains(e.target) && !chip.contains(e.target)) {
          dropdown.remove();
          // Deactivate chip
          chip.classList.remove('MuiChip-colorPrimary', 'MuiChip-clickableColorPrimary', 'MuiChip-filledPrimary');
          chip.classList.add('MuiChip-colorDefault', 'MuiChip-clickableColorDefault', 'MuiChip-filledDefault');
          const caret = chip.querySelector('i[data-testid="icon"]:last-of-type');
          if (caret && caret.textContent.trim() === 'caret_up_bold') caret.textContent = 'caret_down_bold';
          document.removeEventListener('click', handler);
        }
      };
      document.addEventListener('click', handler);
    }, 10);
  }

  // ── Spot Page: Sort Column Headers ───────────────────────────────────

  function initSpotSortHeaders() {
    // Find column headers that have sort icons (Distance, Offer deadline)
    document.querySelectorAll('h4.MuiTypography-h4').forEach(header => {
      const text = (header.textContent || '').trim();
      if (text !== 'Distance' && text !== 'Offer deadline in') return;

      const parent = header.closest('.MuiStack-root');
      if (!parent) return;
      const icon = parent.querySelector('i[data-testid="icon"]');
      if (!icon) return;

      parent.style.cursor = 'pointer';
      parent.style.userSelect = 'none';

      parent.addEventListener('click', () => {
        const current = icon.textContent.trim();
        if (current === 'sort_down') {
          icon.textContent = 'sort_up';
          icon.style.color = '#0063a3';
          showToast(text + ': sorted ascending');
        } else {
          icon.textContent = 'sort_down';
          icon.style.color = 'gray';
          showToast(text + ': sorted descending');
        }
      });
    });
  }

  // ── Spot Page: Refresh Button ────────────────────────────────────────

  function initSpotRefresh() {
    const btn = document.getElementById('spotShipmentFinderRefreshBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.style.animation = 'spot-refresh-spin .8s ease';
        icon.addEventListener('animationend', () => { icon.style.animation = ''; }, { once: true });
      }
      showToast('Refreshed');
    });
  }

  // ── Spot Page: Recent Searches Button ────────────────────────────────

  function initSpotRecentSearches() {
    const btn = document.getElementById('filterRecentSearchesPopoverHandleBtn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const existing = document.getElementById('spot-recent-dropdown');
      if (existing) { existing.remove(); return; }

      const rect = btn.getBoundingClientRect();
      const dropdown = document.createElement('div');
      dropdown.id = 'spot-recent-dropdown';
      dropdown.style.cssText = `
        position: fixed; top: ${rect.bottom + 6}px; left: ${rect.left}px;
        min-width: 280px; background: #fff; border: 1px solid #e0e0e0;
        border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.12);
        z-index: 99999; font-family: "Open Sans", Roboto, sans-serif; overflow: hidden;
      `;

      const searches = [
        { from: 'ES → DE', equipment: 'Fridge Trailer', time: '2 hours ago' },
        { from: 'FR → FR', equipment: 'Curtain Trailer', time: '5 hours ago' },
        { from: 'IT → PL', equipment: 'Curtain Trailer', time: 'Yesterday' },
        { from: 'PL → RO', equipment: 'Multiple types', time: 'Yesterday' },
        { from: 'BE → PL', equipment: 'Curtain Trailer', time: '2 days ago' },
      ];

      dropdown.innerHTML = `
        <div style="padding:12px 16px;border-bottom:1px solid #e8e8e8;font-size:13px;font-weight:600;color:#252a2e;">Recent Searches</div>
        ${searches.map(s => `
          <div class="spot-recent-item" style="padding:10px 16px;cursor:pointer;transition:background .1s;border-bottom:1px solid #f5f5f5;"
               onmouseenter="this.style.background='#f0f3f5'" onmouseleave="this.style.background=''">
            <div style="font-size:13px;font-weight:500;color:#252a2e;">${s.from} — ${s.equipment}</div>
            <div style="font-size:11px;color:#6a6e73;margin-top:2px;">${s.time}</div>
          </div>
        `).join('')}
      `;

      document.body.appendChild(dropdown);

      dropdown.querySelectorAll('.spot-recent-item').forEach(item => {
        item.addEventListener('click', () => {
          showToast('Search loaded');
          dropdown.remove();
        });
      });

      // Close on outside click
      setTimeout(() => {
        const handler = (e) => {
          if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', handler);
          }
        };
        document.addEventListener('click', handler);
      }, 10);
    });
  }

  // ══════════════════════════════════════════════════════════════════════
  // ── Lane Request Page Interactions ───────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════

  function parseLaneCardData(card) {
    const data = {
      name: '', shipper: '', transportMode: '', from: '', to: '',
      steps: '', shipments: '', contractPeriod: '', startDate: '', startRelative: '',
      deadline: '', deadlineRelative: '', negotiationScope: '', isNew: false
    };

    // New badge
    const chip = card.querySelector('.MuiChip-label');
    if (chip && chip.textContent.trim() === 'New') data.isNew = true;

    // Lane name (after "Name:&nbsp;")
    const nameItem = Array.from(card.querySelectorAll('.MuiListItem-root')).find(li => li.textContent.includes('Name:'));
    if (nameItem) {
      const full = nameItem.textContent.replace(/Name:\s*/, '').trim();
      data.name = full;
    }

    // Shipper (profileLink)
    const profileLink = card.querySelector('.profileLink');
    if (profileLink) data.shipper = profileLink.textContent.trim();

    // Transport mode
    const tmSpan = Array.from(card.querySelectorAll('.MuiTypography-body3')).find(el => el.textContent.includes('Transport Mode:'));
    if (tmSpan) {
      const next = tmSpan.nextElementSibling;
      data.transportMode = next ? next.textContent.trim() : 'Road';
    }

    // From / To
    const fromEl = card.querySelector('[data-testid="rfoTimelineFrom"] p');
    if (fromEl) data.from = fromEl.textContent.trim();
    const toEl = card.querySelector('[data-testid="rfoTimelineTo"] p');
    if (toEl) data.to = toEl.textContent.trim();

    // Steps & Shipments
    const stepsMatch = card.textContent.match(/(\d+)\s*steps/);
    if (stepsMatch) data.steps = stepsMatch[1];
    const shipmentsMatch = card.textContent.match(/(\d+)\s*Shipments/);
    if (shipmentsMatch) data.shipments = shipmentsMatch[1];

    // Contract period, Start, Deadline from list items
    const listItems = card.querySelectorAll('.MuiListItem-root');
    listItems.forEach(li => {
      const text = li.textContent;
      if (text.includes('Contract period')) {
        data.contractPeriod = text.replace(/Contract period\s*/, '').trim();
      } else if (text.includes('Start') && !text.includes('Offer')) {
        const ps = li.querySelectorAll('p');
        if (ps.length >= 2) {
          data.startRelative = ps[0].textContent.trim();
          data.startDate = ps[1].textContent.trim();
        } else if (ps.length === 1) {
          data.startDate = ps[0].textContent.trim();
        }
      } else if (text.includes('Offer submission deadline')) {
        const ps = li.querySelectorAll('p');
        if (ps.length >= 2) {
          data.deadlineRelative = ps[0].textContent.trim();
          data.deadline = ps[1].textContent.trim();
        } else if (ps.length === 1) {
          data.deadline = ps[0].textContent.trim();
        }
      } else if (text.includes('Negotiation Scope')) {
        data.negotiationScope = text.replace(/Negotiation Scope\s*/, '').trim();
      }
    });

    return data;
  }

  function generateLaneUUID() {
    return 'LR-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
  }

  function createLaneDetailDrawer() {
    const drawer = document.createElement('div');
    drawer.id = 'lane-detail-drawer';
    drawer.style.cssText = `
      position: fixed; top: 0; right: -620px; width: 620px; height: 100%;
      background: #fff; box-shadow: -4px 0 24px rgba(0,0,0,.15);
      z-index: 99998; transition: right .3s cubic-bezier(.4,0,.2,1);
      overflow-y: auto; font-family: "Open Sans", Roboto, sans-serif;
    `;
    document.body.appendChild(drawer);
    return drawer;
  }

  function openLaneDetailDrawer(data) {
    let drawer = document.getElementById('lane-detail-drawer');
    if (!drawer) drawer = createLaneDetailDrawer();

    const uuid = generateLaneUUID();
    const initials = getCompanyInitials(data.shipper);
    const fakeEmail = data.shipper.toLowerCase().replace(/[^a-z]/g, '').substring(0, 10) + '@transport.com';

    drawer.innerHTML = `
      <div style="display:flex;flex-direction:column;height:100%;">
        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #e0e0e0;flex-shrink:0;">
          <div style="display:flex;align-items:center;gap:12px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;color:#252a2e;">Lane Request Details</h2>
            ${data.isNew ? '<span style="display:inline-block;padding:2px 10px;background:#f57c00;color:#fff;border-radius:12px;font-size:11px;font-weight:600;">New</span>' : ''}
          </div>
          <button id="lane-drawer-close" style="background:none;border:none;cursor:pointer;padding:6px;font-size:22px;color:#6a6e73;line-height:1;" title="Close">✕</button>
        </div>

        <div style="overflow-y:auto;flex:1;padding:0;">
          <!-- ID + Lane Name -->
          <div style="padding:16px 24px;border-bottom:1px solid #e8e8e8;">
            <div style="font-size:12px;color:#6a6e73;margin-bottom:4px;">ID: ${uuid}</div>
            <h3 style="margin:0;font-size:18px;font-weight:600;color:#252a2e;">${data.name || (data.from + ' → ' + data.to)}</h3>
          </div>

          <!-- Shipper Info -->
          <div style="padding:16px 24px;border-bottom:1px solid #e8e8e8;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
              <div style="width:44px;height:44px;border-radius:50%;background:#5c8a8a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:16px;flex-shrink:0;">${initials}</div>
              <div>
                <div style="font-size:15px;font-weight:600;color:#0063a3;">${data.shipper}</div>
                <div style="font-size:12px;color:#6a6e73;margin-top:2px;">${fakeEmail}</div>
              </div>
            </div>
            <button style="padding:8px 20px;background:#fff;border:1px solid #c1c7cd;border-radius:6px;font-size:13px;font-weight:500;color:#252a2e;cursor:pointer;display:flex;align-items:center;gap:8px;" onclick="this.closest('#lane-detail-drawer').querySelector('#lane-drawer-close').click();">
              <span style="font-size:14px;">🔒</span> Message Shipper
            </button>
          </div>

          <!-- Route Visualization -->
          <div style="padding:16px 24px;border-bottom:1px solid #e8e8e8;">
            <h4 style="margin:0 0 16px;font-size:14px;font-weight:600;color:#252a2e;">Route</h4>
            <div style="display:flex;gap:16px;">
              <div style="flex:1;position:relative;">
                <!-- From stop -->
                <div style="display:flex;align-items:flex-start;gap:12px;padding-bottom:20px;position:relative;">
                  <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
                    <div style="width:28px;height:28px;border-radius:50%;background:#c62828;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;">📦</div>
                    <div style="width:2px;height:32px;background:#c1c7cd;"></div>
                  </div>
                  <div>
                    <div style="font-size:13px;font-weight:600;color:#252a2e;">From: ${data.from || '—'}</div>
                    ${data.steps ? '<div style="margin-top:4px;"><span style="display:inline-block;padding:2px 8px;background:#e3f2fd;color:#0063a3;border-radius:4px;font-size:11px;font-weight:600;">' + data.steps + ' stops</span></div>' : ''}
                  </div>
                </div>
                <!-- To stop -->
                <div style="display:flex;align-items:flex-start;gap:12px;">
                  <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
                    <div style="width:28px;height:28px;border-radius:50%;background:#0063a3;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;">📍</div>
                  </div>
                  <div>
                    <div style="font-size:13px;font-weight:600;color:#252a2e;">To: ${data.to || '—'}</div>
                  </div>
                </div>
              </div>
              <!-- Shipments count -->
              <div style="display:flex;align-items:center;">
                ${data.shipments ? '<span style="display:inline-block;padding:6px 14px;background:#f5f5f5;border-radius:6px;font-size:13px;color:#252a2e;font-weight:500;">' + data.shipments + ' Shipments</span>' : ''}
              </div>
            </div>
          </div>

          <!-- Details Table -->
          <div style="padding:16px 24px 24px;">
            <h4 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#252a2e;">Details</h4>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;width:45%;">Transport Mode</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${data.transportMode || 'Road'}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;">Contract Period</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${data.contractPeriod || '—'}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;">Start Date</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${data.startDate || '—'} ${data.startRelative ? '<span style="color:#6a6e73;font-size:11px;">(' + data.startRelative + ')</span>' : ''}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;">Offer Submission Deadline</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${data.deadline || '—'} ${data.deadlineRelative ? '<span style="color:#6a6e73;font-size:11px;">(' + data.deadlineRelative + ')</span>' : ''}</td>
              </tr>
              <tr style="border-bottom:1px solid #e8e8e8;">
                <td style="padding:10px 0;color:#6a6e73;">Negotiation Scope</td>
                <td style="padding:10px 0;color:#252a2e;text-align:right;">${data.negotiationScope || '—'}</td>
              </tr>
              ${data.shipments ? '<tr style="border-bottom:1px solid #e8e8e8;"><td style="padding:10px 0;color:#6a6e73;">Shipments</td><td style="padding:10px 0;color:#252a2e;text-align:right;">' + data.shipments + '</td></tr>' : ''}
              ${data.steps ? '<tr style="border-bottom:1px solid #e8e8e8;"><td style="padding:10px 0;color:#6a6e73;">Route Steps</td><td style="padding:10px 0;color:#252a2e;text-align:right;">' + data.steps + '</td></tr>' : ''}
            </table>
          </div>

          <!-- Action Buttons at bottom -->
          <div style="padding:0 24px 24px;display:flex;gap:12px;">
            <button id="lane-drawer-submit-btn" style="flex:1;padding:12px 16px;background:#0063a3;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;">View Full Details</button>
            <button id="lane-drawer-decline-btn" style="padding:12px 24px;background:#fff;border:1px solid #c1c7cd;border-radius:6px;font-size:14px;font-weight:500;color:#252a2e;cursor:pointer;">Dismiss</button>
          </div>
        </div>
      </div>
    `;

    // Open animation
    requestAnimationFrame(() => { drawer.style.right = '0'; });

    // Close button
    drawer.querySelector('#lane-drawer-close').addEventListener('click', closeLaneDetailDrawer);
    drawer.querySelector('#lane-drawer-decline-btn').addEventListener('click', closeLaneDetailDrawer);
    drawer.querySelector('#lane-drawer-submit-btn').addEventListener('click', () => {
      showToast('Full details view');
    });
  }

  function closeLaneDetailDrawer() {
    const drawer = document.getElementById('lane-detail-drawer');
    if (drawer) drawer.style.right = '-620px';
    document.querySelectorAll('.MuiCard-root.lane-card-selected').forEach(c => {
      c.classList.remove('lane-card-selected');
    });
  }

  function initLaneRequestCards() {
    const cards = document.querySelectorAll('.MuiCard-root.css-mxptuh');
    if (!cards.length) return;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      .MuiCard-root.css-mxptuh { cursor: pointer; transition: border-color .15s, box-shadow .15s, background .15s; }
      .MuiCard-root.css-mxptuh:hover { background: #f5f8fa !important; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
      .MuiCard-root.lane-card-selected { border-left: 3px solid #0063a3 !important; background: #f0f4f8 !important; }
      .rfoItemFavouriteIcon.lane-fav-active svg { fill: #f57c00 !important; }
      .rfoItemMuteIcon.lane-mute-active i { color: #0063a3 !important; }
    `;
    document.head.appendChild(style);

    cards.forEach(card => {
      // "Details" button click → open drawer
      const detailsBtn = card.querySelector('.rfoItemDetailsBtn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectLaneCard(card);
        });
      }

      // Card click → open drawer
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on star/bell/details buttons
        if (e.target.closest('.rfoItemFavouriteIcon') || e.target.closest('.rfoItemMuteIcon') || e.target.closest('.rfoItemDetailsBtn')) return;
        selectLaneCard(card);
      });

      // Favourite star toggle
      const favBtn = card.querySelector('.rfoItemFavouriteIcon');
      if (favBtn) {
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          favBtn.classList.toggle('lane-fav-active');
          const active = favBtn.classList.contains('lane-fav-active');
          showToast(active ? 'Added to favorites' : 'Removed from favorites');
        });
      }

      // Bell / mute toggle
      const muteBtn = card.querySelector('.rfoItemMuteIcon');
      if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          muteBtn.classList.toggle('lane-mute-active');
          const active = muteBtn.classList.contains('lane-mute-active');
          showToast(active ? 'Notifications enabled' : 'Notifications muted');
        });
      }
    });
  }

  function selectLaneCard(card) {
    // Deselect previous
    document.querySelectorAll('.MuiCard-root.lane-card-selected').forEach(c => {
      c.classList.remove('lane-card-selected');
    });
    card.classList.add('lane-card-selected');
    const data = parseLaneCardData(card);
    openLaneDetailDrawer(data);
  }

  // ── Lane Request Page: Filter Chips ──────────────────────────────────

  function initLaneRequestFilterChips() {
    const chipIds = ['buyer_filter_chip', 'transportMode_filter_chip', 'equipmentType_filter_chip', 'location_filter_chip', 'timeline_filter_chip'];
    const favChip = document.getElementById('myFavorites_filter_chip');

    // Only run on Lane Request page (check for a lane-specific chip)
    if (!document.getElementById('transportMode_filter_chip')) return;

    // Favorites chip → toggle
    if (favChip) {
      favChip.addEventListener('click', () => {
        favChip.classList.toggle('MuiChip-colorPrimary');
        favChip.classList.toggle('MuiChip-filledPrimary');
        const active = favChip.classList.contains('MuiChip-colorPrimary');
        showToast(active ? 'Showing favorites only' : 'Showing all');
      });
    }

    chipIds.forEach(id => {
      const chip = document.getElementById(id);
      if (!chip) return;

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = chip.classList.contains('MuiChip-colorPrimary');

        const existing = document.getElementById('lane-filter-dropdown');
        if (existing) existing.remove();

        if (isActive) {
          chip.classList.remove('MuiChip-colorPrimary', 'MuiChip-clickableColorPrimary', 'MuiChip-filledPrimary');
          chip.classList.add('MuiChip-colorDefault', 'MuiChip-clickableColorDefault', 'MuiChip-filledDefault');
          const caret = chip.querySelector('i[data-testid="icon"]:last-of-type');
          if (caret && caret.textContent.trim() === 'caret_up_bold') caret.textContent = 'caret_down_bold';
        } else {
          chip.classList.remove('MuiChip-colorDefault', 'MuiChip-clickableColorDefault', 'MuiChip-filledDefault');
          chip.classList.add('MuiChip-colorPrimary', 'MuiChip-clickableColorPrimary', 'MuiChip-filledPrimary');
          const caret = chip.querySelector('i[data-testid="icon"]:last-of-type');
          if (caret && caret.textContent.trim() === 'caret_down_bold') caret.textContent = 'caret_up_bold';
          showLaneFilterDropdown(chip, id);
        }
      });
    });
  }

  function showLaneFilterDropdown(chip, chipId) {
    const existing = document.getElementById('lane-filter-dropdown');
    if (existing) existing.remove();

    const configs = {
      buyer_filter_chip: { title: 'Shipper', items: ['DEN-VAN LOGISTIC', 'SWIFT EUROPEAN S.L', 'MACROMEX srl', 'SUPERNOVA INTERTRANS KFT', 'RABEN TRANSPORT', 'DACHSER SE', 'DB SCHENKER'] },
      transportMode_filter_chip: { title: 'Transport Mode', items: ['Road', 'Rail', 'Sea', 'Air', 'Intermodal'] },
      equipmentType_filter_chip: { title: 'Equipment Type', items: ['Curtain Trailer', 'Box Trailer', 'Fridge Trailer', 'Mega Trailer', 'Tanker', 'Container'] },
      location_filter_chip: { title: 'Location', items: ['Belgium (BE)', 'Germany (DE)', 'Poland (PL)', 'Romania (RO)', 'Hungary (HU)', 'Czech Republic (CZ)', 'France (FR)', 'Spain (ES)'] },
      timeline_filter_chip: { title: 'Timeline', items: ['Next 7 days', 'Next 30 days', 'Next 3 months', 'Custom range'] },
    };

    const cfg = configs[chipId] || { title: 'Filter', items: ['Option 1', 'Option 2'] };
    const rect = chip.getBoundingClientRect();

    const dropdown = document.createElement('div');
    dropdown.id = 'lane-filter-dropdown';
    dropdown.style.cssText = `
      position: fixed; top: ${rect.bottom + 6}px; left: ${rect.left}px;
      min-width: 220px; background: #fff; border: 1px solid #e0e0e0;
      border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.12);
      z-index: 99999; font-family: "Open Sans", Roboto, sans-serif; overflow: hidden;
    `;

    dropdown.innerHTML = `
      <div style="padding:12px 16px;border-bottom:1px solid #e8e8e8;font-size:13px;font-weight:600;color:#252a2e;">${cfg.title}</div>
      ${cfg.items.map((item, i) => `
        <label style="display:flex;align-items:center;gap:10px;padding:8px 16px;cursor:pointer;font-size:13px;color:#252a2e;transition:background .1s;"
               onmouseenter="this.style.background='#f0f3f5'" onmouseleave="this.style.background=''">
          <input type="checkbox" style="accent-color:#0063a3;" ${i === 0 ? 'checked' : ''}> ${item}
        </label>
      `).join('')}
      <div style="display:flex;gap:8px;padding:12px 16px;border-top:1px solid #e8e8e8;justify-content:flex-end;">
        <button class="lane-filter-clear" style="padding:6px 12px;background:none;border:1px solid #c1c7cd;border-radius:4px;font-size:12px;cursor:pointer;color:#252a2e;">Clear</button>
        <button class="lane-filter-apply" style="padding:6px 12px;background:#0063a3;border:none;border-radius:4px;font-size:12px;cursor:pointer;color:#fff;font-weight:600;">Apply</button>
      </div>
    `;

    document.body.appendChild(dropdown);

    dropdown.querySelector('.lane-filter-clear').addEventListener('click', () => {
      dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    });

    dropdown.querySelector('.lane-filter-apply').addEventListener('click', () => {
      const checked = dropdown.querySelectorAll('input[type="checkbox"]:checked');
      if (checked.length > 0) {
        showToast(cfg.title + ': ' + checked.length + ' selected');
      }
      dropdown.remove();
    });

    setTimeout(() => {
      const handler = (e) => {
        if (!dropdown.contains(e.target) && !chip.contains(e.target)) {
          dropdown.remove();
          chip.classList.remove('MuiChip-colorPrimary', 'MuiChip-clickableColorPrimary', 'MuiChip-filledPrimary');
          chip.classList.add('MuiChip-colorDefault', 'MuiChip-clickableColorDefault', 'MuiChip-filledDefault');
          const caret = chip.querySelector('i[data-testid="icon"]:last-of-type');
          if (caret && caret.textContent.trim() === 'caret_up_bold') caret.textContent = 'caret_down_bold';
          document.removeEventListener('click', handler);
        }
      };
      document.addEventListener('click', handler);
    }, 10);
  }

  // ── Lane Request Page: Sort Dropdown ─────────────────────────────────

  function initLaneRequestSort() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;

    const sortOptions = ['Best for you', 'Newest first', 'Deadline soonest', 'Shipper A-Z', 'Most shipments'];
    let currentIdx = 0;

    sortSelect.style.cursor = 'pointer';
    sortSelect.addEventListener('click', (e) => {
      e.stopPropagation();

      const existing = document.getElementById('lane-sort-dropdown');
      if (existing) { existing.remove(); return; }

      const rect = sortSelect.getBoundingClientRect();
      const dropdown = document.createElement('div');
      dropdown.id = 'lane-sort-dropdown';
      dropdown.style.cssText = `
        position: fixed; top: ${rect.bottom + 4}px; left: ${rect.left}px;
        min-width: ${rect.width}px; background: #fff; border: 1px solid #e0e0e0;
        border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.12);
        z-index: 99999; font-family: "Open Sans", Roboto, sans-serif; overflow: hidden;
      `;

      dropdown.innerHTML = sortOptions.map((opt, i) => `
        <div class="lane-sort-option" style="padding:10px 16px;cursor:pointer;font-size:13px;color:${i === currentIdx ? '#0063a3' : '#252a2e'};font-weight:${i === currentIdx ? '600' : '400'};transition:background .1s;"
             onmouseenter="this.style.background='#f0f3f5'" onmouseleave="this.style.background=''" data-idx="${i}">
          ${i === currentIdx ? '✓ ' : '&nbsp;&nbsp; '}${opt}
        </div>
      `).join('');

      document.body.appendChild(dropdown);

      dropdown.querySelectorAll('.lane-sort-option').forEach(opt => {
        opt.addEventListener('click', () => {
          currentIdx = parseInt(opt.dataset.idx);
          sortSelect.textContent = sortOptions[currentIdx];
          showToast('Sorted: ' + sortOptions[currentIdx]);
          dropdown.remove();
        });
      });

      setTimeout(() => {
        const handler = (e) => {
          if (!dropdown.contains(e.target) && !sortSelect.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', handler);
          }
        };
        document.addEventListener('click', handler);
      }, 10);
    });
  }

  // ── Lane Request Page: Download / Upload Buttons ─────────────────────

  function initLaneRequestButtons() {
    const dlBtn = document.getElementById('downloadLaneRequestBtn');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => showToast('Download Lane Requests'));
    }

    const ulBtn = document.getElementById('uploadOfferBtn');
    if (ulBtn) {
      ulBtn.addEventListener('click', () => showToast('Upload Offers'));
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // ── RFQ Page Interactions ────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════

  const rfqData = [
    { id: 'RFQ-2026-00147', name: 'BE-Grobbendonk - DE-Hannover RT', shipper: 'DEN-VAN LOGISTIC', from: 'BE - 2280 Grobbendonk', to: 'DE - 30159 Hanover', steps: 3, shipments: 91, deadline: 'in 2 months', deadlineDate: '25.05.2026', startDate: '02.04.2026 16:18', contractPeriod: '26.05.2026 - 01.10.2026', equipmentType: 'Mega Trailer', distance: '848 km', status: 'Open', negotiation: 'Price', memberSince: '01.01.0001' },
    { id: 'RFQ-2026-00152', name: 'PL-Lebork - RO-Bucharest', shipper: 'MACROMEX srl', from: 'PL - 84300 Lebork', to: 'RO - 010101 Bucharest', steps: 2, shipments: 45, deadline: 'in 3 weeks', deadlineDate: '28.04.2026', startDate: '01.04.2026 09:30', contractPeriod: '01.05.2026 - 31.12.2026', equipmentType: 'Fridge Trailer', distance: '1,624 km', status: 'Open', negotiation: 'Price', memberSince: '15.03.2019' },
    { id: 'RFQ-2026-00158', name: 'DE-Baunatal - HU-Budapest', shipper: 'SUPERNOVA INTERTRANS KFT', from: 'DE - 34225 Baunatal', to: 'HU - 1011 Budapest', steps: 2, shipments: 120, deadline: 'in 6 weeks', deadlineDate: '18.05.2026', startDate: '03.04.2026 14:00', contractPeriod: '01.06.2026 - 30.11.2026', equipmentType: 'Curtain Trailer', distance: '1,104 km', status: 'Open', negotiation: 'Price + Capacity', memberSince: '22.08.2020' },
    { id: 'RFQ-2026-00163', name: 'ES-Barcelona - FR-Lyon', shipper: 'SWIFT EUROPEAN S.L', from: 'ES - 08001 Barcelona', to: 'FR - 69001 Lyon', steps: 1, shipments: 30, deadline: 'in 10 days', deadlineDate: '17.04.2026', startDate: '31.03.2026 11:45', contractPeriod: '20.04.2026 - 20.07.2026', equipmentType: 'Box Trailer', distance: '645 km', status: 'Urgent', negotiation: 'Price', memberSince: '10.06.2018' },
    { id: 'RFQ-2026-00171', name: 'CZ-Plzen - AT-Wien', shipper: 'RABEN TRANSPORT', from: 'CZ - 30100 Plzen', to: 'AT - 1010 Wien', steps: 2, shipments: 68, deadline: 'in 5 weeks', deadlineDate: '11.05.2026', startDate: '04.04.2026 08:15', contractPeriod: '15.05.2026 - 15.10.2026', equipmentType: 'Mega Trailer', distance: '382 km', status: 'Open', negotiation: 'Price', memberSince: '01.01.2015' },
    { id: 'RFQ-2026-00179', name: 'DE-Hamburg - PL-Poznan', shipper: 'DB SCHENKER', from: 'DE - 20095 Hamburg', to: 'PL - 60001 Poznan', steps: 1, shipments: 200, deadline: 'in 4 weeks', deadlineDate: '05.05.2026', startDate: '05.04.2026 10:00', contractPeriod: '10.05.2026 - 31.12.2026', equipmentType: 'Curtain Trailer', distance: '594 km', status: 'Open', negotiation: 'Price + Capacity', memberSince: '01.01.2010' },
    { id: 'RFQ-2026-00185', name: 'IT-Milano - DE-München', shipper: 'DACHSER SE', from: 'IT - 20121 Milano', to: 'DE - 80331 München', steps: 2, shipments: 55, deadline: 'in 2 weeks', deadlineDate: '21.04.2026', startDate: '02.04.2026 13:30', contractPeriod: '25.04.2026 - 25.09.2026', equipmentType: 'Box Trailer', distance: '492 km', status: 'Urgent', negotiation: 'Price', memberSince: '01.01.2012' },
    { id: 'RFQ-2026-00192', name: 'FR-Paris - BE-Antwerp', shipper: 'GEODIS LOGISTICS', from: 'FR - 75001 Paris', to: 'BE - 2000 Antwerp', steps: 1, shipments: 38, deadline: 'in 7 weeks', deadlineDate: '25.05.2026', startDate: '06.04.2026 07:00', contractPeriod: '01.06.2026 - 01.12.2026', equipmentType: 'Curtain Trailer', distance: '304 km', status: 'Open', negotiation: 'Price', memberSince: '15.09.2016' },
  ];

  function generateRFQCardHTML(rfq, idx) {
    const initials = getCompanyInitials(rfq.shipper);
    const colors = ['#5c8a8a', '#8a5c5c', '#5c5c8a', '#8a7d5c', '#5c8a6e', '#6e5c8a', '#8a5c7d', '#5c7d8a'];
    const color = colors[idx % colors.length];
    const isUrgent = rfq.status === 'Urgent';

    return `
      <div class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root rfq-card css-110ciry"
           style="--Paper-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12); cursor:pointer; transition: box-shadow .15s, border-color .15s;"
           data-rfq-idx="${idx}">
        <div class="MuiCardContent-root css-11wm1by" style="padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-size:11px;color:#6a6e73;">${rfq.id}</span>
            <span style="display:inline-block;padding:2px 10px;background:${isUrgent ? '#c62828' : '#2e7d32'};color:#fff;border-radius:12px;font-size:10px;font-weight:600;">${rfq.status}</span>
          </div>
          <p style="font-size:13px;color:#252a2e;margin:0 0 10px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${rfq.name}</p>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="width:40px;height:36px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;flex-shrink:0;">${initials}</div>
            <h3 style="margin:0;font-size:14px;font-weight:600;color:#252a2e;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${rfq.shipper}</h3>
          </div>
          <div style="font-size:12px;color:#6a6e73;line-height:1.6;">
            <div><b>From:</b> ${rfq.from}</div>
            <div><b>To:</b> ${rfq.to}</div>
            <div><b>Deadline:</b> ${rfq.deadline}${isUrgent ? ' ⚠' : ''}</div>
          </div>
          <div style="flex-grow:1;"></div>
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:10px 0 8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;color:#6a6e73;">${rfq.equipmentType} · ${rfq.shipments} shipments</span>
            <button class="rfq-details-btn" style="padding:4px 14px;background:#0063a3;color:#fff;border:none;border-radius:4px;font-size:12px;font-weight:600;cursor:pointer;">Details</button>
          </div>
        </div>
      </div>
    `;
  }

  function initRFQPage() {
    const container = document.querySelector('[data-testid="seller-overview"] .css-2imjyh');
    if (!container) return;

    // Check if this is the RFQ page — look for the H1
    const h1 = document.querySelector('h1.MuiTypography-h1');
    if (!h1 || h1.textContent.trim() !== 'RFQ') return;

    // Replace skeleton cards with real data
    container.innerHTML = rfqData.map((rfq, i) => generateRFQCardHTML(rfq, i)).join('');

    // Enable refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.disabled = false;
      refreshBtn.classList.remove('Mui-disabled');
      refreshBtn.style.cursor = 'pointer';
      refreshBtn.addEventListener('click', () => {
        const icon = refreshBtn.querySelector('i');
        if (icon) {
          icon.style.animation = 'rfq-spin .8s ease';
          icon.addEventListener('animationend', () => { icon.style.animation = ''; }, { once: true });
        }
        showToast('Refreshed');
      });
    }

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rfq-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .rfq-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.12) !important; }
      .rfq-card.rfq-selected { border-left: 3px solid #0063a3 !important; background: #f0f4f8 !important; }
    `;
    document.head.appendChild(style);

    // Card and Details button click handlers
    container.querySelectorAll('.rfq-card').forEach(card => {
      const idx = parseInt(card.dataset.rfqIdx);

      card.addEventListener('click', (e) => {
        if (e.target.closest('.rfq-details-btn')) return;
        selectRFQCard(card, idx);
      });

      const detBtn = card.querySelector('.rfq-details-btn');
      if (detBtn) {
        detBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectRFQCard(card, idx);
        });
      }
    });
  }

  function selectRFQCard(card, idx) {
    document.querySelectorAll('.rfq-card.rfq-selected').forEach(c => c.classList.remove('rfq-selected'));
    card.classList.add('rfq-selected');
    openRFQDetailDrawer(rfqData[idx]);
  }

  function openRFQDetailDrawer(rfq) {
    let drawer = document.getElementById('rfq-detail-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'rfq-detail-drawer';
      drawer.style.cssText = `
        position: fixed; top: 0; right: -780px; width: 780px; height: 100%;
        background: #f5f5f5; box-shadow: -4px 0 24px rgba(0,0,0,.15);
        z-index: 99998; transition: right .3s cubic-bezier(.4,0,.2,1);
        overflow-y: auto; font-family: "Open Sans", Roboto, sans-serif;
      `;
      document.body.appendChild(drawer);
    }

    const initials = getCompanyInitials(rfq.shipper);
    const isUrgent = rfq.status === 'Urgent';

    // Build steps details based on from/to
    const fromCity = rfq.from.split(' ').pop();
    const toCity = rfq.to.split(' ').pop();
    const stepsHTML = rfq.steps >= 2 ? `
      <div class="rfq-step-item">
        <div style="display:flex;align-items:center;gap:10px;padding:14px 20px;background:#fff;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:8px;cursor:pointer;" onclick="this.querySelector('.rfq-step-chevron').classList.toggle('rfq-step-open')">
          <span style="font-size:16px;">📦</span>
          <span style="font-size:13px;font-weight:600;color:#252a2e;flex:1;">Collect Cargo - ${rfq.from}</span>
          <span class="rfq-step-chevron" style="font-size:14px;color:#6a6e73;transition:transform .2s;">▾</span>
        </div>
      </div>
      <div class="rfq-step-item">
        <div style="display:flex;align-items:center;gap:10px;padding:14px 20px;background:#fff;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:8px;cursor:pointer;" onclick="this.querySelector('.rfq-step-chevron').classList.toggle('rfq-step-open')">
          <span style="font-size:16px;">↓</span>
          <span style="font-size:13px;font-weight:600;color:#252a2e;flex:1;">Transit - For-Hire Road</span>
          <span class="rfq-step-chevron" style="font-size:14px;color:#6a6e73;transition:transform .2s;">▾</span>
        </div>
      </div>
      <div class="rfq-step-item">
        <div style="display:flex;align-items:center;gap:10px;padding:14px 20px;background:#fff;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:8px;cursor:pointer;" onclick="this.querySelector('.rfq-step-chevron').classList.toggle('rfq-step-open')">
          <span style="font-size:16px;">📦</span>
          <span style="font-size:13px;font-weight:600;color:#252a2e;flex:1;">Delivery Cargo - ${rfq.to}</span>
          <span class="rfq-step-chevron" style="font-size:14px;color:#6a6e73;transition:transform .2s;">▾</span>
        </div>
      </div>
    ` : `
      <div class="rfq-step-item">
        <div style="display:flex;align-items:center;gap:10px;padding:14px 20px;background:#fff;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:8px;cursor:pointer;" onclick="this.querySelector('.rfq-step-chevron').classList.toggle('rfq-step-open')">
          <span style="font-size:16px;">📦</span>
          <span style="font-size:13px;font-weight:600;color:#252a2e;flex:1;">Collect Cargo - ${rfq.from}</span>
          <span class="rfq-step-chevron" style="font-size:14px;color:#6a6e73;transition:transform .2s;">▾</span>
        </div>
      </div>
      <div class="rfq-step-item">
        <div style="display:flex;align-items:center;gap:10px;padding:14px 20px;background:#fff;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:8px;cursor:pointer;" onclick="this.querySelector('.rfq-step-chevron').classList.toggle('rfq-step-open')">
          <span style="font-size:16px;">📦</span>
          <span style="font-size:13px;font-weight:600;color:#252a2e;flex:1;">Delivery Cargo - ${rfq.to}</span>
          <span class="rfq-step-chevron" style="font-size:14px;color:#6a6e73;transition:transform .2s;">▾</span>
        </div>
      </div>
    `;

    drawer.innerHTML = `
      <div style="display:flex;flex-direction:column;height:100%;">
        <!-- Top bar -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 24px;background:#fff;border-bottom:1px solid #e0e0e0;flex-shrink:0;">
          <div style="display:flex;align-items:center;gap:12px;">
            <button id="rfq-drawer-back" style="background:none;border:none;cursor:pointer;font-size:18px;color:#0063a3;padding:4px;">‹</button>
            <h2 style="margin:0;font-size:18px;font-weight:600;color:#252a2e;">${rfq.name}</h2>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="rfq-action-btn" style="padding:8px 16px;background:#fff;border:1px solid #0063a3;border-radius:4px;font-size:13px;font-weight:600;color:#0063a3;cursor:pointer;display:flex;align-items:center;gap:6px;">
              <span>🔒</span> Ask a Question
            </button>
            <button class="rfq-action-btn" style="padding:8px 16px;background:#0063a3;border:none;border-radius:4px;font-size:13px;font-weight:600;color:#fff;cursor:pointer;display:flex;align-items:center;gap:6px;">
              <span>🔒</span> Make an Offer
            </button>
          </div>
        </div>

        <div style="overflow-y:auto;flex:1;padding:0;">
          <!-- Two-column layout -->
          <div style="display:flex;gap:0;min-height:100%;">
            <!-- Left column: Route details -->
            <div style="flex:1;padding:20px 24px;background:#fff;border-right:1px solid #e0e0e0;">
              <!-- From/To -->
              <div style="margin-bottom:20px;">
                <div style="font-size:13px;font-weight:700;color:#252a2e;margin-bottom:4px;">From</div>
                <div style="font-size:14px;color:#252a2e;margin-bottom:8px;">${rfq.from}</div>
                <div style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:4px;font-size:12px;color:#252a2e;margin-bottom:2px;">
                  <span style="font-size:11px;">⚙</span> ${rfq.steps} steps
                </div>
                <div style="display:inline-flex;align-items:center;padding:4px 10px;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:4px;font-size:12px;color:#252a2e;margin-left:8px;">
                  ${rfq.shipments} Shipments
                </div>
              </div>
              <div style="margin-bottom:20px;">
                <div style="font-size:13px;font-weight:700;color:#252a2e;margin-bottom:4px;">To</div>
                <div style="font-size:14px;color:#252a2e;">${rfq.to}</div>
              </div>

              <!-- Metadata fields -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 32px;margin-bottom:24px;">
                <div>
                  <div style="font-size:13px;font-weight:700;color:#252a2e;">Offer submission deadline</div>
                  <div style="display:flex;align-items:center;gap:6px;font-size:13px;color:#252a2e;margin-top:2px;">
                    <span style="width:8px;height:8px;background:${isUrgent ? '#c62828' : '#2e7d32'};border-radius:50%;display:inline-block;"></span> ${rfq.deadline}
                  </div>
                </div>
                <div>
                  <div style="font-size:13px;font-weight:700;color:#252a2e;">Start Lane Request</div>
                  <div style="font-size:13px;color:#252a2e;margin-top:2px;">${rfq.startDate}</div>
                </div>
                <div>
                  <div style="font-size:13px;font-weight:700;color:#252a2e;">Contract period</div>
                  <div style="font-size:13px;color:#252a2e;margin-top:2px;">${rfq.contractPeriod}</div>
                </div>
                <div>
                  <div style="font-size:13px;font-weight:700;color:#252a2e;">Equipment Type</div>
                  <div style="font-size:13px;color:#252a2e;margin-top:2px;">${rfq.equipmentType} <span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;background:#0063a3;color:#fff;border-radius:50%;font-size:10px;font-weight:700;cursor:help;" title="Equipment info">i</span></div>
                </div>
                <div>
                  <div style="font-size:13px;font-weight:700;color:#252a2e;">Total distance</div>
                  <div style="font-size:13px;color:#252a2e;margin-top:2px;">${rfq.distance} <span style="font-size:11px;color:#6a6e73;">(automatically calculated)</span></div>
                </div>
                <div>
                  <div style="font-size:13px;font-weight:700;color:#252a2e;">Negotiation Scope</div>
                  <div style="font-size:13px;color:#252a2e;margin-top:2px;">${rfq.negotiation}</div>
                </div>
              </div>

              <!-- Accordions -->
              <div style="margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-top:1px solid #e0e0e0;cursor:pointer;" onclick="this.querySelector('span:last-child').textContent = this.querySelector('span:last-child').textContent === '▾' ? '▸' : '▾'">
                  <span style="font-size:14px;font-weight:500;color:#252a2e;">Total Volume</span>
                  <span style="font-size:14px;color:#6a6e73;">▾</span>
                </div>
              </div>
              <div style="margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-top:1px solid #e0e0e0;cursor:pointer;" onclick="this.querySelector('span:last-child').textContent = this.querySelector('span:last-child').textContent === '▾' ? '▸' : '▾'">
                  <span style="font-size:14px;font-weight:500;color:#252a2e;">Special Services Required</span>
                  <span style="font-size:14px;color:#6a6e73;">▾</span>
                </div>
              </div>

              <!-- Steps Details -->
              <div style="background:#f5f5f5;border-radius:8px;padding:16px;margin-top:8px;">
                <h3 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#252a2e;">Steps Details</h3>
                ${stepsHTML}
              </div>
            </div>

            <!-- Right column: Company info -->
            <div style="width:340px;padding:20px;flex-shrink:0;">
              <!-- Company card -->
              <div style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:20px;margin-bottom:16px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                  <div style="width:44px;height:44px;border-radius:50%;background:#5c8a8a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:16px;flex-shrink:0;">${initials}</div>
                  <div style="font-size:16px;font-weight:700;color:#252a2e;">${rfq.shipper}</div>
                </div>
                <div style="font-size:12px;color:#6a6e73;margin-bottom:16px;">Member since: ${rfq.memberSince}</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px;">
                  <div>
                    <div style="color:#6a6e73;">Total Lane Requests run in Freight Marketplace</div>
                    <div style="font-weight:600;color:#252a2e;">0</div>
                  </div>
                  <div>
                    <div style="color:#6a6e73;">Past Lane Requests that ended with an award</div>
                    <div style="font-weight:600;color:#252a2e;">0</div>
                  </div>
                  <div>
                    <div style="color:#6a6e73;">Currently open Lane Requests in Freight Marketplace</div>
                    <div style="font-weight:600;color:#252a2e;">0</div>
                  </div>
                  <div>
                    <div style="color:#6a6e73;">Total spend in Freight Marketplace</div>
                    <div style="font-weight:600;color:#252a2e;">0</div>
                  </div>
                </div>
              </div>

              <!-- Contact card -->
              <div style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:20px;margin-bottom:16px;">
                <h4 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#252a2e;">Contact</h4>
                <div style="color:#c1c7cd;font-size:13px;line-height:1.8;margin-bottom:12px;">
                  <div>●●●●●</div><div>●●●●</div><div>●●●●●</div><div>●●●●</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:#fef3f0;border:1px solid #f5c6cb;border-radius:6px;">
                  <span style="font-size:14px;">🔒</span>
                  <span style="font-size:12px;color:#252a2e;flex:1;">Get verified to view the contact information</span>
                  <a href="#" style="font-size:12px;color:#0063a3;font-weight:600;text-decoration:none;white-space:nowrap;" onclick="event.preventDefault();showToast('Verification')">Get verified</a>
                </div>
              </div>

              <!-- Map placeholder -->
              <div style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;height:220px;position:relative;">
                <div style="width:100%;height:100%;background:#dde6ed;display:flex;align-items:center;justify-content:center;position:relative;">
                  <div style="position:absolute;top:10px;left:10px;display:flex;flex-direction:column;gap:4px;">
                    <div style="width:28px;height:28px;background:#fff;border:1px solid #ccc;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;">🌐</div>
                    <div style="width:28px;height:28px;background:#fff;border:1px solid #ccc;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;">≡</div>
                  </div>
                  <div style="position:absolute;top:10px;right:10px;display:flex;flex-direction:column;gap:4px;">
                    <div style="width:28px;height:28px;background:#fff;border:1px solid #ccc;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;">⛶</div>
                    <div style="width:28px;height:28px;background:#fff;border:1px solid #ccc;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;">+</div>
                    <div style="width:28px;height:28px;background:#fff;border:1px solid #ccc;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;">−</div>
                  </div>
                  <div style="font-size:13px;color:#6a6e73;">Map — ${rfq.from.substring(0,2)} → ${rfq.to.substring(0,2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Open
    requestAnimationFrame(() => { drawer.style.right = '0'; });

    // Back/close button
    drawer.querySelector('#rfq-drawer-back').addEventListener('click', closeRFQDetailDrawer);

    // Action buttons
    drawer.querySelectorAll('.rfq-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.textContent.trim().replace('🔒', '').trim();
        showToast(text);
      });
    });

    // Step chevron toggle style
    if (!document.getElementById('rfq-step-style')) {
      const stepStyle = document.createElement('style');
      stepStyle.id = 'rfq-step-style';
      stepStyle.textContent = `.rfq-step-open { transform: rotate(-90deg); }`;
      document.head.appendChild(stepStyle);
    }
  }

  function closeRFQDetailDrawer() {
    const drawer = document.getElementById('rfq-detail-drawer');
    if (drawer) drawer.style.right = '-780px';
    document.querySelectorAll('.rfq-card.rfq-selected').forEach(c => c.classList.remove('rfq-selected'));
  }

  // ── Initialize ───────────────────────────────────────────────────────

  function init() {
    initDialogs();
    initTabs();
    initFilterChips();
    initDropdowns();
    initHeaderButtons();
    initGoToButtons();
    initDrawers();
    initTooltips();

    // Spot page specific
    initSpotRowClicks();
    initSpotFilterChips();
    initSpotSortHeaders();
    initSpotRefresh();
    initSpotRecentSearches();

    // Lane Request page specific
    initLaneRequestCards();
    initLaneRequestFilterChips();
    initLaneRequestSort();
    initLaneRequestButtons();

    // RFQ page specific
    initRFQPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
