# 🔍 PREVIEW ANALÍTICO — TL-3 MODO AVALIAÇÃO (SPEC OPUS v2.0)

**Data:** 21 de Dezembro de 2024  
**Status:** Análise completa antes de implementação  
**Base:** UX PATCH SPEC v2.0 Final (Opus)

---

## 📊 RESUMO EXECUTIVO

### Confiança Geral: **87%**

**Razão para não atingir 95%:** Algumas decisões de UX pendentes (valores da escala, timing de integração Feedback)

| Patch | Confiança | Risco | Status | Rollback |
|-------|-----------|-------|--------|----------|
| **UX-E** | 95% | BAIXO | ✅ Pronto | Remover toggle + validação |
| **UX-F** | 85% | MÉDIO | ✅ Pronto | Reverter runner para TL-2 |
| **UX-G** | 90% | BAIXO | ✅ Pronto | Remover tela resultado |
| **UX-H** | 80% | MÉDIO | ⚠️ Validar | Remover integração |
| **UX-I** | 90% | BAIXO | ✅ Pronto | Remover modal + localStorage |

---

## 🎨 ANÁLISE UX vs LÓGICA/DADOS

### PATCH UX-E: Toggle Modo Avaliação + Regra Tema Único

**O que é só UX (ok implementar):**
- ✅ Toggle visual na interface
- ✅ Texto do botão muda ("MONTAR TREINO" → "INICIAR AVALIAÇÃO")
- ✅ Link "⚙️ Config. avançada" aparece/desaparece
- ✅ Aviso visual quando tema não específico

**O que encosta em lógica/dados:**
- ⚠️ **Estado:** `window.treinoLivreConfig.modoAvaliacao` (em memória, não persiste)
- ⚠️ **Validação:** Lógica que impede montar treino se `modoAvaliacao === true` e `tema === null`
- ⚠️ **Fluxo:** Modifica comportamento de `montarTreinoLivre()` (linha 11943)

**Pontos de atenção:**
- Estado em memória (não persiste entre sessões) ✅ Seguro
- Validação modifica fluxo existente ⚠️ Precisa testar bem

---

### PATCH UX-F: Runner TL-3 com Avaliação

**O que é só UX (ok implementar):**
- ✅ Grid 2x2 de botões de avaliação
- ✅ Estilos visuais (cores por tipo)
- ✅ Texto "Na prova, você teria..."
- ✅ Progresso no header (X / N)

**O que encosta em lógica/dados:**
- ⚠️ **Estado:** `window.treinoLivreAvaliacao` (objeto em memória)
  ```javascript
  {
      notas: {},  // { indice: 20|50|90|100|null }
      respostaMostrada: {},  // { indice: true/false }
      config: { naosei: 20, entre2: 50, acertaria: 90, dominado: 100 }
  }
  ```
- ⚠️ **Lógica:** Funções de avaliação (`avaliarTreinoLivre(nota)`, `pularAvaliacaoTreinoLivre()`)
- ⚠️ **Navegação:** Modifica `treinoLivreProximo()` e `treinoLivreAnterior()` para preservar estado
- ⚠️ **Renderização:** Modifica `renderTreinoLivreCard()` para mostrar botões condicionalmente

**Pontos de atenção:**
- Estado cresce durante sessão (mitigado: limpar ao sair)
- Navegação precisa preservar estado ⚠️ Testar bem
- Resposta mostrada precisa persistir ao navegar ⚠️ Testar bem

---

### PATCH UX-G: Tela de Resultado + Cálculo

**O que é só UX (ok implementar):**
- ✅ Display grande do score (78%)
- ✅ Barra de progresso visual
- ✅ Breakdown em tabela
- ✅ Avisos visuais

**O que encosta em lógica/dados:**
- ⚠️ **Cálculo:** Função `calcularFeedbackTL3(notas, config)` (lógica matemática)
- ⚠️ **Estado:** Lê `window.treinoLivreAvaliacao.notas` para calcular
- ⚠️ **Validação:** Verifica `nAvaliados === 0`, `nAvaliados < 5`, `cobertura < 60%`

**Pontos de atenção:**
- Cálculo precisa ser preciso (média simples) ✅ Simples
- Validação de edge cases (nenhum avaliado) ✅ Tratado

---

### PATCH UX-H: Integração Feedback (Pré-Preencher)

