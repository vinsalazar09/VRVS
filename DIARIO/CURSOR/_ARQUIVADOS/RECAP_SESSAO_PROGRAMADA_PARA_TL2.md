# 📋 RECAP SESSÃO PROGRAMADA — Para TL-2 UX SPEC

**Objetivo:** Documentar layout, cores, estilos e estrutura da Sessão Programada para replicar no TL-2 (READ-ONLY)

**Arquivo:** `docs/index.html`  
**Função principal:** `renderSessaoDiario(entradaAtual)` — linha **11423-11492**

---

## 🎨 DESIGN SYSTEM — CORES E VARIÁVEIS

### Cores Principais (CSS Variables)

```css
--turquesa-neon: #00FFE0;
--turquesa-light: #00CED1;    /* Principal para textos/links */
--turquesa-main: #0d9488;      /* Bordas, destaques */
--turquesa-dark: #0f766e;
--turquesa-darker: #134e4a;

--cobre-neon: #FFAA00;
--cobre-light: #FFB84D;        /* Tópico do card */
--cobre-main: #FF9F40;
--cobre-dark: #E5892E;
--cobre-darker: #B8701F;
```

### Backgrounds

```css
/* Background principal do app */
background: linear-gradient(135deg, #0a1a1f 0%, #1a2f35 100%);

/* Card da sessão */
background: rgba(0, 0, 0, 0.3);
border: 1px solid rgba(255, 127, 80, 0.2);  /* Cobre translúcido */
```

---

## 📐 ESTRUTURA HTML DO CARD

### Container Principal

```html
<div class="diario-sessao-card">
    <!-- Meta (área/tema + progresso) -->
    <!-- Tópico -->
    <!-- Resposta (escondida inicialmente) -->
    <!-- Botão Mostrar Resposta -->
    <!-- Botões de Qualidade (ESQUECI/LEMBREI/FÁCIL) -->
    <!-- Opções (Pular/Desativar) -->
</div>
```

### Trecho Exato do Código (linha 11459-11491)

```javascript
container.innerHTML = `
    <div class="diario-sessao-card">
        <div class="diario-sessao-meta">
            <span>${entradaAtual.area} • ${entradaAtual.tema}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>${indice} / ${total}</span>
                <button onclick="editarEntradaSessaoDiario()" style="background: transparent; border: none; color: rgba(0,206,209,0.7); cursor: pointer; font-size: 16px; padding: 4px 8px; display: flex; align-items: center;" title="Editar pergunta/resposta">✏️</button>
            </div>
        </div>
        <div class="diario-sessao-topico">
            ❓ ${formatarTextoDiario(entradaAtual.topico)}
        </div>
        <div id="diarioSessaoRespostaWrapper" class="diario-sessao-resposta escondida">
            <div class="diario-sessao-resposta-inner">
                ${entradaAtual.resposta ? formatarTextoDiario(entradaAtual.resposta) : '<em>(Sem resposta cadastrada)</em>'}
            </div>
        </div>
        <div class="diario-sessao-acoes">
            <button class="btn btn-small" onclick="mostrarRespostaSessaoDiario()">
                🔍 MOSTRAR RESPOSTA
            </button>
        </div>
        <div class="diario-sessao-botoes-qualidade">
            <button class="btn btn-esqueci btn-danger" onclick="responderSessaoDiario('esqueci')" title="Não lembrei ou errei. Vou revisar em breve.">❌ ESQUECI</button>
            <button class="btn btn-lembrei" onclick="responderSessaoDiario('lembrei')" title="Lembrei, mas precisei pensar. Progresso normal.">👍 LEMBREI</button>
            <button class="btn btn-facil btn-sucesso" onclick="responderSessaoDiario('facil')" title="Veio na hora! Posso esperar mais pra revisar.">😌 FÁCIL</button>
        </div>
        <div class="diario-sessao-opcoes">
            <button class="link-btn" onclick="pularSessaoDiario()">⏭️ Pular este tópico</button>
            <button class="link-btn" onclick="desativarSessaoDiarioAtual()">🚫 Não revisar mais este tópico</button>
        </div>
    </div>
