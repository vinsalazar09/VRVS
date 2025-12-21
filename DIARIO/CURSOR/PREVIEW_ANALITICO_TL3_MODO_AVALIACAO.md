# 🔍 PREVIEW ANALÍTICO PRÉ-EXECUÇÃO — TL-3 MODO AVALIAÇÃO

**Data:** 21 de Dezembro de 2024  
**Status:** Análise completa antes de implementação  
**Objetivo:** Implementar TL-3 "Modo Avaliação" com feedback 0-100%

---

## 📊 RESUMO EXECUTIVO

### Confiança Geral: **88%**

**Razão para não atingir 95%:** Algumas decisões de UX pendentes (onde mostrar avisos, como pré-preencher Feedback)

| Patch | Confiança | Risco | Status | Rollback |
|-------|-----------|-------|--------|----------|
| **UX-E** | 95% | BAIXO | ✅ Pronto | Remover toggle + validação |
| **UX-F** | 85% | MÉDIO | ✅ Pronto | Reverter runner para TL-2 |
| **UX-G** | 90% | BAIXO | ✅ Pronto | Remover tela resultado |
| **UX-H** | 80% | MÉDIO | ⚠️ Validar | Remover integração |

---

## 🔍 EVIDÊNCIAS NO CÓDIGO

### PATCH UX-E: Toggle Modo Avaliação + Regra Tema Único

**Funções afetadas:**
- `renderConfigTreinoLivre()` — linha **11713-11760**
- `montarTreinoLivre()` — linha **11943** (precisa ler para confirmar)
- `window.treinoLivreConfig` — linha **11704-11710**

**Container:**
- `#diarioSessao` — linha 11714 (container da configuração)

**Estrutura atual:**
- Config tem: Área, Tema, Quantidade
- Botão "Montar Treino" chama `montarTreinoLivre()`

**Função `montarTreinoLivre()` — linha 11943-11973:**
- Lê `window.treinoLivreConfig`
- Filtra entradas por área/tema
- Ordena por data (mais recentes primeiro)
- Limita quantidade
- Salva em `window.treinoLivreFila`

**Mudanças necessárias:**

1. **Adicionar campo `modoAvaliacao` em `window.treinoLivreConfig` (linha 11705):**
   ```javascript
   window.treinoLivreConfig = {
       area: null,
       tema: null,
       quantidade: 10,
       modoAvaliacao: false  // NOVO
   };
   ```

2. **Adicionar toggle na UI (linha ~11754, antes do botão "Montar Treino"):**
   ```html
   <div style="margin-bottom: 16px;">
       <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.9);">
           <input type="checkbox" id="treinoLivreModoAvaliacao" onchange="window.treinoLivreConfig.modoAvaliacao = this.checked; renderConfigTreinoLivre();" ${window.treinoLivreConfig.modoAvaliacao ? 'checked' : ''}>
           📊 Modo Avaliação (gera Feedback 0–100%)
       </label>
   </div>
   ```

3. **Validação em `montarTreinoLivre()` (linha 11943, após linha 11949):**
   ```javascript
   const config = window.treinoLivreConfig;
   
   // Validação: Modo Avaliação requer tema específico
   if (config.modoAvaliacao && !config.tema) {
       mostrarNotificacaoFeedback('⚠️ Modo Avaliação requer um tema específico. Selecione um tema antes de montar o treino.', 'error');
       return;
   }
   
   const filtros = {
       area: config.area || null,
       tema: config.tema || null,
       fonte: 'srs'
   };
   ```

**Dependências:**
- `montarTreinoLivre()` — linha 11943 (estrutura confirmada)
- `mostrarNotificacaoFeedback()` — linha 4062 (função existente)

**Side effects possíveis:**
- Nenhum — apenas adiciona campo e validação

---

### PATCH UX-F: Runner com Recall Ativo + Botões Avaliação

**Funções afetadas:**
- `renderTreinoLivreRunner()` — linha **11781-11834**
- `renderTreinoLivreCard()` — linha **11837-11858**
- `toggleRespostaTreinoLivre()` — linha **11861-11873**
- `treinoLivreProximo()` — linha **11876-11886**
- `treinoLivreAnterior()` — linha **11887-11894**

