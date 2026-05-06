# 📦 PACOTE OPUS — TL-1 UX (Contexto Técnico)

**Arquivo:** `docs/index.html`  
**Objetivo:** Material técnico para refinamentos UX do Treino Livre Customizado (TL-1)

---

## 📋 CONTEXTO DO TL-1

**TL-1 (Treino Livre Customizado)** é uma funcionalidade READ-ONLY implementada no Diário que permite:
- Configurar treino por área/tema/quantidade
- Montar fila de cards em memória (não altera localStorage)
- Visualizar preview dos primeiros 3 itens
- **NÃO** executa runner ainda (será no TL-2)

**READ-ONLY significa:**
- Não altera dados do Diário (`window.diario`)
- Não salva em `localStorage`
- Não modifica SRS (`proximaRevisao`, `estagio`, etc.)
- Não altera contadores 🧠/⏰/📆

**O que NÃO pode quebrar:**
- Sessão Programada (modo `programado`)
- Listagem do Diário
- Funcionalidades existentes do Diário

---

## 🎯 TRÊS PONTOS DE REFINAMENTO UX

### 1. PREVIEW DA CONFIRMAÇÃO (Truncamento de Texto)

**Localização:** `renderConfirmacaoTreinoLivre()` — aprox. linha **11604-11642**

**Trecho relevante:**
```javascript
function renderConfirmacaoTreinoLivre(fila) {
    const container = document.getElementById('diarioSessao');
    if (!container) return;
    
    const total = fila.length;
    const preview = fila.slice(0, 3).map((e, i) => {
        const topicoTexto = e.topico ? (e.topico.length > 50 ? e.topico.substring(0, 50) + '...' : e.topico) : '';
        return `${i + 1}. ${e.area} • ${e.tema}${topicoTexto ? ' • ' + topicoTexto : ''}`;
    }).join('\n');
    
    container.innerHTML = `
        <div class="treino-livre-confirmacao">
            <!-- ... -->
            ${preview ? `
            <div style="background: rgba(20,35,45,0.6); border-radius: 8px; padding: 12px; margin-bottom: 20px;">
                <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 8px;">Preview (primeiros 3):</div>
                <div style="font-size: 13px; color: rgba(255,255,255,0.9); white-space: pre-line; line-height: 1.6; word-wrap: break-word; overflow-wrap: break-word;">${preview}</div>
            </div>
            ` : ''}
            <!-- ... -->
        </div>
    `;
}
```

**O que controla truncamento/overflow:**
- **JavaScript:** `e.topico.substring(0, 50)` limita tópico a 50 caracteres
- **CSS inline:** `white-space: pre-line; word-wrap: break-word; overflow-wrap: break-word;` permite quebra de linha e palavras longas
- **Container:** `padding: 12px` define espaço interno

**Observação para ajuste:**
- Se texto ainda trunca visualmente, aumentar limite de caracteres OU ajustar CSS (`max-height`, `overflow-y: auto` para scroll)
- Container pai pode ter `overflow: hidden` em algum lugar (verificar CSS global)

---

### 2. TELA DE CONFIGURAÇÃO (Campo "Fonte" Removido)

**Localização:** `renderConfigTreinoLivre()` — aprox. linha **11506-11553**

**Trecho relevante (ATUAL — campo "Fonte" já removido):**
```javascript
function renderConfigTreinoLivre() {
    const container = document.getElementById('diarioSessao');
    if (!container) return;
    
    // Obter áreas e temas disponíveis
    const entradas = window.diario.entradas || [];
    const areas = [...new Set(entradas.map(e => e.area).filter(a => a))].sort();
    const areaSelecionada = window.treinoLivreConfig.area;
    const temas = areaSelecionada 
        ? [...new Set(entradas.filter(e => e.area === areaSelecionada).map(e => e.tema).filter(t => t))].sort()
        : [];
    
    const quantidade = window.treinoLivreConfig.quantidade || 10;
    
    container.innerHTML = `
        <div class="treino-livre-config">
            <div style="margin-bottom: 16px;">
                <label style="display: block; font-size: 14px; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Área:</label>
                <select id="treinoLivreArea" onchange="atualizarTemasTreinoLivre(this.value); window.treinoLivreConfig.area = this.value || null; renderConfigTreinoLivre();" style="width: 100%; padding: 12px; background: rgba(20,35,45,0.6); border: 1px solid rgba(0,206,209,0.3); border-radius: 8px; color: white; font-size: 14px;">
                    <option value="">Todas as áreas</option>
                    ${areas.map(a => `<option value="${a}" ${a === areaSelecionada ? 'selected' : ''}>${a}</option>`).join('')}
                </select>
            </div>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block; font-size: 14px; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Tema:</label>
                <select id="treinoLivreTema" onchange="window.treinoLivreConfig.tema = this.value || null;" ${!areaSelecionada ? 'disabled' : ''} style="width: 100%; padding: 12px; background: rgba(20,35,45,0.6); border: 1px solid rgba(0,206,209,0.3); border-radius: 8px; color: white; font-size: 14px; ${!areaSelecionada ? 'opacity: 0.5;' : ''}">
                    <option value="">Todos os temas</option>
                    ${temas.map(t => `<option value="${t}" ${t === window.treinoLivreConfig.tema ? 'selected' : ''}>${t}</option>`).join('')}
                </select>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 14px; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Quantidade:</label>
                <select id="treinoLivreQuantidade" onchange="window.treinoLivreConfig.quantidade = parseInt(this.value);" style="width: 100%; padding: 12px; background: rgba(20,35,45,0.6); border: 1px solid rgba(0,206,209,0.3); border-radius: 8px; color: white; font-size: 14px;">
                    <option value="5" ${quantidade === 5 ? 'selected' : ''}>5 itens</option>
                    <option value="10" ${quantidade === 10 ? 'selected' : ''}>10 itens</option>
                    <option value="20" ${quantidade === 20 ? 'selected' : ''}>20 itens</option>
                    <option value="30" ${quantidade === 30 ? 'selected' : ''}>30 itens</option>
                </select>
            </div>
            
            <button class="btn" onclick="montarTreinoLivre()" style="width: 100%; padding: 14px; font-size: 16px; font-weight: 600;">
                🎯 Montar Treino
            </button>
        </div>
    `;
}
```

