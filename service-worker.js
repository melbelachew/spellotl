/* Spellotl service worker
 *
 * Strategy:
 *   - Precache the app shell (HTML, manifest, icons) on install.
 *   - For navigation requests, try the network first so updates are picked up,
 *     and fall back to the cached index.html offline.
 *   - For same-origin static assets (the hashed JS/CSS CRA produces), use a
 *     cache-first strategy with background refresh. Hashed filenames are
 *     immutable, so this is safe and gives instant repeat loads.
 *   - On activate, clean up old caches keyed by version.
 *
 * Bump CACHE_VERSION whenever you ship a change that should invalidate clients.
 */
const CACHE_VERSION = 'v1';
const SHELL_CACHE = `spellotl-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `spellotl-runtime-${CACHE_VERSION}`;

// Paths are relative to the service worker's scope, which is /spellotl/
// (because we register it from /spellotl/service-worker.js).
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)),
  );
  // Activate the new SW as soon as it's installed.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

// Allow the page to tell the SW to activate immediately (used by the
// update-available prompt).
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GETs. POSTs etc go straight to the network.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Don't cache cross-origin requests (analytics, CDN fonts, etc.).
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first, fall back to cached index.html.
  // This is what makes the app launch and deep links work offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          // Keep the index in cache fresh.
          const cache = await caches.open(SHELL_CACHE);
          cache.put('./index.html', fresh.clone());
          return fresh;
        } catch (err) {
          const cache = await caches.open(SHELL_CACHE);
          const cached = await cache.match('./index.html');
          return cached || Response.error();
        }
      })(),
    );
    return;
  }

  // Static assets: cache-first with background refresh (stale-while-revalidate).
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      const networkFetch = fetch(request)
        .then((response) => {
          // Only cache successful, basic (same-origin) responses.
          if (response && response.status === 200 && response.type === 'basic') {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => undefined);
      return cached || (await networkFetch) || Response.error();
    })(),
  );
});
