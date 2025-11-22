// 🔧 CÓDIGO PARA EXPORTAR ANOTAÇÕES DO MODELO ANTIGO
// Execute este código no Console do navegador (F12 → Console) no modelo antigo

(function() {
    try {
        // Pegar anotações do localStorage
        let anotacoes = JSON.parse(localStorage.getItem('vrvs_anotacoes') || '[]');
        
        if (anotacoes.length === 0) {
            console.log('❌ Nenhuma anotação encontrada no localStorage');
            alert('Nenhuma anotação encontrada!');
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
        
        console.log('✅ Anotações exportadas com sucesso!');
        alert(`✅ ${anotacoes.length} anotação(ões) exportadas com sucesso!`);
        
    } catch (error) {
        console.error('❌ Erro ao exportar:', error);
        alert('❌ Erro ao exportar: ' + error.message);
    }
})();

