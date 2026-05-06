# PREVIEW — ALVO A: IMAGEM DO TÓPICO NO "RESULTADO DA AVALIAÇÃO"

**Data:** 2026-02-05  
**Status:** FASE 1 — PREVIEW / DIAGNÓSTICO (SEM EXECUTAR)  
**Prioridade:** ALTA (problema visual na tela final)

---

## 1. CONTEXTO E COMMIT ATUAL

**Commit atual:** `0d92efb` — "PATCH C: corrigir toast ao fechar viewer + validação Modo Avaliação + imagem pergunta no Modo Avaliação"  
**Branch:** `main`  
**CACHE_NAME atual:** `vrvs-v5.3.208-patch-c-imagem-pergunta-avaliacao-20260205-1600`

**Arquivos tocados nos patches recentes relacionados a imagem:**
- `docs/index.html` (PATCH B e PATCH C)
- `docs/sw.js` (bumps de CACHE_NAME)

---

## 2. MAPEAMENTO COMPLETO

### A) Onde a imagem do tópico é salva no objeto da entrada

**Campo exato:** `entrada.imagemPergunta`

**Localização:**
- **Linha 14171:** `entrada.imagemPergunta: imagemPerguntaData || null` (dentro de `salvarEntradaDiario()`)
- **Estrutura do objeto:** `entrada.imagemPergunta.thumbKey` e `entrada.imagemPergunta.fullKey`

**Evidência:**
```javascript
// Linha 14171
entrada.imagemPergunta: imagemPerguntaData || null
```

---

### B) Onde a imagem é renderizada com sucesso

#### 1. **Lista do Diário** ✅ FUNCIONANDO
- **Linha 14812:** `renderEntradaDiario()` renderiza HTML:
  ```javascript
  ${entrada.imagemPergunta && entrada.imagemPergunta.thumbKey ? `<div id="diario-img-pergunta-thumb-${entrada.id}" ...><img id="diario-img-pergunta-${entrada.id}" ... /></div>` : ''}
  ```
- **Linha 14880-14905:** `diario_carregarThumbnails()` carrega thumbnail via `diario_carregarThumbnailUnico()`

#### 2. **Treino Livre (modo normal)** ✅ FUNCIONANDO
- **Linha 16806:** `renderTreinoLivreCard()` renderiza HTML:
  ```javascript
  ${entrada.imagemPergunta && entrada.imagemPergunta.thumbKey ? `<div id="tl-pergunta-thumb-wrap-${entrada.id}" ...><img id="tl-pergunta-thumb-img-${entrada.id}" ... /></div>` : ''}
  ```
- **Linha 16776-16786:** `renderTreinoLivreRunner()` carrega thumbnail

#### 3. **Treino Livre (Modo Avaliação)** ✅ FUNCIONANDO
- **Linha 16847:** `renderTreinoLivreAvaliacao()` renderiza HTML:
  ```javascript
  ${entrada.imagemPergunta && entrada.imagemPergunta.thumbKey ? `<div id="tl-avaliacao-pergunta-thumb-wrap-${entrada.id}" ...><img id="tl-avaliacao-pergunta-thumb-img-${entrada.id}" ... /></div>` : ''}
  ```
- **Linha 16776-16786:** `renderTreinoLivreRunner()` carrega thumbnail (com prefixo condicional)

#### 4. **Revisão Programada (VRVS 3P)** ✅ FUNCIONANDO
- **Linha 16250:** `renderSessaoDiario()` renderiza HTML
- **Linha 16283-16293:** Carrega thumbnail após renderizar

---

### C) Onde o "RESULTADO DA AVALIAÇÃO" é renderizado

**Função exata:** `renderTreinoLivreFim(total, resultado)`  
**Localização:** Linha 17282

**Fluxo de dados:**
1. **Linha 17107-17136:** `encerrarTreinoLivre()` cria snapshot:
   ```javascript
   window.treinoLivreFimDados = {
       fila: [...window.treinoLivreFila], // cópia do array
       modo: modoAvaliacao ? 'avaliacao' : 'normal',
       notas: { ...window.treinoLivreAvaliacao.notas },
       config: { ...window.treinoLivreAvaliacao.config }
   };
   ```

