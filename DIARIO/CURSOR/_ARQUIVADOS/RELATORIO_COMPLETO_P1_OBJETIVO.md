# RELATÓRIO COMPLETO — PROBLEMA P1 (OBJETIVO E FACTUAL)

**Data:** 25/12/2025 18:05  
**Commit atual:** `cd06df0`  
**Status:** ❌ **NÃO FUNCIONA** — Sessão filtrada não encontra tópicos

---

## CONTEXTO DO PROBLEMA

### Requisito funcional

Na aba **TAREFAS**, cada card de tema mostra:
- "Você tem X tópico(s) deste tema para revisar hoje"
- Botão "🔁 Abrir sessão do Diário"

**Comportamento esperado:**
Ao clicar o botão, deve abrir:
- Seção **DIÁRIO** → aba **SESSÃO** → modo **PROGRAMADO**
- Fila contendo **APENAS** entradas de HOJE (ou atrasadas) daquele TEMA e ÁREA
- Mostrar contagem "1/X" onde X é o número de tópicos do tema
- Não pode abrir sessão global (com todos os tópicos do dia)

### Sintoma atual (iPhone)

**Print 1 — Card de Tarefa:**
- Tema: "Lesões tendíneas do Tornozelo"
- Área: "Pé e Tornozelo"
- Mensagem: "Você tem 3 tópicos deste tema para revisar hoje"
- Botão: "🔁 Abrir sessão do Diário"

**Print 2 — Sessão aberta:**
- Mostra: "Sem tópicos deste tema para hoje"
- Mostra: "Filtrado: Pé e Tornozelo • Lesões tendíneas do Tornozelo"
- Botão: "🔁 Ver tudo (hoje)"
- Ao clicar "Ver tudo", abre sessão global (ex.: 1/59) com tema diferente

**Contradição:**
- Card mostra "3 tópicos" → `contarDiarioProgramadoParaTema()` retorna **3**
- Sessão mostra "Sem tópicos" → `getEntradasParaRevisarHojeDiario(filtros)` retorna **0**

---

## HISTÓRICO DE IMPLEMENTAÇÕES

### Commit `ca2bba4` (25/12/2025 03:07)
**Mensagem:** "fix: Tarefa abre sessão do Diário filtrada por tema (P1)"

**Mudanças:**
- `contarDiarioProgramadoParaTema()` agora usa `getEntradasParaRevisarHojeDiario()` internamente
- Validação de fila vazia antes de abrir sessão
- Validação adicional após iniciar sessão

**Resultado:** ❌ Não funcionou — filtros eram limpos prematuramente

---

### Commit `cf3453b` (25/12/2025 16:20)
**Mensagem:** "fix: P1 sessão filtrada - combinar GPT + OPUS (renderSessaoDiarioVazia + proteção filtros)"

**Mudanças implementadas:**

**1. Criada função `renderSessaoDiarioVazia()` (linha ~11720):**
```javascript
function renderSessaoDiarioVazia() {
    const container = document.getElementById('diarioSessao');
    if (!container) return;
    
    const tipo = sessaoDiario?.tipo || modoSessaoDiario;
    if (tipo === 'programado') {
        const temFiltro = window.filtrosSessaoDiario && (window.filtrosSessaoDiario.area || window.filtrosSessaoDiario.tema);
        const filtroArea = window.filtrosSessaoDiario?.area || '';
        const filtroTema = window.filtrosSessaoDiario?.tema || '';
        
        container.innerHTML = `
            <div class="empty-state">
                <div>${temFiltro ? `📋 Sem tópicos deste tema para hoje` : `✅ Você não tem nenhum tópico...`}</div>
                ${temFiltro ? `
                    <div>Filtrado: <strong>${filtroArea ? filtroArea + ' • ' : ''}${filtroTema}</strong></div>
                    <button onclick="limparFiltroSessaoDiario()">🔁 Ver tudo (hoje)</button>
                ` : `...`}
            </div>
        `;
    }
}
```

**2. Modificado `setAbaDiario()` (linha 11686):**
```javascript
// ANTES:
renderSessaoDiario(null);

// DEPOIS:
renderSessaoDiarioVazia(); // P1 FIX: Usar função placeholder sem side-effects
```

**3. Proteção em `renderSessaoDiario(null)` (linha 11792-11798):**
```javascript
// ANTES:
const temSessaoAtiva = sessaoDiario && sessaoDiario.filaIds && sessaoDiario.filaIds.length > 0;
if (temSessaoAtiva) {
    window.filtrosSessaoDiario = null;
}

// DEPOIS:
const estaIniciandoSessaoFiltrada = window.filtrosSessaoDiario && 
                                     window.filtrosSessaoDiario.origem === 'tarefa';
if (!estaIniciandoSessaoFiltrada) {
    window.filtrosSessaoDiario = null;
}
```

