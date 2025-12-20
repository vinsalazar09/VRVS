/**
 * Scripts de Backup/Restauração do Diário VRVS 3P
 * Executar no console do navegador (F12)
 */

// ==================== EXPORTAR DIÁRIO ====================

function exportarDiario() {
    const diario = window.diario || { entradas: [] };
    const json = JSON.stringify(diario, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diario_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('✅ Diário exportado!');
    return json;
}

// ==================== IMPORTAR DIÁRIO ====================

function importarDiario(jsonString) {
    try {
        const diario = JSON.parse(jsonString);
        if (!diario.entradas || !Array.isArray(diario.entradas)) {
            throw new Error('Formato inválido: entradas deve ser um array');
        }
        window.diario = diario;
        salvarDiario();
        renderDiario();
        atualizarChipVrvs3p();
        console.log('✅ Diário importado!');
        console.log(`  Total de entradas: ${diario.entradas.length}`);
        return true;
    } catch (e) {
        console.error('❌ Erro ao importar:', e);
        return false;
    }
}

// ==================== VALIDAÇÃO RÁPIDA ====================

function validarDiarioRapido() {
    if (!window.diario || !window.diario.entradas) {
        console.log('❌ Diário não carregado');
        return false;
    }
    
    const entradas = window.diario.entradas;
    const problemas = [];
    
    entradas.forEach((e, i) => {
        if (e.srs && e.srs.ativo) {
            if (!e.srs.proximaRevisao) {
                problemas.push(`Entrada ${i}: SRS ativo sem proximaRevisao`);
            }
            if (e.srs.estagio < 0 || e.srs.estagio > 10) {
                problemas.push(`Entrada ${i}: Estágio inválido: ${e.srs.estagio}`);
            }
        }
    });
    
    if (problemas.length > 0) {
        console.warn(`⚠️ ${problemas.length} problemas encontrados:`);
        problemas.forEach(p => console.warn(`  - ${p}`));
        return false;
    }
    
    console.log('✅ Diário válido!');
    return true;
}

// ==================== USO ====================

/*
// EXPORTAR:
exportarDiario(); // Baixa arquivo JSON

// IMPORTAR (cuidado: sobrescreve dados atuais):
const jsonString = `...`; // Colar conteúdo do arquivo JSON
importarDiario(jsonString);

// VALIDAR:
validarDiarioRapido();
*/

