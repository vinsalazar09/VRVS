# 📋 PLANO COMPLETO DE CORREÇÃO - VRVS v5.3
## Análise Detalhada e Proposta de Implementação

**Data:** 12 de Dezembro de 2025  
**Versão:** v5.3  
**Status:** Aguardando Validação Externa (Opus)

---

## 📊 SUMÁRIO EXECUTIVO

Este documento apresenta uma análise completa dos problemas identificados na plataforma VRVS após a refatoração da aba "Análises" e outras melhorias de UX. Os problemas foram categorizados em **CRÍTICOS** (funcionalidade quebrada) e **UX** (experiência do usuário), com soluções detalhadas e plano de implementação priorizado.

### Problemas Identificados
- **4 Problemas Críticos** (funcionalidade completamente quebrada)
- **6 Problemas de UX** (experiência do usuário comprometida)

### Impacto Geral
- **Analytics completamente inoperante** (gráficos, histórico, análises detalhadas)
- **Cálculo de performance incorreto** (mostrando 1% aleatório)
- **UX comprometida no iOS** (datalist, cursor, textarea)
- **Inconsistência visual** entre Caderno e Diário

---

## 🔴 PARTE 1: PROBLEMAS CRÍTICOS (FUNCIONALIDADE QUEBRADA)

### Problema #1: Gráficos Não Aparecem

#### Descrição
Ao acessar a aba "Análises" → "Gráficos", nenhum gráfico é renderizado. A tela fica vazia.

#### Causa Raiz
```javascript
// Código atual em renderAnalyticsGraficos()
container.innerHTML = `
    <canvas id="chartBarrasAnalytics" width="400" height="200"></canvas>
    <canvas id="chartLinhaAnalytics" width="400" height="200"></canvas>
    <canvas id="chartRadarAnalytics" width="400" height="300"></canvas>
`;

// Mas renderCharts() busca:
const ctx = document.getElementById('chartBarras');  // ← ID diferente!
```

**Problema:** IDs dos canvas criados não correspondem aos IDs que as funções originais (`renderChartBarras()`, `renderChartLinha()`, `renderChartRadar()`) esperam.

#### Impacto
- **Alto:** Funcionalidade principal de Analytics completamente quebrada
- Usuário não consegue visualizar gráficos de performance
- Dados existem mas não são apresentados

#### Solução Proposta
**Estratégia:** Usar os mesmos IDs que as funções originais esperam.

```javascript
function renderAnalyticsGraficos(container) {
    container.innerHTML = `
        <div style="margin-bottom: 30px;">
            <h4 style="color: var(--turquesa-light); margin-bottom: 15px;">📊 Performance por Área</h4>
            <canvas id="chartBarras" width="400" height="200"></canvas>
        </div>
        <div style="margin-bottom: 30px;">
            <h4 style="color: var(--turquesa-light); margin-bottom: 15px;">📈 Evolução Temporal</h4>
            <canvas id="chartLinha" width="400" height="200"></canvas>
        </div>
        <div style="margin-bottom: 30px;">
            <h4 style="color: var(--turquesa-light); margin-bottom: 15px;">🎯 Radar de Competências</h4>
            <canvas id="chartRadar" width="400" height="300"></canvas>
        </div>
    `;
    
    // Destruir gráficos antigos se existirem
    if (chartBarrasInst) { chartBarrasInst.destroy(); chartBarrasInst = null; }
    if (chartLinhaInst) { chartLinhaInst.destroy(); chartLinhaInst = null; }
    if (chartRadarInst) { chartRadarInst.destroy(); chartRadarInst = null; }
    
    // Re-renderizar gráficos após inserir no DOM
    setTimeout(() => {
        renderChartBarras();
        renderChartLinha();
        renderChartRadar();
    }, 100);
}
```

**Mudanças:**
- IDs alterados de `chartBarrasAnalytics` → `chartBarras`
- IDs alterados de `chartLinhaAnalytics` → `chartLinha`
- IDs alterados de `chartRadarAnalytics` → `chartRadar`
- Chamada explícita das funções de renderização individuais
- Limpeza de instâncias antigas antes de criar novas

