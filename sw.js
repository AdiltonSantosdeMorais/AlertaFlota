const CACHE_NAME = 'alertaflota-v3';
const urlsToCache = [
  '/',
  '/templates/index.html',
  '/static/logo-elecnor.png',
  '/static/icon.png',
  '/static/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});