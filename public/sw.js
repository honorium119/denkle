// Denkle Offline & PWA Service Worker
const CACHE_NAME = 'denkle-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Offline desteği ve tarayıcı PWA kriterini karşılama
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});