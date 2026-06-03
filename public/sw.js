/* Service Worker — Bitácora de Verano
 * Estrategia: app-shell con cache para navegación offline. Las peticiones a
 * Supabase NO se cachean (siempre van a la red para datos sensibles y frescos).
 */
const CACHE = 'bitacora-v1';
const APP_SHELL = ['/', '/offline', '/manifest.webmanifest', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // No interceptar APIs externas (Supabase) ni autenticación.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/auth')) return;

  // Navegación: red primero, cache de respaldo, página offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((r) => r || caches.match('/offline')),
        ),
    );
    return;
  }

  // Recursos estáticos: cache primero.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok && url.pathname.startsWith('/icons/')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        }),
    ),
  );
});
