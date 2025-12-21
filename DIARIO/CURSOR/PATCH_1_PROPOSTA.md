# 🔧 PATCH 1 - PROPOSTA: REMOVER VAZAMENTO DO FILTRO DA LISTA PARA SESSÃO

**Data:** 20 de Dezembro de 2024  
**Objetivo:** Corrigir bug onde filtro da Lista vaza para Sessão sem comando do usuário  
**Status:** ⏳ PROPOSTA (aguardando aprovação)

---

## 📋 DIAGNÓSTICO

### Problema Identificado

**Localização:** `docs/index.html` linha 11459-11461

**Código Atual (COM BUG):**
```javascript
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
```

**Por que é bug:**
- Quando usuário navega manualmente de Lista → Sessão, não há `window.filtrosSessaoDiario`
- Código lê `filtroDiarioArea` automaticamente e aplica à sessão
- Filtro da Lista vaza para Sessão sem comando explícito do usuário
- Afeta tanto "Revisão programada" quanto "Treino livre"

---

## 🔧 DIFF MÍNIMO PROPOSTO

### Mudança

**Remover:** Linhas 11459-11463 (bloco `else` que lê `filtroDiarioArea`)

**Resultado:** Quando não há `window.filtrosSessaoDiario`, `filtros` permanece `{ area: null, tema: null }` (sem filtro)

### Código Proposto (SEM BUG)

```javascript
// Se houver filtros de sessão vindos da aba Tarefas, eles têm prioridade
if (window.filtrosSessaoDiario) {
    filtros.area = window.filtrosSessaoDiario.area || null;
    filtros.tema = window.filtrosSessaoDiario.tema || null;
}
// Caso contrário: filtros permanecem { area: null, tema: null } (sem filtro)
// NÃO ler filtroDiarioArea para evitar vazamento do filtro da Lista para Sessão
```

### Diff Visual

```diff
--- a/docs/index.html
+++ b/docs/index.html
@@ -11454,11 +11454,7 @@
             // Se houver filtros de sessão vindos da aba Tarefas, eles têm prioridade
             if (window.filtrosSessaoDiario) {
                 filtros.area = window.filtrosSessaoDiario.area || null;
                 filtros.tema = window.filtrosSessaoDiario.tema || null;
-            } else {
-                // Caso contrário, use o filtro de área atual da UI (filtroDiarioArea)
-                const filtroAreaSelect = document.getElementById('filtroDiarioArea');
-                filtros.area = filtroAreaSelect && filtroAreaSelect.value ? filtroAreaSelect.value : null;
-                // Não precisa de filtro de tema na UI por enquanto (mantém simples)
-                filtros.tema = null;
             }
+            // Caso contrário: filtros permanecem { area: null, tema: null } (sem filtro)
+            // NÃO ler filtroDiarioArea para evitar vazamento do filtro da Lista para Sessão
```

---

## ✅ PRESERVAÇÃO DE FUNCIONALIDADES EXISTENTES

### Fluxo de Atalho Explícito (PRESERVADO ✅)

**Cenário:** Tarefas → Clicar em tema → Sessão

1. `abrirSessaoDiarioParaTema()` seta `window.filtrosSessaoDiario`
2. `iniciarSessaoDiario()` encontra `window.filtrosSessaoDiario` existente
3. Usa filtros explícitos ✅

**Resultado:** Funciona exatamente como antes ✅

---

### Fluxo de Navegação Manual (CORRIGIDO ✅)

**Cenário:** Lista → Selecionar filtro → Sessão

1. Usuário seleciona filtro na Lista (`filtroDiarioArea.value = 'Coluna'`)
2. Lista mostra apenas entradas de "Coluna" ✅
3. Usuário vai para Sessão
4. `iniciarSessaoDiario()` não encontra `window.filtrosSessaoDiario`
5. **ANTES (BUG):** Leria `filtroDiarioArea` e aplicaria à sessão ❌
6. **DEPOIS (CORRIGIDO):** `filtros` permanece `{ area: null, tema: null }` ✅
7. Sessão mostra todas as áreas (conforme regra normal) ✅

**Resultado:** Filtro da Lista não vaza mais para Sessão ✅

---

