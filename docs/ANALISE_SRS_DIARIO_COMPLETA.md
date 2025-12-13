# 🔍 ANÁLISE COMPLETA: IMPLEMENTAÇÃO SRS NO DIÁRIO

**Data:** 13 de Dezembro de 2025  
**Analista:** Cursor (Especialista Técnico VRVS)  
**Status:** ✅ ANÁLISE COMPLETA - PRONTA PARA VALIDAÇÃO

---

## ✅ ENTENDI COMPLETAMENTE

### O que está sendo pedido:

1. **Adicionar sistema SRS (Spaced Repetition System) ao Diário**
   - Campo `srs` opcional em cada entrada
   - Dois modos de sessão: `programado` (FSRS) e `livre` (treino)
   - Três botões de qualidade: Esqueci, Lembrei, Fácil
   - Nova aba "Sessão" no Diário (além da "Lista" existente)

2. **Estrutura de dados:**
   - `srs.ativo` (boolean)
   - `srs.proximaRevisao` (string "YYYY-MM-DD")
   - `srs.repeticoes` (number)
   - `srs.ultimaResposta` (string: "esqueci" | "lembrei" | "facil" | null)

3. **Lógica de agendamento:**
   - Esqueci → repeticoes = 0, proximaRevisao = amanhã
   - Lembrei → repeticoes += 1, escala de dias (1, 1, 3, 7, 14, 30)
   - Fácil → repeticoes += 2, mesma escala

4. **Integração com Tarefas:**
   - Mostrar contagem de cards programados para hoje
   - Botão para abrir sessão do Diário filtrada por tema

---

## 📋 ANÁLISE TÉCNICA DO CÓDIGO ATUAL

### ✅ O QUE JÁ EXISTE E FUNCIONA:

1. **Estrutura do Diário:**
   - ✅ `window.diario.entradas[]` - Array de entradas
   - ✅ `carregarDiario()` - Carrega do localStorage
   - ✅ `salvarDiario()` - Salva no localStorage
   - ✅ `salvarEntradaDiario()` - Cria/edita entradas
   - ✅ `renderDiario()` - Renderiza lista
   - ✅ `modoDiario` - 'recall' ou 'respostas' (já existe!)

2. **Filtros existentes:**
   - ✅ `filtroDiarioVista` - Por Data / Por Tema
   - ✅ `filtroDiarioArea` - Filtro por área
   - ✅ `filtroDiarioData` - Filtro por data
   - ❌ `filtroDiarioTema` - **NÃO EXISTE** (precisa adaptar ou adicionar)

3. **Funções de navegação:**
   - ✅ `showSection('diario')` - Navega para aba Diário (linha 5483)
   - ✅ `navegarParaEntradaDiario(entradaId)` - Navega para entrada específica (linha 3536)

4. **Funções de data:**
   - ✅ `formatarDataBR(data)` - Formata data (linha 3068)
   - ✅ `formatarData(dataStr)` - Formata data (linha 3077)
   - ⚠️ `hojeStr()` - **NÃO EXISTE** (precisa criar)
   - ⚠️ `addDias(dateStr, dias)` - **NÃO EXISTE** (precisa criar)

5. **Importação/Exportação CSV:**
   - ✅ `parseCSVDiario(file)` - Parse CSV (linha 5134)
   - ✅ `exportarDiarioCSV()` - Exporta CSV (mencionado linha 2605)
   - ⚠️ Precisa atualizar para incluir campo `srs`

---

## ⚠️ RISCOS IDENTIFICADOS

### 🔴 RISCOS CRÍTICOS:

1. **Conflito de nomes de variáveis:**
   - **RISCO:** `modoDiario` já existe (recall/respostas)
   - **SOLUÇÃO:** Usar `modoSessaoDiario` para sessão (programado/livre)
   - **IMPACTO:** Alto - pode causar confusão se não separar claramente

2. **Filtro de tema não existe:**
   - **RISCO:** Documento menciona `filtroDiarioTema` que não existe
   - **SOLUÇÃO:** Adaptar funções para usar apenas `filtroDiarioArea` OU adicionar filtro de tema
   - **IMPACTO:** Médio - funcionalidade pode ficar limitada

3. **Inicialização de dados existentes:**
   - **RISCO:** Entradas antigas sem `srs` podem quebrar código
   - **SOLUÇÃO:** `inicializarSrsEntrada()` garante compatibilidade
   - **IMPACTO:** Alto - precisa garantir que funciona com dados antigos