#### Risco de Implementação
- **Baixo:** Mudança simples de IDs e chamadas de função
- **Teste necessário:** Verificar se gráficos renderizam corretamente em todas as visualizações

---

### Problema #2: Histórico Não Aparece

#### Descrição
Ao acessar a aba "Análises" → "Histórico", nenhuma tabela é exibida. A seção fica vazia.

#### Causa Raiz
```javascript
// Código atual em renderAnalyticsHistorico()
container.innerHTML = `
    <div id="historicoTabela" style="overflow-x: auto;"></div>
`;

// Mas renderHistorico() busca:
const tbody = document.getElementById('historicoTableBody');  // ← Elemento não existe!
```

**Problema:** A função `renderHistorico()` espera encontrar um elemento `<tbody id="historicoTableBody">` dentro de uma estrutura de tabela completa, mas apenas um `<div>` vazio é criado.

#### Impacto
- **Alto:** Histórico de sessões completamente inacessível
- Usuário não consegue revisar sessões anteriores
- Dados existem mas não são apresentados

#### Solução Proposta
**Estratégia:** Criar a estrutura completa da tabela que a função original espera.

```javascript
function renderAnalyticsHistorico(container) {
    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <span style="color: var(--turquesa-light); font-size: 14px;">📜 Histórico de Sessões</span>
        </div>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 2px solid rgba(0,206,209,0.3);">
                        <th style="padding: 12px; text-align: left; color: var(--turquesa-light); font-size: 12px; font-weight: 600;">Data</th>
                        <th style="padding: 12px; text-align: left; color: var(--turquesa-light); font-size: 12px; font-weight: 600;">Tema</th>
                        <th style="padding: 12px; text-align: left; color: var(--turquesa-light); font-size: 12px; font-weight: 600;">Área</th>
                        <th style="padding: 12px; text-align: center; color: var(--turquesa-light); font-size: 12px; font-weight: 600;">Rendimento</th>
                        <th style="padding: 12px; text-align: center; color: var(--turquesa-light); font-size: 12px; font-weight: 600;">Tempo</th>
                        <th style="padding: 12px; text-align: left; color: var(--turquesa-light); font-size: 12px; font-weight: 600;">Observações</th>
                        <th style="padding: 12px; text-align: left; color: var(--turquesa-light); font-size: 12px; font-weight: 600;">Sugestão</th>
                    </tr>
                </thead>
                <tbody id="historicoTableBody">
                    <!-- Conteúdo será preenchido por renderHistorico() -->
                </tbody>
            </table>
        </div>
    `;
    
    // Chamar função de histórico existente
    setTimeout(() => {
        renderHistorico();
    }, 100);
}
```

**Mudanças:**
- Estrutura completa de `<table>` com `<thead>` e `<tbody>`
- ID `historicoTableBody` no `<tbody>` (exatamente o que `renderHistorico()` espera)
- Estilos consistentes com o resto da aplicação
- Chamada de `renderHistorico()` após inserir no DOM

#### Risco de Implementação
- **Baixo:** Criação de estrutura HTML estática
- **Teste necessário:** Verificar se histórico renderiza corretamente e se scroll horizontal funciona

---

### Problema #3: Análises Detalhadas Não Aparecem

#### Descrição
Ao acessar a aba "Análises" → "Detalhado", nenhuma análise é exibida. A seção fica vazia.

#### Causa Raiz
```javascript
// Código atual em renderAnalyticsDetalhado()
container.innerHTML = `
    <div id="analisesDetalhadas"></div>
`;

