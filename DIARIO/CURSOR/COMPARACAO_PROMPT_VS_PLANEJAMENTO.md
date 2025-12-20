# 🔍 COMPARAÇÃO: PROMPT DO USUÁRIO vs PLANEJAMENTO CURSOR

**Data:** 2024-12-20  
**Objetivo:** Validar alinhamento antes de executar rollback

---

## ✅ COMPARAÇÃO ITEM A ITEM

### 1. BASELINE ESCOLHIDO

| Item | Prompt Usuário | Planejamento Cursor | Status |
|------|----------------|---------------------|--------|
| Hash | `0dadca9` | `0dadca9` | ✅ BATE |
| Validação | `git cat-file -t 0dadca9` | Mesmo | ✅ BATE |
| Resultado | Esperado: "commit" | ✅ Confirmado: "commit" | ✅ OK |

**✅ ALINHADO**

---

### 2. ARQUIVOS ALVO

| Item | Prompt Usuário | Planejamento Cursor | Status |
|------|----------------|---------------------|--------|
| Restaurar | `docs/index.html`, `docs/sw.js` | Mesmos | ✅ BATE |
| Criar | `docs/dump_localstorage.html` (NOVO) | Mesmo | ✅ BATE |
| Criar | `docs/recovery_sw.html` (NOVO) | Mesmo | ✅ BATE |

**✅ ALINHADO**

---

### 3. REGRAS CRÍTICAS (DADOS)

| Item | Prompt Usuário | Planejamento Cursor | Status |
|------|----------------|---------------------|--------|
| PROIBIDO apagar dados | ✅ | ✅ | ✅ BATE |
| PROIBIDO migrar/sanear | ✅ | ✅ | ✅ BATE |
| PROIBIDO criar novas chaves | ✅ | ✅ | ✅ BATE |
| PROIBIDO rotinas de saneamento no boot | ✅ | ✅ | ✅ BATE |

**✅ ALINHADO**

---

### 4. VERIFICAÇÕES PÓS-RESTAURAÇÃO

| Item | Prompt Usuário | Planejamento Cursor | Status |
|------|----------------|---------------------|--------|
| Verificar "HOTFIX" | ✅ | ✅ (implícito) | ✅ BATE |
| Verificar "PREBOOT" | ✅ | ✅ (implícito) | ✅ BATE |
| Verificar "__vrvsAppBooted" | ✅ | ✅ (implícito) | ✅ BATE |
| Verificar "__vrvsSplashHidden" | ✅ | ✅ (implícito) | ✅ BATE |
| Verificar sintaxe moderna | ❌ | ✅ (`??`, `?.`) | ⚠️ DIFERENÇA |

**⚠️ DIFERENÇA MENOR:** Prompt não menciona verificar sintaxe moderna, mas é uma verificação adicional útil. Vou manter ambas.

**✅ ALINHADO (com verificação extra)**

---

### 5. CACHE_NAME

| Item | Prompt Usuário | Planejamento Cursor | Status |
|------|----------------|---------------------|--------|
| Valor novo | `vrvs-ROLLBACK-STABLE-20251220-2200` | Mesmo | ✅ BATE |
| Verificar existência | Se não existir → STOP | Implícito | ✅ BATE |
| Baseline tem CACHE_NAME? | ✅ Confirmado | ✅ | ✅ OK |

**✅ ALINHADO**

---

### 6. PRECACHE LIST (SW.JS)

| Item | Prompt Usuário | Planejamento Cursor | Status |
|------|----------------|---------------------|--------|
| Verificar lista explícita | ✅ | ✅ | ✅ BATE |
| Incluir se existir | `dump_localstorage.html`, `recovery_sw.html` | Mesmos | ✅ BATE |
| Não inventar se não existir | ✅ | ✅ | ✅ BATE |
| Baseline tem lista? | ✅ Confirmado: `FILES_TO_CACHE` | ✅ | ✅ OK |

**✅ ALINHADO**

---

### 7. FERRAMENTA 1: DUMP LOCALSTORAGE

| Item | Prompt Usuário | Planejamento Cursor | Status |
|------|----------------|---------------------|--------|
| ES5 puro | ✅ (`var`) | ✅ (`var`) | ✅ BATE |
| Não escreve localStorage | ✅ | ✅ | ✅ BATE |
| Botão "Gerar Dump" | ✅ | ✅ | ✅ BATE |
| Textarea com JSON | ✅ | ✅ | ✅ BATE |
| Botão "Copiar" | ✅ | ❌ | ⚠️ FALTA |
| Botão "Baixar .json" | ✅ | ✅ | ✅ BATE |
| Contador de chaves | ✅ | ❌ | ⚠️ FALTA |
| Campo "items" no JSON | ✅ (`items`) | ❌ (`keys`) | ⚠️ DIFERENÇA |

