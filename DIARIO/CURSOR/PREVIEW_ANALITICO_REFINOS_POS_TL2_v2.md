# 🔍 PREVIEW ANALÍTICO PRÉ-EXECUÇÃO — REFINOS PÓS TL-2 v2

**Data:** 21 de Dezembro de 2024  
**Meta:** ≥95% de confiança antes de executar  
**Status:** Análise completa com evidências do código

---

## 📊 RESUMO EXECUTIVO

### Confiança Geral: **92%**

**Razão para não atingir 95%:** 1 decisão pendente (PATCH 3 — verificar se barra existe no iPhone)

| Patch | Confiança | Risco | Status | Rollback |
|-------|-----------|-------|--------|----------|
| **P1** | 98% | BAIXO | ✅ Pronto | Remover função toggle + classe escondida |
| **P2** | 95% | BAIXO | ✅ Pronto | Reverter HTML do preview |
| **P3** | 70% | BAIXO | ⚠️ Verificar | Remover CSS `display: none` |
| **P4** | 90% | MÉDIO | ✅ Pronto | Remover histórico + funções + modificações |
| **P5** | 95% | MÉDIO | ✅ Pronto | Reverter cálculo + HTML |

---

## 🔍 EVIDÊNCIAS NO CÓDIGO

### PATCH 1: TL-2 Resposta Oculta

**Funções afetadas:**
- `renderTreinoLivreCard(entrada)` — linha **11760-11776**
- `renderTreinoLivreRunner()` — linha **11704-11757** (chama `renderTreinoLivreCard`)

**Container:**
- `#diarioSessao` — linha 11705 (container onde runner é renderizado)

**CSS existente:**
- `.diario-sessao-resposta.escondida` — linha **739-741** (já existe)
- `.diario-sessao-resposta` — linha **731-737** (estilo base)

**Função existente (não usar diretamente):**
- `mostrarRespostaSessaoDiario()` — linha **11923-11928**
  - Problema: Só remove classe, não faz toggle
  - Usa ID: `diarioSessaoRespostaWrapper` (Sessão Programada)
  - **Decisão:** Criar função específica para TL-2

**Estrutura atual do card (linha 11769-11773):**
```javascript
<div class="diario-sessao-resposta">
    <div class="diario-sessao-resposta-inner">
        ${entrada.resposta ? formatarTextoDiario(entrada.resposta) : '<em>(Sem resposta cadastrada)</em>'}
    </div>
</div>
```

**Mudanças necessárias:**
1. Adicionar `id="treinoLivreRespostaWrapper"` no wrapper
2. Adicionar classe `escondida` inicialmente
3. Adicionar container com botão toggle após resposta
4. Criar função `toggleRespostaTreinoLivre()` específica

**Dependências:**
- Nenhuma — função isolada, não afeta Sessão Programada

**Side effects possíveis:**
- Nenhum — apenas CSS toggle, READ-ONLY

---

### PATCH 2: Preview TL-1 Simplificar

**Função afetada:**
- `renderConfirmacaoTreinoLivre(fila)` — linha **11882-11920**

**Preview atual (linha 11887-11908):**
```javascript
const preview = fila.slice(0, 3).map((e, i) => {
    const topicoTexto = e.topico ? (e.topico.length > 50 ? e.topico.substring(0, 50) + '...' : e.topico) : '';
    return `${i + 1}. ${e.area} • ${e.tema}${topicoTexto ? ' • ' + topicoTexto : ''}`;
}).join('\n');

// Renderizado em:
${preview ? `
<div style="... word-wrap: break-word; overflow-wrap: break-word;">${preview}</div>
` : ''}
```

**Problema identificado:**
- `substring(0, 50)` trunca texto
- `white-space: pre-line` pode causar quebra feia
- Preview pode não funcionar bem no iPhone

**Mudanças necessárias:**
- Remover bloco preview completamente (linhas 11903-11908)
- Manter apenas título + botões