**O que é só UX (ok implementar):**
- ✅ Navegação para aba Feedback
- ✅ Pré-preenchimento visual de campos

**O que encosta em lógica/dados:**
- ⚠️ **Navegação:** `showSection('feedback')` (linha 6853)
- ⚠️ **Manipulação DOM:** Preencher campos do formulário (`#feedbackArea`, `#feedbackTema`, etc.)
- ⚠️ **Timing:** Precisa aguardar renderização do formulário
- ⚠️ **Dados:** Lê `window.treinoLivreFila[0]` para área/tema
- ⚠️ **Dados:** Lê resultado do cálculo para rendimento/flashcards

**Pontos de atenção:**
- Timing pode ser problemático no iPhone ⚠️ Testar bem
- Campos podem não existir quando tentamos preencher ⚠️ Validar existência
- Não salva automaticamente ✅ Seguro

---

### PATCH UX-I: Config Avançada (Customização de Valores)

**O que é só UX (ok implementar):**
- ✅ Modal de configuração
- ✅ Inputs para valores
- ✅ Validação visual (destacar campos com erro)

**O que encosta em lógica/dados:**
- ⚠️ **Persistência:** `localStorage.setItem('vrvs_avaliacao_config', ...)` (NOVO)
- ⚠️ **Carregamento:** `localStorage.getItem('vrvs_avaliacao_config')` na inicialização
- ⚠️ **Validação:** Lógica que valida valores (0-100, ordem crescente)
- ⚠️ **Estado:** `window.treinoLivreAvaliacao.config` (usa valores customizados)

**Pontos de atenção:**
- Nova chave localStorage (não conflita com existentes) ✅ Seguro
- Validação precisa ser robusta ⚠️ Testar edge cases
- Valores default se não existir ✅ Tratado

---

## 🚨 RISCOS DE BUG/CACHE/SW E COMO REDUZIR (PATCH POR PATCH)

### PATCH UX-E: Riscos e Mitigações

**Risco 1: Estado `modoAvaliacao` não persiste entre sessões**

**Problema:** Usuário fecha app e reabre → toggle volta para OFF

**Mitigação:** ✅ Comportamento esperado (estado em memória, não persiste)

**Como reduzir:** Nenhuma ação necessária (é feature, não bug)

---

**Risco 2: Validação tema único pode frustrar usuário**

**Problema:** Usuário liga toggle mas esquece de selecionar tema → não consegue montar

**Mitigação:** 
- Mostrar aviso claro: "⚠️ Para usar Modo Avaliação, selecione um tema específico"
- Explicar por quê: "O feedback será registrado para esse tema"

**Como reduzir:**
- Aviso deve ser claro e educativo
- Não bloquear sem explicar

---

**Risco 3: Cache antigo pode não mostrar toggle**

**Problema:** Service Worker cache antigo → toggle não aparece

**Mitigação:** 
- Bump `CACHE_NAME` em `docs/sw.js` após implementação
- Usar `recovery_sw.html` se necessário

**Como reduzir:**
- Sempre bump CACHE_NAME ao final
- Testar no iPhone após deploy

---

### PATCH UX-F: Riscos e Mitigações

**Risco 1: Estado de avaliação cresce indefinidamente**

**Problema:** `window.treinoLivreAvaliacao.notas` pode crescer se não limpar

**Mitigação:**
- Limpar em `sairTreinoLivre()` (linha 11897)
- Limpar em `encerrarTreinoLivre()` (linha 11903)

**Como reduzir:**
- Sempre limpar estado ao sair
- Validar que limpeza funciona

---

**Risco 2: Navegação anterior/próximo perde estado**

**Problema:** Ao voltar com "Anterior", estado de avaliação pode ser perdido

**Mitigação:**
- Preservar estado em `window.treinoLivreAvaliacao.notas`
- Preservar estado de resposta mostrada em `window.treinoLivreAvaliacao.respostaMostrada`

**Como reduzir:**
- Testar navegação completa (anterior/próximo)
- Validar que estado persiste corretamente

---

**Risco 3: Resposta não mostra botões após mostrar**

**Problema:** Após mostrar resposta, botões podem não aparecer

**Mitigação:**
- Verificar se `modoAvaliacao === true` antes de mostrar botões
- Verificar se resposta foi mostrada (`respostaMostrada[indice] === true`)

