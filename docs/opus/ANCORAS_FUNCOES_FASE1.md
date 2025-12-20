# 🔍 ÂNCORAS - FUNÇÕES RELEVANTES PARA FASE 1

**Data:** 19/12/2024  
**Objetivo:** Listar localizações exatas das funções que serão modificadas na Fase 1

---

## 1. Função que salva entrada do Diário

**Nome:** `salvarEntradaDiario()`  
**Localização:** Linha **10217**  
**Arquivo:** `docs/index.html`

**Contexto:**
- Função completa: linhas 10217-10369
- Gerencia checkbox VRVS 3P (`atencao`)
- Cria/edita entradas do Diário
- Inicializa ou desativa SRS conforme checkbox

**Trecho crítico (linhas 10282-10307):**
```javascript
// Gerenciar SRS conforme checkbox
if (atencao) {
    // Se marcado e não tem SRS, criar; se já tem, garantir que está ativo
    if (!entrada.srs) {
        entrada.srs = inicializarSrsVRVS3P(hoje);
    } else {
        entrada.srs.ativo = true;
        // ...
    }
} else {
    // Se desmarcado, desativar SRS (mas não deletar para manter histórico)
    if (entrada.srs) {
        entrada.srs.ativo = false;
    }
}
```

---

## 2. Função que filtra entradas por área/tema

**Nome:** `renderDiario()`  
**Localização:** Linha **10464**  
**Arquivo:** `docs/index.html`

**Funções relacionadas:**
- `renderDiarioPorData()` - Linha **10553**
- `renderDiarioPorTema()` - Linha **10588**

**Contexto:**
- Função principal: linhas 10464-10551
- Lógica de filtro: linhas 10481-10505
- Separação "Revisar Hoje": linhas 10507-10544

**Trecho crítico (linhas 10496-10505):**
```javascript
// Filtrar entradas
let entradasFiltradas = window.diario.entradas;

if (filtroArea) {
    entradasFiltradas = entradasFiltradas.filter(e => e.area === filtroArea);
}

if (filtroData) {
    entradasFiltradas = entradasFiltradas.filter(e => e.data === filtroData);
}
```

**Problema identificado:**
- Linha 10544: Remove entradas com `atencao` da lista principal
- Isso faz com que filtros por tema/área não mostrem todas as entradas

---

## 3. Função que renderiza diretrizes na aba Tarefas

**Nome:** `renderTarefas()`  
**Localização:** Linha **4788**  
**Arquivo:** `docs/index.html`

**Função auxiliar:**
- `obterSugestaoTema()` - Linha **3931**
- `renderCardTemaHTML()` - Linha **4723**

**Contexto:**
- Função principal: linhas 4788-4900
- Renderização de diretrizes: linha **4757** (dentro de `renderCardTemaHTML()`)
- Também renderizada em: linha 4366, 4987, 11642

**Trecho crítico (linha 4757):**
```javascript
<div class="task-suggestion-text">${sugestao}</div>
```

**Problema identificado:**
- Diretrizes vêm de `tema.sugestao` (campo do Feedback)
- Não há tratamento de quebras de linha (`\n` → `<br>`)
- CSS não preserva quebras (sem `white-space: pre-line`)

**Função auxiliar (linha 3931):**
```javascript
function obterSugestaoTema(tema) {
    if (!tema) return '';
    if (tema.sugestao && tema.sugestao !== '-' && tema.sugestao.trim() !== '') {
        return tema.sugestao.trim();
    }
    return extrairUltimaSugestao(tema.observacoes);
}
```

---

## 4. Função que gera mensagem do painel VRVS 3P

**Nome:** `mensagemRetencao()`  
**Localização:** Linha **9788**  
**Arquivo:** `docs/index.html`

**Contexto:**
- Função completa: linhas 9788-9845
- Retorna objeto com `emoji`, `texto`, `classe`
- Considera retenção global + pendências

**Chamadas:**
- Linha 6941: `calcularAnalises()`
- Linha 11873: `renderAnalyticsResumo()`
- Linha 11934: `renderAnalyticsResumo()` (caso vazio)

**Trecho crítico (linhas 9804-9825):**
```javascript
// Sem pendências: considerar retenção global
if (!temPendencias) {
    if (pct >= 80) {
        return {
            emoji: '🎯',
            texto: 'Excelente! Seus tópicos estão bem consolidados e você está em dia.',
            classe: 'alta'
        };
    } else if (pct >= 65) {
        return {
            emoji: '⚡',
            texto: 'Você está em dia hoje. Continue revisando para subir a retenção global.',
            classe: 'media'
        };
    } else {
        return {
            emoji: '📚',
            texto: 'Você está em dia hoje, mas a retenção global ainda está baixa. Reforce alguns tópicos-chave.',
            classe: 'baixa'
        };
    }
}
```

**Status:** ✅ Já corrigida (16/12/2024) - mas pode precisar de ajustes finos

---

## 📋 RESUMO DAS ÂNCORAS

| Função | Linha | Status | Observação |
|--------|-------|--------|------------|
| `salvarEntradaDiario()` | 10217 | ⚠️ Precisa ajuste | Checkbox VRVS 3P não respeitado |
| `renderDiario()` | 10464 | ⚠️ Precisa ajuste | Filtros escondem entradas |
| `renderDiarioPorTema()` | 10588 | ⚠️ Precisa ajuste | Herda problema do filtro |
| `renderTarefas()` | 4788 | ⚠️ Precisa ajuste | Diretrizes sem quebras |
| `renderCardTemaHTML()` | 4723 | ⚠️ Precisa ajuste | Renderiza diretrizes |
| `obterSugestaoTema()` | 3931 | ⚠️ Precisa ajuste | Retorna diretriz sem formatação |
| `mensagemRetencao()` | 9788 | ✅ Já corrigida | Pode precisar ajustes finos |

---

## 🔧 FUNÇÕES AUXILIARES RELEVANTES

- `formatarTextoDiario()` - Linha **9548** (já existe, usado para tópico/resposta)
- `inicializarSrsVRVS3P()` - Usada em `salvarEntradaDiario()` linha 10285
- `calcularEstatisticasVrvs3p()` - Usada para calcular stats do painel

---

**Próximo passo:** Opus deve usar essas âncoras para criar prompt cirúrgico para Cursor.

