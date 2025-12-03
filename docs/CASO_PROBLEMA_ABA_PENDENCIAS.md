# CASO TÉCNICO: Bug na Aba Pendências - Itens Não Respondem ao Toque/Clique

**Data:** 2025-12-02  
**Plataforma:** VRVS v5.1 - Sistema de Gestão de Estudos  
**Ambiente:** Progressive Web App (PWA) usado principalmente no iPhone  
**Arquivo Principal:** `docs/index.html` (~5665 linhas, código monolítico)

---

## 📋 RESUMO DO PROBLEMA

Alguns itens específicos na aba "Pendências" não respondem ao toque/clique no iPhone, enquanto outros itens na mesma aba funcionam normalmente. O problema é intermitente - alguns itens abrem, outros não.

**Itens que NÃO funcionam:**
- Fratura de clavícula
- Epifisiolistese
- Sd manguito rotador
- DDQ
- Luxação e Instabilidade do cotovelo
- LAC/LEC
- Epicondilites
- Fraturas do cotovelo

**Comportamento:**
- Alguns itens na mesma aba funcionam normalmente
- O problema ocorre principalmente no iPhone (plataforma é mobile-first)
- Não há erros visíveis no console (sem logs de erro)

---

## 🔍 CONTEXTO TÉCNICO

### Arquitetura
- **Tipo:** Single Page Application (SPA) monolítica
- **Tecnologia:** HTML5 + JavaScript vanilla (sem frameworks)
- **Armazenamento:** LocalStorage
- **PWA:** Service Worker configurado para funcionamento offline
- **Tamanho:** ~5665 linhas em um único arquivo HTML

### Estrutura de Dados
```javascript
// Array global de temas
let dados = [
  {
    id: Number,           // ID único (geralmente timestamp)
    area: String,         // Ex: "Ortopedia"
    tema: String,         // Ex: "Fratura de clavícula"
    status: String,       // "Em estudo", "Planejado", "Concluído", "Suspenso"
    prioridade: Number,   // 1-5
    rendimento: Number,   // 0-1 (decimal)
    sessoes: Number,
    agenda: String,       // Data ISO (YYYY-MM-DD)
    // ... outros campos
  }
];
```

### Como Funciona a Aba Pendências
1. Função `renderPendencias()` filtra temas com revisão vencida (>7 dias de atraso)
2. Gera HTML dinamicamente usando template strings
3. Cada item deve ser clicável para expandir/colapsar detalhes
4. Estado de expansão é controlado por `Set()` global: `window.pendenciasExpandidas`

---

## 🐛 HISTÓRICO DE TENTATIVAS DE CORREÇÃO

### Tentativa 1: Event Delegation com Data Attributes
**O que foi feito:**
- Removido `onclick` inline
- Adicionado `data-tema-id` nos elementos
- Criada função `inicializarEventListenersPendencias()` com event delegation
- Adicionados listeners para `click` e `touchend`

**Código:**
```javascript
function inicializarEventListenersPendencias() {
    const container = document.getElementById('pendenciasContainer');
    if (!container) return;
    
    window.pendenciasClickHandler = function(e) {
        const taskItem = e.target.closest('.task-theme-item');
        if (taskItem) {
            const temaId = taskItem.getAttribute('data-tema-id');
            if (temaId) {
                e.preventDefault();
                e.stopPropagation();
                togglePendencia(temaId);
            }
        }
    };
    
    container.addEventListener('click', window.pendenciasClickHandler);
    container.addEventListener('touchend', window.pendenciasClickHandler);
}
```

**HTML gerado:**
```html
<div class="task-theme-item" data-tema-id="1234567890">
```

**Resultado:** ❌ Não funcionou

---

### Tentativa 2: Onclick Inline (Solução Simples)
**O que foi feito:**
- Removida função de event delegation
- Adicionado `onclick` inline diretamente no HTML, igual às tabs que funcionam
- Usado padrão `${temaId}` sem aspas (igual outros elementos)

