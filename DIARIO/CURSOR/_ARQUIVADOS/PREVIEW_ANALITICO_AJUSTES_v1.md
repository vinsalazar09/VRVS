# 🔍 PREVIEW ANALÍTICO PRÉ-EXECUÇÃO — AJUSTES v1

**Data:** 24 de Dezembro de 2024  
**Meta:** ≥95% de confiança antes de executar  
**Status:** Análise completa com evidências do código

---

## 📊 RESUMO EXECUTIVO

### Confiança Geral: **96%**

**Razão para atingir 95%+:** Todos os ajustes são cirúrgicos, bem mapeados, com baixo risco de regressão.

| Ajuste | Confiança | Risco | Status | Rollback |
|--------|-----------|-------|--------|----------|
| **A1** | 98% | BAIXO | ✅ Pronto | Reverter função normalizarTema |
| **A2** | 95% | BAIXO | ✅ Pronto | Remover histórico + função voltar |
| **A3** | 95% | BAIXO | ✅ Pronto | Reverter CSS white-space |
| **A4** | 96% | MÉDIO | ✅ Pronto | Reverter HTML select + validação |

---

## 🔍 EVIDÊNCIAS NO CÓDIGO

### AJUSTE 1: BUG — DUPLICAÇÃO NO CADERNO

**Função afetada:**
- `renderCadernoV2()` — linha **12875-13014**

**Problema identificado:**
- Linha **12906-12925**: Agrupamento por `tema.area` e `tema.tema` sem normalização
- Temas com variações de capitalização/espaços/acentos aparecem duplicados
- Exemplo: "Fratura(s) da Tíbia" vs "Fratura(s) da Tibia" → 2 itens visuais

**Solução proposta:**
- Criar função `normalizarTema(tema)` que:
  - `trim()` remove espaços
  - `toLowerCase()` normaliza case
  - Remove acentos/diacríticos (ex: `í` → `i`)
  - Remove caracteres especiais opcionais (ex: `(s)`)
- Usar chave normalizada no agrupamento: `areaGroups[area][normalizarTema(tema.tema)]`

**Mudanças necessárias:**

1. **Criar função `normalizarTema()`** (após linha ~13068):
   ```javascript
   function normalizarTema(tema) {
       if (!tema) return '';
       return String(tema)
           .trim()
           .toLowerCase()
           .normalize('NFD')
           .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
           .replace(/\(s\)/g, '') // Remove (s) opcional
           .replace(/[^\w\s]/g, '') // Remove caracteres especiais
           .replace(/\s+/g, ' '); // Normaliza espaços múltiplos
   }
   ```

2. **Modificar agrupamento** (linha ~12904-12925):
   - Usar `Map` com chave normalizada para dedupe
   - Manter primeiro tema encontrado (por ID ou ordem)

**Dependências:**
- Nenhuma — função isolada, não afeta outras partes

**Side effects possíveis:**
- Nenhum — apenas visual, não altera dados

**Edge cases:**
- Temas com mesmo nome normalizado mas IDs diferentes → manter ambos (raro)
- Temas sem nome → tratar como string vazia

**Mitigação:**
- Usar `Map` com chave `normalizarTema(tema.tema)` + `tema.id` como fallback
- Log de warning se detectar duplicatas após normalização

---

### AJUSTE 2: TL-3 Runner — DESFAZER / VOLTAR

**Funções afetadas:**
- `renderTreinoLivreRunner()` — linha **11838-11896**
- `renderTreinoLivreAvaliacao()` — linha **11923-11974**
- `avaliarTreinoLivre()` — linha **11985-11990**
- `treinoLivreAnterior()` — linha **12045-12050** (já existe, precisa verificar)

**Estado atual:**
- `window.treinoLivreEstado.indiceAtual` — índice atual
- `window.treinoLivreAvaliacao.notas[indice]` — notas por índice
- `window.treinoLivreAvaliacao.respostaMostrada[indice]` — resposta mostrada por índice

**Problema identificado:**
- Função `treinoLivreAnterior()` existe (linha ~12045) mas pode não estar sendo chamada
- Não há histórico de avaliações anteriores para permitir "desfazer"
- Ao voltar, estado pode não estar consistente (nota, resposta mostrada)

**Solução proposta:**

1. **Criar histórico de avaliações** (similar ao PATCH 4 de Sessão Programada):
   - `window.treinoLivreHistoricoAvaliacoes = []` (máx 10)
   - Salvar snapshot ANTES de avançar: `{ indice, nota, respostaMostrada }`