## 📱 CRITÉRIOS DE ACEITE - iPhone (PASS/FAIL)

### Teste A — "Filtro da Lista NÃO vaza"

**1) Na Lista: selecionar Área X**
- [ ] PASS: Filtro selecionado na Lista

**2) Ir para Sessão Programada**
- [ ] PASS: Sessão NÃO fica limitada à Área X (mostra todas as áreas conforme regra normal)

**3) Voltar para Lista**
- [ ] PASS: Filtro Área X ainda está selecionado na Lista

**4) Ir para Treino Livre**
- [ ] PASS: Treino Livre NÃO fica limitado à Área X (mostra todas as áreas)

---

### Teste B — "Filtros explícitos continuam funcionando"

**5) Aba Tarefas → Clicar em um tema específico**
- [ ] PASS: Navega para Diário → Sessão Programada
- [ ] PASS: Sessão mostra APENAS entradas daquele tema (filtro explícito funciona)

**6) Aba Tarefas → Clicar em outro tema → Treino Livre**
- [ ] PASS: Treino Livre mostra APENAS entradas daquele tema (filtro explícito funciona)

---

### Teste C — "Filtro da Lista permanece na Lista"

**7) Lista com filtro Área X → Sessão → Voltar para Lista**
- [ ] PASS: Filtro Área X ainda está selecionado (UI não perdeu estado)

---

### Teste D — "Sem regressão de contadores"

**8) Antes do Patch 1:**
- [ ] Anotar valores dos contadores 🧠/⏰/📆

**9) Aplicar Patch 1**

**10) Depois do Patch 1:**
- [ ] PASS: Contadores 🧠/⏰/📆 permanecem com mesmos valores (sem mudança por este patch)

---

## 🔄 ROLLBACK PLAN

### Como Reverter Patch 1

**Opção 1: Git Checkout (Recomendado)**
```bash
cd /Users/viniciussalazar/Desktop/Teot
git checkout HEAD -- docs/index.html
```

**Opção 2: Restaurar Linhas Manualmente**
- Restaurar linhas 11459-11463 (bloco `else` removido)
- Remover comentário adicionado

**Opção 3: Git Revert**
```bash
cd /Users/viniciussalazar/Desktop/Teot
git revert [HASH_DO_COMMIT_DO_PATCH_1]
```

---

## 📊 IMPACTO ESPERADO

### Mudanças

- ✅ Bug corrigido: Filtro da Lista não vaza mais para Sessão
- ✅ Comportamento consistente: Sessão só usa filtros explícitos
- ✅ Funcionalidades preservadas: Atalhos explícitos continuam funcionando

### Sem Mudanças

- ✅ Filtro da Lista continua funcionando normalmente
- ✅ Navegação Tarefas → Diário → Sessão continua funcionando
- ✅ Contadores e indicadores não são afetados
- ✅ Outras funcionalidades não são afetadas

---

## ⚠️ RISCOS IDENTIFICADOS

### Risco 1: Comportamento Inesperado para Usuário

**Cenário:** Usuário pode esperar que filtro da Lista afete Sessão

**Mitigação:** 
- Comportamento correto: Sessão é independente da Lista
- Se necessário, adicionar UI explicando que filtros são independentes

**Probabilidade:** Baixa  
**Impacto:** Baixo (comportamento correto, apenas diferente do bug anterior)

---

### Risco 2: Performance com Muitas Entradas

**Cenário:** Sem filtro, Sessão pode mostrar muitas entradas

**Mitigação:**
- `getEntradasParaRevisarHojeDiario()` já filtra por `isDueToday` (reduz muito)
- `getEntradasTreinoLivreDiario()` retorna todas, mas usuário pode escolher quantidade depois (Patch 2)

**Probabilidade:** Baixa  
**Impacto:** Baixo (comportamento esperado sem filtro)

---

## ✅ APROVAÇÃO NECESSÁRIA

**Status:** ⏳ **AGUARDANDO APROVAÇÃO DO USUÁRIO**

**Próximos Passos Após Aprovação:**
1. Aplicar diff mínimo proposto
2. Commitar com mensagem clara
3. Validar no iPhone (todos os testes)
4. Documentar resultado

---

**Proposta completa. Aguardando aprovação para aplicar Patch 1.**

