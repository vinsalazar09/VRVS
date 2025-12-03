// ═══════════════════════════════════════════════════════════════
// VERIFICAR ANOTAÇÕES SALVAS NO LOCALSTORAGE
// Execute no console do navegador
// ═══════════════════════════════════════════════════════════════

(function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 VERIFICANDO ANOTAÇÕES SALVAS');
    console.log('═══════════════════════════════════════════════════════');
    
    const anotacoes = JSON.parse(localStorage.getItem('vrvs_anotacoes') || '[]');
    const dados = JSON.parse(localStorage.getItem('vrvs_dados') || '[]');
    
    console.log(`\nTotal de anotações: ${anotacoes.length}`);
    console.log(`Total de temas: ${dados.length}`);
    
    const anotacoesComConteudo = anotacoes.filter(a => (a.conteudo || '').trim().length > 0);
    console.log(`Anotações com conteúdo: ${anotacoesComConteudo.length}`);
    
    console.log('\n📝 ANOTAÇÕES COM CONTEÚDO:');
    anotacoesComConteudo.forEach((a, i) => {
        const tema = dados.find(t => String(t.id) === String(a.temaId));
        console.log(`\n${i + 1}. ${a.tema || tema?.tema || 'SEM TEMA'}`);
        console.log(`   temaId: ${a.temaId}`);
        console.log(`   Área: ${a.area || tema?.area || 'N/A'}`);
        console.log(`   Conteúdo (primeiros 100 chars): ${(a.conteudo || '').substring(0, 100)}...`);
        console.log(`   Tamanho do conteúdo: ${(a.conteudo || '').length} caracteres`);
        
        // Verificar se tema existe
        if (!tema) {
            console.warn(`   ⚠️ TEMA NÃO ENCONTRADO para temaId ${a.temaId}`);
        }
    });
    
    // Verificar problemas
    console.log('\n🔍 VERIFICANDO PROBLEMAS:');
    
    const problemas = [];
    anotacoesComConteudo.forEach(a => {
        const tema = dados.find(t => String(t.id) === String(a.temaId));
        if (!tema) {
            problemas.push(`Anotação "${a.tema}" tem temaId ${a.temaId} que não existe em dados`);
        }
        if (!a.area || !a.tema) {
            problemas.push(`Anotação temaId ${a.temaId} está sem área ou tema`);
        }
        if (a.conteudo.includes('\\n') || a.conteudo.includes('\\r')) {
            problemas.push(`Anotação "${a.tema}" tem quebras de linha escapadas`);
        }
    });
    
    if (problemas.length > 0) {
        console.log('\n⚠️ PROBLEMAS ENCONTRADOS:');
        problemas.forEach(p => console.log(`  - ${p}`));
    } else {
        console.log('\n✅ Nenhum problema encontrado!');
    }
    
    // Exportar para análise
    window.anotacoesVerificadas = {
        total: anotacoes.length,
        comConteudo: anotacoesComConteudo.length,
        anotacoes: anotacoesComConteudo,
        problemas: problemas
    };
    
    console.log('\n💾 Dados salvos em window.anotacoesVerificadas');
    console.log('═══════════════════════════════════════════════════════');
})();