**Como reduzir:**
- Testar fluxo completo: oculta → mostrar → botões aparecem
- Validar que botões aparecem corretamente

---

**Risco 4: Cache antigo pode não mostrar botões de avaliação**

**Problema:** Service Worker cache antigo → botões não aparecem

**Mitigação:**
- Bump `CACHE_NAME` em `docs/sw.js` após implementação
- Usar `recovery_sw.html` se necessário

**Como reduzir:**
- Sempre bump CACHE_NAME ao final
- Testar no iPhone após deploy

---

### PATCH UX-G: Riscos e Mitigações

**Risco 1: Cálculo incorreto do score**

**Problema:** Fórmula pode calcular errado se valores customizados

**Mitigação:**
- Usar valores de `window.treinoLivreAvaliacao.config` (não hardcoded)
- Validar que valores são números válidos

**Como reduzir:**
- Testar com valores default (20/50/90/100)
- Testar com valores customizados
- Validar cálculo manualmente

---

**Risco 2: Edge case: nenhum card avaliado**

**Problema:** Se `nAvaliados === 0`, cálculo pode quebrar

**Mitigação:**
- Validar `nAvaliados === 0` antes de calcular
- Mostrar mensagem específica: "⚠️ Nenhum card avaliado"
- Não mostrar botão "ENVIAR PARA FEEDBACK"

**Como reduzir:**
- Testar cenário: pular todos os cards
- Validar que mensagem aparece corretamente

---

**Risco 3: Breakdown incorreto**

**Problema:** Contagem por categoria pode estar errada

**Mitigação:**
- Usar `filter()` para contar cada categoria
- Validar que soma de categorias = `nAvaliados`

**Como reduzir:**
- Testar com diferentes combinações de notas
- Validar que breakdown está correto

---

### PATCH UX-H: Riscos e Mitigações

**Risco 1: Timing — campos não existem quando tentamos preencher**

**Problema:** `showSection('feedback')` pode não renderizar formulário imediatamente

**Mitigação:**
- Usar `setTimeout` aninhado (100ms + 100ms)
- Verificar existência de elementos antes de preencher
- Adicionar fallback se campos não existirem

**Como reduzir:**
- Testar no iPhone (pode ser mais lento)
- Aumentar timeout se necessário (200ms + 200ms)
- Adicionar retry (tentar até 3 vezes)

---

**Risco 2: `updateFeedbackTemaSelect()` não atualiza temas**

**Problema:** Após preencher área, temas podem não estar disponíveis

**Mitigação:**
- Chamar `updateFeedbackTemaSelect()` após preencher área
- Aguardar renderização antes de preencher tema

**Como reduzir:**
- Testar fluxo completo: área → temas atualizam → tema preenche
- Validar que temas estão disponíveis

---

**Risco 3: Cache antigo pode não pré-preencher**

**Problema:** Service Worker cache antigo → função não existe

**Mitigação:**
- Bump `CACHE_NAME` em `docs/sw.js` após implementação
- Usar `recovery_sw.html` se necessário

**Como reduzir:**
- Sempre bump CACHE_NAME ao final
- Testar no iPhone após deploy

---

### PATCH UX-I: Riscos e Mitigações

**Risco 1: Validação de valores pode ser bypassada**

**Problema:** Usuário pode inserir valores inválidos (ex: > 100, ordem não crescente)

**Mitigação:**
- Validar antes de salvar
- Não fechar modal se inválido
- Destacar campos com erro

**Como reduzir:**
- Testar todos os casos de erro
- Validar que modal não fecha se inválido

---

**Risco 2: localStorage pode estar cheio**

**Problema:** localStorage pode estar próximo do limite (5-10MB)

**Mitigação:**
- Nova chave `vrvs_avaliacao_config` é pequena (~100 bytes)
- Não afeta outras chaves

**Como reduzir:**
- Verificar tamanho antes de salvar (opcional)
- Validar que não causa problemas

---

**Risco 3: Valores default não carregam**

**Problema:** Se `localStorage.getItem('vrvs_avaliacao_config')` retorna null, valores default devem ser usados

**Mitigação:**
- Sempre ter fallback para valores default (20/50/90/100)
- Validar que valores default são usados se não existir

**Como reduzir:**
- Testar com localStorage limpo
- Validar que valores default são usados

