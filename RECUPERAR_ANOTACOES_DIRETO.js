// ═══════════════════════════════════════════════════════════════
// RECUPERAÇÃO DIRETA - EXECUTE NO CONSOLE DO NAVEGADOR NO APP
// ═══════════════════════════════════════════════════════════════
// Cole este código NO CONSOLE do navegador quando estiver no app VRVS

(function() {
    console.log('🚨 RECUPERANDO ANOTAÇÕES DO CSV...');
    
    // CSV que você anexou
    const csv = `id,temaId,area,tema,conteudo,ultimaAtualizacao,observacoes,sugestao
1762463481961,1762044621730,Trauma MMSS,Fratura de Úmero proximal,"HOT TOPICS 🔥 
1) Epidemiologia 
2) Mecanismos de trauma e padrões da fratura
3) Classificação Neer e AO
4) Critérios de Hertel",2025-11-22,,
1762821455592,1762813819589,Trauma Ped,Fratura de Condilos,"Hot Topics 🔥

CÔNDILOS
1) Complicações da fratura do côndilo lateral 

2) Classificação de Jakob e tratamento

LUXAÇÃO 
1) Fratura e lesão mais associada na luxação do cotovelo

2) Desvios na luxação do cotovelo

EPICÔNDILOS 
1) Epidemiologia",2025-11-21,,
1762954899298,1762906440957,Trauma Ped,Fraturas do antebraço,Hiperpronação = Monteggia ou Galeazzi,2025-11-18,,
1763402721978,1763402713142,Trauma MMII,Fratura de ossos da perna,"Hot topics 🔥 

1) Lesões associadas

2) Desvios aceitáveis 

3) Complicações e diferenças de cada tipo de acesso: infra x supra patelar

4) Ponto de entrada da hastes e seus desvios 

 5) vantagens e desvantagens da HIM fresada.",2025-11-17,,
1763423352500,1763422448208,Oncologia,Introdução aos Tumores,"Tumores que apresentam células gigantes 
(1) TGC
(2) Condroblastoma
(3) COA
(4) Osteossarcoma Telangectásico
(5) TU Paget
(6) TU Marrom

Tumores Radiossensiveis = TU Pequenas cels azuis
(2) Ewing
(3) Linfoma 
(4) Granuloma Eosinofílico
(5) Mieloma 
(6) Carcinomas metastáticos",2025-11-18,,
1763503973804,1763501176586,Coluna,Espondilolistese,"Hot Topics 🔥 
1) Classificação de Wiltze
2) Características de cada tipo
3) Técnica de Gill",2025-11-19,,
1763673272333,1763669330752,Ciencias Basicas,Osteomielite,"Na dúvida: Chuta Pseudomonas, marca tipo 4 de roberts(sarcoma de Ewing) ou tipo 5(Condroblastoma) 😂

HOT TOPICS 🔥 🥵
1) Correlacionar agentes etiológicos com o tipo de infecção(forma de contaminação ou perfil do paciente), ex: usuário de drogas, anemia falciforme…

2) Correlacionar classificação de Gledhill-Roberts com Dx Diferenciais 

3) Diferenças entre osteomielite de coluna e Discite

4) Espondilodiscite tem que saber epidemiologia e fisiopatologia",2025-12-02,,
1763849465874,1763845574661,Trauma Ped,Fraturas da Tíbia,"HOT TOPICS 🔥
TÍBIA PROXIMAL(metáfise)
1) Epidemiologia
 • Idade = 3-6 anos
 • Mecanismo de trauma =  Trauma lateral com Joelho em EXT + Valgo

Fratura fisária 
 • Fgmto TH posterior = trauma hiper flexão-> reduz em EXT
 • Fgmto TH anterior = trauma hiper extensão -> reduz em FL

FRATURA DA TAT
 1) Epidemiologia
 • Mais comum em meninos um pouco mais velhos(13-16 anos)
 • Mecanismo: contração brusca do quadríceps -> EXT forçada contra resistência(salto com impulsão violenta)

2) Correlação entre as classificações de SH e Watson Jones
 • Fratura da TAT com envolvimento articular e lesão do centro de ossificação primário = tipo 3 de Watson Jones

FRATURA DA ESPINHA
 1) Mecanismo de trauma: VALGO ou HIPER EXT + Rotação LATERAL do joelho

2) Classificação de Meyrs e McKeever
 Tipo 1 -> conservador 
 Tipo 2 -> tendência a tto conservador 
 Tipo 3 -> tendência a tto cirúrgico 
 Tipo 4 -> cirúrgico 

COMPLICAÇÕES  GERAIS 
(1) Fêmur distal = Valgo
(2) Tíbia proximal = Valgo(Cozen)
   • melhora espontaneamente após 4 anos da lesão(tto conservador)
   • interposição da pata de ganso
(3) Tíbia diáfise = Varo
(4) Espinha da tíbia = Perda da extensão 
(5) TAT = Recurvato",2025-12-01,,
1763849465874,1763845611548,Trauma Ped,Fraturas do fêmur,"HOT TOPICS 🔥 
 • De uma maneira geral os números são altos:
  - joelho flutuante a incidência de fraturas expostas chega a 60%
  - incidência de fraturas diafisarias chega a 70 %

Fêmur Distal
1) Principal lesão associada: LCA

Fêmur diáfise 
1) Tratamento(tipos e indicações)
2) Desvantagens da haste com entrada pela fossa do piriforme: (1) fise aberta, (2)risco de fratura do colo e osteonecrose

Fêmur Proximal
1) Classificação de DELBET e COLONNA: mais comum e mais grave",2025-11-30,,
1763999701838,1763941123114,Trauma Ped,fraturas da Bacia,"HOT TOPICS 🔥 
1) Classificação de Torode e Zieg
  - fratura dos ramos púbicos bilateral = tipo 4a
 - Anel pélvico Anterior é 3A",2025-11-30,,
1764074226771,1764030788290,Joelho,Osteocondrite dissecante e Lesões condrais,"HOT TOPICS 🔥 
Osteocondrite dissecante 
1) Epidemiologia 
2) Localização 
3) Osteocondrite da patela: prognóstico e localização 

Lesões condrais 
1) Tipos de tratamento",2025-11-25,,
1764118688167,1764075917874,Joelho,Menisco,"HOT TOPICS 🔥

1) Lesão em RAMPA
 • Impacto posteromedial na tíbia e no fêmur.
 • Mais comum",2025-11-29,,
1764363615850,1764363603942,Joelho,Lesões do LCA,"HOT TOPICS 🔥

1) Diferenças(vantagens e desvantagens) entre cada tipo de enxerto",2025-11-30,,
1764533467862,1764528772802,Joelho,ATJ e Gonartrose,"HOT TOPICS 🔥

ATJ
1) Infecção

2) A CONTRAINDICAÇÃO ABSOLUTA QUE ELES QUEREM: 
  -> DISFUNÇÃO DO MECANISMO EXTENSOR.

UNICOMPARTIMENTAL
7 Contraindicações 

 OSTEOTOMIAS
6 Contraindicações",2025-12-01,,`;

    // Parse CSV manual
    const lines = csv.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',');
    
    // Encontrar índices
    const idxId = headers.indexOf('id');
    const idxTemaId = headers.indexOf('temaId');
    const idxArea = headers.indexOf('area');
    const idxTema = headers.indexOf('tema');
    const idxConteudo = headers.indexOf('conteudo');
    const idxData = headers.indexOf('ultimaAtualizacao');
    
    console.log('Headers encontrados:', headers);
    console.log('Índices:', { idxId, idxTemaId, idxArea, idxTema, idxConteudo, idxData });
    
    // Parse rows (maneira simples para CSV com aspas)
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const ch = line[j];
            if (ch === '"') {
                if (inQuotes && line[j + 1] === '"') {
                    current += '"';
                    j++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += ch;
            }
        }
        values.push(current.trim());
        rows.push(values);
    }
    
    console.log(`Parseadas ${rows.length} linhas`);
    
    // Carregar dados existentes
    const dados = JSON.parse(localStorage.getItem('vrvs_dados') || '[]');
    let anotacoes = JSON.parse(localStorage.getItem('vrvs_anotacoes') || '[]');
    
    console.log(`Temas disponíveis: ${dados.length}`);
    console.log(`Anotações atuais: ${anotacoes.length}`);
    
    // Processar cada linha
    let recuperadas = 0;
    rows.forEach((row, i) => {
        try {
            const anotacao = {
                id: row[idxId] || Date.now() + i,
                temaId: String(row[idxTemaId] || ''),
                area: row[idxArea] || '',
                tema: row[idxTema] || '',
                conteudo: row[idxConteudo] || '',
                ultimaAtualizacao: row[idxData] || new Date().toISOString().split('T')[0]
            };
            
            // Remover aspas do conteúdo se houver
            if (anotacao.conteudo.startsWith('"') && anotacao.conteudo.endsWith('"')) {
                anotacao.conteudo = anotacao.conteudo.slice(1, -1);
            }
            
            // Verificar se temaId existe nos dados
            if (anotacao.temaId && anotacao.temaId.trim() !== '') {
                const temaExiste = dados.find(t => String(t.id) === anotacao.temaId);
                if (!temaExiste) {
                    console.warn(`⚠️ temaId ${anotacao.temaId} não encontrado em dados para "${anotacao.tema}"`);
                    // Tentar encontrar pelo nome
                    const temaPorNome = dados.find(t => String(t.tema).trim() === String(anotacao.tema).trim());
                    if (temaPorNome) {
                        anotacao.temaId = String(temaPorNome.id);
                        console.log(`✅ temaId encontrado pelo nome: ${anotacao.temaId}`);
                    }
                }
            } else if (anotacao.tema) {
                // Se não tem temaId, tentar encontrar pelo nome
                const temaPorNome = dados.find(t => String(t.tema).trim() === String(anotacao.tema).trim());
                if (temaPorNome) {
                    anotacao.temaId = String(temaPorNome.id);
                    console.log(`✅ temaId encontrado pelo nome: ${anotacao.temaId}`);
                }
            }
            
            // Só adicionar se tem conteúdo OU temaId válido
            if ((anotacao.conteudo && anotacao.conteudo.trim().length > 0) || (anotacao.temaId && anotacao.temaId.trim() !== '')) {
                // Verificar se já existe
                const existente = anotacoes.find(a => String(a.temaId) === String(anotacao.temaId) && anotacao.temaId);
                if (existente) {
                    // Atualizar se tem conteúdo
                    if (anotacao.conteudo && anotacao.conteudo.trim().length > 0) {
                        existente.conteudo = anotacao.conteudo;
                        existente.ultimaAtualizacao = anotacao.ultimaAtualizacao;
                        console.log(`📝 Atualizada: ${anotacao.tema}`);
                    }
                } else {
                    anotacoes.push(anotacao);
                    console.log(`➕ Adicionada: ${anotacao.tema}`);
                }
                recuperadas++;
            }
        } catch (e) {
            console.error(`Erro na linha ${i + 2}:`, e);
        }
    });
    
    // Salvar
    localStorage.setItem('vrvs_anotacoes', JSON.stringify(anotacoes));
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`✅ ${recuperadas} anotações processadas!`);
    console.log(`💾 Total de anotações salvas: ${anotacoes.length}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔄 RECARREGUE A PÁGINA AGORA para ver as anotações!');
    
    alert(`✅ ${recuperadas} anotações recuperadas!\n\nRecarregue a página para ver.`);
})();