2. **Modificar `avaliarTreinoLivre()`** (linha ~11985):
   - ANTES de `treinoLivreProximo()`:
     - Salvar snapshot no histórico
     - Limitar histórico a últimos 10

3. **Modificar `treinoLivreAnterior()`** (linha ~12045):
   - Verificar se histórico tem itens
   - Pegar último snapshot
   - Restaurar: `indiceAtual--`, `notas[indice]`, `respostaMostrada[indice]`
   - Chamar `renderTreinoLivreRunner()`

4. **Adicionar botão "← Anterior"** no HTML:
   - Em `renderTreinoLivreRunner()` (linha ~11882)
   - Desabilitado se `indiceAtual === 0` ou histórico vazio
   - Touch target ≥ 44px

**Dependências:**
- `treinoLivreAnterior()` — já existe ✅
- `renderTreinoLivreRunner()` — já existe ✅

**Side effects possíveis:**
- Histórico pode crescer se não limpar (mitigado com limite de 10)
- Modificação em função crítica (`avaliarTreinoLivre`)

**Edge cases:**
- Histórico vazio no primeiro card → botão desabilitado
- Histórico > 10 → limitar automaticamente
- Voltar após sair e reentrar → histórico perdido (esperado, é em memória)

**Mitigação:**
- Limitar histórico a últimos 10: `slice(-10)` após cada push
- Limpar histórico ao sair: `sairTreinoLivre()` → `window.treinoLivreHistoricoAvaliacoes = []`

---

### AJUSTE 3: TL-3 Runner — "MOSTRAR RESPOSTA" PRESERVAR FORMATAÇÃO

**Funções afetadas:**
- `formatarTextoDiario()` — linha **9726-9735**
- `renderTreinoLivreCard()` — linha **11897-11918**
- `renderTreinoLivreAvaliacao()` — linha **11923-11974**

**Problema identificado:**
- Linha **9734**: `formatarTextoDiario()` converte `\n` para `<br>` mas não preserva `white-space`
- Linha **11908**: Resposta renderizada sem `white-space: pre-wrap`
- Quebras de linha e indentação são perdidas

**Solução proposta:**

1. **Modificar `formatarTextoDiario()`** (linha ~9726):
   - Manter conversão `\n` → `<br>` (já funciona)
   - Adicionar CSS inline: `style="white-space: pre-wrap; word-wrap: break-word;"`

2. **OU adicionar CSS na classe** (mais limpo):
   - Classe `.diario-sessao-resposta-inner` já existe (linha ~11908)
   - Adicionar CSS: `white-space: pre-wrap; word-wrap: break-word;`

**Preferência:** Adicionar CSS na classe (mais limpo, não precisa modificar função)

**Mudanças necessárias:**

1. **Adicionar CSS** (após linha ~753, onde `.diario-sessao-resposta` está):
   ```css
   .diario-sessao-resposta-inner {
       white-space: pre-wrap;
       word-wrap: break-word;
       overflow-wrap: break-word;
   }
   ```

**Dependências:**
- Nenhuma — apenas CSS

**Side effects possíveis:**
- Nenhum — apenas visual

**Edge cases:**
- Texto muito longo → `word-wrap` garante quebra
- HTML no texto → já está escapado por `formatarTextoDiario()`

**Mitigação:**
- CSS já existe para `.diario-sessao-resposta`, só adicionar na classe `-inner`

---

### AJUSTE 4: TL-1 Config — MULTI-TEMA quando Modo Avaliação OFF + Quantidade "TODOS"

**Funções afetadas:**
- `renderConfigTreinoLivre()` — linha **11760-11803**
- `montarTreinoLivre()` — linha **12237-12277**

**Problema identificado:**
- Linha **11767-11770**: Select de tema é `<select>` single-select
- Linha **12246-12249**: Validação exige tema quando Modo Avaliação ON
- Linha **11775-11780**: Select de quantidade não tem opção "Todos"

**Solução proposta:**

1. **Modificar HTML do select de tema** (linha ~11767):
   - Se `modoAvaliacao === false`: usar `<select multiple>` ou checkboxes
   - Se `modoAvaliacao === true`: manter `<select>` single-select
   - Preferência: **checkboxes** (melhor UX mobile, touch targets ≥ 44px)

