# Transporeon Visibility - Interactions Implementation

## 📚 Documentation Index

This folder contains a complete audit and implementation guide for all interactive elements across 9 HTML pages.

### Files in This Package

#### 1. **interactions.js** (Production Code)
- 488 lines of JavaScript
- 10 classes handling different interaction types
- Ready to include in HTML pages
- Auto-initializes on DOMContentLoaded
- Dispatches custom events for backend integration

**What it does:**
- Manages sidebar navigation (collapse, active page)
- Handles header action buttons (help, company switcher)
- Controls tab interfaces (vehicle-management, data-network)
- Processes "Add" button clicks
- Handles search input with debounce
- Manages notification banner dismissal
- Controls modal dialogs (open/close/focus)

**Usage:**
```html
<script src="interactions.js"></script>
```

#### 2. **INTERACTIONS_REFERENCE.md** (Quick Reference)
- 158 lines of quick lookup information
- Selector cheat sheet
- Custom event examples
- Button class reference
- Testing checklist
- CSS classes breakdown

**Best for:** Quickly finding selectors, event listeners, or testing steps

#### 3. **README_INTERACTIONS.md** (Complete Guide)
- 438 lines with full documentation
- Implementation details for each component
- Element count and statistics
- CSS class hierarchy
- Integration examples
- Troubleshooting guide

**Best for:** Understanding the complete implementation, setting up events, debugging

---

## 🎯 What Was Audited

### All 9 HTML Pages
✅ index.html  
✅ analytics.html  
✅ fleet.html  
✅ data-network.html  
✅ dashboards.html  
✅ transports.html  
✅ vehicle-management.html  
✅ notifications.html  
✅ shared-views.html

### Interactive Elements Found: 50+

**Sidebar Navigation**
- 8 navigation items (same on all pages)
- Collapse/expand button
- Active page indicator (aria-current)

**Header Buttons**
- Help button (opens dialog)
- Company switcher (opens dropdown)

**Tab Interfaces**
- Vehicle Management: 4 tabs
- Data Network: 2 tabs

**Buttons**
- Add notification rule
- Add shared view
- Add GPS integration
- Invite carriers

**Search Inputs**
- Vehicle Management search
- Fleet search
- Data Network search
- Transports search

**Notification Banner**
- GPS visibility message
- Dismissible with animation

**Modals/Dialogs**
- Fleet allocate modal
- Dialog focus management

---

## 🚀 Getting Started

### Step 1: Include the Script
Add to the `<head>` or before `</body>` in all HTML files:
```html
<script src="interactions.js"></script>
```

### Step 2: Verify Elements
Open browser DevTools and test:
```javascript
// Check sidebar exists
document.querySelector('nav[data-test-id="sideMenuNav"]')

// Check help button
document.querySelector('button[data-test-id="helpCenter"]')

// Check search input
document.querySelector('input[name="search"]')
```

### Step 3: Listen for Events
```javascript
// Search event
document.addEventListener('search', (e) => {
  console.log('Query:', e.detail.query);
  // Make API call, filter results, etc.
});

// Add button events
document.addEventListener('add-notification-rule', () => {
  // Show form/modal
});

// Navigation event
document.addEventListener('sidebar-toggled', (e) => {
  console.log('Collapsed:', e.detail.collapsed);
});
```

### Step 4: Test Everything
Use the testing checklist in INTERACTIONS_REFERENCE.md:
- [ ] Navigation links work
- [ ] Tabs switch correctly
- [ ] Buttons dispatch events
- [ ] Search debounces
- [ ] Banner dismisses smoothly
- [ ] Dialog opens/closes properly

---

## 📖 How to Use These Docs

### For Quick Lookups
→ Use **INTERACTIONS_REFERENCE.md**
- Need a selector? Find it in the cheat sheet
- Want to test an element? Use the testing checklist
- Looking for a button class? Check the reference table

### For Understanding Implementation
→ Use **README_INTERACTIONS.md**
- How does search work? Read the Search section
- What's the dialog structure? Check the Modals section
- How do I integrate with my backend? See Integration section

### For Code Implementation
→ Use **interactions.js**
- Already includes all functionality
- Just include the file and it works
- Customize by listening to custom events
- Modify classes if needed for your environment

---

## 🔑 Key Selectors (Cheat Sheet)

```javascript
// Navigation
const sidebar = 'nav[data-test-id="sideMenuNav"]';
const activeNav = 'nav[data-test-id="sideMenuNav"] a[aria-current="true"]';
const collapseBtn = 'button[aria-controls="_r_1_"]';

// Header
const helpBtn = 'button[data-test-id="helpCenter"]';
const companySwitcher = 'button[data-test-id="companySwitcher"]';

// Tabs
const vmTabs = 'nav._7lkwi90 a';
const activeTab = 'nav._7lkwi90 a[aria-current="true"]';

// Buttons
const addButtons = 'button:has(span:contains("Add"))';

// Inputs
const searchInput = 'input[name="search"]';

// Banner
const banner = '[data-testid="notification-boundary-announcement-container"]';
const dismissBtn = 'button.glb6s89';

// Dialogs
const dialog = 'section[role="dialog"]';
const closeBtn = 'section[role="dialog"] button[class*="y082k13"]';
```

---

## 🎨 CSS Classes by Function

### Navigation Classes
```
_1gaf6f33 _1gaf6f32  - Sidebar nav container
_157irlc0           - List wrapper
_1gaf6f3e           - Nav link
_1gaf6f3k           - Icon wrapper
```