**Resultado:** ✅ Filtros não são mais limpos prematuramente  
**Resultado:** ❌ Mas ainda não encontra tópicos (retorna 0)

---

### Commit `a1aa1bd` (25/12/2025 17:52)
**Mensagem:** "fix: P1 – Sessão filtrada usa fila pré-montada (OPUS v2)"

**Mudanças implementadas:**

**1. Modificado `abrirSessaoDiarioParaTema()` (linha 4719):**
```javascript
// ANTES:
const qtdDiario = contarDiarioProgramadoParaTema(area, tema);
if (qtdDiario === 0) {
    mostrarNotificacaoFeedback('📋 Sem tópicos deste tema para hoje', 'info');
    return;
}
window.filtrosSessaoDiario = { area, tema, origem: 'tarefa' };
// ... depois chama setModoSessaoDiario que busca novamente

// DEPOIS:
const entradas = getEntradasParaRevisarHojeDiario({ area, tema });
if (entradas.length === 0) {
    mostrarNotificacaoFeedback('📋 Sem tópicos deste tema para hoje', 'info');
    return;
}
window.sessaoFiltradaPreMontada = {
    filaIds: entradas.map(e => e.id),
    area: area,
    tema: tema,
    total: entradas.length,
    origem: 'tarefa'
};
// ... depois chama setModoSessaoDiario que usa fila pré-montada
```

**2. Modificado `iniciarSessaoDiario()` (linha 11770):**
```javascript
if (tipo === 'programado') {
    // P1 v2 OPUS: Se há fila pré-montada da Tarefa, usar diretamente
    if (window.sessaoFiltradaPreMontada && 
        window.sessaoFiltradaPreMontada.filaIds && 
        window.sessaoFiltradaPreMontada.filaIds.length > 0) {
        
        sessaoDiario.filaIds = window.sessaoFiltradaPreMontada.filaIds;
        sessaoDiario.indiceAtual = 0;
        
        window.filtrosSessaoDiario = {
            area: window.sessaoFiltradaPreMontada.area,
            tema: window.sessaoFiltradaPreMontada.tema,
            origem: 'tarefa'
        };
        
        window.sessaoFiltradaPreMontada = null;
        
        renderSessaoDiario(getEntradaAtualSessao());
        return; // IMPORTANTE: sair aqui
    }
    
    // Fluxo normal (sessão global)...
}
```

**Resultado:** ❌ **AINDA NÃO FUNCIONA** — Continua mostrando "Sem tópicos deste tema para hoje"

---

### Commit `cd06df0` (25/12/2025 17:57)
**Mensagem:** "fix: Atualizar build tag para commit atual (a1aa1bd)"

**Mudanças:**
- Build tag atualizado de `c407f1d` para `a1aa1bd` no HTML e JavaScript

**Observação:** Build tag está aparecendo visível no iPhone (não deveria aparecer)

---

## CÓDIGO ATUAL RELEVANTE

### Função que conta tópicos (linha 4712)

```javascript
function contarDiarioProgramadoParaTema(area, tema) {
    // P1: Usar mesma função que monta a fila para garantir consistência
    const entradas = getEntradasParaRevisarHojeDiario({ area, tema });
    return entradas.length;
}
```

**Status:** ✅ Retorna 3 (correto)

---

### Função que abre sessão filtrada (linha 4719)

```javascript
function abrirSessaoDiarioParaTema(area, tema) {
    // P1 v2 OPUS: Montar fila AQUI para evitar timing issues
    const entradas = getEntradasParaRevisarHojeDiario({ area, tema });
    
    if (entradas.length === 0) {
        mostrarNotificacaoFeedback('📋 Sem tópicos deste tema para hoje', 'info');
        return;
    }
    
    // Guardar fila JÁ MONTADA com IDs (não apenas filtros)
    window.sessaoFiltradaPreMontada = {
        filaIds: entradas.map(e => e.id),
        area: area,
        tema: tema,
        total: entradas.length,
        origem: 'tarefa'
    };
    
    // Ajustar filtros visuais (opcional)
    const filtroArea = document.getElementById('filtroDiarioArea');
    if (filtroArea) filtroArea.value = area || '';
    
    // Trocar para aba Diário
    showSection('diario');
    
    setTimeout(() => {
        setModoSessaoDiario('programado');
        setAbaDiario('sessao');
    }, 100);
}
```