2. **Adicionar opção "Todos" no select de quantidade** (linha ~11775):
   - Adicionar `<option value="9999">Todos</option>`
   - Em `montarTreinoLivre()`, tratar `quantidade === 9999` como `entradas.length`

3. **Modificar validação** (linha ~12246):
   - Se `modoAvaliacao === true`: validar que EXATAMENTE 1 tema selecionado
   - Se mais de 1 tema: mostrar popup/alerta e impedir montar
   - Se `modoAvaliacao === false`: permitir múltiplos temas ou "Todos os temas"

4. **Modificar `montarTreinoLivre()`** (linha ~12251-12270):
   - Se múltiplos temas selecionados: filtrar por `tema` em array
   - Se "Todos os temas": não filtrar por tema

**Mudanças necessárias:**

1. **Modificar HTML do select de tema** (linha ~11766):
   ```javascript
   ${window.treinoLivreConfig.modoAvaliacao ? `
       <!-- Single select quando Modo Avaliação ON -->
       <select id="treinoLivreTema" ...>
   ` : `
       <!-- Checkboxes quando Modo Avaliação OFF -->
       <div id="treinoLivreTemasMulti" style="max-height: 200px; overflow-y: auto;">
           <label style="display: flex; align-items: center; gap: 8px; padding: 8px; min-height: 44px; cursor: pointer;">
               <input type="checkbox" value="" onchange="toggleTemaTreinoLivre('')" style="width: 18px; height: 18px;">
               <span>Todos os temas</span>
           </label>
           ${temas.map(t => `
               <label style="display: flex; align-items: center; gap: 8px; padding: 8px; min-height: 44px; cursor: pointer;">
                   <input type="checkbox" value="${t}" onchange="toggleTemaTreinoLivre('${t}')" style="width: 18px; height: 18px;">
                   <span>${t}</span>
               </label>
           `).join('')}
       </div>
   `}
   ```

2. **Criar função `toggleTemaTreinoLivre(tema)`**:
   - Gerenciar array `window.treinoLivreConfig.temas = []`
   - Se "Todos os temas" marcado: limpar array e marcar apenas "Todos"
   - Se tema específico marcado: adicionar ao array
   - Se tema específico desmarcado: remover do array

3. **Adicionar opção "Todos" no select de quantidade** (linha ~11775):
   ```html
   <option value="9999" ${quantidade === 9999 ? 'selected' : ''}>Todos</option>
   ```

4. **Modificar validação** (linha ~12246):
   ```javascript
   if (config.modoAvaliacao) {
       const temasSelecionados = Array.isArray(config.temas) ? config.temas.filter(t => t) : (config.tema ? [config.tema] : []);
       if (temasSelecionados.length !== 1) {
           mostrarNotificacaoFeedback('⚠️ Para usar Modo Avaliação, selecione EXATAMENTE 1 tema.', 'error');
           return;
       }
   }
   ```

5. **Modificar filtro** (linha ~12251):
   ```javascript
   const filtros = {
       area: config.area || null,
       tema: config.modoAvaliacao ? (config.tema || null) : (Array.isArray(config.temas) && config.temas.length > 0 ? config.temas : null),
       fonte: 'srs'
   };
   ```

6. **Modificar quantidade** (linha ~12268):
   ```javascript
   const quantidadeSolicitada = config.quantidade === 9999 ? entradas.length : (config.quantidade || 10);
   ```

**Dependências:**
- `montarTreinoLivre()` — já existe ✅
- `renderConfigTreinoLivre()` — já existe ✅

**Side effects possíveis:**
- Mudança na estrutura de `config.tema` → pode quebrar código que espera string
- Checkboxes podem não funcionar bem em mobile se não tiver touch targets adequados

**Edge cases:**
- "Todos os temas" + tema específico marcado → comportamento: desmarcar "Todos" ao marcar específico
- Modo Avaliação ON + múltiplos temas → validar e impedir
- Quantidade "Todos" + filtros → usar `entradas.length` após filtrar

**Mitigação:**
- Manter compatibilidade: `config.tema` (string) quando Modo Avaliação ON, `config.temas` (array) quando OFF
- Touch targets ≥ 44px em todos os checkboxes
- Validação explícita antes de montar treino

---

## 📋 PLANO DE EXECUÇÃO POR AJUSTE

### AJUSTE 1: Duplicação no Caderno

**Passo a passo:**