---

**Risco 4: Cache antigo pode não mostrar modal**

**Problema:** Service Worker cache antigo → modal não aparece

**Mitigação:**
- Bump `CACHE_NAME` em `docs/sw.js` após implementação
- Usar `recovery_sw.html` se necessário

**Como reduzir:**
- Sempre bump CACHE_NAME ao final
- Testar no iPhone após deploy

---

## 🗺️ MAPA DE INTEGRAÇÃO COM O QUE JÁ EXISTE

### Integração com TL-1 (Configuração)

**Função:** `renderConfigTreinoLivre()` — linha 11713-11760

**Modificações necessárias:**
- Adicionar toggle "Modo Avaliação" no HTML (linha ~11754)
- Adicionar campo `modoAvaliacao: false` em `window.treinoLivreConfig` (linha 11705)
- Adicionar link "⚙️ Config. avançada" (só visível se `modoAvaliacao === true`)

**Dependências:**
- `window.treinoLivreConfig` — já existe ✅
- `montarTreinoLivre()` — já existe ✅ (linha 11943)

**Fluxo:**
```
Config TL-1 → Toggle ON → Tema específico → Montar → Confirmação
```

**Pontos de atenção:**
- Toggle modifica comportamento de `montarTreinoLivre()` ⚠️ Testar validação

---

### Integração com TL-2 (Runner)

**Função:** `renderTreinoLivreRunner()` — linha 11781-11834

**Modificações necessárias:**
- Verificar se `modoAvaliacao === true` antes de renderizar
- Se sim: chamar `renderTreinoLivreAvaliacao()` (nova função)
- Se não: usar `renderTreinoLivreCard()` existente (TL-2 normal)

**Dependências:**
- `renderTreinoLivreCard()` — já existe ✅ (linha 11837)
- `toggleRespostaTreinoLivre()` — já existe ✅ (linha 11861)
- `treinoLivreProximo()` — já existe ✅ (linha 11876)
- `treinoLivreAnterior()` — já existe ✅ (linha 11887)

**Fluxo:**
```
Runner TL-2 → Modo Avaliação? → Sim: TL-3 (avaliação) | Não: TL-2 (read-only)
```

**Pontos de atenção:**
- Precisa criar função nova `renderTreinoLivreAvaliacao()` ⚠️ Não existe ainda
- Navegação precisa preservar estado ⚠️ Testar bem

---

### Integração com Aba Feedback

**Função:** `showSection()` — linha 6853-6872

**Modificações necessárias:**
- Criar função `enviarParaFeedback()` (nova)
- Navegar para `showSection('feedback')`
- Pré-preencher campos do formulário

**Campos do formulário (linha 3138-3192):**
- `#feedbackArea` — linha 3141 ✅
- `#feedbackTema` — linha 3147 ✅
- `#feedbackRendimento` — linha 3157 ✅
- `#feedbackFlashcards` — linha 3182 ✅
- `#feedbackSugestao` — linha 3189 ✅

**Funções auxiliares:**
- `updateFeedbackTemaSelect()` — linha 5237 ✅ (atualiza temas após selecionar área)

**Fluxo:**
```
Resultado TL-3 → Clicar "ENVIAR PARA FEEDBACK" → Navegar Feedback → Pré-preencher → Usuário salva
```

**Pontos de atenção:**
- Timing pode ser problemático ⚠️ Testar no iPhone
- Campos podem não existir ⚠️ Validar existência

---

### Integração com `vrvs_config` (localStorage)

**Chave existente:** `vrvs_config` — linha 3687

**Nova chave:** `vrvs_avaliacao_config` (UX-I)

**Estrutura proposta:**
```javascript
{
    naosei: 20,
    entre2: 50,
    acertaria: 90,
    dominado: 100,
    preset: 'prova_teot' // 'prova_teot' | 'binario' | 'conservador'
}
```

**Carregamento:**
- Carregar na inicialização (após linha 11710)
- Se não existir: usar valores default (20/50/90/100)

**Persistência:**
- Salvar em `localStorage.setItem('vrvs_avaliacao_config', ...)` quando usuário salva no modal

**Pontos de atenção:**
- Nova chave não conflita com existentes ✅ Seguro
- Valores default sempre disponíveis ✅ Tratado

---