2. **Linha 17186-17207:** `obterCardsOrdenadosPorNota()` retorna array de objetos:
   ```javascript
   return fila.map((entrada, indice) => ({
       entrada: entrada,
       indice: indice,
       nota: notas[indice] || null,
       notaTexto: obterTextoNota(notas[indice], config)
   }));
   ```

3. **Linha 17240-17272:** `window.toggleDetalhesTreinoFim()` renderiza cards de detalhes:
   ```javascript
   cards.forEach((item) => {
       const { entrada, nota, notaTexto } = item;
       html += `
           <details class="card-resultado">
               ...
               <div class="card-resultado-pergunta">
                   ${entrada.topico ? escapeHtml(entrada.topico) : '(Sem tópico)'}
               </div>
               ...
           </details>
       `;
   });
   ```

**Problema identificado:**
- **Linha 17257:** Renderiza apenas `entrada.topico` (texto)
- **Linha 17265:** Renderiza `entrada.imagem` (imagem da RESPOSTA) quando resposta é mostrada
- **FALTA:** Renderização de `entrada.imagemPergunta` (imagem da PERGUNTA)

---

## 3. DIAGNÓSTICO OBJETIVO

### Por que a imagem some no Resultado?

**Hipótese confirmada:**
- ✅ O objeto `entrada` **TEM** o campo `imagemPergunta` (está em `window.treinoLivreFimDados.fila`)
- ❌ O render do Resultado **NÃO inclui** HTML da imagem da pergunta
- ❌ Não há carregamento de thumbnail da pergunta após renderizar cards

**Evidência:**
- `window.treinoLivreFimDados.fila` é cópia de `window.treinoLivreFila` (linha 17123)
- `window.treinoLivreFila` contém entradas completas com `imagemPergunta` (vem de `window.diario.entradas`)
- Mas `toggleDetalhesTreinoFim()` (linha 17240) só renderiza `entrada.topico`, não `entrada.imagemPergunta`

**Comparação:**
- Durante sessão: `renderTreinoLivreAvaliacao()` (linha 16847) inclui HTML da imagem
- Tela final: `toggleDetalhesTreinoFim()` (linha 17257) só inclui texto do tópico

---

## 4. PROPOSTA DE PATCH MÍNIMO

### Opção 1 (PREFERIDA): Adicionar renderização no Resultado

**Estratégia:** Reaproveitar mesmo padrão usado em `renderTreinoLivreAvaliacao()`

**Mudanças necessárias:**

#### Mudança 1: Adicionar HTML da imagem da pergunta (linha 17257)
```diff
-                                        <div class="card-resultado-pergunta">
-                                            ${entrada.topico ? escapeHtml(entrada.topico) : '(Sem tópico)'}
-                                        </div>
+                                        <div class="card-resultado-pergunta">
+                                            ${entrada.topico ? escapeHtml(entrada.topico) : '(Sem tópico)'}
+                                        </div>
+                                        ${entrada.imagemPergunta && entrada.imagemPergunta.thumbKey ? `<div id="resultado-pergunta-thumb-wrap-${entrada.id}" style="margin-top: 8px; margin-bottom: 8px; cursor: pointer;" onclick="diario_abrirViewerImagemPergunta(${entrada.id})"><img id="resultado-pergunta-thumb-img-${entrada.id}" style="display: none; max-width: 100%; max-height: 200px; border-radius: 8px; border: 1px solid rgba(0,206,209,0.3);" /></div>` : ''}
```