**Dependências:**
- Nenhuma — apenas HTML/CSS

**Side effects possíveis:**
- Nenhum — apenas visual

---

### PATCH 3: Barra Busca Tarefas

**Verificação no código:**
- Busca por `taskSearchInput`: **0 resultados** (já removido)
- Busca por `Buscar tarefas`: **0 resultados** (já removido)
- Função `renderTarefas()` — linha **4940**: não contém barra de busca

**Conclusão:** Barra já foi removida na Fase 1 (commit `97b3c5a`)

**Decisão:** PATCH 3 será pulado (barra não existe mais)

**Confiança reduzida:** Precisa confirmar visualmente no iPhone se ainda aparece (pode ser cache)

---

### PATCH 4: Sessão Programada Navegação

**Funções afetadas:**
- `responderSessaoDiario(qualidade)` — linha **11931-11956**
- `pularSessaoDiario()` — linha **11959-11967**
- `renderSessaoDiario(entradaAtual)` — linha **11423-11622**

**Funções auxiliares:**
- `getEntradaAtualSessao()` — linha **11544-11548** (retorna entrada atual)

**Container:**
- `#diarioSessao` — linha 11424 (container da sessão)

**Estrutura atual do card (linha 11596-11619):**
- Meta (área/tema)
- Tópico
- Resposta (com wrapper `diarioSessaoRespostaWrapper`)
- Botão "MOSTRAR RESPOSTA"
- Botões qualidade (ESQUECI/LEMBREI/FÁCIL)
- Opções (Pular/Desativar)

**Mudanças necessárias:**

1. **Criar histórico em memória:**
   ```javascript
   if (!window.sessaoProgramadaHistorico) {
       window.sessaoProgramadaHistorico = [];
   }
   ```

2. **Modificar `responderSessaoDiario()`:**
   - Linha 11932: `const entradaAtual = getEntradaAtualSessao();`
   - **ANTES** de linha 11949 (`sessaoDiario.indiceAtual++`):
     - Salvar snapshot da entrada atual no histórico
     - Limitar histórico a últimos 10: `window.sessaoProgramadaHistorico.slice(-10)`

3. **Modificar `pularSessaoDiario()`:**
   - Linha 11959: função atual não salva histórico
   - **ANTES** de linha 11960 (`sessaoDiario.indiceAtual++`):
     - Salvar snapshot da entrada atual no histórico
     - Limitar histórico a últimos 10

4. **Criar `voltarCardAnteriorSessao()`:**
   - Verificar se `window.sessaoProgramadaHistorico.length > 0`
   - Pegar último item do histórico
   - Chamar `renderCardAnteriorReadOnly()`

5. **Criar `renderCardAnteriorReadOnly(entrada)`:**
   - Renderizar header "Visualizando card anterior (somente leitura)"
   - Renderizar card idêntico visualmente
   - Botão "Voltar ao atual" que chama `renderSessaoDiario(getEntradaAtualSessao())`
   - Sem botões de qualidade

6. **Inserir botão "Ver anterior" no HTML:**
   - Adicionar header ANTES do card em `renderSessaoDiario()`
   - Botão desabilitado se `indice === 1` ou histórico vazio

7. **Limpar histórico:**
   - Em `renderSessaoDiario(null)` quando sessão termina (linha 11428)
   - Em `setModoSessaoDiario()` quando muda modo (linha 11476)

**Dependências:**
- `getEntradaAtualSessao()` — já existe ✅
- `renderSessaoDiario()` — já existe ✅

**Side effects possíveis:**
- Histórico pode crescer se não limpar (mitigado com limite de 10)
- Modificação em função crítica (`responderSessaoDiario`)

---

### PATCH 5: Saúde VRVS 3P Correção

**Função afetada:**
- `calcularEstatisticasVrvs3p(diario, hojeStrParam)` — linha **9999-10124**