## 📋 ESTRUTURA DE DADOS EM MEMÓRIA

### `window.treinoLivreConfig` (já existe)

**Localização:** Linha 11704-11710

**Estrutura atual:**
```javascript
{
    area: null,
    tema: null,
    quantidade: 10
}
```

**Modificação UX-E:**
```javascript
{
    area: null,
    tema: null,
    quantidade: 10,
    modoAvaliacao: false  // NOVO
}
```

**Persistência:** ❌ Não persiste (em memória apenas)

---

### `window.treinoLivreAvaliacao` (NOVO - UX-F)

**Localização:** Criar após linha 11775 (em `iniciarTreinoLivre()`)

**Estrutura:**
```javascript
{
    notas: {
        0: 90,    // índice do card: nota (20|50|90|100|null)
        1: 100,
        2: null,  // pulado
        3: 50
    },
    respostaMostrada: {
        0: true,  // índice do card: resposta foi mostrada?
        1: true,
        2: false,
        3: true
    },
    config: {
        naosei: 20,
        entre2: 50,
        acertaria: 90,
        dominado: 100
    }
}
```

**Persistência:** ❌ Não persiste (em memória apenas, limpar ao sair)

**Limpeza:**
- Em `sairTreinoLivre()` — linha 11897
- Em `encerrarTreinoLivre()` — linha 11903

---

### `localStorage.getItem('vrvs_avaliacao_config')` (NOVO - UX-I)

**Localização:** Criar após linha 11710 (carregar na inicialização)

**Estrutura:**
```javascript
{
    naosei: 20,
    entre2: 50,
    acertaria: 90,
    dominado: 100,
    preset: 'prova_teot'
}
```

**Persistência:** ✅ Persiste em localStorage

**Default:** Se não existir, usar `{ naosei: 20, entre2: 50, acertaria: 90, dominado: 100, preset: 'prova_teot' }`

---

## 🔗 DEPENDÊNCIAS ENTRE PATCHES

### Árvore de Dependências

```
UX-E (Toggle)
  ├─ UX-F (Runner) ──→ UX-G (Resultado) ──→ UX-H (Feedback)
  └─ UX-I (Config Avançada)
```

**Ordem de implementação sugerida:**
1. UX-E (Toggle) — nenhuma dependência
2. UX-I (Config Avançada) — depende de UX-E (toggle precisa estar ON)
3. UX-F (Runner) — depende de UX-E (precisa saber se modo avaliação está ON)
4. UX-G (Resultado) — depende de UX-F (precisa de notas para calcular)
5. UX-H (Feedback) — depende de UX-G (precisa de resultado para enviar)

---

## 📍 ONDE MEXEU (RESUMO POR PATCH)

### UX-E: Toggle Modo Avaliação

**Arquivo:** `docs/index.html`

**Linhas modificadas:**
- Linha 11705: Adicionar `modoAvaliacao: false` em `window.treinoLivreConfig`
- Linha ~11754: Adicionar toggle no HTML de `renderConfigTreinoLivre()`
- Linha ~11755: Adicionar link "⚙️ Config. avançada" (condicional)
- Linha 11949: Adicionar validação em `montarTreinoLivre()`

**Novas funções:** Nenhuma

**Modificações em funções existentes:**
- `renderConfigTreinoLivre()` — adicionar toggle
- `montarTreinoLivre()` — adicionar validação

---

### UX-F: Runner TL-3

**Arquivo:** `docs/index.html`

**Linhas modificadas:**
- Linha 11772: Criar `window.treinoLivreAvaliacao` em `iniciarTreinoLivre()`
- Linha 11781: Modificar `renderTreinoLivreRunner()` para verificar modo avaliação
- Linha 11837: Modificar `renderTreinoLivreCard()` OU criar `renderTreinoLivreAvaliacao()`
- Linha 11876: Modificar `treinoLivreProximo()` para preservar estado
- Linha 11887: Modificar `treinoLivreAnterior()` para preservar estado
- Linha 11897: Limpar estado em `sairTreinoLivre()`

**Novas funções:**
- `renderTreinoLivreAvaliacao(entrada, indice, total)` — após linha 11858
- `avaliarTreinoLivre(nota)` — após linha 11873
- `pularAvaliacaoTreinoLivre()` — após linha 11873

