# 🔍 PREVIEW ANALÍTICO — REFINOS PÓS TL-2

**Data:** 21 de Dezembro de 2024  
**Status:** Aguardando validação antes de executar  
**Grau de Confiança:** 85% (algumas decisões pendentes)

---

## 📊 RESUMO EXECUTIVO

**5 Patches propostos:**
- PATCH 1: TL-2 Resposta oculta (BAIXO risco) ✅
- PATCH 2: Preview TL-1 simplificar (BAIXO risco) ✅
- PATCH 3: Barra busca Tarefas ocultar (BAIXO risco) ⚠️
- PATCH 4: Sessão Programada navegação (MÉDIO risco) ⚠️
- PATCH 5: Saúde VRVS 3P correção (MÉDIO risco) ⚠️

**Status geral:** ✅ Estrutura sólida, algumas decisões necessárias

---

## ✅ PATCH 1: TL-2 RESPOSTA OCULTA

### CONFIRMAÇÕES

- ✅ Função `renderTreinoLivreCard()` existe — linha 11760
- ✅ CSS `.diario-sessao-resposta.escondida` existe — linha 739
- ✅ Função `mostrarRespostaSessaoDiario()` existe — linha 11923
- ✅ Função só faz toggle CSS (não altera SRS) ✅

### ANÁLISE DA FUNÇÃO EXISTENTE

**`mostrarRespostaSessaoDiario()` atual:**
```javascript
function mostrarRespostaSessaoDiario() {
    const wrapper = document.getElementById('diarioSessaoRespostaWrapper');
    if (wrapper) {
        wrapper.classList.remove('escondida');
    }
}
```

**Problema:** Só remove classe, não adiciona de volta (sem toggle)

### DECISÃO NECESSÁRIA

**Opção A:** Criar função específica para TL-2 (`toggleRespostaTreinoLivre()`)  
**Opção B:** Modificar `mostrarRespostaSessaoDiario()` para fazer toggle (pode afetar Sessão Programada)

**Recomendação:** **Opção A** — Criar função específica para TL-2 (mais seguro)

### IMPLEMENTAÇÃO PLANEJADA

1. Modificar `renderTreinoLivreCard()`:
   - Adicionar `id="treinoLivreRespostaWrapper"`
   - Adicionar classe `escondida` inicialmente
   - Adicionar container com botão toggle

2. Criar `toggleRespostaTreinoLivre()`:
   - Toggle classe `escondida`
   - Alternar texto do botão (MOSTRAR/OCULTAR)

3. Reset ao mudar card:
   - Em `treinoLivreProximo()` / `treinoLivreAnterior()`: garantir que resposta inicia oculta
   - Ou resetar em `renderTreinoLivreRunner()` antes de chamar `renderTreinoLivreCard()`

### GRAU DE CONFIANÇA: 95%

✅ Função existe e é segura  
✅ CSS existe  
✅ Estrutura clara  
⚠️ Pequeno ajuste: criar função específica

---

## ✅ PATCH 2: PREVIEW TL-1 SIMPLIFICAR

### CONFIRMAÇÕES

- ✅ Função `renderConfirmacaoTreinoLivre()` existe — linha 11604
- ✅ Preview atual usa `substring(0, 50)` — linha 11610
- ✅ CSS já tem `word-wrap: break-word` — linha 11628

### ANÁLISE DO CÓDIGO ATUAL

**Preview atual:**
```javascript
const preview = fila.slice(0, 3).map((e, i) => {
    const topicoTexto = e.topico ? (e.topico.length > 50 ? e.topico.substring(0, 50) + '...' : e.topico) : '';
    return `${i + 1}. ${e.area} • ${e.tema}${topicoTexto ? ' • ' + topicoTexto : ''}`;
}).join('\n');
```

**CSS atual:**
```css
white-space: pre-line; line-height: 1.6; word-wrap: break-word; overflow-wrap: break-word;
```

### DECISÃO NECESSÁRIA

**SPEC menciona:** "Se ficar ruim mesmo assim no iPhone, remover preview por completo"

**Recomendação:** Tentar melhorar CSS primeiro, remover se não funcionar

### IMPLEMENTAÇÃO PLANEJADA

1. Ajustar CSS do preview:
   - Remover `substring(0, 50)` (mostrar texto completo)
   - Garantir `overflow: visible` no container
   - Aumentar `max-height` se necessário

2. Se não funcionar:
   - Remover bloco preview completamente
   - Deixar apenas título + botões

### GRAU DE CONFIANÇA: 90%

✅ Função existe  
✅ CSS já tem wrap  
⚠️ Pode precisar remover se não funcionar

---

## ⚠️ PATCH 3: BARRA BUSCA TAREFAS OCULTAR

### CONFIRMAÇÕES

