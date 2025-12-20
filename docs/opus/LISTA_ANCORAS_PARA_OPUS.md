# 📍 LISTA DE ÂNCORAS - FUNÇÕES RELEVANTES FASE 1

**Para:** Opus  
**De:** Cursor/GPT VRVS  
**Data:** 19/12/2024

---

## Funções Encontradas no `docs/index.html`

### 1. Função que salva entrada do Diário
- **Nome:** `salvarEntradaDiario()`
- **Linha:** **10217**
- **Contexto:** Gerencia checkbox VRVS 3P, cria/edita entradas

### 2. Função que filtra entradas por área/tema
- **Nome:** `renderDiario()`
- **Linha:** **10464**
- **Funções relacionadas:**
  - `renderDiarioPorData()` - Linha **10553**
  - `renderDiarioPorTema()` - Linha **10588**

### 3. Função que renderiza diretrizes na aba Tarefas
- **Nome:** `renderTarefas()`
- **Linha:** **4788**
- **Funções auxiliares:**
  - `obterSugestaoTema()` - Linha **3931**
  - `renderCardTemaHTML()` - Linha **4723** (renderiza diretriz na linha 4757)

### 4. Função que gera mensagem do painel VRVS 3P
- **Nome:** `mensagemRetencao()`
- **Linha:** **9788**
- **Status:** ✅ Já corrigida (16/12/2024), mas pode precisar ajustes finos

---

## Função Auxiliar Relevante

- `formatarTextoDiario()` - Linha **9548** (já existe, usado para tópico/resposta do Diário)

---

**Todas as funções foram localizadas e confirmadas no código.**

**Próximo passo:** Opus pode usar essas âncoras para montar prompt cirúrgico para Cursor.

