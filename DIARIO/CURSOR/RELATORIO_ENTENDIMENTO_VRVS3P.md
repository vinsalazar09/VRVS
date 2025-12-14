# 📋 RELATÓRIO DE ENTENDIMENTO E DÚVIDAS - VRVS 3P

**Data:** 2025-12-14  
**Documento analisado:** VRVS 3P - PROTOCOLO COMPLETO (v1)  
**Status:** ✅ ANÁLISE COMPLETA - AGUARDANDO VALIDAÇÃO

---

## ✅ ENTENDIMENTO GERAL

### Visão do Sistema
- **VRVS 3P**: Motor de Revisão Espaçada simplificado (3 respostas: Esqueci/Lembrei/Fácil)
- **Objetivo**: Transformar micro-insights do Diário em memória de longo prazo
- **Foco**: Longo prazo (vida), não apenas TEOT 2026
- **Integração**: Paralelo ao VRVS "macro" (temas/áreas/sessões)

### Núcleo Algorítmico
- **Estágios**: 0-10 com intervalos fixos (1, 2, 4, 7, 12, 20, 35, 60, 90, 135, 200 dias)
- **Transições**: 
  - Esqueci → volta estágio 0 (se ≤1) ou desce 2 degraus
  - Lembrei → sobe 1 estágio
  - Fácil → sobe 2 estágios
- **Estrutura SRS**: engine, ativo, estagio, intervalo, proximaRevisao, ultimaRevisaoData, ultimaResposta, repeticoes

### Funcionalidades Principais
1. **Criação de entrada** com checkbox "Incluir nas revisões"
2. **Sessão focada por tema** (via Tarefas)
3. **Sessão "Revisões do Dia"** (global)
4. **Painel de Retenção** (4 gráficos)
5. **Export/Import** completo em JSON

---

## ❓ DÚVIDAS E PONTOS PARA VALIDAÇÃO

### 🔴 DÚVIDAS CRÍTICAS

#### 1. **Migração do SRS Atual → VRVS 3P**
**Situação atual:**
- Existe função `registrarRespostaSrsDiario()` que usa sistema baseado em `repeticoes` (0-4+)
- Intervalos atuais: 1, 1, 3, 7, 14, 30 dias (baseado em repeticoes)
- Não há sistema de estágios ainda

**Dúvida:**
- Como migrar entradas existentes que já têm `srs.repeticoes`?
- Devo mapear `repeticoes` atual para estágio inicial? Exemplo:
  - repeticoes 0-1 → estagio 0
  - repeticoes 2 → estagio 1
  - repeticoes 3 → estagio 2
  - repeticoes 4+ → estagio 3?
- Ou resetar tudo para estagio 0 e deixar usuário revisar novamente?

**Impacto:** Alto - pode afetar dados existentes

---

#### 2. **Campo `ultimaRevisaoData` vs `ultimaResposta`**
**Documento menciona:**
- `ultimaRevisaoData`: data da última revisão
- `ultimaResposta`: 'esqueci' | 'lembrei' | 'facil'

**Dúvida:**
- Quando o usuário responde um card, devo atualizar `ultimaRevisaoData` para HOJE?
- Isso resolve o problema de "tópico revisado hoje não aparece mais na Tarefas"?
- Ou preciso de campo adicional `revisadoHoje: true`?

**Impacto:** Crítico - afeta funcionalidade principal solicitada

---

#### 3. **Filtro "Revisado Hoje" na Aba Tarefas**
**Solicitação original:**
- "Se eu já revisei o tópico no dia ele deve desaparecer da aba de tarefas"

**Dúvida:**
- Como identificar que foi revisado HOJE?
  - Opção A: `ultimaRevisaoData === hojeStr()`
  - Opção B: Verificar se `proximaRevisao` foi atualizada hoje (mas pode ser atualizada sem revisar)
  - Opção C: Adicionar campo `revisadoHoje: true` que é resetado no próximo dia