4. **Parse CSV não inclui campo srs:**
   - **RISCO:** Importação pode perder dados SRS
   - **SOLUÇÃO:** Atualizar `parseCSVDiario()` para incluir campo `srs`
   - **IMPACTO:** Médio - dados podem ser perdidos na importação

5. **Export CSV não inclui campo srs:**
   - **RISCO:** Exportação pode não incluir dados SRS
   - **SOLUÇÃO:** Atualizar `exportarDiarioCSV()` para incluir campo `srs`
   - **IMPACTO:** Médio - backup pode estar incompleto

### 🟡 RISCOS MÉDIOS:

6. **Renderização de lista vs sessão:**
   - **RISCO:** `renderDiario()` pode interferir com sessão
   - **SOLUÇÃO:** Separar wrappers (`diarioListaWrapper` vs `diarioSessaoWrapper`)
   - **IMPACTO:** Médio - pode causar conflitos de renderização

7. **Mobile (iPhone Safari):**
   - **RISCO:** Nova UI pode não funcionar bem no mobile
   - **SOLUÇÃO:** Seguir padrões de organização visual estabelecidos
   - **IMPACTO:** Médio - precisa testar especificamente

8. **Performance com muitas entradas:**
   - **RISCO:** Filtrar todas as entradas pode ser lento
   - **SOLUÇÃO:** Filtros já existem, lógica é similar
   - **IMPACTO:** Baixo - código atual já faz isso

### 🟢 RISCOS BAIXOS:

9. **CSS adicional:**
   - **RISCO:** Novos estilos podem conflitar
   - **SOLUÇÃO:** Usar prefixo `.diario-sessao-*` para evitar conflitos
   - **IMPACTO:** Baixo - fácil de corrigir

10. **Navegação entre abas:**
    - **RISCO:** `showSection('diario')` pode não preservar aba ativa
    - **SOLUÇÃO:** Verificar se precisa ajustar `showSection()`
    - **IMPACTO:** Baixo - pode precisar pequeno ajuste

---

## ✅ VALIDAÇÃO DE VIABILIDADE

### ✅ É VIÁVEL? SIM

**Motivos:**
1. ✅ Estrutura de dados permite adicionar campo `srs` sem quebrar
2. ✅ Funções de inicialização garantem compatibilidade com dados antigos
3. ✅ Lógica de agendamento é simples e direta
4. ✅ UI pode ser adicionada sem modificar código existente
5. ✅ Integração com Tarefas é possível (já existe `buscarContextoTema`)

### ⚠️ LIMITAÇÕES IDENTIFICADAS:

1. **Filtro de tema:**
   - Documento menciona `filtroDiarioTema` que não existe
   - **DECISÃO NECESSÁRIA:** Adicionar filtro OU adaptar para usar apenas área

2. **Escala de dias fixa:**
   - Lógica é simples (não é FSRS completo)
   - **ACEITÁVEL:** Documento especifica isso claramente

3. **Compatibilidade com dados antigos:**
   - Entradas sem `srs` precisam ser inicializadas
   - **RESOLVIDO:** `inicializarSrsEntrada()` resolve isso

### 📊 COMPLEXIDADE E ESFORÇO:

- **Complexidade:** Média (6/10)
- **Esforço estimado:** 3-4 horas
- **Risco de bugs:** Médio (com mitigação adequada)

---

## 📝 PLANO DETALHADO DE IMPLEMENTAÇÃO

### FASE 1: PREPARAÇÃO E VALIDAÇÃO

#### 1.1 Verificar nomes reais no código
- [ ] Confirmar: `salvarDiario()` existe (linha 8215) ✅
- [ ] Confirmar: `showSection('diario')` existe (linha 5483) ✅
- [ ] Confirmar: `window.diario` existe ✅
- [ ] **DECISÃO:** Adicionar `filtroDiarioTema` OU adaptar funções?

#### 1.2 Criar funções utilitárias de data
- [ ] Criar `hojeStr()` - retorna "YYYY-MM-DD"
- [ ] Criar `addDias(dateStr, dias)` - soma dias à data
- [ ] Verificar se já existe algo similar (não encontrado)

---

### FASE 2: MODELO DE DADOS (BLOCO 1)

#### 2.1 Adicionar variáveis globais
**Localização:** Linha ~8194 (após `let modoDiario`)