#### Mudança 2: Adicionar carregamento de thumbnail após renderizar (linha 17272)
```diff
                        });
                        html += '</div>';
                        container.innerHTML = html;
+                        
+                        // PATCH: Carregar thumbnails das imagens da pergunta
+                        cards.forEach((item) => {
+                            const { entrada } = item;
+                            if (entrada && entrada.id && entrada.imagemPergunta && entrada.imagemPergunta.thumbKey) {
+                                setTimeout(() => {
+                                    diario_carregarThumbnailUnico(
+                                        entrada.id,
+                                        entrada.imagemPergunta.thumbKey,
+                                        `resultado-pergunta-thumb-img-${entrada.id}`,
+                                        `resultado-pergunta-thumb-wrap-${entrada.id}`
+                                    );
+                                }, 50);
+                            }
+                        });
                    }
                    container.setAttribute('data-renderizado', 'true');
```

**Vantagens:**
- ✅ Patch mínimo (2 mudanças pequenas)
- ✅ Reaproveita padrão já testado (`renderTreinoLivreAvaliacao`)
- ✅ Não duplica lógica (usa `diario_carregarThumbnailUnico()` existente)
- ✅ IDs únicos (`resultado-pergunta-thumb-*`) evitam conflitos

**Arquivos modificados:**
- `docs/index.html` (apenas função `toggleDetalhesTreinoFim()`)
- `docs/sw.js` (bump CACHE_NAME)

---

### Opção 2 (ALTERNATIVA): Garantir objeto completo no snapshot

**Estratégia:** Verificar se snapshot está completo (mas já está completo)

**Análise:**
- `window.treinoLivreFimDados.fila` já contém entradas completas (linha 17123)
- Problema não é falta de dados, é falta de renderização
- **Conclusão:** Opção 1 é suficiente

---

## 5. RISCOS / ROLLBACK / CONFIANÇA

### Riscos identificados:

1. **Risco BAIXO:** IDs únicos podem conflitar se houver múltiplos resultados
   - **Mitigação:** IDs incluem `entrada.id` único
   - **Impacto:** Mínimo

2. **Risco BAIXO:** Timing de carregamento pode falhar em mobile
   - **Mitigação:** Usar `setTimeout(50ms)` como já usado em outros lugares
   - **Impacto:** Mínimo (padrão já testado)

3. **Risco BAIXO:** Viewer pode não funcionar se entrada não estiver em `window.diario.entradas`
   - **Mitigação:** `diario_abrirViewerImagemPergunta()` já faz lookup por `entradaId`
   - **Impacto:** Mínimo (função já existe e funciona)

### Rollback simples:
- Reverter commit
- Bump `CACHE_NAME` de volta
- Push

### Confiança:
- **95%+ de confiança** para execução
  - Padrão já testado e funcionando em outros lugares
  - Mudanças mínimas e cirúrgicas
  - Baixo risco de regressão

### Confiança para corrigir se der ruim:
- **Alta (95%+):** Problema bem mapeado, fácil identificar causa
- **Rollback rápido:** Apenas reverter commit

---

## 6. CHECKLIST DE VALIDAÇÃO (iPhone - sem console)

### Teste 1: Imagem na tela de resultado
- [ ] Completar sessão de Treino Livre com Modo Avaliação
- [ ] Na tela "RESULTADO DA AVALIAÇÃO", clicar "Ver detalhes por card"
- [ ] Expandir card que tem imagem da pergunta
- [ ] **ESPERADO:** Thumbnail aparece logo abaixo do texto do tópico ✅
- [ ] **ATUAL:** Só texto aparece, sem imagem ❌

### Teste 2: Viewer funciona
- [ ] Na tela de resultado, tocar na thumbnail da pergunta
- [ ] **ESPERADO:** Viewer abre corretamente ✅

### Teste 3: Anti-regressão
- [ ] Verificar que imagem ainda aparece durante sessão (Treino Livre / Avaliação)
- [ ] Verificar que imagem ainda aparece na Lista do Diário
- [ ] **ESPERADO:** Tudo continua funcionando ✅

---

## CONCLUSÃO

**Status:** ✅ Preview completo e pronto para execução  
**Confiança:** 95%+  
**Riscos:** Baixos  
**Recomendação:** Executar Opção 1 (patch mínimo, reaproveita padrão testado)

**Próximo passo:** Aguardar autorização para FASE 2 (execução)