`;
```

---

## 🎨 CSS COMPLETO — ESTILOS DO CARD

### Card Principal (linha 708-713)

```css
.diario-sessao-card {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid rgba(255, 127, 80, 0.2);
}
```

### Meta (Área/Tema + Progresso) — linha 715-721

```css
.diario-sessao-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: rgba(0, 206, 209, 0.7);  /* Turquesa translúcido */
    margin-bottom: 16px;
}
```

**Estrutura:**
- Esquerda: `Área • Tema`
- Direita: `X / Y` + botão editar (✏️)

### Tópico — linha 723-729

```css
.diario-sessao-topico {
    font-size: 16px;
    font-weight: 600;
    color: var(--cobre-light);  /* #FFB84D */
    margin-bottom: 20px;
    line-height: 1.5;
}
```

**Formato:** `❓ [texto do tópico]` (formatado por `formatarTextoDiario()`)

### Resposta (Escondida Inicialmente) — linha 731-747

```css
.diario-sessao-resposta {
    background: rgba(0, 206, 209, 0.1);  /* Turquesa muito translúcido */
    border-left: 3px solid var(--turquesa-main);  /* #0d9488 */
    padding: 14px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.diario-sessao-resposta.escondida {
    display: none;
}

.diario-sessao-resposta-inner {
    font-size: 13px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
}
```

**Comportamento:** Classe `escondida` removida quando usuário clica "MOSTRAR RESPOSTA"

### Botão Mostrar Resposta — linha 749-764

```css
.diario-sessao-acoes {
    margin-bottom: 16px;
}

.diario-sessao-acoes .btn {
    background: rgba(0, 206, 209, 0.2);
    border: 1px solid rgba(0, 206, 209, 0.4);
    color: var(--turquesa-light);  /* #00CED1 */
    font-weight: 600;
}

.diario-sessao-acoes .btn:hover,
.diario-sessao-acoes .btn:active {
    background: rgba(0, 206, 209, 0.3);
}
```

### Botões de Qualidade (ESQUECI/LEMBREI/FÁCIL) — linha 767-867

**Container:**
```css
.diario-sessao-botoes-qualidade {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
    margin: 20px 0;
}
```

**Botões Individuais (Base):**
```css
.diario-sessao-botoes-qualidade button {
    flex: 1;
    max-width: 110px;
    min-width: 90px;
    padding: 12px 8px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: rgba(5, 25, 30, 0.96);
    border-width: 1px;
    border-style: solid;
    color: #ffffff;
}
```

**ESQUECI (Vermelho):**
```css
.diario-sessao-botoes-qualidade .btn-esqueci,
.diario-sessao-botoes-qualidade .btn-danger {
    border-color: rgba(220, 53, 69, 0.85);
    box-shadow: 0 0 12px rgba(220, 53, 69, 0.35);
}

.diario-sessao-botoes-qualidade .btn-esqueci:active,
.diario-sessao-botoes-qualidade .btn-danger:active {
    transform: scale(0.97);
    box-shadow: 0 0 16px rgba(220, 53, 69, 0.5);
}
```

**LEMBREI (Âmbar):**
```css
.diario-sessao-botoes-qualidade .btn-lembrei,
.diario-sessao-botoes-qualidade .btn:not(.btn-danger):not(.btn-sucesso):not(.btn-esqueci):not(.btn-facil) {
    border-color: rgba(245, 158, 11, 0.85);
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
}

.diario-sessao-botoes-qualidade .btn-lembrei:active,
.diario-sessao-botoes-qualidade .btn:not(.btn-danger):not(.btn-sucesso):not(.btn-esqueci):not(.btn-facil):active {
    transform: scale(0.97);
    box-shadow: 0 0 16px rgba(245, 158, 11, 0.5);
}
```