**Observação sobre campo "Fonte":**
- Campo "Fonte" (VRVS 3P vs Todas) **já foi removido** na Fase 1 (commit `97b3c5a`)
- Treino Livre sempre usa `fonte: 'srs'` (hardcoded em `montarTreinoLivre()` linha ~11578)
- Se campo "Fonte" ainda aparecer em algum lugar, verificar se há cache ou código duplicado

**O que controla layout:**
- **Estrutura:** `margin-bottom: 16px` ou `20px` entre campos
- **Estilo:** Todos os campos usam mesmo padrão (background, border, padding)
- **Responsividade:** `width: 100%` nos selects

---

### 3. ABA TAREFAS (Barra de Busca Removida)

**Localização:** `renderTarefas()` — aprox. linha **4815** (função completa ~4815-4960)

**Trecho relevante (ATUAL — barra de busca já removida):**
```javascript
function renderTarefas() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const hojeStr = hoje.toISOString().split('T')[0];
    
    const container = document.getElementById('tarefasContainer');
    let html = '';
    
    // Barra de busca FOI REMOVIDA (estava aqui antes)
    // HTML começava com: <div style="margin-bottom: 16px;"><input id="taskSearchInput" .../></div>
    
    // Continua com renderização das tarefas...
    // ... resto da função ...
}
```

**Observação sobre barra de busca:**
- Barra de busca (`#taskSearchInput`) **já foi removida** na Fase 1 (commit `97b3c5a`)
- Função `filtrarTarefas()` também foi removida
- CSS relacionado (`#taskSearchInput`, `#taskSearchInput:focus`) foi removido
- Auto-focus no `showSection('tarefa')` foi removido
- Se barra ainda aparecer, verificar cache do Service Worker ou código duplicado

**O que controla layout da aba Tarefas:**
- Container: `#tarefasContainer`
- Função chamada em: `showSection('tarefa')` (linha ~6743)
- Estrutura: Cards de áreas/temas agrupados

---

## 🔍 REFERÊNCIAS TÉCNICAS

### Funções Relacionadas

**TL-1 (Treino Livre):**
- `renderConfigTreinoLivre()` — linha ~11506
- `renderConfirmacaoTreinoLivre(fila)` — linha ~11604
- `montarTreinoLivre()` — linha ~11567
- `atualizarTemasTreinoLivre(area)` — linha ~11555
- `getEntradasTreinoLivreDiario(filtros)` — linha ~10137

**Configuração Global:**
- `window.treinoLivreConfig` — objeto de configuração (linha ~11569)
- `window.treinoLivreFila` — fila montada em memória (READ-ONLY)

**Tarefas:**
- `renderTarefas()` — linha ~4815
- `showSection(sectionId)` — linha ~6743 (chama `renderTarefas()` quando `sectionId === 'tarefa'`)

---

## ⚠️ AVISOS IMPORTANTES

1. **Não mexer em:**
   - `montarTreinoLivre()` — lógica de montagem da fila
   - `getEntradasTreinoLivreDiario()` — filtragem de entradas
   - `window.treinoLivreConfig` — estrutura de configuração
   - Sessão Programada (`iniciarSessaoDiario('programado')`)

2. **Apenas ajustar:**
   - CSS inline nos trechos mostrados acima
   - Limite de caracteres no preview (se necessário)
   - Espaçamento/margens entre elementos

3. **Testar no iPhone PRIMEIRO:**
   - Validação visual obrigatória
   - Verificar truncamento real
   - Confirmar que campos removidos não aparecem

---

## 📝 CHECKLIST DE VALIDAÇÃO

Após ajustes UX:
- [ ] Preview não trunca texto visualmente no iPhone
- [ ] Campo "Fonte" não aparece em lugar nenhum
- [ ] Barra de busca não aparece na aba Tarefas
- [ ] Layout responsivo funciona no iPhone
- [ ] Funcionalidades existentes não quebraram

---

**Documento criado para Opus trabalhar com contexto técnico completo sem precisar investigar código.**

