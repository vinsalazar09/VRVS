// Service Worker para VRVS - Funcionamento Offline
const CACHE_NAME = "vrvs-v5.2.0";

// Arquivos essenciais para cache
const FILES_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './logo.png',
    './favicon.ico'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Fazendo cache dos arquivos');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
    // Ignorar requisições não-GET
    if (event.request.method !== 'GET') {
        return;
    }

    // Ignorar requisições de API externas (mas permitir CDNs)
    const url = new URL(event.request.url);
    if (url.origin !== location.origin && 
        !url.href.includes('cdn.jsdelivr.net')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Retornar do cache se disponível
            if (response) {
                return response;
            }

            // Buscar da rede
            return fetch(event.request).then((response) => {
                // Se falhar ou não for sucesso, retornar como está
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clonar resposta para cache
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Se offline e for página HTML, retornar index.html do cache
                if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

// Sincronização em background quando voltar online
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    // Aqui você pode adicionar lógica para sincronizar dados quando voltar online
    console.log('[Service Worker] Sincronizando dados...');
}


