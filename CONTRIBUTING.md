# Contributing to Alpha Toolkit

Thank you for your interest in contributing. This document covers everything you need to know to get started.

---

## Ground Rules

- All code, comments, and documentation must be in **English**.
- Tools must be **100% client-side** — no server requests, no telemetry, no external dependencies.
- No npm, no bundlers, no build pipelines. Pure HTML + CSS + Vanilla JS only.
- Every tool must work **offline** after the first load (Service Worker handles caching).

---

## Ways to Contribute

### Reporting a Bug

1. Check [existing issues](https://github.com/byalphas/alpha-toolkit/issues) first.
2. Open a new issue using the **Bug Report** template.
3. Include: browser + version, steps to reproduce, expected vs actual behaviour.

### Requesting a Feature or New Tool

Open an issue using the **Feature Request** template. Describe the tool, its use case, and why it belongs in a client-side toolkit.

### Submitting a Pull Request

1. Fork the repository and create a branch from `main`.
2. Follow the structure described below.
3. Test in at least one Chromium-based browser and Firefox.
4. Open a PR — keep the description concise and focused.

---

## Adding a New Tool

### 1. Create the HTML page

Copy an existing tool page (e.g. `tools/base64.html`) as your starting point.

Required head elements:
```html
<meta name="description" content="One-sentence description." />
<link rel="canonical" href="https://byalphas.github.io/alpha-toolkit/tools/your-tool.html" />
<meta property="og:title" content="Tool Name — Alpha Toolkit" />
<meta property="og:description" content="One-sentence description." />
<meta property="og:url" content="https://byalphas.github.io/alpha-toolkit/tools/your-tool.html" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Alpha Toolkit" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="Tool Name — Alpha Toolkit" />
<meta name="twitter:description" content="One-sentence description." />
```

Required script tags (at end of `<body>`):
```html
<script src="../assets/js/core/utils.js" defer></script>
<script src="../assets/js/core/nav.js" defer></script>
<script src="../assets/js/tools/your-tool.js" defer></script>
```

### 2. Create the JS module

Create `assets/js/tools/your-tool.js`. Wrap all logic in an IIFE:

```javascript
(function initYourTool() {
  'use strict';

  // your tool logic here
  // use showToast(), copyToClipboard() from utils.js
})();
```

### 3. Register the tool in tools-data.js

Add an entry to the `TOOLS_DATA` array in `assets/js/core/tools-data.js`:

```javascript
{
  name: 'Your Tool Name',
  slug: 'your-tool',
  cat: 'category-id',        // security | encoding | json | text | web | image | code | converter | generator
  catLabel: 'Category Name',
  desc: 'Short description shown on the hub card.',
  tags: ['tag1', 'tag2', 'tag3'],
  icon: '<svg ...>...</svg>',
},
```

### 4. Update the navigation

Add the tool to the mega menu and mobile nav in **both** `index.html` and `_includes/_nav.html`, then run:

```bash
python build.py --nav
```

This injects the updated nav into all 78+ tool pages automatically.

### 5. Update the sitemap

Add a `<url>` entry to `sitemap.xml`:

```xml
<url>
  <loc>https://byalphas.github.io/alpha-toolkit/tools/your-tool.html</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 6. Update the tool count

Search the project for the number `78` and increment every occurrence to `79` (titles, meta descriptions, footer, hub headings, README, tools-data.js comment).

---

## Code Style

- **JavaScript**: ES2020+, no transpilation, IIFE modules, `'use strict'`
- **CSS**: CSS custom properties for all colours and spacing; no hardcoded values where a variable exists
- **HTML**: Semantic elements, ARIA labels on interactive controls, `alt` on all images
- **Indentation**: 2 spaces everywhere

---

## Build Helper

`build.py` is a stdlib-only Python script for maintaining consistency across all pages:

| Flag | What it does |
|------|-------------|
| `--nav` | Injects `_includes/_nav.html` into all pages between `<!-- NAV:START -->` and `<!-- NAV:END -->` |
| `--meta` | Adds canonical + OG/Twitter tags to tool pages that are missing them |
| `--scripts` | Migrates legacy `script.js` references to the modular pattern |
| `--all` | Runs all three passes |

Run it before every deploy if you've changed the navigation.

---

## Commit Message Style

```
type: short imperative description

Examples:
feat: add hex to RGB converter tool
fix: correct HMAC key encoding in hmac.js
docs: update contributing guide
style: normalise button padding in components.css
```

---

## Questions?

Open an issue or reach out via [GitHub](https://github.com/byalphas).
