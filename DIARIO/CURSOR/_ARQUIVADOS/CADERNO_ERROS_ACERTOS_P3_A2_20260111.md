# CADERNO DE ERROS E ACERTOS — P3 + Ajuste 2
## Lições Aprendidas e Métodos Corretos

**Data:** 11/01/2026  
**Rodada:** P3 (primeira linha centralizada) + Ajuste 2 (treino esquecidos)  
**Status:** ✅ Ambos resolvidos e validados

---

## 📋 RESUMO EXECUTIVO

### ✅ Problemas Resolvidos

1. **P3 — Primeira linha centralizada:** ✅ RESOLVIDO
   - Causa: indentação + newline no template literal HTML
   - Solução: remover whitespace estrutural do template (não do conteúdo)

2. **Ajuste 2 — Treino Esquecidos bloqueado:** ✅ RESOLVIDO
   - Causa: validação não verificava `config.esquecidos`
   - Solução: adicionar exceção na validação de período/tema

---

## 🔴 P3 — HISTÓRICO DE ERROS E TENTATIVAS FALHAS

### Tentativa 1: Box Fixo para "Mostrar Resposta" (v5.3.64)

**O que foi feito:**
- Adicionado container sempre renderizado para resposta
- Tentativa de controlar visibilidade via CSS

**Resultado:** ❌ Box vazio aparecia antes do clique + bug CSS

**Motivo do erro:**
- Container sempre renderizava, criando ruído visual
- Não era problema de estrutura, mas de lógica de exibição

**Lição aprendida:**
- Não criar elementos sempre renderizados se não devem aparecer
- Usar atributo `hidden` ou lógica condicional no template

---

### Tentativa 2: CSS `text-align`, `display:block`, `!important` (v5.3.65)

**O que foi feito:**
- Adicionado múltiplas regras CSS com `!important`
- Tentativa de forçar alinhamento à esquerda

**Resultado:** ❌ Sem efeito

**Motivo do erro:**
- Não era problema de alinhamento CSS
- Era problema de **whitespace estrutural** no template HTML
- CSS não remove whitespace preservado por `white-space: pre-wrap`

**Lição aprendida:**
- **NUNCA atacar sintomas CSS antes de confirmar estrutura HTML**
- `white-space: pre-wrap` preserva espaços do template literal
- Indentação no código fonte vira espaço real no DOM

---

### Tentativa 3: Alterar `normalizarTextoDiario()` removendo whitespace do conteúdo (v5.3.66-68)

**O que foi feito:**
- Adicionado `replace(/^\s+/, '')` em `normalizarTextoDiario()`
- Tentativa de remover whitespace inicial do texto salvo

**Resultado:** ❌ Não resolveu

**Motivo do erro:**
- O deslocamento **NÃO vinha do texto salvo**
- O deslocamento vinha do **template literal do HTML**
- Texto na edição/criação estava correto (evidência: print 4)
- Problema só aparecia na renderização (modo sessão)

**Lição aprendida:**
- **Validar origem do problema antes de mexer em funções de conteúdo**
- Se texto está correto na edição mas errado na renderização → problema é template HTML
- `normalizarTextoDiario()` deve tratar apenas conteúdo; layout é responsabilidade do template

---

### ✅ Solução Correta (v5.3.76)

**Causa-raiz identificada:**
- Indentação + quebra de linha dentro do template literal
- Exemplo problemático:
  ```javascript
  <div class="diario-sessao-topico" style="...">
      ❓ ${formatarTextoDiario(entrada.topico)}  // ← indentação + newline aqui
  </div>
  ```
- Com `white-space: pre-wrap`, essa indentação era renderizada como espaço real

**Patch aplicado:**
- Remover newline e indentação do template HTML (não tocar no CSS)
- Exemplo corrigido:
  ```javascript
  <div class="diario-sessao-topico" style="...">❓ ${formatarTextoDiario(entrada.topico)}</div>
  ```
- Manter `pre-wrap` para preservar formatação de múltiplas linhas (conteúdo)

**Resultado:** ✅ RESOLVIDO
- Treino Livre e Diário alinhados
- 1ª linha idêntica às demais
- Sem regressões visuais

**Lugares corrigidos:**
1. `renderTreinoLivreCard()` (linha ~13087)
2. `renderTreinoLivreAvaliacao()` (linha ~13124)
3. `renderSessaoDiario()` (linha ~12603)

---

## 🔴 AJUSTE 2 — HISTÓRICO DE ERROS E TENTATIVAS FALHAS

### Tentativa 1: Validação bloqueava modo "Esquecidos"