**Estado necessário:**
- `window.treinoLivreEstado` — linha 11772 (já existe)
- **NOVO:** `window.treinoLivreAvaliacao` — objeto com notas por índice

**Estrutura atual do card (linha 11837-11858):**
- Meta (área/tema)
- Tópico
- Resposta (oculta com toggle)
- Botão "MOSTRAR RESPOSTA"

**Mudanças necessárias:**

1. **Criar estado de avaliação (após linha 11775):**
   ```javascript
   if (window.treinoLivreConfig.modoAvaliacao) {
       window.treinoLivreAvaliacao = {
           notas: {},  // { indice: 0|50|100|null }
           respostaMostrada: {}  // { indice: true/false }
       };
   }
   ```

2. **Modificar `renderTreinoLivreCard()` (linha 11837):**
   - Se `modoAvaliacao === true`:
     - Resposta sempre inicia oculta
     - Após mostrar resposta: exibir botões [❌ ERREI] [⚠️ PARCIAL] [✅ ACERTEI] [⏭️ PULAR]
     - Botões só aparecem após mostrar resposta

3. **Criar funções de avaliação (após linha 11873):**
   ```javascript
   function avaliarTreinoLivre(nota) {
       // nota: 0 (ERREI), 50 (PARCIAL), 100 (ACERTEI)
       const indice = window.treinoLivreEstado.indiceAtual;
       window.treinoLivreAvaliacao.notas[indice] = nota;
       treinoLivreProximo();
   }
   
   function pularAvaliacaoTreinoLivre() {
       const indice = window.treinoLivreEstado.indiceAtual;
       window.treinoLivreAvaliacao.notas[indice] = null;
       treinoLivreProximo();
   }
   ```

4. **Modificar `renderTreinoLivreRunner()` (linha 11781):**
   - Verificar se modo avaliação está ativo
   - Passar estado de avaliação para `renderTreinoLivreCard()`

5. **Modificar navegação (linha 11876, 11887):**
   - Manter possibilidade de reavaliar ao voltar
   - Última nota registrada vale (pode sobrescrever)

**Dependências:**
- `window.treinoLivreConfig.modoAvaliacao` — criado em UX-E
- Estado de avaliação — novo objeto em memória

**Side effects possíveis:**
- Estado de avaliação pode crescer (mitigado: apenas durante sessão)
- Navegação anterior/próximo precisa preservar estado

---

### PATCH UX-G: Tela de Resultado + Cálculo

**Funções afetadas:**
- `encerrarTreinoLivre()` — linha **11903-11909**
- `renderTreinoLivreFim()` — linha **11912** (precisa ler completo)

**Estrutura atual (linha 11912-11926):**
- Tela final simples com mensagem "Treino concluído"
- Mostra total de itens revisados
- Botão "Voltar ao Diário"

**Mudanças necessárias:**

1. **Modificar `encerrarTreinoLivre()` (linha 11903):**
   - Se `modoAvaliacao === true`: calcular feedback antes de renderizar fim
   - Passar dados de avaliação para `renderTreinoLivreFim()`

2. **Criar função de cálculo (após linha 11909):**
   ```javascript
   function calcularFeedbackTL3() {
       const notas = Object.values(window.treinoLivreAvaliacao.notas);
       const avaliados = notas.filter(n => n !== null);
       const total = window.treinoLivreFila.length;
       
       if (avaliados.length === 0) return null;
       
       const media = avaliados.reduce((a, b) => a + b, 0) / avaliados.length;
       const cobertura = avaliados.length / total;
       const feedback = Math.round(media * (0.5 + 0.5 * cobertura));
       
       return {
           feedback,
           media,
           cobertura,
           nAvaliados: avaliados.length,
           nTotal: total,
           breakdown: {
               acertos: avaliados.filter(n => n === 100).length,
               parciais: avaliados.filter(n => n === 50).length,
               erros: avaliados.filter(n => n === 0).length,
               pulados: total - avaliados.length
           }
       };
   }
   ```

3. **Modificar `renderTreinoLivreFim()` (linha 11912):**
   - Se `modoAvaliacao === true`: mostrar resultado completo
   - Exibir: feedback final, média, cobertura, breakdown
   - Avisos: se `nAvaliados < 5` ou `cobertura < 0.60`
   - Botão "📝 ENVIAR PARA FEEDBACK"

