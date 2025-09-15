/* Chord Master PWA Service Worker */
const SW_VERSION = 'cm-pwa-v2-2025-09-15';
const APP_SHELL_CACHE = `app-shell-${SW_VERSION}`;
const RUNTIME_CACHE = `runtime-${SW_VERSION}`;
const FONT_CACHE = `font-${SW_VERSION}`;

// Known core files to precache (relative to scope)
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  // Local CSS/JS assets
  './assets/fonts/fonts.css',
  './assets/katex/katex.min.css',
  './assets/katex/katex.min.js',
  './assets/katex/auto-render.min.js',
  // Local Google Fonts (woff2)
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
  // Local KaTeX fonts
  './assets/katex/fonts/KaTeX_AMS-Regular.ttf',
  './assets/katex/fonts/KaTeX_AMS-Regular.woff',
  './assets/katex/fonts/KaTeX_AMS-Regular.woff2',
  './assets/katex/fonts/KaTeX_Caligraphic-Bold.ttf',
  './assets/katex/fonts/KaTeX_Caligraphic-Bold.woff',
  './assets/katex/fonts/KaTeX_Caligraphic-Bold.woff2',
  './assets/katex/fonts/KaTeX_Caligraphic-Regular.ttf',
  './assets/katex/fonts/KaTeX_Caligraphic-Regular.woff',
  './assets/katex/fonts/KaTeX_Caligraphic-Regular.woff2',
  './assets/katex/fonts/KaTeX_Fraktur-Bold.ttf',
  './assets/katex/fonts/KaTeX_Fraktur-Bold.woff',
  './assets/katex/fonts/KaTeX_Fraktur-Bold.woff2',
  './assets/katex/fonts/KaTeX_Fraktur-Regular.ttf',
  './assets/katex/fonts/KaTeX_Fraktur-Regular.woff',
  './assets/katex/fonts/KaTeX_Fraktur-Regular.woff2',
  './assets/katex/fonts/KaTeX_Main-Bold.ttf',
  './assets/katex/fonts/KaTeX_Main-Bold.woff',
  './assets/katex/fonts/KaTeX_Main-Bold.woff2',
  './assets/katex/fonts/KaTeX_Main-BoldItalic.ttf',
  './assets/katex/fonts/KaTeX_Main-BoldItalic.woff',
  './assets/katex/fonts/KaTeX_Main-BoldItalic.woff2',
  './assets/katex/fonts/KaTeX_Main-Italic.ttf',
  './assets/katex/fonts/KaTeX_Main-Italic.woff',
  './assets/katex/fonts/KaTeX_Main-Italic.woff2',
  './assets/katex/fonts/KaTeX_Main-Regular.ttf',
  './assets/katex/fonts/KaTeX_Main-Regular.woff',
  './assets/katex/fonts/KaTeX_Main-Regular.woff2',
  './assets/katex/fonts/KaTeX_Math-BoldItalic.ttf',
  './assets/katex/fonts/KaTeX_Math-BoldItalic.woff',
  './assets/katex/fonts/KaTeX_Math-BoldItalic.woff2',
  './assets/katex/fonts/KaTeX_Math-Italic.ttf',
  './assets/katex/fonts/KaTeX_Math-Italic.woff',
  './assets/katex/fonts/KaTeX_Math-Italic.woff2',
  './assets/katex/fonts/KaTeX_SansSerif-Bold.ttf',
  './assets/katex/fonts/KaTeX_SansSerif-Bold.woff',
  './assets/katex/fonts/KaTeX_SansSerif-Bold.woff2',
  './assets/katex/fonts/KaTeX_SansSerif-Italic.ttf',
  './assets/katex/fonts/KaTeX_SansSerif-Italic.woff',
  './assets/katex/fonts/KaTeX_SansSerif-Italic.woff2',
  './assets/katex/fonts/KaTeX_SansSerif-Regular.ttf',
  './assets/katex/fonts/KaTeX_SansSerif-Regular.woff',
  './assets/katex/fonts/KaTeX_SansSerif-Regular.woff2',
  './assets/katex/fonts/KaTeX_Script-Regular.ttf',
  './assets/katex/fonts/KaTeX_Script-Regular.woff',
  './assets/katex/fonts/KaTeX_Script-Regular.woff2',
  './assets/katex/fonts/KaTeX_Size1-Regular.ttf',
  './assets/katex/fonts/KaTeX_Size1-Regular.woff',
  './assets/katex/fonts/KaTeX_Size1-Regular.woff2',
  './assets/katex/fonts/KaTeX_Size2-Regular.ttf',
  './assets/katex/fonts/KaTeX_Size2-Regular.woff',
  './assets/katex/fonts/KaTeX_Size2-Regular.woff2',
  './assets/katex/fonts/KaTeX_Size3-Regular.ttf',
  './assets/katex/fonts/KaTeX_Size3-Regular.woff',
  './assets/katex/fonts/KaTeX_Size3-Regular.woff2',
  './assets/katex/fonts/KaTeX_Size4-Regular.ttf',
  './assets/katex/fonts/KaTeX_Size4-Regular.woff',
  './assets/katex/fonts/KaTeX_Size4-Regular.woff2',
  './assets/katex/fonts/KaTeX_Typewriter-Regular.ttf',
  './assets/katex/fonts/KaTeX_Typewriter-Regular.woff',
  './assets/katex/fonts/KaTeX_Typewriter-Regular.woff2',
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
    await Promise.all(names.filter((n) => ![APP_SHELL_CACHE, RUNTIME_CACHE, FONT_CACHE].includes(n)).map((n) => caches.delete(n)));
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