// Mas atualizarAnalises() busca:
const container = document.getElementById('analisesContainer');  // ← ID diferente!
```

**Problema:** A função `atualizarAnalises()` (que chama `calcularAnalises()`) busca um elemento com ID `analisesContainer`, mas o código cria `analisesDetalhadas`.

#### Investigação Adicional Necessária
Preciso verificar:
1. Qual ID a função `calcularAnalises()` realmente usa?
2. Existe algum container intermediário necessário?
3. A estrutura HTML original tinha algum wrapper específico?

#### Solução Proposta (Preliminar)
**Estratégia A:** Criar container com ID que a função espera.

```javascript
function renderAnalyticsDetalhado(container) {
    container.innerHTML = `
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--turquesa-light); font-size: 14px;">🔍 Análises por Área e Tema</span>
            <button class="btn btn-small" onclick="toggleAnalisesTempo()" style="font-size: 11px;">
                <span id="toggleAnalisesTempoText">⏱️ Mostrar Análises de Tempo</span>
            </button>
        </div>
        <div id="analisesContainer"></div>
        <div id="analiseTempo" style="display: none; margin-top: 20px;"></div>
    `;
    
    // Chamar função de análises existente
    setTimeout(() => {
        atualizarSelectsAnalise();  // Se necessário para popular filtros
        atualizarAnalises();
    }, 100);
}
```

**Estratégia B:** Ajustar `calcularAnalises()` para usar o novo ID (menos recomendado, pode quebrar outras partes).

#### Risco de Implementação
- **Médio:** Depende de entender a estrutura completa de `calcularAnalises()`
- **Teste necessário:** Verificar se análises detalhadas renderizam e se filtros funcionam

---

### Problema #4: Performance Mostra 1% Aleatório

#### Descrição
No resumo de Analytics, a métrica "Performance Média" sempre mostra "1%" independente dos dados reais.

#### Causa Raiz
```javascript
// Código atual em renderAnalyticsResumo()
const rendimentoMedio = historico.length > 0 
    ? Math.round(historico.reduce((acc, h) => acc + (h.rendimento || 0), 0) / historico.length) 
    : 0;

// Exemplo: se h.rendimento = 0.85 (85% em decimal)
// Cálculo: (0.85 + 0.90 + 0.75) / 3 = 0.833...
// Math.round(0.833) = 1  ← ERRADO! Deveria ser 83%
```

**Problema:** O campo `rendimento` no histórico está armazenado como **decimal** (0.85 = 85%), mas o cálculo não multiplica por 100 para converter em percentual.

#### Evidência no Código
Em outras partes do código, encontramos:
```javascript
// Correto (em outros lugares):
const rendPct = Math.round((t.rendimento || 0) * 100);  // Multiplica por 100!

// Incorreto (em renderAnalyticsResumo):
const rendimentoMedio = ... / historico.length;  // Não multiplica por 100!
```

#### Impacto
- **Alto:** Métrica crítica completamente incorreta
- Usuário não consegue confiar na performance média
- Pode levar a decisões erradas sobre estudo

#### Solução Proposta
**Estratégia:** Multiplicar o resultado por 100 para converter decimal em percentual.

```javascript
function renderAnalyticsResumo(container) {
    // ... código existente ...
    
    const rendimentoMedio = historico.length > 0 
        ? Math.round(historico.reduce((acc, h) => acc + (h.rendimento || 0), 0) / historico.length * 100)  // ← Multiplicar por 100!
        : 0;
    
    // ... resto do código ...
}
```

**Mudança:**
- Adicionar `* 100` após a divisão
- Manter `Math.round()` para arredondar o percentual

#### Risco de Implementação
- **Muito Baixo:** Mudança matemática simples
- **Teste necessário:** Verificar se percentual agora mostra valores corretos (ex: 85% em vez de 1%)

---

## 🟡 PARTE 2: PROBLEMAS DE UX

### Problema #5: Datalist Não Abre ao Clicar (Print 1)

#### Descrição
No modal "Nova Entrada Diário", ao clicar no campo "Área", o datalist não abre automaticamente. O usuário precisa começar a digitar para ver as opções.

#### Causa Raiz
**Limitação do iOS Safari:** O elemento `<datalist>` não abre automaticamente ao focar/clicar no campo. Só mostra sugestões quando o usuário começa a digitar.

```html
<!-- Código atual -->
<input type="text" class="form-input" id="novaDiarioArea" list="listAreasDiario" placeholder="Ex: Joelho">
<datalist id="listAreasDiario"></datalist>
```

#### Impacto
- **Médio:** UX ruim especialmente no iOS
- Usuário não vê opções disponíveis imediatamente
- Precisa digitar para descobrir quais áreas existem

#### Solução Proposta
**Estratégia:** Trocar `<input>` com `<datalist>` por `<select>` nativo que funciona bem no iOS.

```html
<!-- ANTES (não funciona bem no iOS) -->
<input type="text" class="form-input" id="novaDiarioArea" list="listAreasDiario" placeholder="Ex: Joelho">
<datalist id="listAreasDiario"></datalist>

