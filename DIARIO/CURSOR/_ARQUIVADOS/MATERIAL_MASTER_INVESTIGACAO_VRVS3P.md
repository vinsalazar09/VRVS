# 🔍 MATERIAL MASTER - INVESTIGAÇÃO VRVS 3P
## Problemas e Dúvidas para Investigação Completa

**Data:** 2024-12-20  
**Versão:** VRVS v5.3.3  
**Objetivo:** Investigar e corrigir problemas de agrupamento e verificar funcionamento do algoritmo VRVS 3P

---

## 📋 SUMÁRIO

1. [Problema Principal: Agrupamento Incorreto](#problema-principal)
2. [Contexto Correto do Sistema](#contexto-correto)
3. [Dúvidas sobre VRVS 3P](#duvidas-vrvs3p)
4. [Checklist de Investigação](#checklist-investigacao)
5. [O que Precisa ser Corrigido](#correcoes-necessarias)

---

## 🐛 PROBLEMA PRINCIPAL: AGRUPAMENTO INCORRETO

### Descrição do Problema

**Situação observada:**
- Usuário está na aba **"Por Tema"** do Diário
- Tema: **"Coluna"** → **"Anatomia da Coluna"**
- **1 entrada** aparece isolada em **"⚠️ Revisar Hoje"**
- **9 entradas** aparecem no grupo normal do tema
- **Todas as 10 entradas** pertencem ao mesmo tema e foram criadas com VRVS 3P ativo

**Comportamento esperado:**
- Todas as entradas do mesmo tema deveriam aparecer **juntas** no grupo do tema
- Dentro do grupo, usar ícone ⚠️ ou ✅ para indicar status (devido hoje ou em dia)
- **NÃO separar** em blocos diferentes

**Comportamento atual (BUG):**
- Entradas são **separadas** em dois blocos:
  1. Bloco especial "⚠️ Revisar Hoje" (1 entrada)
  2. Bloco normal do tema (9 entradas)

---

## 📚 CONTEXTO CORRETO DO SISTEMA

### O que são as Entradas do Diário

- **Anotações do Diário de Aprendizados**
- Podem ter **VRVS 3P ativo** ou não
- Quando criadas, usuário pode marcar toggle **"Revisar no dia seguinte"**
- Se marcado → entra no ciclo VRVS 3P (`srs.ativo = true`)

### Como Funciona "Revisar Hoje"

Uma entrada aparece em "⚠️ Revisar Hoje" quando:

1. **`e.atencao === true`** (marcação manual ⚠️), OU
2. **`e.srs.ativo === true`** E **`e.srs.proximaRevisao <= hoje`** (VRVS 3P devido/atrasado)

### Modos de Visualização

- **"Por Tema"**: Agrupa por Área → Tema
- **"Por Data"**: Agrupa por data de criação
- **"Sessão"**: Modo de revisão ativa (Esqueci/Lembrei/Fácil)
- **"Treino Livre"**: Modo de treino sem afetar VRVS 3P

**⚠️ IMPORTANTE:** 
- O problema ocorre na **LISTAGEM** (modo visualização "Por Tema"), não no modo sessão
- Na sessão, nenhum card apareceu para revisar hoje (comportamento correto)
- Na listagem "Por Tema", 1 card aparece isolado em "Revisar Hoje" (comportamento incorreto)
- Isso sugere **inconsistência** entre lógica da sessão e lógica da listagem

---

## ❓ DÚVIDAS SOBRE VRVS 3P

### 1. Como Verificar se o Algoritmo Está Rodando?

**Dúvida do usuário:**
> "Como podemos checar que de fato o algoritmo está rodando? E não existe risco de ficar pesado? Como vou saber? Como conseguimos checar isso?"

**O que precisa ser investigado:**

#### A. Verificação de Execução
- [ ] Onde o algoritmo VRVS 3P é executado?
- [ ] Quando é executado? (boot, ao salvar, ao revisar, periodicamente?)
- [ ] Há logs/console.log que mostram execução?
- [ ] Como verificar se `proximaRevisao` está sendo atualizada?

#### B. Verificação de Performance
- [ ] Quantas entradas o usuário tem no Diário?
- [ ] O algoritmo roda em todas as entradas ou só nas ativas?
- [ ] Há risco de travar o iPhone com muitas entradas?
- [ ] Como medir tempo de execução?
- [ ] Há operações síncronas pesadas?

#### C. Verificação de Dados
- [ ] Como inspecionar `window.diario.entradas[]` no console?
- [ ] Como verificar `srs.ativo`, `srs.proximaRevisao` de uma entrada específica?
- [ ] Como comparar `proximaRevisao` antes e depois de revisar?
- [ ] Há ferramenta de debug para inspecionar estado do VRVS 3P?

### 2. Por que Uma Entrada Aparece em "Revisar Hoje" Separada?

**Contexto CRÍTICO:**
- Usuário cria quase todas as anotações marcando toggle **"Revisar no dia seguinte"**
- Quando marca esse toggle → entrada entra no VRVS 3P (`srs.ativo = true`)
- Em teoria, todas as 10 entradas do tema "Anatomia da Coluna" foram criadas com VRVS 3P ativo
- **IMPORTANTE:** Esse card específico **NÃO apareceu para revisar hoje** na sessão (assim como os demais também não apareceram)
- **PARADOXO:** Mas na listagem "Por Tema", esse mesmo card aparece isolado em "⚠️ Revisar Hoje"
- **Isso não faz sentido:** Se não apareceu para revisar hoje na sessão, por que aparece em "Revisar Hoje" na listagem?

**Informação adicional sobre o toggle:**
- Ao criar anotação, há um checkbox/toggle: **"Revisar no dia seguinte"** ou similar
- Quando marcado, a entrada recebe `srs.ativo = true` e `srs.proximaRevisao` é calculada
- Se não marcado, a entrada é apenas uma anotação (não entra no VRVS 3P)

**Possíveis causas a investigar:**

#### Causa 1: `atencao: true` Manual
- [ ] Verificar se essa entrada específica tem `atencao: true`
- [ ] Verificar se outras 9 entradas têm `atencao: false` ou `undefined`
- [ ] Como remover `atencao: true` se for o caso?

#### Causa 2: `proximaRevisao` Não Atualizada
- [ ] Verificar `srs.proximaRevisao` dessa entrada específica
- [ ] Comparar com `proximaRevisao` das outras 9 entradas
- [ ] Verificar se está `<= hoje` quando não deveria
- [ ] Por que não foi atualizada após revisar?

#### Causa 3: Inconsistência entre Sessão e Listagem

**⚠️ DESCOBERTA CRÍTICA:**

A função da **Sessão** (`getEntradasParaRevisarHojeDiario()`) linha ~10104-10115:
```javascript
// NÃO verifica atencao, só verifica srs.ativo && proximaRevisao <= hoje
if (!e.srs || !e.srs.ativo) return false;
const due = e.srs.proximaRevisao || hoje;
if (due > hoje) return false;
```

A função da **Listagem** (`renderListaDiario()`) linha ~10603-10612:
```javascript
// VERIFICA atencao PRIMEIRO, depois verifica srs.ativo && proximaRevisao <= hoje
if (e.atencao) return true;  // ← DIFERENÇA CRÍTICA
if (e.srs && e.srs.ativo && e.srs.proximaRevisao) {
    return e.srs.proximaRevisao <= hoje;
}
```

**Hipótese:** A entrada problemática pode ter `atencao: true`, então:
- **Sessão:** Não aparece (porque não verifica `atencao`)
- **Listagem:** Aparece (porque verifica `atencao` primeiro)

**Tarefas:**
- [ ] Comparar as duas funções lado a lado
- [ ] Verificar se entrada problemática tem `atencao: true`
- [ ] Decidir: unificar lógica ou manter diferença intencional?
- [ ] Se unificar: qual lógica usar? (sessão ou listagem?)

#### Causa 4: Bug de Agrupamento na UI
- [ ] Verificar função `renderListaDiario()` linha ~10603-10646
- [ ] Verificar função `renderDiarioPorTema()` linha ~10684-10750
- [ ] A lógica está separando incorretamente?
- [ ] Por que cria bloco "Revisar Hoje" separado em vez de agrupar por tema?

---

## ✅ CHECKLIST DE INVESTIGAÇÃO

### FASE 1: Verificar Dados da Entrada Problemática

**Objetivo:** Identificar por que essa entrada específica aparece separada

**Tarefas:**
1. [ ] Criar função helper para inspecionar entrada específica:
   ```javascript
   function inspecionarEntrada(textoTopico) {
       const entrada = window.diario.entradas.find(e => 
           e.topico && e.topico.includes(textoTopico)
       );
       if (!entrada) return null;
       return {
           topico: entrada.topico,
           area: entrada.area,
           tema: entrada.tema,
           atencao: entrada.atencao,
           srsAtivo: entrada.srs?.ativo,
           proximaRevisao: entrada.srs?.proximaRevisao,
           estagio: entrada.srs?.estagio,
           intervalo: entrada.srs?.intervalo,
           dataCriacao: entrada.data
       };
   }
   ```

2. [ ] Comparar entrada problemática com outras 9 do mesmo tema
3. [ ] Verificar se `atencao: true` está causando separação
4. [ ] Verificar se `proximaRevisao` está incorreta

### FASE 2: Verificar Algoritmo VRVS 3P

**Objetivo:** Confirmar que algoritmo está rodando e atualizando corretamente

**Tarefas:**
1. [ ] Localizar função `atualizarSRS_VRVS3P()`
2. [ ] Verificar quando é chamada (ao revisar, ao salvar, etc.)
3. [ ] Adicionar logs temporários para rastrear execução:
   ```javascript
   console.log('[VRVS3P] Atualizando SRS:', {
       topico: entrada.topico,
       antes: entrada.srs?.proximaRevisao,
       depois: novaProximaRevisao,
       estagio: entrada.srs?.estagio
   });
   ```

4. [ ] Verificar função `calcularProximaRevisao()` linha ~4100
5. [ ] Testar cálculo manualmente para validar lógica
6. [ ] Verificar se há operações síncronas pesadas

### FASE 3: Verificar Performance

**Objetivo:** Garantir que não há risco de travar o iPhone

**Tarefas:**
1. [ ] Contar total de entradas no Diário:
   ```javascript
   console.log('Total entradas:', window.diario.entradas.length);
   console.log('Entradas com VRVS 3P ativo:', 
       window.diario.entradas.filter(e => e.srs?.ativo).length
   );
   ```

2. [ ] Medir tempo de execução do algoritmo:
   ```javascript
   const inicio = performance.now();
   // ... código do algoritmo ...
   const fim = performance.now();
   console.log(`Tempo de execução: ${fim - inicio}ms`);
   ```

3. [ ] Verificar se há loops sobre todas as entradas no boot
4. [ ] Verificar se há operações síncronas bloqueantes
5. [ ] Sugerir otimizações se necessário

### FASE 4: Corrigir Agrupamento na UI

**Objetivo:** Corrigir bug de separação incorreta

**Tarefas:**
1. [ ] Analisar função `renderListaDiario()` linha ~10570-10647
2. [ ] Analisar função `renderDiarioPorTema()` linha ~10684-10750
3. [ ] Identificar onde está a lógica de separação incorreta
4. [ ] Corrigir para agrupar tudo por tema primeiro
5. [ ] Adicionar ícone ⚠️ ou ✅ dentro do card do tema (não separar blocos)

---

## 🔧 CORREÇÕES NECESSÁRIAS

### Correção 1: Agrupamento Correto na Aba "Por Tema"

**Problema atual:**
```javascript
// Linha ~10603-10612: Separa entradas em "Revisar Hoje"
const entradasRevisar = entradasFiltradas.filter(e => {
    if (e.atencao) return true;
    if (e.srs && e.srs.ativo && e.srs.proximaRevisao) {
        return e.srs.proximaRevisao <= hoje;
    }
    return false;
});

// Linha ~10614-10637: Cria bloco separado "Revisar Hoje"
// Linha ~10640: Remove entradas com atenção da lista principal
entradasFiltradas = entradasFiltradas.filter(e => !e.atencao);
```

**Solução proposta:**
- **NÃO criar** bloco separado "Revisar Hoje" na aba "Por Tema"
- **SEMPRE agrupar** por tema primeiro
- Dentro de cada card de tema, mostrar ícone ⚠️ ou ✅ conforme status
- Manter bloco "Revisar Hoje" apenas na aba "Por Data" (se necessário)

### Correção 2: Ferramenta de Debug/Inspeção

**Criar função helper para debug:**
```javascript
// Adicionar ao console do navegador
window.debugVRVS3P = {
    // Inspecionar entrada específica
    inspecionar: function(textoTopico) {
        const entrada = window.diario.entradas.find(e => 
            e.topico && e.topico.includes(textoTopico)
        );
        if (!entrada) {
            console.log('Entrada não encontrada');
            return null;
        }
        console.table({
            'Tópico': entrada.topico,
            'Área': entrada.area,
            'Tema': entrada.tema,
            'Atenção': entrada.atencao,
            'VRVS 3P Ativo': entrada.srs?.ativo,
            'Próxima Revisão': entrada.srs?.proximaRevisao,
            'Estágio': entrada.srs?.estagio,
            'Intervalo': entrada.srs?.intervalo,
            'Data Criação': entrada.data
        });
        return entrada;
    },
    
    // Listar todas entradas com VRVS 3P ativo
    listarAtivas: function() {
        const ativas = window.diario.entradas.filter(e => e.srs?.ativo);
        console.log(`Total: ${ativas.length} entradas ativas`);
        console.table(ativas.map(e => ({
            'Tópico': e.topico?.substring(0, 50),
            'Área': e.area,
            'Tema': e.tema,
            'Próxima Revisão': e.srs?.proximaRevisao,
            'Estágio': e.srs?.estagio
        })));
        return ativas;
    },
    
    // Verificar entradas devidas hoje
    devidasHoje: function() {
        const hoje = hojeStr();
        const devidas = window.diario.entradas.filter(e => {
            if (e.atencao) return true;
            if (e.srs?.ativo && e.srs.proximaRevisao) {
                return e.srs.proximaRevisao <= hoje;
            }
            return false;
        });
        console.log(`Total: ${devidas.length} entradas devidas hoje`);
        console.table(devidas.map(e => ({
            'Tópico': e.topico?.substring(0, 50),
            'Área': e.area,
            'Tema': e.tema,
            'Motivo': e.atencao ? 'Atenção manual' : 'VRVS 3P devido',
            'Próxima Revisão': e.srs?.proximaRevisao
        })));
        return devidas;
    },
    
    // Verificar performance
    performance: function() {
        const inicio = performance.now();
        const ativas = window.diario.entradas.filter(e => e.srs?.ativo);
        const fim = performance.now();
        console.log(`Tempo de filtro: ${fim - inicio}ms`);
        console.log(`Total entradas: ${window.diario.entradas.length}`);
        console.log(`Entradas ativas: ${ativas.length}`);
        return {
            total: window.diario.entradas.length,
            ativas: ativas.length,
            tempo: fim - inicio
        };
    }
};
```

### Correção 3: Logs Temporários para Rastreamento

**Adicionar logs em pontos críticos:**
- Ao atualizar SRS após revisar
- Ao calcular próxima revisão
- Ao renderizar lista "Por Tema"
- Ao filtrar entradas "Revisar Hoje"

---

## 📝 INSTRUÇÕES PARA O CURSOR

### Contexto Adicional Importante

**Diferença entre Sessão e Listagem:**
- **Sessão** (`getEntradasParaRevisarHojeDiario()`): Usa lógica `srs.ativo && proximaRevisao <= hoje`
- **Listagem** (`renderListaDiario()`): Usa lógica `atencao || (srs.ativo && proximaRevisao <= hoje)`
- **Problema:** Pode haver inconsistência entre essas duas lógicas
- **Evidência:** Nenhum card apareceu na sessão, mas 1 aparece na listagem

**Sobre o Toggle "Revisar no dia seguinte":**
- Localizar onde esse toggle é criado (provavelmente no modal de nova entrada)
- Verificar como ele define `srs.ativo` e `srs.proximaRevisao`
- Verificar se há diferença entre criar com toggle vs ativar depois

### O que Fazer

1. **Investigar inconsistência entre Sessão e Listagem:**
   - Comparar função `getEntradasParaRevisarHojeDiario()` linha ~10104-10115
   - Comparar função `renderListaDiario()` linha ~10603-10612
   - Identificar por que resultados são diferentes
   - Verificar se `atencao: true` está causando diferença

2. **Investigar problema de agrupamento:**
   - Ler função `renderListaDiario()` linha ~10570-10647
   - Ler função `renderDiarioPorTema()` linha ~10684-10750
   - Identificar por que entradas do mesmo tema são separadas
   - Corrigir para agrupar tudo por tema primeiro

2. **Criar ferramenta de debug:**
   - Adicionar função `window.debugVRVS3P` conforme especificado acima
   - Permitir inspecionar entrada específica
   - Permitir verificar performance

3. **Verificar algoritmo VRVS 3P:**
   - Localizar função `atualizarSRS_VRVS3P()`
   - Verificar quando é executada
   - Adicionar logs temporários para rastreamento
   - Verificar se há problemas de performance

4. **Documentar descobertas:**
   - Criar relatório com causas identificadas
   - Documentar correções aplicadas
   - Sugerir melhorias se necessário

### O que NÃO Fazer

- ❌ Não mexer no motor VRVS 3P sem investigar primeiro
- ❌ Não alterar lógica de cálculo sem validar
- ❌ Não remover funcionalidades existentes
- ❌ Não fazer mudanças sem testar no iPhone

---

## 🎯 RESULTADO ESPERADO

Após investigação e correções:

1. ✅ Entradas do mesmo tema aparecem **juntas** na aba "Por Tema"
2. ✅ Ícone ⚠️ ou ✅ aparece **dentro** do card do tema (não separado)
3. ✅ Ferramenta de debug disponível no console
4. ✅ Logs mostram execução do algoritmo VRVS 3P
5. ✅ Performance verificada e otimizada se necessário
6. ✅ Documentação completa das descobertas

---

**Documento criado para investigação completa do problema de agrupamento e verificação do algoritmo VRVS 3P**

