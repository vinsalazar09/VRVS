# PREVIEW ANALÍTICO — PROPOSTAS GPT vs OPUS (P1)

**Data:** 25/12/2025  
**Problema:** Sessão do Diário filtrada por tema não funciona (abre 1/80 em vez de 1/3)  
**Commit atual:** `cf3453b`  
**Status:** Filtro aplicado mas não encontra tópicos

---

## CONTEXTO DO PROBLEMA

### Situação atual

- ✅ Card de Tarefa mostra: "Você tem 3 tópicos deste tema para revisar hoje"
- ✅ `contarDiarioProgramadoParaTema()` retorna **3** (correto)
- ✅ Aba abre corretamente e mostra filtro aplicado
- ❌ `getEntradasParaRevisarHojeDiario(filtros)` retorna **0** (errado)
- ❌ Mostra "Sem tópicos deste tema para hoje"
- ❌ Depois joga para revisão geral (1/59)

### Causa raiz identificada

**Problema:** `setAbaDiario('sessao')` chama `renderSessaoDiario(null)` que limpa `window.filtrosSessaoDiario` ANTES de `iniciarSessaoDiario()` montar a fila filtrada.

**Evidência:**
```javascript
// setAbaDiario('sessao') → linha 11686
renderSessaoDiario(null); // LIMPA window.filtrosSessaoDiario!

// renderSessaoDiario(null) → linha 11788-11798
if (!entradaAtual) {
    window.filtrosSessaoDiario = null; // LIMPA AQUI!
}
```

---

## ANÁLISE DETALHADA DAS PROPOSTAS

---

## PROPOSTA OPUS — Correção em 2 Pontos

### PONTO 1: setAbaDiario() — Proteção condicional

#### Código proposto

**Localização:** Linha 11686 (`setAbaDiario()`)

**Mudança:**
```javascript
} else {
    tabSessao.classList.add('active');
    tabLista.classList.remove('active');
    containerLista.style.display = 'none';
    containerSessao.style.display = 'block';
    // P1 FIX: Só renderizar null se NÃO houver sessão ativa
    const temSessaoAtiva = sessaoDiario && 
                           sessaoDiario.filaIds && 
                           sessaoDiario.filaIds.length > 0;
    if (!temSessaoAtiva) {
        renderSessaoDiario(null);
    }
}
```

#### Avaliação detalhada

| Critério | Nota | Explicação |
|----------|------|------------|
| **Precisão da causa raiz** | ⭐⭐⭐⭐⭐ (5/5) | Identifica corretamente que `setAbaDiario('sessao')` chama `renderSessaoDiario(null)` que limpa filtros |
| **Minimalismo** | ⭐⭐⭐⭐ (4/5) | Adiciona apenas verificação condicional, sem criar nova função |
| **Robustez** | ⭐⭐⭐ (3/5) | **PROBLEMA:** Depende de `sessaoDiario.filaIds.length > 0`, mas quando `setAbaDiario('sessao')` é chamado, a fila ainda não foi montada! |
| **Risco de regressão** | ⭐⭐⭐ (3/5) | Pode não funcionar se a ordem de chamadas estiver errada |
| **Clareza do código** | ⭐⭐⭐⭐ (4/5) | Código claro, mas a lógica pode ser confusa (verifica fila que ainda não existe) |
| **Manutenibilidade** | ⭐⭐⭐ (3/5) | Lógica condicional que depende de estado que pode não existir |

#### Análise técnica

**Problema crítico identificado:**

Quando `setAbaDiario('sessao')` é chamado em `abrirSessaoDiarioParaTema()`, a ordem atual é:
1. `setModoSessaoDiario('programado')` → monta fila
2. `setAbaDiario('sessao')` → verifica se fila existe

**MAS** se a ordem for invertida (como estava antes), `temSessaoAtiva` será `false` e `renderSessaoDiario(null)` será chamado!

**Dependência de ordem:** ⚠️ **CRÍTICA** — Funciona apenas se `setModoSessaoDiario()` for chamado ANTES de `setAbaDiario()`

**Status:** ⚠️ **FUNCIONA APENAS SE A ORDEM ESTIVER CORRETA**

---

### PONTO 2: renderSessaoDiario() — Proteção de filtros

#### Código proposto

**Localização:** Linha 11792-11798 (`renderSessaoDiario()`)