- Quando resetar? À meia-noite? No primeiro acesso do dia seguinte?

**Impacto:** Crítico - funcionalidade principal

---

#### 4. **Função `atualizarSRS()` - Substituir ou Renomear?**
**Situação atual:**
- Existe `registrarRespostaSrsDiario(entrada, qualidade)`
- Usa sistema baseado em `repeticoes`

**Dúvida:**
- Devo substituir completamente `registrarRespostaSrsDiario()` pela nova `atualizarSRS()`?
- Ou manter compatibilidade e criar função nova `atualizarSRSVRVS3P()`?
- Como garantir que código antigo não quebre?

**Impacto:** Alto - pode quebrar funcionalidades existentes

---

#### 5. **Campo `engine` - Quando Adicionar?**
**Documento especifica:**
- `engine: 'VRVS_FSRS3_v1'` obrigatório

**Dúvida:**
- Entradas antigas não têm `engine`. Devo:
  - Adicionar `engine: 'VRVS_FSRS3_v1'` em todas ao migrar?
  - Ou só em novas entradas?
- Como identificar entradas antigas vs novas?

**Impacto:** Médio - afeta versionamento futuro

---

### 🟡 DÚVIDAS TÉCNICAS

#### 6. **Constante `VRVS3P_STAGE_INTERVALS` - Onde Definir?**
**Dúvida:**
- Devo criar como constante global no início do script?
- Ou dentro de uma função/objeto específico?
- Precisa ser acessível de múltiplos lugares?

**Impacto:** Baixo - questão de organização

---

#### 7. **Função `estimarRetencao()` - Onde Usar?**
**Documento menciona:**
- Usada no Painel de Retenção
- Fórmula: `R(dias) = exp(-k * (dias / intervalo))` com k = 0.1625

**Dúvida:**
- Devo implementar já na v1 ou só quando criar o Painel (Parte 3)?
- Ou implementar agora mas só usar depois?

**Impacto:** Médio - afeta ordem de implementação

---

#### 8. **Função `classificarStatusRevisao()` - Lógica de "Atrasado"**
**Documento define:**
- `em-dia`: diff < 0 (ainda não venceu)
- `pendente`: diff <= intervalo (leve atraso)
- `atrasado`: diff > intervalo (muito atrasado)

**Dúvida:**
- `diff` é `diffEmDias(due, hoje)` onde `due` é `proximaRevisao`?
- Se `proximaRevisao = '2025-12-10'` e `hoje = '2025-12-14'`, diff = 4 dias?
- Se `intervalo = 7`, então é "pendente" (4 <= 7)?
- Isso está correto?

**Impacto:** Médio - afeta classificação visual

---

#### 9. **Checkbox "Incluir nas revisões" - Onde Está?**
**Documento menciona:**
- Checkbox "📅 Incluir nas revisões programadas" na criação de entrada

**Dúvida:**
- Este checkbox já existe no código atual?
- Se não, onde adicionar? No modal de nova entrada do Diário?
- Qual o ID/name do checkbox?

**Impacto:** Médio - preciso localizar onde adicionar

---

#### 10. **Painel de Retenção - Onde Criar?**
**Documento menciona:**
- "Local: topo da aba Análises / Dashboard"

**Dúvida:**
- Existe aba "Análises" ou "Dashboard" atualmente?
- Ou devo criar nova aba/seção?
- Devo implementar agora ou deixar para depois?

**Impacto:** Médio - afeta estrutura da UI

---

### 🟢 DÚVIDAS DE IMPLEMENTAÇÃO

#### 11. **Export/Import - Formato JSON vs CSV Atual**
**Situação atual:**
- Exportação atual usa CSV (exportarDados, exportarHistorico)

**Dúvida:**
- Devo criar novo formato JSON completo (todos os dados)?
- Ou manter CSV e adicionar JSON como opção adicional?
- O JSON deve incluir `vrvs_diario` com estrutura SRS completa?