<!-- DEPOIS (funciona no iOS) -->
<select class="form-select" id="novaDiarioArea" onchange="atualizarTemasDiario(this.value)">
    <option value="">Selecione a área...</option>
    <!-- Popular com AREAS_FIXAS -->
</select>
```

**JavaScript necessário:**
```javascript
function abrirNovaEntradaDiario() {
    // ... código existente ...
    
    // Popular select de áreas
    const areaSelect = document.getElementById('novaDiarioArea');
    areaSelect.innerHTML = '<option value="">Selecione a área...</option>';
    AREAS_FIXAS.forEach(area => {
        areaSelect.innerHTML += `<option value="${area}">${area}</option>`;
    });
    
    // Limpar tema quando área mudar
    areaSelect.onchange = function() {
        atualizarTemasDiario(this.value);
    };
    
    // ... resto do código ...
}

function atualizarTemasDiario(areaSelecionada) {
    const temaSelect = document.getElementById('novaDiarioTema');
    temaSelect.innerHTML = '<option value="">Selecione o tema...</option>';
    
    if (areaSelecionada) {
        const temasDaArea = dados
            .filter(t => t.area === areaSelecionada && t.status !== 'Suspenso')
            .map(t => t.tema)
            .filter((v, i, a) => a.indexOf(v) === i)  // Remover duplicatas
            .sort();
        
        temasDaArea.forEach(tema => {
            temaSelect.innerHTML += `<option value="${tema}">${tema}</option>`;
        });
    }
}
```

**Mudanças:**
- Trocar `<input>` por `<select>` para Área
- Trocar `<input>` por `<select>` para Tema
- Popular selects dinamicamente com `AREAS_FIXAS` e temas filtrados
- Atualizar temas quando área mudar

#### Risco de Implementação
- **Baixo:** Troca de elementos HTML simples
- **Teste necessário:** Verificar se selects abrem corretamente no iOS e se temas são atualizados ao mudar área

---

### Problema #6: Cursor Piscando Fora do Box

#### Descrição
Ao focar em qualquer campo de input/textarea em todas as abas, o cursor aparece piscando fora do campo, como se fosse um bug visual. Quando começa a digitar, o cursor se ajusta.

#### Causa Raiz
**Conflito de CSS/z-index no iOS:** Quando o teclado virtual abre no iOS, ele "empurra" a viewport e pode causar conflitos de posicionamento. O cursor parece estar em um lugar mas visualmente aparece em outro.

Possíveis causas:
1. CSS de `:focus` com `transform` ou `position` conflitantes
2. Z-index incorreto no modal
3. Viewport sendo ajustado pelo iOS quando teclado abre

#### Impacto
- **Médio:** Confusão visual, especialmente no iOS
- Usuário pode pensar que o campo não está funcionando
- Experiência não profissional

#### Solução Proposta
**Estratégia:** Ajustar CSS de foco, z-index e posicionamento do modal.

```css
/* CSS para corrigir cursor fora do box */
.form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--cobre-main);
    box-shadow: 
        0 0 20px rgba(255, 127, 80, 0.3),
        inset 0 0 20px rgba(255, 127, 80, 0.05);
    background: rgba(10, 26, 31, 0.8);
    position: relative;  /* ← Garantir posicionamento relativo */
    z-index: 10;  /* ← Z-index explícito */
    transform: none;  /* ← Remover transformações que podem causar conflito */
}