**Dependências:**
- `window.treinoLivreAvaliacao` — criado em UX-F
- `window.treinoLivreConfig.modoAvaliacao` — criado em UX-E

**Side effects possíveis:**
- Nenhum — apenas cálculo e renderização

---

### PATCH UX-H: Integração Feedback (Pré-Preencher)

**Funções afetadas:**
- `showSection()` — linha **6853-6872** (função existente, confirma estrutura)
- Campos do formulário Feedback — linha **3138-3192**
- `updateFeedbackTemaSelect()` — linha **5237** (função existente)

**Campos do formulário:**
- `#feedbackArea` — linha 3141
- `#feedbackTema` — linha 3147
- `#feedbackRendimento` — linha 3157
- `#feedbackFlashcards` — linha 3182
- `#feedbackSugestao` — linha 3189

**Funções auxiliares:**
- `updateFeedbackTemaSelect()` — linha 5237 (precisa ler para confirmar)

**Mudanças necessárias:**

1. **Criar função `enviarParaFeedback()` (após linha 11912):**
   ```javascript
   function enviarParaFeedback() {
       const resultado = calcularFeedbackTL3();
       if (!resultado) return;
       
       // Obter área e tema do primeiro card
       const primeiroCard = window.treinoLivreFila[0];
       const area = primeiroCard.area;
       const tema = primeiroCard.tema;
       
       // Ir para aba Feedback
       showSection('feedback');
       
       // Aguardar renderização do formulário
       setTimeout(() => {
           // Pré-preencher campos
           const areaSelect = document.getElementById('feedbackArea');
           const temaSelect = document.getElementById('feedbackTema');
           const rendimentoInput = document.getElementById('feedbackRendimento');
           const flashcardsInput = document.getElementById('feedbackFlashcards');
           const sugestaoTextarea = document.getElementById('feedbackSugestao');
           
           if (areaSelect) {
               areaSelect.value = area;
               updateFeedbackTemaSelect(); // Atualizar temas disponíveis
           }
           
           setTimeout(() => {
               if (temaSelect) temaSelect.value = tema;
               if (rendimentoInput) rendimentoInput.value = resultado.feedback;
               if (flashcardsInput) flashcardsInput.value = resultado.nAvaliados;
               if (sugestaoTextarea) {
                   sugestaoTextarea.value = `TL-3 autoavaliação: ${resultado.feedback}% (${resultado.nAvaliados}/${resultado.nTotal}; cobertura ${Math.round(resultado.cobertura * 100)}%)`;
               }
           }, 100);
       }, 100);
   }
   ```

2. **Adicionar botão na tela de resultado:**
   - Botão "📝 ENVIAR PARA FEEDBACK" → chama `enviarParaFeedback()`

**Dependências:**
- `showSection()` — função existente
- `updateFeedbackTemaSelect()` — função existente
- Campos do formulário — IDs existentes

**Side effects possíveis:**
- Timing pode ser problemático (formulário pode não estar renderizado)
- Precisa aguardar renderização com `setTimeout`

---

## 🚨 RISCOS E GUARDRAILS

### Risco 1: Estado de Avaliação Cresce Indefinidamente

**Mitigação:**
- Estado apenas durante sessão (limpar ao sair)
- Limpar em `sairTreinoLivre()` e `encerrarTreinoLivre()`

**Guardrail:**
- Verificar tamanho do objeto antes de usar
- Limpar explicitamente em pontos de saída

---

### Risco 2: Timing na Integração Feedback (UX-H)

**Problema:**
- `showSection('feedback')` pode não renderizar formulário imediatamente
- Campos podem não existir quando tentamos preencher

**Mitigação:**
- Usar `setTimeout` aninhado (100ms + 100ms)
- Verificar existência de elementos antes de preencher

**Guardrail:**
- Testar no iPhone (pode ser mais lento)
- Adicionar fallback se campos não existirem

---

### Risco 3: Modo Avaliação Ativo Mas Sem Notas

**Problema:**
- Usuário pode encerrar sem avaliar nenhum card
- Cálculo retorna `null` ou erro

