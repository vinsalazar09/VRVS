# DIAGNÓSTICO BUG: FILTRO "POR TEMA" NÃO FUNCIONA

**Data:** 24/12/2025 23:23  
**Problema:** Mesmo selecionando "Por Tema" no filtro, a interface continua mostrando visualização "Por Data"  
**Commit atual:** `5cb4646` (BUG A - Dedupe tema)

---

## EVIDÊNCIA DO PROBLEMA

**Print do iPhone mostra:**
- Filtro selecionado: "Por Tema" (📁 Por Tema)
- Mas exibindo: Entradas agrupadas por DATA (Hoje, Ontem, segunda-feira 22/12, etc.)
- Deveria mostrar: Entradas agrupadas por ÁREA → TEMA

---

## ANÁLISE DO CÓDIGO ATUAL

### 1. HTML do Select (linha 3503-3506)
```html
<select class="form-select form-select-sm" id="filtroDiarioVista" onchange="renderDiario()" style="font-size: 13px; padding: 8px;">
    <option value="data">📅 Por Data</option>
    <option value="tema">📁 Por Tema</option>
</select>
```
**Status:** ✅ CORRETO - Select existe e tem opções corretas

### 2. Função renderDiario() (linha 11213-11271)

**Linha 11230:**
```javascript
const filtroVista = document.getElementById('filtroDiarioVista')?.value || 'data';
```
**Status:** ⚠️ PROBLEMA POTENCIAL
- Usa optional chaining `?.value`
- Se elemento não existir, retorna `undefined`
- Fallback `|| 'data'` faz com que `undefined` vire `'data'`
- **MAS:** Se elemento existir mas não tiver valor selecionado, também retorna `'data'`

**Linha 11266-11269:**
```javascript
if (filtroVista === 'data') {
    renderDiarioPorData(entradasFiltradas, container);
} else {
    renderDiarioPorTema(entradasFiltradas, container);
}
```
**Status:** ✅ CORRETO - Lógica de decisão está correta

---

## POSSÍVEIS CAUSAS RAIZ

### CAUSA 1: Select não está sendo encontrado (MAIS PROVÁVEL)
**Hipótese:** `document.getElementById('filtroDiarioVista')` retorna `null` ou `undefined`

**Por que pode acontecer:**
- Elemento não existe no DOM quando `renderDiario()` é chamado
- Elemento está dentro de um container que não está visível/montado
- Timing issue: função chamada antes do DOM estar pronto

**Evidência:**
- Linha 11230 usa `?.value` (optional chaining) - indica que desenvolvedor já tinha receio de elemento não existir
- Fallback `|| 'data'` sempre retorna 'data' se elemento não existir

**Como confirmar:**
- Adicionar `console.log` para verificar se elemento existe
- Verificar se `filtroDiarioVista` está dentro de `diarioListaWrapper` que pode estar escondido

### CAUSA 2: Select está sendo resetado após renderizar
**Hipótese:** Algum código está resetando o valor do select para 'data' após `renderDiario()` ser chamado

**Por que pode acontecer:**
- Função `setAbaDiario()` pode estar resetando filtros
- Algum código de inicialização está resetando o select
- Service Worker ou cache pode estar interferindo

**Evidência:**
- Não encontrei código explícito resetando o select
- Mas pode haver código que recria o HTML do select

**Como confirmar:**
- Verificar se `setAbaDiario()` reseta filtros
- Verificar se há código que recria `filtroDiarioVista` dinamicamente

### CAUSA 3: Select não está dentro do container correto
**Hipótese:** O select está dentro de `diarioListaWrapper` mas quando `renderDiario()` é chamado, o wrapper não está visível/montado

**Evidência:**
- Select está na linha 3503, dentro de `diarioListaWrapper` (linha 3482)
- Se `diarioListaWrapper` estiver `display: none`, o elemento pode não estar acessível

**Como confirmar:**
- Verificar se `diarioListaWrapper` está visível quando `renderDiario()` é chamado
- Verificar se há código que esconde/mostra o wrapper

