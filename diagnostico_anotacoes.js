// ═══════════════════════════════════════════════════════════════
// DIAGNÓSTICO: Problema de Importação de Anotações
// ═══════════════════════════════════════════════════════════════
// Execute este script no console do navegador

(function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔬 DIAGNÓSTICO: PROBLEMA DE IMPORTAÇÃO DE ANOTAÇÕES');
    console.log('═══════════════════════════════════════════════════════');
    
    // 1. VERIFICAR ANOTAÇÕES NO LOCALSTORAGE
    console.log('\n📋 1. VERIFICANDO ANOTAÇÕES NO LOCALSTORAGE');
    console.log('─────────────────────────────────────────────────────');
    
    const anotacoes = JSON.parse(localStorage.getItem('vrvs_anotacoes') || '[]');
    console.log(`Total de anotações: ${anotacoes.length}`);
    
    if (anotacoes.length === 0) {
        console.log('❌ NENHUMA ANOTAÇÃO ENCONTRADA NO LOCALSTORAGE!');
    } else {
        console.log('\n📝 Anotações encontradas:');
        anotacoes.forEach((a, i) => {
            const temConteudo = (a.conteudo || '').trim().length > 0;
            console.log(`\n  ${i + 1}. ID: ${a.id} | temaId: "${a.temaId}" (tipo: ${typeof a.temaId})`);
            console.log(`     Tema: ${a.tema || 'N/A'} | Área: ${a.area || 'N/A'}`);
            console.log(`     Tem conteúdo: ${temConteudo ? '✅ SIM' : '❌ NÃO'}`);
            console.log(`     Conteúdo (primeiros 50 chars): ${(a.conteudo || '').substring(0, 50)}...`);
        });
    }
    
    // 2. VERIFICAR DADOS (TEMAS)
    console.log('\n📊 2. VERIFICANDO DADOS (TEMAS)');
    console.log('─────────────────────────────────────────────────────');
    
    const dados = JSON.parse(localStorage.getItem('vrvs_dados') || '[]');
    console.log(`Total de temas: ${dados.length}`);
    
    // 3. VERIFICAR CORRESPONDÊNCIA DE IDs
    console.log('\n🔗 3. VERIFICANDO CORRESPONDÊNCIA DE IDs');
    console.log('─────────────────────────────────────────────────────');
    
    const problemas = [];
    
    anotacoes.forEach(a => {
        const temaIdAnotacao = String(a.temaId || '');
        const temaCorrespondente = dados.find(t => String(t.id) === temaIdAnotacao);
        
        if (!temaCorrespondente) {
            problemas.push({
                anotacao: a,
                problema: temaIdAnotacao === '' ? 'temaId está vazio' : `temaId "${temaIdAnotacao}" não encontrado em dados`
            });
        }
    });
    
    if (problemas.length > 0) {
        console.log(`\n⚠️ PROBLEMAS ENCONTRADOS (${problemas.length}):`);
        problemas.forEach((p, i) => {
            console.log(`\n  ${i + 1}. ${p.problema}`);
            console.log(`     Anotação ID: ${p.anotacao.id}`);
            console.log(`     temaId: "${p.anotacao.temaId}"`);
            console.log(`     Tema: ${p.anotacao.tema || 'N/A'}`);
        });
    } else {
        console.log('✅ Todas as anotações têm temaId correspondente em dados');
    }
    
    // 4. VERIFICAR SE ANOTAÇÕES ESTÃO SENDO EXIBIDAS
    console.log('\n👁️ 4. VERIFICANDO SE ANOTAÇÕES ESTÃO SENDO EXIBIDAS');
    console.log('─────────────────────────────────────────────────────');
    
    const container = document.getElementById('cadernoContainer');
    if (container) {
        const itensExibidos = container.querySelectorAll('.task-item');
        console.log(`Itens exibidos no caderno: ${itensExibidos.length}`);
        
        if (itensExibidos.length === 0) {
            console.log('❌ NENHUM ITEM EXIBIDO! Verifique se está na aba Caderno.');
        } else {
            console.log('\n📝 Itens exibidos:');
            itensExibidos.forEach((item, i) => {
                const temaId = item.getAttribute('data-tema-id');
                const temaNome = item.querySelector('div[style*="font-weight"]')?.textContent || 'N/A';
                const textarea = item.querySelector('textarea');
                const temConteudo = textarea && textarea.value.trim().length > 0;
                
                console.log(`  ${i + 1}. temaId: ${temaId} | ${temaNome} | Tem conteúdo: ${temConteudo ? '✅' : '❌'}`);
            });
        }
    } else {
        console.log('❌ Container cadernoContainer não encontrado! Certifique-se de estar na aba Caderno.');
    }
    
    // 5. COMPARAR ANOTAÇÕES COM ITENS EXIBIDOS
    console.log('\n🔄 5. COMPARANDO ANOTAÇÕES COM ITENS EXIBIDOS');
    console.log('─────────────────────────────────────────────────────');
    
    if (container && anotacoes.length > 0) {
        const anotacoesComConteudo = anotacoes.filter(a => (a.conteudo || '').trim().length > 0);
        console.log(`Anotações com conteúdo: ${anotacoesComConteudo.length}`);
        
        anotacoesComConteudo.forEach(a => {
            const temaId = String(a.temaId || '');
            const itemExibido = container.querySelector(`[data-tema-id="${temaId}"]`);
            
            if (!itemExibido) {
                console.log(`⚠️ Anotação com conteúdo não está sendo exibida: temaId "${temaId}"`);
            }
        });
    }
    
    // 6. RESUMO
    console.log('\n📋 RESUMO');
    console.log('═══════════════════════════════════════════════════════');
    
    const anotacoesComConteudo = anotacoes.filter(a => (a.conteudo || '').trim().length > 0);
    const anotacoesSemTemaId = anotacoes.filter(a => !a.temaId || String(a.temaId).trim() === '');
    
    console.log(`Total de anotações: ${anotacoes.length}`);
    console.log(`Anotações com conteúdo: ${anotacoesComConteudo.length}`);
    console.log(`Anotações sem temaId válido: ${anotacoesSemTemaId.length}`);
    console.log(`Problemas de correspondência: ${problemas.length}`);
    
    if (anotacoesSemTemaId.length > 0) {
        console.log('\n⚠️ PROBLEMA IDENTIFICADO:');
        console.log(`   ${anotacoesSemTemaId.length} anotação(ões) têm temaId vazio ou inválido`);
        console.log('   Isso pode acontecer se o CSV não tinha coluna temaId ou temaid');
    }
    
    // Exportar dados para análise
    window.diagnosticoAnotacoes = {
        timestamp: new Date().toISOString(),
        anotacoes: anotacoes,
        dados: dados,
        problemas: problemas,
        anotacoesComConteudo: anotacoesComConteudo.length,
        anotacoesSemTemaId: anotacoesSemTemaId.length
    };
    
    console.log('\n💾 Dados salvos em window.diagnosticoAnotacoes');
    console.log('   Para copiar: copy(JSON.stringify(window.diagnosticoAnotacoes, null, 2))');
    console.log('═══════════════════════════════════════════════════════');
    
    return window.diagnosticoAnotacoes;
})();