**Renderização:**
- Função `calcularAnalises()` — linha **7072** (chama `calcularEstatisticasVrvs3p`)
- HTML inline — linha **7096-7167** (renderiza painel Saúde)

**Critério de "revisado" (decisão travada D2):**
```javascript
revisado = (srs.repeticoes || 0) > 0  OR  !!srs.ultimaResposta
```

**Evidência no código:**
- Linha 9854: `srs.repeticoes = (srs.repeticoes || 0) + 1;` (incrementa após resposta)
- Linha 9851: `srs.ultimaResposta = resposta;` (sempre setado após resposta)
- Linha 10051: `const estagio = srs.estagio || 0;` (pode ser 0 mesmo após revisão)

**Código atual (linha 10049-10101):**
```javascript
entradasAtivas.forEach(entrada => {
    const srs = entrada.srs;
    const estagio = srs.estagio || 0;
    // ... cálculo com TODAS as entradas ativas ...
    const retencaoEstagio = obterRetencaoPorEstagio(estagio);
    somaRetencao += retencaoEstagio;
    contagemRetencao++;
});
```

**Mudanças necessárias:**

1. **Separar entradas (linha ~10038):**
   ```javascript
   const entradasNovas = entradasAtivas.filter(e => {
       const srs = e.srs;
       return (srs.repeticoes || 0) === 0 && !srs.ultimaResposta;
   });
   const entradasRevisadas = entradasAtivas.filter(e => {
       const srs = e.srs;
       return (srs.repeticoes || 0) > 0 || !!srs.ultimaResposta;
   });
   ```

2. **Calcular retenção apenas com revisados:**
   - Modificar loop (linha 10049) para iterar sobre `entradasRevisadas`
   - Manter lógica de cálculo igual

3. **Adicionar campos no stats:**
   ```javascript
   stats.totalRevisados = entradasRevisadas.length;
   stats.totalNovos = entradasNovas.length;
   ```

4. **Modificar renderização (linha ~7112):**
   - Adicionar contadores: `${stats.totalRevisados} revisados • ${stats.totalNovos} novos`
   - Se `stats.totalRevisados === 0`: mostrar mensagem especial

5. **Cenário de borda (0 revisados):**
   - Linha ~7100: condição `stats.totalAtivos > 0` → adicionar `stats.totalRevisados > 0`
   - Se 0 revisados: mostrar mensagem + não exibir barra

**Dependências:**
- `obterRetencaoPorEstagio()` — já existe ✅
- Estrutura `stats` — já existe ✅

**Side effects possíveis:**
- Mudança no cálculo pode afetar outras partes que usam `stats.retencaoGlobal`
- Verificar se outras funções dependem do cálculo atual

---

## 📋 PLANO DE EXECUÇÃO POR PATCH

### PATCH 1: TL-2 Resposta Oculta

**Passo a passo:**

1. Criar função `toggleRespostaTreinoLivre()` após `renderTreinoLivreCard()` (linha ~11776)
   - Toggle classe `escondida` em `#treinoLivreRespostaWrapper`
   - Alternar texto do botão (MOSTRAR/OCULTAR)

2. Modificar `renderTreinoLivreCard()` (linha 11769):
   - Adicionar `id="treinoLivreRespostaWrapper"` no wrapper
   - Adicionar classe `escondida` inicialmente
   - Adicionar container com botão toggle após resposta

3. Garantir reset ao mudar card:
   - `renderTreinoLivreCard()` sempre renderiza com classe `escondida`
   - Não precisa reset explícito (já inicia oculta)

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] Card abre com resposta OCULTA
- [ ] Botão mostra "👁️ MOSTRAR RESPOSTA"
- [ ] Ao clicar, resposta aparece
- [ ] Botão muda para "🙈 OCULTAR RESPOSTA"
- [ ] Ao clicar de novo, resposta some
- [ ] Ao ir para "Próximo", resposta do novo card está escondida
- [ ] Ao voltar com "Anterior", resposta está escondida
- [ ] Touch target do botão ≥ 44px