```javascript
// Modo da aba do Diário: 'lista' ou 'sessao'
let abaDiarioAtiva = 'lista';

// Modo da sessão: 'programado' (FSRS) ou 'livre'
let modoSessaoDiario = 'programado';

// Estado interno da sessão de flashcards do Diário
let sessaoDiario = {
    tipo: null,          // 'programado' | 'livre'
    filaIds: [],         // array de IDs de entradas
    indiceAtual: 0       // índice na fila
};
```

**Risco:** Baixo - apenas variáveis globais

#### 2.2 Criar funções utilitárias de data
**Localização:** Após variáveis globais (linha ~8200)

```javascript
function hojeStr() {
    return new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

function addDias(dateStr, dias) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + dias);
    return d.toISOString().split('T')[0];
}
```

**Risco:** Baixo - funções simples

#### 2.3 Criar função de inicialização SRS
**Localização:** Após funções utilitárias

```javascript
function inicializarSrsEntrada(entrada) {
    const hoje = hojeStr();
    if (!entrada.srs) {
        entrada.srs = {
            ativo: true,
            proximaRevisao: hoje,
            repeticoes: 0,
            ultimaResposta: null
        };
    } else {
        // Garantir campos básicos
        if (typeof entrada.srs.ativo !== 'boolean') entrada.srs.ativo = true;
        if (!entrada.srs.proximaRevisao) entrada.srs.proximaRevisao = hoje;
        if (typeof entrada.srs.repeticoes !== 'number') entrada.srs.repeticoes = 0;
        if (!('ultimaResposta' in entrada.srs)) entrada.srs.ultimaResposta = null;
    }
}
```

**Risco:** Baixo - apenas inicialização

#### 2.4 Criar função de inicialização em massa
**Localização:** Após `inicializarSrsEntrada`

```javascript
function inicializarSrsEmTodasEntradas() {
    if (!window.diario || !Array.isArray(window.diario.entradas)) return;
    window.diario.entradas.forEach(inicializarSrsEntrada);
}
```

**Risco:** Baixo - itera sobre array

#### 2.5 Integrar inicialização no carregarDiario()
**Localização:** Linha ~8202 e ~8207 (após definir `window.diario`)

```javascript
// Após linha 8202 (com dados):
window.diario = diario;
inicializarSrsEmTodasEntradas(); // ADICIONAR

// Após linha 8207 (sem dados):
window.diario = { entradas: [], schemaVersion: DIARIO_SCHEMA_VERSION };
inicializarSrsEmTodasEntradas(); // ADICIONAR (vazio, mas seguro)
```

**Risco:** Médio - precisa garantir que não quebra carregamento existente

#### 2.6 Integrar inicialização no salvarEntradaDiario()
**Localização:** Linha ~8336 (editar) e ~8348 (nova entrada)

```javascript
// Linha ~8336 (editar):
const entrada = window.diario.entradas.find(e => String(e.id) === String(entradaId));
if (entrada) {
    inicializarSrsEntrada(entrada); // ADICIONAR ANTES DE EDITAR
    entrada.area = area;
    // ... resto do código
}

// Linha ~8348 (nova entrada):
const novaEntrada = {
    id: Date.now(),
    // ... campos existentes
};
inicializarSrsEntrada(novaEntrada); // ADICIONAR DEPOIS DE CRIAR
window.diario.entradas.push(novaEntrada);
```

**Risco:** Baixo - apenas garante que srs existe

---

### FASE 3: LÓGICA DE SELEÇÃO E AGENDAMENTO (BLOCO 2)

#### 3.1 Criar função de seleção programada
**Localização:** Após funções de inicialização

```javascript
function getEntradasParaRevisarHojeDiario(filtros) {
    if (!window.diario || !Array.isArray(window.diario.entradas)) return [];
    const hoje = hojeStr();
    return window.diario.entradas.filter(e => {
        if (!e.srs || !e.srs.ativo) return false;
        const due = e.srs.proximaRevisao || hoje;
        const venceHoje = due <= hoje;
        const bateArea = !filtros.area || e.area === filtros.area;
        const bateTema = !filtros.tema || e.tema === filtros.tema;
        return venceHoje && bateArea && bateTema;
    });
}
```

**Risco:** Médio - filtro de tema pode não existir (adaptar se necessário)

#### 3.2 Criar função de seleção livre
**Localização:** Após função anterior

```javascript
function getEntradasTreinoLivreDiario(filtros) {
    if (!window.diario || !Array.isArray(window.diario.entradas)) return [];
    return window.diario.entradas.filter(e => {
        const bateArea = !filtros.area || e.area === filtros.area;
        const bateTema = !filtros.tema || e.tema === filtros.tema;
        return bateArea && bateTema;
    });
}
```

