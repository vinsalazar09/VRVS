# REGRA 9: PROTOCOLO DE DEBUGGING E INVESTIGAÇÃO

**Versão:** 1.0  
**Data de criação:** 2025-12-12  
**Status:** REGRA OBRIGATÓRIA - ATIVAR COM PALAVRAS-CHAVE**

---

## 🎯 OBJETIVO

Sempre que o usuário solicitar investigação ou quando problemas complexos surgirem, seguir processo sistemático de debugging ANTES de tentar corrigir.

---

## 🔑 ATIVAÇÃO

Esta regra é ativada quando o usuário usar uma das seguintes frases:

- **"primeiro investigue"**
- **"inicie protocolo de debugging"**
- **"investigar primeiro"**
- **"seguir processo de debugging"**

Ou quando problemas complexos/persistentes forem reportados.

---

## 📋 PROTOCOLO OBRIGATÓRIO

### QUANDO APLICAR ESTA REGRA:

**SEMPRE que você for:**
- ✅ Corrigir bug complexo ou persistente
- ✅ Resolver problema que já foi tentado antes sem sucesso
- ✅ Trabalhar com código que tem múltiplas dependências
- ✅ Investigar comportamento inesperado
- ✅ Usuário solicitar explicitamente investigação

**ANTES de executar QUALQUER correção, você DEVE:**

1. ✅ **INVESTIGAR** - Ler código completo relacionado
2. ✅ **MAPEAR** - Todas as referências à variável/função
3. ✅ **RASTREAR** - Ciclo de vida completo (criação → uso → destruição)
4. ✅ **VERIFICAR** - Conflitos entre diferentes partes do código
5. ✅ **ENTENDER** - Causa raiz, não apenas sintoma
6. ✅ **DOCUMENTAR** - O que encontrou antes de corrigir
7. ✅ **SOMENTE ENTÃO** - Corrigir com precisão

---

## 🔍 CHECKLIST DE INVESTIGAÇÃO (OBRIGATÓRIO)

Antes de qualquer correção, verificar TODOS os itens:

- [ ] **Li o código completo relacionado ao problema?**
- [ ] **Mapeei todas as referências à variável/função?**
- [ ] **Rastreei o ciclo de vida completo?**
  - [ ] Onde é criado?
  - [ ] Onde é usado?
  - [ ] Onde é destruído/modificado?
- [ ] **Verifiquei conflitos entre diferentes partes do código?**
- [ ] **Entendi a causa raiz, não apenas o sintoma?**
- [ ] **Pensei em sistemas, não apenas em sintomas?**
- [ ] **Documentei o que encontrei antes de corrigir?**

---

## 📊 FORMATO DE INVESTIGAÇÃO

### ESTRUTURA DA INVESTIGAÇÃO:

```
═══════════════════════════════════════════════════════════════
🔍 INVESTIGAÇÃO - [NOME DO PROBLEMA]
═══════════════════════════════════════════════════════════════

📋 PROBLEMA REPORTADO:
[Descrição clara do problema]

🔎 INVESTIGAÇÃO REALIZADA:

1. CÓDIGO RELACIONADO:
   - Arquivo(s): [lista de arquivos]
   - Função(ões): [lista de funções]
   - Linha(s): [intervalos de linhas]

2. MAPEAMENTO DE REFERÊNCIAS:
   - Variável/Função: [nome]
   - Onde é declarada: [localização]
   - Onde é usada: [lista de locais]
   - Onde é modificada: [lista de locais]
   - Onde é destruída: [lista de locais]

3. CICLO DE VIDA:
   - Criação: [quando/onde]
   - Uso: [quando/onde]
   - Modificação: [quando/onde]
   - Destruição: [quando/onde]

4. CONFLITOS IDENTIFICADOS:
   - [Lista de conflitos encontrados]

5. CAUSA RAIZ IDENTIFICADA:
   [Explicação clara da causa raiz, não apenas sintoma]

═══════════════════════════════════════════════════════════════
💡 SOLUÇÃO PROPOSTA
═══════════════════════════════════════════════════════════════

[Descrição da solução baseada na causa raiz identificada]

═══════════════════════════════════════════════════════════════
⏳ AGUARDANDO VALIDAÇÃO
═══════════════════════════════════════════════════════════════

Aguardando validação antes de aplicar correção.
```

