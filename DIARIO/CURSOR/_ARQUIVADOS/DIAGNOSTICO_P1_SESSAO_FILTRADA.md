# DIAGNÓSTICO P1 — SESSÃO DO DIÁRIO FILTRADA POR TEMA NÃO FUNCIONA

**Data:** 25/12/2025 15:46  
**Commit atual:** `ca2bba4`  
**Problema:** Ao clicar "🔁 Abrir sessão do Diário" no card de Tarefa, abre sessão geral (80 tópicos) em vez de sessão filtrada (3 tópicos do tema)

---

## CONTEXTO DO PROBLEMA

### Evidência do iPhone (prints)

**Print 1 — Card de Tarefa:**
- Tema: "Lesões tendíneas do Tornozelo"
- Área: "Pé e Tornozelo"
- Mensagem: "Você tem 3 tópicos deste tema para revisar hoje"
- Botão: "🔁 Abrir sessão do Diário"

**Print 2 — Sessão aberta:**
- Mostra "1/80" (deveria ser "1/3")
- Tópico: "Joelho • ATJ e Gonartrose" (tema diferente!)
- Deveria mostrar apenas tópicos de "Lesões tendíneas do Tornozelo"

### Requisito Funcional

Quando clicar "🔁 Abrir sessão do Diário" no card de Tarefa:
1. Deve abrir DIÁRIO → aba SESSÃO → modo PROGRAMADO
2. Fila deve conter APENAS entradas de HOJE (ou atrasadas) daquele TEMA e ÁREA
3. Não pode abrir sessão global (com todos os 136 tópicos do dia)
4. Deve manter foco no tema do card

---

## HISTÓRICO DE IMPLEMENTAÇÃO

### Commit `ca2bba4` (25/12/2025 03:07)
**Mensagem:** "fix: Tarefa abre sessão do Diário filtrada por tema (P1)"

**Mudanças:**
1. `contarDiarioProgramadoParaTema()` agora usa `getEntradasParaRevisarHojeDiario()` internamente
2. Validação de fila vazia antes de abrir sessão
3. Validação adicional após iniciar sessão

**Arquivos modificados:**
- `docs/index.html` (29 linhas modificadas)
- `docs/sw.js` (CACHE_NAME atualizado)

### Commits anteriores relacionados
- `62effb7` - fix: Abrir Sessão do Diário filtrada por tema a partir da Tarefa (P1) - primeira tentativa
- `9f01c76` - fix: Preservar formatação do texto do Diário com fidelidade ao editor (P4)
- `52dbfcf` - fix: BUG D - ordem tarefas (iniciado ontem + menos sessões) preservando ordem global entre áreas

---

## CÓDIGO ATUAL RELEVANTE

### 1. Função que renderiza o card de Tarefa

**Arquivo:** `docs/index.html`  
**Função:** `renderCardTemaHTML(t, hojeStr, contagemDiarioPorTema)`  
**Linha:** 4880

**Trecho do botão (linhas 4933-4943):**
```javascript
${(() => {
    const qtdDiario = contarDiarioProgramadoParaTema(t.area, t.tema);
    if (qtdDiario > 0) {
        return `
            <div class="tema-diario-bloco">
                Você tem ${qtdDiario} tópico(s) deste tema para revisar hoje.
                <button onclick="abrirSessaoDiarioParaTema('${t.area}', '${t.tema}')">
                    🔁 Abrir sessão do Diário
                </button>
            </div>
        `;
    }
})()}
```

**Parâmetros passados:**
- `t.area` = "Pé e Tornozelo" (string)
- `t.tema` = "Lesões tendíneas do Tornozelo" (string)

---

### 2. Função que conta tópicos do tema

**Arquivo:** `docs/index.html`  
**Função:** `contarDiarioProgramadoParaTema(area, tema)`  
**Linha:** 4712

**Código atual:**
```javascript
function contarDiarioProgramadoParaTema(area, tema) {
    // P1: Usar mesma função que monta a fila para garantir consistência
    const entradas = getEntradasParaRevisarHojeDiario({ area, tema });
    return entradas.length;
}
```