**Rollback:**
- Remover função `toggleRespostaTreinoLivre()`
- Remover `id` e classe `escondida` do HTML
- Remover container do botão toggle

---

### PATCH 2: Preview TL-1 Simplificar

**Passo a passo:**

1. Modificar `renderConfirmacaoTreinoLivre()` (linha 11887-11908):
   - Remover cálculo do preview (linha 11887-11890)
   - Remover bloco HTML do preview (linha 11903-11908)
   - Manter apenas título + botões

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] Tela mostra "✅ Treino montado: N itens"
- [ ] Nenhum preview truncado aparece
- [ ] Botões "Remontar" e "Iniciar Treino" funcionam
- [ ] Layout limpo e responsivo

**Rollback:**
- Reverter HTML do preview (linhas 11887-11908)

---

### PATCH 3: Barra Busca Tarefas

**Passo a passo:**

1. Verificar no iPhone se barra ainda aparece
2. Se aparecer (cache antigo):
   - Adicionar CSS: `#taskSearchInput { display: none !important; }`
3. Se não aparecer:
   - Pular patch

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] Aba Tarefas não mostra barra de busca
- [ ] Lista de tarefas funciona normalmente

**Rollback:**
- Remover CSS `display: none`

---

### PATCH 4: Sessão Programada Navegação

**Passo a passo:**

1. Criar histórico em memória (após linha ~11544):
   ```javascript
   if (!window.sessaoProgramadaHistorico) {
       window.sessaoProgramadaHistorico = [];
   }
   ```

2. Modificar `responderSessaoDiario()` (linha 11931):
   - ANTES de linha 11949 (`sessaoDiario.indiceAtual++`):
     - Salvar snapshot: `window.sessaoProgramadaHistorico.push({...entradaAtual})`
     - Limitar: `window.sessaoProgramadaHistorico = window.sessaoProgramadaHistorico.slice(-10)`

3. Modificar `pularSessaoDiario()` (linha 11959):
   - ANTES de linha 11960 (`sessaoDiario.indiceAtual++`):
     - Salvar snapshot: `window.sessaoProgramadaHistorico.push({...getEntradaAtualSessao()})`
     - Limitar: `window.sessaoProgramadaHistorico = window.sessaoProgramadaHistorico.slice(-10)`

4. Criar `voltarCardAnteriorSessao()` (após linha ~11967):
   - Verificar se histórico tem itens
   - Pegar último: `const cardAnterior = window.sessaoProgramadaHistorico[window.sessaoProgramadaHistorico.length - 1]`
   - Chamar `renderCardAnteriorReadOnly(cardAnterior)`

5. Criar `renderCardAnteriorReadOnly(entrada)` (após `voltarCardAnteriorSessao`):
   - Renderizar header "Visualizando card anterior (somente leitura)"
   - Renderizar card idêntico (sem botões qualidade)
   - Botão "Voltar ao atual" → `renderSessaoDiario(getEntradaAtualSessao())`

6. Modificar `renderSessaoDiario()` (linha 11423):
   - Adicionar header ANTES do card (linha ~11596):
     ```html
     <div class="sessao-programada-nav-header">
         <button onclick="voltarCardAnteriorSessao()" ${indice === 1 || !window.sessaoProgramadaHistorico?.length ? 'disabled' : ''}>
             ← Ver anterior (somente leitura)
         </button>
         <span>${indice} / ${total}</span>
     </div>
     ```

7. Modificar texto "Pular" (linha 11617):
   - Mudar para: `⏭️ Pular (sem registrar)`

