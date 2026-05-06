# VERIFICAÇÃO DE ALINHAMENTO — PROPOSTAS OPUS/GPT vs CONTEXTO COMPLETO

**Data:** 25/12/2025 18:15  
**Objetivo:** Confirmar se propostas Opus e GPT estão complementares ou divergem do que já foi feito

---

## O QUE JÁ FOI IMPLEMENTADO (HISTÓRICO)

### ✅ OPUS v2 — Fila Pré-Montada (commit `a1aa1bd`)

**Implementado:**
- `abrirSessaoDiarioParaTema()` monta fila ANTES de trocar de aba
- Guarda `window.sessaoFiltradaPreMontada` com `filaIds` já calculados
- `iniciarSessaoDiario()` verifica e usa fila pré-montada se existir
- Resolve problema de **timing** (filtros sendo limpos antes de usar)

**Status:** ✅ Implementado, mas **não resolveu o problema**

**Por quê não resolveu:**
- `getEntradasParaRevisarHojeDiario({ area, tema })` retorna **0** mesmo que `contarDiarioProgramadoParaTema()` retorne **3**
- Fila pré-montada fica vazia porque `entradas.length === 0` em `abrirSessaoDiarioParaTema()`

---

## PROPOSTA OPUS ATUAL — Logs Visíveis

### O que propõe:
1. Criar `debugP1()` com elemento HTML visível na tela
2. Logar parâmetros em `contarDiarioProgramadoParaTema()` e `abrirSessaoDiarioParaTema()`
3. Logar char codes para detectar caracteres invisíveis
4. Logar resultado de `getEntradasParaRevisarHojeDiario()` em ambos os pontos
5. **Hipótese:** Parâmetros corrompidos no `onclick` (aspas/apóstrofos quebrando string)

### ✅ COMPLEMENTA ao que já foi feito:
- **Não conflita** com OPUS v2 (fila pré-montada)
- **Adiciona** diagnóstico que faltava
- **Pode revelar** se parâmetros chegam diferentes entre contagem e abertura

### ⚠️ POSSÍVEL DIVERGÊNCIA:
- Se o problema for **normalização de área** (GPT), logs vão confirmar mas não resolvem sozinhos
- Precisa ser combinado com patch GPT

---

## PROPOSTA GPT ATUAL — Normalização de Área

### O que propõe:
1. Normalizar área em `getEntradasParaRevisarHojeDiario()` (linha 10301)
2. Trocar `e.area !== filtros.area` para usar `normalizarTema()` em ambos
3. Usar `hojeStrLocal()` em vez de `hojeStr()` (timezone)
4. **Hipótese:** Área usa comparação direta, tema usa normalização → inconsistência mata filtro

### ✅ COMPLEMENTA ao que já foi feito:
- **Não conflita** com OPUS v2 (fila pré-montada)
- **Ataca causa raiz** que OPUS v2 não resolveu
- **Evidência no código:** Linha 10301 mostra comparação direta de área

### ⚠️ POSSÍVEL DIVERGÊNCIA:
- **Assume causa** sem evidência concreta (mas tem evidência no código)
- Precisa ser validado com logs (Opus)

---

## ANÁLISE DE COMPLEMENTARIDADE

### ✅ SÃO COMPLEMENTARES — NÃO DIVERGEM

**Razão 1 — Camadas diferentes:**
- **OPUS v2:** Resolveu timing (fila pré-montada) ✅
- **Opus logs:** Diagnóstico (por que fila fica vazia) 🔍
- **GPT patch:** Causa raiz (normalização de área) 🔧

**Razão 2 — Sequência lógica:**
1. OPUS v2 já implementado → fila pré-montada funciona
2. Mas fila fica vazia → precisa diagnosticar (Opus logs)
3. Diagnóstico vai mostrar → normalização de área (GPT patch)

**Razão 3 — Não conflitam:**
- Opus logs são **temporários** (remover depois)
- GPT patch é **permanente** (corrige bug)
- Ambos podem coexistir

---

## VERIFICAÇÃO CONTRA CONTEXTO COMPLETO

### ✅ Alinhado com evidências do código:

**Linha 10301 (atual):**
```javascript
if (filtros.area && e.area !== filtros.area) return false; // Comparação direta
```

**Linha 10303-10306 (atual):**
```javascript
if (filtros.tema) {
    const temaNormalizado = normalizarTema(e.tema);
    const filtroTemaNormalizado = normalizarTema(filtros.tema);
    if (temaNormalizado !== filtroTemaNormalizado) return false; // Normalização
}
```

**Inconsistência confirmada:** Área não normaliza, tema normaliza ✅

### ✅ Alinhado com comportamento observado:

**Card mostra:** "3 tópicos" → `contarDiarioProgramadoParaTema()` retorna 3  
**Sessão mostra:** "Sem tópicos" → `getEntradasParaRevisarHojeDiario()` retorna 0

**Se fosse corrupção de parâmetros:** `contarDiarioProgramadoParaTema()` também retornaria 0  
**Mas retorna 3:** Então parâmetros chegam corretos na contagem  
**Problema:** Comparação de área falha na busca (normalização) ✅

---

## CONCLUSÃO FINAL

### ✅ **PROPOSTAS SÃO COMPLEMENTARES — NÃO DIVERGEM**

**Opus (logs):**
- ✅ Complementa OPUS v2 (diagnóstico)
- ✅ Não conflita com GPT patch
- ✅ Necessário para validar correção

**GPT (normalização):**
- ✅ Complementa OPUS v2 (causa raiz)
- ✅ Não conflita com Opus logs
- ✅ Evidência no código confirma hipótese

**OPUS v2 (fila pré-montada):**
- ✅ Já implementado
- ✅ Resolveu timing
- ✅ Mas não resolveu causa raiz (normalização)

---

## RECOMENDAÇÃO FINAL

### **COMBINAR TODOS OS TRÊS:**

1. **OPUS v2** → ✅ Já implementado (manter)
2. **Opus logs** → 🔍 Implementar para diagnóstico
3. **GPT patch** → 🔧 Implementar para corrigir causa raiz

**Ordem de execução:**
1. Implementar logs visíveis (Opus) — 15 min
2. Aplicar patch normalização área (GPT) — 5 min
3. Testar no iPhone com logs ativos — 10 min
4. Validar correção — 5 min
5. Remover logs após confirmação — 5 min

**Total:** ~40 minutos

---

## VERIFICAÇÃO FINAL

### ✅ Alinhado com tudo que conversamos:
- ✅ OPUS v2 já implementado e funcionando (timing resolvido)
- ✅ Problema persiste (fila vazia)
- ✅ Opus logs vão diagnosticar por quê
- ✅ GPT patch vai corrigir causa raiz (normalização área)
- ✅ Não há divergências, apenas complementaridade

### ✅ Pronto para implementação:
- Todas as propostas são compatíveis
- Sequência lógica definida
- Riscos mitigados
- Evidências confirmadas

---

**Status:** ✅ **PROPOSTAS COMPLEMENTARES — PRONTAS PARA IMPLEMENTAÇÃO**