**Impacto:** Baixo - questão de formato

---

#### 12. **Tooltips dos Botões - Quando Mostrar?**
**Documento menciona:**
- Tooltips "primeira vez ou hover"

**Dúvida:**
- "Primeira vez" = primeira vez que usuário usa VRVS 3P?
- Ou primeira vez que vê cada botão?
- Como rastrear isso? localStorage com flag?

**Impacto:** Baixo - UX enhancement

---

#### 13. **Mensagens Pedagógicas - Onde Exibir?**
**Documento menciona:**
- Mensagens baseadas no estado global

**Dúvida:**
- Onde exibir essas mensagens?
  - No topo da aba Tarefas?
  - No Painel de Retenção?
  - Como notificação flutuante?
- Devo implementar agora ou só quando criar Painel?

**Impacto:** Baixo - questão de UX

---

#### 14. **Gráfico "Distribuição por Estágio" - Formato**
**Documento mostra:**
- Barras horizontais com grupos (Novos, Fixando, Maduros, Dominados)

**Dúvida:**
- Devo usar Chart.js (já usado na plataforma)?
- Ou criar HTML/CSS simples?
- Qual biblioteca de gráficos usar?

**Impacto:** Baixo - questão técnica

---

#### 15. **Mini-Card por Tema - Substituir ou Adicionar?**
**Documento mostra:**
- Mini-card dentro do card de tema na aba Tarefas

**Dúvida:**
- Devo substituir o card atual do Diário que já existe?
- Ou adicionar como informação adicional?
- O card atual mostra "X tópicos deste tema para revisar hoje" - isso já existe?

**Impacto:** Médio - afeta UI existente

---

## 📊 COMPARAÇÃO: CÓDIGO ATUAL vs ESPECIFICAÇÃO

### ✅ O QUE JÁ EXISTE

1. **Estrutura básica do Diário**
   - `window.diario.entradas[]` ✅
   - `entrada.srs` ✅
   - Campos básicos: `ativo`, `proximaRevisao`, `repeticoes`, `ultimaResposta` ✅

2. **Função de registro de resposta**
   - `registrarRespostaSrsDiario(entrada, qualidade)` ✅
   - Mas usa sistema baseado em `repeticoes`, não estágios ❌

3. **Seleção de tópicos**
   - `getEntradasParaRevisarHojeDiario(filtros)` ✅
   - Já filtra por área + tema ✅

4. **Sessão do Diário**
   - `iniciarSessaoDiario(tipo)` ✅
   - `renderSessaoDiario(entradaAtual)` ✅
   - Botões Esqueci/Lembrei/Fácil ✅

5. **Integração com Tarefas**
   - `abrirSessaoDiarioParaTema(area, tema)` ✅
   - `contarDiarioProgramadoParaTema(area, tema)` ✅

### ❌ O QUE PRECISA SER CRIADO/MODIFICADO

1. **Sistema de Estágios**
   - Constante `VRVS3P_STAGE_INTERVALS` ❌
   - Campo `estagio` no SRS ❌
   - Campo `intervalo` calculado do estágio ❌
   - Campo `engine: 'VRVS_FSRS3_v1'` ❌

2. **Nova função `atualizarSRS()`**
   - Substituir lógica baseada em `repeticoes` ❌
   - Implementar transições de estágio ❌
   - Atualizar `ultimaRevisaoData` ❌

3. **Campo `ultimaRevisaoData`**
   - Adicionar ao SRS ❌
   - Atualizar quando responder ❌

4. **Filtro "Revisado Hoje"**
   - Lógica para não mostrar tópicos revisados hoje ❌
   - Resetar no dia seguinte ❌

5. **Checkbox "Incluir nas revisões"**
   - Adicionar ao formulário de nova entrada ❌
   - Criar SRS inicial quando marcado ❌

6. **Box "Revisões do Dia"**
   - Já implementado ✅ (mas precisa ajustar filtro)

