// ============================================================
// CÓDIGO RELEVANTE - BUG ABA PENDÊNCIAS
// ============================================================
// Este arquivo contém apenas o código relevante para análise
// do bug onde alguns itens não respondem ao toque/clique
// ============================================================

// ==================== FUNÇÃO RENDER PENDÊNCIAS ====================
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

// ==================== FUNÇÃO TOGGLE PENDÊNCIA ====================
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

// ==================== CSS RELEVANTE ====================
/*
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
*/

// ==================== COMPARAÇÃO: TABS QUE FUNCIONAM ====================
/*
<div class="tab active" onclick="showSection('dados')">📊 Dados</div>
<div class="tab" onclick="showSection('cadastro')">➕ Cadastro</div>
<div class="tab" onclick="showSection('pendencias')">🔔 Pendências</div>
*/

// ==================== ESTRUTURA DE DADOS ====================
/*
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
  }
];
*/

// ==================== HTML GERADO (EXEMPLO) ====================
/*
<div class="task-theme-item priority-3" 
     onclick="togglePendencia(1733174400000)" 
     style="touch-action: manipulation; -webkit-tap-highlight-color: transparent; cursor: pointer;">
    <div class="task-theme-name">Fratura de clavícula</div>
    <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">
        📚 Ortopedia • ⚠️ 7 dias atrasado
    </div>
</div>
*/

