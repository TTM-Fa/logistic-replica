# Transporeon Visibility - Interactive Elements Reference

Quick reference for all interactive elements across 9 HTML pages.

---

## Sidebar Navigation (All 9 pages)

**Selector**: `nav[data-test-id="sideMenuNav"]`

**Nav Items**:
- `data-test-id="dashboards"` → dashboards.html
- `data-test-id="roadTransports"` → transports.html
- `data-test-id="visibilityControlCenter"` → data-network.html
- `data-test-id="analytics"` → analytics.html
- `data-test-id="connectedVehicles"` → vehicle-management.html
- `data-test-id="fleetMonitor"` → fleet.html
- `data-test-id="notifications"` → notifications.html
- `data-test-id="shared-views"` → shared-views.html

**Active Indicator**: `aria-current="true"` or `aria-current="page"`

**Collapse Button**: `button[aria-controls="_r_1_"]` with `aria-expanded` toggle

---

## Header Action Buttons (All 9 pages)

**Help Button**: `button[data-test-id="helpCenter"]`
- Opens dialog
- Toggle `aria-expanded`

**Company Switcher**: `button[data-test-id="companySwitcher"]`
- Opens dropdown
- Toggle `aria-expanded`
- Badge: `span._1owv7l00._1owv7l02 > span`

---

## Tab Interfaces

### Vehicle Management (4 tabs)
- **Selector**: `nav._7lkwi90 a`
- **Active**: `aria-current="true"` + class `_7lkwi93`
- **Tabs**:
  1. Dedicated vehicles → `/companies/321090/vehicle-management/dedicated-vehicles/details`
  2. Dedicated by partners → `/companies/321090/vehicle-management/dedicated-by-partners`
  3. Dedicate your vehicles → `/companies/321090/vehicle-management/dedicated-to-partners`
  4. Integrations → `/companies/321090/vehicle-management/integrations`

### Data Network
- **Tab IDs**: 
  - `data-test-id="dataSharingNetworkTabProvidingVisibility"`
  - `data-test-id="dataSharingNetworkTabReceivingVisibility"`

---

## Buttons

### Add Buttons
- **Classes**: `y082k11 y082k19 y082k15` (primary/positive)
- **Notifications**: "Add notification rule"
- **Shared Views**: "Add shared view"
- **Dispatch**: Custom event (e.g., `add-notification-rule`)

### Button Styles
| Classes | Style |
|---------|-------|
| `y082k11 y082k19 y082k15` | Primary green |
| `y082k11 y082k18 y082k15` | Secondary gray |
| `y082k11 y082k18 y082k16 y082k12` | Secondary with border |
| `y082k11 y082k1b y082k15 y082k13` | Small icon button |

---

## Search Inputs

**Selector**: `input[name="search"]`

**Container**: `div.ws6vko0`

**Icon**: `#small-search` from sprite

**Behavior**:
- Debounce 300ms
- Dispatch `search` custom event on input/Enter
- Event detail: `{ query, context: "transports" }`

---

## Notification Banner (All 9 pages)

**Selector**: `[data-testid="notification-boundary-announcement-container"]`

**Message**: "Real Time Visibility is provided via GPS tracking data."

**Dismiss Button**: `button.glb6s89` - "Connect your vehicles"

**On Dismiss**:
- Animate: `opacity: 0`, `height: 0`, `overflow: hidden`
- Remove from DOM after 300ms
- Dispatch `banner-dismissed` event

---

## Modals/Dialogs

### Fleet Allocate Modal
**Selector**: `section[role="dialog"]` (id="_r_2f_")

**Structure**:
- **Header**: h1 with id="_r_2f_-label"
- **Close Button**: `button[class*="y082k13"]` with `#small-cross` icon
- **Footer**: Cancel button `y082k18 y082k16 y082k12`

**Behavior**:
- Toggle `aria-expanded` on open/close
- Close on button click, Escape key, backdrop click
- Restore focus to trigger element

---

## Quick Selectors

```javascript
const SIDEBAR = 'nav[data-test-id="sideMenuNav"]';
const HELP_BTN = 'button[data-test-id="helpCenter"]';
const COMPANY_SWITCHER = 'button[data-test-id="companySwitcher"]';
const VM_TABS = 'nav._7lkwi90 a';
const ADD_BUTTONS = 'button:has(span:contains("Add"))';
const SEARCH = 'input[name="search"]';
const BANNER = '[data-testid="notification-boundary-announcement-container"]';
const DIALOG = 'section[role="dialog"]';
```

---

## Custom Events

**Emit**:
- `sidebar-toggled`
- `help-toggle`
- `company-toggle`
- `tab-changed`
- `search`
- `add-notification-rule`
- `add-shared-view`
- `banner-dismissed`
- `dialog-opened`
- `dialog-closed`

**Listen Example**:
```javascript
document.addEventListener('search', (e) => {
  console.log(e.detail.query, e.detail.context);
});
```

