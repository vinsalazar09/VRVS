# PREVIEW — PATCH C (ARREMATE) — IMAGEM DA PERGUNTA + MODO AVALIAÇÃO

**Data:** 2026-02-05  
**Status:** FASE 1 — DIAGNÓSTICO + PREVIEW (SEM EXECUTAR)  
**Confiança:** 95%+ (correções estruturais bem mapeadas)

---

## 1. MAPEAMENTO COMPLETO

### A) TOAST "Erro ao carregar imagem" ao fechar viewer

**Localização:**
- **Linha 20739:** `imgElement.onerror = () => { mostrarNotificacaoFeedback('⚠️ Erro ao carregar imagem', 'error'); }`
- **Linha 20751-20760:** `diario_fecharViewerImagemPergunta()` faz:
  ```javascript
  URL.revokeObjectURL(imgElement.src);
  imgElement.src = '';
  ```

**Causa raiz:**
- Ao fechar viewer, `URL.revokeObjectURL()` revoga o blob URL
- Em seguida, `imgElement.src = ''` define src como string vazia
- Isso dispara `onerror` incorretamente (navegador interpreta como erro de carregamento)
- Toast aparece mesmo quando fechamento é normal

**Padrão já usado no código:**
- **Linha 20670-20678:** `diario_limparImagemModal()` desarma handlers antes de limpar:
  ```javascript
  if (thumbImg) {
      thumbImg.onerror = null;
      thumbImg.onload = null;
  }
  ```
- **Linha 15367-15370:** `diario_abrirViewerImagem()` (resposta) usa `try/catch` ao fechar sem disparar toast

**Solução:**
- Desarmar `imgElement.onerror = null` ANTES de `URL.revokeObjectURL()` e `imgElement.src = ''`
- Seguir mesmo padrão de `diario_limparImagemModal()`

---

### B) Validação Modo Avaliação — "Todo o período" não reconhecido

**Localização:**
- **Linha 17412:** Validação atual:
  ```javascript
  if (config.modoAvaliacao && !modoEsquecidos && !config.tema && (!config.periodo || config.periodo === 'todos')) {
      mostrarNotificacaoFeedback('⚠️ Para usar Modo Avaliação, selecione um tema específico ou filtre por período.', 'error');
      return;
  }
  ```
- **Linha 16543:** Select HTML:
  ```html
  <option value="todos" ${(window.treinoLivreConfig.periodo || 'todos') === 'todos' ? 'selected' : ''}>Todo o período</option>
  ```

**Causa raiz:**
- `value="todos"` é o valor real quando UI mostra "Todo o período"
- Validação trata `config.periodo === 'todos'` como "não selecionado" (`!config.periodo || config.periodo === 'todos'`)
- Mas "Todo o período" É um filtro válido (inclui todos os cards)

**Evidência adicional:**
- **Linha 16390-16391:** `obterEntradasTreinoLivre()` reconhece `periodo === 'todos'` como válido:
  ```javascript
  const periodo = (config && config.periodo) ? config.periodo : 'todos';
  if (periodo === 'todos') return entradas; // Retorna todas as entradas
  ```

**Solução:**
- Ajustar validação: remover `config.periodo === 'todos'` da condição de bloqueio
- Nova lógica: `(!config.periodo || config.periodo === 'todos')` → `(!config.periodo)`
- "Todo o período" (`'todos'`) deve ser tratado como filtro válido

---

### C) Render da imagem da pergunta em TODOS os fluxos

**Mapeamento completo:**

#### 1. **Treino Livre (modo normal)** ✅ FUNCIONANDO
- **HTML:** Linha 16806 (`renderTreinoLivreCard`)
- **Loader:** Linha 16776-16786 (`renderTreinoLivreRunner` - carrega imediatamente após render)