**⚠️ AJUSTES NECESSÁRIOS:**
1. Adicionar botão "Copiar"
2. Adicionar contador de chaves na tela
3. Mudar `keys` para `items` no JSON

**✅ ALINHADO (com ajustes)**

---

### 8. FERRAMENTA 2: RECOVERY SW

| Item | Prompt Usuário | Planejamento Cursor | Status |
|------|----------------|---------------------|--------|
| ES5 puro | ✅ | ✅ | ✅ BATE |
| Não mexe localStorage | ✅ | ✅ | ✅ BATE |
| Botão "Desregistrar SW" | ✅ | ❌ (auto-executa) | ⚠️ DIFERENÇA |
| Botão "Apagar Cache" | ✅ | ❌ (auto-executa) | ⚠️ DIFERENÇA |
| Botão "Rodar Tudo" | ✅ | ❌ (auto-executa) | ⚠️ DIFERENÇA |
| Status passo-a-passo | ✅ | ✅ | ✅ BATE |
| Link cachebust | ✅ (`?cb=`) | ✅ (`?cachebust=`) | ⚠️ DIFERENÇA |

**⚠️ AJUSTES NECESSÁRIOS:**
1. Mudar de auto-executar para botões manuais
2. Mudar `?cachebust=` para `?cb=`

**✅ ALINHADO (com ajustes)**

---

### 9. COMMIT

| Item | Prompt Usuário | Planejamento Cursor | Status |
|------|----------------|---------------------|--------|
| Mensagem | "rollback: restore baseline pre-hotfix + add recovery tools" | "revert: rollback para baseline estável + ferramentas de recuperação (sem tocar localStorage)" | ⚠️ DIFERENÇA |
| Não fazer push automático | ✅ | ✅ | ✅ BATE |

**⚠️ AJUSTE NECESSÁRIO:**
- Usar mensagem do prompt do usuário

**✅ ALINHADO (com ajuste)**

---

### 10. RELATÓRIO FINAL

| Item | Prompt Usuário | Planejamento Cursor | Status |
|------|----------------|---------------------|--------|
| Confirmação baseline | ✅ | ✅ | ✅ BATE |
| Confirmação restore | ✅ | ✅ | ✅ BATE |
| SW (CACHE_NAME antigo/novo) | ✅ | ✅ | ✅ BATE |
| Ferramentas (descrição) | ✅ | ✅ | ✅ BATE |
| Checklist teste | ✅ | ✅ | ✅ BATE |
| Hash commit final | ✅ | ✅ | ✅ BATE |

**✅ ALINHADO**

---

## 📊 RESUMO DA COMPARAÇÃO

### ✅ TOTALMENTE ALINHADO (7 itens)
1. Baseline escolhido
2. Arquivos alvo
3. Regras críticas
4. CACHE_NAME
5. Precache list
6. Relatório final
7. Validações pós-restauração (com verificação extra)

### ⚠️ PRECISA AJUSTE (3 itens)

#### 1. Ferramenta Dump (3 ajustes)
- ✅ Adicionar botão "Copiar"
- ✅ Adicionar contador de chaves na tela
- ✅ Mudar `keys` para `items` no JSON

#### 2. Ferramenta Recovery (2 ajustes)
- ✅ Mudar de auto-executar para botões manuais
- ✅ Mudar `?cachebust=` para `?cb=`

#### 3. Mensagem do Commit (1 ajuste)
- ✅ Usar mensagem do prompt: `"rollback: restore baseline pre-hotfix + add recovery tools"`

---

## ✅ CONCLUSÃO

**Status:** ✅ **ALINHADO COM PEQUENOS AJUSTES**

**Ajustes necessários:**
1. Dump: adicionar botão "Copiar" + contador + mudar `keys` → `items`
2. Recovery: botões manuais + mudar `?cachebust=` → `?cb=`
3. Commit: usar mensagem do prompt

**Tempo estimado para ajustes:** ~5 minutos

**Pronto para executar após ajustes?** ✅ SIM

---

**FIM DA COMPARAÇÃO**