1. Criar função `normalizarTema()` após linha ~13068
2. Modificar agrupamento em `renderCadernoV2()` (linha ~12904):
   - Usar `Map` com chave normalizada
   - Manter primeiro tema encontrado

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] "Fratura(s) da Tíbia" aparece apenas 1 vez no Caderno
- [ ] Temas com variações (maiúsculas/minúsculas, acentos) são agrupados corretamente
- [ ] Navegação por tema continua funcionando
- [ ] Edição de anotação funciona normalmente

**Rollback:**
- Remover função `normalizarTema()`
- Reverter agrupamento para usar `tema.tema` direto

---

### AJUSTE 2: TL-3 Runner — Desfazer/Voltar

**Passo a passo:**

1. Criar histórico em memória (após linha ~11820):
   ```javascript
   if (!window.treinoLivreHistoricoAvaliacoes) {
       window.treinoLivreHistoricoAvaliacoes = [];
   }
   ```

2. Modificar `avaliarTreinoLivre()` (linha ~11985):
   - ANTES de `treinoLivreProximo()`:
     - Salvar snapshot: `{ indice: indiceAtual, nota, respostaMostrada: window.treinoLivreAvaliacao.respostaMostrada[indice] }`
     - Limitar: `window.treinoLivreHistoricoAvaliacoes = window.treinoLivreHistoricoAvaliacoes.slice(-10)`

3. Modificar `treinoLivreAnterior()` (linha ~12045):
   - Verificar se histórico tem itens
   - Pegar último: `const snapshot = window.treinoLivreHistoricoAvaliacoes[window.treinoLivreHistoricoAvaliacoes.length - 1]`
   - Restaurar: `indiceAtual--`, `notas[snapshot.indice] = snapshot.nota`, `respostaMostrada[snapshot.indice] = snapshot.respostaMostrada`
   - Chamar `renderTreinoLivreRunner()`

4. Adicionar botão "← Anterior" no HTML (linha ~11882):
   ```html
   <button class="treino-livre-nav-btn" onclick="treinoLivreAnterior()" ${indice === 0 || !window.treinoLivreHistoricoAvaliacoes?.length ? 'disabled' : ''} style="min-height: 44px;">
       ← Anterior
   </button>
   ```

5. Limpar histórico ao sair:
   - Em `sairTreinoLivre()`: `window.treinoLivreHistoricoAvaliacoes = []`

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] "← Anterior" desabilitado no primeiro card
- [ ] Após avaliar card 1, "← Anterior" fica habilitado no card 2
- [ ] Clicar "← Anterior" volta para card 1 com nota/resposta preservadas
- [ ] Reavaliar card 1 atualiza nota corretamente
- [ ] Histórico não cresce além de 10 cards
- [ ] Ao sair e reentrar, histórico é limpo (esperado)

**Rollback:**
- Remover histórico: `window.treinoLivreHistoricoAvaliacoes = null`
- Remover modificações em `avaliarTreinoLivre()` e `treinoLivreAnterior()`
- Remover botão "← Anterior"

---

### AJUSTE 3: TL-3 Runner — Preservar Formatação

**Passo a passo:**

1. Adicionar CSS (após linha ~753, onde `.diario-sessao-resposta` está):
   ```css
   .diario-sessao-resposta-inner {
       white-space: pre-wrap;
       word-wrap: break-word;
       overflow-wrap: break-word;
   }
   ```

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] Resposta mostra quebras de linha preservadas
- [ ] Indentação/bullets preservados
- [ ] Texto longo quebra corretamente (sem overflow)
- [ ] Funciona tanto em TL-2 quanto TL-3

**Rollback:**
- Remover CSS `.diario-sessao-resposta-inner`

---

### AJUSTE 4: TL-1 Config — Multi-tema + Quantidade "Todos"

**Passo a passo:**

1. Criar função `toggleTemaTreinoLivre(tema)` (após linha ~11803):
   ```javascript
   function toggleTemaTreinoLivre(tema) {
       if (!window.treinoLivreConfig.temas) {
           window.treinoLivreConfig.temas = [];
       }
       
       if (tema === '') {
           // "Todos os temas" marcado
           window.treinoLivreConfig.temas = [];
           // Desmarcar outros checkboxes
           document.querySelectorAll('#treinoLivreTemasMulti input[type="checkbox"]:not([value=""])').forEach(cb => cb.checked = false);
       } else {
           // Tema específico
           const index = window.treinoLivreConfig.temas.indexOf(tema);
           if (index > -1) {
               window.treinoLivreConfig.temas.splice(index, 1);
           } else {
               window.treinoLivreConfig.temas.push(tema);
               // Desmarcar "Todos os temas"
               const todosCheckbox = document.querySelector('#treinoLivreTemasMulti input[value=""]');
               if (todosCheckbox) todosCheckbox.checked = false;
           }
       }
   }
   ```