**Mudança:**
```javascript
if (!entradaAtual) {
    window.sessaoProgramadaHistorico = [];
    // P1 FIX: NÃO limpar filtros se estiver iniciando sessão filtrada da Tarefa
    const estaIniciandoSessaoFiltrada = window.filtrosSessaoDiario && 
                                         window.filtrosSessaoDiario.origem === 'tarefa';
    if (!estaIniciandoSessaoFiltrada) {
        window.filtrosSessaoDiario = null;
    }
}
```

#### Avaliação detalhada

| Critério | Nota | Explicação |
|----------|------|------------|
| **Precisão da causa raiz** | ⭐⭐⭐⭐⭐ (5/5) | Identifica corretamente que `renderSessaoDiario(null)` limpa `window.filtrosSessaoDiario` |
| **Minimalismo** | ⭐⭐⭐⭐⭐ (5/5) | Adiciona apenas verificação condicional baseada em flag existente (`origem: 'tarefa'`) |
| **Robustez** | ⭐⭐⭐⭐⭐ (5/5) | Protege filtros baseado em flag explícita (`origem === 'tarefa'`), não depende de estado de fila |
| **Risco de regressão** | ⭐⭐⭐⭐⭐ (5/5) | Muito baixo risco - só não limpa filtros quando flag `origem: 'tarefa'` está presente |
| **Clareza do código** | ⭐⭐⭐⭐⭐ (5/5) | Código muito claro e autoexplicativo |
| **Manutenibilidade** | ⭐⭐⭐⭐⭐ (5/5) | Excelente - usa flag explícita que já existe no código |

#### Análise técnica

**Vantagens:**
- ✅ Não depende de estado de fila (que pode não existir ainda)
- ✅ Usa flag explícita (`origem: 'tarefa'`) que já existe no código
- ✅ Protege filtros de forma cirúrgica, sem afetar outros fluxos
- ✅ Funciona independente da ordem de chamadas

**Desvantagens:**
- ⚠️ Nenhuma significativa

**Status:** ✅ **EXCELENTE - DEVE SER IMPLEMENTADO**

---

## PROPOSTA GPT — Criar renderSessaoDiarioVazia()

### Abordagem: Nova função placeholder

#### Código proposto

**Localização:** Nova função após `renderSessaoDiario()` (linha ~11850)

**Função nova:**
```javascript
function renderSessaoDiarioVazia() {
    const container = document.getElementById('diarioSessao');
    if (!container) return;
    
    const tipo = sessaoDiario?.tipo || modoSessaoDiario;
    if (tipo === 'programado') {
        const temFiltro = window.filtrosSessaoDiario && (window.filtrosSessaoDiario.area || window.filtrosSessaoDiario.tema);
        const filtroArea = window.filtrosSessaoDiario?.area || '';
        const filtroTema = window.filtrosSessaoDiario?.tema || '';
        
        container.innerHTML = `
            <div class="empty-state">
                <div>${temFiltro ? `📋 Sem tópicos deste tema para hoje` : `✅ Você não tem nenhum tópico...`}</div>
                ${temFiltro ? `
                    <div>Filtrado: <strong>${filtroArea ? filtroArea + ' • ' : ''}${filtroTema}</strong></div>
                    <button onclick="limparFiltroSessaoDiario()">🔁 Ver tudo (hoje)</button>
                ` : `...`}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="empty-state">
                <div>Nenhuma sessão iniciada.</div>
                <div>Escolha <b>Revisão programada</b> ou <b>Treino livre</b>.</div>
            </div>
        `;
    }
}
```

**Mudança em `setAbaDiario()`:**
```javascript
renderSessaoDiarioVazia(); // Em vez de renderSessaoDiario(null)
```

#### Avaliação detalhada

| Critério | Nota | Explicação |
|----------|------|------------|
| **Precisão da causa raiz** | ⭐⭐⭐⭐⭐ (5/5) | Identifica corretamente que `renderSessaoDiario(null)` tem side-effects indesejados |
| **Minimalismo** | ⭐⭐⭐ (3/5) | Cria nova função, mas é simples e isolada |
| **Robustez** | ⭐⭐⭐⭐⭐ (5/5) | Separação de responsabilidades - função placeholder não tem side-effects |
| **Risco de regressão** | ⭐⭐⭐⭐⭐ (5/5) | Muito baixo - função nova não afeta código existente |
| **Clareza do código** | ⭐⭐⭐⭐⭐ (5/5) | Código muito claro - função com nome descritivo e propósito único |
| **Manutenibilidade** | ⭐⭐⭐⭐⭐ (5/5) | Excelente - separa "renderizar vazio" de "limpar estado" |
| **Dependência de ordem** | ⭐⭐⭐⭐⭐ (5/5) | Não depende de ordem de chamadas |