**Código atual:**
```javascript
container.innerHTML = pendencias.map(t => {
    const temaId = t.id != null ? String(t.id) : null;
    if (!temaId) {
        console.warn('[PENDENCIAS] Tema sem ID válido:', t.tema);
        return '';
    }
    
    const temaIdNumero = Number(t.id) || t.id;
    
    return `
    <div class="task-theme-item priority-${t.prioridade || 3}" 
         onclick="togglePendencia(${temaIdNumero})" 
         style="touch-action: manipulation; -webkit-tap-highlight-color: transparent; cursor: pointer;">
        <div class="task-theme-name">${t.tema}</div>
        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">
            📚 ${t.area} • ⚠️ ${diasAtraso} dias atrasado
        </div>
        ${isExpanded ? `
        <div class="task-expanded" style="pointer-events: none;">
            <!-- conteúdo expandido -->
        </div>
        ` : ''}
    </div>
    `;
}).join('');
```

**Resultado:** ❌ Ainda não funciona para os itens específicos

---

## 📝 CÓDIGO COMPLETO RELEVANTE

### Função renderPendencias() (linhas ~2155-2232)
```javascript
function renderPendencias() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const hojeStr = hoje.toISOString().split('T')[0];
    
    // Data limite: hoje - 7 dias (pendências com mais de 7 dias de atraso)
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() - 7);
    const limiteStr = limite.toISOString().split('T')[0];
    
    const container = document.getElementById('pendenciasContainer');
    
    const pendencias = dados.filter(t => {
        if (!t.agenda || !t.tema) return false;
        if (t.status !== 'Em estudo' && t.status !== 'Planejado') return false;
        if (!dataValida(t.agenda)) return false;
        // Tarefas com mais de 7 dias de atraso
        const agendaDate = new Date(t.agenda + 'T00:00:00');
        const limiteDate = new Date(limiteStr + 'T00:00:00');
        return agendaDate < limiteDate;
    });
    
    if (pendencias.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><div>Nenhuma pendência!</div></div>';
        return;
    }
    
    // Ordenar: mais recente primeiro, depois menos sessões
    pendencias.sort((a, b) => {
        const diffData = new Date(b.agenda) - new Date(a.agenda);
        if (diffData !== 0) return diffData;
        return (a.sessoes || 0) - (b.sessoes || 0);
    });
    
    // Variável para controlar pendências expandidas
    let pendenciasExpandidas = window.pendenciasExpandidas || new Set();
    window.pendenciasExpandidas = pendenciasExpandidas;
    
    container.innerHTML = pendencias.map(t => {
        // CORREÇÃO: Garantir que ID seja sempre válido e consistente (sempre string)
        const temaId = t.id != null ? String(t.id) : null;
        if (!temaId) {
            console.warn('[PENDENCIAS] Tema sem ID válido:', t.tema);
            return '';
        }
        
        // DEBUG: Log para identificar problemas com IDs específicos
        if (['Fratura de clavícula', 'Epifisiolistese', 'Sd manguito rotador', 'DDQ', 'Luxação e Instabilidade do cotovelo', 'LAC/LEC', 'Epicondilites', 'Fraturas do cotovelo'].includes(t.tema)) {
            console.log('[PENDENCIAS DEBUG] Tema:', t.tema, 'ID:', temaId, 'Tipo ID original:', typeof t.id);
        }
        
        // CORREÇÃO: Garantir que comparação no Set use sempre string
        const isExpanded = pendenciasExpandidas.has(temaId);
        const sugestao = obterSugestaoTema(t);
        const rendPct = Math.round((t.rendimento || 0) * 100);
        const rendColor = rendPct >= 80 ? '#00FFE0' : rendPct >= 50 ? '#FFA366' : '#EF4444';
        const tipo = calcularTipoRevisao(t);
        const dataFormatada = formatarDataBR(t.agenda);
        const diasAtraso = Math.floor((new Date(hojeStr) - new Date(t.agenda)) / (1000 * 60 * 60 * 24));
        
        // CORREÇÃO: Garantir que ID seja número para onclick (igual aos outros lugares)
        const temaIdNumero = Number(t.id) || t.id;
        
        return `
        <div class="task-theme-item priority-${t.prioridade || 3}" onclick="togglePendencia(${temaIdNumero})" style="touch-action: manipulation; -webkit-tap-highlight-color: transparent; cursor: pointer;">
            <div class="task-theme-name">${t.tema}</div>
            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">📚 ${t.area} • ⚠️ ${diasAtraso} dias atrasado</div>
            ${isExpanded ? `
            <div class="task-expanded" style="pointer-events: none;">
                <div class="task-details">
                    <div class="task-detail-item">⭐ Prior: ${t.prioridade || 3}</div>
                    <div class="task-detail-item" style="color: ${rendColor};">📊 ${rendPct}%</div>
                    <div class="task-detail-item">📢 ${t.sessoes || 0} sessões</div>
                    <div class="task-detail-item">📅 ${dataFormatada}</div>
                </div>
                ${tipo ? `<div class="task-tipo">${tipo}</div>` : ''}
                ${sugestao ? `
                <div class="task-suggestion">
                    <div class="task-suggestion-label">Diretriz</div>
                    <div class="task-suggestion-text">${sugestao}</div>
                </div>
                ` : ''}
            </div>
            ` : ''}
        </div>
        `;
    }).join('');
}
```