**Status:** ✅ Monta fila e guarda em `window.sessaoFiltradaPreMontada`

---

### Função que inicializa sessão (linha 11759)

```javascript
function iniciarSessaoDiario(tipo) {
    if (!window.diario || !Array.isArray(window.diario.entradas)) {
        renderSessaoDiario(null);
        return;
    }
    
    sessaoDiario = sessaoDiario || {};
    sessaoDiario.tipo = tipo;
    
    if (tipo === 'programado') {
        // P1 v2 OPUS: Se há fila pré-montada da Tarefa, usar diretamente
        if (window.sessaoFiltradaPreMontada && 
            window.sessaoFiltradaPreMontada.filaIds && 
            window.sessaoFiltradaPreMontada.filaIds.length > 0) {
            
            sessaoDiario.filaIds = window.sessaoFiltradaPreMontada.filaIds;
            sessaoDiario.indiceAtual = 0;
            
            window.filtrosSessaoDiario = {
                area: window.sessaoFiltradaPreMontada.area,
                tema: window.sessaoFiltradaPreMontada.tema,
                origem: 'tarefa'
            };
            
            window.sessaoFiltradaPreMontada = null;
            
            renderSessaoDiario(getEntradaAtualSessao());
            return; // IMPORTANTE: sair aqui
        }
        
        // Fluxo normal (sessão global ou filtros da UI)
        let filtros = {
            area: null,
            tema: null
        };
        
        if (window.filtrosSessaoDiario) {
            filtros.area = window.filtrosSessaoDiario.area || null;
            filtros.tema = window.filtrosSessaoDiario.tema || null;
        }
        
        const entradas = getEntradasParaRevisarHojeDiario(filtros);
        sessaoDiario.filaIds = entradas.map(e => e.id);
        sessaoDiario.indiceAtual = 0;
        
        if (!sessaoDiario.filaIds.length) {
            renderSessaoDiario(null);
        } else {
            renderSessaoDiario(getEntradaAtualSessao());
        }
    }
    // ... resto do código
}
```

**Status:** ⚠️ Verifica `window.sessaoFiltradaPreMontada` mas pode não estar encontrando

---

### Função que filtra entradas (linha 10303)

```javascript
function getEntradasParaRevisarHojeDiario(filtros) {
    if (!window.diario || !Array.isArray(window.diario.entradas)) return [];
    const hoje = hojeStr();
    const resultado = window.diario.entradas.filter(e => {
        // Usar helpers unificados (PATCH 3)
        if (!isSrsActive(e)) return false;
        if (!isDueToday(e, hoje)) return false;
        // P1: Filtrar por área (comparação direta)
        if (filtros.area && e.area !== filtros.area) return false;
        // P1: Filtrar por tema usando normalização (permite variações de case/acentos)
        if (filtros.tema) {
            const temaNormalizado = normalizarTema(e.tema);
            const filtroTemaNormalizado = normalizarTema(filtros.tema);
            if (temaNormalizado !== filtroTemaNormalizado) return false;
        }
        return true;
    });
    
    return resultado;
}
```

**Critérios de filtro:**
- `isSrsActive(e)` — SRS deve estar ativo
- `isDueToday(e, hoje)` — Deve estar devido hoje ou antes
- `filtros.area` — Comparação direta (string match)
- `filtros.tema` — Comparação com normalização (`normalizarTema()`)

---

## EVIDÊNCIAS DO PROBLEMA

### Evidência 1: Contradição entre contagem e busca

**Momento 1 — Renderização do card (Tarefa):**
- `contarDiarioProgramadoParaTema("Pé e Tornozelo", "Lesões tendíneas do Tornozelo")` 
- Chama `getEntradasParaRevisarHojeDiario({ area: "Pé e Tornozelo", tema: "Lesões tendíneas do Tornozelo" })`
- Retorna **3 entradas**

**Momento 2 — Abertura da sessão:**
- `abrirSessaoDiarioParaTema("Pé e Tornozelo", "Lesões tendíneas do Tornozelo")`
- Chama `getEntradasParaRevisarHojeDiario({ area: "Pé e Tornozelo", tema: "Lesões tendíneas do Tornozelo" })`
- Retorna **0 entradas** (ou fila pré-montada tem 0 IDs)

**Contradição:** Mesma função, mesmos parâmetros, resultados diferentes.

---

### Evidência 2: Filtro aplicado mas fila vazia

**Print do iPhone mostra:**
- "Filtrado: Pé e Tornozelo • Lesões tendíneas do Tornozelo" ✅
- "Sem tópicos deste tema para hoje" ❌

