# 📚 LIÇÕES APRENDIDAS - DEBUGGING E RESOLUÇÃO DE PROBLEMAS

**Data:** 12 de Dezembro de 2025  
**Contexto:** Correção de bugs em gráficos VRVS v5.3  
**Status:** REGRA OBRIGATÓRIA - APLICAR SEMPRE

---

## 🎯 PRINCÍPIO FUNDAMENTAL

**SEMPRE INVESTIGAR ANTES DE CORRIGIR**

---

## ❌ ERROS COMETIDOS

### 1. **Não investiguei antes de corrigir**
- Assumi que sabia o problema sem verificar o código
- Tentei soluções superficiais sem entender a causa raiz
- Não rastreei o ciclo de vida completo das variáveis

### 2. **Soluções superficiais**
- Tentei "sempre renderizar" sem entender por que não funcionava
- Usei try/catch que mascarou o problema real
- Não verifiquei conflitos entre diferentes partes do código

### 3. **Não verifiquei contexto completo**
- Não vi que mesma instância era usada em dois lugares
- Não rastreei onde instância era destruída
- Não verifiquei conflito entre abas diferentes

---

## ✅ PROCESSO CORRETO (OBRIGATÓRIO)

### **PASSO 1: INVESTIGAR PRIMEIRO**
1. Ler código completo relacionado ao problema
2. Mapear todas as referências à variável/função
3. Rastrear ciclo de vida completo (criação → uso → destruição)
4. Verificar conflitos entre diferentes partes do código

### **PASSO 2: ENTENDER CAUSA RAIZ**
1. Não assumir - verificar
2. Pensar em sistemas, não apenas sintomas
3. Identificar o problema real, não apenas o sintoma

### **PASSO 3: CORRIGIR COM PRECISÃO**
1. Corrigir causa raiz, não sintoma
2. Testar cada correção isoladamente
3. Verificar impacto em outras partes do código

---

## 🔍 CHECKLIST DE INVESTIGAÇÃO

Antes de qualquer correção, verificar:

- [ ] Li o código completo relacionado?
- [ ] Mapeei todas as referências à variável/função?
- [ ] Rastreei o ciclo de vida completo?
- [ ] Verifiquei conflitos entre diferentes partes?
- [ ] Entendi a causa raiz, não apenas o sintoma?
- [ ] Pensei em sistemas, não apenas em sintomas?

---

## 📝 EXEMPLO DO PROBLEMA REAL

**Problema reportado:** Gráfico some ao clicar "Nenhuma" e não volta

**Sintoma:** Gráfico não aparece após clicar "Todas"

**Causa raiz identificada (após investigação):**
- `chartLinhaInst` é variável global única
- Usada para dois gráficos diferentes (Stats e Analytics)
- Quando um é destruído, afeta o outro
- Conflito de instâncias compartilhadas

**Solução correta:**
- Criar instâncias separadas:
  - `chartLinhaInst` → Stats
  - `chartLinhaAnalyticsInst` → Analytics

---

## 🎓 LIÇÕES APRENDIDAS

1. **Sempre investigar antes de corrigir**
   - Ler código completo primeiro
   - Mapear todas as referências
   - Entender fluxo completo

2. **Não assumir**
   - Verificar antes de corrigir
   - Testar hipóteses antes de implementar

3. **Pensar em sistemas, não apenas sintomas**
   - Problema não era só "gráfico não volta"
   - Era "instância compartilhada causando conflito"
   - Preciso pensar na arquitetura, não só no sintoma

4. **Seguir processo sistemático**
   - Investigar → Entender → Corrigir
   - Não pular etapas

---

## ⚠️ REGRAS CRÍTICAS

1. **NUNCA** corrigir sem investigar primeiro
2. **NUNCA** assumir que sei o problema
3. **SEMPRE** rastrear ciclo de vida completo
4. **SEMPRE** verificar conflitos entre partes
5. **SEMPRE** pensar em sistemas, não sintomas

---

## 🔄 PROCESSO OBRIGATÓRIO

```
PROBLEMA REPORTADO
    ↓
INVESTIGAR (ler código, mapear referências, rastrear ciclo)
    ↓
ENTENDER CAUSA RAIZ (não sintoma)
    ↓
CORRIGIR COM PRECISÃO (causa raiz, não sintoma)
    ↓
TESTAR E VERIFICAR
```

---

**Esta lição deve ser aplicada em TODOS os projetos e correções futuras.**

**Data de criação:** 12/12/2025  
**Última atualização:** 12/12/2025

