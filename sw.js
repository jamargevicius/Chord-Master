/* Piano Practice PWA Service Worker - v3 Clean Slate */
const SW_VERSION = 'cm-pwa-v3.0.0-clean-slate';
const APP_SHELL_CACHE = `app-shell-${SW_VERSION}`;
const RUNTIME_CACHE = `runtime-${SW_VERSION}`;
const FONT_CACHE = `font-${SW_VERSION}`;
const AUDIO_CACHE = `audio-${SW_VERSION}`;

// Core files to precache (relative to scope)
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  // Core CSS/JS assets
  './assets/fonts/fonts.css',
  './assets/css/main.css',
  './assets/js/app.js',
  // EB Garamond Fonts (woff2 only)
  './assets/fonts/SlGUmQSNjdsmc35JDF1K5GR1SDk_YAPI.woff2',
  './assets/fonts/SlGUmQSNjdsmc35JDF1K5GR2SDk_YAPIlWk.woff2',
  './assets/fonts/SlGUmQSNjdsmc35JDF1K5GR4SDk_YAPIlWk.woff2',
  './assets/fonts/SlGUmQSNjdsmc35JDF1K5GR5SDk_YAPIlWk.woff2',
  './assets/fonts/SlGUmQSNjdsmc35JDF1K5GR6SDk_YAPIlWk.woff2',
  './assets/fonts/SlGUmQSNjdsmc35JDF1K5GR7SDk_YAPIlWk.woff2',
  './assets/fonts/SlGUmQSNjdsmc35JDF1K5GRxSDk_YAPIlWk.woff2',
  './assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7W0Q5n-wU.woff2',
  './assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7W0Q5n-wU.woff2',
  './assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2',
  './assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7W0Q5n-wU.woff2',
  './assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7W0Q5n-wU.woff2',
  './assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7W0Q5n-wU.woff2',
  './assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7W0Q5n-wU.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    // Warm core cache with all local assets
    const cache = await caches.open(APP_SHELL_CACHE);
    await cache.addAll(APP_SHELL);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Clean old caches
    const names = await caches.keys();
    await Promise.all(names.filter((n) => ![APP_SHELL_CACHE, RUNTIME_CACHE, FONT_CACHE, AUDIO_CACHE].includes(n)).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

// Helper: Cache-first fetch
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreVary: true, ignoreSearch: false });
  if (cached) return cached;
  try {
    const resp = await fetch(request);
    if (resp && (resp.ok || resp.type === 'opaque')) cache.put(request, resp.clone());
    return resp;
  } catch (e) {
    return cached || Promise.reject(e);
  }
}

// (No cross-origin caching needed; all assets are local)

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Handle navigations: serve app shell
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      // Try network, fallback to cached app shell
      try {
        const resp = await fetch(request);
        // Optionally, update cache with latest index
        const cache = await caches.open(APP_SHELL_CACHE);
        cache.put('./index.html', resp.clone());
        return resp;
      } catch (_) {
        const cache = await caches.open(APP_SHELL_CACHE);
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Same-origin static assets: cache-first
  if (url.origin === self.location.origin) {
    if (request.destination === 'document') {
      event.respondWith(cacheFirst(request, APP_SHELL_CACHE));
    } else if (['style', 'script', 'image', 'font'].includes(request.destination)) {
      event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    } else if (url.pathname.includes('/audio/piano/')) {
      // Cache audio files
      event.respondWith(cacheFirst(request, AUDIO_CACHE));
    }
    return;
  }

  // All required assets are same-origin and precached.
  // Default: try network then fallback to cache
  event.respondWith((async () => {
    try {
      return await fetch(request);
    } catch (_) {
      const cache = await caches.open(RUNTIME_CACHE);
      const match = await cache.match(request);
      return match || new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
});