---

## 🎓 LIÇÕES APRENDIDAS (CONSULTAR)

Sempre consultar: `DIARIO/CURSOR/LICOES_APRENDIDAS_DEBUGGING.md`

**Principais lições:**
- ❌ NUNCA corrigir sem investigar primeiro
- ❌ NUNCA assumir que sei o problema
- ✅ SEMPRE rastrear ciclo de vida completo
- ✅ SEMPRE verificar conflitos entre partes
- ✅ SEMPRE pensar em sistemas, não sintomas

---

## 📝 EXEMPLO PRÁTICO

### PROBLEMA REPORTADO:
"Gráfico some ao clicar 'Nenhuma' e não volta mais"

### INVESTIGAÇÃO REALIZADA:

1. **CÓDIGO RELACIONADO:**
   - `docs/index.html` linhas 4200, 4444-4462, 4465-4576, 9152-9224

2. **MAPEAMENTO DE REFERÊNCIAS:**
   - Variável: `chartLinhaInst`
   - Declarada: linha 4200 (`let chartLinhaInst = null`)
   - Usada em: `renderChartLinha()` (linha 4534)
   - Destruída em: `renderChartLinha()` (linha 4527) e `renderAnalyticsGraficos()` (linha 9155)

3. **CICLO DE VIDA:**
   - Criação: `renderChartLinha()` linha 4534
   - Uso: Renderização do gráfico
   - Destruição: `renderChartLinha()` linha 4527 OU `renderAnalyticsGraficos()` linha 9155

4. **CONFLITOS IDENTIFICADOS:**
   - ✅ **CONFLITO CRÍTICO:** `chartLinhaInst` é variável global única
   - ✅ Usada para DOIS gráficos diferentes:
     - `chartLinha` (aba Stats)
     - `chartLinhaAnalytics` (aba Analytics)
   - ✅ Quando `renderAnalyticsGraficos()` destrói `chartLinhaInst` (linha 9155), afeta ambos os gráficos
   - ✅ Conflito de instâncias compartilhadas

5. **CAUSA RAIZ IDENTIFICADA:**
   Instância global compartilhada (`chartLinhaInst`) causando conflito entre dois gráficos diferentes. Quando um é destruído, afeta o outro.

### SOLUÇÃO PROPOSTA:
Criar instâncias separadas:
- `chartLinhaInst` → gráfico Stats
- `chartLinhaAnalyticsInst` → gráfico Analytics

---

## ⚠️ REGRAS CRÍTICAS

1. ✅ **SEMPRE** investigar antes de corrigir
2. ✅ **SEMPRE** seguir checklist completo
3. ✅ **SEMPRE** documentar investigação antes de corrigir
4. ✅ **SEMPRE** consultar lições aprendidas
5. ✅ **NUNCA** assumir que sei o problema
6. ✅ **NUNCA** corrigir sem entender causa raiz
7. ✅ **NUNCA** pular etapas do processo

---

## 🔄 PROCESSO OBRIGATÓRIO

```
PROBLEMA REPORTADO / PALAVRA-CHAVE ATIVADA
    ↓
ATIVAR REGRA 9
    ↓
INVESTIGAR (ler código, mapear referências, rastrear ciclo)
    ↓
VERIFICAR CONFLITOS (entre diferentes partes)
    ↓
ENTENDER CAUSA RAIZ (não sintoma)
    ↓
DOCUMENTAR INVESTIGAÇÃO (formato obrigatório)
    ↓
APRESENTAR SOLUÇÃO BASEADA NA CAUSA RAIZ
    ↓
AGUARDAR VALIDAÇÃO (REGRA 8)
    ↓
APLICAR CORREÇÃO COM PRECISÃO
```

---

## 📚 REFERÊNCIAS

- `DIARIO/CURSOR/LICOES_APRENDIDAS_DEBUGGING.md` - Lições aprendidas
- `docs/REGRA_8_ANALISE_CRITICA_FUNCIONALIDADES_CURSOR.md` - Regra complementar

---

**Esta regra deve ser aplicada sempre que problemas complexos surgirem ou quando o usuário solicitar investigação.**

**Data de criação:** 12/12/2025  
**Status:** ATIVA

