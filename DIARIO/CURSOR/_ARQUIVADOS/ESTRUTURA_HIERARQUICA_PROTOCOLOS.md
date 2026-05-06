# ESTRUTURA HIERÁRQUICA DE PROTOCOLOS — ACESSO EFICIENTE

**Objetivo:** Facilitar acesso e compreensão sem desperdiçar tokens

---

## NÍVEL 1 — PROTOCOLOS RÁPIDOS (EXECUÇÃO AUTOMÁTICA)

### Quando usuário disser "protocolo de inicio de chat":
→ Executar: `PROTOCOLO_RAPIDO_INICIO.md`
- **Tempo:** ~30 segundos
- **Tokens:** ~2000-3000
- **Ação:** Ler apenas documentos essenciais, confirmar compreensão

### Quando usuário disser "protocolo de encerramento de chat":
→ Executar: `PROTOCOLO_RAPIDO_ENCERRAMENTO.md`
- **Tempo:** ~1-2 minutos
- **Tokens:** ~1000-2000
- **Ação:** Criar resumos, atualizar documentos, organizar

**REGRA:** Protocolos rápidos são AUTOMÁTICOS. Não perguntar. Apenas executar e confirmar.

---

## NÍVEL 2 — DOCUMENTOS DE REFERÊNCIA (CONSULTAR QUANDO NECESSÁRIO)

### Método de Trabalho:
- `PROTOCOLO_INICIO_CHAT_CURSOR_20260121.md` — método completo detalhado
- **Quando consultar:** Quando precisar entender workflow detalhado, exemplos práticos

### Contexto Técnico:
- `HANDOFF_CURSOR_NOVA_RODADA_AJUSTES_20260121.md` — contexto técnico específico
- **Quando consultar:** Quando houver handoff técnico para rodada específica

### Documentação Técnica:
- `docs/ERROS_E_ACERTOS_TECNICOS.md` — erros e acertos técnicos
- `docs/ARQUITETURA_DADOS.md` — arquitetura de dados
- `docs/DOCUMENTACAO_COMPLETA.md` — documentação completa
- **Quando consultar:** Quando precisar entender problema técnico específico

**REGRA:** Não ler tudo sempre. Ler apenas quando necessário para resolver problema específico.

---

## NÍVEL 3 — DOCUMENTOS DETALHADOS (CONSULTA ESPECÍFICA)

### Sucessos:
- `SUCESSO_*.md` — documentos de sucesso
- **Quando consultar:** Quando precisar entender como problema similar foi resolvido

### Previews Analíticos:
- `PREVIEW_ANALITICO_*.md` — previews analíticos anteriores
- **Quando consultar:** Quando precisar entender padrão de preview analítico

### Handoffs:
- `HANDOFF_*.md` — documentos de handoff
- **Quando consultar:** Quando precisar contexto completo de rodada anterior

**REGRA:** Consultar apenas quando problema específico exigir.

---

## FLUXO DE ACESSO EFICIENTE

```
USUÁRIO: "protocolo de inicio de chat"
    ↓
CURSOR: Executar PROTOCOLO_RAPIDO_INICIO.md (automático)
    ↓
CURSOR: Ler apenas documentos essenciais (4-5 arquivos)
    ↓
CURSOR: Confirmar compreensão (resposta breve)
    ↓
TRABALHAR
    ↓
Se precisar de detalhes → Consultar NÍVEL 2 (quando necessário)
    ↓
Se precisar de exemplo específico → Consultar NÍVEL 3 (quando necessário)
    ↓
USUÁRIO: "protocolo de encerramento de chat"
    ↓
CURSOR: Executar PROTOCOLO_RAPIDO_ENCERRAMENTO.md (automático)
    ↓
CURSOR: Criar resumos, atualizar documentos (automático)
    ↓
CURSOR: Confirmar encerramento (resposta breve)
```

---

## ECONOMIA DE TOKENS

### ❌ NÃO FAZER:
- Ler todos os documentos sempre
- Ler documentos detalhados no início
- Ler múltiplos handoffs quando só precisa de um

### ✅ FAZER:
- Ler apenas protocolo rápido no início
- Consultar documentos de referência quando necessário
- Consultar documentos detalhados apenas para problema específico

---

## INTEGRAÇÃO COM PROTOCOLO EXISTENTE

O protocolo existente (`00_LEIA_PRIMEIRO_SEMPRE.txt`) continua sendo a BASE:
- Gestão automática do projeto
- Organização e limpeza
- Registro de sessões

Os protocolos rápidos são COMPLEMENTARES:
- Execução automática eficiente
- Acesso hierárquico a informações
- Economia de tokens

**Ambos trabalham juntos:** Protocolo existente define O QUE fazer. Protocolos rápidos definem COMO fazer eficientemente.

---

**FIM DA ESTRUTURA HIERÁRQUICA**

