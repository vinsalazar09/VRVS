# RELATÓRIO TÉCNICO — PATCH B PÓS-VALIDAÇÃO (2026-02-05)

## CONTEXTO

**Commit:** `0d0f7f4` — "PATCH B: imagem da pergunta nas sessões"  
**Status:** ✅ **Funcionando perfeitamente** (Treino Livre e Lista do Diário)  
**Validação:** Usuário confirmou que "ESTA FUNCIONANDO TUDO PERFEITAMENTE BEM" dentro do escopo testado

---

## ✅ SUCESSOS VALIDADOS

### 1. Lista do Diário
- ✅ Thumbnail da imagem da pergunta aparece corretamente
- ✅ Viewer funciona ao tocar na imagem

### 2. Treino Livre (modo normal)
- ✅ Thumbnail da imagem da pergunta aparece logo abaixo da pergunta
- ✅ Viewer funciona ao tocar na imagem
- ✅ Imagem permanece visível após mostrar resposta

---

## ❌ PROBLEMAS IDENTIFICADOS (4 itens)

### PROBLEMA 1: Toast de erro ao fechar viewer da imagem da pergunta

**Sintoma:**
- Ao abrir o viewer da imagem da pergunta (`diario_abrirViewerImagemPergunta`) e depois fechar (`diario_fecharViewerImagemPergunta`), aparece um toast com mensagem "⚠️ Erro ao carregar imagem"
- **É apenas visual:** A imagem funciona perfeitamente, mas o toast aparece sem necessidade
- **Impacto:** UX ruim - usuário vê erro mesmo quando tudo está funcionando

**Evidência:**
- Função `diario_fecharViewerImagemPergunta()` (linha 20751) não chama diretamente `mostrarNotificacaoFeedback`
- Mas ao fechar, `URL.revokeObjectURL(imgElement.src)` pode estar causando erro na imagem
- `imgElement.onerror` (linha 20739) está configurado e pode estar sendo disparado incorretamente ao fechar
- Função `diario_handleImageErrorPergunta()` (linha 20672) também pode estar sendo chamada incorretamente
- **Histórico:** Já tivemos problema parecido antes (ver `CADERNO_ERROS_ACERTOS.txt` - linha 20670 menciona "desarmar handlers antes de mexer em src/revoke")

**Localização no código:**
- `docs/index.html` linha ~20730 (`diario_fecharViewerImagemPergunta`)
- `docs/index.html` linha 20672 (`diario_handleImageErrorPergunta`)
- `docs/index.html` linha 20690 (`mostrarNotificacaoFeedback('⚠️ Erro ao carregar imagem', 'error')`)

**Solução necessária:**
- Desarmar `imgElement.onerror` antes de `URL.revokeObjectURL()` em `diario_fecharViewerImagemPergunta()` (padrão já usado em `diario_limparImagemModal` - linha 20670)
- Garantir que `onerror` não seja disparado ao fechar viewer normalmente
- Seguir mesmo padrão usado em `diario_fecharViewerImagem()` (linha 15380) se existir

---

### PROBLEMA 2: Aviso de período no modo Avaliação (UX)

**Sintoma:**
- Ao iniciar Treino Livre com "Modo Avaliação" ativo, aparece um aviso: "⚠️ Para usar Modo Avaliação, selecione um tema específico ou filtre por período."
- **Contradição:** O período já está selecionado como "Todo o período", que deveria incluir todos os cards
- **Impacto:** UX confusa - aviso aparece mesmo quando filtro de período está ativo

**Evidência:**
- Validação em `renderConfigTreinoLivre()` ou função similar (linha ~17411)
- Código atual: `mostrarNotificacaoFeedback('⚠️ Para usar Modo Avaliação, selecione um tema específico ou filtre por período.', 'error')`
- A validação não reconhece "Todo o período" como um filtro válido de período

**Localização no código:**
- `docs/index.html` linha ~17411 (validação do Modo Avaliação)
- Função que valida se pode iniciar Treino Livre com Modo Avaliação

**Solução necessária:**
- Ajustar lógica de validação para reconhecer "Todo o período" como filtro válido
- Se `periodo === 'todos'`, não mostrar o aviso (é equivalente a filtrar por todo o período)
- Aviso só deve aparecer se realmente não há filtro de período nem tema específico

---

### PROBLEMA 3: Imagem não aparece no modo Avaliação (BUG CRÍTICO)

**Sintoma:**
- ✅ **Treino Livre (modo normal):** Imagem da pergunta aparece corretamente (PRINT 3)
- ❌ **Modo Avaliação:** Imagem da pergunta **NÃO aparece** (PRINT 4)
- **Impacto:** Inconsistência crítica - funcionalidade implementada parcialmente

