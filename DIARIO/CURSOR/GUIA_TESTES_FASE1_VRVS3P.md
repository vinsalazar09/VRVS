# 🧪 GUIA DE TESTES - FASE 1: Motor VRVS 3P

**Data:** 2025-12-14  
**Objetivo:** Validar que o motor VRVS 3P está funcionando corretamente

---

## ✅ CHECKLIST DE TESTES

### TESTE 1: Migração de Dados Existentes

**O que testar:**
- Entradas antigas com `srs.repeticoes` devem ser migradas para `srs.estagio`

**Como testar:**
1. Abra o console do navegador (F12 → Console)
2. Digite:
   ```javascript
   // Ver entradas com SRS
   window.diario.entradas.filter(e => e.srs).forEach(e => {
       console.log('ID:', e.id, '| Repeticoes:', e.srs.repeticoes, '| Estagio:', e.srs.estagio, '| Engine:', e.srs.engine);
   });
   ```
3. **Verificar:**
   - ✅ Todas as entradas com SRS devem ter `engine: 'VRVS_FSRS3_v1'`
   - ✅ Todas devem ter `estagio` (número 0-10)
   - ✅ Todas devem ter `intervalo` correspondente ao estágio
   - ✅ Mapeamento deve estar correto:
     - repeticoes 0 → estagio 0
     - repeticoes 1 → estagio 1
     - repeticoes 2 → estagio 2
     - repeticoes 3 → estagio 3
     - repeticoes 4 → estagio 4
     - repeticoes 5+ → estagio 5

**Resultado esperado:**
- Console mostra: `[VRVS 3P] Migradas X entradas para VRVS_FSRS3_v1`
- Todas as entradas têm campos VRVS 3P preenchidos

---

### TESTE 2: Criar Nova Entrada com Checkbox Marcado

**O que testar:**
- Nova entrada com checkbox "📅 Incluir nas revisões" deve criar SRS VRVS 3P

**Como testar:**
1. Aba Diário → Botão "+ Nova"
2. Preencher:
   - Área: qualquer
   - Tema: qualquer
   - Tópico: "Teste VRVS 3P"
   - Resposta: "Resposta teste"
3. **Marcar checkbox:** "📅 Incluir nas revisões programadas (VRVS 3P)"
4. Salvar
5. No console:
   ```javascript
   const ultima = window.diario.entradas[window.diario.entradas.length - 1];
   console.log('Nova entrada:', ultima);
   console.log('SRS:', ultima.srs);
   ```

**Verificar:**
- ✅ `ultima.srs` existe e não é null
- ✅ `ultima.srs.engine === 'VRVS_FSRS3_v1'`
- ✅ `ultima.srs.estagio === 0`
- ✅ `ultima.srs.intervalo === 1`
- ✅ `ultima.srs.proximaRevisao` = amanhã (hoje + 1 dia)
- ✅ `ultima.srs.ultimaRevisaoData` = hoje
- ✅ `ultima.srs.ativo === true`

**Resultado esperado:**
- Nova entrada criada com SRS VRVS 3P completo

---

### TESTE 3: Criar Nova Entrada SEM Checkbox

**O que testar:**
- Nova entrada sem checkbox não deve criar SRS

**Como testar:**
1. Aba Diário → Botão "+ Nova"
2. Preencher campos (mesmo do teste anterior)
3. **NÃO marcar checkbox**
4. Salvar
5. No console:
   ```javascript
   const ultima = window.diario.entradas[window.diario.entradas.length - 1];
   console.log('SRS:', ultima.srs);
   ```

**Verificar:**
- ✅ `ultima.srs === null` ou `ultima.srs === undefined`

**Resultado esperado:**
- Entrada criada sem SRS

---

### TESTE 4: Responder Card na Sessão - Esqueci

**O que testar:**
- Resposta "Esqueci" deve atualizar estágio corretamente

**Como testar:**
1. Aba Diário → Aba "Sessão"
2. Escolher modo "Programado" ou "Livre"
3. Abrir um card
4. Clicar em "❌ ESQUECI"
5. No console:
   ```javascript
   // Pegar última entrada revisada
   const entrada = window.diario.entradas.find(e => e.srs && e.srs.ultimaResposta === 'esqueci');
   if (entrada) {
       console.log('Entrada após Esqueci:');
       console.log('Estagio:', entrada.srs.estagio);
       console.log('Intervalo:', entrada.srs.intervalo);
       console.log('ProximaRevisao:', entrada.srs.proximaRevisao);
       console.log('UltimaRevisaoData:', entrada.srs.ultimaRevisaoData);
   }
   ```

**Verificar:**
- ✅ Se estava em estágio 0-1 → `estagio === 0`
- ✅ Se estava em estágio 2+ → `estagio` desceu 2 degraus
- ✅ `intervalo` corresponde ao novo estágio
- ✅ `proximaRevisao` = hoje + intervalo
- ✅ `ultimaRevisaoData` = hoje
- ✅ `ultimaResposta === 'esqueci'`

**Resultado esperado:**
- Estágio ajustado conforme regra (volta 0 ou desce 2)
- Próxima revisão agendada corretamente

---

### TESTE 5: Responder Card - Lembrei

**O que testar:**
- Resposta "Lembrei" deve subir 1 estágio

**Como testar:**
1. Abrir sessão do Diário
2. Clicar em "👍 LEMBREI"
3. No console:
   ```javascript
   const entrada = window.diario.entradas.find(e => e.srs && e.srs.ultimaResposta === 'lembrei');
   if (entrada) {
       console.log('Estagio ANTES:', entrada.srs.estagio - 1);
       console.log('Estagio DEPOIS:', entrada.srs.estagio);
       console.log('Intervalo:', entrada.srs.intervalo);
   }
   ```