**Risco:** Baixo - lógica simples

#### 3.3 Criar função de agendamento SRS
**Localização:** Após funções de seleção

```javascript
function registrarRespostaSrsDiario(entrada, qualidade) {
    if (!entrada || !entrada.srs || !entrada.srs.ativo) return;
    const srs = entrada.srs;
    const hoje = hojeStr();
    
    // Atualiza repeticoes conforme a qualidade
    if (qualidade === 'esqueci') {
        srs.repeticoes = 0;
    } else if (qualidade === 'lembrei') {
        srs.repeticoes = (srs.repeticoes || 0) + 1;
    } else if (qualidade === 'facil') {
        srs.repeticoes = (srs.repeticoes || 0) + 2;
    }
    
    const reps = srs.repeticoes || 0;
    let dias;
    
    if (qualidade === 'esqueci') {
        dias = 1;
    } else {
        if (reps <= 0) dias = 1;
        else if (reps === 1) dias = 1;
        else if (reps === 2) dias = 3;
        else if (reps === 3) dias = 7;
        else if (reps === 4) dias = 14;
        else dias = 30; // teto
    }
    
    srs.ultimaResposta = qualidade;
    srs.proximaRevisao = addDias(hoje, dias);
}
```

**Risco:** Baixo - lógica clara e direta

---

### FASE 4: CONTROLE DE ABA E MODO (BLOCO 3)

#### 4.1 Criar função setAbaDiario()
**Localização:** Após funções de agendamento

```javascript
function setAbaDiario(aba) {
    abaDiarioAtiva = aba; // 'lista' ou 'sessao'
    const tabLista = document.getElementById('diarioTabLista');
    const tabSessao = document.getElementById('diarioTabSessao');
    const containerLista = document.getElementById('diarioListaWrapper');
    const containerSessao = document.getElementById('diarioSessaoWrapper');
    
    if (tabLista && tabSessao && containerLista && containerSessao) {
        if (aba === 'lista') {
            tabLista.classList.add('active');
            tabSessao.classList.remove('active');
            containerLista.style.display = 'block';
            containerSessao.style.display = 'none';
            renderDiario(); // Re-renderizar lista normal
        } else {
            tabSessao.classList.add('active');
            tabLista.classList.remove('active');
            containerLista.style.display = 'none';
            containerSessao.style.display = 'block';
            renderSessaoDiario(null); // Inicialmente mostra escolha
        }
    }
}
```

**Risco:** Médio - precisa garantir que elementos HTML existem

#### 4.2 Criar função setModoSessaoDiario()
**Localização:** Após setAbaDiario

```javascript
function setModoSessaoDiario(modo) {
    modoSessaoDiario = modo; // 'programado' ou 'livre'
    const btnProgramado = document.getElementById('sessaoDiarioProgramado');
    const btnLivre = document.getElementById('sessaoDiarioLivre');
    
    if (btnProgramado && btnLivre) {
        if (modo === 'programado') {
            btnProgramado.classList.add('active');
            btnLivre.classList.remove('active');
        } else {
            btnLivre.classList.add('active');
            btnProgramado.classList.remove('active');
        }
    }
    
    // Reiniciar sessão quando modo muda
    iniciarSessaoDiario(modo);
}
```

**Risco:** Baixo - apenas atualiza UI e chama função

#### 4.3 Criar função iniciarSessaoDiario()
**Localização:** Após setModoSessaoDiario

```javascript
function iniciarSessaoDiario(tipo) {
    if (!window.diario || !Array.isArray(window.diario.entradas)) {
        renderSessaoDiario(null);
        return;
    }
    
    // Coletar filtros atuais da UI
    const filtroArea = document.getElementById('filtroDiarioArea')?.value || '';
    const filtroTema = document.getElementById('filtroDiarioTema')?.value || ''; // PODE NÃO EXISTIR
    
    const filtros = {
        area: filtroArea || null,
        tema: filtroTema || null
    };
    
    let entradas = [];
    if (tipo === 'programado') {
        entradas = getEntradasParaRevisarHojeDiario(filtros);
    } else {
        entradas = getEntradasTreinoLivreDiario(filtros);
    }
    
    sessaoDiario = {
        tipo: tipo,
        filaIds: entradas.map(e => e.id),
        indiceAtual: 0
    };
    
    if (sessaoDiario.filaIds.length === 0) {
        renderSessaoDiario(null);
    } else {
        renderSessaoDiario(getEntradaAtualSessao());
    }
}

function getEntradaAtualSessao() {
    if (!sessaoDiario || !Array.isArray(sessaoDiario.filaIds)) return null;
    const id = sessaoDiario.filaIds[sessaoDiario.indiceAtual];
    return (window.diario.entradas || []).find(e => String(e.id) === String(id)) || null;
}
```