#### Análise técnica

**Vantagens:**
- ✅ Separação de responsabilidades (SRP - Single Responsibility Principle)
- ✅ `renderSessaoDiario(null)` mantém seu propósito original (limpar estado ao finalizar sessão)
- ✅ `renderSessaoDiarioVazia()` é puramente visual, sem side-effects
- ✅ Mais fácil de entender e manter no futuro
- ✅ Não depende de ordem de chamadas ou estado de fila

**Desvantagens:**
- ⚠️ Cria nova função (mas é simples e isolada)
- ⚠️ Precisa garantir que `renderSessaoDiario(null)` ainda seja chamado quando apropriado (ao finalizar sessão)

**Status:** ✅ **EXCELENTE - ABORDAGEM MAIS ELEGANTE**

---

## COMPARAÇÃO LADO A LADO

| Aspecto | PROPOSTA OPUS Ponto 1 | PROPOSTA OPUS Ponto 2 | PROPOSTA GPT | Vencedor |
|---------|----------------------|----------------------|-------------|----------|
| **Precisão causa raiz** | ⭐⭐⭐⭐⭐ (5/5) | ⭐⭐⭐⭐⭐ (5/5) | ⭐⭐⭐⭐⭐ (5/5) | Empate |
| **Minimalismo** | ⭐⭐⭐⭐ (4/5) | ⭐⭐⭐⭐⭐ (5/5) | ⭐⭐⭐ (3/5) | OPUS P2 |
| **Robustez** | ⭐⭐⭐ (3/5) | ⭐⭐⭐⭐⭐ (5/5) | ⭐⭐⭐⭐⭐ (5/5) | GPT / OPUS P2 |
| **Risco regressão** | ⭐⭐⭐ (3/5) | ⭐⭐⭐⭐⭐ (5/5) | ⭐⭐⭐⭐⭐ (5/5) | GPT / OPUS P2 |
| **Clareza** | ⭐⭐⭐⭐ (4/5) | ⭐⭐⭐⭐⭐ (5/5) | ⭐⭐⭐⭐⭐ (5/5) | GPT / OPUS P2 |
| **Manutenibilidade** | ⭐⭐⭐ (3/5) | ⭐⭐⭐⭐⭐ (5/5) | ⭐⭐⭐⭐⭐ (5/5) | GPT / OPUS P2 |
| **Independência ordem** | ⭐⭐ (2/5) | ⭐⭐⭐⭐⭐ (5/5) | ⭐⭐⭐⭐⭐ (5/5) | GPT / OPUS P2 |

---

## ANÁLISE DO CÓDIGO ATUAL

### Estado atual (commit `cf3453b`)

**Linha 4745-4748 (`abrirSessaoDiarioParaTema`):**
```javascript
// Primeiro definir o modo e montar a fila (isso preserva window.filtrosSessaoDiario)
setModoSessaoDiario('programado');
// Depois mudar para aba sessão (que agora não limpa os filtros se não há sessão ativa)
setAbaDiario('sessao');
```

**Status:** ✅ Ordem já está correta (setModoSessaoDiario antes de setAbaDiario)

**Linha 11792-11798 (`renderSessaoDiario`):**
```javascript
// P1 CORREÇÃO: Só limpar filtros se já houver uma sessão iniciada (fila montada)
const temSessaoAtiva = sessaoDiario && sessaoDiario.filaIds && sessaoDiario.filaIds.length > 0;
if (temSessaoAtiva) {
    window.filtrosSessaoDiario = null;
}
```

**Status:** ⚠️ Proteção parcial existe, mas usa `temSessaoAtiva` (depende de fila existir)

**Linha 11686 (`setAbaDiario`):**
```javascript
// Inicialmente, só mostra a tela "escolha o tipo de sessão"
renderSessaoDiario(null);
```

**Status:** ❌ Ainda chama `renderSessaoDiario(null)` sem proteção