**O que foi feito:**
- Implementado filtro `config.esquecidos` na função `getEntradasTreinoLivreDiario()`
- Criado contador `contarEsquecidosTreinoLivre()`
- Adicionado UI com radio button

**Resultado:** ❌ Bloqueio "Selecione período" mesmo no modo "esquecidos"

**Motivo do erro:**
- Validação de modo Avaliação exigia tema/período **sem exceção**
- Não verificava se modo "Esquecidos" estava ativo antes de bloquear
- Validação executava antes do filtro ser aplicado

**Código problemático (linha ~13521):**
```javascript
if (config.modoAvaliacao && !config.tema && (!config.periodo || config.periodo === 'todos')) {
    mostrarNotificacaoFeedback('⚠️ Para usar Modo Avaliação, selecione um tema específico ou filtre por período.', 'error');
    return;
}
```

**Problema:** Não verificava `config.esquecidos`

---

### ✅ Solução Correta (v5.3.77)

**Patch aplicado:**
```javascript
// Ajuste 2: Modo "Esquecidos" não precisa de filtro de período/tema
const modoEsquecidos = !!config.esquecidos || config.tipoTreino === 'esquecidos' || config.apenasEsquecidos === true;

// Validação: Modo Avaliação requer tema específico OU filtro por período (exceto modo Esquecidos)
if (config.modoAvaliacao && !modoEsquecidos && !config.tema && (!config.periodo || config.periodo === 'todos')) {
    mostrarNotificacaoFeedback('⚠️ Para usar Modo Avaliação, selecione um tema específico ou filtre por período.', 'error');
    return;
}
```

**Explicação:**
- Criar variável `modoEsquecidos` robusta (verifica múltiplas possibilidades)
- Adicionar `!modoEsquecidos` na condição de validação
- Se modo "Esquecidos" estiver ativo, **pular** validação de período/tema

**Resultado:** ✅ RESOLVIDO
- Treino roda normalmente sem pedir período/tema
- Contador de cards esquecidos exibe número correto
- Mensagens UX de "sem esquecidos" funcionam

---

## 🧠 LIÇÕES APRENDIDAS (Para Cursor e Futuro)

### Regra 1: Diagnóstico antes de CSS

**❌ ERRADO:**
- Atacar sintomas CSS (`text-align`, `display`, `!important`) sem confirmar estrutura HTML
- Assumir que problema é CSS quando pode ser template literal

**✅ CORRETO:**
- Sempre validar estrutura HTML gerada antes de mexer em CSS
- Em casos de centralização, validar whitespace de template literal + `pre-wrap` primeiro
- Se texto está correto na edição mas errado na renderização → problema é template HTML

**Checklist de diagnóstico:**
1. Texto está correto na edição/criação? ✅ Sim → problema é template
2. Template tem indentação/newline antes do conteúdo? ✅ Sim → remover whitespace estrutural
3. CSS tem `white-space: pre-wrap`? ✅ Sim → whitespace do template será preservado

---

### Regra 2: Funções de conteúdo vs Template HTML

**❌ ERRADO:**
- Modificar `normalizarTextoDiario()` para corrigir problema de layout
- Assumir que whitespace vem do conteúdo quando vem do template

**✅ CORRETO:**
- `normalizarTextoDiario()` deve tratar apenas **conteúdo** (texto salvo)
- Layout é responsabilidade do **template HTML**
- Se problema aparece só na renderização → corrigir template, não função de conteúdo

**Separação de responsabilidades:**
- **Conteúdo:** `normalizarTextoDiario()` → normaliza quebras de linha, remove whitespace inicial do texto salvo
- **Template:** Template literal → não deve ter indentação/newline antes do conteúdo
- **CSS:** `pre-wrap` → preserva formatação de múltiplas linhas (conteúdo), não whitespace estrutural

---

### Regra 3: Validações globais precisam de exceções explícitas

**❌ ERRADO:**
- Criar validação global sem exceções para novos modos
- Assumir que todos os modos precisam das mesmas validações

**✅ CORRETO:**
- Validações globais devem sempre ter **exceções explícitas** para novos modos
- Verificar modo específico antes de aplicar validação global
- Usar variável robusta que verifica múltiplas possibilidades

**Padrão correto:**
```javascript
// Criar variável robusta
const modoEspecial = !!config.especial || config.tipo === 'especial' || config.flagEspecial === true;

// Aplicar validação apenas se modo especial NÃO estiver ativo
if (validacaoGlobal && !modoEspecial && condicoesNormais) {
    bloquear();
}
```

---

### Regra 4: Normalização de strings antes de comparação

**❌ ERRADO:**
- Comparar `entrada.ultimaResposta === 'esqueci'` diretamente
- Assumir que campo sempre existe e é string