**Verificar:**
- ✅ `estagio` subiu 1 (ou ficou no máximo se já estava em 10)
- ✅ `intervalo` corresponde ao novo estágio
- ✅ `proximaRevisao` = hoje + intervalo
- ✅ `ultimaRevisaoData` = hoje

**Resultado esperado:**
- Estágio aumentou em 1
- Intervalo atualizado corretamente

---

### TESTE 6: Responder Card - Fácil

**O que testar:**
- Resposta "Fácil" deve subir 2 estágios

**Como testar:**
1. Abrir sessão do Diário
2. Clicar em "😌 FÁCIL"
3. No console:
   ```javascript
   const entrada = window.diario.entradas.find(e => e.srs && e.srs.ultimaResposta === 'facil');
   if (entrada) {
       console.log('Estagio:', entrada.srs.estagio);
       console.log('Intervalo:', entrada.srs.intervalo);
   }
   ```

**Verificar:**
- ✅ `estagio` subiu 2 (ou ficou no máximo se já estava em 9-10)
- ✅ `intervalo` corresponde ao novo estágio
- ✅ `proximaRevisao` = hoje + intervalo

**Resultado esperado:**
- Estágio aumentou em 2
- Intervalo atualizado corretamente

---

### TESTE 7: Tópico Revisado Hoje NÃO Aparece na Tarefas

**O que testar:**
- Após revisar um tópico hoje, ele não deve aparecer mais na aba Tarefas até o dia seguinte

**Como testar:**
1. Aba Tarefas → Ver quantos tópicos do Diário aparecem para um tema
2. Anotar o número (ex: "3 tópicos")
3. Abrir sessão do Diário e revisar 1 tópico desse tema
4. Voltar para aba Tarefas
5. Verificar se o número diminuiu (ex: "2 tópicos")

**Verificar:**
- ✅ Tópico revisado hoje não aparece mais na contagem
- ✅ `proximaRevisao` do tópico revisado > hoje

**Resultado esperado:**
- Tópico revisado some da lista de pendências até o dia seguinte

---

### TESTE 8: Editar Entrada - Ativar SRS

**O que testar:**
- Editar entrada sem SRS e marcar checkbox deve criar SRS

**Como testar:**
1. Criar entrada SEM checkbox (sem SRS)
2. Editar essa entrada
3. Marcar checkbox "📅 Incluir nas revisões"
4. Salvar
5. No console:
   ```javascript
   const entrada = window.diario.entradas.find(e => e.topico === 'Teste VRVS 3P');
   console.log('SRS após editar:', entrada.srs);
   ```

**Verificar:**
- ✅ `entrada.srs` existe
- ✅ `entrada.srs.engine === 'VRVS_FSRS3_v1'`
- ✅ `entrada.srs.ativo === true`

**Resultado esperado:**
- SRS criado ao marcar checkbox na edição

---

### TESTE 9: Editar Entrada - Desativar SRS

**O que testar:**
- Editar entrada com SRS e desmarcar checkbox deve desativar SRS

**Como testar:**
1. Criar entrada COM checkbox (com SRS)
2. Editar essa entrada
3. Desmarcar checkbox
4. Salvar
5. No console:
   ```javascript
   const entrada = window.diario.entradas.find(e => e.topico === 'Teste VRVS 3P');
   console.log('SRS após desmarcar:', entrada.srs);
   ```

**Verificar:**
- ✅ `entrada.srs.ativo === false`
- ✅ SRS não foi deletado (ainda existe para histórico)

**Resultado esperado:**
- SRS desativado mas mantido para histórico

---

### TESTE 10: Migração Idempotente

**O que testar:**
- Migração pode rodar múltiplas vezes sem problema

**Como testar:**
1. No console:
   ```javascript
   // Rodar migração manualmente
   migrarSRSParaVRVS3P();
   migrarSRSParaVRVS3P();
   migrarSRSParaVRVS3P();
   ```
2. Verificar se não há erros
3. Verificar se dados não foram duplicados ou corrompidos

**Verificar:**
- ✅ Nenhum erro no console
- ✅ Dados permanecem consistentes
- ✅ Não cria duplicatas

**Resultado esperado:**
- Migração segura para rodar múltiplas vezes

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### Problema: Migração não roda
**Solução:** Verificar se `carregarDiario()` está chamando `migrarSRSParaVRVS3P()`

### Problema: Estágio não atualiza após resposta
**Solução:** Verificar se `registrarRespostaSrsDiario()` está chamando `atualizarSRS_VRVS3P()`

### Problema: Checkbox não cria SRS
**Solução:** Verificar se código de criação está usando `inicializarSrsVRVS3P()`

### Problema: Tópico revisado ainda aparece na Tarefas
**Solução:** Verificar se `proximaRevisao` está sendo atualizada corretamente (deve ser > hoje após revisar)

---

## ✅ CRITÉRIOS DE SUCESSO

FASE 1 está funcionando se:

1. ✅ Migração roda automaticamente ao carregar
2. ✅ Novas entradas com checkbox criam SRS VRVS 3P completo
3. ✅ Respostas atualizam estágio corretamente:
   - Esqueci: volta 0 ou desce 2
   - Lembrei: sobe 1
   - Fácil: sobe 2
4. ✅ `proximaRevisao` sempre atualiza após resposta
5. ✅ `ultimaRevisaoData` sempre atualiza após resposta
6. ✅ Tópicos revisados hoje não aparecem mais na Tarefas
7. ✅ Checkbox funciona na criação e edição

---

**Próximo passo:** Se todos os testes passarem, seguir para FASE 2 (ajustar filtros).