**Risco:** Médio - depende de filtros que podem não existir

---

### FASE 5: UI DA SESSÃO (BLOCO 4)

#### 5.1 Criar função renderSessaoDiario()
**Localização:** Após getEntradaAtualSessao

**Risco:** Médio - HTML complexo, precisa seguir design system

**Pontos de atenção:**
- Usar classes CSS existentes quando possível
- Seguir padrão de organização visual
- Garantir responsividade mobile

#### 5.2 Criar funções de ação da sessão
- `mostrarRespostaSessaoDiario()` - Mostra resposta
- `responderSessaoDiario(qualidade)` - Registra resposta e avança
- `pularSessaoDiario()` - Pula sem alterar SRS
- `desativarSessaoDiarioAtual()` - Desativa SRS do card

**Risco:** Baixo - lógica direta

---

### FASE 6: HTML ESTRUTURAL (BLOCO 5)

#### 6.1 Adicionar tabs Lista/Sessão
**Localização:** Linha ~2524 (após toggle de modo Recall/Respostas)

**Risco:** Baixo - apenas HTML

#### 6.2 Envolver conteúdo atual em wrapper
**Localização:** Linha ~2534-2550 (filtros + Revisar Hoje + Container)

**Risco:** Médio - precisa envolver sem quebrar funcionalidade existente

**Estrutura:**
```html
<div id="diarioListaWrapper">
    <!-- Filtros existentes -->
    <!-- Revisar Hoje existente -->
    <!-- Container existente -->
</div>
```

#### 6.3 Criar wrapper da sessão
**Localização:** Após `diarioListaWrapper`

**Risco:** Baixo - novo HTML, não interfere com existente

---

### FASE 7: CSS (BLOCO 5 - continuação)

#### 7.1 Adicionar estilos para tabs
**Risco:** Baixo - seguir design system existente

#### 7.2 Adicionar estilos para sessão
**Risco:** Baixo - usar prefixo `.diario-sessao-*` para evitar conflitos

---

### FASE 8: INTEGRAÇÃO COM TAREFAS (BLOCO 7)

#### 8.1 Criar função contarDiarioProgramadoParaTema()
**Localização:** Após funções de sessão

**Risco:** Baixo - lógica simples

#### 8.2 Adicionar bloco no renderTarefas()
**Localização:** Linha ~3659 (dentro do map de tarefas)

**Risco:** Médio - precisa encontrar local correto no HTML gerado

#### 8.3 Criar função abrirSessaoDiarioParaTema()
**Localização:** Após contarDiarioProgramadoParaTema

**Risco:** Médio - precisa usar `showSection('diario')` corretamente

---

### FASE 9: ATUALIZAÇÃO CSV (EXTRA - não no documento)

#### 9.1 Atualizar parseCSVDiario()
**Localização:** Linha ~5162 (dentro do map)

**Adicionar:**
```javascript
// Tentar parsear campo srs se existir
const srsAtivo = getVal(r, 'srsativo', 'srs ativo') === 'true' || getVal(r, 'srsativo') === '1';
const srsProximaRevisao = getVal(r, 'srsproximarevisao', 'srs próxima revisão');
const srsRepeticoes = parseInt(getVal(r, 'srsrepeticoes', 'srs repetições')) || 0;
const srsUltimaResposta = getVal(r, 'srsultimaresposta', 'srs última resposta') || null;

if (srsAtivo || srsProximaRevisao) {
    entrada.srs = {
        ativo: srsAtivo,
        proximaRevisao: srsProximaRevisao || hojeStr(),
        repeticoes: srsRepeticoes,
        ultimaResposta: srsUltimaResposta
    };
}
```

**Risco:** Médio - precisa garantir compatibilidade com CSVs antigos

#### 9.2 Atualizar exportarDiarioCSV()
**Localização:** Buscar função `exportarDiarioCSV()`

**Adicionar campos SRS no CSV:**
- `srsAtivo`
- `srsProximaRevisao`
- `srsRepeticoes`
- `srsUltimaResposta`