**FÁCIL (Verde):**
```css
.diario-sessao-botoes-qualidade .btn-facil,
.diario-sessao-botoes-qualidade .btn-sucesso {
    border-color: rgba(34, 197, 94, 0.85);
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.35);
}

.diario-sessao-botoes-qualidade .btn-facil:active,
.diario-sessao-botoes-qualidade .btn-sucesso:active {
    transform: scale(0.97);
    box-shadow: 0 0 16px rgba(34, 197, 94, 0.5);
}
```

### Opções Secundárias (Pular/Desativar) — linha 795-815

```css
.diario-sessao-opcoes {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 16px;
    flex-wrap: wrap;
}

.link-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s ease;
}

.link-btn:hover {
    color: var(--turquesa-light);
}
```

---

## 🔄 NAVEGAÇÃO E FLUXO

### Funções Relacionadas

**Renderizar Card:**
- `renderSessaoDiario(entradaAtual)` — linha 11423

**Mostrar Resposta:**
- `mostrarRespostaSessaoDiario()` — linha 11645
- Remove classe `escondida` de `#diarioSessaoRespostaWrapper`

**Responder (Atualiza SRS):**
- `responderSessaoDiario(qualidade)` — linha 11653
- Parâmetros: `'esqueci'`, `'lembrei'`, `'facil'`
- Atualiza SRS se `sessaoDiario.tipo === 'programado'`
- Avança para próximo card

**Pular (Sem Atualizar SRS):**
- `pularSessaoDiario()` — linha 11681
- Apenas avança sem atualizar SRS

**Desativar:**
- `desativarSessaoDiarioAtual()` — linha 11677
- Define `srs.ativo = false`
- Remove da fila atual

### Progresso

**Cálculo:**
```javascript
const indice = sessaoDiario.indiceAtual + 1;  // 1-indexed
const total = sessaoDiario.filaIds.length;
```

**Exibição:** `${indice} / ${total}` no meta do card

---

## 📱 ESPAÇAMENTOS E DIMENSÕES

### Padding/Margin

- **Card:** `padding: 20px`
- **Meta:** `margin-bottom: 16px`
- **Tópico:** `margin-bottom: 20px`
- **Resposta:** `padding: 14px`, `margin-bottom: 20px`
- **Ações:** `margin-bottom: 16px`
- **Botões Qualidade:** `margin: 20px 0`
- **Opções:** `margin-top: 16px`

### Botões

- **Mostrar Resposta:** `padding: 10px 16px` (`.btn-small`)
- **Qualidade:** `padding: 12px 8px`, `min-width: 90px`, `max-width: 110px`
- **Gap entre botões:** `12px`

### Border Radius

- **Card:** `12px`
- **Resposta:** `8px`
- **Botões:** `8px`

---

## 🎯 ADAPTAÇÃO PARA TL-2 (READ-ONLY)

### O QUE MANTER (Idêntico)

✅ **Estrutura HTML do card** (meta, tópico, resposta)  
✅ **CSS completo** (cores, espaçamentos, estilos)  
✅ **Layout visual** (mesma aparência)  
✅ **Formatação de texto** (`formatarTextoDiario()`)  
✅ **Progresso** (`X / Y`)

### O QUE REMOVER

❌ **Botões de Qualidade** (ESQUECI/LEMBREI/FÁCIL)  
❌ **Botão "Pular este tópico"**  
❌ **Botão "Não revisar mais este tópico"**  
❌ **Botão Editar** (✏️) — ou manter se necessário

### O QUE SUBSTITUIR

🔄 **Botão "MOSTRAR RESPOSTA"** → **Resposta sempre visível** OU **Botão "Mostrar Resposta" sem ação de SRS**  
🔄 **Navegação** → **Botões "← Anterior" e "Próximo →"** (sem qualidade)  
🔄 **Header** → **Adicionar header com "TREINO LIVRE" + "(somente leitura)" + botão Sair**

