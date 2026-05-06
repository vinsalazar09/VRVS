# DIAGNÓSTICO CRÍTICO — ANTES DE IMPLEMENTAR

**Data:** 25/12/2025 18:20  
**Objetivo:** Análise honesta e crítica antes de prosseguir com implementação

---

## PERGUNTAS CRÍTICAS DO USUÁRIO

### 1. Está tudo certo? Mais nada a ser questionado? Alinhado?

### 2. Por que das outras vezes não deu certo?

### 3. Por que acha que agora vai funcionar?

### 4. Não tem outras variáveis para revisar?

---

## ANÁLISE CRÍTICA HONESTA

### ⚠️ **NÃO ESTÁ 100% CERTO — HÁ RISCOS**

**Por quê:**
1. **Não temos evidência concreta** de que é normalização de área
2. **Logs podem não revelar** o problema se for timing/estado
3. **Pode haver múltiplas causas** simultâneas
4. **Pode ser problema de dados** (entradas sem área/tema corretos)

---

## POR QUE AS TENTATIVAS ANTERIORES FALHARAM

### Tentativa 1: `ca2bba4` — Filtros limpos prematuramente
**O que foi feito:**
- Alinhou contagem com busca
- Validação de fila vazia

**Por que falhou:**
- ❌ `window.filtrosSessaoDiario` era limpo antes de `iniciarSessaoDiario()` usar
- ❌ Timing: `showSection()` → `setTimeout()` → `setAbaDiario()` → filtros já limpos

**Lição aprendida:** Timing é crítico em PWAs com múltiplos `setTimeout()`

---

### Tentativa 2: `cf3453b` — Proteção de filtros + renderSessaoDiarioVazia
**O que foi feito:**
- `renderSessaoDiarioVazia()` sem side-effects
- Proteção com flag `origem: 'tarefa'`

**Por que falhou parcialmente:**
- ✅ Filtros não são mais limpos prematuramente
- ❌ Mas `getEntradasParaRevisarHojeDiario()` ainda retorna 0
- ❌ Não investigamos POR QUE retorna 0

**Lição aprendida:** Proteger filtros não resolve se a busca em si falha

---

### Tentativa 3: `a1aa1bd` — OPUS v2 (fila pré-montada)
**O que foi feito:**
- Montar fila ANTES de trocar de aba
- Guardar `window.sessaoFiltradaPreMontada` com IDs

**Por que falhou:**
- ✅ Resolveu timing completamente
- ✅ Fila pré-montada funciona
- ❌ Mas fila fica vazia porque `getEntradasParaRevisarHojeDiario()` retorna 0
- ❌ Não investigamos POR QUE retorna 0

**Lição aprendida:** Resolver timing não resolve se a busca em si falha

---

### Tentativa 4: `c10dd2a` — Normalizar área (revertido)
**O que foi feito:**
- Normalizar área em `getEntradasParaRevisarHojeDiario()`

**Por que foi revertido:**
- ❌ Não funcionou (não sabemos por quê)
- ❌ Implementado sem autorização do usuário
- ❌ Não tinha logs para diagnosticar

**Lição aprendida:** Não implementar sem diagnóstico primeiro

---

## POR QUE AGORA PODE FUNCIONAR

### ✅ **DIFERENÇA CRÍTICA: LOGS PRIMEIRO**

**Antes:**
- Assumíamos causa → implementávamos → não funcionava → não sabíamos por quê

**Agora:**
- Logs primeiro → evidência concreta → implementar baseado em dados → validar

### ✅ **EVIDÊNCIA NO CÓDIGO**

**Linha 10301:**
```javascript
if (filtros.area && e.area !== filtros.area) return false; // Comparação direta
```

**Linha 10303-10306:**
```javascript
const temaNormalizado = normalizarTema(e.tema);
const filtroTemaNormalizado = normalizarTema(filtros.tema);
if (temaNormalizado !== filtroTemaNormalizado) return false; // Normalização
```

**Inconsistência clara:** Área não normaliza, tema normaliza.

### ✅ **ABORDAGEM CIENTÍFICA**

1. **Logs visíveis** → evidência concreta
2. **Patch baseado em dados** → não achismo
3. **Validação imediata** → confirma correção

---

## ⚠️ RISCOS E VARIÁVEIS NÃO REVISADAS

### RISCO 1: Pode não ser normalização de área

**Possibilidades:**
- Pode ser **tema** que não bate (mesmo com normalização)
- Pode ser **dados** (entradas sem área/tema corretos)
- Pode ser **timing** (dados mudam entre chamadas)