**Mitigação:**
- Validar em `encerrarTreinoLivre()`: se `nAvaliados === 0`, mostrar aviso
- Não bloquear encerramento, mas avisar

**Guardrail:**
- Verificar `nAvaliados > 0` antes de calcular
- Mostrar mensagem clara se não houver avaliações

---

### Risco 4: Navegação Anterior/Próximo Perde Estado

**Problema:**
- Ao voltar com "Anterior", estado de avaliação pode ser perdido
- Resposta pode não estar visível se já foi mostrada antes

**Mitigação:**
- Preservar estado de `respostaMostrada` em `window.treinoLivreAvaliacao`
- Ao renderizar card, verificar se resposta já foi mostrada

**Guardrail:**
- Testar navegação completa (anterior/próximo)
- Validar que estado persiste

---

### Risco 5: Validação Tema Único Pode Frustrar Usuário

**Problema:**
- Usuário pode querer usar Modo Avaliação com "Todos os temas"
- Validação impede montar treino

**Mitigação:**
- Mostrar aviso claro: "Modo Avaliação requer tema específico"
- Explicar por quê (feedback precisa de contexto único)

**Guardrail:**
- Mensagem de erro clara e educativa
- Não bloquear sem explicar

---

### Risco 6: Cálculo de Feedback Pode Ser Confuso

**Problema:**
- Fórmula `media * (0.5 + 0.5*cobertura)` pode não ser intuitiva
- Usuário pode não entender como feedback foi calculado

**Mitigação:**
- Mostrar breakdown completo (média, cobertura, feedback)
- Explicar fórmula de forma simples

**Guardrail:**
- Testar compreensão do usuário
- Adicionar tooltip/explicação se necessário

---

## 📋 PLANO DE EXECUÇÃO POR PATCH

### PATCH UX-E: Toggle Modo Avaliação + Regra Tema Único

**Passo a passo:**

1. Adicionar campo `modoAvaliacao: false` em `window.treinoLivreConfig` (linha 11705)
2. Adicionar toggle na UI de `renderConfigTreinoLivre()` (linha ~11754)
3. Ler `montarTreinoLivre()` para entender estrutura
4. Adicionar validação em `montarTreinoLivre()`:
   - Se `modoAvaliacao === true` e `tema === null`: mostrar aviso e retornar
5. Testar: toggle funciona, validação impede montar sem tema

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] Toggle "Modo Avaliação" aparece na config TL-1
- [ ] Toggle pode ser ligado/desligado
- [ ] Com toggle ON e tema "Todos": aviso aparece e não monta treino
- [ ] Com toggle ON e tema específico: monta treino normalmente
- [ ] Com toggle OFF: funciona como antes (sem validação)

**Rollback:**
- Remover campo `modoAvaliacao` de `window.treinoLivreConfig`
- Remover toggle da UI
- Remover validação de `montarTreinoLivre()`

---

### PATCH UX-F: Runner com Recall Ativo + Botões Avaliação

**Passo a passo:**

1. Criar estado `window.treinoLivreAvaliacao` em `iniciarTreinoLivre()` (linha 11772)
2. Modificar `renderTreinoLivreCard()` (linha 11837):
   - Verificar se `modoAvaliacao === true`
   - Se sim: resposta sempre inicia oculta
   - Após mostrar resposta: exibir botões [❌ ERREI] [⚠️ PARCIAL] [✅ ACERTEI] [⏭️ PULAR]
3. Criar funções `avaliarTreinoLivre(nota)` e `pularAvaliacaoTreinoLivre()` (após linha 11873)
4. Modificar `renderTreinoLivreRunner()` (linha 11781):
   - Passar estado de avaliação para card
   - Verificar se modo avaliação está ativo
5. Modificar navegação (linha 11876, 11887):
   - Preservar estado de avaliação ao navegar
   - Permitir reavaliar ao voltar

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] Com Modo Avaliação ON: resposta inicia oculta
- [ ] Botão "MOSTRAR RESPOSTA" funciona
- [ ] Após mostrar resposta: botões [❌ ERREI] [⚠️ PARCIAL] [✅ ACERTEI] [⏭️ PULAR] aparecem
- [ ] Clicar em ERREI/PARCIAL/ACERTEI: registra nota e avança
- [ ] Clicar em PULAR: registra null e avança
- [ ] Navegação Anterior/Próximo preserva estado
- [ ] Ao voltar com Anterior: pode reavaliar (última nota vale)
- [ ] Sem Modo Avaliação: funciona como TL-2 normal

