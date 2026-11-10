const offlineUrl = new URL('offline.html', self.registration.scope).href;
const cacheName = `kodeo-offline-v1:${self.registration.scope}`;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.add(offlineUrl)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate' || event.request.method !== 'GET' ||
      !event.request.url.startsWith(self.registration.scope)) return;
  // Always try the network so a newly published build replaces the old UI.
  event.respondWith(fetch(event.request).catch(async () => (await caches.match(offlineUrl)) ?? Response.error()));
});
