# CASO TÉCNICO FINAL - Bug Aba Pendências iPhone

## PROBLEMA

Alguns itens específicos na aba "Pendências" não respondem ao toque no iPhone (PWA instalado como app), enquanto outros itens na mesma aba funcionam normalmente.

**Itens que NÃO funcionam:**
- Fratura de clavícula
- Epifisiolistese
- Sd manguito rotador
- DDQ
- Luxação e Instabilidade do cotovelo
- LAC/LEC
- Epicondilites
- Fraturas do cotovelo

**Comportamento:**
- No MacBook (Chrome/Safari): FUNCIONA perfeitamente
- No iPhone (Safari iOS, PWA): alguns itens não respondem ao toque
- Mesmo código, mesma renderização, comportamento diferente

## TENTATIVAS JÁ REALIZADAS

1. ✅ Event delegation no container
2. ✅ Onclick inline com aspas simples: `onclick="togglePendencia('${id}')"`
3. ✅ Escape de aspas com `replace(/'/g, "\\'")`
4. ✅ Event delegation como fallback (touchend + click)
5. ✅ IDs sempre convertidos para string
6. ✅ Service Worker atualizado (v5.7.5)
7. ✅ Cache limpo no iPhone

**Nenhuma solução funcionou completamente.**

## CÓDIGO ATUAL

### Função renderPendencias (linhas ~2154-2277)

```javascript
function renderPendencias() {
    // ... filtros e ordenação ...
    
    container.innerHTML = pendencias.map(t => {
        const temaId = t.id != null ? String(t.id) : null;
        const temaIdStr = String(temaId);
        const temaIdEscaped = temaIdStr.replace(/'/g, "\\'");
        
        return `
        <div class="task-theme-item" 
             data-tema-id="${temaIdStr}" 
             onclick="togglePendencia('${temaIdEscaped}')" 
             style="touch-action: manipulation; ...">
            <div class="task-theme-name">${t.tema}</div>
            ...
        </div>`;
    }).join('');
    
    // Event delegation como fallback
    const containerEl = document.getElementById('pendenciasContainer');
    if (containerEl) {
        window.pendenciasDelegationHandler = function(e) {
            const item = e.target.closest('.task-theme-item');
            if (item) {
                const temaId = item.getAttribute('data-tema-id');
                if (temaId && !e.target.closest('[onclick]')) {
                    togglePendencia(temaId);
                }
            }
        };
        containerEl.addEventListener('touchend', window.pendenciasDelegationHandler, { passive: false });
        containerEl.addEventListener('click', window.pendenciasDelegationHandler, { passive: false });
    }
}
```

### Função togglePendencia (linhas ~2259-2287)

```javascript
window.togglePendencia = function(temaId) {
    console.log('[PENDENCIAS] togglePendencia chamado com temaId:', temaId);
    
    if (temaId == null || temaId === '') return;
    temaId = String(temaId);
    
    if (!window.pendenciasExpandidas) {
        window.pendenciasExpandidas = new Set();
    }
    if (window.pendenciasExpandidas.has(temaId)) {
        window.pendenciasExpandidas.delete(temaId);
    } else {
        window.pendenciasExpandidas.add(temaId);
    }
    renderPendencias();
};
```

## HIPÓTESES NÃO RESOLVIDAS

1. **IDs com formato diferente?** - Alguns podem ter underscore (`1733174400000_5`)
2. **Caracteres especiais nos nomes?** - `ç`, `ã`, `/` podem estar quebrando algo
3. **iOS Safari bloqueando onclick inline?** - Mas por que só alguns itens?
4. **Set() não comparando corretamente?** - Mas funciona no MacBook
5. **Elementos CSS bloqueando?** - Mas mesmo CSS para todos

## DADOS NECESSÁRIOS PARA DIAGNÓSTICO

Execute no console do navegador (no iPhone, se possível):

```javascript
// 1. Comparar IDs
const dados = JSON.parse(localStorage.getItem('vrvs_dados'));
const problema = dados.filter(t => ['Fratura de clavícula', 'Epifisiolistese', 'Sd manguito rotador', 'DDQ', 'Luxação e Instabilidade do cotovelo', 'LAC/LEC', 'Epicondilites', 'Fraturas do cotovelo'].includes(t.tema));
const funcionam = dados.filter(t => t.agenda && !problema.map(p => p.tema).includes(t.tema)).slice(0, 8);

console.log('PROBLEMA:', problema.map(t => ({tema: t.tema, id: t.id, tipo: typeof t.id})));
console.log('FUNCIONAM:', funcionam.map(t => ({tema: t.tema, id: t.id, tipo: typeof t.id})));

// 2. Inspecionar HTML gerado
const items = document.querySelectorAll('.task-theme-item');
items.forEach(el => {
    const tema = el.querySelector('.task-theme-name')?.textContent;
    if (problema.some(p => p.tema === tema)) {
        console.log('PROBLEMA:', tema);
        console.log('  onclick:', el.getAttribute('onclick'));
        console.log('  data-id:', el.getAttribute('data-tema-id'));
    }
});
```

## ARQUIVOS RELEVANTES

- `docs/index.html` - Arquivo principal (5715 linhas)
- `docs/sw.js` - Service Worker (v5.7.5)
- Função `renderPendencias()` - linhas ~2154-2277
- Função `togglePendencia()` - linhas ~2259-2287

## PERGUNTA PARA CONSULTA EXTERNA

**Por que alguns itens respondem ao toque e outros não no iOS Safari, sendo que:**
- Usam o mesmo código de renderização
- Têm a mesma estrutura HTML
- Têm o mesmo CSS
- Onclick inline funciona para alguns
- Event delegation funciona para alguns
- Mas alguns itens específicos não respondem

**O que pode estar diferente nesses itens específicos que faz o iOS Safari ignorar os eventos?**

