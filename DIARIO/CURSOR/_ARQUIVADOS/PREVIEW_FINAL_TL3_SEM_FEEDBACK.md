# 🔍 PREVIEW ANALÍTICO FINAL — TL-3 SEM INTEGRAÇÃO FEEDBACK

**Data:** 21 de Dezembro de 2024  
**Versão:** Final (sem UX-H)  
**Status:** Pronto para execução

---

## 📊 RESUMO EXECUTIVO

**Objetivo:** Implementar TL-3 Modo Avaliação (recall ativo + autoavaliação) SEM integração automática com Feedback.

**Patches:** UX-E → UX-I → UX-F → UX-G (4 patches, sem UX-H)

**Confiança geral:** 93%

| Patch | Risco | Confiança | Dependência |
|-------|-------|-----------|-------------|
| UX-E | BAIXO | 95% | Nenhuma |
| UX-I | BAIXO | 95% | UX-E (toggle precisa estar ON) |
| UX-F | MÉDIO | 90% | UX-E + UX-I |
| UX-G | BAIXO | 90% | UX-F |

---

## 🗺️ MAPA CIRÚRGICO (ÂNCORAS REAIS)

### Funções e Linhas

**TL-1 Configuração:**
- `window.treinoLivreConfig` — linha 11704-11710 (adicionar `modoAvaliacao: false`)
- `renderConfigTreinoLivre()` — linha 11713-11760 (adicionar toggle após linha 11753)
- `montarTreinoLivre()` — linha 11943-11973 (adicionar validação após linha 11949)
- `renderConfirmacaoTreinoLivre()` — linha 11976-12009 (mudar texto botão se `modoAvaliacao === true`)

**TL-2 Runner:**
- `iniciarTreinoLivre()` — linha 11765-11778 (criar `window.treinoLivreAvaliacao` após linha 11775)
- `renderTreinoLivreRunner()` — linha 11781-11834 (verificar modo avaliação, linha ~11805)
- `renderTreinoLivreCard()` — linha 11837-11858 (NÃO modificar, criar função nova)
- `treinoLivreProximo()` — linha 11876-11884 (preservar estado avaliação)
- `treinoLivreAnterior()` — linha 11887-11894 (preservar estado avaliação)
- `sairTreinoLivre()` — linha 11897-11900 (limpar `window.treinoLivreAvaliacao`)
- `encerrarTreinoLivre()` — linha 11903-11909 (calcular feedback antes de renderizar fim)
- `renderTreinoLivreFim()` — linha 11912-11926 (mostrar resultado completo se modo avaliação)

**Helpers:**
- `formatarTextoDiario()` — linha 9726 (já existe, reutilizar)
- `mostrarNotificacaoFeedback()` — linha 4062 (já existe, usar para avisos)

**Container:**
- `#diarioSessao` — container principal da sessão

---

## 📦 PLANO DE PATCHES

### PATCH UX-E: Toggle Modo Avaliação + Validação Tema Único

**Onde mexer:**
- Linha 11705: Adicionar `modoAvaliacao: false` em `window.treinoLivreConfig`
- Linha ~11754: Adicionar toggle no HTML de `renderConfigTreinoLivre()`
- Linha 11949: Adicionar validação em `montarTreinoLivre()`
- Linha ~11914: Mudar texto botão em `renderConfirmacaoTreinoLivre()`

**Mudanças:**
- Toggle checkbox "📊 Modo Avaliação" na config TL-1
- Validação: se `modoAvaliacao === true && tema === null` → mostrar aviso e não montar
- Texto botão: "INICIAR AVALIAÇÃO" se modo avaliação ON

**Risco:** BAIXO — apenas adiciona campo e validação

**Rollback:** Remover campo `modoAvaliacao`, remover toggle HTML, remover validação, reverter texto botão

**Checklist iPhone PASS/FAIL:**
- [ ] Toggle aparece na config TL-1
- [ ] Toggle liga/desliga corretamente
- [ ] Com toggle ON + tema "Todos": aviso aparece, não monta
- [ ] Com toggle ON + tema específico: monta normalmente
- [ ] Texto botão muda para "INICIAR AVALIAÇÃO" quando toggle ON
- [ ] Com toggle OFF: funciona como antes (TL-2 normal)

---

### PATCH UX-I: Modal Config Avançada + Persistência

**Onde mexer:**
- Linha 11710: Carregar `localStorage.getItem('vrvs_avaliacao_config')` na inicialização
- Linha ~11754: Adicionar link "⚙️ Config. avançada" (condicional se toggle ON)
- Após linha 11760: Criar funções `abrirConfigAvaliacao()`, `salvarConfigAvaliacao()`, `validarConfigAvaliacao()`
- HTML: Adicionar modal (após linha ~11760 ou em seção de modais)

**Mudanças:**
- Modal com inputs para 4 valores (NÃO SEI, ENTRE 2, ACERTARIA, DOMINADO)
- Validação: 0-100 e ordem crescente (a < b < c < d)
- Persistência: `localStorage.setItem('vrvs_avaliacao_config', ...)`
- Default: 20/50/90/100 se não existir

**Risco:** BAIXO — localStorage pequeno (~100 bytes), validação robusta

**Rollback:** Remover modal HTML, remover funções, remover carregamento localStorage

**Checklist iPhone PASS/FAIL:**
- [ ] Link "Config. avançada" aparece só quando toggle ON
- [ ] Link abre modal
- [ ] Valores default carregam (20/50/90/100)
- [ ] Pode editar valores
- [ ] Validação: não aceita valor > 100
- [ ] Validação: não aceita ordem não-crescente
- [ ] "Salvar" persiste em localStorage
- [ ] Valores salvos carregam na próxima sessão

