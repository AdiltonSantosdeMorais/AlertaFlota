// Atualizado para v12 para forçar os celulares a limparem a configuração anterior
const CACHE_NAME = 'alertaflota-v12';
const urlsToCache = [
  '/',                     // Esta é a rota principal que o Flask serve
  '/static/logo-elecnor.png',
  '/static/icon.png',
  '/static/manifest.json'
];

// Instalação do Service Worker e armazenamento das rotas essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Armazenando recursos para funcionamento offline...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); 
});

// Limpeza de caches antigos ao atualizar o aplicativo
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ESTRATÉGIA CACHE-FIRST (Com fallback para rede):
// Tenta buscar absolutamente TUDO no cache primeiro. Se o celular estiver sem internet,
// ele entrega o formulário e as imagens salvas na memória na hora, sem dar tela de erro.
self.addEventListener('fetch', event => {
  // Ignora requisições de envio do formulário (POST) e scripts externos (CDN do jsPDF)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Se encontrou no cache (HTML, Logo, Ícone), entrega imediatamente (Modo Offline Garantido)
        return cachedResponse;
      }

      // Se não estiver no cache, busca na rede e salva uma cópia dinamicamente
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Se a rede falhar e não houver cache, tenta entregar a raiz do app
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});