**Mitigação:** Logs vão revelar isso

---

### RISCO 2: Logs podem não revelar problema

**Se for:**
- **Timing/estado:** Logs podem não capturar momento exato
- **Dados corrompidos:** Logs vão mostrar, mas pode não ser fácil corrigir
- **Race condition:** Logs podem não revelar ordem de execução

**Mitigação:** Logs em múltiplos pontos do fluxo

---

### RISCO 3: Pode haver múltiplas causas

**Possibilidades:**
- Normalização de área **E** corrupção de parâmetros
- Normalização de área **E** problema de dados
- Normalização de área **E** timing

**Mitigação:** Logs vão revelar todas as causas

---

### RISCO 4: Problema de dados (entradas sem área/tema)

**Possibilidade:**
- Entradas podem ter `area: null` ou `tema: null`
- Entradas podem ter área/tema com formato diferente
- Entradas podem ter sido criadas antes de normalização existir

**Mitigação:** Logs vão mostrar estado real dos dados

---

### RISCO 5: `hojeStr()` vs `hojeStrLocal()` (timezone)

**Possibilidade:**
- `hojeStr()` usa UTC (`toISOString()`)
- Após 21h no Brasil, pode ser dia diferente em UTC
- `isDueToday()` pode falhar por timezone

**Evidência:**
- Linha 10295: `const hoje = hojeStr();` (UTC)
- Linha 4949: `const hojeStr = hojeStrLocal();` (já existe em `renderTarefas()`)

**Mitigação:** GPT propõe usar `hojeStrLocal()` ✅

---

### RISCO 6: `isSrsActive()` ou `isDueToday()` falhando

**Possibilidade:**
- Entradas podem não ter `srs.ativo === true`
- Entradas podem ter `proximaRevisao` no futuro
- Entradas podem ter SRS não inicializado

**Mitigação:** Logs vão mostrar quantas entradas passam em cada critério

---

### RISCO 7: Corrupção de parâmetros no `onclick`

**Possibilidade:**
- `onclick="abrirSessaoDiarioParaTema('${t.area}', '${t.tema}')"`
- Se `t.area` ou `t.tema` tiverem apóstrofo (`'`), quebra
- Se tiverem aspas (`"`), quebra
- Se tiverem caracteres especiais, pode quebrar silenciosamente

**Evidência necessária:** Logs vão mostrar parâmetros recebidos

**Mitigação:** Opus propõe usar `data-attributes` ✅

---

## VARIÁVEIS QUE PRECISAM SER REVISADAS

### 1. ✅ **Normalização de área** (GPT)
- **Status:** Evidência no código
- **Risco:** Médio (pode não ser só isso)
- **Mitigação:** Logs vão confirmar

### 2. ⚠️ **Timezone (`hojeStr()` vs `hojeStrLocal()`)** (GPT)
- **Status:** GPT propõe corrigir
- **Risco:** Baixo (já existe `hojeStrLocal()`)
- **Mitigação:** Implementar junto

### 3. ⚠️ **Corrupção de parâmetros no `onclick`** (Opus)
- **Status:** Opus propõe usar `data-attributes`
- **Risco:** Médio (pode ser causa secundária)
- **Mitigação:** Implementar junto

### 4. ⚠️ **Estado dos dados entre chamadas**
- **Status:** Não investigado
- **Risco:** Baixo (mas possível)
- **Mitigação:** Logs vão revelar

### 5. ⚠️ **Critérios de filtro (`isSrsActive()`, `isDueToday()`)**
- **Status:** Não investigado
- **Risco:** Baixo (mas possível)
- **Mitigação:** Logs vão mostrar contagens step-by-step

---

## RACIOCÍNIO DIAGNÓSTICO COMPLETO

### Passo 1: Evidência atual
- ✅ Código mostra inconsistência (área não normaliza, tema normaliza)
- ✅ Comportamento observado (contagem retorna 3, busca retorna 0)
- ✅ OPUS v2 resolveu timing (fila pré-montada funciona)

### Passo 2: Hipóteses
1. **Normalização de área** (GPT) — evidência no código
2. **Corrupção de parâmetros** (Opus) — hipótese plausível
3. **Timezone** (GPT) — evidência no código
4. **Estado dos dados** — não investigado
5. **Critérios de filtro** — não investigado

### Passo 3: Abordagem
1. **Logs primeiro** → evidência concreta
2. **Patch baseado em dados** → não achismo
3. **Validação imediata** → confirma correção

