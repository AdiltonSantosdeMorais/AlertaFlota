// Versão do cache atualizada para forçar a limpeza da memória nos celulares
const CACHE_NAME = 'alertaflota-v10';
const urlsToCache = [
  '/',
  '/templates/index.html',
  '/static/logo-elecnor.png',
  '/static/icon.png',
  '/static/manifest.json'
];

// Instalação do Service Worker e armazenamento do cache inicial
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache PWA renovado com sucesso!');
      return cache.addAll(urlsToCache);
    })
  );
  // Força o Service Worker novo a se tornar ativo imediatamente sem esperar as abas fecharem
  self.skipWaiting(); 
});

// Ativação e limpeza rígida de caches antigos de versões anteriores
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deletando memória de cache antiga:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle das páginas imediatamente
  );
});

// Estratégia de Fetch: Tenta buscar no Cache primeiro (para funcionar offline), se não encontrar, vai à Rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});