### CAUSA 4: Problema de timing/race condition
**Hipótese:** `renderDiario()` é chamado antes do select estar totalmente montado no DOM

**Evidência:**
- Múltiplas chamadas a `renderDiario()` em diferentes momentos
- Pode haver chamada durante inicialização antes do DOM estar pronto

**Como confirmar:**
- Verificar ordem de execução das funções
- Verificar se há `DOMContentLoaded` ou similar

---

## ONDE EU ERREI (ANÁLISE AUTO-CRÍTICA)

### ERRO 1: Não verifiquei se elemento existe antes de usar
**O que fiz:**
- Modifiquei `renderDiarioPorTema()` para usar `areaKey` normalizada
- Não verifiquei se isso quebrou a lógica de seleção do filtro

**Por que errei:**
- Assumi que o select sempre existiria
- Não testei o fluxo completo de seleção do filtro
- Foquei apenas na dedupe, não na integração com o filtro

### ERRO 2: Não verifiquei se minhas mudanças afetaram a renderização
**O que fiz:**
- Modifiquei estrutura interna de `porArea` para usar `areaKey` normalizada
- Mudei de `porArea[e.area]` para `porArea[areaKey]`

**Por que errei:**
- Não verifiquei se isso quebrou alguma dependência externa
- Não testei se o filtro ainda funcionava após mudanças

### ERRO 3: Não adicionei logs/debug para diagnosticar
**O que fiz:**
- Removi debug visual temporário do BUG A
- Não adicionei logs para verificar se filtro está sendo lido corretamente

**Por que errei:**
- Assumi que funcionaria sem verificar
- Não segui metodologia de diagnóstico antes de implementar

---

## PLANO PARA RESOLVER

### FASE 1: DIAGNÓSTICO (SEM MEXER NO CÓDIGO AINDA)

1. **Adicionar logs temporários em `renderDiario()`:**
   ```javascript
   const filtroVistaEl = document.getElementById('filtroDiarioVista');
   console.log('[DEBUG FILTRO] Elemento existe:', !!filtroVistaEl);
   console.log('[DEBUG FILTRO] Valor do select:', filtroVistaEl?.value);
   console.log('[DEBUG FILTRO] filtroVista final:', filtroVista);
   ```

2. **Verificar se `diarioListaWrapper` está visível:**
   ```javascript
   const wrapper = document.getElementById('diarioListaWrapper');
   console.log('[DEBUG FILTRO] Wrapper visível:', wrapper?.style.display !== 'none');
   ```

3. **Verificar quando `renderDiario()` é chamado:**
   - Adicionar stack trace para ver de onde vem a chamada
   - Verificar se há múltiplas chamadas simultâneas

### FASE 2: CORREÇÃO (APÓS CONFIRMAR CAUSA)

**Se CAUSA 1 (elemento não existe):**
- Garantir que select existe antes de ler valor
- Usar valor de localStorage como fallback se elemento não existir
- Ou garantir que elemento seja criado antes de `renderDiario()` ser chamado

**Se CAUSA 2 (select sendo resetado):**
- Encontrar código que reseta e remover
- Salvar valor do filtro em variável antes de resetar
- Restaurar valor após resetar

**Se CAUSA 3 (wrapper não visível):**
- Garantir que wrapper está visível antes de ler select
- Ou ler valor do select antes de esconder wrapper
- Ou usar variável global para manter estado do filtro

**Se CAUSA 4 (timing):**
- Adicionar `DOMContentLoaded` listener
- Ou usar `setTimeout` para garantir que DOM está pronto
- Ou usar variável global para manter estado do filtro

### FASE 3: TESTE E VALIDAÇÃO

1. Testar no iPhone:
   - Selecionar "Por Tema"
   - Verificar se mostra agrupamento por área → tema
   - Verificar se mantém seleção após renderizar
   - Verificar se funciona após mudar de aba

2. Testar no desktop:
   - Mesmos testes acima
   - Verificar console para logs de debug

3. Remover logs de debug após confirmar funcionamento