**Modificações em funções existentes:**
- `iniciarTreinoLivre()` — criar estado avaliação
- `renderTreinoLivreRunner()` — verificar modo avaliação
- `treinoLivreProximo()` — preservar estado
- `treinoLivreAnterior()` — preservar estado
- `sairTreinoLivre()` — limpar estado

---

### UX-G: Tela de Resultado

**Arquivo:** `docs/index.html`

**Linhas modificadas:**
- Linha 11903: Modificar `encerrarTreinoLivre()` para calcular feedback
- Linha 11912: Modificar `renderTreinoLivreFim()` para mostrar resultado completo

**Novas funções:**
- `calcularFeedbackTL3(notas, config)` — após linha 11909

**Modificações em funções existentes:**
- `encerrarTreinoLivre()` — calcular feedback antes de renderizar
- `renderTreinoLivreFim()` — mostrar resultado completo se modo avaliação

---

### UX-H: Integração Feedback

**Arquivo:** `docs/index.html`

**Linhas modificadas:**
- Linha 11912: Adicionar botão "ENVIAR PARA FEEDBACK" na tela de resultado

**Novas funções:**
- `enviarParaFeedback()` — após linha 11912

**Modificações em funções existentes:**
- `renderTreinoLivreFim()` — adicionar botão "ENVIAR PARA FEEDBACK"

**Dependências externas:**
- `showSection()` — linha 6853 (função existente)
- `updateFeedbackTemaSelect()` — linha 5237 (função existente)
- Campos do formulário Feedback — linha 3138-3192 (IDs existentes)

---

### UX-I: Config Avançada

**Arquivo:** `docs/index.html`

**Linhas modificadas:**
- Linha 11710: Carregar `localStorage.getItem('vrvs_avaliacao_config')` na inicialização
- Linha ~11754: Adicionar link "⚙️ Config. avançada" na config TL-1

**Novas funções:**
- `abrirConfigAvaliacao()` — após linha 11760
- `salvarConfigAvaliacao()` — após linha 11760
- `validarConfigAvaliacao(valores)` — após linha 11760

**Novo HTML:**
- Modal de configuração (adicionar no HTML, após linha ~11760)

**Modificações em funções existentes:**
- `renderConfigTreinoLivre()` — adicionar link "⚙️ Config. avançada"

**localStorage:**
- Nova chave: `vrvs_avaliacao_config`

---

## 🎯 CHECKLIST PRÉ-EXECUÇÃO

### Antes de implementar, confirmar:

**UX-E:**
- [ ] Estrutura de `window.treinoLivreConfig` confirmada ✅
- [ ] Função `montarTreinoLivre()` lida e entendida ✅
- [ ] Função `mostrarNotificacaoFeedback()` existe ✅ (linha 4062)

**UX-F:**
- [ ] Funções de navegação (`treinoLivreProximo`, `treinoLivreAnterior`) lidas ✅
- [ ] Função `renderTreinoLivreCard()` lida ✅
- [ ] Estado de avaliação definido (estrutura clara) ✅

**UX-G:**
- [ ] Função `renderTreinoLivreFim()` lida ✅
- [ ] Fórmula de cálculo definida (média simples) ✅
- [ ] Edge cases tratados (nenhum avaliado) ✅

**UX-H:**
- [ ] Função `showSection()` lida ✅
- [ ] Função `updateFeedbackTemaSelect()` existe ✅ (linha 5237)
- [ ] IDs dos campos do formulário confirmados ✅

**UX-I:**
- [ ] Estrutura de localStorage entendida ✅
- [ ] Validação de valores definida ✅
- [ ] Valores default definidos ✅

---

## ✅ CONCLUSÃO

**Status:** ✅ Pronto para executar após validações

**Principais ajustes necessários:**
1. Testar timing de integração Feedback no iPhone (UX-H)
2. Validar navegação preserva estado (UX-F)
3. Testar validação de valores customizados (UX-I)

**Recomendação:** Executar patches em sequência (UX-E → UX-I → UX-F → UX-G → UX-H), validando no iPhone após cada patch.

**Riscos principais:**
- Timing na integração Feedback (UX-H) — médio risco
- Estado de avaliação (UX-F) — médio risco
- Cache antigo — baixo risco (mitigado com bump CACHE_NAME)

---

**Documento criado para validação técnica completa antes de execução.**