- ⚠️ Barra de busca já foi removida na Fase 1 (commit `97b3c5a`)
- ⚠️ Verificar se ainda aparece no código

### ANÁLISE NECESSÁRIA

**Verificar:**
- Se HTML ainda existe em `renderTarefas()`
- Se CSS ainda existe
- Se função `filtrarTarefas()` ainda existe

**Código atual (linha 4940):**
- Função `renderTarefas()` não mostra barra de busca no início
- Verificar se há algum HTML de busca mais abaixo

### DECISÃO NECESSÁRIA

**Se barra ainda existe:**
- Ocultar com CSS `display: none !important;`

**Se barra já foi removida:**
- Confirmar com usuário que não aparece mais
- PATCH 3 pode ser pulado

### IMPLEMENTAÇÃO PLANEJADA

1. Verificar se barra existe:
   - Buscar por `taskSearchInput` ou placeholder "Buscar tarefas"
   - Se existir: adicionar CSS `display: none !important;`
   - Se não existir: pular patch

### GRAU DE CONFIANÇA: 70%

⚠️ Barra já foi removida antes  
⚠️ Precisa verificar se ainda existe  
✅ Se existir, solução simples (CSS)

---

## ⚠️ PATCH 4: SESSÃO PROGRAMADA NAVEGAÇÃO

### CONFIRMAÇÕES

- ✅ Função `responderSessaoDiario()` existe — linha 11931
- ✅ Função `getEntradaAtualSessao()` existe — linha 11544
- ✅ Função `renderSessaoDiario()` existe — linha 11423
- ✅ Função `pularSessaoDiario()` existe — linha 11959

### RESSALVAS CRÍTICAS

**1. Histórico em memória — risco de vazamento**

**SPEC propõe:**
```javascript
window.sessaoProgramadaHistorico = [];
```

**Problemas:**
- Pode crescer indefinidamente
- Não é limpo ao sair da sessão
- Pode causar problemas de memória

**Solução:**
- Limitar a últimos 10 cards: `window.sessaoProgramadaHistorico.slice(-10)`
- Limpar ao sair: `renderSessaoDiario(null)` deve limpar histórico
- Limpar ao mudar modo: `setModoSessaoDiario()` deve limpar

**2. Timing de salvamento**

**SPEC propõe:** Salvar após avaliar ou após pular

**Código atual:**
- `responderSessaoDiario()` avança ANTES de salvar (linha 11949)
- `pularSessaoDiario()` avança sem salvar (linha 11960)

**Ajuste necessário:**
- Salvar histórico ANTES de `sessaoDiario.indiceAtual++`
- Em `responderSessaoDiario()`: salvar antes de avançar
- Em `pularSessaoDiario()`: salvar antes de avançar

**3. Função helper para obter entrada**

**SPEC menciona:** "snapshot do card anterior"

**Código atual usa:** `getEntradaAtualSessao()` (retorna entrada atual)

**Ajuste necessário:**
- Criar helper para obter entrada por ID: `obterEntradaPorId(id)`
- Ou usar `getEntradaAtualSessao()` e salvar ANTES de avançar

**4. Renderização do card anterior**

**SPEC propõe:** Modo "preview anterior" sem botões

**Estrutura necessária:**
- Header com "Visualizando card anterior (somente leitura)"
- Card idêntico visualmente
- Botão "Voltar ao atual"
- Sem botões de qualidade

**5. Onde inserir botão "Ver anterior"**

**SPEC não especifica:** Onde inserir no HTML

**Código atual (`renderSessaoDiario`):**
- Renderiza apenas o card dentro de `#diarioSessao`
- Não há header separado

**Ajuste necessário:**
- Inserir header ANTES do card no `container.innerHTML`
- Ou criar wrapper que inclui header + card

### IMPLEMENTAÇÃO PLANEJADA

1. Criar histórico limitado:
   ```javascript
   if (!window.sessaoProgramadaHistorico) {
       window.sessaoProgramadaHistorico = [];
   }
   // Limitar a últimos 10
   if (window.sessaoProgramadaHistorico.length > 10) {
       window.sessaoProgramadaHistorico = window.sessaoProgramadaHistorico.slice(-10);
   }
   ```

2. Modificar `responderSessaoDiario()`:
   - Salvar entrada atual ANTES de avançar
   - Limitar histórico após salvar

3. Modificar `pularSessaoDiario()`:
   - Salvar entrada atual ANTES de avançar
   - Limitar histórico após salvar

4. Criar `voltarCardAnteriorSessao()`:
   - Verificar se histórico tem itens
   - Renderizar card anterior em modo read-only

5. Criar `renderCardAnteriorReadOnly()`:
   - Renderizar header + card sem botões
   - Botão "Voltar ao atual"

