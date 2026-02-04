// Service Worker para VRVS - Funcionamento Offline
// ATUALIZAR ESTA VERSÃO SEMPRE QUE FIZER MUDANÇAS PARA FORÇAR ATUALIZAÇÃO
const CACHE_NAME = "vrvs-v5.3.188-hotfix-bulk-toggle-diario-config-removida-20260204-0030";

// Arquivos essenciais para cache
const FILES_TO_CACHE = [
    './',
    './index.html',
    './recover.html',
    './manifest.json',
    './logo.png',
    './favicon.ico'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando versão:', CACHE_NAME);
    // Forçar ativação imediata
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Fazendo cache dos arquivos');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando versão:', CACHE_NAME);
    event.waitUntil((async () => {
        // Limpar apenas caches antigos do VRVS
        const keys = await caches.keys();
        const vrvsOldCaches = keys.filter(k => k.startsWith('vrvs-') && k !== CACHE_NAME);
        await Promise.all(vrvsOldCaches.map(k => {
            console.log('[Service Worker] Removendo cache antigo VRVS na ativação:', k);
            return caches.delete(k);
        }));
        // Forçar controle imediato de todas as páginas
        await self.clients.claim();
        // Notificar todas as páginas para recarregar
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({ type: 'SW_ACTIVATED', cacheName: CACHE_NAME });
        });
    })());
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

    // Detectar HTML: navigate ou accept inclui text/html
    const accept = event.request.headers.get('accept') || '';
    const isHTML = event.request.mode === 'navigate' || accept.includes('text/html');
    
    // ESTRATÉGIA: Network-first para HTML (força atualização sempre)
    if (isHTML) {
        event.respondWith(
            (async () => {
                try {
                    // Network-first: sempre buscar da rede primeiro (S3H: garantir no-store)
                    const req = new Request(event.request.url, { cache: 'no-store' });
                    const response = await fetch(req);
                    if (response && response.status === 200) {
                        // Atualizar cache atual com resposta da rede
                        const cache = await caches.open(CACHE_NAME);
                        // Cachear tanto event.request quanto './index.html' (clones separados)
                        await cache.put(event.request, response.clone());
                        await cache.put('./index.html', response.clone());
                    }
                    return response;
                } catch (error) {
                    // Se offline, usar SOMENTE cache atual
                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(event.request, { ignoreSearch: true });
                    if (cachedResponse) return cachedResponse;
                    // Fallback: buscar index.html do cache atual
                    const indexCached = await cache.match('./index.html', { ignoreSearch: true });
                    if (indexCached) return indexCached;
                    // Último recurso: erro offline
                    return new Response('Offline', { status: 503 });
                }
            })()
        );
        return;
    }

    // Para outros arquivos (assets), usar cache-first SOMENTE no cache atual
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            // Primeiro tentar cache atual
            const cachedResponse = await cache.match(event.request, { ignoreSearch: true });
            if (cachedResponse) {
                // Em background, verificar atualização da rede
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                }).catch(() => {});
                return cachedResponse;
            }
            // Se não tem no cache atual, buscar da rede e gravar no cache atual
            try {
                const networkResponse = await fetch(event.request);
                if (networkResponse && networkResponse.status === 200) {
                    await cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            } catch (error) {
                // Se offline e não tem no cache atual, retornar erro
                return new Response('Offline', { status: 503 });
            }
        })()
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

// Mensagem para notificar atualização disponível
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[Service Worker] Recebido SKIP_WAITING, forçando ativação...');
        self.skipWaiting().then(() => {
            return self.clients.claim();
        });
    }
});


