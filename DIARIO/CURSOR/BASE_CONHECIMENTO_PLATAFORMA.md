# 🗄️ BASE DE CONHECIMENTO — PLATAFORMA VRVS

**Última atualização:** 21 de Dezembro de 2024  
**Objetivo:** Base estruturada de conhecimento sobre construção e arquitetura da plataforma

---

## 📐 ARQUITETURA GERAL

### Tipo de Aplicação
- **PWA 100% client-side** (Progressive Web App)
- **Sem backend** — tudo roda no navegador
- **Armazenamento:** `localStorage` do navegador
- **Plataforma principal:** iPhone Safari (PWA instalado)

### Estrutura de Arquivos
```
/docs/
  ├── index.html          # Arquivo monolítico principal (~13.750 linhas)
  ├── sw.js               # Service Worker (cache)
  └── manifest.json       # Manifest PWA

/DIARIO/CURSOR/
  └── [documentos de desenvolvimento]
```

### Tecnologias
- **HTML/CSS/JavaScript** puro (ES5/ES6)
- **Service Worker** para cache offline
- **localStorage API** para persistência
- **Sem frameworks** (Vanilla JS)

---

## 🎨 DESIGN SYSTEM

### Cores Principais (CSS Variables)

```css
/* Turquesa (cor primária) */
--turquesa-neon: #00FFE0;
--turquesa-light: #00CED1;    /* Principal para textos/links */
--turquesa-main: #0d9488;      /* Bordas, destaques */
--turquesa-dark: #0f766e;
--turquesa-darker: #134e4a;

/* Cobre/Âmbar (cor secundária) */
--cobre-neon: #FFAA00;
--cobre-light: #FFB84D;        /* Tópicos, destaques */
--cobre-main: #FF9F40;
--cobre-dark: #E5892E;
--cobre-darker: #B8701F;
```

### Backgrounds

```css
/* Background principal do app */
background: linear-gradient(135deg, #0a1a1f 0%, #1a2f35 100%);

/* Cards/Sections */
background: rgba(0, 0, 0, 0.3);
border: 1px solid rgba(255, 127, 80, 0.2);  /* Cobre translúcido */
```

### Espaçamentos Padrão

- **Padding de cards:** `20px`
- **Margin entre elementos:** `16px` ou `20px`
- **Border radius:** `8px` (botões) ou `12px` (cards)
- **Gap entre botões:** `12px`
- **Touch target mínimo:** `44x44px` (iOS guideline)

---

## 🗂️ ESTRUTURA DE DADOS

### window.diario (Diário de Aprendizados)

```javascript
window.diario = {
    entradas: [
        {
            id: "uuid",
            topico: "Pergunta/tópico",
            resposta: "Resposta/anotação",
            area: "Área (ex: Trauma MMSS)",
            tema: "Tema (ex: Fratura de Úmero)",
            data: "YYYY-MM-DD",
            criadoEm: "YYYY-MM-DD",
            srs: {
                ativo: true/false,
                estagio: 0-10,
                intervalo: 1, 2, 4, 7, 14, 30, 60, 90, 180, 365,
                proximaRevisao: "YYYY-MM-DD",
                ultimaRevisaoData: "YYYY-MM-DD",
                repeticoes: 0,
                facilidade: 2.5,
                historicoRespostas: []
            },
            atencao: true/false,  // Legado (pode ser removido)
            ultimaAtualizacao: "YYYY-MM-DD"
        }
    ],
    schemaVersion: "1.0"
}
```

**Armazenamento:** `localStorage.getItem('vrvs_diario')`

---

## 🔧 FUNÇÕES CORE

### Diário — Renderização

**`renderDiario()`** — linha ~11003
- Renderiza lista do Diário (Por Tema ou Por Data)
- Usa filtros: área, data, vista (tema/data)

**`renderSessaoDiario(entradaAtual)`** — linha ~11423
- Renderiza card da sessão (Programada ou Livre)
- Usa `sessaoDiario.filaIds` e `sessaoDiario.indiceAtual`

**`setModoSessaoDiario(modo)`** — linha ~11351
- Muda entre 'programado' e 'livre'
- Chama `iniciarSessaoDiario(modo)`

**`iniciarSessaoDiario(tipo)`** — linha ~11371
- Inicializa sessão baseado no tipo
- Popula `sessaoDiario.filaIds`
- Chama `renderSessaoDiario()`

### Diário — SRS (VRVS 3P)

**`isSrsActive(entrada)`** — helper
- Verifica se VRVS 3P está ativo (`srs.ativo === true`)

**`isDueToday(entrada, hoje)`** — helper
- Verifica se entrada está devida hoje (`proximaRevisao <= hoje`)

