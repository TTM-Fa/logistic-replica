/**
 * Transporeon Visibility - Site Interactions
 * 
 * Handles all interactive elements across the 9 HTML pages:
 * - index.html
 * - analytics.html
 * - fleet.html
 * - data-network.html
 * - dashboards.html
 * - transports.html
 * - vehicle-management.html
 * - notifications.html
 * - shared-views.html
 */

// ============================================================================
// 1. SIDEBAR NAVIGATION
// ============================================================================

class SidebarNavigation {
  constructor() {
    this.nav = document.querySelector('nav[data-test-id="sideMenuNav"]');
    this.navItems = document.querySelectorAll('nav[data-test-id="sideMenuNav"] a[data-test-id]');
    this.collapseBtn = document.querySelector('button[aria-controls="_r_1_"]');
    this.header = document.getElementById('_r_1_');
    
    this.init();
  }

  init() {
    if (!this.nav) return;
    
    // Handle collapse/expand button
    this.collapseBtn?.addEventListener('click', () => this.toggleSidebar());
    
    // Set active nav item based on current page
    this.setActivePage();
    
    // Add click handlers to nav items
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => this.handleNavClick(e, item));
    });
  }

  toggleSidebar() {
    const isExpanded = this.collapseBtn.getAttribute('aria-expanded') === 'true';
    this.collapseBtn.setAttribute('aria-expanded', !isExpanded);
    this.header.classList.toggle('collapsed');
  }

  setActivePage() {
    // Get current page filename from URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    this.navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPage) {
        item.setAttribute('aria-current', 'true');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }

  handleNavClick(event, item) {
    // Update aria-current for all items
    this.navItems.forEach(i => {
      if (i === item) {
        i.setAttribute('aria-current', 'true');
      } else {
        i.removeAttribute('aria-current');
      }
    });
    
    // Navigate to the page
    const href = item.getAttribute('href');
    window.location.href = href;
  }
}

// ============================================================================
// 2. HEADER ACTION BUTTONS
// ============================================================================

class HeaderActions {
  constructor() {
    this.helpBtn = document.querySelector('button[data-test-id="helpCenter"]');
    this.companySwitcher = document.querySelector('button[data-test-id="companySwitcher"]');
    
    this.init();
  }

  init() {
    // Help button - opens dialog
    this.helpBtn?.addEventListener('click', (e) => this.toggleHelpDialog(e));
    
    // Company switcher - opens dropdown/dialog
    this.companySwitcher?.addEventListener('click', (e) => this.toggleCompanyDialog(e));
    
    // Close dialogs when clicking outside
    document.addEventListener('click', (e) => this.handleDocumentClick(e));
  }

  toggleHelpDialog(event) {
    const isExpanded = this.helpBtn.getAttribute('aria-expanded') === 'true';
    this.helpBtn.setAttribute('aria-expanded', !isExpanded);
    
    // Emit custom event for dialog management
    this.dispatchDialogEvent('help-toggle', !isExpanded);
  }

  toggleCompanyDialog(event) {
    const isExpanded = this.companySwitcher.getAttribute('aria-expanded') === 'true';
    this.companySwitcher.setAttribute('aria-expanded', !isExpanded);
    
    // Emit custom event for dialog management
    this.dispatchDialogEvent('company-toggle', !isExpanded);
  }

  handleDocumentClick(event) {
    // Close dialogs when clicking outside (if needed)
    const isHelpBtn = event.target.closest('[data-test-id="helpCenter"]');
    const isCompanyBtn = event.target.closest('[data-test-id="companySwitcher"]');
    
    if (!isHelpBtn && this.helpBtn.getAttribute('aria-expanded') === 'true') {
      // Optionally close help dialog
    }
    
    if (!isCompanyBtn && this.companySwitcher.getAttribute('aria-expanded') === 'true') {
      // Optionally close company dialog
    }
  }

  dispatchDialogEvent(eventName, isOpen) {
    const event = new CustomEvent(eventName, { detail: { isOpen } });
    document.dispatchEvent(event);
  }
}

// ============================================================================
// 3. TAB INTERFACES
// ============================================================================

