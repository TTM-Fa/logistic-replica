const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE = 'https://insights.transporeon.com';
const OUT = '/home/taha/Projects/logistic-replica/interactions';

// Pages to analyze — start with the lane overview, then do the rest
const pages = [
  { name: 'lane-overview', path: '/road/lanes/lane-overview/standard' },
  { name: 'lane-comparison', path: '/road/lanes/lane-comparison/standard' },
  { name: 'freight-perspectives', path: '/road/freight-perspectives' },
  { name: 'market-overview', path: '/road/market/overview' },
  { name: 'rates-overview', path: '/road/rates/overview' },
  { name: 'dashboards', path: '/road/dashboards' },
  { name: 'capacity', path: '/road/capacity' },
  { name: 'costs', path: '/road/costs' },
];

const cookieString = 'tpsso=ftplYU8pFxMvx96ZBLg28hXagq4nngjQ9k0fMbJRJ1NqOx46WFnAV1YAvvr3hbUh; tpsso_external=qbUQXsxDJx0M8IRpMre3JSVQxrIBiqCVK87ZFOOCFxO3pFM9Yx6WUbEoYaGjgZAz; LOCALE=en_US; sessionToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cGlfdXNlcl9lbWFpbCI6ImxvZ2lzdGljc0BzeW5kaWNhdGVncm91cC5jb20ucWEiLCJ0cGlfdXNlcmlkIjoiOTk2OTI1NiIsInRwaV9jdXN0b21lcmlkIjoiNjQ5MDQwIiwidHBpX2N1c3RvbWVyX25hbWUiOiJTeW5kaWNhdGUgTWFya2V0IiwidHBpX3VzZXJfZmlyc3RfbmFtZSI6IkFiZHVsYXppeiIsInRwaV91c2VyX2xhc3RfbmFtZSI6IkFsYWRiYSIsImlhdCI6MTc3NDUyMDY2MiwiZXhwIjoxNzc1NzMwMjYyfQ.6gN7YGP2EtNNiHrMZp1LqrjknY904Zj6E4HzpLB2Hyc';

const cookies = cookieString.split('; ').map(pair => {
  const [name, ...rest] = pair.split('=');
  return { name, value: rest.join('='), domain: '.transporeon.com', path: '/' };
});

// Helper: serialize the visible DOM state (element visibility, positions, text)
function serializeDOMState() {
  const state = {};

  function getClassName(el) {
    if (typeof el.className === 'string') return el.className;
    // SVG elements have className as SVGAnimatedString
    if (el.className && el.className.baseVal !== undefined) return el.className.baseVal;
    return el.getAttribute('class') || '';
  }

  // All elements with aria attributes (interactive markers)
  document.querySelectorAll('[aria-expanded], [aria-hidden], [aria-selected], [role="dialog"], [role="menu"], [role="listbox"], [role="tabpanel"]').forEach((el, i) => {
    const id = el.id || el.getAttribute('aria-controls') || getClassName(el).split(' ')[0] || `el_${i}`;
    state[`aria_${id}`] = {
      tagName: el.tagName,
      ariaExpanded: el.getAttribute('aria-expanded'),
      ariaHidden: el.getAttribute('aria-hidden'),
      ariaSelected: el.getAttribute('aria-selected'),
      display: getComputedStyle(el).display,
      visibility: getComputedStyle(el).visibility,
      opacity: getComputedStyle(el).opacity,
      classList: [...el.classList].join(' '),
      rect: el.getBoundingClientRect().toJSON(),
    };
  });

  // All elements with display:none or visibility:hidden (potential popups/dropdowns)
  document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"], .hidden, [hidden]').forEach((el, i) => {
    const id = el.id || getClassName(el).split(' ')[0] || `hidden_${i}`;
    state[`hidden_${id}`] = {
      tagName: el.tagName,
      display: getComputedStyle(el).display,
      visibility: getComputedStyle(el).visibility,
      innerHTML: el.innerHTML.substring(0, 200),
    };
  });

  return state;
}