**`getEntradasParaRevisarHojeDiario(filtros)`** — linha ~10109
- Retorna entradas devidas hoje (filtradas)

**`getEntradasTreinoLivreDiario(filtros)`** — linha ~10137
- Retorna entradas para treino livre (filtradas)

**`responderSessaoDiario(qualidade)`** — linha ~11653
- Atualiza SRS baseado na qualidade ('esqueci', 'lembrei', 'facil')
- Apenas se `sessaoDiario.tipo === 'programado'`
- Salva em localStorage

### Diário — Treino Livre (TL-1/TL-2)

**`renderConfigTreinoLivre()`** — linha ~11506
- Renderiza painel de configuração (área, tema, quantidade)

**`montarTreinoLivre()`** — linha ~11698
- Monta fila baseado na configuração
- Armazena em `window.treinoLivreFila` (READ-ONLY)

**`renderConfirmacaoTreinoLivre(fila)`** — linha ~11604
- Renderiza tela de confirmação com preview

**`iniciarTreinoLivre()`** — linha ~11688 (TL-2)
- Inicia runner do Treino Livre
- Cria `window.treinoLivreEstado = { ativo: true, indiceAtual: 0 }`

**`renderTreinoLivreRunner()`** — linha ~11704 (TL-2)
- Renderiza runner completo (header + card + navegação)

**`treinoLivreProximo()` / `treinoLivreAnterior()`** — linha ~11779 (TL-2)
- Navegação no runner

**`sairTreinoLivre()` / `encerrarTreinoLivre()`** — linha ~11790 (TL-2)
- Sair/encerrar runner (limpa estado, volta para confirmação)

### Helpers

**`formatarTextoDiario(texto)`** — linha ~9591
- Formata texto (escape HTML, quebra de linha)
- Usado em tópicos e respostas

**`salvarDiario()`**
- Persiste `window.diario` em localStorage

---

## 🎯 CONTAINERS E IDs DOM

### Diário

- **`#diarioListaWrapper`** — Container da aba Lista
- **`#diarioSessaoWrapper`** — Container da aba Sessão
- **`#diarioSessao`** — Container interno da sessão (onde cards são renderizados)
- **`#diarioTabLista`** / **`#diarioTabSessao`** — Tabs de navegação

### Tarefas

- **`#tarefasContainer`** — Container principal das tarefas

---

## 🔄 FLUXOS PRINCIPAIS

### Fluxo: Sessão Programada

```
1. Usuário clica "Revisão programada"
   ↓
2. setModoSessaoDiario('programado')
   ↓
3. iniciarSessaoDiario('programado')
   ↓
4. getEntradasParaRevisarHojeDiario(filtros)
   ↓
5. Popula sessaoDiario.filaIds
   ↓
6. renderSessaoDiario(entradaAtual)
   ↓
7. Usuário responde (ESQUECI/LEMBREI/FÁCIL)
   ↓
8. responderSessaoDiario(qualidade)
   ↓
9. Atualiza SRS + salva localStorage
   ↓
10. Avança para próximo card
```

### Fluxo: Treino Livre (TL-1 + TL-2)

```
1. Usuário clica "Treino livre"
   ↓
2. setModoSessaoDiario('livre')
   ↓
3. iniciarSessaoDiario('livre')
   ↓
4. Se window.treinoLivreEstado?.ativo → renderTreinoLivreRunner()
   ↓
5. Se window.treinoLivreFila existe → renderConfirmacaoTreinoLivre()
   ↓
6. Se não → renderConfigTreinoLivre()
   ↓
7. Usuário configura (área, tema, quantidade)
   ↓
8. Clica "Montar Treino"
   ↓
9. montarTreinoLivre() → window.treinoLivreFila = [...]
   ↓
10. renderConfirmacaoTreinoLivre()
   ↓
11. Usuário clica "Iniciar Treino"
   ↓
12. iniciarTreinoLivre() → window.treinoLivreEstado = { ativo: true, indiceAtual: 0 }
   ↓
13. renderTreinoLivreRunner() → Header + Card + Navegação
   ↓
14. Usuário navega (Anterior/Próximo)
   ↓
15. Último card: "Encerrar" → renderTreinoLivreFim()
   ↓
16. "Voltar ao Diário" → sairTreinoLivre() → setModoSessaoDiario('livre')
```

---

## 📊 ESTADOS GLOBAIS

### window.diario
- **Tipo:** Object
- **Conteúdo:** Todas as entradas do Diário
- **Persistência:** localStorage
- **Atualização:** Via `salvarDiario()`