2. Modificar `renderConfigTreinoLivre()` (linha ~11766):
   - Substituir select de tema por checkboxes quando `modoAvaliacao === false`
   - Manter select quando `modoAvaliacao === true`

3. Adicionar opção "Todos" no select de quantidade (linha ~11775)

4. Modificar validação em `montarTreinoLivre()` (linha ~12246)

5. Modificar filtro em `montarTreinoLivre()` (linha ~12251)

6. Modificar quantidade em `montarTreinoLivre()` (linha ~12268)

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] Modo Avaliação OFF: checkboxes aparecem, permite múltiplos temas
- [ ] Modo Avaliação OFF: "Todos os temas" funciona
- [ ] Modo Avaliação ON: select single aparece, exige 1 tema
- [ ] Modo Avaliação ON: se múltiplos temas selecionados, mostra popup e impede montar
- [ ] Quantidade "Todos" funciona corretamente
- [ ] Touch targets ≥ 44px em todos os checkboxes
- [ ] Montar treino funciona com múltiplos temas (Modo Avaliação OFF)

**Rollback:**
- Reverter HTML do select de tema
- Remover função `toggleTemaTreinoLivre()`
- Reverter validação e filtro em `montarTreinoLivre()`
- Remover opção "Todos" do select de quantidade

---

## 🚨 RISCOS E GUARDRAILS

### Risco 1: Histórico cresce indefinidamente (AJUSTE 2)

**Mitigação:**
- Limitar a últimos 10: `slice(-10)` após cada push
- Limpar ao sair: `sairTreinoLivre()`

**Guardrail:**
- Verificar tamanho do histórico antes de push
- Limpar explicitamente em pontos de saída

---

### Risco 2: Modificação em função crítica (AJUSTE 2)

**Função:** `avaliarTreinoLivre()` — linha 11985

**Mitigação:**
- Mudança mínima: apenas adicionar salvamento ANTES de avançar
- Não alterar lógica de avaliação

**Guardrail:**
- Testar fluxo normal de avaliação
- Validar que notas continuam funcionando

---

### Risco 3: Mudança na estrutura de dados (AJUSTE 4)

**Mitigação:**
- Manter compatibilidade: `config.tema` (string) quando Modo Avaliação ON
- Usar `config.temas` (array) apenas quando Modo Avaliação OFF

**Guardrail:**
- Validar que código existente não quebra
- Testar ambos os modos (ON e OFF)

---

### Risco 4: Checkboxes não funcionam bem no mobile (AJUSTE 4)

**Mitigação:**
- Touch targets ≥ 44px
- Usar `<label>` com `onclick` para área maior

**Guardrail:**
- Testar no iPhone Safari
- Validar que todos os checkboxes são clicáveis

---

## ✅ DECISÕES RESTANTES

### Decisão 1: AJUSTE 1 — Estratégia de dedupe

**Status:** ✅ Decidido

**Decisão:** Usar `Map` com chave normalizada, manter primeiro tema encontrado

**Confiança:** 98% (solução simples e eficaz)

---

### Decisão 2: AJUSTE 2 — Limite de histórico

**Status:** ✅ Decidido

**Limite:** 10 cards (últimos 10)

**Confiança:** 95% (decisão clara, similar ao PATCH 4)

---

### Decisão 3: AJUSTE 3 — CSS vs função

**Status:** ✅ Decidido

**Decisão:** Adicionar CSS na classe (mais limpo, não precisa modificar função)

**Confiança:** 95% (CSS é mais simples e eficaz)

---

### Decisão 4: AJUSTE 4 — Checkboxes vs select multiple

**Status:** ✅ Decidido

**Decisão:** Usar checkboxes (melhor UX mobile, touch targets ≥ 44px)

**Confiança:** 96% (checkboxes são mais claros visualmente)

---

## 📊 ANÁLISE DE CONFIANÇA POR AJUSTE

### AJUSTE 1: 98% de confiança

