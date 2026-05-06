# PREVIEW ANALÍTICO — BUG D: ORDEM DAS TAREFAS

**Data:** 24/12/2025 23:56  
**Commit atual:** `1e8f7f4`  
**Branch:** `main`

---

## PASSO 0 — ESTADO E PROVA

### Estado do Repo
- **HEAD:** `1e8f7f4`
- **Branch:** `main`
- **Status:** Limpo (apenas arquivos não rastreados)
- **Últimos 6 commits:**
  1. `1e8f7f4` fix: Dedupe Diário Por Tema unificando fratura/fraturas e preferindo label plural (BUG A2)
  2. `0cfda33` fix: Diário Por Tema volta a renderizar (hotfix)
  3. `5cb4646` fix: Fortalecer normalizarTema removendo caracteres invisíveis (BUG A)
  4. `054129c` fix: Botão anterior permite REAVALIAR com undo de SRS (BUG B)
  5. `d4b2358` fix: Preservar formatação texto + text-align left (BUG C)
  6. `24811f7` feat: Build tag visível no header + bump CACHE_NAME (FASE 0)

### Função `renderTarefas()` Encontrada
- **Linha:** 4945
- **Arquivo:** `docs/index.html`

### Sort Atual (linhas 5015-5021)
```javascript
tarefas.sort((a, b) => {
    // Primeiro por menos sessões (menos sessões primeiro)
    const diffSessoes = (a.sessoes || 0) - (b.sessoes || 0);
    if (diffSessoes !== 0) return diffSessoes;
    // Depois por data (mais recente primeiro)
    return new Date(b.agenda) - new Date(a.agenda);
});
```

**Problema identificado:**
- Não considera "iniciado ontem" (1ª sessão feita ontem)
- Ordena apenas por `sessoes` ASC → `agenda` DESC
- Usa `toISOString()` que pode dar dia errado em timezone local

---

## ANÁLISE DO CÓDIGO ATUAL

### 1. Cálculo de Data Atual (linha 4946-4948)
```javascript
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);
const hojeStr = hoje.toISOString().split('T')[0];
```
**Problema:** `toISOString()` retorna UTC, pode dar dia errado em timezone local (ex.: 23:00 local = 02:00 UTC do dia seguinte)

### 2. Cálculo de Limite (linha 4989-4992)
```javascript
const limite = new Date(hoje);
limite.setDate(limite.getDate() - 7);
const limiteStr = limite.toISOString().split('T')[0];
```
**Problema:** Mesmo problema de timezone UTC

### 3. Estrutura de Tarefa (`dados[]`)
- Campo `sessoes`: Number (total de sessões)
- Campo `ultEstudo`: String (YYYY-MM-DD) - data da última sessão
- Campo `agenda`: String (YYYY-MM-DD) - próxima revisão

**Observação:** `ultEstudo` existe e é usado em outras partes do código (linha 4238, 5190)

### 4. Função `hojeStr()` Existente (linha 9726-9728)
```javascript
function hojeStr() {
    return new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
}
```
**Problema:** Usa UTC, não local

---

## PLANO DE IMPLEMENTAÇÃO

### PASSO 1 — Criar Helpers de Data Local
**Localização:** Após `hojeStr()` (linha ~9728)

**Funções a criar:**
```javascript
function dateStrLocal(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function hojeStrLocal() {
    return dateStrLocal(new Date());
}

function ontemStrLocal() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return dateStrLocal(d);
}
```

**Impacto:** Baixo - novas funções, não altera código existente

### PASSO 2 — Modificar `renderTarefas()` para Usar Data Local
**Linhas a modificar:**
- **Linha 4946-4948:** Trocar `hojeStr` para `hojeStrLocal()`
- **Linha 4989-4992:** Trocar `limiteStr` para usar `dateStrLocal(limite)`

**Código novo:**
```javascript
const hojeStr = hojeStrLocal(); // Trocar linha 4948
// ...
const limiteStr = dateStrLocal(limite); // Trocar linha 4992
```

**Impacto:** Médio - pode afetar filtro de datas, mas mantém mesma lógica

### PASSO 3 — Calcular `iniciadoOntem` na Montagem do Array
**Localização:** Após filtro de tarefas (linha ~5003), antes do sort (linha 5015)

