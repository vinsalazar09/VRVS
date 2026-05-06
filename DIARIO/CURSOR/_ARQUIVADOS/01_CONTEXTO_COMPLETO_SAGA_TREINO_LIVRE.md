# 📚 CONTEXTO COMPLETO - SAGA TREINO LIVRE CUSTOMIZADO

**Data:** 20 de Dezembro de 2024  
**Versão Base:** VRVS v5.3.3 (baseline estável `f438a82`)  
**Status:** Preparação para customização segura da aba Treino Livre

---

## 🎯 OBJETIVO PRINCIPAL

Customizar a aba **"Treino Livre"** do Diário para permitir:
- Seleção de área/tema específicos
- Controle de quantidade de cards
- Filtros avançados
- Experiência personalizada de treino

**⚠️ CRÍTICO:** Implementação deve ser **segura, metodológica e sem bugs**, aprendendo com os erros da saga anterior.

---

## 📖 CONTEXTO TÉCNICO

### Arquitetura Atual

**Plataforma:** PWA 100% client-side (HTML/CSS/JS, sem backend)  
**Armazenamento:** `localStorage`  
**Plataforma Principal:** iPhone Safari (PWA instalado)  
**Estrutura:** Arquivo monolítico `docs/index.html` (~13.395 linhas)

### Sistema VRVS 3P (Spaced Repetition System)

**Algoritmo de Repetição Espaçada:**
- Gerencia `estagio`, `intervalo`, `proximaRevisao`, `ultimaRevisaoData`
- Atualiza após cada resposta (Esqueci/Lembrei/Fácil)
- Calcula próxima data de revisão baseado em estágio atual

**Helpers Unificados (Patch 3):**
- `isSrsActive(entrada)` - Verifica se VRVS 3P está ativo
- `isDueToday(entrada, hoje)` - Verifica se está devido hoje
- `isUpcoming(entrada, hoje, dias)` - Verifica se está nos próximos N dias

### Estrutura do Diário

**Objeto Global:** `window.diario`
```javascript
{
  entradas: [
    {
      id: "...",
      topico: "...",
      resposta: "...",
      area: "...",
      tema: "...",
      data: "YYYY-MM-DD",
      srs: {
        ativo: true/false,
        estagio: 0-10,
        intervalo: 1, 2, 4, 7, 14, 30, 60, 90, 180, 365,
        proximaRevisao: "YYYY-MM-DD",
        ultimaRevisaoData: "YYYY-MM-DD",
        repeticoes: 0,
        facilidade: 2.5,
        historicoRespostas: []
      }
    }
  ],
  schemaVersion: "1.0"
}
```

### Abas do Diário

1. **Lista** (`diarioTabLista`)
   - Visualização "Por Tema" ou "Por Data"
   - Filtros: área, data
   - Chips: 🧠 (ativo), ⏰ (devido hoje), 📆 (próximos 3 dias)

2. **Sessão** (`diarioTabSessao`)
   - Modo "Revisão programada" (`programado`)
   - Modo "Treino livre" (`livre`)
   - Fila de cards (`sessaoDiario.filaIds`)

### Funções Críticas

**`iniciarSessaoDiario(tipo)`** (linha ~11442-11485)
- Popula `sessaoDiario.filaIds` baseado no tipo
- Usa filtros de `window.filtrosSessaoDiario` OU filtro da UI (`filtroDiarioArea`)
- **BUG IDENTIFICADO:** Usa filtro da UI automaticamente mesmo sem comando do usuário

**`getEntradasParaRevisarHojeDiario(filtros)`** (linha ~10109-10134)
- Filtra entradas devidas hoje (`isDueToday`)
- Aplica filtros de área/tema

**`getEntradasTreinoLivreDiario(filtros)`** (linha ~10137-10144)
- Retorna todas as entradas (apenas filtra por área)
- Não verifica `proximaRevisao`

**`responderSessaoDiario(qualidade)`** (linha ~11576-11600)
- Atualiza SRS se modo `programado`
- Avança na fila
- Salva no `localStorage`

---

## 🐛 BUG CRÍTICO IDENTIFICADO

### Problema: Filtro Automático Indesejado

**Localização:** `iniciarSessaoDiario()` linha 11459-11461

**Código Problemático:**
```javascript
} else {
    // Caso contrário, use o filtro de área atual da UI (filtroDiarioArea)
    const filtroAreaSelect = document.getElementById('filtroDiarioArea');
    filtros.area = filtroAreaSelect && filtroAreaSelect.value ? filtroAreaSelect.value : null;
}
```

**Comportamento Atual:**
1. Usuário está na aba "Lista" com filtro "Coluna" selecionado
2. Usuário vai para aba "Sessão" → "Revisão programada"
3. Sistema aplica automaticamente filtro "Coluna" da aba Lista
4. Mostra cards filtrados por "Coluna" mesmo sem usuário ter pedido

