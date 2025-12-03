// ═══════════════════════════════════════════════════════════════
// RECUPERAÇÃO DE EMERGÊNCIA - ANOTAÇÕES DO CSV
// ═══════════════════════════════════════════════════════════════
// Execute este script no console do navegador APÓS importar o CSV
// Ele vai tentar recuperar as anotações mesmo se a importação falhou

(function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚨 RECUPERAÇÃO DE EMERGÊNCIA - ANOTAÇÕES');
    console.log('═══════════════════════════════════════════════════════');
    
    // 1. Verificar anotações atuais
    let anotacoes = JSON.parse(localStorage.getItem('vrvs_anotacoes') || '[]');
    const dados = JSON.parse(localStorage.getItem('vrvs_dados') || '[]');
    
    console.log(`\n📋 Anotações atuais: ${anotacoes.length}`);
    console.log(`📊 Temas disponíveis: ${dados.length}`);
    
    // 2. Pedir para usuário colar conteúdo do CSV
    const csv = prompt('Cole aqui o CONTEÚDO COMPLETO do CSV de anotações:');
    
    if (!csv || csv.trim() === '') {
        console.log('❌ CSV vazio! Operação cancelada.');
        return;
    }
    
    // 3. Parse manual do CSV
    function parseCSVManual(text) {
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) {
            throw new Error('CSV inválido - menos de 2 linhas');
        }
        
        // Parse headers
        const headers = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < lines[0].length; i++) {
            const ch = lines[0][i];
            if (ch === '"') {
                if (inQuotes && lines[0][i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === ',' && !inQuotes) {
                headers.push(current.trim().replace(/^"|"$/g, ''));
                current = '';
            } else {
                current += ch;
            }
        }
        headers.push(current.trim().replace(/^"|"$/g, ''));
        
        // Parse rows
        const rows = [];
        for (let lineIdx = 1; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];
            const values = [];
            current = '';
            inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') {
                    if (inQuotes && line[i + 1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (ch === ',' && !inQuotes) {
                    values.push(current.trim().replace(/^"|"$/g, ''));
                    current = '';
                } else {
                    current += ch;
                }
            }
            values.push(current.trim().replace(/^"|"$/g, ''));
            rows.push(values);
        }
        
        return { headers, rows };
    }
    
    try {
        const { headers, rows } = parseCSVManual(csv);
        console.log(`\n✅ CSV parseado: ${headers.length} colunas, ${rows.length} linhas`);
        console.log('Headers:', headers);
        
        // 4. Mapear campos
        const headersLower = headers.map(h => h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ''));
        
        const getIdx = (...nomes) => {
            for (const nome of nomes) {
                const idx = headersLower.findIndex(h => h.includes(nome.toLowerCase()));
                if (idx >= 0) return idx;
            }
            return -1;
        };
        
        const idxId = getIdx('id');
        const idxTemaId = getIdx('temaid', 'tema_id');
        const idxArea = getIdx('area', 'topico');
        const idxTema = getIdx('tema', 'assunto', 'titulo');
        const idxConteudo = getIdx('conteudo', 'conteúdo', 'texto', 'anotacao', 'anotação');
        const idxData = getIdx('ultimaatualizacao', 'ultima_atualizacao', 'data');
        
        console.log('\n📌 Mapeamento de campos:');
        console.log(`  id: coluna ${idxId >= 0 ? idxId + 1 : 'NÃO ENCONTRADA'}`);
        console.log(`  temaId: coluna ${idxTemaId >= 0 ? idxTemaId + 1 : 'NÃO ENCONTRADA'}`);
        console.log(`  area: coluna ${idxArea >= 0 ? idxArea + 1 : 'NÃO ENCONTRADA'}`);
        console.log(`  tema: coluna ${idxTema >= 0 ? idxTema + 1 : 'NÃO ENCONTRADA'}`);
        console.log(`  conteudo: coluna ${idxConteudo >= 0 ? idxConteudo + 1 : 'NÃO ENCONTRADA'}`);
        console.log(`  data: coluna ${idxData >= 0 ? idxData + 1 : 'NÃO ENCONTRADA'}`);
        
        // 5. Processar linhas
        const anotacoesRecuperadas = [];
        let sucesso = 0;
        let erro = 0;
        
        rows.forEach((row, i) => {
            try {
                const anotacao = {
                    id: idxId >= 0 ? row[idxId] : Date.now() + i,
                    temaId: idxTemaId >= 0 ? String(row[idxTemaId] || '') : '',
                    area: idxArea >= 0 ? row[idxArea] : '',
                    tema: idxTema >= 0 ? row[idxTema] : '',
                    conteudo: idxConteudo >= 0 ? row[idxConteudo] : '',
                    ultimaAtualizacao: idxData >= 0 ? row[idxData] : new Date().toISOString().split('T')[0]
                };
                
                // Se temaId está vazio, tentar encontrar pelo nome do tema
                if (!anotacao.temaId || anotacao.temaId.trim() === '') {
                    if (anotacao.tema) {
                        const tema = dados.find(t => String(t.tema).trim() === String(anotacao.tema).trim());
                        if (tema) {
                            anotacao.temaId = String(tema.id);
                            console.log(`  ✅ temaId encontrado para "${anotacao.tema}": ${anotacao.temaId}`);
                        } else {
                            console.warn(`  ⚠️  Não encontrado temaId para "${anotacao.tema}"`);
                        }
                    }
                }
                
                // Só adicionar se tem conteúdo ou temaId válido
                if ((anotacao.conteudo && anotacao.conteudo.trim().length > 0) || (anotacao.temaId && anotacao.temaId.trim() !== '')) {
                    anotacoesRecuperadas.push(anotacao);
                    sucesso++;
                } else {
                    erro++;
                }
            } catch (e) {
                console.error(`Erro na linha ${i + 2}:`, e);
                erro++;
            }
        });
        
        console.log(`\n✅ ${sucesso} anotações recuperadas`);
        console.log(`❌ ${erro} linhas com erro ou vazias`);
        
        // 6. Salvar
        if (anotacoesRecuperadas.length > 0) {
            // Mesclar com anotações existentes (evitar duplicatas)
            anotacoesRecuperadas.forEach(nova => {
                const existente = anotacoes.find(a => String(a.temaId) === String(nova.temaId));
                if (existente) {
                    // Atualizar existente se nova tem conteúdo
                    if (nova.conteudo && nova.conteudo.trim().length > 0) {
                        existente.conteudo = nova.conteudo;
                        existente.ultimaAtualizacao = nova.ultimaAtualizacao;
                        console.log(`  Atualizada anotação para temaId ${nova.temaId}`);
                    }
                } else {
                    anotacoes.push(nova);
                    console.log(`  Adicionada nova anotação para temaId ${nova.temaId}`);
                }
            });
            
            localStorage.setItem('vrvs_anotacoes', JSON.stringify(anotacoes));
            console.log(`\n💾 ${anotacoes.length} anotações salvas no localStorage!`);
            console.log('✅ Recuperação concluída! Recarregue a página para ver as anotações.');
        } else {
            console.log('\n❌ Nenhuma anotação válida encontrada para recuperar');
        }
        
    } catch (e) {
        console.error('❌ Erro ao processar CSV:', e);
        alert('Erro ao processar CSV: ' + e.message);
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
})();