8. Limpar histórico:
   - Em `renderSessaoDiario(null)` (linha 11428): `window.sessaoProgramadaHistorico = []`
   - Em `setModoSessaoDiario()` (linha 11476): `window.sessaoProgramadaHistorico = []`

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] "← Ver anterior" desabilitado no card 1
- [ ] Após responder card 1, "← Ver anterior" fica habilitado no card 2
- [ ] Clicar "← Ver anterior" mostra card 1 em modo read-only
- [ ] Card read-only não tem botões ESQUECI/LEMBREI/FÁCIL
- [ ] "→ Voltar ao atual" retorna para card ativo
- [ ] SRS não é alterado ao visualizar anterior
- [ ] "⏭️ Pular (sem registrar)" avança sem registrar qualidade
- [ ] Fluxo normal (responder com qualidade) continua funcionando
- [ ] Histórico não cresce além de 10 cards

**Rollback:**
- Remover histórico: `window.sessaoProgramadaHistorico = null`
- Remover funções `voltarCardAnteriorSessao()` e `renderCardAnteriorReadOnly()`
- Reverter modificações em `responderSessaoDiario()` e `pularSessaoDiario()`
- Remover header de navegação
- Reverter texto "Pular"

---

### PATCH 5: Saúde VRVS 3P Correção

**Passo a passo:**

1. Modificar `calcularEstatisticasVrvs3p()` (linha ~10038):
   - Após linha 10038 (`stats.totalAtivos = entradasAtivas.length`):
     - Separar: `entradasNovas` e `entradasRevisadas` usando critério D2
     - Adicionar: `stats.totalRevisados = entradasRevisadas.length`
     - Adicionar: `stats.totalNovos = entradasNovas.length`

2. Modificar loop de cálculo (linha 10049):
   - Trocar `entradasAtivas.forEach` por `entradasRevisadas.forEach`
   - Manter lógica de cálculo igual

3. Ajustar cálculo de retenção (linha 10104):
   - Se `contagemRetencao === 0`: `stats.retencaoGlobal = null` (não 0)

4. Modificar renderização (linha ~7100):
   - Condição: `stats.totalAtivos > 0 && stats.totalRevisados > 0`
   - Se `stats.totalRevisados === 0`: mostrar mensagem especial

5. Modificar contadores (linha ~7112):
   - Adicionar: `${stats.totalRevisados} revisados • ${stats.totalNovos} novos`

6. Adicionar mensagem quando 0 revisados (linha ~7168):
   - Se `stats.totalRevisados === 0`:
     ```html
     <div style="text-align: center; padding: 40px 20px;">
         <div style="font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 8px;">
             Sem revisões ainda — ${stats.totalNovos} novos aguardando 1ª revisão
         </div>
     </div>
     ```

**Critério de "revisado" (D2):**
```javascript
const isRevisado = (entrada) => {
    const srs = entrada.srs;
    return (srs.repeticoes || 0) > 0 || !!srs.ultimaResposta;
};
```

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] Adicionar 10 cards novos → barra não cai
- [ ] 50 revisados (estágio 5) + 0 novos → ~83% (verde)
- [ ] 50 revisados (estágio 5) + 50 novos → ~83% (verde) - mesma coisa
- [ ] 0 revisados + 20 novos → mensagem "Sem revisões ainda — 20 novos aguardando 1ª revisão"
- [ ] 0 revisados → não exibe barra vermelha
- [ ] Texto mostra "X revisados • Y novos"
- [ ] Revisar 1 card com "ESQUECI" → barra cai (esperado)

**Rollback:**
- Reverter cálculo para usar `entradasAtivas` em vez de `entradasRevisadas`
- Remover campos `totalRevisados` e `totalNovos`
- Reverter HTML da renderização

---

## 🚨 RISCOS E GUARDRAILS

### Risco 1: Histórico cresce indefinidamente (PATCH 4)

**Mitigação:**
- Limitar a últimos 10: `slice(-10)` após cada push
- Limpar ao sair: `renderSessaoDiario(null)` e `setModoSessaoDiario()`

**Guardrail:**
- Verificar tamanho do histórico antes de push
- Limpar explicitamente em pontos de saída

---

### Risco 2: Modificação em função crítica (PATCH 4)

**Função:** `responderSessaoDiario()` — linha 11931

