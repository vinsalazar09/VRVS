# 🧹 PROTOCOLO DE LIMPEZA DE DOCUMENTOS TEMPORÁRIOS

**Criado em:** 12 de Dezembro de 2025  
**Status:** Ativo  
**Responsável:** Cursor AI

---

## 📋 REGRAS DE JULGAMENTO CRÍTICO

### ✅ MANTER (Documentos Importantes)
- Documentos de planejamento finalizados e aprovados
- Documentação técnica permanente
- Protocolos e regras de trabalho
- Arquivos na pasta `docs/` ou `DIARIO/CURSOR/` que são referência
- Documentos que serão usados em sessões futuras

### ❌ DELETAR (Documentos Temporários)
- Cópias no Desktop que são apenas para visualização rápida
- Documentos de comunicação intermediária (ex: "ENVIAR_PARA_OPUS.md")
- Versões temporárias de documentos que já estão na pasta correta
- Arquivos de verificação/resposta que já foram processados
- Qualquer arquivo `.md` no Desktop que seja cópia de arquivo em `docs/` ou `DIARIO/`

---

## 🔍 CRITÉRIOS DE IDENTIFICAÇÃO

### Arquivo Temporário se:
1. Está no Desktop (`/Users/viniciussalazar/Desktop/`)
2. É um arquivo `.md` de comunicação/verificação
3. É uma cópia de arquivo que já existe em `docs/` ou `DIARIO/CURSOR/`
4. Nome contém: "ENVIAR", "RESPOSTA", "TEMPORARIO", "TEMP"
5. Foi criado apenas para facilitar acesso rápido nesta sessão

### Arquivo Importante se:
1. Está em `docs/` ou `DIARIO/CURSOR/`
2. É documentação técnica permanente
3. É protocolo ou regra de trabalho
4. Será referenciado em sessões futuras
5. Contém conhecimento que deve ser preservado

---

## 🧹 PROCESSO DE LIMPEZA

### Ao Encerrar Chat:
1. Listar todos os arquivos `.md` criados na sessão
2. Verificar se existe versão em `docs/` ou `DIARIO/CURSOR/`
3. Se existe versão permanente → deletar cópia do Desktop
4. Se é documento de comunicação temporária → deletar
5. Se é documento importante sem versão permanente → mover para pasta correta
6. Confirmar com usuário antes de deletar se houver dúvida

---

## 📝 CHECKLIST DE LIMPEZA

- [ ] Identificar arquivos criados na sessão
- [ ] Verificar se são cópias de arquivos permanentes
- [ ] Identificar documentos de comunicação temporária
- [ ] Deletar cópias temporárias do Desktop
- [ ] Manter apenas documentos importantes em pastas corretas
- [ ] Confirmar limpeza com usuário

---

## ⚠️ REGRAS DE SEGURANÇA

1. **NUNCA deletar** sem confirmar se houver dúvida
2. **SEMPRE manter** documentos em `docs/` ou `DIARIO/CURSOR/`
3. **SEMPRE deletar** cópias temporárias do Desktop
4. **PERGUNTAR** ao usuário se não tiver certeza

---

**Status:** ✅ Protocolo ativo - Aplicar ao encerrar cada chat