**Status:** ✅ Usa `getEntradasParaRevisarHojeDiario()` internamente

---

### 3. Função que abre sessão filtrada

**Arquivo:** `docs/index.html`  
**Função:** `abrirSessaoDiarioParaTema(area, tema)`  
**Linha:** 4719

**Código atual:**
```javascript
function abrirSessaoDiarioParaTema(area, tema) {
    // P1: Validar se há tópicos antes de abrir sessão
    const qtdDiario = contarDiarioProgramadoParaTema(area, tema);
    if (qtdDiario === 0) {
        mostrarNotificacaoFeedback('📋 Sem tópicos deste tema para hoje', 'info');
        return;
    }
    
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
    
    // Abrir aba "Sessão" e iniciar sessão programada filtrada
    setTimeout(() => {
        setAbaDiario('sessao');
        // Garantir modo programado por padrão
        setModoSessaoDiario('programado');
        
        // P1: Validação adicional após iniciar sessão
        setTimeout(() => {
            if (sessaoDiario.filaIds && sessaoDiario.filaIds.length === 0) {
                mostrarNotificacaoFeedback('📋 Sem tópicos deste tema para hoje', 'info');
                window.filtrosSessaoDiario = null; // Limpar filtro se vazio
            }
        }, 50);
    }, 100);
}
```

**Código atual (linha 4719-4755):**
```javascript
function abrirSessaoDiarioParaTema(area, tema) {
    // P1: Validar se há tópicos antes de abrir sessão
    const qtdDiario = contarDiarioProgramadoParaTema(area, tema);
    if (qtdDiario === 0) {
        mostrarNotificacaoFeedback('📋 Sem tópicos deste tema para hoje', 'info');
        return;
    }
    
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
    
    // Abrir aba "Sessão" e iniciar sessão programada filtrada
    // P1 CORREÇÃO: Chamar setModoSessaoDiario ANTES de setAbaDiario para garantir que
    // a fila seja montada com os filtros antes de renderizar a aba
    setTimeout(() => {
        // Primeiro definir o modo e montar a fila (isso preserva window.filtrosSessaoDiario)
        setModoSessaoDiario('programado');
        // Depois mudar para aba sessão (que agora não limpa os filtros se não há sessão ativa)
        setAbaDiario('sessao');
        
        // P1: Validação adicional após iniciar sessão
        setTimeout(() => {
            if (sessaoDiario.filaIds && sessaoDiario.filaIds.length === 0) {
                mostrarNotificacaoFeedback('📋 Sem tópicos deste tema para hoje', 'info');
                window.filtrosSessaoDiario = null; // Limpar filtro se vazio
            }
        }, 50);
    }, 100);
}
```

**Fluxo:**
1. Valida quantidade (deve mostrar 3)
2. Define `window.filtrosSessaoDiario = { area: "Pé e Tornozelo", tema: "Lesões tendíneas do Tornozelo", origem: 'tarefa' }`
3. Chama `showSection('diario')` → **PODE LIMPAR FILTROS AQUI?**
4. `setTimeout(100ms)` → `setModoSessaoDiario('programado')` → `setAbaDiario('sessao')` (ordem corrigida!)
5. `setTimeout(50ms)` → validação adicional

**Observação:** Já existe uma tentativa de correção na ordem (linha 4745-4748), mas ainda não está funcionando!

---

### 4. Função que monta a fila da sessão

**Arquivo:** `docs/index.html`  
**Função:** `iniciarSessaoDiario(tipo)`  
**Linha:** 11718

**Código atual:**
```javascript
function iniciarSessaoDiario(tipo) {
    if (!window.diario || !Array.isArray(window.diario.entradas)) {
        renderSessaoDiario(null);
        return;
    }
    
    // Guardar tipo
    sessaoDiario = sessaoDiario || {};
    sessaoDiario.tipo = tipo;
    
    if (tipo === 'programado') {
        // Sessão Programada: comportamento original (monta fila automaticamente)
        let filtros = {
            area: null,
            tema: null
        };
        
        // Se houver filtros de sessão vindos da aba Tarefas, eles têm prioridade
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
    } else {
        // Treino Livre: TL-1/TL-2
        // ...
    }
}
```

