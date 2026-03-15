/* ═══════════════════════════════════════════════════════════════
   Alpha Toolkit — sw.js  (Service Worker)
   Strategy:
     · HTML pages  → Network-first, cache fallback
     · Static assets (CSS/JS/fonts/images) → Cache-first, network fallback
   Update cycle: bump CACHE_VERSION to evict old caches on next visit.
═══════════════════════════════════════════════════════════════ */

'use strict';

const CACHE_VERSION = 'v3';
const CACHE_NAME    = `alpha-toolkit-${CACHE_VERSION}`;

/* Core assets to precache on install */
const PRECACHE_ASSETS = [
  'index.html',
  '404.html',
  'style.css',
  'assets/images/favicon.svg',
  'assets/images/favicon-192.svg',
  'assets/images/favicon-512.svg',
  'manifest.json',
  /* Core JS */
  'assets/js/core/utils.js',
  'assets/js/core/nav.js',
  'assets/js/core/tools-data.js',
  'assets/js/pages/home.js',
  /* Self-hosted fonts */
  'assets/fonts/SpaceGrotesk.ttf',
  'assets/fonts/JetBrainsMono.ttf',
  'assets/fonts/JetBrainsMono-Italic.ttf',
  /* Vendor libraries (QR tools) */
  'assets/js/vendor/qrcode.min.js',
  'assets/js/vendor/jsQR.min.js',
  'assets/js/vendor/qrious.min.js',
];

/* ─── Install ────────────────────────────────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ─── Activate ───────────────────────────────────────────────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* ─── Fetch ──────────────────────────────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  /* Only handle GET requests */
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  /* Skip non-http(s) schemes (chrome-extension etc.) */
  if (!url.protocol.startsWith('http')) return;

  /* Only handle same-origin requests (fonts are now local) */
  if (url.origin !== self.location.origin) return;

  const isHTML = request.headers.get('accept')?.includes('text/html');

  /* ── HTML → Network-first ── */
  if (isHTML) {
    event.respondWith(networkFirst(request));
    return;
  }

  /* ── All other same-origin assets → Cache-first ── */
  event.respondWith(cacheFirst(request));
});

/* ─── Strategies ─────────────────────────────────────────────── */

/**
 * Network-first: try the network, cache the response, fall back to cache.
 * Falls back to 404.html when completely offline and no cache exists.
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match('404.html');
  }
}

/**
 * Cache-first: serve from cache if available, otherwise fetch, cache,
 * and return. Silently ignores non-OK responses (e.g. 404).
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 503, statusText: 'Service Unavailable' });
  }
}