**✅ CORRETO:**
- Sempre normalizar para string antes de comparar: `String(entrada.ultimaResposta || '').toLowerCase() === 'esqueci'`
- Tratar casos `null`, `undefined`, `''` explicitamente
- Usar comparação case-insensitive quando aplicável

**Padrão correto:**
```javascript
// Robustez: normalizar antes de comparar
const valor = String(entrada.campo || '').toLowerCase();
if (valor === 'esqueci') {
    // ...
}
```

---

## 📋 CHECKLIST ANTI-REGRESSÃO (Obrigatório)

### Antes de qualquer commit/push:

```bash
grep -n "<<<<<<<\|>>>>>>>\|=======" docs/index.html docs/sw.js
```

**Resultado esperado:** ZERO linhas

---

### Antes de mexer em CSS para corrigir layout:

- [ ] Validar estrutura HTML gerada (template literal)
- [ ] Confirmar se problema é CSS ou template
- [ ] Se texto está correto na edição → problema é template
- [ ] Verificar se template tem indentação/newline antes do conteúdo
- [ ] Verificar se CSS tem `white-space: pre-wrap` (preserva whitespace)

---

### Antes de criar validação global:

- [ ] Listar todos os modos que precisam de exceção
- [ ] Criar variável robusta que verifica múltiplas possibilidades
- [ ] Adicionar exceção explícita na condição de validação
- [ ] Testar cada modo isoladamente

---

### Antes de comparar strings:

- [ ] Normalizar para string: `String(valor || '')`
- [ ] Usar comparação case-insensitive quando aplicável: `.toLowerCase()`
- [ ] Tratar casos `null`, `undefined`, `''` explicitamente

---

## 🔄 SITUAÇÃO ATUAL E PRÓXIMOS PASSOS

### ✅ Concluído e Validado

| Item | Status | Validação |
|------|--------|-----------|
| **P3 — Primeira linha centralizada** | ✅ RESOLVIDO | iPhone/Android validado |
| **Ajuste 2 — Treino Esquecidos** | ✅ RESOLVIDO | iPhone/Android validado |

---

### 🟡 Pendente (Aguardando)

#### Ajuste 1 — Tela pós-treino por nota

**Status:** 🟡 Pendente  
**Motivo:** `sairTreinoLivre()` limpa dados antes de mostrar detalhes  
**Próxima ação:** Aguardar revisão do `sairTreinoLivre()` (snapshot seguro)

**Problema identificado:**
- `sairTreinoLivre()` limpa `treinoLivreAvaliacao` (linha ~13286)
- Se usuário clicar "Voltar" antes de ver detalhes, dados são perdidos

**Solução proposta:**
- Guardar snapshot em `window.treinoLivreFimDados` antes de limpar
- Usar snapshot no lugar de `treinoLivreAvaliacao` na tela de detalhes

**Confiança atual:** 88% (precisa ≥95%)

---

#### Ajuste 3 — Transparência VRVS 3P (histórico)

**Status:** 🟡 Somente diagnóstico  
**Próxima ação:** Rodar diagnóstico de população de histórico

**Diagnóstico já criado:**
- `DIAGNOSTICO_AJUSTE_3_HISTORICO_VRVS3P_20260111.md`
- `historicoRespostas` existe mas não é populado
- Estrutura proposta: compacta (keys curtas) + CAP de 20 eventos

**Próximo passo:** Aguardar aprovação da estratégia antes de implementar FASE 1

---

### 🔜 Próximos Passos Imediatos

1. **Cursor → Ajuste 1:**
   - Confirmar snapshot seguro de `treinoLivreFimDados` antes do patch
   - Validar que snapshot não aumenta muito uso de memória
   - Subir confiança para ≥95% antes de implementar

2. **Cursor → Ajuste 3:**
   - Rodar diagnóstico completo de população de histórico
   - Validar impacto em localStorage (tamanho estimado)
   - Aguardar aprovação antes de implementar FASE 1

3. **Opus → UX Geral:**
   - Validar UX geral com base nas telas atuais (P3 + A2)
   - Revisar wireframes finais para Ajuste 1 e Ajuste 3
   - Preparar especificações de aceite visual

---

## 📝 CONCLUSÃO

**P3:** Problema era whitespace estrutural no template HTML, não CSS nem conteúdo. Solução: remover indentação/newline do template.

**Ajuste 2:** Problema era validação global sem exceção para modo "Esquecidos". Solução: adicionar exceção explícita na validação.

**Lições aprendidas:** Registradas neste documento para referência futura.

**Próximos passos:** Ajuste 1 (aguardar snapshot) e Ajuste 3 (aguardar aprovação).

---

**Documento criado para arquivamento e continuidade com Cursor e Opus.**

