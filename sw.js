// Versão do cache atualizada para v11 para forçar a limpeza imediata nos aparelhos
const CACHE_NAME = 'alertaflota-v11';
const urlsToCache = [
  '/',
  '/templates/index.html',
  '/static/logo-elecnor.png',
  '/static/icon.png',
  '/static/manifest.json'
];

// Instalação do Service Worker e armazenamento do cache inicial rápido
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache PWA renovado e otimizado!');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); 
});

// Limpeza rígida e imediata de caches antigos de versões anteriores
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
    }).then(() => self.clients.claim())
  );
});

// ESTRATÉGIA OTIMIZADA (UltraVeloz):
// Se for o Manifesto ou o Ícone, busca na REDE primeiro para disparar a instalação na hora.
// Se for o HTML ou as logos normais, busca no CACHE primeiro (garante o funcionamento offline).
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  if (url.pathname.includes('manifest.json') || url.pathname.includes('icon.png')) {
    // Força ir buscar direto no servidor para o celular validar o App na hora
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    // Para o resto do formulário, usa o cache para abrir instantâneo mesmo sem internet
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});