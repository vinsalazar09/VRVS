# 📋 Sistema de Protocolos e Condutas - Plataforma de Revisão TEOT

Este documento explica o sistema de protocolos e condutas implementado na pasta `Teot/` para melhorar workflow, organização e registro de dados de forma estruturada.

## 🎯 Objetivo

Criar um sistema que automaticamente:
- Se sintonize quando iniciar um chat na pasta Teot/
- Crie contexto estruturado
- Repasse informações para o usuário para contextualização
- Ao final, faça registro da sessão de maneira organizada e estruturada

## 📁 Estrutura Criada

```
Teot/
├── DIARIO/
│   ├── README.md                    # Documentação do diário
│   ├── 01_ESTADO_ATUAL.txt         # Estado atual da plataforma (sempre atualizado)
│   └── CURSOR/                     # Pasta específica do Cursor AI
│       ├── README.md               # Regras da pasta
│       ├── 00_LEIA_PRIMEIRO_SEMPRE.txt  # ⚠️ CÓDIGO DE CONDUTA (LEMA PRIMEIRO)
│       ├── RESUMO_SESSAO_*.txt     # Resumos de cada sessão
│       ├── CADERNO_ERROS_ACERTOS.txt    # Histórico de erros e acertos
│       ├── inicializar_contexto.py      # Script de automação
│       └── RESUMO_SESSAO_EXEMPLO.txt    # Exemplo de formato
└── README_SISTEMA_PROTOCOLOS.md    # Este arquivo
```

## 🚀 Como Funciona

### Início de Chat

Quando você iniciar um chat na pasta `Teot/` e disser **"INICIANDO CHAT"** (ou similar), o Cursor AI automaticamente:

1. ✅ Lê `DIARIO/CURSOR/00_LEIA_PRIMEIRO_SEMPRE.txt` (código de conduta)
2. ✅ Lê `DIARIO/01_ESTADO_ATUAL.txt` (estado atual)
3. ✅ Lê último `DIARIO/CURSOR/RESUMO_SESSAO_*.txt` (última sessão)
4. ✅ Consulta `DIARIO/CURSOR/CADERNO_ERROS_ACERTOS.txt` (erros e acertos)
5. ✅ Consulta `docs/DOCUMENTACAO_COMPLETA.md` (documentação técnica)
6. ✅ Consulta `docs/ARQUITETURA_DADOS.md` (estrutura de dados)
7. ✅ Cria entrada: `CHAT INICIADO: [DATA] ([DIA DA SEMANA]) [HORÁRIO]`
8. ✅ Responde confirmando protocolo executado e resumindo estado atual

### Durante o Trabalho

- O Cursor AI segue o código de conduta definido
- Mantém contexto estruturado
- Documenta problemas e soluções conforme necessário

### Encerramento de Chat

Quando você disser **"ENCERRANDO CHAT"** (ou similar), o Cursor AI automaticamente:

1. ✅ Cria `DIARIO/CURSOR/RESUMO_SESSAO_[DATA].txt` (com proteção contra sobrescrita)
2. ✅ Atualiza `DIARIO/01_ESTADO_ATUAL.txt` (adiciona ao final)
3. ✅ Atualiza `DIARIO/CURSOR/CADERNO_ERROS_ACERTOS.txt` (adiciona ao final)
4. ✅ Cria entrada: `CHAT ENCERRADO: [DATA] ([DIA DA SEMANA]) [HORÁRIO]`
5. ✅ Organiza pastas e verifica pontas soltas
6. ✅ Confirma ao usuário que protocolo foi executado

## 📋 Arquivos Principais

### `DIARIO/CURSOR/00_LEIA_PRIMEIRO_SEMPRE.txt`

**⚠️ ESTE É O ARQUIVO MAIS IMPORTANTE**

Contém:
- Código de conduta completo
- Protocolos de início e encerramento
- Regras fundamentais de trabalho
- Estrutura do diário
- Comandos especiais

**Este arquivo DEVE ser lido sempre ao iniciar um chat.**

### `DIARIO/01_ESTADO_ATUAL.txt`

Contém:
- Estado atual da plataforma
- O que está funcionando
- O que não está funcionando
- Próximos passos sugeridos
- Notas importantes

**Este arquivo é sempre atualizado ao final de cada sessão.**

### `DIARIO/CURSOR/CADERNO_ERROS_ACERTOS.txt`

Contém:
- Erros resolvidos
- Acertos e soluções bem sucedidas
- Problemas conhecidos (ainda não resolvidos)
- Lições aprendidas

**Este arquivo cresce ao longo do tempo, sempre adicionando ao final.**

### `DIARIO/CURSOR/RESUMO_SESSAO_*.txt`