### Função togglePendencia() (linhas ~2247-2265)
```javascript
window.togglePendencia = function(temaId) {
    // DEBUG: Log para identificar problemas
    console.log('[PENDENCIAS] togglePendencia chamado com temaId:', temaId, 'tipo:', typeof temaId);
    
    // CORREÇÃO: Validar ID antes de processar
    if (temaId == null || temaId === '') {
        console.warn('[PENDENCIAS] Tentativa de toggle com ID inválido:', temaId);
        return;
    }
    
    // Garantir que temaId seja string para comparação consistente
    temaId = String(temaId);
    
    if (!window.pendenciasExpandidas) {
        window.pendenciasExpandidas = new Set();
    }
    if (window.pendenciasExpandidas.has(temaId)) {
        window.pendenciasExpandidas.delete(temaId);
    } else {
        window.pendenciasExpandidas.add(temaId);
    }
    renderPendencias();
};
```

### CSS do task-theme-item (linhas ~582-613)
```css
.task-theme-item {
    background: linear-gradient(135deg,
        rgba(20, 35, 45, 0.6),
        rgba(30, 50, 60, 0.4)
    );
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
    border: 1px solid rgba(0, 206, 209, 0.3);
    border-left: 4px solid rgba(0, 206, 209, 0.5);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.task-theme-item:hover {
    border-color: var(--cobre-main);
    transform: translateY(-2px);
    box-shadow: 
        0 8px 24px rgba(255, 127, 80, 0.3),
        0 0 40px rgba(255, 127, 80, 0.1);
}

.task-theme-item:active {
    transform: translateY(0);
}
```

### Comparação: Tabs que Funcionam (linha ~1378)
```html
<div class="tab active" onclick="showSection('dados')">📊 Dados</div>
<div class="tab" onclick="showSection('cadastro')">➕ Cadastro</div>
<div class="tab" onclick="showSection('pendencias')">🔔 Pendências</div>
```

**Nota:** As tabs usam `onclick` inline e funcionam perfeitamente no iPhone.

---

## 🤔 HIPÓTESES E ANÁLISE

### Hipótese 1: Problema com IDs dos Itens Específicos
**Possibilidade:** Os IDs desses itens específicos podem ter algum problema:
- IDs podem ser strings em vez de números
- IDs podem ter caracteres especiais
- IDs podem ser `undefined` ou `null`

**Evidência:** Logs de debug foram adicionados mas não temos feedback ainda.

### Hipótese 2: Elementos Filhos Interceptando Eventos
**Possibilidade:** Elementos filhos dentro de `.task-theme-item` podem estar interceptando o toque.

**Evidência:** 
- `.task-expanded` tem `pointer-events: none` quando expandido
- Mas quando não expandido, pode haver outros elementos interferindo

### Hipótese 3: Problema com Template String e Escape
**Possibilidade:** O template string pode estar gerando HTML inválido para alguns itens.