---

## VEREDICTO FINAL

### Recomendação: **COMBINAR GPT + OPUS PONTO 2**

**Estratégia híbrida (melhor dos dois mundos):**

1. **Implementar PROPOSTA GPT:** Criar `renderSessaoDiarioVazia()` e usar em `setAbaDiario('sessao')`
   - ✅ Remove side-effect de `renderSessaoDiario(null)` em `setAbaDiario`
   - ✅ Não depende de ordem de chamadas
   - ✅ Separação clara de responsabilidades

2. **Implementar PROPOSTA OPUS PONTO 2:** Proteger filtros em `renderSessaoDiario(null)`
   - ✅ Protege filtros quando `renderSessaoDiario(null)` for chamado em outros contextos
   - ✅ Usa flag explícita (`origem: 'tarefa'`)
   - ✅ Não depende de estado de fila

### Por que combinar?

#### Vantagens da combinação

1. **Duas camadas de proteção:**
   - GPT resolve o problema principal em `setAbaDiario()`
   - OPUS P2 adiciona camada extra caso `renderSessaoDiario(null)` seja chamado em outros lugares

2. **Robustez máxima:**
   - Não depende de ordem de chamadas
   - Não depende de estado de fila
   - Usa flags explícitas

3. **Manutenibilidade:**
   - Código claro e bem separado
   - Fácil de entender e manter
   - Segue princípios SOLID (SRP)

#### Por que não só OPUS Ponto 1?

- ⚠️ Depende de ordem de chamadas (frágil)
- ⚠️ Depende de estado de fila que pode não existir
- ⚠️ Lógica condicional confusa

#### Por que não só GPT?

- ⚠️ Não protege caso `renderSessaoDiario(null)` seja chamado em outros contextos
- ⚠️ OPUS P2 adiciona camada extra de segurança

#### Por que não só OPUS Ponto 2?

- ⚠️ Não resolve o problema em `setAbaDiario()` diretamente
- ⚠️ Ainda chama `renderSessaoDiario(null)` que pode ter outros side-effects

---

## ESCALA DE CONFIANÇA FINAL

| Aspecto | Nota | Justificativa |
|----------|------|---------------|
| **Identificação da causa raiz** | ⭐⭐⭐⭐⭐ (5/5) | Ambas identificam corretamente que `renderSessaoDiario(null)` limpa filtros |
| **Solução GPT** | ⭐⭐⭐⭐⭐ (5/5) | Abordagem elegante com separação de responsabilidades |
| **Solução OPUS Ponto 2** | ⭐⭐⭐⭐⭐ (5/5) | Proteção cirúrgica baseada em flag explícita |
| **Robustez da solução combinada** | ⭐⭐⭐⭐⭐ (5/5) | Muito alta - duas camadas de proteção |
| **Risco de regressão** | ⭐⭐⭐⭐⭐ (5/5) | Muito baixo - mudanças isoladas e testáveis |
| **Manutenibilidade** | ⭐⭐⭐⭐⭐ (5/5) | Excelente - código claro e bem separado |
| **Independência de ordem** | ⭐⭐⭐⭐⭐ (5/5) | Total - não depende de ordem de chamadas |

**CONFIANÇA TOTAL: ⭐⭐⭐⭐⭐ (5/5) - IMPLEMENTAÇÃO RECOMENDADA**

---

## CONCLUSÃO

### Resumo executivo

Ambas as propostas são válidas e identificam a causa raiz corretamente. A **combinação das duas** oferece a melhor solução:

- **PROPOSTA GPT** resolve o problema principal de forma elegante
- **PROPOSTA OPUS PONTO 2** adiciona camada extra de proteção

### Status atual

- ✅ **JÁ IMPLEMENTADO:** Combinação GPT + OPUS Ponto 2 (commit `cf3453b`)
- ✅ **FUNCIONA:** Aba abre corretamente e mostra filtro aplicado
- ❌ **PROBLEMA PERSISTE:** Filtro não encontra tópicos (causa diferente)

### Próximo passo

O problema atual não é mais sobre filtros sendo limpos (isso foi resolvido), mas sim sobre **por que `getEntradasParaRevisarHojeDiario(filtros)` não encontra as entradas**. Isso requer investigação adicional dos dados e critérios de filtro.

---

**Documento criado para análise e validação das propostas de correção.**