**Rollback:**
- Remover estado `window.treinoLivreAvaliacao`
- Reverter `renderTreinoLivreCard()` para versão TL-2
- Remover funções de avaliação
- Reverter navegação

---

### PATCH UX-G: Tela de Resultado + Cálculo

**Passo a passo:**

1. Criar função `calcularFeedbackTL3()` (após linha 11909)
2. Modificar `encerrarTreinoLivre()` (linha 11903):
   - Se `modoAvaliacao === true`: calcular feedback antes de renderizar
3. Modificar `renderTreinoLivreFim()` (linha 11912):
   - Se `modoAvaliacao === true`: mostrar resultado completo
   - Exibir: feedback final, média, cobertura, breakdown
   - Avisos: se `nAvaliados < 5` ou `cobertura < 0.60`
   - Botão "📝 ENVIAR PARA FEEDBACK"
4. Se `nAvaliados === 0`: mostrar aviso (não bloquear)

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] Ao encerrar com avaliações: mostra resultado completo
- [ ] Feedback final calculado corretamente (fórmula)
- [ ] Média, cobertura, breakdown exibidos
- [ ] Se `nAvaliados < 5`: aviso aparece
- [ ] Se `cobertura < 60%`: aviso aparece
- [ ] Se `nAvaliados === 0`: aviso aparece (não bloqueia)
- [ ] Botão "ENVIAR PARA FEEDBACK" aparece
- [ ] Sem Modo Avaliação: tela final normal (TL-2)

**Rollback:**
- Remover função `calcularFeedbackTL3()`
- Reverter `encerrarTreinoLivre()` e `renderTreinoLivreFim()`

---

### PATCH UX-H: Integração Feedback (Pré-Preencher)

**Passo a passo:**

1. Criar função `enviarParaFeedback()` (após linha 11912)
2. Adicionar botão "📝 ENVIAR PARA FEEDBACK" na tela de resultado
3. Implementar pré-preenchimento:
   - Ir para aba Feedback (`showSection('feedback')`)
   - Aguardar renderização (`setTimeout`)
   - Pré-preencher: área, tema, rendimento, flashcards, sugestão
4. Testar timing no iPhone (pode ser mais lento)

**Critérios de aceite iPhone (PASS/FAIL):**
- [ ] Botão "ENVIAR PARA FEEDBACK" funciona
- [ ] Navega para aba Feedback
- [ ] Campos pré-preenchidos corretamente:
  - [ ] Área: área do primeiro card
  - [ ] Tema: tema do primeiro card
  - [ ] Performance: feedback final calculado
  - [ ] Flashcards: número de avaliados
  - [ ] Sugestão: texto com breakdown
- [ ] Usuário pode editar campos antes de salvar
- [ ] NÃO salva automaticamente (usuário precisa clicar "SALVAR PERFORMANCE")

**Rollback:**
- Remover função `enviarParaFeedback()`
- Remover botão da tela de resultado

---

## ✅ DECISÕES RESTANTES

### Decisão 1: Onde Mostrar Avisos (nAvaliados < 5 ou cobertura < 60%)

**Opções:**
- **Opção A:** Na tela de resultado (após encerrar)
- **Opção B:** Durante o runner (barra de aviso no topo)
- **Opção C:** Ambos

**Sugestão:** Opção A (na tela de resultado)

**Validação necessária:**
- [ ] Confirmar que avisos são claros e não bloqueiam
- [ ] Testar compreensão do usuário

---

### Decisão 2: Como Pré-Preencher Feedback (Timing)

**Opções:**
- **Opção A:** `setTimeout` aninhado (100ms + 100ms)
- **Opção B:** Aguardar evento de renderização do formulário
- **Opção C:** Verificar existência de elementos em loop

**Sugestão:** Opção A (mais simples, testar no iPhone)

**Validação necessária:**
- [ ] Testar no iPhone (pode ser mais lento)
- [ ] Adicionar fallback se campos não existirem

---

### Decisão 3: Texto do Aviso (nAvaliados < 5 ou cobertura < 60%)

