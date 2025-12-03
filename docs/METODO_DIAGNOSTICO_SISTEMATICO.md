# 🔬 MÉTODO DE DIAGNÓSTICO SISTEMÁTICO - ABA PENDÊNCIAS

**Data:** 2025-12-03  
**Status:** EM ANÁLISE - NÃO IMPLEMENTAR MUDANÇAS SEM SEGUIR ESTE MÉTODO

---

## ⚠️ REGRA FUNDAMENTAL

**NÃO FAZER MUDANÇAS NO CÓDIGO SEM:**
1. ✅ Entender completamente o problema
2. ✅ Identificar diferenças entre itens que funcionam vs não funcionam
3. ✅ Testar hipóteses de forma controlada
4. ✅ Documentar cada tentativa e resultado

---

## 📋 FASE 1: ANÁLISE COMPLETA DO PROBLEMA

### 1.1 Coletar Dados dos Itens

**Itens que NÃO funcionam (8):**
- Fratura de clavícula
- Epifisiolistese
- Sd manguito rotador
- DDQ
- Luxação e Instabilidade do cotovelo
- LAC/LEC
- Epicondilites
- Fraturas do cotovelo

**Itens que FUNCIONAM:**
- Instabilidade patelar
- Fratura de Úmero proximal
- Fratura Supracondiliana
- Fratura da Clavicula
- Espondilolistese
- (outros visíveis na imagem)

### 1.2 Comparar Características

**O que verificar:**
- [ ] Formato do ID (numérico vs string com underscore)
- [ ] Origem do ID (CSV import vs criação manual)
- [ ] Caracteres especiais no nome do tema
- [ ] Área do tema
- [ ] Prioridade
- [ ] Status
- [ ] Data de agenda
- [ ] Estrutura HTML gerada (inspecionar no navegador)
- [ ] Atributos do elemento (data-tema-id, onclick, etc)
- [ ] Event listeners anexados (verificar no console)

### 1.3 Inspecionar HTML Gerado

**No iPhone (via Safari DevTools conectado ao Mac):**
- [ ] Verificar HTML gerado para itens que funcionam
- [ ] Verificar HTML gerado para itens que não funcionam
- [ ] Comparar diferenças linha por linha
- [ ] Verificar se `data-tema-id` está presente e correto
- [ ] Verificar se event listeners estão anexados
- [ ] Verificar se há elementos sobrepostos (z-index)

---

## 📋 FASE 2: TESTES CONTROLADOS

### 2.1 Teste 1: Verificar IDs

**Hipótese:** IDs com underscore causam problema

**Teste:**
1. Identificar IDs dos itens que não funcionam
2. Identificar IDs dos itens que funcionam
3. Comparar formatos
4. Verificar se há padrão

**Resultado esperado:** Confirmar ou descartar hipótese

### 2.2 Teste 2: Verificar Event Listeners

**Hipótese:** Event listeners não estão sendo anexados corretamente

**Teste:**
1. No console do iPhone, executar:
```javascript
document.querySelectorAll('.task-theme-item').forEach((item, i) => {
    const temaId = item.getAttribute('data-tema-id');
    const temaNome = item.querySelector('.task-theme-name')?.textContent;
    console.log(`Item ${i}: ${temaNome} | ID: ${temaId}`);
    
    // Verificar listeners
    const listeners = getEventListeners(item);
    console.log(`Listeners:`, listeners);
});
```

**Resultado esperado:** Ver se há diferença nos listeners entre itens que funcionam e não funcionam

### 2.3 Teste 3: Testar Evento Manualmente

**Hipótese:** Evento não está sendo disparado

**Teste:**
1. No console, selecionar um item que não funciona
2. Tentar disparar evento manualmente:
```javascript
const itemProblematico = Array.from(document.querySelectorAll('.task-theme-item')).find(item => {
    const nome = item.querySelector('.task-theme-name')?.textContent;
    return nome && nome.includes('Epifisiolistese');
});

if (itemProblematico) {
    const temaId = itemProblematico.getAttribute('data-tema-id');
    console.log('Testando toggle manual:', temaId);
    window.togglePendencia(temaId);
}
```

**Resultado esperado:** Ver se função funciona quando chamada manualmente

### 2.4 Teste 4: Verificar Timing

**Hipótese:** Event listeners são adicionados antes dos elementos existirem

**Teste:**
1. Adicionar logs de timing:
```javascript
console.log('[TIMING] renderPendencias iniciado');
console.log('[TIMING] inicializarEventListenersPendencias iniciado');
console.log('[TIMING] Elementos encontrados:', document.querySelectorAll('.task-theme-item').length);
```

**Resultado esperado:** Verificar ordem de execução

---

## 📋 FASE 3: COMPARAÇÃO MACBOOK vs IPHONE

### 3.1 Verificar Diferenças de Comportamento

**No MacBook:**
- [ ] Inspecionar HTML gerado
- [ ] Verificar event listeners
- [ ] Testar eventos no console
- [ ] Verificar logs

**No iPhone:**
- [ ] Inspecionar HTML gerado (via Safari DevTools)
- [ ] Verificar event listeners
- [ ] Testar eventos no console
- [ ] Verificar logs

**Comparar:**
- [ ] HTML é idêntico?
- [ ] Event listeners são os mesmos?
- [ ] Comportamento é diferente?

---

## 📋 FASE 4: HIPÓTESES E TESTES

### Hipótese A: IDs com underscore
- **Teste:** Comparar IDs dos itens que funcionam vs não funcionam
- **Resultado:** [Aguardando teste]

### Hipótese B: Event listeners não anexados
- **Teste:** Verificar listeners no console
- **Resultado:** [Aguardando teste]

### Hipótese C: Timing de inicialização
- **Teste:** Verificar ordem de execução
- **Resultado:** [Aguardando teste]

### Hipótese D: Diferença no HTML gerado
- **Teste:** Comparar HTML linha por linha
- **Resultado:** [Aguardando teste]

### Hipótese E: Elementos sobrepostos
- **Teste:** Verificar z-index e elementos no mesmo ponto
- **Resultado:** [Aguardando teste]

---

## 📋 FASE 5: SOLUÇÃO BASEADA EM EVIDÊNCIAS

**SOMENTE APÓS COMPLETAR FASES 1-4:**

1. ✅ Identificar causa raiz baseada em evidências
2. ✅ Criar solução cirúrgica (mudança mínima necessária)
3. ✅ Testar solução de forma controlada
4. ✅ Documentar solução e motivo

---

## 📋 PRÓXIMOS PASSOS IMEDIATOS

1. **Criar script de diagnóstico** que coleta dados de todos os itens
2. **Executar diagnóstico no MacBook** primeiro (mais fácil)
3. **Comparar dados** entre itens que funcionam vs não funcionam
4. **Identificar padrão** claro
5. **Só então** propor solução baseada em evidências

---

## ✅ CONFIRMAÇÃO

**Entendi completamente:**
- ✅ Não fazer mudanças aleatórias
- ✅ Seguir método sistemático
- ✅ Testar antes de mudar
- ✅ Documentar tudo
- ✅ Comparar itens que funcionam vs não funcionam
- ✅ Se necessário, montar caso completo para consulta externa

**Status:** Aguardando aprovação para iniciar Fase 1