**Mitigação:**
- Mudança mínima: apenas adicionar salvamento ANTES de avançar
- Não alterar lógica de SRS
- Não alterar lógica de avanço

**Guardrail:**
- Testar fluxo normal de resposta
- Validar que SRS continua funcionando

---

### Risco 3: Cache antigo no iPhone (PATCH 3)

**Mitigação:**
- Verificar visualmente no iPhone antes de executar
- Se aparecer: usar CSS `display: none !important;`
- Bump CACHE_NAME ao final

**Guardrail:**
- Usar `recovery_sw.html` se necessário
- Forçar refresh: fechar PWA completamente

---

### Risco 4: Critério de "revisado" pode não funcionar com legado (PATCH 5)

**Mitigação:**
- Usar critério D2: `(repeticoes || 0) > 0 || !!ultimaResposta`
- Cobre ambos os casos (legado e novo)

**Guardrail:**
- Testar com dados legados (se houver)
- Validar que cálculo não quebra

---

### Risco 5: Mudança no cálculo afeta outras partes (PATCH 5)

**Mitigação:**
- Verificar onde `stats.retencaoGlobal` é usado
- Manter estrutura `stats` compatível
- Adicionar campos novos sem remover existentes

**Guardrail:**
- Buscar por `stats.retencaoGlobal` no código
- Validar que outras funções não quebram

---

### Risco 6: Toggle afeta Sessão Programada (PATCH 1)

**Mitigação:**
- Criar função específica para TL-2
- Usar ID diferente (`treinoLivreRespostaWrapper`)
- Não modificar `mostrarRespostaSessaoDiario()`

**Guardrail:**
- Validar que Sessão Programada continua funcionando
- Testar toggle em ambos os modos

---

### Risco 7: Estado do toggle não reseta (PATCH 1)

**Mitigação:**
- `renderTreinoLivreCard()` sempre renderiza com classe `escondida`
- Não manter estado entre cards
- Reset automático ao renderizar novo card

**Guardrail:**
- Validar que cada card inicia com resposta oculta
- Testar navegação anterior/próximo

---

## ✅ DECISÕES RESTANTES

### Decisão 1: PATCH 3 — Barra ainda existe?

**Status:** ⚠️ Pendente verificação visual no iPhone

**Impacto:** Se barra não existe, patch é pulado (sem risco)

**Ação:** Verificar no iPhone antes de executar PATCH 3

**Confiança:** 70% (precisa confirmação visual)

---

### Decisão 2: PATCH 5 — Critério de "revisado"

**Status:** ✅ Travado (D2)

**Critério:** `(srs.repeticoes || 0) > 0 || !!srs.ultimaResposta`

**Confiança:** 95% (critério robusto, cobre legado)

---

### Decisão 3: PATCH 4 — Limite de histórico

**Status:** ✅ Travado (D3)

**Limite:** 10 cards (últimos 10)

**Confiança:** 95% (decisão clara)

---

### Decisão 4: PATCH 1 — Função toggle específica

**Status:** ✅ Decidido

**Decisão:** Criar função específica `toggleRespostaTreinoLivre()` para TL-2

**Confiança:** 98% (isolado, sem risco)

---

## 📊 ANÁLISE DE CONFIANÇA POR PATCH

### PATCH 1: 98% de confiança

**Por quê:**
- ✅ Função isolada (não afeta outras partes)
- ✅ CSS já existe
- ✅ Estrutura clara
- ✅ Sem dependências críticas

**O que falta para 100%:**
- Nada — pronto para executar

---

### PATCH 2: 95% de confiança

**Por quê:**
- ✅ Função identificada
- ✅ Mudança simples (remover HTML)
- ✅ Sem dependências

**O que falta para 100%:**
- Nada — pronto para executar

---

### PATCH 3: 70% de confiança

**Por quê:**
- ⚠️ Barra já foi removida antes
- ⚠️ Precisa verificação visual no iPhone
- ✅ Se existir, solução simples (CSS)