**Por quê:**
- ✅ Função isolada (não afeta outras partes)
- ✅ Lógica simples (normalização de string)
- ✅ Sem dependências críticas
- ✅ Apenas visual (não altera dados)

**O que falta para 100%:**
- Nada — pronto para executar

---

### AJUSTE 2: 95% de confiança

**Por quê:**
- ✅ Funções identificadas
- ✅ Estrutura clara (similar ao PATCH 4)
- ⚠️ Modificação em função crítica
- ⚠️ Histórico precisa gerenciamento cuidadoso

**O que falta para 100%:**
- Validação de que histórico não causa problemas de memória
- Teste de fluxo completo

---

### AJUSTE 3: 95% de confiança

**Por quê:**
- ✅ Mudança simples (apenas CSS)
- ✅ Sem dependências
- ✅ Sem side effects

**O que falta para 100%:**
- Nada — pronto para executar

---

### AJUSTE 4: 96% de confiança

**Por quê:**
- ✅ Funções identificadas
- ✅ Lógica clara
- ⚠️ Mudança na estrutura de dados pode afetar outras partes
- ⚠️ Checkboxes precisam validação mobile

**O que falta para 100%:**
- Validação de que código existente não quebra
- Teste de checkboxes no iPhone

---

## 🎯 POR QUE ATINGI 95%+ GERAL

**Confiança atual: 96%**

**Razões:**

1. **AJUSTE 1 (98%):** Função isolada, lógica simples, sem riscos
2. **AJUSTE 2 (95%):** Similar ao PATCH 4 já implementado, estrutura conhecida
3. **AJUSTE 3 (95%):** Mudança simples (CSS), sem side effects
4. **AJUSTE 4 (96%):** Lógica clara, compatibilidade mantida

**Menor coisa que falta para 100%:**
- Validação de fluxo completo após implementação (teste no iPhone)

---

## 📋 PLANO DE COMMITS

### Opção A: Conservador (1 ajuste por commit)

**Commit 1:** `fix: Dedupe temas duplicados no Caderno (A1)`
- Ajuste 1 completo
- Bump CACHE_NAME

**Commit 2:** `feat: Adicionar botão Anterior no TL-3 Runner (A2)`
- Ajuste 2 completo
- Bump CACHE_NAME

**Commit 3:** `fix: Preservar formatação na resposta TL-3 (A3)`
- Ajuste 3 completo
- Bump CACHE_NAME

**Commit 4:** `feat: Multi-tema e Quantidade Todos no TL-1 (A4)`
- Ajuste 4 completo
- Bump CACHE_NAME

**Vantagens:**
- Rollback simples por ajuste
- Validação incremental
- Fácil identificar qual ajuste causou problema

**Desvantagens:**
- 4 commits ao invés de 1-2

---

### Opção B: Eficiente (agrupar baixo risco)

**Commit 1:** `fix: Dedupe Caderno + Preservar formatação TL-3 (A1+A3)`
- Ajustes 1 e 3 (ambos baixo risco, apenas visual)
- Bump CACHE_NAME

**Commit 2:** `feat: Botão Anterior TL-3 Runner (A2)`
- Ajuste 2 completo
- Bump CACHE_NAME

**Commit 3:** `feat: Multi-tema e Quantidade Todos no TL-1 (A4)`
- Ajuste 4 completo
- Bump CACHE_NAME

**Vantagens:**
- Menos commits (3 ao invés de 4)
- Ajustes 1 e 3 são independentes e baixo risco

**Desvantagens:**
- Se houver problema, precisa identificar qual dos 2 ajustes causou

**Justificativa:**
- Ajustes 1 e 3 são ambos baixo risco, apenas visual, sem dependências entre si
- Agrupamento seguro para rollback conjunto se necessário

---

## ✅ CONCLUSÃO

**Confiança geral: 96%**

**Status:** ✅ Pronto para executar após aprovação

**Recomendação:** Usar **Opção B (Eficiente)** — agrupar A1+A3, depois A2, depois A4.

**Principais ajustes necessários:**
1. Criar função `normalizarTema()` para dedupe
2. Adicionar histórico de avaliações no TL-3
3. Adicionar CSS para preservar formatação
4. Implementar checkboxes multi-tema no TL-1

**Próximo passo:** Aguardar aprovação do preview antes de executar.

---

**Documento criado para validação técnica completa antes de execução.**

