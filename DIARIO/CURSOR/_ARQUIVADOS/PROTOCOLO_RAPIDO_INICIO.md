# PROTOCOLO RÁPIDO DE INÍCIO — CURSOR

**⚠️ EXECUÇÃO AUTOMÁTICA:** Quando usuário disser "protocolo de inicio de chat" ou similar

---

## EXECUÇÃO AUTOMÁTICA (SEM PERGUNTAR)

### PASSO 1: Ler documentos essenciais (em paralelo)
```python
# Ler protocolo completo (gestão)
read_file("DIARIO/CURSOR/00_LEIA_PRIMEIRO_SEMPRE.txt")

# Ler estado atual
read_file("DIARIO/01_ESTADO_ATUAL.txt")

# Ler último resumo de sessão
glob_file_search("RESUMO_SESSAO_*.txt") → ler mais recente

# Ler caderno de erros/acertos
read_file("DIARIO/CURSOR/CADERNO_ERROS_ACERTOS.txt")
```

### PASSO 2: Ler contexto técnico (se houver handoff)
```python
# Buscar handoff mais recente
glob_file_search("HANDOFF_CURSOR_*.md") → ler mais recente

# Se não houver handoff, ler documentos técnicos básicos
read_file("docs/ERROS_E_ACERTOS_TECNICOS.md")  # apenas seção relevante
```

### PASSO 3: Confirmar compreensão (resposta automática)
```
✅ Protocolo executado

📊 Estado: [1-2 linhas do estado atual]

📋 Próximos passos: [do handoff ou estado atual]

✅ Pronto para trabalhar
```

**TEMPO ESTIMADO:** ~30 segundos  
**TOKENS:** ~2000-3000 (mínimo necessário)

---

## DOCUMENTOS DE REFERÊNCIA (CONSULTAR QUANDO NECESSÁRIO)

### Método de Trabalho Detalhado:
- `PROTOCOLO_INICIO_CHAT_CURSOR_20260121.md` — método completo (consultar quando precisar de detalhes)

### Contexto Técnico:
- `HANDOFF_CURSOR_NOVA_RODADA_AJUSTES_20260121.md` — contexto técnico específico da rodada

### Documentação Técnica:
- `docs/ERROS_E_ACERTOS_TECNICOS.md` — erros e acertos técnicos
- `docs/ARQUITETURA_DADOS.md` — arquitetura de dados
- `docs/DOCUMENTACAO_COMPLETA.md` — documentação completa

**REGRA:** Não ler tudo sempre. Ler apenas quando necessário para resolver problema específico.

---

## CHECKLIST RÁPIDO DE COMPREENSÃO

Após executar protocolo, confirmar mentalmente:
- [ ] Entendi método de trabalho (preview analítico obrigatório)
- [ ] Entendi estado atual da plataforma
- [ ] Entendi problema atual (se houver handoff)
- [ ] Entendi próximos passos

**Se não entender algo:** Consultar documento de referência específico quando necessário.

---

**FIM DO PROTOCOLO RÁPIDO**