### Passo 4: Riscos mitigados
- ✅ Logs vão revelar causa real
- ✅ Patch mínimo (fácil reverter)
- ✅ Validação imediata no iPhone

---

## RESPOSTAS DIRETAS ÀS PERGUNTAS

### 1. Está tudo certo? Mais nada a ser questionado? Alinhado?

**Resposta:** ⚠️ **Quase tudo certo, mas há riscos:**
- ✅ Evidência no código (normalização área)
- ✅ Abordagem científica (logs primeiro)
- ⚠️ Pode haver múltiplas causas
- ⚠️ Logs podem não revelar tudo
- ⚠️ Pode ser problema de dados

**Mas:** Logs vão revelar o que falta, e podemos ajustar.

---

### 2. Por que das outras vezes não deu certo?

**Resposta:** ❌ **Assumimos causa sem evidência:**
- Tentativa 1: Assumimos que era timing → era parcialmente
- Tentativa 2: Assumimos que era proteção de filtros → era parcialmente
- Tentativa 3: Assumimos que era timing completo → era, mas não resolveu causa raiz
- Tentativa 4: Assumimos que era normalização área → não tinha logs para validar

**Padrão:** Sempre assumimos → implementávamos → não funcionava → não sabíamos por quê.

---

### 3. Por que acha que agora vai funcionar?

**Resposta:** ✅ **DIFERENÇA CRÍTICA: LOGS PRIMEIRO:**
- **Antes:** Assumir → implementar → não funciona → não sabemos por quê
- **Agora:** Logs → evidência → implementar baseado em dados → validar

**Evidência no código:**
- Linha 10301 mostra comparação direta de área
- Linha 10303-10306 mostra normalização de tema
- Inconsistência clara

**Abordagem científica:**
- Logs vão confirmar antes de corrigir
- Patch mínimo baseado em evidência
- Validação imediata

---

### 4. Não tem outras variáveis para revisar?

**Resposta:** ⚠️ **SIM, há variáveis não revisadas:**

1. ✅ **Normalização de área** (GPT) — será revisado
2. ⚠️ **Timezone (`hojeStr()` vs `hojeStrLocal()`)** — GPT propõe, mas não confirmado se é problema
3. ⚠️ **Corrupção de parâmetros** (Opus) — será revisado com logs
4. ⚠️ **Estado dos dados** — será revisado com logs
5. ⚠️ **Critérios de filtro** — será revisado com logs
6. ⚠️ **Problema de dados** (entradas sem área/tema) — será revisado com logs

**Mas:** Logs vão revelar todas essas variáveis, e podemos ajustar.

---

## CONCLUSÃO HONESTA

### ✅ **CONFORTÁVEL PARA PROSSEGUIR? SIM, MAS COM RESSALVAS**

**Por quê sim:**
1. ✅ Evidência no código (normalização área)
2. ✅ Abordagem científica (logs primeiro)
3. ✅ Patch mínimo (fácil reverter)
4. ✅ Validação imediata

**Ressalvas:**
1. ⚠️ Pode haver múltiplas causas
2. ⚠️ Logs podem não revelar tudo
3. ⚠️ Pode ser problema de dados

**Mas:** Logs vão revelar o que falta, e podemos ajustar.

---

## PLANO DE CONTINGÊNCIA

### Se normalização de área não resolver:
1. Logs vão mostrar o que realmente aconteceu
2. Analisar logs para identificar causa real
3. Ajustar patch baseado em evidência

### Se logs não revelarem problema:
1. Adicionar mais pontos de log
2. Logar estado completo dos dados
3. Comparar com estado esperado

### Se houver múltiplas causas:
1. Corrigir uma por vez
2. Validar cada correção
3. Continuar até resolver todas

---

## RECOMENDAÇÃO FINAL

### ✅ **PROSSEGUIR COM IMPLEMENTAÇÃO**

**Razões:**
1. ✅ Evidência no código (normalização área)
2. ✅ Abordagem científica (logs primeiro)
3. ✅ Patch mínimo (fácil reverter)
4. ✅ Validação imediata
5. ✅ Plano de contingência definido

**Mas:**
- ⚠️ Estar preparado para ajustar baseado em logs
- ⚠️ Não assumir que vai funcionar na primeira tentativa
- ⚠️ Estar preparado para múltiplas iterações

---

**Status:** ✅ **CONFORTÁVEL PARA PROSSEGUIR, MAS COM RESSALVAS E PLANO DE CONTINGÊNCIA**