---

## CÓDIGO ATUAL RELEVANTE

### Função renderDiario() (linhas 11213-11271)
```javascript
function renderDiario() {
    const container = document.getElementById('diarioContainer');
    if (!container) return;
    
    atualizarChipVrvs3p();
    
    if (!window.diario || !window.diario.entradas || window.diario.entradas.length === 0) {
        container.innerHTML = '<div class="empty-state">...</div>';
        return;
    }
    
    const filtroVista = document.getElementById('filtroDiarioVista')?.value || 'data';
    const filtroArea = document.getElementById('filtroDiarioArea')?.value || '';
    const filtroData = document.getElementById('filtroDiarioData')?.value || '';
    
    // ... filtros de área e data ...
    
    if (filtroVista === 'data') {
        renderDiarioPorData(entradasFiltradas, container);
    } else {
        renderDiarioPorTema(entradasFiltradas, container);
    }
}
```

### HTML do Select (linhas 3503-3506)
```html
<select class="form-select form-select-sm" id="filtroDiarioVista" onchange="renderDiario()" style="font-size: 13px; padding: 8px;">
    <option value="data">📅 Por Data</option>
    <option value="tema">📁 Por Tema</option>
</select>
```

---

## CAUSA PROVÁVEL IDENTIFICADA (APÓS ANÁLISE MAIS PROFUNDA)

### CAUSA 5: Select está dentro de wrapper que pode estar escondido (MAIS PROVÁVEL AGORA)

**Evidência encontrada:**
- Select `filtroDiarioVista` está dentro de `diarioListaWrapper` (linha 3482)
- Função `setAbaDiario()` (linha 11560) controla visibilidade do wrapper:
  - Quando `aba === 'lista'`: `containerLista.style.display = 'block'` (linha 11571)
  - Quando `aba === 'sessao'`: `containerLista.style.display = 'none'` (linha 11578)
- `renderDiario()` é chamado em `setAbaDiario('lista')` na linha 11574

**Problema potencial:**
1. Quando `showSection('diario')` é chamado (linha 6886), ele chama `renderDiario()` imediatamente (linha 6887)
2. Nesse momento, `diarioListaWrapper` pode estar com `display: none` (padrão do HTML ou se estava na aba 'sessao')
3. Quando wrapper está escondido, `document.getElementById('filtroDiarioVista')` pode retornar `null` ou o valor pode não estar acessível
4. Com fallback `|| 'data'`, sempre retorna `'data'`
5. **CRÍTICO:** `setAbaDiario('lista')` só é chamado quando usuário clica na aba "Lista", mas `renderDiario()` já foi chamado antes disso

**Confirmação necessária:**
- Verificar ordem de execução: `renderDiario()` vs `setAbaDiario()`
- Verificar se há chamada inicial de `renderDiario()` antes do wrapper estar visível
- Verificar se há código que chama `renderDiario()` quando wrapper está escondido

**Evidência adicional encontrada:**
- `showSection('diario')` (linha 6886) chama `renderDiario()` imediatamente (linha 6887)
- Mas `setAbaDiario('lista')` só é chamado quando usuário clica na aba "Lista"
- Se usuário estava na aba "Sessão" antes, o wrapper está escondido quando `renderDiario()` é chamado

---

## CONCLUSÃO

**Causa mais provável:** CAUSA 5 - Select está dentro de wrapper que pode estar escondido quando `renderDiario()` é chamado inicialmente, fazendo com que `filtroVista` sempre seja `'data'` por causa do fallback.

**Próximo passo:** 
1. Adicionar logs de diagnóstico para confirmar ordem de execução
2. Garantir que `renderDiario()` só seja chamado quando wrapper estiver visível
3. Ou usar variável global para manter estado do filtro independente do DOM

**Lição aprendida:** 
- Sempre verificar se elementos DOM existem antes de usar
- Especialmente quando há wrappers que podem estar escondidos ou não montados
- Não confiar apenas no fallback `|| 'data'` - pode mascarar problemas reais