**Status:** ✅ Lê `window.filtrosSessaoDiario` e passa para `getEntradasParaRevisarHojeDiario(filtros)`

---

### 5. Função que filtra entradas

**Arquivo:** `docs/index.html`  
**Função:** `getEntradasParaRevisarHojeDiario(filtros)`  
**Linha:** 10300

**Código atual:**
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
    
    // Log de debug (FASE 2)
    if (resultado.length > 0) {
        console.log('[VRVS3P-DEBUG] getEntradasParaRevisarHojeDiario:', {
            total: resultado.length,
            filtros: filtros,
            detalhes: resultado.map(e => ({
                topico: e.topico?.substring(0, 40),
                proximaRevisao: e.srs?.proximaRevisao
            }))
        });
    }
    
    return resultado;
}
```

**Critérios de filtro:**
- `isSrsActive(e)` - SRS ativo
- `isDueToday(e, hoje)` - Devido hoje ou antes
- `filtros.area` - Comparação direta (string match)
- `filtros.tema` - Comparação com normalização (`normalizarTema()`)

---

### 6. Função que muda aba do Diário

**Arquivo:** `docs/index.html`  
**Função:** `setAbaDiario(aba)`  
**Linha:** 11662

**Código atual:**
```javascript
function setAbaDiario(aba) {
    abaDiarioAtiva = aba; // 'lista' ou 'sessao'
    const tabLista = document.getElementById('diarioTabLista');
    const tabSessao = document.getElementById('diarioTabSessao');
    const containerLista = document.getElementById('diarioListaWrapper');
    const containerSessao = document.getElementById('diarioSessaoWrapper');
    
    if (tabLista && tabSessao && containerLista && containerSessao) {
        if (aba === 'lista') {
            tabLista.classList.add('active');
            tabSessao.classList.remove('active');
            containerLista.style.display = 'block';
            containerSessao.style.display = 'none';
            // Re-renderizar a lista normal
            renderDiario();
        } else {
            tabSessao.classList.add('active');
            tabLista.classList.remove('active');
            containerLista.style.display = 'none';
            containerSessao.style.display = 'block';
            // Inicialmente, só mostra a tela "escolha o tipo de sessão"
            renderSessaoDiario(null);
        }
    }
}
```

**Problema identificado:** Quando `aba === 'sessao'`, chama `renderSessaoDiario(null)` que pode limpar `window.filtrosSessaoDiario` ANTES de `setModoSessaoDiario()` ser chamado!

---

### 7. Função que muda modo da sessão

**Arquivo:** `docs/index.html`  
**Função:** `setModoSessaoDiario(modo)`  
**Linha:** 11689

**Código atual:**
```javascript
function setModoSessaoDiario(modo) {
    modoSessaoDiario = modo; // 'programado' ou 'livre'
    const btnProgramado = document.getElementById('sessaoDiarioProgramado');
    const btnLivre = document.getElementById('sessaoDiarioLivre');
    
    if (btnProgramado && btnLivre) {
        if (modo === 'programado') {
            btnProgramado.classList.add('active');
            btnLivre.classList.remove('active');
        } else {
            btnLivre.classList.add('active');
            btnProgramado.classList.remove('active');
        }
    }
    
    // Limpar histórico ao mudar modo
    window.sessaoProgramadaHistorico = [];
    // Reiniciar sessão quando modo muda
    iniciarSessaoDiario(modo);
}
```

**Status:** ✅ Chama `iniciarSessaoDiario(modo)` que deve ler `window.filtrosSessaoDiario`

---

### 8. Funções auxiliares

**`isSrsActive(e)` (linha ~10780):**
```javascript
function isSrsActive(entrada) {
    return entrada.srs && entrada.srs.ativo === true;
}
```

**`isDueToday(e, hoje)` (linha 10785):**
```javascript
function isDueToday(entrada, hoje) {
    if (!isSrsActive(entrada)) return false;
    const due = entrada.srs.proximaRevisao || hoje;
    return due <= hoje;
}
```

**`normalizarTema(tema)` (linha ~13270):**
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

---

## FLUXO ESPERADO vs FLUXO ATUAL

### Fluxo esperado (correto)

1. Usuário clica "🔁 Abrir sessão do Diário" no card "Lesões tendíneas do Tornozelo"
2. `abrirSessaoDiarioParaTema("Pé e Tornozelo", "Lesões tendíneas do Tornozelo")` é chamado
3. `contarDiarioProgramadoParaTema()` retorna 3 (correto)
4. `window.filtrosSessaoDiario = { area: "Pé e Tornozelo", tema: "Lesões tendíneas do Tornozelo", origem: 'tarefa' }`
5. `showSection('diario')` → muda para aba Diário
6. `setTimeout(100ms)` → `setAbaDiario('sessao')` → `setModoSessaoDiario('programado')`
7. `setModoSessaoDiario('programado')` → `iniciarSessaoDiario('programado')`
8. `iniciarSessaoDiario()` lê `window.filtrosSessaoDiario` → `filtros = { area: "Pé e Tornozelo", tema: "Lesões tendíneas do Tornozelo" }`
9. `getEntradasParaRevisarHojeDiario(filtros)` retorna 3 entradas filtradas
10. `sessaoDiario.filaIds = [id1, id2, id3]` (3 IDs)
11. `renderSessaoDiario(getEntradaAtualSessao())` → mostra card 1/3

### Fluxo atual (problema)

1. Usuário clica "🔁 Abrir sessão do Diário" no card "Lesões tendíneas do Tornozelo"
2. `abrirSessaoDiarioParaTema("Pé e Tornozelo", "Lesões tendíneas do Tornozelo")` é chamado
3. `contarDiarioProgramadoParaTema()` retorna 3 (correto)
4. `window.filtrosSessaoDiario = { area: "Pé e Tornozelo", tema: "Lesões tendíneas do Tornozelo", origem: 'tarefa' }`
5. `showSection('diario')` → muda para aba Diário
6. `setTimeout(100ms)` → `setAbaDiario('sessao')` → **PROBLEMA:** `setAbaDiario('sessao')` chama `renderSessaoDiario(null)` ANTES de `setModoSessaoDiario()` ser chamado!
7. `renderSessaoDiario(null)` verifica `temSessaoAtiva = sessaoDiario.filaIds.length > 0` → **FALSO** (fila ainda não foi montada!)
8. **PROBLEMA:** Como `temSessaoAtiva === false`, não limpa filtros, MAS `renderSessaoDiario(null)` pode estar sendo chamado em outro contexto que limpa
9. `setModoSessaoDiario('programado')` → `iniciarSessaoDiario('programado')` → **PROBLEMA:** `window.filtrosSessaoDiario` pode ter sido limpo por `showSection('diario')` ou outro código
10. `getEntradasParaRevisarHojeDiario(filtros)` retorna 80 entradas (sem filtro!)
11. `sessaoDiario.filaIds = [id1, id2, ..., id80]` (80 IDs)
12. `renderSessaoDiario(getEntradaAtualSessao())` → mostra card 1/80

---

## CORREÇÕES PARCIAIS JÁ IMPLEMENTADAS (mas não funcionando)

### Correção 1: Ordem de chamadas (linha 4745-4748)
**Código atual:**
```javascript
// Primeiro definir o modo e montar a fila (isso preserva window.filtrosSessaoDiario)
setModoSessaoDiario('programado');
// Depois mudar para aba sessão (que agora não limpa os filtros se não há sessão ativa)
setAbaDiario('sessao');
```

**Status:** ✅ Ordem corrigida, mas ainda não funciona

### Correção 2: Proteção em `renderSessaoDiario(null)` (linha 11792-11798)
**Código atual:**
```javascript
// P1 CORREÇÃO: Só limpar filtros se já houver uma sessão iniciada (fila montada)
// Se não há fila ainda, os filtros podem estar sendo usados para iniciar a sessão
const temSessaoAtiva = sessaoDiario && sessaoDiario.filaIds && sessaoDiario.filaIds.length > 0;
if (temSessaoAtiva) {
    // Limpar filtros da sessão quando terminar
    window.filtrosSessaoDiario = null;
}
```

**Status:** ✅ Proteção existe, mas pode não estar funcionando porque `setAbaDiario('sessao')` chama `renderSessaoDiario(null)` ANTES de `setModoSessaoDiario()` montar a fila

---

## POSSÍVEIS CAUSAS DO PROBLEMA

### CAUSA 1: `showSection('diario')` pode limpar filtros (MAIS PROVÁVEL)

**Problema:**
- `showSection('diario')` chama `renderDiario()` (linha 6925)
- `renderDiario()` pode resetar estado ou limpar variáveis globais
- Não encontrei código explícito que limpe `window.filtrosSessaoDiario` em `showSection()`, mas pode haver efeito colateral

**Evidência:**
```javascript
// showSection('diario') → linha 6924-6930
if (sectionId === 'diario') {
    renderDiario(); // Pode resetar estado?
    // ...
}
```

**Solução:** Verificar se `showSection('diario')` ou `renderDiario()` limpa filtros, ou garantir que `window.filtrosSessaoDiario` seja definido DEPOIS de `showSection()`.

---

### CAUSA 2: Race condition com setTimeout (PROVÁVEL)

**Problema:**
- `setAbaDiario('sessao')` chama `renderSessaoDiario(null)` (linha 11683)
- `renderSessaoDiario(null)` pode limpar `window.filtrosSessaoDiario` (linha 11780)
- `setModoSessaoDiario('programado')` é chamado depois, mas o filtro já foi limpo

**Evidência:**
```javascript
// setAbaDiario('sessao') → linha 11683
renderSessaoDiario(null); // Pode limpar filtros!