/* Ajustar modal para evitar conflitos */
.modal.active {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;  /* ← Smooth scrolling no iOS */
}

.modal-content {
    position: relative;
    z-index: 1001;
    margin: 20px auto;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
}
```

**Mudanças:**
- Adicionar `position: relative` e `z-index` explícito nos inputs focados
- Remover `transform` que pode causar conflito
- Ajustar z-index do modal
- Adicionar `-webkit-overflow-scrolling: touch` para smooth scrolling no iOS

#### Risco de Implementação
- **Médio:** Pode afetar outros elementos visuais
- **Teste necessário:** Verificar se cursor aparece corretamente em todos os campos e se não quebrou outros estilos

---

### Problema #7: Textarea Cortando Conteúdo (Print 2)

#### Descrição
No modal "Nova Entrada Diário", o campo "Resposta" (textarea) tem altura fixa (`rows="4"`) e quando o usuário digita muito conteúdo, parte fica cortada ou não visível. O usuário precisa ver todo o conteúdo enquanto digita.

#### Causa Raiz
```html
<!-- Código atual -->
<textarea class="form-textarea" id="novaDiarioResposta" rows="4" placeholder="..."></textarea>
```

**Problema:** 
- Altura fixa (`rows="4"`) sem scroll automático adequado
- Conteúdo longo fica cortado
- Usuário não consegue ver o que está digitando completamente

#### Impacto
- **Médio:** UX ruim, especialmente para respostas longas
- Usuário não consegue revisar o que digitou completamente
- Pode levar a erros de digitação

#### Solução Proposta
**Estratégia:** Adicionar scroll automático e altura dinâmica.

```html
<!-- DEPOIS -->
<textarea 
    class="form-textarea" 
    id="novaDiarioResposta" 
    rows="4" 
    placeholder="..."
    style="min-height: 100px; max-height: 300px; overflow-y: auto; resize: vertical;"
></textarea>
```

**CSS adicional:**
```css
.form-textarea {
    resize: vertical;
    min-height: 100px;
    max-height: 300px;
    overflow-y: auto;
    font-family: inherit;
    line-height: 1.5;
}

