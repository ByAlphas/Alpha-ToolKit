# Changelog

All notable changes to Alpha Toolkit are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-03-15

### Added
- **78 browser-based developer tools** across 9 categories: Security & Crypto, Encoding & Decoding, JSON & Data, Text Tools, Web & URL, Image & QR, Code Tools, Converters, Generators
- **Modular JS architecture** — each tool's logic lives in its own `assets/js/tools/*.js` IIFE module
- **Service Worker** — full offline support with network-first for HTML, cache-first for assets; vendor libs and fonts precached on install
- **Self-hosted variable fonts** — Space Grotesk and JetBrains Mono served from `assets/fonts/` via `@font-face`; no Google Fonts CDN calls
- **QR tools fully offline** — `qrcode.min.js`, `jsQR.min.js`, `qrious.min.js` vendored locally under `assets/js/vendor/`
- **Global form controls** — unified CSS for `select`, `input[type="range"]` and `input[type="checkbox"]` across all 78 tools
- **Canonical + OG/Twitter meta tags** on all 78 tool pages and the homepage
- **`build.py` helper** — stdlib-only Python script for nav injection, meta tag generation and script migration across the entire site
- **`_includes/_nav.html`** — single source-of-truth nav partial injected into all pages via `build.py --nav`
- **`tests/smoke.html`** — browser-based smoke test runner covering core utility functions
- **Live search and category filter** on the hub page
- **Mega menu navigation** with all 78 tools accessible in one click
- **PWA manifest** for "Add to Home Screen" support
- **Responsive layout** for mobile and desktop
- **Zero external dependencies** — no frameworks, no analytics, no tracking

---

[1.0.0]: https://github.com/byalphas/alpha-toolkit/releases/tag/v1.0.0