### Button Classes
```
y082k11             - Base button
y082k19             - Primary/green style
y082k18             - Secondary/gray style
y082k15             - Medium size
y082k16             - Large size
y082k12             - Border variant
y082k13             - Icon button variant
```

### Tab Classes
```
_7lkwi90            - Tab nav container
_7lkwi91            - Tab list (ul)
_7lkwi95            - Tab link
_7lkwi93            - Active tab indicator
```

### Search Classes
```
ws6vko0             - Search container
_1u3y7067           - Input element
_1u3y7065           - Search icon
_1u3y7064           - Icon wrapper
```

---

## 🔌 Custom Events

### Events Dispatched by interactions.js

```javascript
// Navigation
'sidebar-toggled'        → { collapsed: true/false }

// Buttons
'help-toggle'           → { isOpen: true/false }
'company-toggle'        → { isOpen: true/false }
'tab-changed'           → { tab: "Name", url: "..." }

// Add buttons
'add-notification-rule'
'add-shared-view'
'add-gps-integration'

// Input
'search'                → { query: "...", context: "transports" }

// Banner
'banner-dismissed'      → { action: "Connect your vehicles" }

// Dialogs
'dialog-opened'         → { dialogId: "_r_2f_" }
'dialog-closed'         → { dialogId: "_r_2f_" }
```

### Listen to Events Example

```javascript
// Search
document.addEventListener('search', (e) => {
  const { query, context } = e.detail;
  fetch(`/api/search?q=${query}&type=${context}`)
    .then(r => r.json())
    .then(results => updateUI(results));
});

// Add notification
document.addEventListener('add-notification-rule', () => {
  showModal('notification-form');
});

// Tab changed
document.addEventListener('tab-changed', (e) => {
  console.log(`Switched to ${e.detail.tab}`);
  updateContent(e.detail.url);
});
```

---

## 🧪 Testing Checklist

### Navigation ✓
- [ ] Click each nav link → navigates correctly
- [ ] Page reload → active nav item updates
- [ ] Click collapse button → aria-expanded toggles
- [ ] Visual feedback on active item

### Buttons ✓
- [ ] Help button → aria-expanded toggles
- [ ] Company switcher → aria-expanded toggles
- [ ] Add buttons → dispatch correct events
- [ ] Buttons have correct styling

### Tabs ✓
- [ ] Click tab → aria-current updates
- [ ] Active tab → has class _7lkwi93
- [ ] Tab switch → navigates to URL

### Search ✓
- [ ] Type in search → debounce 300ms
- [ ] Press Enter → search event fires
- [ ] Event includes query & context

### Banner ✓
- [ ] Page load → banner visible
- [ ] Click dismiss → fades out smoothly
- [ ] After close → space collapses

### Dialog ✓
- [ ] Click trigger → dialog appears
- [ ] Click close button → dialog disappears
- [ ] Press Escape → dialog closes
- [ ] Click outside → dialog closes (if applicable)
- [ ] After close → focus returns to button

---

## 📊 Implementation Statistics

| Aspect | Count |
|--------|-------|
| Pages audited | 9 |
| Navigation items | 8 |
| Header buttons | 2 |
| Tab groups | 2 |
| Tab items | 6 |
| Search inputs | 4 |
| Add buttons | 8+ |
| Notification banners | 9 |
| Dialog types | 1+ |
| **Total interactive elements** | **50+** |
| **CSS selectors documented** | **30+** |
| **Custom events** | **10** |
| **Lines of JavaScript** | **488** |

---

## 🔗 File Structure

```
/site/
├── interactions.js                    [PRODUCTION CODE]
├── INTERACTIONS_REFERENCE.md          [QUICK LOOKUP]
├── README_INTERACTIONS.md             [FULL GUIDE]
├── INDEX.md                           [THIS FILE]
│
├── index.html
├── analytics.html
├── fleet.html
├── data-network.html
├── dashboards.html
├── transports.html
├── vehicle-management.html
├── notifications.html
└── shared-views.html
```

---

## �� Troubleshooting

**Q: Search not working?**
A: Verify `input[name="search"]` exists. Check that event listener is attached. Look in browser console for errors.

**Q: Navigation not updating?**
A: Check `aria-current` attribute. Verify page filename. Look for JavaScript errors.

**Q: Button events not firing?**
A: Confirm element exists with correct selector. Verify event listener is attached. Check preventDefault() if needed.

**Q: Tab switching not working?**
A: Verify `nav._7lkwi90` exists. Check `aria-current` updates. Verify href is correct.

**Q: Dialog not closing?**
A: Check close button has correct classes. Verify Escape listener is attached. Ensure role="dialog" is present.

See **README_INTERACTIONS.md** troubleshooting section for more details.

---

## 📞 Support

**For selector questions:** → See INTERACTIONS_REFERENCE.md  
**For implementation help:** → See README_INTERACTIONS.md  
**For usage examples:** → See interactions.js comments  
**For testing guidance:** → See INTERACTIONS_REFERENCE.md testing checklist  

---

## ✅ Completion Checklist

- [x] All 9 pages audited
- [x] 50+ interactive elements documented
- [x] 30+ CSS selectors identified
- [x] interactions.js created (488 lines)
- [x] Reference documentation created
- [x] Implementation guide created
- [x] Code comments added
- [x] Examples provided
- [x] Testing checklist created
- [x] Ready for production use

**Status:** READY TO IMPLEMENT ✅

---

**Generated:** 2024  
**Scope:** 9 HTML pages, Transporeon Visibility site  
**Complexity:** Medium (good structure, well-documented)  
**Time to implement:** ~30-60 minutes (including testing)