7. **Painel de Retenção**
   - Card global "Saúde do Diário" ❌
   - Termômetro por área ❌
   - Distribuição por estágio ❌
   - Mini-card por tema ❌

8. **Export/Import JSON**
   - Função de export completo ❌
   - Função de import com preview ❌
   - Validação de schemaVersion ❌

---

## 🎯 PLANO DE IMPLEMENTAÇÃO SUGERIDO

### FASE 1: Núcleo Algorítmico (CRÍTICO)
1. Criar constante `VRVS3P_STAGE_INTERVALS`
2. Adicionar campos `engine`, `estagio`, `intervalo`, `ultimaRevisaoData` ao SRS
3. Migrar entradas existentes (mapear repeticoes → estagio inicial)
4. Reescrever `registrarRespostaSrsDiario()` → `atualizarSRS()` com lógica de estágios
5. Atualizar `ultimaRevisaoData` quando responder

### FASE 2: Filtro "Revisado Hoje" (CRÍTICO)
1. Modificar `contarDiarioProgramadoParaTema()` para excluir revisados hoje
2. Modificar `getEntradasParaRevisarHojeDiario()` para excluir revisados hoje
3. Implementar lógica de reset (meia-noite ou primeiro acesso do dia)

### FASE 3: UI/UX (IMPORTANTE)
1. Adicionar checkbox "Incluir nas revisões" ao formulário
2. Ajustar layout dos botões (horizontal, cores)
3. Adicionar tooltips
4. Ajustar box "Revisões do Dia" (já existe, só ajustar)

### FASE 4: Painel de Retenção (FUTURO)
1. Criar aba/seção para Painel
2. Implementar funções `estimarRetencao()` e `classificarStatusRevisao()`
3. Criar gráficos (Card global, Termômetro, Distribuição, Mini-card)

### FASE 5: Export/Import (FUTURO)
1. Criar função de export JSON completo
2. Criar função de import com preview
3. Validação e tratamento de erros

---

## ⚠️ PONTOS DE ATENÇÃO

### Migração de Dados
- **CRÍTICO**: Entradas existentes têm `srs.repeticoes` mas não têm `estagio`
- **SOLUÇÃO NECESSÁRIA**: Função de migração que mapeia repeticoes → estagio inicial
- **RISCO**: Perder histórico de revisões se migração for incorreta

### Compatibilidade
- **CRÍTICO**: Código atual usa `registrarRespostaSrsDiario()` baseado em repeticoes
- **SOLUÇÃO NECESSÁRIA**: Substituir completamente ou criar compatibilidade
- **RISCO**: Quebrar funcionalidades existentes

### Performance
- **ATENÇÃO**: Função `estimarRetencao()` será chamada para cada entrada
- **IMPACTO**: Com muitas entradas, pode ser lento
- **SOLUÇÃO**: Cache ou cálculo sob demanda

### Testes
- **OBRIGATÓRIO**: Testar migração de dados existentes
- **OBRIGATÓRIO**: Testar filtro "revisado hoje" funciona corretamente
- **OBRIGATÓRIO**: Testar reset no dia seguinte

---

## ✅ CONFIRMAÇÕES NECESSÁRIAS

1. **Migração de dados**: Como tratar entradas existentes com `repeticoes`?
2. **Filtro "revisado hoje"**: Como identificar? `ultimaRevisaoData === hoje`?
3. **Reset diário**: Quando resetar? Meia-noite ou primeiro acesso?
4. **Substituição de função**: Substituir `registrarRespostaSrsDiario()` completamente?
5. **Ordem de implementação**: Fazer tudo de uma vez ou por fases?
6. **Painel de Retenção**: Implementar agora ou deixar para depois?
7. **Export/Import**: Implementar agora ou depois?

---

**RELATÓRIO GERADO PARA VALIDAÇÃO COM CHATGPT**

**Próximo passo:** Aguardar validação e esclarecimento de dúvidas antes de executar.