**Risco:** Baixo - apenas adicionar campos

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Antes de implementar:
- [ ] Confirmar se `filtroDiarioTema` deve ser adicionado OU adaptar funções
- [ ] Verificar se `exportarDiarioCSV()` existe e localizar
- [ ] Testar `hojeStr()` e `addDias()` com casos extremos (fim do mês, ano bissexto)

### Durante implementação:
- [ ] Garantir que `inicializarSrsEmTodasEntradas()` não quebra dados antigos
- [ ] Testar que `renderDiario()` continua funcionando normalmente
- [ ] Verificar que tabs não interferem com modo Recall/Respostas existente

### Após implementação:
- [ ] Testar no iPhone Safari (dispositivo principal)
- [ ] Testar no MacBook Safari/Chrome
- [ ] Validar que dados antigos são migrados corretamente
- [ ] Validar que nova entrada já nasce com `srs` inicializado
- [ ] Validar que sessão programada mostra apenas cards vencidos
- [ ] Validar que sessão livre mostra todos os cards
- [ ] Validar que botões Esqueci/Lembrei/Fácil funcionam
- [ ] Validar que agendamento está correto (verificar datas)
- [ ] Validar que integração com Tarefas funciona
- [ ] Validar que exportação/importação CSV preserva dados SRS

---

## ❓ DÚVIDAS E QUESTÕES

### 1. Filtro de Tema
**Questão:** Documento menciona `filtroDiarioTema` que não existe no HTML atual.

**Opções:**
- **A)** Adicionar `<select id="filtroDiarioTema">` no HTML
- **B)** Adaptar funções para usar apenas `filtroDiarioArea` (mais simples)

**Recomendação:** Opção B (mais simples, menos risco)

**Pergunta:** Qual opção você prefere?

---

### 2. Exportação CSV
**Questão:** Função `exportarDiarioCSV()` existe (linha 10025).

**Status:** ✅ Função encontrada - precisa ser atualizada para incluir campo `srs`

**Ação necessária:**
- Ler função atual (linha 10025)
- Adicionar campos SRS no CSV exportado

---

### 3. Navegação para Diário
**Questão:** Documento menciona `navegarParaSecao('diario')` mas função real é `showSection('diario')`.

**Solução:** Usar `showSection('diario')` que já existe e funciona.

**Confirmação:** ✅ Já resolvido - usar `showSection('diario')`

---

### 4. Compatibilidade com modoDiario existente
**Questão:** Já existe `modoDiario` (recall/respostas). Não confundir com `modoSessaoDiario`.

**Solução:** Manter separados:
- `modoDiario` → recall/respostas (já existe)
- `modoSessaoDiario` → programado/livre (novo)

**Confirmação:** ✅ Entendido - manter separados

---

## 📊 RESUMO DA ANÁLISE

### ✅ PONTOS FORTES:
1. ✅ Estrutura de dados permite adicionar `srs` sem quebrar
2. ✅ Funções de inicialização garantem compatibilidade
3. ✅ Lógica de agendamento é clara e direta
4. ✅ Separação clara entre Lista e Sessão
5. ✅ Integração com Tarefas é viável

### ⚠️ PONTOS DE ATENÇÃO:
1. ⚠️ Filtro de tema não existe (precisa decisão)
2. ⚠️ Função de exportação CSV precisa ser verificada/criada
3. ⚠️ Precisa garantir compatibilidade com dados antigos
4. ⚠️ Precisa testar especificamente no iPhone Safari

### 🔴 RISCOS CRÍTICOS MITIGADOS:
1. ✅ Inicialização de `srs` em todas as entradas
2. ✅ Separação clara de variáveis (`modoDiario` vs `modoSessaoDiario`)
3. ✅ Wrappers separados para Lista e Sessão

---

## ✅ CONCLUSÃO

### VIABILIDADE: ✅ SIM, É VIÁVEL

**Complexidade:** Média (6/10)  
**Esforço:** 3-4 horas  
**Risco:** Médio (com mitigação adequada)

### PRÓXIMOS PASSOS:

1. **Aguardar respostas às dúvidas:**
   - Filtro de tema (adicionar OU adaptar)
   - Função de exportação CSV (existe OU criar)

2. **Após respostas, implementar em ordem:**
   - FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 5 → FASE 6 → FASE 7 → FASE 8 → FASE 9

3. **Testar minuciosamente:**
   - Dados antigos
   - Dados novos
   - Mobile (iPhone Safari)
   - Exportação/Importação CSV

---

**Análise completa. Aguardando validação e respostas às dúvidas antes de implementar.**