#### 2. **Treino Livre + Modo Avaliação** ❌ PROBLEMA
- **HTML:** Linha 16847 (`renderTreinoLivreAvaliacao` - existe)
- **Loader inicial:** ❌ NÃO EXISTE em `renderTreinoLivreRunner()` quando `modoAvaliacao === true`
- **Loader tardio:** Linha 16906-16914 (`mostrarRespostaAvaliacao` - só carrega quando resposta é mostrada)

**Causa raiz:**
- `renderTreinoLivreRunner()` (linha 16734) decide qual função usar:
  ```javascript
  ${modoAvaliacao ? renderTreinoLivreAvaliacao(entradaAtual, indice, total) : renderTreinoLivreCard(entradaAtual)}
  ```
- Carregamento da thumbnail da pergunta (linha 16776-16786) está FORA do bloco condicional
- Mas só funciona para modo normal porque usa IDs `tl-pergunta-thumb-*`
- Modo avaliação usa IDs `tl-avaliacao-pergunta-thumb-*` (linha 16847)
- Carregamento precisa ser condicional baseado em `modoAvaliacao`

#### 3. **Revisão Programada (VRVS 3P)** ✅ FUNCIONANDO
- **HTML:** Linha 16250 (`renderSessaoDiario`)
- **Loader:** Linha 16283-16293 (`renderSessaoDiario` - após renderizar HTML)

#### 4. **Lista do Diário** ✅ FUNCIONANDO
- **HTML:** Linha 14812 (`renderEntradaDiario`)
- **Loader:** Linha 14880-14905 (`diario_carregarThumbnails`)

**Solução estrutural:**
- Criar helper único `carregarThumbnailPerguntaTreinoLivre(entradaAtual, modoAvaliacao)` que:
  - Detecta `modoAvaliacao` e usa IDs corretos (`tl-pergunta-thumb-*` ou `tl-avaliacao-pergunta-thumb-*`)
  - Chama `diario_carregarThumbnailUnico()` com IDs corretos
- Chamar helper em `renderTreinoLivreRunner()` após renderizar HTML (independente de modo)

---

### D) Zoom nas imagens da pergunta (bônus)

**Comparação:**

**`diario_abrirViewerImagem()` (resposta - linha 15108):**
- ✅ Zoom completo (pinch-to-zoom, double-tap, pan)
- ✅ Overlay com handlers de touch
- ✅ Estado de zoom/pan (scale, tx, ty)
- ✅ Funções helper (aplicarTransform, clampPan, resetZoom, zoomAt)

**`diario_abrirViewerImagemPergunta()` (pergunta - linha 20694):**
- ❌ Viewer simples (sem zoom)
- ❌ Apenas imagem estática em modal
- ❌ Sem interação além de fechar

**Solução:**
- Replicar toda a lógica de zoom de `diario_abrirViewerImagem()` em `diario_abrirViewerImagemPergunta()`
- Substituir modal simples por overlay com zoom completo
- Manter mesmo UX (não inventar outro comportamento)

---

## 2. PROPOSTA TÉCNICA (ESTRUTURAL)

### A) Helper único para renderizar imagem da pergunta

**Função proposta:**
```javascript
// Helper único para renderizar HTML da imagem da pergunta
function renderHTMLImagemPergunta(entrada, contextoPrefix) {
    if (!entrada || !entrada.imagemPergunta || !entrada.imagemPergunta.thumbKey) return '';
    const wrapId = `${contextoPrefix}-pergunta-thumb-wrap-${entrada.id}`;
    const imgId = `${contextoPrefix}-pergunta-thumb-img-${entrada.id}`;
    return `<div id="${wrapId}" style="margin-top: 8px; margin-bottom: 8px; cursor: pointer;" onclick="diario_abrirViewerImagemPergunta(${entrada.id})"><img id="${imgId}" style="display: none; max-width: 100%; max-height: 200px; border-radius: 8px; border: 1px solid rgba(0,206,209,0.3);" /></div>`;
}

// Helper único para carregar thumbnail da pergunta
function carregarThumbnailPerguntaTreinoLivre(entradaAtual, modoAvaliacao) {
    if (!entradaAtual || !entradaAtual.id || !entradaAtual.imagemPergunta || !entradaAtual.imagemPergunta.thumbKey) return;
    const prefix = modoAvaliacao ? 'tl-avaliacao' : 'tl';
    setTimeout(() => {
        diario_carregarThumbnailUnico(
            entradaAtual.id,
            entradaAtual.imagemPergunta.thumbKey,
            `${prefix}-pergunta-thumb-img-${entradaAtual.id}`,
            `${prefix}-pergunta-thumb-wrap-${entradaAtual.id}`
        );
    }, 50);
}
```