class TabInterface {
  constructor() {
    // Vehicle Management sub-tabs
    this.vmTabs = document.querySelectorAll('nav._7lkwi90 a');
    
    // Data Network tabs (if applicable)
    this.dnTabs = document.querySelectorAll('[data-test-id*="dataSharingNetworkTab"]');
    
    this.init();
  }

  init() {
    // Initialize Vehicle Management tabs
    this.vmTabs.forEach(tab => {
      tab.addEventListener('click', (e) => this.handleTabClick(e, tab, 'vm'));
    });
    
    // Initialize Data Network tabs (if present)
    this.dnTabs.forEach(tab => {
      tab.addEventListener('click', (e) => this.handleTabClick(e, tab, 'dn'));
    });
  }

  handleTabClick(event, tab, tabGroup) {
    event.preventDefault();
    
    if (tabGroup === 'vm') {
      // Vehicle Management tabs
      this.vmTabs.forEach(t => {
        if (t === tab) {
          t.setAttribute('aria-current', 'true');
          t.classList.add('_7lkwi93'); // Active class
        } else {
          t.setAttribute('aria-current', 'false');
          t.classList.remove('_7lkwi93');
        }
      });
      
      // Navigate to tab URL
      const href = tab.getAttribute('href');
      window.location.href = href;
      
    } else if (tabGroup === 'dn') {
      // Data Network tabs
      this.dnTabs.forEach(t => {
        t.setAttribute('aria-current', t === tab ? 'true' : 'false');
      });
    }
  }
}

// ============================================================================
// 4. BUTTONS - ADD/ACTION BUTTONS
// ============================================================================

class ActionButtons {
  constructor() {
    // Find all "Add" buttons
    this.addButtons = document.querySelectorAll('button:has(span:contains("Add"))');
    
    // Find specific buttons by text
    this.addNotificationBtn = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Add notification rule'));
    
    this.addSharedViewBtn = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent.includes('Add shared view'));
    
    this.init();
  }

  init() {
    this.addButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleAddClick(e, btn));
    });
  }

  handleAddClick(event, button) {
    event.preventDefault();
    
    const buttonText = button.textContent.trim();
    
    if (buttonText.includes('notification rule')) {
      this.dispatchEvent('add-notification-rule');
    } else if (buttonText.includes('shared view')) {
      this.dispatchEvent('add-shared-view');
    } else if (buttonText.includes('GPS')) {
      this.dispatchEvent('add-gps-integration');
    }
  }

  dispatchEvent(eventName) {
    const event = new CustomEvent(eventName);
    document.dispatchEvent(event);
  }
}

// ============================================================================
// 5. SEARCH INPUTS
// ============================================================================

class SearchInputs {
  constructor() {
    this.searchInputs = document.querySelectorAll('input[name="search"]');
    
    this.init();
  }

  init() {
    this.searchInputs.forEach(input => {
      // Debounce search input
      let debounceTimer;
      input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.handleSearch(e, input);
        }, 300);
      });
      
      // Handle search submit (Enter key)
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch(e, input);
        }
      });
    });
  }

  handleSearch(event, input) {
    const query = input.value.trim();
    const placeholder = input.getAttribute('placeholder');
    
    // Determine search context
    let searchContext = 'general';
    if (placeholder.includes('transports')) {
      searchContext = 'transports';
    }
    
    // Dispatch search event
    const event = new CustomEvent('search', {
      detail: { query, context: searchContext }
    });
    document.dispatchEvent(event);
  }
}

// ============================================================================
// 6. NOTIFICATION BANNER
// ============================================================================

class NotificationBanner {
  constructor() {
    this.bannerContainer = document.querySelector('[data-testid="notification-boundary-announcement-container"]');
    this.dismissBtn = document.querySelector('button.glb6s89');
    
    this.init();
  }

  init() {
    if (!this.bannerContainer) return;
    
    this.dismissBtn?.addEventListener('click', (e) => this.handleDismiss(e));
    
    // Optional: Auto-hide after 5 seconds
    // this.startAutoHide();
  }