6. Limpar histórico:
   - Em `renderSessaoDiario(null)` quando sessão termina
   - Em `setModoSessaoDiario()` quando muda modo

### GRAU DE CONFIANÇA: 75%

✅ Funções existem  
⚠️ Histórico precisa limite e limpeza  
⚠️ Timing de salvamento precisa ajuste  
⚠️ Estrutura HTML precisa definição

---

## ⚠️ PATCH 5: SAÚDE VRVS 3P CORREÇÃO

### CONFIRMAÇÕES

- ✅ Função `calcularEstatisticasVrvs3p()` existe — linha 9999
- ✅ Função `obterRetencaoPorEstagio()` existe — linha 9764
- ✅ Renderização inline em `renderStats()` — linha ~7073

### CRITÉRIO DE "CARD REVISADO" — DECISÃO CRÍTICA

**SPEC menciona:** "Identificar o critério confiável de 'card revisado'"

**Campos disponíveis no SRS:**
- `srs.estagio` (0-10) — estágio atual
- `srs.repeticoes` — número de revisões (incrementado em `atualizarSRS_VRVS3P`)
- `srs.ultimaResposta` — última resposta ('esqueci', 'lembrei', 'facil')
- `srs.ultimaRevisaoData` — data da última revisão
- `srs.historicoRespostas` — array de respostas históricas

**Análise do código:**
- Linha 9854: `srs.repeticoes = (srs.repeticoes || 0) + 1;` (incrementa a cada resposta)
- Linha 9851: `srs.ultimaResposta = resposta;` (sempre setado após resposta)
- Linha 10051: `const estagio = srs.estagio || 0;` (estágio pode ser 0 mesmo após revisão se "esqueci")

### DECISÃO NECESSÁRIA

**Critério mais confiável:**

**Opção A:** `srs.repeticoes > 0` (mais confiável — só incrementa após resposta real)  
**Opção B:** `srs.estagio > 0` (menos confiável — pode voltar a 0 se "esqueci")  
**Opção C:** `srs.ultimaResposta !== null` (confiável — sempre setado após resposta)  
**Opção D:** `srs.repeticoes > 0 || srs.estagio > 0` (mais seguro — cobre ambos)

**Recomendação:** **Opção A** — `srs.repeticoes > 0` (mais confiável e simples)

### IMPLEMENTAÇÃO PLANEJADA

1. Modificar `calcularEstatisticasVrvs3p()`:
   ```javascript
   // Separar novos (repeticoes === 0) dos revisados (repeticoes > 0)
   const entradasNovas = entradasAtivas.filter(e => (e.srs.repeticoes || 0) === 0);
   const entradasRevisadas = entradasAtivas.filter(e => (e.srs.repeticoes || 0) > 0);
   
   // Calcular retenção APENAS com revisados
   entradasRevisadas.forEach(entrada => {
       // ... cálculo existente ...
   });
   
   // Adicionar campos novos
   stats.totalRevisados = entradasRevisadas.length;
   stats.totalNovos = entradasNovas.length;
   ```

2. Modificar renderização (linha ~7073):
   - Adicionar contadores: `${stats.totalRevisados} revisados • ${stats.totalNovos} novos`
   - Se `stats.totalRevisados === 0`: mostrar mensagem especial

3. Cenário de borda (0 revisados):
   - Mostrar mensagem: "Sem revisões ainda — faça 1 revisão para aparecer a saúde."
   - Não exibir barra de porcentagem (ou exibir "—")
   - Evitar barra vermelha enganosa

### GRAU DE CONFIANÇA: 80%

✅ Função existe  
✅ Lógica clara  
⚠️ Critério de "revisado" precisa decisão  
⚠️ Cenário de borda precisa tratamento

---

## 🔴 DÚVIDAS E RESSALVAS CRÍTICAS

### 1. PATCH 3 — Barra de busca ainda existe?

**Dúvida:** Barra já foi removida na Fase 1, mas SPEC pede para ocultar  
**Ação:** Verificar se ainda existe no código antes de executar

### 2. PATCH 4 — Critério de "card revisado"

**Dúvida:** Qual critério usar? (`repeticoes > 0` vs `estagio > 0` vs `ultimaResposta !== null`)  
**Recomendação:** `repeticoes > 0` (mais confiável)

### 3. PATCH 4 — Limite de histórico

**Dúvida:** Limitar a quantos cards? (SPEC sugere 10)  
**Recomendação:** 10 cards (últimos 10)

### 4. PATCH 4 — Limpeza de histórico

**Dúvida:** Quando limpar? (ao sair da sessão? ao mudar modo?)  
**Recomendação:** Limpar em `renderSessaoDiario(null)` e `setModoSessaoDiario()`