// renderSessaoDiario(null) → linha 11780
window.filtrosSessaoDiario = null; // LIMPA O FILTRO!
```

**Solução:** Não chamar `renderSessaoDiario(null)` em `setAbaDiario('sessao')` quando há filtro ativo, ou garantir que `setModoSessaoDiario()` seja chamado ANTES de `setAbaDiario('sessao')`.

---

### CAUSA 3: `window.filtrosSessaoDiario` sendo limpo prematuramente

**Problema:**
- `renderSessaoDiario(null)` limpa `window.filtrosSessaoDiario` quando `entradaAtual === null` (linha 11780)
- Isso acontece ANTES de `iniciarSessaoDiario()` ser chamado

**Evidência:**
```javascript
// renderSessaoDiario(null) → linha 11776
if (!entradaAtual) {
    // Limpar histórico ao sair da sessão
    window.sessaoProgramadaHistorico = [];
    // Limpar filtros da sessão quando terminar
    window.filtrosSessaoDiario = null; // LIMPA AQUI!
}
```

**Solução:** Não limpar `window.filtrosSessaoDiario` em `renderSessaoDiario(null)` se estiver iniciando uma sessão nova (verificar contexto).

---

### CAUSA 4: Ordem de execução incorreta (já corrigida parcialmente)

**Problema:**
- `setAbaDiario('sessao')` é chamado antes de `setModoSessaoDiario('programado')`
- `setAbaDiario('sessao')` chama `renderSessaoDiario(null)` que limpa filtros
- `setModoSessaoDiario('programado')` é chamado depois, mas filtro já foi limpo

**Solução:** Chamar `setModoSessaoDiario('programado')` ANTES de `setAbaDiario('sessao')`, ou não chamar `renderSessaoDiario(null)` em `setAbaDiario('sessao')` quando há filtro ativo.

---

### CAUSA 5: `setAbaDiario('sessao')` ainda chama `renderSessaoDiario(null)` mesmo com filtro ativo

**Problema:**
- `showSection('diario')` pode chamar `renderDiario()` que pode resetar estado
- Não encontrei código que limpe `window.filtrosSessaoDiario` em `showSection()`, mas pode haver

**Solução:** Verificar se `showSection('diario')` limpa filtros.

---

## DIAGNÓSTICO FORENSE (PASSO A PASSO)

### Passo 1: Verificar se `window.filtrosSessaoDiario` está sendo definido

**Adicionar log temporário em `abrirSessaoDiarioParaTema()`:**
```javascript
console.log('[P1-DEBUG] abrirSessaoDiarioParaTema chamado:', { area, tema });
console.log('[P1-DEBUG] window.filtrosSessaoDiario ANTES:', window.filtrosSessaoDiario);
window.filtrosSessaoDiario = { area, tema, origem: 'tarefa' };
console.log('[P1-DEBUG] window.filtrosSessaoDiario DEPOIS:', window.filtrosSessaoDiario);
```

### Passo 2: Verificar se `window.filtrosSessaoDiario` está disponível em `iniciarSessaoDiario()`

**Adicionar log temporário em `iniciarSessaoDiario()`:**
```javascript
console.log('[P1-DEBUG] iniciarSessaoDiario chamado:', { tipo, filtrosSessaoDiario: window.filtrosSessaoDiario });
if (window.filtrosSessaoDiario) {
    filtros.area = window.filtrosSessaoDiario.area || null;
    filtros.tema = window.filtrosSessaoDiario.tema || null;
    console.log('[P1-DEBUG] Filtros aplicados:', filtros);
}
const entradas = getEntradasParaRevisarHojeDiario(filtros);
console.log('[P1-DEBUG] Entradas filtradas:', entradas.length, entradas.map(e => ({ tema: e.tema, area: e.area })));
```

### Passo 3: Verificar se `setAbaDiario('sessao')` está limpando filtros

**Adicionar log temporário em `setAbaDiario()`:**
```javascript
console.log('[P1-DEBUG] setAbaDiario chamado:', { aba, filtrosSessaoDiario: window.filtrosSessaoDiario });
if (aba === 'sessao') {
    renderSessaoDiario(null); // Pode limpar filtros aqui!
    console.log('[P1-DEBUG] setAbaDiario DEPOIS renderSessaoDiario(null):', { filtrosSessaoDiario: window.filtrosSessaoDiario });
}
```

### Passo 4: Verificar se `renderSessaoDiario(null)` está limpando filtros

**Adicionar log temporário em `renderSessaoDiario()`:**
```javascript
if (!entradaAtual) {
    console.log('[P1-DEBUG] renderSessaoDiario(null) - filtros ANTES:', window.filtrosSessaoDiario);
    window.filtrosSessaoDiario = null; // LIMPA AQUI!
    console.log('[P1-DEBUG] renderSessaoDiario(null) - filtros DEPOIS:', window.filtrosSessaoDiario);
}
```

---

## SOLUÇÕES PROPOSTAS

### SOLUÇÃO 1: Não limpar filtros em `renderSessaoDiario(null)` quando iniciando sessão

**Modificar `renderSessaoDiario()` (linha 11776):**
```javascript
if (!entradaAtual) {
    // Limpar histórico ao sair da sessão
    window.sessaoProgramadaHistorico = [];
    // P1: NÃO limpar filtros se estiver iniciando sessão filtrada
    // Só limpar se realmente estiver saindo da sessão (verificar contexto)
    const estaIniciandoSessaoFiltrada = window.filtrosSessaoDiario && window.filtrosSessaoDiario.origem === 'tarefa';
    if (!estaIniciandoSessaoFiltrada) {
        window.filtrosSessaoDiario = null;
    }
}
```

### SOLUÇÃO 2: Não chamar `renderSessaoDiario(null)` em `setAbaDiario('sessao')` quando há filtro

**Modificar `setAbaDiario()` (linha 11678):**
```javascript
} else {
    tabSessao.classList.add('active');
    tabLista.classList.remove('active');
    containerLista.style.display = 'none';
    containerSessao.style.display = 'block';
    // P1: Não renderizar null se há filtro ativo (será renderizado por iniciarSessaoDiario)
    if (!window.filtrosSessaoDiario || window.filtrosSessaoDiario.origem !== 'tarefa') {
        renderSessaoDiario(null);
    }
}
```

### SOLUÇÃO 3: Chamar `setModoSessaoDiario()` ANTES de `setAbaDiario('sessao')`

**Modificar `abrirSessaoDiarioParaTema()` (linha 4742):**
```javascript
setTimeout(() => {
    // P1: Chamar setModoSessaoDiario ANTES de setAbaDiario para garantir que filtro seja lido
    setModoSessaoDiario('programado');
    setAbaDiario('sessao');
    
    // Validação adicional após iniciar sessão
    setTimeout(() => {
        if (sessaoDiario.filaIds && sessaoDiario.filaIds.length === 0) {
            mostrarNotificacaoFeedback('📋 Sem tópicos deste tema para hoje', 'info');
            window.filtrosSessaoDiario = null;
        }
    }, 50);
}, 100);
```

### SOLUÇÃO 4: Combinar SOLUÇÃO 2 + SOLUÇÃO 3 (RECOMENDADA)

**Implementar ambas as soluções para garantir robustez.**

---

## CHECKLIST DE VALIDAÇÃO (iPhone)

- [ ] Em TAREFAS, clicar "🔁 Abrir sessão do Diário" num tema com X>0
- [ ] Abre sessão com APENAS tópicos daquele tema (mostra "1/3" não "1/80")
- [ ] Contagem X bate com o tamanho da fila (3 tópicos = fila com 3 itens)
- [ ] Tópicos mostrados são do tema correto (não mistura temas)
- [ ] Reavaliar (BUG B) continua funcionando normalmente
- [ ] Sessão global (sem filtro) continua funcionando quando entrar no Diário sem vir das tarefas

---

## PRÓXIMOS PASSOS

1. Adicionar logs de debug temporários para confirmar causa raiz
2. Implementar SOLUÇÃO 2 + SOLUÇÃO 3 (combinadas)
3. Testar no iPhone e validar checklist
4. Remover logs de debug
5. Commit + push

---

## OBSERVAÇÕES TÉCNICAS

- `window.filtrosSessaoDiario` é variável global que pode ser limpa em múltiplos pontos
- `setTimeout` pode causar race conditions se não for bem coordenado
- `renderSessaoDiario(null)` é chamado em múltiplos lugares e pode limpar filtros
- Ordem de execução é crítica: `setModoSessaoDiario()` deve ser chamado ANTES de `setAbaDiario('sessao')` quando há filtro ativo

---

---

## RESUMO EXECUTIVO

### Problema
Ao clicar "🔁 Abrir sessão do Diário" no card de Tarefa, a sessão abre com **80 tópicos** (sessão global) em vez de **3 tópicos** (sessão filtrada pelo tema).

### Evidência
- Print 1: Card mostra "Você tem 3 tópicos deste tema para revisar hoje"
- Print 2: Sessão aberta mostra "1/80" e tópico de tema diferente ("Joelho • ATJ e Gonartrose")

### Causa Raiz Provável
1. **`showSection('diario')` pode limpar `window.filtrosSessaoDiario`** (mais provável)
2. **Race condition com `setTimeout`** - `setAbaDiario('sessao')` chama `renderSessaoDiario(null)` antes da fila ser montada
3. **`renderSessaoDiario(null)` pode limpar filtros** mesmo com proteção parcial implementada

### Correções Parciais Já Implementadas (mas não funcionando)
- ✅ Ordem de chamadas corrigida (`setModoSessaoDiario()` antes de `setAbaDiario()`)
- ✅ Proteção em `renderSessaoDiario(null)` para não limpar filtros quando não há sessão ativa
- ❌ Ainda não funciona - precisa investigar `showSection('diario')` e `renderDiario()`

### Próximos Passos Recomendados
1. Adicionar logs de debug temporários para confirmar onde `window.filtrosSessaoDiario` está sendo limpo
2. Verificar se `showSection('diario')` ou `renderDiario()` limpa filtros
3. Implementar proteção adicional em `setAbaDiario('sessao')` para não chamar `renderSessaoDiario(null)` quando há filtro ativo
4. Testar no iPhone e validar checklist

---

**Documento criado para análise diagnóstica e debug.**  
**Commit atual:** `ca2bba4`  
**Data:** 25/12/2025 15:46
