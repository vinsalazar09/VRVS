# 📍 PARTE 0 - MAPA COMPLETO DE FLUXO DE FILTROS

**Data:** 20 de Dezembro de 2024  
**Arquivo:** `docs/index.html`  
**Objetivo:** Mapear todas as ocorrências de filtros antes de aplicar Patch 1

---

## ✅ CONFIRMAÇÃO DE PATHS

**Arquivo fonte:** `docs/index.html` ✅  
**Service Worker:** `docs/sw.js` (registrado linha 8947: `'./sw.js'`) ✅  
**Manifest:** `manifest.json` (referenciado linha 6: `href="manifest.json"`) ✅  
**Scope SW:** `./` (raiz do docs/) ✅

---

## 🔍 MAPA DE OCORRÊNCIAS - `window.filtrosSessaoDiario`

### ONDE É SETADO (2 ocorrências)

#### 1. `abrirSessaoDiarioParaTema()` - Linha 4609
**Contexto:**
```javascript
function abrirSessaoDiarioParaTema(area, tema) {
    // Guardar filtros específicos da sessão chamada pela aba Tarefas
    window.filtrosSessaoDiario = {
        area: area || null,
        tema: tema || null,
        origem: 'tarefa'   // Para debug e identificação
    };
    
    // Ajustar filtros do Diário na UI (opcional, para visual)
    const filtroArea = document.getElementById('filtroDiarioArea');
    if (filtroArea) filtroArea.value = area || '';
    
    // Trocar para aba Diário da aplicação geral
    showSection('diario');
    
    // Abrir aba "Sessão"
    setTimeout(() => {
        setAbaDiario('sessao');
        // Garantir modo programado por padrão
        setModoSessaoDiario('programado');
    }, 100);
}
```

**Quando é chamado:** Quando usuário clica em um tema na aba Tarefas  
**Propósito:** Filtrar sessão para área/tema específico (FILTRO EXPLÍCITO) ✅

---

#### 2. `abrirRevisoesDoDia()` - Linha 4996
**Contexto:**
```javascript
function abrirRevisoesDoDia() {
    // Limpar filtros para pegar todos os tópicos do dia
    window.filtrosSessaoDiario = {
        origem: 'revisoes-do-dia'
    };
    
    // Trocar para aba Diário
    showSection('diario');
    
    // Abrir aba "Sessão"
    setTimeout(() => {
        setAbaDiario('sessao');
        // Garantir modo programado por padrão
        setModoSessaoDiario('programado');
    }, 100);
}
```

**Quando é chamado:** Quando usuário clica em "Revisões do Dia"  
**Propósito:** Limpar filtros para mostrar todos os tópicos do dia (FILTRO EXPLÍCITO - sem filtro) ✅

---

### ONDE É LIMPO/RESETADO (1 ocorrência)

#### 1. `renderSessaoDiario()` - Linha 11503
**Contexto:**
```javascript
function renderSessaoDiario(entradaAtual) {
    const container = document.getElementById('diarioSessao');
    if (!container) return;
    
    // Se nenhum card na fila
    if (!entradaAtual) {
        // Limpar filtros da sessão quando terminar
        window.filtrosSessaoDiario = null;
        
        const tipo = sessaoDiario.tipo || modoSessaoDiario;
        // ... resto do código ...
    }
}
```

**Quando é chamado:** Quando sessão termina (sem mais cards)  
**Propósito:** Limpar filtros explícitos após sessão terminar ✅

---

### ONDE É LIDO (1 ocorrência)

#### 1. `iniciarSessaoDiario()` - Linha 11455-11457
**Contexto:**
```javascript
function iniciarSessaoDiario(tipo) {
    if (!window.diario || !Array.isArray(window.diario.entradas)) {
        renderSessaoDiario(null);
        return;
    }
    
    // Filtros padrão (usados quando o usuário entra pela aba Diário)
    let filtros = {
        area: null,
        tema: null
    };
    
    // Se houver filtros de sessão vindos da aba Tarefas, eles têm prioridade
    if (window.filtrosSessaoDiario) {
        filtros.area = window.filtrosSessaoDiario.area || null;
        filtros.tema = window.filtrosSessaoDiario.tema || null;
    } else {
        // Caso contrário, use o filtro de área atual da UI (filtroDiarioArea)
        const filtroAreaSelect = document.getElementById('filtroDiarioArea');
        filtros.area = filtroAreaSelect && filtroAreaSelect.value ? filtroAreaSelect.value : null;
        // Não precisa de filtro de tema na UI por enquanto (mantém simples)
        filtros.tema = null;
    }
    
    // Guardar tipo
    sessaoDiario = sessaoDiario || {};
    sessaoDiario.tipo = tipo;
    
    let entradas = [];
    if (tipo === 'programado') {
        entradas = getEntradasParaRevisarHojeDiario(filtros);
    } else {
        entradas = getEntradasTreinoLivreDiario(filtros);
    }
    
    sessaoDiario.filaIds = entradas.map(e => e.id);
    sessaoDiario.indiceAtual = 0;
    
    if (!sessaoDiario.filaIds.length) {
        renderSessaoDiario(null);
    } else {
        renderSessaoDiario(getEntradaAtualSessao());
    }
}
```

