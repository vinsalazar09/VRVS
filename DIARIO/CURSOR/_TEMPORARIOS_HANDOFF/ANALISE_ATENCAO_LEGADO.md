# 🔍 ANÁLISE: Campo `atencao` (Legado)

**Data:** 20/12/2024  
**Status:** Legado descontinuado (não usado funcionalmente)  
**Recomendação:** APOSENTAR completamente

---

## 📊 ESTADO ATUAL

### O que é `atencao`?
Campo booleano (`atencao: true/false`) que era usado para marcar entradas como "revisar amanhã" antes da implementação do VRVS 3P.

### Estado Funcional Atual
- ❌ **NÃO é mais setado** pelo checkbox "Incluir nas revisões programadas"
- ❌ **NÃO é mais usado** para filtrar entradas na sessão
- ❌ **NÃO é mais usado** para contar indicadores
- ❌ **NÃO é mais renderizado** como chip ⚠️
- ✅ **Ainda existe** no código (preservado para retrocompatibilidade)
- ✅ **Ainda é exportado** em CSV (preservado para retrocompatibilidade)

---

## 🔍 ONDE AINDA APARECE NO CÓDIGO

### 1. Função `isAttention()` (linha ~10602)
```javascript
function isAttention(entrada) {
    // PATCH 4: Descontinuado - sempre retorna false (legado removido)
    return false;
}
```
**Status:** Sempre retorna false (legado descontinuado)

### 2. Importação CSV (linha ~6459)
```javascript
atencao: getVal(r, 'atencao', 'atenção', 'atencao') === 'true' || getVal(r, 'atencao', 'atenção') === '1',
```
**Status:** Lê `atencao` do CSV mas não usa funcionalmente (preservado para compatibilidade)

### 3. Exportação CSV (linha ~13345)
```javascript
e.atencao ? 'true' : 'false',
```
**Status:** Exporta `atencao` para preservar retrocompatibilidade (dados antigos podem ter `atencao: true`)

### 4. Funções de Debug (linhas ~10319, 10354)
```javascript
// debugVRVS3P.devidasHoje()
if (e.atencao) return true;

// debugVRVS3P.compararSessaoListagem()
if (e.atencao) return true;
```
**Status:** Usado apenas para debug (não afeta funcionalidade)

### 5. Contexto do Tema (linha ~4480)
```javascript
contexto.atencao = window.diario.entradas.filter(e => 
    e.area === area && 
    e.tema === tema && 
    e.atencao === true
);
```
**Status:** Coleta entradas com `atencao` mas não usa funcionalmente (preservado para contexto)

---

## ⚠️ CONFLITO COM VRVS 3P

### Antes (Sistema Legado)
- Checkbox setava `atencao: true`
- Entradas com `atencao: true` apareciam na sessão
- Contador "atenção" mostrava quantas entradas tinham `atencao: true`

### Agora (VRVS 3P)
- Checkbox seta `srs.ativo: true`
- Entradas com `srs.ativo: true` E `proximaRevisao <= hoje` aparecem na sessão
- Contador "ativos" mostra quantas entradas têm `srs.ativo: true`

### Conflito Identificado
- **Antes:** `atencao` e `srs` eram sistemas paralelos (podiam coexistir)
- **Agora:** `srs` é o sistema principal, `atencao` é legado ignorado
- **Problema:** Entradas antigas podem ter `atencao: true` mas `srs.ativo: false`, causando confusão

---

## 💡 RECOMENDAÇÃO FINAL

### Opção A: MANTER `atencao` como Flag Manual Independente
**Prós:**
- Preserva funcionalidade antiga
- Permite marcação manual sem VRVS 3P

**Contras:**
- Dois sistemas paralelos (confusão)
- `atencao` não integra com algoritmo VRVS 3P
- Mantém código legado desnecessário

**Veredito:** ❌ NÃO RECOMENDADO

### Opção B: APOSENTAR `atencao` Completamente
**Prós:**
- Código mais limpo e manutenível
- Um único sistema (VRVS 3P)
- Menos confusão para usuário

**Contras:**
- Dados antigos com `atencao: true` ficam "órfãos"
- Perde funcionalidade de marcação manual (mas pode ser substituída por VRVS 3P)

**Veredito:** ✅ RECOMENDADO

---

## 📋 PLANO MÍNIMO PARA APOSENTAR `atencao`

### Patch Futuro (Baixa Prioridade)

**1. Remover Referências Funcionais:**
- Remover `isAttention()` (já sempre retorna false)
- Remover filtros que usam `atencao` (linhas 10319, 10354, 4480)
- Manter apenas importação/exportação CSV (compatibilidade)

**2. Limpar Funções de Debug:**
- Atualizar `debugVRVS3P.devidasHoje()` para não mostrar `atencao`
- Atualizar `debugVRVS3P.compararSessaoListagem()` para não usar `atencao`

**3. Preservar Dados Antigos:**
- NÃO deletar `atencao` de entradas existentes (READ-ONLY)
- NÃO migrar `atencao: true` para `srs.ativo: true` (usuário decide)
- Manter exportação CSV com `atencao` (retrocompatibilidade)

**4. Documentação:**
- Adicionar comentário: `// LEGADO: Campo atencao descontinuado, usar srs.ativo`
- Documentar em changelog que `atencao` não é mais usado

**Estimativa:** 30-60 minutos  
**Risco:** Baixo (sistema já ignora `atencao`)  
**Prioridade:** Baixa (não afeta funcionalidade atual)

---

## ✅ CONCLUSÃO

**Recomendação:** APOSENTAR `atencao` completamente (Opção B)

**Justificativa:**
- Sistema já ignora `atencao` funcionalmente
- VRVS 3P (`srs.ativo`) é sistema principal e mais robusto
- Código mais limpo e manutenível
- Impacto baixo (dados antigos preservados, não afeta funcionalidade)

**Próximo Passo:** Implementar plano mínimo quando houver tempo (baixa prioridade)