---

### PATCH UX-F: Runner TL-3 com Avaliação

**Onde mexer:**
- Linha 11772: Criar `window.treinoLivreAvaliacao` em `iniciarTreinoLivre()` (se `modoAvaliacao === true`)
- Linha 11805: Modificar `renderTreinoLivreRunner()` para verificar modo avaliação
- Após linha 11858: Criar função `renderTreinoLivreAvaliacao(entrada, indice, total)`
- Após linha 11873: Criar funções `mostrarRespostaAvaliacao()`, `avaliarTreinoLivre()`, `pularAvaliacaoTreinoLivre()`, `confirmarSairAvaliacao()`
- Linha 11876: Modificar `treinoLivreProximo()` para preservar estado
- Linha 11887: Modificar `treinoLivreAnterior()` para preservar estado
- Linha 11897: Modificar `sairTreinoLivre()` para limpar `window.treinoLivreAvaliacao`

**Mudanças:**
- Estado: `window.treinoLivreAvaliacao = { notas: {}, respostaMostrada: {}, config: {...} }`
- Card inicia com resposta oculta
- Botão "👁️ MOSTRAR RESPOSTA" revela resposta
- Após mostrar: grid 2x2 com 4 botões de avaliação + botão PULAR
- Ao clicar: registra nota em `notas[indice]` e avança
- Navegação preserva estado (resposta mostrada, nota registrada)

**Risco:** MÉDIO — estado precisa gerenciamento cuidadoso, navegação precisa preservar estado

**Rollback:** Remover estado `window.treinoLivreAvaliacao`, remover função `renderTreinoLivreAvaliacao()`, remover funções de avaliação, reverter `renderTreinoLivreRunner()` para TL-2

**Checklist iPhone PASS/FAIL:**
- [ ] Com Modo Avaliação ON: card abre com resposta oculta
- [ ] Botão "MOSTRAR RESPOSTA" revela resposta
- [ ] Após mostrar: grid 2x2 de avaliação aparece
- [ ] Clicar em qualquer botão → registra nota e avança
- [ ] Clicar PULAR → avança sem registrar nota
- [ ] Progresso atualiza corretamente (X / N)
- [ ] "← Sair" abre modal de confirmação
- [ ] Navegação Anterior/Próximo preserva estado
- [ ] Ao voltar com Anterior: pode reavaliar
- [ ] Sem Modo Avaliação: funciona como TL-2 normal
- [ ] Touch targets ≥ 44px em todos os botões

---

### PATCH UX-G: Tela de Resultado + Cálculo

**Onde mexer:**
- Após linha 11909: Criar função `calcularFeedbackTL3()`
- Linha 11903: Modificar `encerrarTreinoLivre()` para calcular feedback antes de renderizar
- Linha 11912: Modificar `renderTreinoLivreFim()` para mostrar resultado completo se modo avaliação

**Mudanças:**
- Cálculo: média simples dos avaliados (excluir `null`/pulados)
- Score: `Math.round(soma / nAvaliados)`
- Breakdown: total, avaliados, cobertura%, contagem por categoria, pulados
- Avisos: se `nAvaliados === 0` → mensagem específica, sem score
- Avisos: se `nAvaliados < 5` ou `cobertura < 60%` → aviso de amostra pequena

**Risco:** BAIXO — cálculo simples, edge cases tratados

**Rollback:** Remover função `calcularFeedbackTL3()`, reverter `encerrarTreinoLivre()` e `renderTreinoLivreFim()` para TL-2

**Checklist iPhone PASS/FAIL:**
- [ ] Ao encerrar com avaliações: mostra resultado completo
- [ ] Score calculado corretamente (média dos avaliados)
- [ ] Breakdown mostra contagem correta por categoria
- [ ] Se nenhum avaliado → mensagem específica, sem score
- [ ] Se `nAvaliados < 5` → aviso aparece
- [ ] Se `cobertura < 60%` → aviso aparece
- [ ] Sem Modo Avaliação: tela final normal (TL-2)

---

## 🔒 ESTADO E LIMPEZA

**Estado novo:**
- `window.treinoLivreAvaliacao` — objeto em memória (não persiste)
- `window.treinoLivreAvaliacaoConfig` — carregado de localStorage

**Limpeza:**
- `sairTreinoLivre()` — linha 11897: `window.treinoLivreAvaliacao = null`
- `encerrarTreinoLivre()` — linha 11903: limpar antes de renderizar fim

**Segurança:**
- ✅ Estado não persiste entre sessões (em memória apenas)
- ✅ Limpeza explícita em pontos de saída
- ✅ TL-3 não interfere no TL-2 normal (verificação condicional)

---

## ✅ CRITÉRIOS DE ACEITE

**Hard constraints:**
- ✅ TL-3 é efêmero (não salvar score automaticamente)
- ✅ TL-3 é READ-ONLY (não tocar em SRS/VRVS 3P)
- ✅ iPhone-first, touch targets ≥ 44px
- ✅ Um patch por commit, rollback simples

**Validação:**
- ✅ Teste no iPhone a cada patch
- ✅ Checklist PASS/FAIL por patch
- ✅ Bump CACHE_NAME em `docs/sw.js` a cada deploy

---

## 📋 ORDEM DE EXECUÇÃO

1. **UX-E** → Commit → Bump CACHE_NAME → Teste iPhone
2. **UX-I** → Commit → Bump CACHE_NAME → Teste iPhone
3. **UX-F** → Commit → Bump CACHE_NAME → Teste iPhone
4. **UX-G** → Commit → Bump CACHE_NAME → Teste iPhone

**Confiança geral:** 93% (pronto para execução)

---

**Documento criado para execução incremental e segura.**