**Vantagens:**
- ✅ Centraliza lógica (evita esquecer Avaliação)
- ✅ Reutilizável em todos os fluxos
- ✅ Fácil manutenção (mudança em um lugar afeta todos)

---

### B) Correção do toast ao fechar viewer

**Mudança proposta:**
```javascript
// ANTES (linha 20751-20760)
function diario_fecharViewerImagemPergunta() {
    const viewerModal = document.getElementById('diario-viewer-imagem-pergunta');
    if (viewerModal) {
        const imgElement = document.getElementById('diario-viewer-imagem-pergunta-img');
        if (imgElement && imgElement.src && imgElement.src.startsWith('blob:')) {
            URL.revokeObjectURL(imgElement.src);
            imgElement.src = '';
        }
        viewerModal.classList.remove('active');
    }
}

// DEPOIS
function diario_fecharViewerImagemPergunta() {
    const viewerModal = document.getElementById('diario-viewer-imagem-pergunta');
    if (viewerModal) {
        const imgElement = document.getElementById('diario-viewer-imagem-pergunta-img');
        if (imgElement) {
            // PATCH C: Desarmar onerror antes de limpar src (evita toast incorreto)
            imgElement.onerror = null;
            imgElement.onload = null;
            
            if (imgElement.src && imgElement.src.startsWith('blob:')) {
                URL.revokeObjectURL(imgElement.src);
            }
            imgElement.src = '';
        }
        viewerModal.classList.remove('active');
    }
}
```

---

### C) Correção validação Modo Avaliação

**Mudança proposta:**
```javascript
// ANTES (linha 17412)
if (config.modoAvaliacao && !modoEsquecidos && !config.tema && (!config.periodo || config.periodo === 'todos')) {
    mostrarNotificacaoFeedback('⚠️ Para usar Modo Avaliação, selecione um tema específico ou filtre por período.', 'error');
    return;
}

// DEPOIS
// PATCH C: "Todo o período" (todos) é filtro válido, não deve bloquear
if (config.modoAvaliacao && !modoEsquecidos && !config.tema && !config.periodo) {
    mostrarNotificacaoFeedback('⚠️ Para usar Modo Avaliação, selecione um tema específico ou filtre por período.', 'error');
    return;
}
```

**Lógica:**
- `periodo === 'todos'` → filtro válido (não bloqueia)
- `!config.periodo` → realmente não selecionado (bloqueia)

---

### D) Correção carregamento imagem no Modo Avaliação

**Mudança proposta em `renderTreinoLivreRunner()` (linha 16776-16786):**

```javascript
// ANTES
// PATCH B: Carregar thumbnail da PERGUNTA também
if (entradaAtual && entradaAtual.id && entradaAtual.imagemPergunta && entradaAtual.imagemPergunta.thumbKey) {
    setTimeout(() => {
        diario_carregarThumbnailUnico(
            entradaAtual.id,
            entradaAtual.imagemPergunta.thumbKey,
            `tl-pergunta-thumb-img-${entradaAtual.id}`,
            `tl-pergunta-thumb-wrap-${entradaAtual.id}`
        );
    }, 50);
}

// DEPOIS
// PATCH C: Carregar thumbnail da PERGUNTA (modo normal OU avaliação)
if (entradaAtual && entradaAtual.id && entradaAtual.imagemPergunta && entradaAtual.imagemPergunta.thumbKey) {
    carregarThumbnailPerguntaTreinoLivre(entradaAtual, modoAvaliacao);
}
```