### sessaoDiario
- **Tipo:** Object
- **Conteúdo:** Estado da sessão atual
- **Propriedades:**
  - `tipo`: 'programado' ou 'livre'
  - `filaIds`: Array de IDs das entradas na fila
  - `indiceAtual`: Índice atual (0-indexed)
- **Persistência:** Memória apenas

### window.treinoLivreConfig
- **Tipo:** Object
- **Conteúdo:** Configuração do Treino Livre
- **Propriedades:**
  - `area`: null ou string
  - `tema`: null ou string
  - `quantidade`: 5, 10, 20 ou 30
- **Persistência:** Memória apenas

### window.treinoLivreFila
- **Tipo:** Array
- **Conteúdo:** Fila montada no TL-1 (entradas completas)
- **Persistência:** Memória apenas (READ-ONLY)
- **Fonte única:** Não duplicar

### window.treinoLivreEstado
- **Tipo:** Object (TL-2)
- **Conteúdo:** Estado do runner
- **Propriedades:**
  - `ativo`: true/false
  - `indiceAtual`: 0-indexed
- **Persistência:** Memória apenas
- **Limpeza:** `window.treinoLivreEstado = null` ao sair

---

## 🎨 CSS CLASSES PRINCIPAIS

### Diário — Sessão

- **`.diario-sessao-card`** — Card principal
- **`.diario-sessao-meta`** — Meta (área/tema + progresso)
- **`.diario-sessao-topico`** — Tópico (pergunta)
- **`.diario-sessao-resposta`** — Resposta (escondida/visível)
- **`.diario-sessao-resposta.escondida`** — Resposta escondida
- **`.diario-sessao-acoes`** — Botão "Mostrar Resposta"
- **`.diario-sessao-botoes-qualidade`** — Botões ESQUECI/LEMBREI/FÁCIL
- **`.diario-sessao-opcoes`** — Links secundários (Pular/Desativar)

### Treino Livre (TL-2)

- **`.treino-livre-runner-wrapper`** — Container do runner
- **`.treino-livre-header`** — Header (sair + título + progresso)
- **`.treino-livre-sair`** — Botão sair
- **`.treino-livre-progresso`** — Progresso (X / Y)
- **`.treino-livre-navegacao`** — Botões anterior/próximo
- **`.treino-livre-fim`** — Tela final

---

## 🔒 REGRAS DE SEGURANÇA

### READ-ONLY (Treino Livre)

**O que NÃO fazer:**
- ❌ Não escrever em localStorage
- ❌ Não alterar SRS (`proximaRevisao`, `estagio`, etc.)
- ❌ Não chamar `responderSessaoDiario()`
- ❌ Não alterar `window.diario`
- ❌ Não chamar `salvarDiario()`

**O que fazer:**
- ✅ Apenas ler dados
- ✅ Renderizar cards
- ✅ Navegar entre cards
- ✅ Estado apenas em memória

### Integração Segura

**Princípios:**
- Reutilizar código existente
- Não refatorar fluxo existente
- Integração mínima e não-invasiva
- Estado mínimo e explícito

---

## 📝 PADRÕES DE CÓDIGO

### Funções Isoladas
- Uma responsabilidade por função
- Nomes descritivos
- Validação de entrada
- Tratamento de erros

### CSS Classes
- Preferir classes sobre inline styles
- Nomes descritivos e consistentes
- Reutilizar classes existentes quando possível

### Estado Global
- Mínimo necessário
- Nomes explícitos (`window.treinoLivreEstado`)
- Limpar explicitamente ao sair
- Não duplicar dados

---

## 🚀 DEPLOY E CACHE

### Service Worker
- **Arquivo:** `docs/sw.js`
- **CACHE_NAME:** Atualizar quando código muda
- **Registro:** Linha ~8947 em `index.html`

### Cache Busting
- Atualizar `CACHE_NAME` em `sw.js`
- Usar `recovery_sw.html` se necessário
- Limpar cache manualmente no iPhone se problemas

---

## 📚 REFERÊNCIAS ÚTEIS

### Documentos de Desenvolvimento
- `METODOLOGIA_IMPLEMENTACAO_SEGURA.md` — Processo que funcionou
- `RECAP_SESSAO_PROGRAMADA_PARA_TL2.md` — Layout e CSS da Sessão Programada
- `PACOTE_OPUS_TL1_UX.md` — Contexto técnico TL-1
- `MATERIAL_OPUS_SEGURANCA_E_AUTONOMIA.md` — Protocolos de segurança

### Baseline Estável
- **Commit:** `f438a82` (2024-12-16)
- **Status:** ✅ Funcionando após rollback
- **Uso:** Referência para rollback se necessário

---

**Documento criado para servir como base de conhecimento estruturada sobre a plataforma VRVS.**