### 5. PATCH 5 — Mensagem quando 0 revisados

**Dúvida:** Mostrar mensagem ou apenas não exibir barra?  
**Recomendação:** Mostrar mensagem clara + não exibir barra

---

## ✅ SUGESTÕES DE MELHORIA

### PATCH 1: Melhorias

1. **Reset explícito:** Adicionar reset em `treinoLivreProximo()` / `treinoLivreAnterior()`
2. **Estado persistente:** Considerar manter estado toggle por card (opcional, não necessário)

### PATCH 2: Melhorias

1. **Tentar CSS primeiro:** Ajustar CSS antes de remover preview
2. **Fallback:** Se não funcionar, remover completamente

### PATCH 3: Melhorias

1. **Verificar primeiro:** Confirmar se barra ainda existe
2. **Se não existir:** Pular patch e informar usuário

### PATCH 4: Melhorias

1. **Limite de histórico:** 10 cards (últimos 10)
2. **Limpeza automática:** Limpar ao sair da sessão
3. **Helper function:** Criar `obterEntradaPorId(id)` para reutilização
4. **Validação:** Testar bem o fluxo de voltar/avançar

### PATCH 5: Melhorias

1. **Critério claro:** Usar `repeticoes > 0` (mais confiável)
2. **Mensagem especial:** Se 0 revisados, mostrar mensagem clara
3. **Validação de borda:** Testar cenários: 0 revisados, 0 novos, todos novos

---

## 📋 PLANO DE EXECUÇÃO

### Ordem proposta pelo SPEC:
1. PATCH 1 (TL-2 Resposta oculta)
2. PATCH 2 (Preview TL-1)
3. PATCH 3 (Barra busca Tarefas)
4. PATCH 4 (Sessão Programada navegação)
5. PATCH 5 (Saúde VRVS 3P)

**✅ CONCORDO** — Ordem faz sentido

### Execução incremental:

**Fase 1:** PATCH 1 + PATCH 2 (baixo risco)
- Commit após cada patch
- Validar no iPhone

**Fase 2:** PATCH 3 (verificar se necessário)
- Verificar se barra existe
- Se existir: ocultar
- Se não existir: pular

**Fase 3:** PATCH 4 (médio risco)
- Implementar com histórico limitado
- Validar no iPhone

**Fase 4:** PATCH 5 (médio risco)
- Implementar com critério `repeticoes > 0`
- Validar no iPhone

**Fase 5:** Bump CACHE_NAME
- Atualizar `CACHE_NAME` em `docs/sw.js`

---

## 🎯 GRAU DE CONFIANÇA GERAL

| Patch | Confiança | Principais Riscos |
|-------|-----------|-------------------|
| PATCH 1 | 95% | Pequeno: criar função específica |
| PATCH 2 | 90% | Pequeno: pode precisar remover preview |
| PATCH 3 | 70% | Médio: verificar se barra ainda existe |
| PATCH 4 | 75% | Médio: histórico, timing, estrutura |
| PATCH 5 | 80% | Médio: critério de "revisado", bordas |

**Confiança geral:** 85%

---

## 📝 CHECKLIST PRÉ-EXECUÇÃO

### Antes de executar, confirmar:

**PATCH 1:**
- [x] Função `mostrarRespostaSessaoDiario()` existe e é segura
- [x] CSS `.escondida` existe
- [ ] Decisão: criar função específica para TL-2 ✅

**PATCH 2:**
- [x] Função `renderConfirmacaoTreinoLivre()` existe
- [x] Preview atual identificado
- [ ] Decisão: tentar CSS primeiro, remover se não funcionar ✅

**PATCH 3:**
- [ ] Verificar se barra de busca ainda existe
- [ ] Se existir: ocultar com CSS
- [ ] Se não existir: pular patch

**PATCH 4:**
- [x] Funções existem
- [ ] Decisão: critério de "revisado" = `repeticoes > 0` ✅
- [ ] Decisão: limite histórico = 10 cards ✅
- [ ] Decisão: limpar histórico ao sair ✅
- [ ] Decisão: onde inserir botão "Ver anterior"

**PATCH 5:**
- [x] Função existe
- [ ] Decisão: critério de "revisado" = `repeticoes > 0` ✅
- [ ] Decisão: mensagem quando 0 revisados ✅

---

## ✅ CONCLUSÃO

**Status:** ✅ Pronto para executar após validações

**Principais ajustes necessários:**
1. PATCH 1: Criar função específica para TL-2
2. PATCH 3: Verificar se barra ainda existe
3. PATCH 4: Definir estrutura HTML do header
4. PATCH 5: Confirmar critério de "revisado"

**Recomendação:** Validar decisões pendentes antes de executar

---

**Documento criado para validação técnica antes de execução.**