**Evidência:**
- Nomes dos temas têm caracteres especiais (ç, ã, /)
- Mas isso não deveria afetar o `onclick`

### Hipótese 4: Problema com Set() e Comparação de IDs
**Possibilidade:** A comparação no `Set()` pode estar falhando para alguns IDs.

**Evidência:**
- `Set()` usa comparação estrita
- IDs são convertidos para string, mas podem ter tipos diferentes

### Hipótese 5: Timing ou Race Condition
**Possibilidade:** `renderPendencias()` pode estar sendo chamada antes do DOM estar pronto, ou múltiplas vezes causando conflitos.

**Evidência:**
- Função é chamada na inicialização e após cada toggle
- Não há proteção contra múltiplas renderizações simultâneas

---

## 🔧 O QUE JÁ FOI VERIFICADO

✅ IDs são validados antes de renderizar  
✅ IDs são convertidos para string para comparação no Set  
✅ IDs são convertidos para número no onclick  
✅ CSS tem `touch-action: manipulation` e `cursor: pointer`  
✅ Elementos filhos têm `pointer-events: none` quando expandidos  
✅ Logs de debug foram adicionados  
✅ Padrão onclick inline igual às tabs que funcionam  

---

## ❓ PERGUNTAS PARA CONSULTA EXTERNA

1. **Por que alguns itens funcionam e outros não na mesma renderização?**
   - Todos usam o mesmo código
   - Todos passam pelas mesmas validações
   - Mas alguns respondem e outros não

2. **Há algum problema conhecido com onclick inline em mobile/iOS?**
   - Especialmente quando gerado dinamicamente via template strings
   - Com IDs numéricos vs strings

3. **O problema pode estar nos dados específicos desses itens?**
   - Como identificar diferenças nos dados que causam o problema?
   - Como debugar isso efetivamente?

4. **Há alguma alternativa melhor que onclick inline para mobile?**
   - Considerando que event delegation também não funcionou
   - E que outros elementos similares funcionam com onclick inline

5. **Pode ser problema de cache do Service Worker?**
   - O código pode estar sendo servido do cache antigo?
   - Como garantir que a versão mais recente está sendo usada?

---

## 📊 DADOS DE EXEMPLO (Estrutura Esperada)

```javascript
// Exemplo de item que NÃO funciona
{
  id: 1733174400000,  // ou pode ser string?
  area: "Ortopedia",
  tema: "Fratura de clavícula",  // tem ç e acentos
  status: "Em estudo",
  prioridade: 3,
  rendimento: 0.65,
  sessoes: 2,
  agenda: "2024-11-25",  // mais de 7 dias atrás
  // ... outros campos
}

// Exemplo de item que FUNCIONA (hipotético)
{
  id: 1733174500000,
  area: "Ortopedia", 
  tema: "Outro tema",  // sem acentos?
  status: "Em estudo",
  prioridade: 3,
  rendimento: 0.70,
  sessoes: 1,
  agenda: "2024-11-20",
  // ... outros campos
}
```

---

## 🎯 OBJETIVO DA CONSULTA

Precisamos entender:
1. **Por que alguns itens não respondem ao toque no iPhone**
2. **Qual a melhor solução técnica para garantir que todos funcionem**
3. **Como debugar efetivamente esse tipo de problema em mobile**

**Restrições:**
- Não podemos usar frameworks (é vanilla JS)
- Precisamos manter compatibilidade com PWA/offline
- Solução deve funcionar principalmente no iPhone
- Código está em arquivo monolítico (~5665 linhas)

---

## 📎 ARQUIVOS RELEVANTES

- `docs/index.html` - Arquivo principal (linhas 2155-2265 são as mais relevantes)
- `DIARIO/CURSOR/CADERNO_ERROS_ACERTOS.txt` - Histórico de tentativas
- Este documento: `docs/CASO_PROBLEMA_ABA_PENDENCIAS.md`

---

**Última atualização:** 2025-12-02  
**Status:** 🔴 Problema ainda não resolvido  
**Próximo passo:** Consulta externa (GPT/Opus) para análise técnica