**OU (sem helper, inline):**
```javascript
// PATCH C: Carregar thumbnail da PERGUNTA (modo normal OU avaliação)
if (entradaAtual && entradaAtual.id && entradaAtual.imagemPergunta && entradaAtual.imagemPergunta.thumbKey) {
    const prefix = modoAvaliacao ? 'tl-avaliacao' : 'tl';
    setTimeout(() => {
        diario_carregarThumbnailUnico(
            entradaAtual.id,
            entradaAtual.imagemPergunta.thumbKey,
            `${prefix}-pergunta-thumb-img-${entradaAtual.id}`,
            `${prefix}-pergunta-thumb-wrap-${entradaAtual.id}`
        );
    }, 50);
}
```

---

### E) Adicionar zoom no viewer da pergunta (bônus)

**Estratégia:**
- Substituir modal simples (linha 20711-20730) por overlay completo (igual linha 15145-15191)
- Replicar toda a lógica de zoom de `diario_abrirViewerImagem()` (linha 15121-15397)
- Manter mesmo comportamento de fechamento (sem toast incorreto)

**Complexidade:** Alta (muitas linhas para replicar)  
**Prioridade:** Bônus (pode ser feito em patch separado se necessário)

---

## 3. PREVIEW DO DIFF

### Arquivos modificados:
- `docs/index.html` (correções principais)
- `docs/sw.js` (bump `CACHE_NAME` após execução)

### Mudanças propostas:

#### Mudança 1: Desarmar onerror ao fechar viewer (linha 20751)
```diff
 function diario_fecharViewerImagemPergunta() {
     const viewerModal = document.getElementById('diario-viewer-imagem-pergunta');
     if (viewerModal) {
         const imgElement = document.getElementById('diario-viewer-imagem-pergunta-img');
         if (imgElement) {
+            // PATCH C: Desarmar onerror antes de limpar src (evita toast incorreto)
+            imgElement.onerror = null;
+            imgElement.onload = null;
+            
             if (imgElement.src && imgElement.src.startsWith('blob:')) {
                 URL.revokeObjectURL(imgElement.src);
             }
             imgElement.src = '';
         }
         viewerModal.classList.remove('active');
     }
 }
```

#### Mudança 2: Ajustar validação Modo Avaliação (linha 17412)
```diff
-            if (config.modoAvaliacao && !modoEsquecidos && !config.tema && (!config.periodo || config.periodo === 'todos')) {
+            // PATCH C: "Todo o período" (todos) é filtro válido, não deve bloquear
+            if (config.modoAvaliacao && !modoEsquecidos && !config.tema && !config.periodo) {
                 mostrarNotificacaoFeedback('⚠️ Para usar Modo Avaliação, selecione um tema específico ou filtre por período.', 'error');
                 return;
             }
```

#### Mudança 3: Carregar thumbnail no Modo Avaliação (linha 16776)
```diff
-                // PATCH B: Carregar thumbnail da PERGUNTA também
+                // PATCH C: Carregar thumbnail da PERGUNTA (modo normal OU avaliação)
                 if (entradaAtual && entradaAtual.id && entradaAtual.imagemPergunta && entradaAtual.imagemPergunta.thumbKey) {
+                    const prefix = modoAvaliacao ? 'tl-avaliacao' : 'tl';
                     setTimeout(() => {
                         diario_carregarThumbnailUnico(
                             entradaAtual.id,
                             entradaAtual.imagemPergunta.thumbKey,
-                            `tl-pergunta-thumb-img-${entradaAtual.id}`,
-                            `tl-pergunta-thumb-wrap-${entradaAtual.id}`
+                            `${prefix}-pergunta-thumb-img-${entradaAtual.id}`,
+                            `${prefix}-pergunta-thumb-wrap-${entradaAtual.id}`
                         );
                     }, 50);
                 }
```

