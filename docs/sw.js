// Service Worker para VRVS - Funcionamento Offline
// ATUALIZAR ESTA VERSÃO SEMPRE QUE FIZER MUDANÇAS PARA FORÇAR ATUALIZAÇÃO
const CACHE_NAME = "vrvs-v5.3.38-sw-hotfix-20251230-0242";

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
    console.log('[Service Worker] Instalando versão:', CACHE_NAME);
    event.waitUntil(
        // Limpar TODOS os caches antigos primeiro
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('[Service Worker] Removendo cache antigo na instalação:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            // Depois criar novo cache
            return caches.open(CACHE_NAME).then((cache) => {
                console.log('[Service Worker] Fazendo cache dos arquivos');
                return cache.addAll(FILES_TO_CACHE);
            });
        })
    );
    // Forçar ativação imediata para atualizações
    self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando versão:', CACHE_NAME);
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
    // Garantir controle imediato de todas as páginas
    return self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    // não interceptar requests fora do domínio do app
    if (url.origin !== self.location.origin) return;

    event.respondWith((async () => {
        // Navegação (document): rede primeiro, fallback cache
        if (event.request.mode === 'navigate') {
            try {
                return await fetch(event.request);
            } catch (e) {
                try {
                    // tenta achar um "index" já cacheado (várias possibilidades)
                    const cache = await caches.open(CACHE_NAME);
                    return (
                        (await cache.match('./')) ||
                        (await cache.match('/')) ||
                        (await cache.match('index.html')) ||
                        (await caches.match(event.request))
                    );
                } catch (_) {
                    return new Response('', { status: 503, statusText: 'Offline' });
                }
            }
        }

        // Assets: rede primeiro, fallback cache (sempre com try/catch)
        try {
            const net = await fetch(event.request);
            try {
                if (net && net.ok) {
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(event.request, net.clone()).catch(() => {});
                }
            } catch (_) {}
            return net;
        } catch (e) {
            try {
                const cached = await caches.match(event.request);
                if (cached) return cached;
            } catch (_) {}
            return new Response('', { status: 503, statusText: 'Offline' });
        }
    })());
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

// Mensagem para notificar atualização disponível
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});