**Isso indica:**
- `window.filtrosSessaoDiario` está presente e correto
- `window.sessaoFiltradaPreMontada` pode estar vazia ou não estar sendo usada
- Ou `getEntradaAtualSessao()` não encontra as entradas pelos IDs

---

### Evidência 3: Build tag aparecendo visível

**Print do iPhone mostra:**
- "[BUILD: A1AA1BD]" visível no header

**Código atual (linha 2977):**
```html
<div class="header-subtitle">Sistema de Gestão de Estudos • v5.3 <span id="buildTag" style="font-size: 10px; color: rgba(255,255,255,0.4); margin-left: 8px;">[build: a1aa1bd]</span></div>
```

**Observação:** Build tag não deveria aparecer visível (era apenas para debug temporário)

---

## FLUXO ATUAL (O QUE ESTÁ ACONTECENDO)

### Passo a passo do fluxo atual

1. ✅ Usuário clica "🔁 Abrir sessão do Diário" no card "Lesões tendíneas do Tornozelo"
2. ✅ `abrirSessaoDiarioParaTema("Pé e Tornozelo", "Lesões tendíneas do Tornozelo")` é chamado
3. ✅ `getEntradasParaRevisarHojeDiario({ area: "Pé e Tornozelo", tema: "Lesões tendíneas do Tornozelo" })` é chamado
4. ⚠️ **PROBLEMA:** Retorna **0 entradas** (mesmo que `contarDiarioProgramadoParaTema()` tenha retornado 3 antes)
5. ❌ `window.sessaoFiltradaPreMontada.filaIds = []` (vazio)
6. ✅ `showSection('diario')` → muda para aba Diário
7. ✅ `setTimeout(100ms)` → `setModoSessaoDiario('programado')` → `setAbaDiario('sessao')`
8. ✅ `iniciarSessaoDiario('programado')` verifica `window.sessaoFiltradaPreMontada`
9. ❌ Como `filaIds.length === 0`, não entra no bloco de fila pré-montada
10. ❌ Continua para fluxo normal → `getEntradasParaRevisarHojeDiario(filtros)` retorna 0
11. ❌ `renderSessaoDiario(null)` → mostra "Sem tópicos deste tema para hoje"

---

## POSSÍVEIS CAUSAS (SEM INDUÇÃO)

### Hipótese 1: Estado dos dados muda entre chamadas

**Possibilidade:** `window.diario.entradas` pode estar mudando entre:
- Momento da contagem (renderização do card)
- Momento da busca (clique no botão)

**Evidência necessária:** Logs mostrando estado de `window.diario.entradas` nos dois momentos

---

### Hipótese 2: Critérios de filtro excluindo entradas

**Possibilidade:** `isSrsActive()` ou `isDueToday()` podem estar retornando `false` para as entradas no momento da busca.

**Evidência necessária:** Logs mostrando quais entradas falham em cada critério

---

### Hipótese 3: Normalização de área/tema não bate

**Possibilidade:** Comparação de área/tema pode não estar batendo devido a:
- Variações de texto (espaços, acentos, case)
- Caracteres invisíveis
- Normalização inconsistente

**Evidência necessária:** Logs mostrando `area`, `tema`, `areaNormalizada`, `temaNormalizado` de entradas candidatas

---

### Hipótese 4: Timing/race condition

**Possibilidade:** `window.sessaoFiltradaPreMontada` pode estar sendo limpo ou sobrescrito antes de `iniciarSessaoDiario()` ler.

**Evidência necessária:** Logs mostrando estado de `window.sessaoFiltradaPreMontada` em cada ponto do fluxo

---

### Hipótese 5: IDs inválidos ou entradas removidas

**Possibilidade:** Os IDs guardados em `window.sessaoFiltradaPreMontada.filaIds` podem não corresponder a entradas válidas quando `getEntradaAtualSessao()` busca.

**Evidência necessária:** Logs mostrando IDs guardados vs IDs encontrados em `window.diario.entradas`

---

## CÓDIGO DE FUNÇÕES AUXILIARES

### `isSrsActive(e)` (linha ~10793)

```javascript
function isSrsActive(entrada) {
    return entrada && entrada.srs && entrada.srs.ativo === true;
}
```

### `isDueToday(e, hoje)` (linha ~10797)

```javascript
function isDueToday(entrada, hoje) {
    if (!isSrsActive(entrada)) return false;
    const due = entrada.srs.proximaRevisao || hoje;
    return due <= hoje;
}
```

### `normalizarTema(tema)` (linha ~13399)