#### Mudança 4 (OPCIONAL): Helper único (nova função, após linha 15052)
```diff
+        // PATCH C: Helper único para carregar thumbnail da pergunta no Treino Livre
+        function carregarThumbnailPerguntaTreinoLivre(entradaAtual, modoAvaliacao) {
+            if (!entradaAtual || !entradaAtual.id || !entradaAtual.imagemPergunta || !entradaAtual.imagemPergunta.thumbKey) return;
+            const prefix = modoAvaliacao ? 'tl-avaliacao' : 'tl';
+            setTimeout(() => {
+                diario_carregarThumbnailUnico(
+                    entradaAtual.id,
+                    entradaAtual.imagemPergunta.thumbKey,
+                    `${prefix}-pergunta-thumb-img-${entradaAtual.id}`,
+                    `${prefix}-pergunta-thumb-wrap-${entradaAtual.id}`
+                );
+            }, 50);
+        }
```

**Se usar helper, Mudança 3 fica:**
```diff
-                // PATCH B: Carregar thumbnail da PERGUNTA também
+                // PATCH C: Carregar thumbnail da PERGUNTA (modo normal OU avaliação)
                 if (entradaAtual && entradaAtual.id && entradaAtual.imagemPergunta && entradaAtual.imagemPergunta.thumbKey) {
-                    setTimeout(() => {
-                        diario_carregarThumbnailUnico(
-                            entradaAtual.id,
-                            entradaAtual.imagemPergunta.thumbKey,
-                            `tl-pergunta-thumb-img-${entradaAtual.id}`,
-                            `tl-pergunta-thumb-wrap-${entradaAtual.id}`
-                        );
-                    }, 50);
+                    carregarThumbnailPerguntaTreinoLivre(entradaAtual, modoAvaliacao);
                 }
```

#### Mudança 5 (BÔNUS): Adicionar zoom no viewer da pergunta (linha 20694)
**Complexidade alta - pode ser patch separado**

Substituir função `diario_abrirViewerImagemPergunta()` inteira por versão com zoom (replicar de `diario_abrirViewerImagem()`).

---

## 4. RISCOS / ROLLBACK / CONFIANÇA

### Riscos identificados:

1. **Risco BAIXO:** Desarmar `onerror` pode mascarar erros reais
   - **Mitigação:** Só desarmar ao fechar viewer (não durante carregamento normal)
   - **Impacto:** Mínimo (fechamento é ação explícita do usuário)

2. **Risco BAIXO:** Mudança na validação pode permitir Modo Avaliação sem filtro real
   - **Mitigação:** Validação ainda bloqueia se `!config.periodo` (realmente não selecionado)
   - **Impacto:** Mínimo (apenas corrige lógica incorreta)

3. **Risco MÉDIO:** Carregamento condicional pode não funcionar em edge cases
   - **Mitigação:** Usar mesmo padrão já testado (modo normal funciona)
   - **Impacto:** Médio (pode precisar ajuste fino)

4. **Risco ALTO (se incluir zoom):** Replicar lógica de zoom pode introduzir bugs
   - **Mitigação:** Replicar exatamente de função que já funciona
   - **Impacto:** Alto (pode quebrar viewer completamente)
   - **Recomendação:** Fazer zoom em patch separado (PATCH C.2)

### Rollback simples:
- Reverter commit
- Bump `CACHE_NAME` de volta
- Push

### Confiança:
- **Mudanças 1-3 (essenciais):** 95%+ de confiança
  - Correções simples e bem mapeadas
  - Padrões já usados no código
  - Baixo risco de regressão
  
- **Mudança 4 (helper):** 90% de confiança
  - Refatoração limpa
  - Pode melhorar manutenibilidade
  
- **Mudança 5 (zoom):** 80% de confiança
  - Complexidade alta
  - Recomendado fazer em patch separado

### Confiança para corrigir se der ruim:
- **Alta (95%+):** Problemas são bem mapeados, fácil identificar causa
- **Rollback rápido:** Apenas reverter commit

---

