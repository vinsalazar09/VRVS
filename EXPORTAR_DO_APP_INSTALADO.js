// 🔧 CÓDIGO PARA EXPORTAR ANOTAÇÕES DO APP INSTALADO
// Execute este código DENTRO do app VRVS instalado na tela inicial

// INSTRUÇÕES:
// 1. Abra o app VRVS instalado na tela inicial
// 2. Adicione "javascript:" na URL ou use um método para executar código
// 3. Ou adicione este código temporariamente no index.html

(function exportarAnotacoesDoApp() {
    try {
        // Pegar anotações do localStorage
        let anotacoes = JSON.parse(localStorage.getItem('vrvs_anotacoes') || '[]');
        
        if (anotacoes.length === 0) {
            alert('❌ Nenhuma anotação encontrada no localStorage');
            return;
        }
        
        console.log(`📔 Encontradas ${anotacoes.length} anotação(ões)`);
        
        // Função para converter para CSV
        function dados2CSV(arr) {
            if (arr.length === 0) return '';
            const headerSet = new Set();
            arr.forEach(obj => {
                if (obj) Object.keys(obj).forEach(k => headerSet.add(k));
            });
            const headers = Array.from(headerSet);
            
            const rows = arr.map(obj => headers.map(h => {
                const val = (obj && obj[h] != null) ? obj[h] : '';
                const strVal = String(val);
                const escaped = strVal.replace(/"/g, '""');
                return (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) 
                    ? `"${escaped}"` 
                    : escaped;
            }).join(','));
            
            return [headers.join(','), ...rows].join('\n');
        }
        
        // Converter para CSV
        const csv = dados2CSV(anotacoes);
        
        // Criar e baixar arquivo
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const hoje = new Date().toISOString().split('T')[0];
        a.download = `VRVS_ANOTACOES_${hoje}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`✅ ${anotacoes.length} anotação(ões) exportadas com sucesso!`);
        console.log('✅ Arquivo CSV baixado');
        
    } catch (error) {
        alert('❌ Erro ao exportar: ' + error.message);
        console.error('Erro:', error);
    }
})();

