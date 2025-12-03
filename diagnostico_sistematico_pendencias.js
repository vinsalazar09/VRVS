// ═══════════════════════════════════════════════════════════════
// DIAGNÓSTICO SISTEMÁTICO - ABA PENDÊNCIAS
// ═══════════════════════════════════════════════════════════════
// Execute este script no console do navegador (MacBook ou iPhone via Safari DevTools)
// Cole todo o código abaixo e pressione Enter

(function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔬 DIAGNÓSTICO SISTEMÁTICO - ABA PENDÊNCIAS');
    console.log('═══════════════════════════════════════════════════════');
    
    // Itens conhecidos que NÃO funcionam
    const itensProblematicos = [
        'Fratura de clavícula',
        'Epifisiolistese',
        'Sd manguito rotador',
        'DDQ',
        'Luxação e Instabilidade do cotovelo',
        'LAC/LEC',
        'Epicondilites',
        'Fraturas do cotovelo'
    ];
    
    // 1. COLETAR DADOS DE TODOS OS ITENS
    console.log('\n📋 FASE 1: COLETANDO DADOS DE TODOS OS ITENS');
    console.log('─────────────────────────────────────────────────────');
    
    const todosItens = Array.from(document.querySelectorAll('.task-theme-item'));
    console.log(`Total de itens encontrados: ${todosItens.length}`);
    
    if (todosItens.length === 0) {
        console.error('❌ NENHUM ITEM ENCONTRADO! Certifique-se de estar na aba Pendências.');
        return;
    }
    
    const dadosItens = todosItens.map((item, index) => {
        const temaNome = item.querySelector('.task-theme-name')?.textContent?.trim() || 'Sem nome';
        const temaId = item.getAttribute('data-tema-id');
        const onclick = item.getAttribute('onclick');
        const priority = item.className.match(/priority-(\d+)/)?.[1] || 'N/A';
        
        // Verificar event listeners (se disponível)
        let listeners = 'N/A';
        try {
            if (typeof getEventListeners === 'function') {
                listeners = getEventListeners(item);
            }
        } catch (e) {
            listeners = 'getEventListeners não disponível';
        }
        
        // Verificar estilos computados
        const styles = window.getComputedStyle(item);
        const touchAction = styles.touchAction;
        const pointerEvents = styles.pointerEvents;
        const webkitTouchCallout = styles.webkitTouchCallout || styles.getPropertyValue('-webkit-touch-callout');
        const userSelect = styles.userSelect || styles.webkitUserSelect;
        
        // Verificar se está expandido
        const isExpanded = item.querySelector('.task-expanded') !== null;
        
        // Verificar elementos filhos
        const filhos = Array.from(item.children).map(child => ({
            tag: child.tagName,
            class: child.className,
            pointerEvents: window.getComputedStyle(child).pointerEvents
        }));
        
        // Verificar se é problemático
        const isProblematico = itensProblematicos.some(nome => temaNome.includes(nome));
        
        return {
            index,
            temaNome,
            temaId,
            tipoId: typeof temaId !== 'undefined' ? (temaId.includes('_') ? 'string_com_underscore' : 'outro') : 'undefined',
            onclick,
            priority,
            isExpanded,
            isProblematico,
            touchAction,
            pointerEvents,
            webkitTouchCallout,
            userSelect,
            filhos,
            listeners,
            // HTML completo para comparação
            html: item.outerHTML.substring(0, 200) + '...'
        };
    });
    
    // 2. SEPARAR ITENS QUE FUNCIONAM VS NÃO FUNCIONAM
    console.log('\n📊 FASE 2: SEPARANDO ITENS QUE FUNCIONAM VS NÃO FUNCIONAM');
    console.log('─────────────────────────────────────────────────────');
    
    const problematicos = dadosItens.filter(item => item.isProblematico);
    const funcionando = dadosItens.filter(item => !item.isProblematico);
    
    console.log(`\n🔴 ITENS PROBLEMÁTICOS (${problematicos.length}):`);
    problematicos.forEach(item => {
        console.log(`  - ${item.temaNome} | ID: ${item.temaId} | Tipo: ${item.tipoId}`);
    });
    
    console.log(`\n🟢 ITENS QUE FUNCIONAM (${funcionando.length}):`);
    funcionando.slice(0, 5).forEach(item => { // Mostrar apenas 5 primeiros
        console.log(`  - ${item.temaNome} | ID: ${item.temaId} | Tipo: ${item.tipoId}`);
    });
    if (funcionando.length > 5) {
        console.log(`  ... e mais ${funcionando.length - 5} itens`);
    }
    
    // 3. COMPARAR CARACTERÍSTICAS
    console.log('\n🔍 FASE 3: COMPARANDO CARACTERÍSTICAS');
    console.log('─────────────────────────────────────────────────────');
    
    // Comparar tipos de ID
    const tiposIdProblematicos = problematicos.map(p => p.tipoId);
    const tiposIdFuncionando = funcionando.map(f => f.tipoId);
    
    console.log('\n📌 TIPOS DE ID:');
    console.log('  Problemáticos:', [...new Set(tiposIdProblematicos)]);
    console.log('  Funcionando:', [...new Set(tiposIdFuncionando)]);
    
    // Comparar atributo onclick
    const comOnclickProblematicos = problematicos.filter(p => p.onclick).length;
    const comOnclickFuncionando = funcionando.filter(f => f.onclick).length;
    
    console.log('\n📌 ATRIBUTO onclick:');
    console.log(`  Problemáticos com onclick: ${comOnclickProblematicos}/${problematicos.length}`);
    console.log(`  Funcionando com onclick: ${comOnclickFuncionando}/${funcionando.length}`);
    
    // Comparar CSS
    const touchActionsProblematicos = [...new Set(problematicos.map(p => p.touchAction))];
    const touchActionsFuncionando = [...new Set(funcionando.map(f => f.touchAction))];
    
    console.log('\n📌 CSS touch-action:');
    console.log('  Problemáticos:', touchActionsProblematicos);
    console.log('  Funcionando:', touchActionsFuncionando);
    
    const pointerEventsProblematicos = [...new Set(problematicos.map(p => p.pointerEvents))];
    const pointerEventsFuncionando = [...new Set(funcionando.map(f => f.pointerEvents))];
    
    console.log('\n📌 CSS pointer-events:');
    console.log('  Problemáticos:', pointerEventsProblematicos);
    console.log('  Funcionando:', pointerEventsFuncionando);
    
    // Comparar estrutura de filhos
    const numFilhosProblematicos = problematicos.map(p => p.filhos.length);
    const numFilhosFuncionando = funcionando.map(f => f.filhos.length);
    
    console.log('\n📌 NÚMERO DE FILHOS:');
    console.log(`  Problemáticos: média ${(numFilhosProblematicos.reduce((a,b) => a+b, 0) / numFilhosProblematicos.length).toFixed(1)} filhos`);
    console.log(`  Funcionando: média ${(numFilhosFuncionando.reduce((a,b) => a+b, 0) / numFilhosFuncionando.length).toFixed(1)} filhos`);
    
    // 4. VERIFICAR DADOS DO LOCALSTORAGE
    console.log('\n💾 FASE 4: VERIFICANDO DADOS DO LOCALSTORAGE');
    console.log('─────────────────────────────────────────────────────');
    
    try {
        const dados = JSON.parse(localStorage.getItem('vrvs_dados') || '[]');
        console.log(`Total de temas no localStorage: ${dados.length}`);
        
        const dadosProblematicos = dados.filter(t => {
            const nome = String(t.tema || '').trim();
            return itensProblematicos.some(problema => nome.includes(problema));
        });
        
        console.log(`\n🔴 Temas problemáticos no localStorage (${dadosProblematicos.length}):`);
        dadosProblematicos.forEach(t => {
            console.log(`  - ${t.tema} | ID: ${t.id} | Tipo ID: ${typeof t.id} | ID contém _: ${String(t.id).includes('_')}`);
        });
        
        // Comparar IDs do localStorage com IDs dos elementos
        console.log('\n📌 COMPARAÇÃO IDs (localStorage vs HTML):');
        problematicos.forEach(itemHtml => {
            const dadoLocalStorage = dados.find(d => String(d.id) === itemHtml.temaId);
            if (dadoLocalStorage) {
                console.log(`  ✅ ${itemHtml.temaNome}: ID HTML (${itemHtml.temaId}) === ID localStorage (${dadoLocalStorage.id})`);
            } else {
                console.log(`  ❌ ${itemHtml.temaNome}: ID HTML (${itemHtml.temaId}) NÃO encontrado no localStorage!`);
            }
        });
        
    } catch (e) {
        console.error('Erro ao ler localStorage:', e);
    }
    
    // 5. TESTAR EVENT LISTENERS
    console.log('\n🎯 FASE 5: TESTANDO EVENT LISTENERS');
    console.log('─────────────────────────────────────────────────────');
    
    const container = document.getElementById('pendenciasContainer');
    if (container) {
        console.log('Container encontrado:', container.id);
        
        // Verificar se há listeners no container
        try {
            if (typeof getEventListeners === 'function') {
                const containerListeners = getEventListeners(container);
                console.log('Listeners no container:', Object.keys(containerListeners));
            } else {
                console.log('getEventListeners não disponível - não é possível verificar listeners programaticamente');
            }
        } catch (e) {
            console.log('Erro ao verificar listeners:', e.message);
        }
    } else {
        console.error('❌ Container pendenciasContainer não encontrado!');
    }
    
    // 6. RESUMO E RECOMENDAÇÕES
    console.log('\n📋 RESUMO E ANÁLISE');
    console.log('═══════════════════════════════════════════════════════');
    
    const diferencasEncontradas = [];
    
    // Verificar diferença em tipos de ID
    const tiposUnicosProblematicos = [...new Set(tiposIdProblematicos)];
    const tiposUnicosFuncionando = [...new Set(tiposIdFuncionando)];
    if (JSON.stringify(tiposUnicosProblematicos.sort()) !== JSON.stringify(tiposUnicosFuncionando.sort())) {
        diferencasEncontradas.push('TIPOS DE ID DIFERENTES entre itens problemáticos e funcionando');
    }
    
    // Verificar diferença em onclick
    if (comOnclickProblematicos !== comOnclickFuncionando) {
        diferencasEncontradas.push('ATRIBUTO onclick presente em quantidades diferentes');
    }
    
    // Verificar diferença em CSS
    if (JSON.stringify(touchActionsProblematicos.sort()) !== JSON.stringify(touchActionsFuncionando.sort())) {
        diferencasEncontradas.push('CSS touch-action diferente');
    }
    
    if (diferencasEncontradas.length > 0) {
        console.log('\n⚠️ DIFERENÇAS ENCONTRADAS:');
        diferencasEncontradas.forEach(diff => console.log(`  - ${diff}`));
    } else {
        console.log('\n✅ NENHUMA DIFERENÇA ÓBVIA ENCONTRADA');
        console.log('   Pode ser necessário inspecionar HTML gerado manualmente');
    }
    
    // 7. EXPORTAR DADOS PARA ANÁLISE
    console.log('\n💾 EXPORTANDO DADOS PARA ANÁLISE');
    console.log('─────────────────────────────────────────────────────');
    
    const dadosExport = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        totalItens: todosItens.length,
        problematicos: problematicos.length,
        funcionando: funcionando.length,
        dadosItens: dadosItens,
        resumo: {
            tiposIdProblematicos: tiposUnicosProblematicos,
            tiposIdFuncionando: tiposUnicosFuncionando,
            diferencasEncontradas: diferencasEncontradas
        }
    };
    
    console.log('\n📥 Para copiar os dados completos, execute:');
    console.log('copy(JSON.stringify(dadosExport, null, 2))');
    console.log('\nOu veja o objeto "dadosExport" no console.');
    
    // Criar variável global para inspeção
    window.diagnosticoPendencias = dadosExport;
    
    console.log('\n✅ Diagnóstico completo! Dados salvos em window.diagnosticoPendencias');
    console.log('═══════════════════════════════════════════════════════');
    
    return dadosExport;
})();