**Comportamento Esperado:**
- Sessão deve usar apenas filtros explícitos (ex: quando clica em tema na aba Tarefas)
- Se não houver filtro explícito, mostrar TODAS as áreas (sem filtro)

**Impacto:**
- Cards aparecem mesmo após completados (filtro aplicado automaticamente)
- Confusão do usuário sobre quais cards estão sendo mostrados
- Inconsistência entre "Revisão programada" e "Treino livre"

---

## 📊 ESTADO ATUAL DO CÓDIGO

### Baseline Estável

**Commit:** `f438a82` (2024-12-16)  
**Status:** ✅ Funcionando após rollback  
**CACHE_NAME:** `vrvs-ROLLBACK-STABLE-20251220-2200`

### Patches Aplicados (Pós-Rollback)

**Patch 3-1-2:** Helpers unificados + correção agrupamento + indicadores iPhone  
**Patch 4:** Remoção legado ⚠️ atenção  
**Patch I:** UX refinada (touch/focus)

### Funções de Debug Disponíveis

**`window.debugVRVS3P`** (linha ~10136-10582)
- `inspecionar(textoTopico)` - Inspeciona entrada específica
- `listarAtivas()` - Lista entradas com VRVS 3P ativo
- `devidasHoje()` - Lista entradas devidas hoje
- `compararSessaoListagem()` - Compara lógica sessão vs listagem
- `performance()` - Mede tempo de execução
- `historico(limite)` - Mostra últimas execuções
- `validar()` - Valida estrutura do algoritmo
- `testar()` - Teste unitário do algoritmo
- `resumo()` - Executa todas as análises

---

## 🎯 OBJETIVOS DA CUSTOMIZAÇÃO

### Funcionalidades Desejadas

1. **Seleção de Área/Tema**
   - Dropdown ou botões para escolher área específica
   - Opção "Todas as áreas"
   - Opção de escolher tema específico dentro de uma área

2. **Controle de Quantidade**
   - Slider ou input numérico para definir quantos cards mostrar
   - Padrão: 10 cards (ou todas se menos de 10)
   - Máximo configurável

3. **Filtros Avançados**
   - Por estágio do VRVS 3P
   - Por data de criação
   - Por última revisão
   - Por facilidade

4. **Experiência Personalizada**
   - Embaralhar ordem dos cards
   - Modo "revisar apenas atrasados"
   - Modo "revisar apenas novos" (sem revisões anteriores)

### Restrições Críticas

- ✅ **NÃO mexer** no motor VRVS 3P
- ✅ **NÃO alterar** lógica de cálculo de `proximaRevisao`
- ✅ **NÃO modificar** estrutura de dados existente
- ✅ **NÃO criar** novos campos sem necessidade
- ✅ **NÃO quebrar** funcionalidade existente
- ✅ **Testar** no iPhone antes de commitar

---

## 📋 CHECKLIST PRÉ-IMPLEMENTAÇÃO

### Validações Necessárias

- [ ] Entender completamente o fluxo atual de "Treino livre"
- [ ] Identificar todos os pontos de entrada/saída
- [ ] Mapear dependências entre funções
- [ ] Verificar impacto em outras abas/seções
- [ ] Criar plano de testes no iPhone
- [ ] Definir rollback plan se algo der errado

### Documentação Necessária

- [ ] Diagrama de fluxo atual
- [ ] Diagrama de fluxo proposto
- [ ] Lista de funções que serão modificadas
- [ ] Lista de funções que serão criadas
- [ ] Plano de testes passo a passo
- [ ] Critérios de aceite

---

## 🔒 PROTOCOLO DE SEGURANÇA

### Regras Obrigatórias

1. **Diagnóstico Antes de Solução**
   - Sempre investigar completamente antes de modificar
   - Usar ferramentas de debug disponíveis
   - Validar hipóteses antes de implementar

2. **Mudanças Cirúrgicas**
   - Modificar apenas o necessário
   - Não refatorar código não relacionado
   - Manter compatibilidade com código existente

3. **Testes Incrementais**
   - Testar cada mudança isoladamente
   - Validar no iPhone após cada mudança
   - Não acumular múltiplas mudanças sem testar

4. **Rollback Plan**
   - Sempre ter plano de rollback pronto
   - Commitar baseline antes de mudanças grandes
   - Documentar exatamente o que foi mudado

5. **Documentação Contínua**
   - Documentar cada decisão técnica
   - Explicar por que cada mudança foi feita
   - Registrar problemas encontrados e soluções

---

## 📝 PRÓXIMOS PASSOS

1. ✅ Criar documentos de contexto (este documento)
2. ✅ Criar narrativa completa da saga anterior
3. ✅ Documentar erros e tentativas em ordem cronológica
4. ✅ Criar plano de implementação metodológico
5. ⏳ Aguardar aprovação do usuário para iniciar implementação

---

**Documento criado para preparar terreno seguro para customização da aba Treino Livre**

