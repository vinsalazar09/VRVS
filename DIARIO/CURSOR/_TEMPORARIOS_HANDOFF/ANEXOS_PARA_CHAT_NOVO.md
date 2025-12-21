# 📎 ANEXOS PARA CHAT NOVO - VRVS Diário

**Data:** 20/12/2024  
**Objetivo:** Lista de arquivos relevantes para anexar no ChatGPT novo

---

## 📄 ARQUIVOS OBRIGATÓRIOS (ANEXAR)

### 1. `DIARIO/CURSOR/HANDOFF_CHAT_NOVO_VRVS_20251220.md`
**Por quê:** Estado congelado completo, âncoras no código, decisões pendentes, riscos.

### 2. `DIARIO/CURSOR/PROTOCOLO_ENCERRAMENTO_20241220.md`
**Por quê:** Resumo executivo da sessão anterior, patches aplicados, acertos e conquistas.

### 3. `DIARIO/CURSOR/MATERIAL_MASTER_INVESTIGACAO_VRVS3P.md`
**Por quê:** Contexto completo do problema original (bug de agrupamento), investigação VRVS 3P.

### 4. `DIARIO/CURSOR/RELATORIO_FASE_1_3_MELHORIAS_E_PLANO_OPUS.md`
**Por quê:** Plano completo do Treino Livre Customizado (próxima meta - Patch 5A).

### 5. `DIARIO/CURSOR/CHECKLIST_TESTE_IPHONE_PATCH_3_1_2.md`
**Por quê:** Checklist de validação no iPhone (10-15 itens).

---

## 📄 ARQUIVOS OPCIONAIS (SE RELEVANTE)

### 6. `DIARIO/CURSOR/RELATORIO_COMPLETO_PATCHES_DEZEMBRO_2024.md`
**Por quê:** Histórico completo de patches aplicados em dezembro.

### 7. `docs/index.html` (trechos específicos)
**Por quê:** Se precisar mostrar código específico (âncoras já documentadas no HANDOFF).

### 8. `docs/sw.js`
**Por quê:** Se precisar validar CACHE_NAME ou Service Worker.

---

## ⚠️ ARQUIVOS QUE NÃO EXISTEM (MAS SÃO ÚTEIS)

### 9. `DIARIO/CURSOR/ANALISE_ATENCAO_LEGADO.md` (NÃO EXISTE)
**O que falta:** Análise detalhada do campo `atencao` legado:
- Onde ainda aparece no código
- Impacto de remover completamente
- Plano de migração mínima
- Testes de regressão necessários

**Como obter:** Criar novo documento com análise baseada em grep do código.

---

## 📋 ORDEM DE ANEXAÇÃO SUGERIDA

1. **HANDOFF_CHAT_NOVO_VRVS_20251220.md** (obrigatório - contexto completo)
2. **PROTOCOLO_ENCERRAMENTO_20241220.md** (obrigatório - histórico)
3. **MATERIAL_MASTER_INVESTIGACAO_VRVS3P.md** (obrigatório - contexto problema)
4. **RELATORIO_FASE_1_3_MELHORIAS_E_PLANO_OPUS.md** (obrigatório - próxima meta)
5. **CHECKLIST_TESTE_IPHONE_PATCH_3_1_2.md** (obrigatório - validação)
6. **RELATORIO_COMPLETO_PATCHES_DEZEMBRO_2024.md** (opcional - histórico completo)

---

## 🎯 RESUMO PARA CHATGPT

**Copiar e colar no início do prompt:**

```
Anexei os seguintes documentos:
1. HANDOFF_CHAT_NOVO_VRVS_20251220.md - Estado congelado e contexto completo
2. PROTOCOLO_ENCERRAMENTO_20241220.md - Resumo da sessão anterior
3. MATERIAL_MASTER_INVESTIGACAO_VRVS3P.md - Contexto do problema original
4. RELATORIO_FASE_1_3_MELHORIAS_E_PLANO_OPUS.md - Próxima meta (Treino Livre)
5. CHECKLIST_TESTE_IPHONE_PATCH_3_1_2.md - Checklist de validação

Leia primeiro o HANDOFF para entender o estado atual.
```