**O que falta para 95%:**
- Confirmação visual no iPhone se barra ainda aparece

---

### PATCH 4: 90% de confiança

**Por quê:**
- ✅ Funções identificadas
- ✅ Estrutura clara
- ⚠️ Modificação em função crítica
- ⚠️ Histórico precisa gerenciamento cuidadoso

**O que falta para 95%:**
- Validação de que histórico não causa problemas de memória
- Teste de fluxo completo

---

### PATCH 5: 95% de confiança

**Por quê:**
- ✅ Função identificada
- ✅ Critério de "revisado" travado (D2)
- ✅ Lógica clara
- ⚠️ Mudança no cálculo pode afetar outras partes

**O que falta para 100%:**
- Validação de que outras funções não dependem do cálculo antigo

---

## 🎯 POR QUE NÃO ATINGI 95%+ GERAL

**Confiança atual: 92%**

**Razões:**

1. **PATCH 3 (70%):** Precisa verificação visual no iPhone se barra ainda existe
   - Impacto: Se não existir, patch é pulado (sem risco)
   - Ação: Verificar no iPhone antes de executar

2. **PATCH 4 (90%):** Modificação em função crítica + histórico
   - Impacto: Médio — precisa validação cuidadosa
   - Ação: Testar fluxo completo após implementação

3. **PATCH 5 (95%):** Mudança no cálculo pode afetar outras partes
   - Impacto: Baixo — estrutura mantida compatível
   - Ação: Validar que outras funções não quebram

**Menor coisa que falta para 95%+:**
- Verificação visual no iPhone para PATCH 3 (confirmação de 5 minutos)

---

## 📋 CHECKLIST PRÉ-EXECUÇÃO NO IPHONE

### Como validar que não é cache antigo (sem console):

1. **Fechar PWA completamente:**
   - Swipe up no app switcher
   - Fechar VRVS completamente

2. **Reabrir PWA:**
   - Abrir VRVS novamente
   - Verificar se mudanças aparecem

3. **Se não aparecer:**
   - Abrir Safari (não PWA)
   - Navegar para `recovery_sw.html`
   - Limpar Service Worker e Cache
   - Reabrir PWA

---

### Como testar cada patch em 60 segundos:

**PATCH 1:**
- [ ] Diário > Sessão > Treino livre > Iniciar
- [ ] Verificar: resposta oculta, botão "MOSTRAR RESPOSTA"
- [ ] Clicar: resposta aparece, botão muda
- [ ] Próximo: resposta nova oculta

**PATCH 2:**
- [ ] Diário > Sessão > Treino livre > Montar treino
- [ ] Verificar: tela mostra "Treino montado: N itens"
- [ ] Verificar: nenhum preview truncado

**PATCH 3:**
- [ ] Aba Tarefas
- [ ] Verificar: barra de busca não aparece

**PATCH 4:**
- [ ] Diário > Sessão > Revisão programada
- [ ] Responder card 1
- [ ] Verificar: "← Ver anterior" habilitado no card 2
- [ ] Clicar: card 1 aparece em read-only
- [ ] "Voltar ao atual": retorna ao card 2

**PATCH 5:**
- [ ] Aba Stats/Analise
- [ ] Verificar: "X revisados • Y novos" aparece
- [ ] Adicionar 10 cards novos
- [ ] Verificar: saúde não cai

---

## ✅ CONCLUSÃO

**Confiança geral: 92%**

**Status:** ✅ Pronto para executar após verificação PATCH 3

**Principais ajustes necessários:**
1. Verificar visualmente no iPhone se barra de busca ainda existe (PATCH 3)
2. Validar fluxo completo após PATCH 4
3. Validar que outras funções não quebram após PATCH 5

**Recomendação:** Executar PATCH 1 e PATCH 2 primeiro (alta confiança), depois validar PATCH 3, depois PATCH 4 e PATCH 5.

---

**Documento criado para validação técnica completa antes de execução.**