**Quando é chamado:** Sempre que sessão é iniciada (modo muda ou sessão reinicia)  
**Propósito:** Aplicar filtros à sessão  
**PROBLEMA IDENTIFICADO:** Linha 11459-11461 lê `filtroDiarioArea` quando não há `window.filtrosSessaoDiario` ❌

---

## 🔍 MAPA DE OCORRÊNCIAS - `filtroDiarioArea`

### ONDE É LIDO (5 ocorrências)

#### 1. HTML - Select Element - Linha 3389
**Contexto:**
```html
<select class="form-select form-select-sm" id="filtroDiarioArea" onchange="renderDiario()" style="font-size: 13px; padding: 8px;">
```

**Propósito:** Elemento HTML do filtro de área na aba Lista ✅

---

#### 2. `abrirSessaoDiarioParaTema()` - Linha 4616
**Contexto:**
```javascript
// Ajustar filtros do Diário na UI (opcional, para visual)
const filtroArea = document.getElementById('filtroDiarioArea');
if (filtroArea) filtroArea.value = area || '';
```

**Propósito:** Ajustar visualmente o filtro da Lista quando sessão é iniciada por atalho ✅  
**Nota:** Apenas ajuste visual, não afeta lógica da sessão

---

#### 3. `renderDiario()` - Linha 11092-11096
**Contexto:**
```javascript
const filtroVista = document.getElementById('filtroDiarioVista')?.value || 'data';
const filtroArea = document.getElementById('filtroDiarioArea')?.value || '';
const filtroData = document.getElementById('filtroDiarioData')?.value || '';

// Atualizar select de áreas
const areaSelect = document.getElementById('filtroDiarioArea');
if (areaSelect) {
    const areas = [...new Set(window.diario.entradas.map(e => e.area))].sort();
    areaSelect.innerHTML = '<option value="">Todas as áreas</option>';
    areas.forEach(area => {
        areaSelect.innerHTML += `<option value="${area}">${area}</option>`;
    });
    if (filtroArea) areaSelect.value = filtroArea;
}
```

**Propósito:** Ler filtro para aplicar na LISTA (não na sessão) ✅

---

#### 4. `iniciarSessaoDiario()` - Linha 11460 ❌ **PROBLEMA**
**Contexto:**
```javascript
} else {
    // Caso contrário, use o filtro de área atual da UI (filtroDiarioArea)
    const filtroAreaSelect = document.getElementById('filtroDiarioArea');
    filtros.area = filtroAreaSelect && filtroAreaSelect.value ? filtroAreaSelect.value : null;
    // Não precisa de filtro de tema na UI por enquanto (mantém simples)
    filtros.tema = null;
}
```

**Propósito:** Aplicar filtro da Lista à Sessão (BUG) ❌  
**Problema:** Vaza filtro da Lista para Sessão sem comando do usuário

---

#### 5. `renderDados()` - Linha 11774-11782
**Contexto:**
```javascript
// Atualizar filtro de área do Diário
const filtroDiarioArea = document.getElementById('filtroDiarioArea');
if (filtroDiarioArea) {
    const valorAtual = filtroDiarioArea.value;
    filtroDiarioArea.innerHTML = '<option value="">Todas as áreas</option>' + 
        areasCompletas.map(a => `<option value="${a}">${a}</option>`).join('');
    if (valorAtual && areasCompletas.includes(valorAtual)) {
        filtroDiarioArea.value = valorAtual;
    }
}
```

**Propósito:** Atualizar opções do select quando dados mudam ✅

---

### ONDE É APLICADO NA LISTA (1 ocorrência)

#### 1. `renderDiario()` - Linha 11092-11111
**Contexto:**
```javascript
const filtroArea = document.getElementById('filtroDiarioArea')?.value || '';

// Filtrar entradas
let entradasFiltradas = window.diario.entradas;

if (filtroArea) {
    entradasFiltradas = entradasFiltradas.filter(e => e.area === filtroArea);
}
```

**Propósito:** Filtrar entradas exibidas na LISTA ✅  
**Nota:** Comportamento correto - filtro da Lista afeta apenas Lista

---

## 🔄 FLUXO TEXTUAL: Tarefas → Diário → Sessão

### Fluxo 1: Atalho Explícito (Tarefas → Tema → Sessão)

1. **Usuário na aba Tarefas**
   - Clica em um tema específico (ex: "Anatomia da Coluna")

2. **Chamada:** `abrirSessaoDiarioParaTema(area, tema)` (linha 4607)
   - **SET:** `window.filtrosSessaoDiario = { area: 'Coluna', tema: 'Anatomia da Coluna', origem: 'tarefa' }`
   - **Ajuste visual:** `filtroDiarioArea.value = 'Coluna'` (linha 4617) - apenas visual
   - **Navegação:** `showSection('diario')` → `setAbaDiario('sessao')` → `setModoSessaoDiario('programado')`