**Código a adicionar:**
```javascript
const ontem = ontemStrLocal();
tarefas.forEach(t => {
    const ult = String(t.ultEstudo || '').slice(0, 10);
    const iniciadoOntem = (Number(t.sessoes || 0) === 1 && ult === ontem);
    t.iniciadoOntem = iniciadoOntem;
});
```

**Impacto:** Baixo - apenas adiciona propriedade calculada

### PASSO 4 — Substituir Sort Atual
**Linhas a substituir:** 5015-5021

**Código novo:**
```javascript
tarefas.sort((a, b) => {
    const ao = a.iniciadoOntem ? 1 : 0;
    const bo = b.iniciadoOntem ? 1 : 0;
    if (ao !== bo) return bo - ao; // iniciadoOntem primeiro
    
    const sa = Number(a.sessoes || 0);
    const sb = Number(b.sessoes || 0);
    if (sa !== sb) return sa - sb; // menos sessões primeiro
    
    // tie-break: manter estável e previsível
    const da = String(a.agenda || '');
    const db = String(b.agenda || '');
    if (da !== db) return db.localeCompare(da); // mais recente primeiro
    
    return String(a.tema || '').localeCompare(String(b.tema || ''), 'pt-BR');
});
```

**Impacto:** Médio - muda ordenação, mas mantém compatibilidade com filtros

---

## RISCOS E VALIDAÇÕES

### Risco 1: Timezone Local vs UTC
**Probabilidade:** Média  
**Impacto:** Médio  
**Mitigação:** Usar sempre `dateStrLocal()` para cálculos de data local

### Risco 2: Campo `ultEstudo` Ausente ou Inválido
**Probabilidade:** Baixa  
**Impacto:** Baixo  
**Mitigação:** Usar `String(t.ultEstudo || '').slice(0, 10)` com fallback

### Risco 3: Quebra de Filtro de Datas
**Probabilidade:** Baixa  
**Impacto:** Alto  
**Mitigação:** Manter mesma lógica de filtro, apenas trocar função de data

### Risco 4: Performance com Muitas Tarefas
**Probabilidade:** Baixa  
**Impacto:** Baixo  
**Mitigação:** Sort é O(n log n), cálculo `iniciadoOntem` é O(n) - aceitável

---

## CHECKLIST DE VALIDAÇÃO (PASSO 4)

Após implementar, validar no console:
```javascript
// Logar 12 primeiros após sort
tarefas.slice(0, 12).forEach(t => {
    console.log({
        tema: t.tema,
        sessoes: t.sessoes,
        ultEstudo: t.ultEstudo,
        iniciadoOntem: t.iniciadoOntem,
        agenda: t.agenda
    });
});
```

**Critérios:**
- ✅ Pelo menos 1 item com `iniciadoOntem=true` no topo (se existir)
- ✅ Depois disso, `sessoes` não-decrescente (0,0,1,2,2,3...)
- ✅ Tie-break funciona (agenda mais recente primeiro)

---

## ARQUIVOS A MODIFICAR

1. **`docs/index.html`**
   - Linha ~9728: Adicionar helpers `dateStrLocal()`, `hojeStrLocal()`, `ontemStrLocal()`
   - Linha 4948: Trocar `hojeStr` para `hojeStrLocal()`
   - Linha 4992: Trocar `limiteStr` para `dateStrLocal(limite)`
   - Linha ~5003: Adicionar cálculo de `iniciadoOntem`
   - Linha 5015-5021: Substituir sort

2. **`docs/sw.js`**
   - Bump `CACHE_NAME` para `vrvs-v5.3.21-fix-ordem-tarefas-bug-d-20251224-HHMM`

---

## CONCLUSÃO

**Viabilidade:** ✅ ALTA  
**Risco:** 🟡 MÉDIO (principalmente timezone)  
**Complexidade:** 🟢 BAIXA  
**Impacto:** 🟢 POSITIVO (corrige ordenação conforme requisito)

**Recomendação:** ✅ APROVADO PARA IMPLEMENTAÇÃO

**Próximos passos:**
1. Implementar helpers de data local
2. Modificar `renderTarefas()` conforme plano
3. Validar no console antes de commit
4. Commit único com bump de CACHE_NAME
5. Push e confirmação

---

**Observações:**
- Não mexe em dados, apenas ordenação visual
- Mantém compatibilidade com filtros existentes
- Usa sempre data local (não UTC) para cálculos
- Regra clara: iniciado ontem → menos sessões → agenda → tema