**Evidência:**
- `renderTreinoLivreAvaliacao()` (linha 16830) renderiza o HTML da imagem da pergunta (linha 16847)
- `mostrarRespostaAvaliacao()` (linha 16885) carrega thumbnail da pergunta (linha 16902)
- **MAS:** O carregamento só acontece quando a resposta é mostrada, não quando o card é renderizado inicialmente
- Comparação: `renderTreinoLivreCard()` carrega thumbnail da pergunta em `renderTreinoLivreRunner()` (linha 16772) imediatamente após renderizar

**Localização no código:**
- `docs/index.html` linha 16830 (`renderTreinoLivreAvaliacao`)
- `docs/index.html` linha 16885 (`mostrarRespostaAvaliacao`)
- `docs/index.html` linha 16734 (`renderTreinoLivreRunner` - onde `modoAvaliacao` decide qual função usar)

**Causa raiz:**
- `renderTreinoLivreRunner()` chama `renderTreinoLivreAvaliacao()` quando `modoAvaliacao === true`
- Mas o carregamento da thumbnail da pergunta só acontece em `mostrarRespostaAvaliacao()`, não no render inicial
- `renderTreinoLivreCard()` (modo normal) carrega thumbnail imediatamente em `renderTreinoLivreRunner()` (linha 16772)

**Solução necessária:**
- Adicionar carregamento da thumbnail da pergunta no `renderTreinoLivreRunner()` quando `modoAvaliacao === true`
- Replicar o mesmo padrão usado para `renderTreinoLivreCard()` (linha 16772)
- Garantir que thumbnail seja carregada assim que o card de avaliação é renderizado, não apenas quando resposta é mostrada

---

### PROBLEMA 4: Habilitar zoom nas imagens das perguntas (igual ao das respostas)

**Sintoma:**
- Imagens das **respostas** têm viewer com zoom completo (via `diario_abrirViewerImagem` - linha 15108)
- Imagens das **perguntas** têm viewer simples (`diario_abrirViewerImagemPergunta` - linha 20694) mas **NÃO têm zoom**
- **Impacto:** Inconsistência de UX - usuário espera poder dar zoom em todas as imagens

**Evidência:**
- `diario_abrirViewerImagem()` (linha 15108) tem zoom completo com:
  - Pinch-to-zoom (2 dedos)
  - Double-tap para zoom in/out
  - Pan (arrastar quando zoomado)
  - Reset de zoom
  - Cálculo de limites de pan
- `diario_abrirViewerImagemPergunta()` (linha 20694) é viewer simples:
  - Apenas imagem estática em modal
  - Sem zoom, sem pan, sem interação além de fechar
  - HTML simples: `<img>` dentro de `<div>` com `overflow: auto`

**Localização no código:**
- `docs/index.html` linha 15108 (`diario_abrirViewerImagem` - resposta, TEM zoom)
- `docs/index.html` linha 20694 (`diario_abrirViewerImagemPergunta` - pergunta, SEM zoom)

**Solução necessária:**
- Replicar toda a lógica de zoom de `diario_abrirViewerImagem()` em `diario_abrirViewerImagemPergunta()`
- Incluir:
  - Estado de zoom/pan (scale, tx, ty)
  - Handlers de touch (touchstart, touchmove, touchend)
  - Lógica de pinch-to-zoom
  - Lógica de double-tap
  - Funções helper (aplicarTransform, clampPan, resetZoom, zoomAt)
  - Overlay com z-index alto e handlers de eventos
- Garantir que ambas tenham mesma funcionalidade de zoom

---

## RESUMO EXECUTIVO

### Status geral
- ✅ **PATCH B funcionando:** Treino Livre e Lista do Diário funcionam perfeitamente
- ⚠️ **4 problemas identificados:** 1 visual, 1 UX, 1 bug crítico, 1 feature missing

### Priorização sugerida
1. **P3 (Crítico):** Problema 3 - Imagem não aparece no modo Avaliação
2. **P2 (Alta):** Problema 4 - Habilitar zoom nas imagens das perguntas
3. **P1 (Média):** Problema 1 - Toast de erro ao fechar viewer
4. **P1 (Média):** Problema 2 - Aviso de período no modo Avaliação

### Arquivos envolvidos
- `docs/index.html` (todas as correções)
- `docs/sw.js` (bump `CACHE_NAME` após correções)

---

## PRÓXIMOS PASSOS

1. **Diagnóstico detalhado** de cada problema (linhas exatas, funções envolvidas)
2. **Preview analítico** para cada correção antes de implementar
3. **Validação** após cada correção no iPhone
4. **Atualização** do `CADERNO_ERROS_ACERTOS.txt` com soluções

---

**Data:** 2026-02-05  
**Validador:** Usuário (iPhone PWA)  
**Status:** ✅ Validação parcial concluída (Treino Livre + Lista OK, Avaliação pendente)