## 5. CHECKLIST DE VALIDAÇÃO (iPhone - sem console)

### Teste 1: Toast de erro ao fechar viewer
- [ ] Abrir card com imagem da pergunta (Treino Livre ou Lista)
- [ ] Tocar na imagem → viewer abre
- [ ] Fechar viewer (botão × ou overlay)
- [ ] **ESPERADO:** Nenhum toast de erro aparece ✅
- [ ] **ATUAL:** Toast "Erro ao carregar imagem" aparece ❌

### Teste 2: Validação Modo Avaliação
- [ ] Abrir Treino Livre
- [ ] Selecionar "Criados em: Todo o período"
- [ ] Ativar "Modo Avaliação"
- [ ] Clicar "INICIAR TREINO"
- [ ] **ESPERADO:** Treino inicia sem aviso ✅
- [ ] **ATUAL:** Aviso aparece mesmo com "Todo o período" ❌

### Teste 3: Imagem no Modo Avaliação
- [ ] Abrir Treino Livre com Modo Avaliação
- [ ] Selecionar entrada que tem imagem da pergunta
- [ ] **ESPERADO:** Thumbnail aparece logo abaixo da pergunta (antes de mostrar resposta) ✅
- [ ] **ATUAL:** Thumbnail só aparece após mostrar resposta ❌

### Teste 4: Imagem no Treino Livre normal (anti-regressão)
- [ ] Abrir Treino Livre (sem Modo Avaliação)
- [ ] Selecionar entrada com imagem da pergunta
- [ ] **ESPERADO:** Thumbnail aparece corretamente ✅
- [ ] **ATUAL:** Funciona ✅

### Teste 5: Imagem na Revisão Programada (anti-regressão)
- [ ] Abrir Revisão Programada (quando tiver tópico agendado)
- [ ] Selecionar entrada com imagem da pergunta
- [ ] **ESPERADO:** Thumbnail aparece corretamente ✅
- [ ] **ATUAL:** Funciona ✅

### Teste 6 (BÔNUS): Zoom na imagem da pergunta
- [ ] Abrir viewer da imagem da pergunta
- [ ] Pinch-to-zoom (2 dedos)
- [ ] Double-tap para zoom in/out
- [ ] Pan (arrastar quando zoomado)
- [ ] **ESPERADO:** Zoom funciona igual à imagem da resposta ✅
- [ ] **ATUAL:** Sem zoom ❌

---

## 6. PLANO DE EXECUÇÃO (FASE 2 - quando autorizado)

### Ordem sugerida:
1. **Mudança 1:** Desarmar onerror (mais simples, baixo risco)
2. **Mudança 2:** Ajustar validação (simples, baixo risco)
3. **Mudança 3:** Carregar thumbnail no Modo Avaliação (essencial, médio risco)
4. **Mudança 4 (OPCIONAL):** Helper único (refatoração, pode melhorar código)
5. **Mudança 5 (BÔNUS):** Zoom (complexo, fazer em patch separado se necessário)

### Commits sugeridos:
- **Commit 1:** "PATCH C: corrigir toast ao fechar viewer + validação Modo Avaliação"
- **Commit 2:** "PATCH C: carregar imagem da pergunta no Modo Avaliação"
- **Commit 3 (OPCIONAL):** "PATCH C: refatorar helper único para thumbnail pergunta"
- **Commit 4 (BÔNUS):** "PATCH C.2: adicionar zoom no viewer da pergunta"

### Bump CACHE_NAME:
- `vrvs-v5.3.208-patch-c-imagem-pergunta-avaliacao-20260205-1600`

---

## CONCLUSÃO

**Status:** ✅ Preview completo e pronto para execução  
**Confiança:** 95%+ para mudanças essenciais (1-3)  
**Riscos:** Baixos para mudanças essenciais  
**Recomendação:** Executar mudanças 1-3 primeiro, validar, depois considerar 4-5

**Próximo passo:** Aguardar autorização para FASE 2 (execução)