.form-textarea:focus {
    /* Manter estilos de foco existentes */
    /* Garantir que scroll seja visível */
    overflow-y: auto;
}
```

**JavaScript para auto-expandir (opcional):**
```javascript
// Auto-expandir textarea enquanto digita
document.getElementById('novaDiarioResposta').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 300) + 'px';  // Max 300px
});
```

**Mudanças:**
- Adicionar `overflow-y: auto` para scroll visível
- Definir `min-height` e `max-height` para limites razoáveis
- Manter `resize: vertical` para permitir ajuste manual
- Opcional: auto-expandir enquanto digita (até máximo)

#### Risco de Implementação
- **Baixo:** Ajustes de CSS simples
- **Teste necessário:** Verificar se scroll funciona e se altura dinâmica não quebra layout

---

### Problema #8: Áreas do Caderno Iniciam Abertas

#### Descrição
Na aba "Caderno", todas as áreas iniciam expandidas (abertas), mostrando todos os temas de uma vez. O usuário quer que iniciem fechadas (colapsadas) por padrão.

#### Causa Raiz
```javascript
// Código atual em renderCaderno()
html += `
    <div class="area-header" onclick="toggleAreaCaderno('${areaId}')">
        <!-- ... -->
    </div>
    <div class="area-content" id="area-content-${areaId}">
        <!-- ... -->
    </div>
`;
```

**Problema:** As áreas são renderizadas sem a classe `collapsed` por padrão, então iniciam expandidas.

#### Impacto
- **Baixo:** Interface inicialmente poluída
- Usuário precisa fechar áreas manualmente se quiser ver menos conteúdo
- Não é crítico, mas melhora organização

#### Solução Proposta
**Estratégia:** Adicionar classe `collapsed` por padrão na renderização.

```javascript
// DEPOIS
html += `
    <div class="area-header collapsed" onclick="toggleAreaCaderno('${areaId}')">
        <!-- ... -->
    </div>
    <div class="area-content collapsed" id="area-content-${areaId}">
        <!-- ... -->
    </div>
`;
```

**Mudança:**
- Adicionar `collapsed` nas classes de `area-header` e `area-content` por padrão
- CSS já existe para `.collapsed`, então só precisa adicionar a classe

#### Risco de Implementação
- **Muito Baixo:** Adicionar classe CSS simples
- **Teste necessário:** Verificar se áreas iniciam fechadas e se toggle funciona corretamente

---

### Problema #9: Diário Não Segue Padrão Visual do Caderno

#### Descrição
A aba "Diário" não usa a mesma estrutura visual de áreas colapsáveis que o "Caderno" usa. O usuário quer que o Diário siga o mesmo padrão visual, tanto na visualização "Por Data" quanto "Por Tema".

#### Causa Raiz
```javascript
// Código atual em renderDiarioPorTema()
html += `<div style="margin-bottom: 24px;">
    <h3 style="color: var(--turquesa-light); font-size: 15px; font-weight: 600; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(0,206,209,0.2);">
        📁 ${temaKey}
    </h3>
    ${porTema[temaKey].map(e => renderEntradaDiario(e)).join('')}
</div>`;
```

**Problema:** Estrutura simples com `<h3>` e conteúdo direto, sem áreas colapsáveis como no Caderno.

#### Impacto
- **Médio:** Inconsistência visual entre seções
- Usuário espera mesmo padrão em toda aplicação
- Organização menos clara

#### Solução Proposta
**Estratégia:** Aplicar mesma estrutura de áreas colapsáveis do Caderno no Diário.

**Para visualização "Por Tema":**
```javascript
function renderDiarioPorTema(entradas, container) {
    // Agrupar por área primeiro, depois por tema
    const porArea = {};
    entradas.forEach(e => {
        if (!porArea[e.area]) porArea[e.area] = {};
        const temaKey = `${e.area} - ${e.tema}`;
        if (!porArea[e.area][temaKey]) porArea[e.area][temaKey] = [];
        porArea[e.area][temaKey].push(e);
    });
    
    let html = '';
    Object.keys(porArea).sort().forEach(area => {
        const areaId = `diario-area-${area.replace(/\s+/g, '-').toLowerCase()}`;
        const temasNaArea = Object.keys(porArea[area]);
        
        html += `
            <div class="area-header collapsed" onclick="toggleAreaDiario('${areaId}')">
                <div class="area-header-left">
                    <span class="area-header-title">📁 ${area}</span>
                    <span class="area-header-count">${temasNaArea.length} tema(s)</span>
                </div>
                <span class="area-header-toggle">▼</span>
            </div>
            <div class="area-content collapsed" id="area-content-${areaId}">
                ${temasNaArea.map(temaKey => `
                    <div style="margin-bottom: 20px; margin-left: 20px;">
                        <h4 style="color: var(--turquesa-light); font-size: 14px; font-weight: 600; margin-bottom: 10px;">
                            📝 ${temaKey.split(' - ')[1]}
                        </h4>
                        ${porArea[area][temaKey].map(e => renderEntradaDiario(e)).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function toggleAreaDiario(areaId) {
    const header = document.querySelector(`[onclick="toggleAreaDiario('${areaId}')"]`);
    const content = document.getElementById(`area-content-${areaId}`);
    
    if (header && content) {
        header.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
    }
}
```

**Para visualização "Por Data":**
```javascript
function renderDiarioPorData(entradas, container) {
    // Agrupar por data
    const porData = {};
    entradas.forEach(e => {
        if (!porData[e.data]) porData[e.data] = [];
        porData[e.data].push(e);
    });
    
    const datasOrdenadas = Object.keys(porData).sort((a, b) => new Date(b) - new Date(a));
    
    let html = '';
    datasOrdenadas.forEach(data => {
        const dataId = `diario-data-${data}`;
        
        html += `
            <div class="area-header collapsed" onclick="toggleAreaDiario('${dataId}')">
                <div class="area-header-left">
                    <span class="area-header-title">📅 ${formatarDataCompleta(data)}</span>
                    <span class="area-header-count">${porData[data].length} entrada(s)</span>
                </div>
                <span class="area-header-toggle">▼</span>
            </div>
            <div class="area-content collapsed" id="area-content-${dataId}">
                ${porData[data].map(e => renderEntradaDiario(e)).join('')}
            </div>
        `;
    });
    
    container.innerHTML = html;
}
```

**Mudanças:**
- Usar mesma estrutura HTML do Caderno (`area-header`, `area-content`)
- Adicionar função `toggleAreaDiario()` similar a `toggleAreaCaderno()`
- Agrupar por área na visualização "Por Tema"
- Agrupar por data na visualização "Por Data"
- Áreas iniciam fechadas (`collapsed` por padrão)

#### Risco de Implementação
- **Médio:** Refatoração de estrutura de renderização
- **Teste necessário:** Verificar se toggle funciona, se áreas iniciam fechadas, e se visualização por data e tema funcionam corretamente

---

### Problema #10: Falta Campo de Data no Diário

#### Descrição
Ao criar uma nova entrada no Diário, a data é sempre a de hoje (`hoje = new Date().toISOString().split('T')[0]`). O usuário quer poder escolher a data manualmente para criar notas retroativas.

#### Causa Raiz
```javascript
// Código atual em salvarEntradaDiario()
const hoje = new Date().toISOString().split('T')[0];

if (entradaId) {
    // Editar entrada existente
    // ...
} else {
    // Nova entrada
    const novaEntrada = {
        id: Date.now(),
        data: hoje,  // ← Sempre hoje!
        // ...
    };
}
```

**Problema:** Não há campo de data no modal, então sempre usa a data de hoje.

#### Impacto
- **Médio:** Não permite criar notas retroativas
- Usuário pode querer registrar aprendizado de dias anteriores
- Limitação funcional

#### Solução Proposta
**Estratégia:** Adicionar campo de data editável no modal.

**HTML:**
```html
<div class="form-group">
    <label class="form-label">📅 Data</label>
    <input type="date" class="form-input" id="novaDiarioData" value="">
</div>
```

**JavaScript:**
```javascript
function abrirNovaEntradaDiario() {
    // ... código existente ...
    
    // Setar data padrão como hoje
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('novaDiarioData').value = hoje;
    
    // ... resto do código ...
}

function salvarEntradaDiario() {
    // ... código existente ...
    
    const data = document.getElementById('novaDiarioData').value || new Date().toISOString().split('T')[0];
    
    if (entradaId) {
        // Editar entrada existente
        entrada.data = data;  // Permitir mudar data ao editar
        // ...
    } else {
        // Nova entrada
        const novaEntrada = {
            id: Date.now(),
            data: data,  // ← Usar data do campo!
            // ...
        };
    }
    
    // ... resto do código ...
}

function editarEntradaDiario(entradaId) {
    // ... código existente ...
    
    document.getElementById('novaDiarioData').value = entrada.data || new Date().toISOString().split('T')[0];
    
    // ... resto do código ...
}
```

**Mudanças:**
- Adicionar `<input type="date">` no modal
- Setar data padrão como hoje ao abrir modal
- Usar data do campo ao salvar (não sempre hoje)
- Permitir editar data ao editar entrada existente

#### Risco de Implementação
- **Baixo:** Adicionar campo HTML e usar seu valor
- **Teste necessário:** Verificar se data é salva corretamente e se aparece na visualização

---

## 📋 PARTE 3: PLANO DE IMPLEMENTAÇÃO

### Fase 1: Corrigir Analytics (CRÍTICO) - Prioridade MÁXIMA

**Objetivo:** Restaurar funcionalidade completa da aba Analytics.

**Tarefas:**
1. ✅ Corrigir IDs dos canvas em `renderAnalyticsGraficos()`
2. ✅ Criar estrutura completa da tabela em `renderAnalyticsHistorico()`
3. ✅ Corrigir container de análises detalhadas em `renderAnalyticsDetalhado()`
4. ✅ Corrigir cálculo de performance em `renderAnalyticsResumo()`

**Tempo estimado:** 1-2 horas  
**Risco:** Baixo  
**Testes necessários:**
- Verificar se gráficos renderizam
- Verificar se histórico aparece
- Verificar se análises detalhadas aparecem
- Verificar se performance mostra valor correto

---

### Fase 2: Corrigir UX do Diário - Prioridade ALTA

**Objetivo:** Melhorar experiência do usuário no modal de Diário.

**Tarefas:**
5. ✅ Trocar datalist por select nativo
6. ✅ Adicionar campo de data editável
7. ✅ Corrigir textarea (scroll e altura dinâmica)
8. ✅ Corrigir CSS do cursor (z-index e posicionamento)

**Tempo estimado:** 2-3 horas  
**Risco:** Médio  
**Testes necessários:**
- Verificar se selects abrem no iOS
- Verificar se data é salva corretamente
- Verificar se textarea tem scroll
- Verificar se cursor aparece corretamente

---

### Fase 3: Padronizar Visual - Prioridade MÉDIA

**Objetivo:** Aplicar padrão visual consistente entre Caderno e Diário.

**Tarefas:**
9. ✅ Áreas do Caderno iniciarem fechadas
10. ✅ Diário seguir padrão visual do Caderno (áreas colapsáveis)

**Tempo estimado:** 2-3 horas  
**Risco:** Médio  
**Testes necessários:**
- Verificar se áreas iniciam fechadas
- Verificar se toggle funciona
- Verificar se visualização por data e tema funcionam

---

## 🔍 PARTE 4: ANÁLISE DE RISCOS

### Riscos Gerais

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Quebrar funcionalidade existente | Baixa | Alto | Testar cada mudança isoladamente |
| Conflitos de CSS | Média | Médio | Usar seletores específicos, testar em iOS |
| Performance degradada | Baixa | Baixo | Manter estrutura existente, apenas ajustar IDs |
| Incompatibilidade iOS | Média | Médio | Testar especificamente no iOS Safari |

### Estratégia de Testes

1. **Teste Unitário:** Cada função corrigida isoladamente
2. **Teste de Integração:** Verificar se Analytics funciona completo
3. **Teste de UX:** Verificar fluxo completo no iOS
4. **Teste de Regressão:** Verificar se outras funcionalidades não quebraram

---

## 📝 PARTE 5: CHECKLIST DE VALIDAÇÃO

### Antes de Implementar
- [ ] Validar plano com Opus
- [ ] Confirmar ordem de prioridades
- [ ] Confirmar estratégias de solução
- [ ] Identificar possíveis problemas adicionais

### Durante Implementação
- [ ] Implementar Fase 1 (Analytics)
- [ ] Testar Fase 1 completamente
- [ ] Implementar Fase 2 (UX Diário)
- [ ] Testar Fase 2 completamente
- [ ] Implementar Fase 3 (Padronização)
- [ ] Testar Fase 3 completamente

### Após Implementação
- [ ] Teste completo em desktop (Chrome/Safari)
- [ ] Teste completo em iOS Safari
- [ ] Verificar se não quebrou outras funcionalidades
- [ ] Validar com usuário final

---

## 🎯 PARTE 6: CONCLUSÃO

Este plano detalha todos os problemas identificados, suas causas raiz, soluções propostas e estratégia de implementação. A priorização garante que problemas críticos sejam resolvidos primeiro, seguidos por melhorias de UX.

**Próximos Passos:**
1. Validar este plano com Opus
2. Ajustar conforme feedback
3. Implementar seguindo ordem de prioridades
4. Testar completamente antes de deploy

---

**Documento preparado por:** Cursor AI  
**Data:** 12 de Dezembro de 2025  
**Versão do documento:** 1.0