// Helper: get diff between two states
function diffStates(before, after) {
  const changes = [];

  // New keys in after
  for (const key of Object.keys(after)) {
    if (!before[key]) {
      changes.push({ type: 'appeared', key, value: after[key] });
    } else {
      // Check for changed properties
      const b = before[key];
      const a = after[key];
      const changedProps = {};
      let hasChange = false;
      for (const prop of Object.keys(a)) {
        if (JSON.stringify(b[prop]) !== JSON.stringify(a[prop])) {
          changedProps[prop] = { from: b[prop], to: a[prop] };
          hasChange = true;
        }
      }
      if (hasChange) {
        changes.push({ type: 'changed', key, changes: changedProps });
      }
    }
  }

  // Removed keys
  for (const key of Object.keys(before)) {
    if (!after[key]) {
      changes.push({ type: 'disappeared', key, value: before[key] });
    }
  }

  return changes;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setCookie(...cookies);

  const allInteractions = {};

  for (const pg of pages) {
    const url = BASE + pg.path;
    console.log(`\n${'='.repeat(60)}`);
    console.log(`PAGE: ${pg.name} (${url})`);
    console.log('='.repeat(60));

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 4000));

      // Take baseline screenshot
      await page.screenshot({
        path: path.join(OUT, `${pg.name}-baseline.png`),
        fullPage: true,
      });

      // Phase 1: Catalog all interactive elements
      const interactiveElements = await page.evaluate(() => {
        const elements = [];
        const seen = new Set();

        // Buttons
        document.querySelectorAll('button').forEach((el, i) => {
          const key = el.outerHTML.substring(0, 100);
          if (seen.has(key)) return;
          seen.add(key);
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          elements.push({
            selector: el.id ? `#${el.id}` : `button:nth-of-type(${i + 1})`,
            type: 'button',
            text: el.textContent.trim().substring(0, 60),
            ariaExpanded: el.getAttribute('aria-expanded'),
            ariaControls: el.getAttribute('aria-controls'),
            ariaHaspopup: el.getAttribute('aria-haspopup'),
            role: el.getAttribute('role'),
            classes: [...el.classList].join(' '),
            rect: rect.toJSON(),
            outerHTML: el.outerHTML.substring(0, 300),
          });
        });

        // Inputs
        document.querySelectorAll('input, select, textarea').forEach((el, i) => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          elements.push({
            selector: el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}:nth-of-type(${i + 1})`,
            type: el.tagName.toLowerCase(),
            inputType: el.type,
            placeholder: el.placeholder,
            value: el.value,
            classes: [...el.classList].join(' '),
            rect: rect.toJSON(),
          });
        });

        // Tabs (role="tab")
        document.querySelectorAll('[role="tab"]').forEach((el, i) => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          elements.push({
            selector: el.id ? `#${el.id}` : `[role="tab"]:nth-of-type(${i + 1})`,
            type: 'tab',
            text: el.textContent.trim().substring(0, 60),
            ariaSelected: el.getAttribute('aria-selected'),
            ariaControls: el.getAttribute('aria-controls'),
            classes: [...el.classList].join(' '),
            rect: rect.toJSON(),
          });
        });

        // Clickable divs/spans with aria roles
        document.querySelectorAll('[role="menuitem"], [role="option"], [role="switch"], [role="checkbox"], [role="radio"], [tabindex="0"]').forEach((el, i) => {
          if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'INPUT') return;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          elements.push({
            selector: `[role="${el.getAttribute('role')}"]:nth-of-type(${i + 1})`,
            type: el.getAttribute('role') || 'clickable',
            text: el.textContent.trim().substring(0, 60),
            classes: [...el.classList].join(' '),
            rect: rect.toJSON(),
          });
        });

        return elements;
      });

      console.log(`\nFound ${interactiveElements.length} interactive elements:`);
      interactiveElements.forEach((el, i) => {
        console.log(`  [${i}] ${el.type}: "${el.text || el.placeholder || ''}" aria-expanded=${el.ariaExpanded} aria-controls=${el.ariaControls}`);
      });

      // Phase 2: Click each element and record DOM changes
      const interactions = [];

      for (let i = 0; i < interactiveElements.length; i++) {
        const el = interactiveElements[i];
        console.log(`\n  Clicking [${i}] ${el.type}: "${el.text || ''}"...`);

        try {
          // Capture DOM state before click
          const beforeState = await page.evaluate(serializeDOMState);

          // Take before screenshot
          const beforeShot = path.join(OUT, `${pg.name}-${i}-before.png`);

          // Click the element at its center coordinates
          const x = el.rect.x + el.rect.width / 2;
          const y = el.rect.y + el.rect.height / 2;

          if (x < 0 || y < 0 || x > 1920 || y > 1080) {
            console.log(`    Skipping - out of viewport (${x}, ${y})`);
            continue;
          }

          await page.mouse.click(x, y);
          await new Promise(r => setTimeout(r, 1500));

          // Capture DOM state after click
          const afterState = await page.evaluate(serializeDOMState);

          // Screenshot after click
          const afterShot = path.join(OUT, `${pg.name}-${i}-after.png`);
          await page.screenshot({ path: afterShot, fullPage: false });

          // Diff
          const diff = diffStates(beforeState, afterState);

          // Also check for new visible elements (popups, dropdowns, modals)
          const newVisible = await page.evaluate(() => {
            const results = [];
            // Check for any newly visible overlays, dropdowns, popovers
            document.querySelectorAll('[role="listbox"], [role="menu"], [role="dialog"], [role="tooltip"], [data-popper-placement], [class*="popover"], [class*="dropdown"], [class*="menu"], [class*="modal"], [class*="overlay"]').forEach(el => {
              const style = getComputedStyle(el);
              if (style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                  results.push({
                    tagName: el.tagName,
                    role: el.getAttribute('role'),
                    classes: [...el.classList].join(' '),
                    text: el.textContent.trim().substring(0, 200),
                    rect: rect.toJSON(),
                    innerHTML: el.innerHTML.substring(0, 500),
                  });
                }
              }
            });
            return results;
          });

          const interaction = {
            elementIndex: i,
            elementType: el.type,
            elementText: el.text || el.placeholder || '',
            elementClasses: el.classes,
            ariaExpanded: el.ariaExpanded,
            ariaControls: el.ariaControls,
            ariaHaspopup: el.ariaHaspopup,
            clickCoords: { x, y },
            domChanges: diff.length,
            changes: diff,
            newVisibleElements: newVisible,
            screenshotAfter: afterShot,
          };

          interactions.push(interaction);

          if (diff.length > 0 || newVisible.length > 0) {
            console.log(`    ✓ ${diff.length} DOM changes, ${newVisible.length} new visible elements`);
            diff.forEach(d => {
              if (d.type === 'changed' && d.changes) {
                const props = Object.keys(d.changes).map(p => `${p}: ${d.changes[p].from} → ${d.changes[p].to}`).join(', ');
                console.log(`      ${d.type}: ${d.key} | ${props}`);
              }
            });
            newVisible.forEach(v => {
              console.log(`      NEW VISIBLE: <${v.tagName}> role=${v.role} classes="${v.classes}" text="${v.text.substring(0, 80)}"`);
            });
          } else {
            console.log(`    - No visible changes`);
          }

          // Reset: click elsewhere to close any popup, then navigate back if needed
          await page.mouse.click(10, 10);
          await new Promise(r => setTimeout(r, 800));

          // Press Escape to close any modal/dropdown
          await page.keyboard.press('Escape');
          await new Promise(r => setTimeout(r, 500));

        } catch (err) {
          console.log(`    ✗ Error: ${err.message}`);
          interactions.push({
            elementIndex: i,
            elementType: el.type,
            elementText: el.text || '',
            error: err.message,
          });
        }
      }

      // Phase 3: Also check hover interactions
      console.log('\n  Checking hover effects...');
      const hoverResults = [];
      for (let i = 0; i < Math.min(interactiveElements.length, 30); i++) {
        const el = interactiveElements[i];
        const x = el.rect.x + el.rect.width / 2;
        const y = el.rect.y + el.rect.height / 2;
        if (x < 0 || y < 0 || x > 1920 || y > 1080) continue;

        try {
          await page.mouse.move(x, y);
          await new Promise(r => setTimeout(r, 600));

          const tooltip = await page.evaluate(() => {
            const tips = document.querySelectorAll('[role="tooltip"], [class*="tooltip"], [data-popper-placement]');
            const visible = [];
            tips.forEach(t => {
              const s = getComputedStyle(t);
              const r = t.getBoundingClientRect();
              if (s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0) {
                visible.push({
                  text: t.textContent.trim().substring(0, 200),
                  classes: [...t.classList].join(' '),
                });
              }
            });
            return visible;
          });

          if (tooltip.length > 0) {
            hoverResults.push({
              elementIndex: i,
              elementText: el.text || '',
              tooltips: tooltip,
            });
            console.log(`    Hover [${i}] "${el.text || ''}" → tooltip: "${tooltip[0].text.substring(0, 60)}"`);
          }
        } catch (e) {}
      }

      allInteractions[pg.name] = {
        url: url,
        elements: interactiveElements,
        interactions: interactions,
        hoverEffects: hoverResults,
      };

      console.log(`\n  Summary: ${interactions.filter(i => i.domChanges > 0 || (i.newVisibleElements && i.newVisibleElements.length > 0)).length} interactions with visible effects out of ${interactions.length} clicks`);

    } catch (e) {
      console.error(`  PAGE ERROR: ${e.message}`);
    }
  }

  // Save the full interaction catalog
  fs.writeFileSync(
    path.join(OUT, 'interaction-catalog.json'),
    JSON.stringify(allInteractions, null, 2)
  );
  console.log(`\n${'='.repeat(60)}`);
  console.log('DONE! Interaction catalog saved to interactions/interaction-catalog.json');

  // Generate a human-readable summary
  let summary = '# Interaction Discovery Report\n\n';
  for (const [pageName, data] of Object.entries(allInteractions)) {
    summary += `## ${pageName}\n`;
    summary += `URL: ${data.url}\n`;
    summary += `Total interactive elements: ${data.elements.length}\n\n`;

    const effectiveInteractions = data.interactions.filter(
      i => i.domChanges > 0 || (i.newVisibleElements && i.newVisibleElements.length > 0)
    );

    if (effectiveInteractions.length > 0) {
      summary += '### Interactions with visible effects\n\n';
      summary += '| # | Type | Text | Effect |\n';
      summary += '|---|------|------|--------|\n';
      for (const int of effectiveInteractions) {
        const effects = [];
        if (int.changes) {
          int.changes.forEach(c => {
            if (c.type === 'changed' && c.changes) {
              for (const [prop, val] of Object.entries(c.changes)) {
                effects.push(`${prop}: ${val.from}→${val.to}`);
              }
            }
          });
        }
        if (int.newVisibleElements) {
          int.newVisibleElements.forEach(v => {
            effects.push(`Opens: <${v.tagName}> role=${v.role} "${v.text.substring(0, 40)}"`);
          });
        }
        summary += `| ${int.elementIndex} | ${int.elementType} | ${int.elementText.substring(0, 30)} | ${effects.join('; ').substring(0, 100)} |\n`;
      }
    }

    if (data.hoverEffects.length > 0) {
      summary += '\n### Hover effects\n\n';
      data.hoverEffects.forEach(h => {
        summary += `- Element [${h.elementIndex}] "${h.elementText}" → Tooltip: "${h.tooltips[0].text.substring(0, 80)}"\n`;
      });
    }

    summary += '\n---\n\n';
  }

  fs.writeFileSync(path.join(OUT, 'discovery-report.md'), summary);
  console.log('Report saved to interactions/discovery-report.md');

  await browser.close();
})();