3. **Chamada:** `setModoSessaoDiario('programado')` (linha 11422)
   - Chama `iniciarSessaoDiario('programado')`

4. **Chamada:** `iniciarSessaoDiario('programado')` (linha 11442)
   - **LÊ:** `window.filtrosSessaoDiario` existe → usa filtros explícitos ✅
   - **Aplica:** `filtros = { area: 'Coluna', tema: 'Anatomia da Coluna' }`
   - **Busca:** `getEntradasParaRevisarHojeDiario(filtros)` → retorna apenas entradas desse tema

**Resultado:** Sessão filtrada corretamente pelo tema escolhido ✅

---

### Fluxo 2: Navegação Manual (Lista → Sessão) - **COM BUG**

1. **Usuário na aba Diário → Lista**
   - Seleciona filtro "Coluna" no `filtroDiarioArea`
   - Lista mostra apenas entradas de "Coluna" ✅

2. **Usuário muda para aba Sessão**
   - Clica em "Revisão programada" ou "Treino livre"

3. **Chamada:** `setModoSessaoDiario('programado')` ou `setModoSessaoDiario('livre')` (linha 11422)
   - Chama `iniciarSessaoDiario(tipo)`

4. **Chamada:** `iniciarSessaoDiario(tipo)` (linha 11442)
   - **LÊ:** `window.filtrosSessaoDiario` não existe (não foi setado por atalho)
   - **BUG:** Lê `filtroDiarioArea.value = 'Coluna'` (linha 11460) ❌
   - **Aplica:** `filtros = { area: 'Coluna', tema: null }`
   - **Busca:** `getEntradasParaRevisarHojeDiario(filtros)` ou `getEntradasTreinoLivreDiario(filtros)` → retorna apenas entradas de "Coluna"

**Resultado:** Sessão filtrada pelo filtro da Lista SEM comando do usuário ❌

---

### Fluxo 3: Sessão Termina

1. **Usuário completa todos os cards da sessão**
   - `sessaoDiario.indiceAtual >= sessaoDiario.filaIds.length`

2. **Chamada:** `renderSessaoDiario(null)` (linha 11496)
   - **LIMPA:** `window.filtrosSessaoDiario = null` (linha 11503)

3. **Usuário volta para Lista**
   - Filtro `filtroDiarioArea` ainda está em "Coluna" (persistiu) ✅

**Resultado:** Filtro da Lista persiste corretamente ✅

---

## 📊 RESUMO DO MAPA

### `window.filtrosSessaoDiario`

| Ação | Linha | Função | Propósito |
|------|-------|--------|-----------|
| SETADO | 4609 | `abrirSessaoDiarioParaTema()` | Filtro explícito de Tarefas → Sessão ✅ |
| SETADO | 4996 | `abrirRevisoesDoDia()` | Limpar filtros (todos os tópicos) ✅ |
| LIDO | 11455-11457 | `iniciarSessaoDiario()` | Aplicar filtros à sessão ✅ |
| LIMPO | 11503 | `renderSessaoDiario()` | Limpar após sessão terminar ✅ |

### `filtroDiarioArea`

| Ação | Linha | Função | Propósito |
|------|-------|--------|-----------|
| HTML | 3389 | - | Elemento select na Lista ✅ |
| LIDO (visual) | 4616 | `abrirSessaoDiarioParaTema()` | Ajuste visual apenas ✅ |
| LIDO (lista) | 11092 | `renderDiario()` | Filtrar Lista ✅ |
| LIDO (BUG) | 11460 | `iniciarSessaoDiario()` | Vaza para Sessão ❌ |
| ATUALIZADO | 11774 | `renderDados()` | Atualizar opções do select ✅ |

---

## 🎯 CONCLUSÃO DA PARTE 0

### Problema Identificado

**Localização:** `iniciarSessaoDiario()` linha 11459-11461

**Código Problemático:**
```javascript
} else {
    // Caso contrário, use o filtro de área atual da UI (filtroDiarioArea)
    const filtroAreaSelect = document.getElementById('filtroDiarioArea');
    filtros.area = filtroAreaSelect && filtroAreaSelect.value ? filtroAreaSelect.value : null;
    filtros.tema = null;
}
```

**Problema:** Quando não há `window.filtrosSessaoDiario`, código lê `filtroDiarioArea` e aplica à sessão sem comando do usuário.

**Impacto:** 
- Afeta tanto "Revisão programada" quanto "Treino livre"
- Filtro da Lista vaza para Sessão
- Comportamento inconsistente e confuso

### Comportamento Correto Esperado

- Se `window.filtrosSessaoDiario` existe → usar filtros explícitos ✅
- Se `window.filtrosSessaoDiario` não existe → `filtros = { area: null, tema: null }` (sem filtro) ✅
- **NUNCA** ler `filtroDiarioArea` para montar filtros de sessão ❌

---

**PARTE 0 COMPLETA. Pronto para propor Patch 1.**