  handleDismiss(event) {
    event.preventDefault();
    
    // Get the banner element
    const banner = this.bannerContainer.querySelector('.glb6s86');
    if (banner) {
      banner.style.opacity = '0';
      banner.style.height = '0';
      banner.style.overflow = 'hidden';
      banner.style.transition = 'all 0.3s ease-out';
      
      // Remove after animation
      setTimeout(() => {
        this.bannerContainer.innerHTML = '';
      }, 300);
    }
    
    // Dispatch event
    const event = new CustomEvent('banner-dismissed', {
      detail: { action: this.dismissBtn.textContent.trim() }
    });
    document.dispatchEvent(event);
  }

  startAutoHide() {
    setTimeout(() => {
      if (this.bannerContainer && this.bannerContainer.querySelector('.glb6s86')) {
        this.handleDismiss({ preventDefault: () => {} });
      }
    }, 5000);
  }
}

// ============================================================================
// 7. MODALS/DIALOGS
// ============================================================================

class DialogManager {
  constructor() {
    this.dialogs = document.querySelectorAll('section[role="dialog"]');
    
    this.init();
  }

  init() {
    this.dialogs.forEach(dialog => {
      // Find close button
      const closeBtn = dialog.querySelector('button[class*="y082k13"]');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => this.closeDialog(e, dialog));
      }
      
      // Handle Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeDialog(e, dialog);
        }
      });
      
      // Handle backdrop click (if applicable)
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
          this.closeDialog(e, dialog);
        }
      });
    });
  }

  closeDialog(event, dialog) {
    event.preventDefault();
    
    dialog.style.opacity = '0';
    dialog.style.visibility = 'hidden';
    dialog.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
      // Remove or hide dialog
      if (dialog.parentElement?.id === 'drawer-root') {
        dialog.remove();
      }
    }, 300);
    
    // Restore focus to triggering element
    const triggerBtn = document.activeElement;
    if (triggerBtn) {
      triggerBtn.focus();
    }
  }
}

// ============================================================================
// 8. INITIALIZATION
// ============================================================================

// Initialize all interactive components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Transporeon Visibility] Initializing interactions...');
  
  // Initialize sidebar navigation
  const sidebar = new SidebarNavigation();
  
  // Initialize header actions
  const headerActions = new HeaderActions();
  
  // Initialize tabs
  const tabs = new TabInterface();
  
  // Initialize action buttons
  const buttons = new ActionButtons();
  
  // Initialize search inputs
  const search = new SearchInputs();
  
  // Initialize notification banner
  const banner = new NotificationBanner();
  
  // Initialize dialogs
  const dialogs = new DialogManager();
  
  console.log('[Transporeon Visibility] Interactions initialized');
});

// ============================================================================
// 9. UTILITY FUNCTIONS
// ============================================================================

/**
 * Update active page in sidebar navigation
 */
function updateActivePage(pageName) {
  const navItems = document.querySelectorAll('nav[data-test-id="sideMenuNav"] a[data-test-id]');
  navItems.forEach(item => {
    const testId = item.getAttribute('data-test-id');
    if (testId === pageName) {
      item.setAttribute('aria-current', 'true');
    } else {
      item.removeAttribute('aria-current');
    }
  });
}

/**
 * Get current page name
 */
function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

/**
 * Navigate to page
 */
function navigateTo(page) {
  window.location.href = page;
}

// ============================================================================
// 10. CUSTOM EVENTS (for external listeners)
// ============================================================================

/*
Available custom events:
- 'sidebar-toggled': sidebar collapse state changed
- 'help-toggle': help dialog opened/closed
- 'company-toggle': company switcher opened/closed
- 'tab-changed': tab interface changed
- 'search': search input submitted
- 'add-notification-rule': Add Notification Rule button clicked
- 'add-shared-view': Add Shared View button clicked
- 'add-gps-integration': Add GPS Integration button clicked
- 'banner-dismissed': Notification banner dismissed
- 'dialog-opened': Dialog/Modal opened
- 'dialog-closed': Dialog/Modal closed

Example usage:
document.addEventListener('search', (e) => {
  console.log('Search query:', e.detail.query);
  console.log('Search context:', e.detail.context);
});
*/
