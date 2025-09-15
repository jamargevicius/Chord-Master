/* Chord Master PWA Service Worker */
const SW_VERSION = 'cm-pwa-v1-2025-09-15';
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
];

// External assets used by the app that we can precache
const EXTERNAL_PRECACHE = [
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js',
  'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    // Warm core cache
    const cache = await caches.open(APP_SHELL_CACHE);
    await cache.addAll(APP_SHELL.concat(EXTERNAL_PRECACHE));

    // Pre-warm Google font files referenced by the CSS
    try {
      const cssResp = await fetch(EXTERNAL_PRECACHE[3], { credentials: 'omit', mode: 'cors' });
      if (cssResp.ok) {
        const cssText = await cssResp.text();
        const fontUrls = Array.from(cssText.matchAll(/url\(([^)]+)\)/g))
          .map((m) => m[1].replace(/["']/g, ''))
          .filter((u) => u.startsWith('https://fonts.gstatic.com/'));
        const fontCache = await caches.open(FONT_CACHE);
        await Promise.all(fontUrls.map(async (u) => {
          try {
            const r = await fetch(u, { mode: 'cors', credentials: 'omit' });
            if (r.ok || r.type === 'opaque') await fontCache.put(u, r.clone());
          } catch (_) { /* ignore */ }
        }));
      }
    } catch (_) { /* ignore font warmup errors */ }

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

// Helper: Stale-while-revalidate for cross-origin css/js
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then((resp) => {
    if (resp && (resp.ok || resp.type === 'opaque')) cache.put(request, resp.clone());
    return resp;
  }).catch(() => cached);
  return cached || networkPromise;
}

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

  // Cross-origin: fonts and CDNs
  const isFontsCSS = url.hostname.includes('fonts.googleapis.com');
  const isFontsBin = url.hostname.includes('fonts.gstatic.com');
  const isCDN = url.hostname.includes('cdn.jsdelivr.net');

  if (isFontsBin) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }
  if (isFontsCSS || isCDN) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }
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