### O QUE ADICIONAR

➕ **Header do Runner:**
- Botão Sair (←) à esquerda
- Título "TREINO LIVRE" centralizado
- Subtítulo "(somente leitura)" abaixo do título
- Progresso `X / Y` à direita

➕ **Navegação:**
- Botão "← Anterior" (desabilitado no card 1)
- Botão "Próximo →" (muda para "Encerrar" no último card)

➕ **Tela de Fim:**
- Mensagem "✓ Treino concluído"
- Contador "X itens revisados"
- Disclaimer "(nenhuma alteração salva)"
- Botão "Voltar ao Diário"

---

## 🎨 DIFERENCIAÇÃO VISUAL READ-ONLY

### Proposta 1: Badge no Header

```html
<div style="text-align: center;">
    <div style="font-size: 18px; font-weight: 600; color: var(--turquesa-light);">
        TREINO LIVRE
    </div>
    <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px;">
        (somente leitura)
    </div>
</div>
```

### Proposta 2: Cor Neutra no Header

```css
/* Header TL-2 */
.treino-livre-header {
    color: rgba(255, 255, 255, 0.6);  /* Neutro em vez de turquesa */
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Proposta 3: Borda Diferente no Card

```css
.treino-livre-card {
    border: 1px solid rgba(255, 255, 255, 0.1);  /* Neutro em vez de cobre */
}
```

**Recomendação:** Usar **Proposta 1** (badge) + manter cores normais para não confundir visualmente.

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO TL-2

### Estrutura

- [ ] Header do runner (sair + título + progresso)
- [ ] Card idêntico à Sessão Programada (meta + tópico + resposta)
- [ ] Resposta sempre visível OU botão "Mostrar Resposta" sem ação SRS
- [ ] Navegação (anterior/próximo) em vez de botões qualidade
- [ ] Tela de fim com mensagem e botão voltar

### Estilos

- [ ] CSS do card reutilizado (`.diario-sessao-card`)
- [ ] Cores mantidas (turquesa/cobre)
- [ ] Badge "(somente leitura)" visível
- [ ] Botões navegação com touch target mínimo 44x44px

### Funcionalidade

- [ ] Resposta sempre visível OU toggle sem salvar
- [ ] Navegação anterior/próximo funciona
- [ ] Último card mostra "Encerrar" em vez de "Próximo"
- [ ] Tela de fim aparece ao encerrar
- [ ] Botão "Voltar ao Diário" funciona

### READ-ONLY

- [ ] Nenhum botão de qualidade (ESQUECI/LEMBREI/FÁCIL)
- [ ] Nenhuma chamada a `responderSessaoDiario()`
- [ ] Nenhuma atualização de SRS
- [ ] Nenhuma escrita em localStorage
- [ ] Nenhuma alteração em `window.diario`

---

## 🔗 REFERÊNCIAS TÉCNICAS

**Funções:**
- `renderSessaoDiario(entradaAtual)` — linha 11423
- `formatarTextoDiario(texto)` — linha 9591
- `mostrarRespostaSessaoDiario()` — linha 11645
- `responderSessaoDiario(qualidade)` — linha 11653
- `pularSessaoDiario()` — linha 11681

**Variáveis Globais:**
- `sessaoDiario.filaIds` — array de IDs das entradas
- `sessaoDiario.indiceAtual` — índice atual (0-indexed)
- `sessaoDiario.tipo` — `'programado'` ou `'livre'`
- `window.treinoLivreFila` — fila montada no TL-1 (READ-ONLY)

**Container:**
- `#diarioSessao` — container onde o card é renderizado (linha 3404)

---

**Documento criado para Opus replicar layout da Sessão Programada no TL-2 com diferenciação READ-ONLY.**