**Sugestão:**
- "⚠️ Amostra pequena: menos de 5 avaliações. Resultado pode não ser confiável."
- "⚠️ Cobertura baixa: menos de 60% dos cards avaliados. Resultado pode não refletir desempenho completo."

**Validação necessária:**
- [ ] Confirmar que texto é claro e não assusta usuário
- [ ] Testar compreensão

---

## 📊 ANÁLISE DE CONFIANÇA POR PATCH

### UX-E: 95% de confiança

**Por quê:**
- ✅ Função identificada (`renderConfigTreinoLivre`)
- ✅ Estrutura clara (adicionar toggle + validação)
- ✅ Sem dependências críticas

**O que falta para 100%:**
- Nada — estrutura confirmada ✅

---

### UX-F: 85% de confiança

**Por quê:**
- ✅ Funções identificadas
- ✅ Estrutura clara
- ⚠️ Estado de avaliação precisa gerenciamento cuidadoso
- ⚠️ Navegação precisa preservar estado

**O que falta para 95%:**
- Testar navegação completa (anterior/próximo)
- Validar que estado persiste corretamente

---

### UX-G: 90% de confiança

**Por quê:**
- ✅ Funções identificadas
- ✅ Cálculo claro (fórmula definida)
- ⚠️ Avisos precisam ser claros

**O que falta para 95%:**
- Validar texto dos avisos
- Testar cenários de borda (nAvaliados === 0)

---

### UX-H: 80% de confiança

**Por quê:**
- ✅ Funções identificadas
- ⚠️ Timing pode ser problemático
- ⚠️ Precisa testar no iPhone

**O que falta para 95%:**
- Testar timing no iPhone
- Validar que campos são preenchidos corretamente
- Adicionar fallback se campos não existirem

---

## 🎯 POR QUE NÃO ATINGI 95%+ GERAL

**Confiança atual: 88%**

**Razões:**

1. **UX-H (80%):** Timing na integração Feedback pode ser problemático
   - Impacto: Médio — pode não funcionar no iPhone
   - Ação: Testar no iPhone após implementação

2. **UX-F (85%):** Estado de avaliação precisa gerenciamento cuidadoso
   - Impacto: Médio — navegação pode perder estado
   - Ação: Testar navegação completa após implementação

3. **Decisões pendentes:** Onde mostrar avisos, timing de pré-preenchimento
   - Impacto: Baixo — decisões de UX, não técnicas
   - Ação: Validar com usuário após implementação

**Menor coisa que falta para 95%+:**
- Testar timing de integração Feedback no iPhone (validação de 5 minutos)

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

**UX-E:**
- [ ] Diário > Sessão > Treino livre > Config
- [ ] Verificar: toggle "Modo Avaliação" aparece
- [ ] Ligar toggle + tema "Todos" → aviso aparece
- [ ] Ligar toggle + tema específico → monta treino

**UX-F:**
- [ ] Iniciar treino com Modo Avaliação ON
- [ ] Verificar: resposta oculta, botão "MOSTRAR RESPOSTA"
- [ ] Mostrar resposta → botões avaliação aparecem
- [ ] Avaliar card → avança para próximo
- [ ] Navegar anterior/próximo → estado preserva

**UX-G:**
- [ ] Encerrar treino com avaliações
- [ ] Verificar: resultado completo aparece
- [ ] Verificar: feedback, média, cobertura, breakdown
- [ ] Verificar: avisos aparecem se necessário

**UX-H:**
- [ ] Clicar "ENVIAR PARA FEEDBACK"
- [ ] Verificar: navega para aba Feedback
- [ ] Verificar: campos pré-preenchidos corretamente
- [ ] Verificar: pode editar antes de salvar

---

## ✅ CONCLUSÃO

**Status:** ✅ Pronto para executar após validações

**Principais ajustes necessários:**
1. Ler `montarTreinoLivre()` para confirmar estrutura (UX-E)
2. Testar timing de integração Feedback no iPhone (UX-H)
3. Validar navegação preserva estado (UX-F)

**Recomendação:** Executar patches em sequência (UX-E → UX-F → UX-G → UX-H), validando no iPhone após cada patch.

---

**Documento criado para validação técnica completa antes de execução.**

