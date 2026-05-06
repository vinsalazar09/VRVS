# 🔄 PROTOCOLO AUTOMÁTICO — HANDOFF PARA CHAT NOVO

**Data:** 2025-12-30  
**Status:** ✅ Implementado e ativo

---

## 🎯 OBJETIVO

Quando você disser **"vou abrir chat novo GPT"** ou **"vou abrir chat novo Opus"**, o Cursor automaticamente:

1. ✅ Atualiza a pasta correspondente (`_HANDOFF_GPT/` ou `_HANDOFF_OPUS/`)
2. ✅ Copia documentos estruturais mais recentes
3. ✅ Atualiza HANDOFF com estado atual
4. ✅ Lista arquivos prontos para anexar

---

## 📋 GATILHOS (EXECUÇÃO AUTOMÁTICA)

**Gatilhos principais:**
- "vou abrir chat novo GPT"
- "vou abrir chat novo Opus"
- "preparar handoff GPT"
- "preparar handoff Opus"
- "chat novo GPT"
- "chat novo Opus"
- Qualquer frase contendo "chat novo" + ("GPT"/"ChatGPT"/"Opus"/"Claude")

**⚠️ REGRA:** Se detectar QUALQUER um desses gatilhos, execute AUTOMATICAMENTE os passos abaixo.

---

## 🔄 PASSOS AUTOMÁTICOS

### PASSO 1: Identificar Ferramenta
- Detectar se é GPT ou Opus na mensagem
- Selecionar pasta correspondente (`_HANDOFF_GPT/` ou `_HANDOFF_OPUS/`)

### PASSO 2: Atualizar Documentos Estruturais
- ✅ Copiar `00_LEIA_PRIMEIRO_SEMPRE.txt` (mais recente)
- ✅ Copiar `BASE_CONHECIMENTO_PLATAFORMA.md` (mais recente)
- ✅ Copiar `CADERNO_ERROS_ACERTOS.txt` (mais recente)

### PASSO 3: Atualizar HANDOFF
- ✅ GPT: Copiar `_TEMPORARIOS_HANDOFF/HANDOFF_CHAT_GPT_*.md` (mais recente)
- ✅ Opus: Copiar `_TEMPORARIOS_HANDOFF/HANDOFF_OPUS_*.md` (se existir)

### PASSO 4: Verificar Documentos Novos
- ✅ Se houver documentos estruturais novos ou mudanças significativas:
  - Atualizar ambas as pastas (_HANDOFF_GPT/ e _HANDOFF_OPUS/)
  - Avisar usuário que precisa atualizar arquivos nas pastas de handoff

### PASSO 5: Listar Arquivos Prontos
- ✅ Mostrar ordem de anexação
- ✅ Mostrar caminhos completos dos arquivos
- ✅ Confirmar que tudo está atualizado

---

## 📁 ESTRUTURA DE PASTAS

```
DIARIO/CURSOR/
├── _HANDOFF_GPT/              ← Documentos para ChatGPT
│   ├── 00_LEIA_PRIMEIRO_SEMPRE.txt
│   ├── BASE_CONHECIMENTO_PLATAFORMA.md
│   ├── CADERNO_ERROS_ACERTOS.txt
│   ├── HANDOFF_CHAT_GPT_YYYYMMDD.md
│   └── README.md
│
├── _HANDOFF_OPUS/             ← Documentos para Claude Opus
│   ├── 00_LEIA_PRIMEIRO_SEMPRE.txt
│   ├── BASE_CONHECIMENTO_PLATAFORMA.md
│   ├── CADERNO_ERROS_ACERTOS.txt
│   ├── HANDOFF_OPUS_YYYYMMDD.md (quando houver)
│   └── README.md
│
└── _TEMPORARIOS_HANDOFF/       ← Documentos temporários de comunicação
    └── HANDOFF_CHAT_GPT_*.md
    └── HANDOFF_OPUS_*.md
```

---

## ✅ CHECKLIST DE ATUALIZAÇÃO

Antes de listar arquivos prontos, verificar:

- [ ] Documentos estruturais copiados e atualizados
- [ ] HANDOFF mais recente copiado
- [ ] README.md atualizado (se necessário)
- [ ] Caminhos dos arquivos corretos
- [ ] Ordem de anexação clara

---

## 📝 EXEMPLO DE RESPOSTA AUTOMÁTICA

```
✅ Handoff atualizado para ChatGPT!

📦 Arquivos prontos para anexar (nesta ordem):

1. DIARIO/CURSOR/_HANDOFF_GPT/00_LEIA_PRIMEIRO_SEMPRE.txt
2. DIARIO/CURSOR/_HANDOFF_GPT/BASE_CONHECIMENTO_PLATAFORMA.md
3. DIARIO/CURSOR/_HANDOFF_GPT/CADERNO_ERROS_ACERTOS.txt
4. DIARIO/CURSOR/_HANDOFF_GPT/HANDOFF_CHAT_GPT_20251230.md

📋 Prompt inicial: Ver COMO_ALINHAR_CHAT_GPT.md em _TEMPORARIOS_HANDOFF/

✅ Tudo atualizado e pronto!
```

---

**⚠️ IMPORTANTE:** Este protocolo é sobre ORGANIZAR e ATUALIZAR documentos, não sobre modificar código de produção.