Um arquivo por sessão contendo:
- Data e horário
- Objetivo da sessão
- O que foi feito
- Arquivos modificados/criados
- Problemas resolvidos
- Problemas identificados (não resolvidos)
- Próximos passos
- Aprendizados

## 🔧 Script de Automação

O arquivo `DIARIO/CURSOR/inicializar_contexto.py` pode ser executado para verificar se todos os arquivos de contexto estão presentes:

```bash
cd /Users/viniciussalazar/Desktop/Teot
python3 DIARIO/CURSOR/inicializar_contexto.py
```

Este script:
- Verifica existência de todos os arquivos de contexto
- Lê e exibe resumo do que foi carregado
- Cria entrada de início de chat

## 📝 Formato de Resumo de Sessão

Cada resumo de sessão segue este formato:

```
═══════════════════════════════════════════════════════════════
📅 RESUMO DE SESSÃO - PLATAFORMA DE REVISÃO TEOT
═══════════════════════════════════════════════════════════════

**Data:** YYYY-MM-DD (Dia da semana)
**Horário:** HH:MM - HH:MM
**Duração:** Xh Ymin

═══════════════════════════════════════════════════════════════
🎯 OBJETIVO DA SESSÃO
═══════════════════════════════════════════════════════════════

[O que foi o objetivo desta sessão?]

═══════════════════════════════════════════════════════════════
✅ O QUE FOI FEITO
═══════════════════════════════════════════════════════════════════

[Lista do que foi feito]

═══════════════════════════════════════════════════════════════
📁 ARQUIVOS MODIFICADOS/CRIADOS
═══════════════════════════════════════════════════════════════

[Lista de arquivos]

═══════════════════════════════════════════════════════════════
✅ PROBLEMAS RESOLVIDOS
═══════════════════════════════════════════════════════════════

[Lista de problemas resolvidos]

═══════════════════════════════════════════════════════════════
⚠️ PROBLEMAS IDENTIFICADOS (NÃO RESOLVIDOS)
═══════════════════════════════════════════════════════════════

[Lista de problemas identificados mas não resolvidos]

═══════════════════════════════════════════════════════════════
📋 PRÓXIMOS PASSOS
═══════════════════════════════════════════════════════════════

[O que fazer na próxima sessão]

═══════════════════════════════════════════════════════════════
💡 APRENDIZADOS
═══════════════════════════════════════════════════════════════

[Lições aprendidas nesta sessão]

═══════════════════════════════════════════════════════════════
```

## 🎯 Benefícios

1. **Contexto Automático**: Toda vez que você iniciar um chat, o Cursor AI já terá todo o contexto necessário
2. **Continuidade**: Trabalho não se perde entre sessões
3. **Organização**: Tudo documentado de forma estruturada
4. **Rastreabilidade**: Histórico completo de todas as sessões
5. **Aprendizado**: Erros e acertos registrados para referência futura

## ⚠️ Regras Importantes

1. **NUNCA sobrescrever arquivos existentes** - sempre adicionar ao final
2. **Proteção contra sobrescrita** - verificar se arquivo existe antes de criar
3. **Pasta sagrada** - `DIARIO/CURSOR/` é somente para os 4 tipos de arquivos permitidos
4. **Sempre testar no navegador** antes de considerar implementação concluída
5. **Sempre validar visualmente** antes de avançar para próxima tarefa

## 📞 Comandos Especiais

### Início de Chat
- **"INICIANDO CHAT"**
- **"INICIAR CHAT"**
- **"INICIO"**
- **"COMEÇAR"**

### Encerramento de Chat
- **"ENCERRANDO CHAT"**
- **"ENCERRAR CHAT"**
- **"FINALIZAR"**
- **"TERMINAR"**

## 🔄 Fluxo Completo

```
INÍCIO DE CHAT
    ↓
Ler protocolo (00_LEIA_PRIMEIRO_SEMPRE.txt)
    ↓
Ler estado atual (01_ESTADO_ATUAL.txt)
    ↓
Ler última sessão (RESUMO_SESSAO_*.txt)
    ↓
Consultar erros/acertos (CADERNO_ERROS_ACERTOS.txt)
    ↓
Consultar documentação técnica
    ↓
TRABALHAR
    ↓
ENCERRAMENTO DE CHAT
    ↓
Criar resumo de sessão
    ↓
Atualizar estado atual
    ↓
Atualizar caderno de erros/acertos
    ↓
PRÓXIMO CHAT
```

## ✅ Pronto para Usar

O sistema está implementado e pronto para uso. Na próxima vez que você iniciar um chat na pasta `Teot/`, o Cursor AI automaticamente executará o protocolo completo e você terá todo o contexto necessário para trabalhar de forma eficiente e organizada.

---

**Última atualização:** 2025-11-27  
**Versão:** 1.0