```javascript
function normalizarTema(tema) {
    if (!tema) return '';
    return String(tema)
        .trim()
        .replace(/\u00A0/g, ' ') // Substituir NBSP por espaço
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remover zero-width
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
        .replace(/\(s\)/g, '') // Remove (s) opcional
        .replace(/[^\w\s]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, ' '); // Normaliza espaços múltiplos
}
```

### `hojeStr()` (linha ~9764)

```javascript
function hojeStr() {
    return new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
}
```

---

## PROBLEMAS ADICIONAIS IDENTIFICADOS

### Build tag aparecendo visível

**Problema:** Build tag `[BUILD: A1AA1BD]` está aparecendo visível no header do iPhone.

**Código atual (linha 2977):**
```html
<span id="buildTag" style="font-size: 10px; color: rgba(255,255,255,0.4); margin-left: 8px;">[build: a1aa1bd]</span>
```

**Observação:** Build tag foi adicionado temporariamente para debug, mas não deveria aparecer visível em produção.

---

## CHECKLIST DE VALIDAÇÃO (iPhone)

- [ ] Card mostra "3 tópicos deste tema para revisar hoje"
- [ ] Ao clicar "🔁 Abrir sessão do Diário", mostra "1/3" (não "Sem tópicos" nem "1/59")
- [ ] Card exibido é do tema correto (Pé e Tornozelo • Lesões tendíneas do Tornozelo)
- [ ] Navegar pelos 3 cards até finalizar
- [ ] Sessão GLOBAL continua funcionando (entrar direto no Diário → Sessão)
- [ ] Treino Livre continua funcionando
- [ ] Build tag NÃO aparece visível no header

---

## RESUMO EXECUTIVO

### O que foi implementado

1. ✅ Função `renderSessaoDiarioVazia()` criada (GPT)
2. ✅ `setAbaDiario('sessao')` usa `renderSessaoDiarioVazia()` (GPT)
3. ✅ Proteção em `renderSessaoDiario(null)` com flag `origem: 'tarefa'` (OPUS Ponto 2)
4. ✅ `abrirSessaoDiarioParaTema()` monta fila e guarda em `window.sessaoFiltradaPreMontada` (OPUS v2)
5. ✅ `iniciarSessaoDiario()` verifica e usa `window.sessaoFiltradaPreMontada` se existir (OPUS v2)

### O que não funciona

- ❌ `getEntradasParaRevisarHojeDiario({ area, tema })` retorna 0 quando chamado em `abrirSessaoDiarioParaTema()`
- ❌ Mesmo que `contarDiarioProgramadoParaTema()` retorne 3 antes
- ❌ Sessão mostra "Sem tópicos deste tema para hoje"
- ❌ Build tag aparece visível (não deveria)

### Contradição principal

**Mesma função, mesmos parâmetros, resultados diferentes:**
- `contarDiarioProgramadoParaTema()` → retorna 3
- `getEntradasParaRevisarHojeDiario({ area, tema })` em `abrirSessaoDiarioParaTema()` → retorna 0

---

## INFORMAÇÕES TÉCNICAS

### Arquivos modificados

- `docs/index.html` — código principal da aplicação
- `docs/sw.js` — Service Worker (CACHE_NAME atualizado)

### Commits realizados

1. `ca2bba4` — Primeira tentativa (filtros limpos prematuramente)
2. `cf3453b` — Combinação GPT + OPUS Ponto 2 (filtros protegidos)
3. `a1aa1bd` — OPUS v2 (fila pré-montada)
4. `cd06df0` — Atualização build tag

### Variáveis globais envolvidas

- `window.filtrosSessaoDiario` — Filtros da sessão (`{ area, tema, origem: 'tarefa' }`)
- `window.sessaoFiltradaPreMontada` — Fila pré-montada (`{ filaIds, area, tema, origem: 'tarefa' }`)
- `sessaoDiario` — Estado da sessão (`{ tipo, filaIds, indiceAtual }`)
- `window.diario.entradas` — Array de todas as entradas do diário

---

## CONCLUSÃO

O problema persiste após múltiplas tentativas de correção. A implementação OPUS v2 (fila pré-montada) foi aplicada, mas `getEntradasParaRevisarHojeDiario()` continua retornando 0 quando chamado em `abrirSessaoDiarioParaTema()`, mesmo que `contarDiarioProgramadoParaTema()` retorne 3 antes.

**Necessário:** Diagnóstico detalhado com logs para identificar exatamente onde e por que a função retorna resultados diferentes entre as duas chamadas.

---

**Documento criado para análise independente por GPT e Opus.**

