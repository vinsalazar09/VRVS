# 🎯 VRVS - CONTEXTO DO PROJETO

## Sobre o Projeto

**Nome:** VRVS Circuit Tech (Sistema de Revisão Espaçada)  
**Versão Atual:** v5.3  
**Tipo:** PWA (Progressive Web App) - 100% client-side  
**Tecnologias:** HTML, CSS, JavaScript puro (sem frameworks)  
**Armazenamento:** localStorage  
**Repositório:** Cursor local + Desktop

## Sobre o Usuário

**Nome:** Vini  
**Perfil:** Residente R3 de Ortopedia (HSPM-SP)  
**Objetivo:** Preparação para TEOT 2026 (prova de título)  
**Dispositivo Principal:** iPhone (Safari)  
**Dispositivo Secundário:** MacBook (Safari/Chrome)

## Propósito da Plataforma

Sistema de gestão de estudos com:
- Repetição espaçada (spaced repetition)
- Diário de estudos com recall ativo
- Caderno de anotações por tema
- Hot Topics para revisão rápida
- Analytics de performance
- Agenda de tarefas diárias

## Arquitetura de Dados (localStorage)

```javascript
// Chaves do localStorage
'vrvs_dados'      // Array de temas cadastrados
'vrvs_historico'  // Array de sessões de estudo
'vrvs_anotacoes'  // Array de anotações do Caderno
'vrvs_diario'     // Array de entradas do Diário
'vrvs_config'     // Objeto de configurações
```

## Áreas de Estudo (13 áreas)

1. Ciências Básicas
2. Coluna
3. Joelho
4. Mão e Punho
5. Ombro e Cotovelo
6. Oncologia
7. Ortopedia Pediátrica
8. Pé e Tornozelo
9. Quadril
10. Trauma MMSS
11. Trauma MMII
12. Trauma Coluna
13. Trauma Ped

## Design System

- **Cor primária:** Turquesa (#00CED1)
- **Cor secundária:** Cobre/Âmbar (#FF7F50)
- **Background:** Gradiente escuro (#0a1a1f → #1a2f35)
- **Fonte:** System fonts (-apple-system, BlinkMacSystemFont)
- **Border radius:** 12px (padrão)

## Fluxo de Trabalho com IAs

```
┌─────────┐    Análise/Decisões    ┌─────────┐
│  VINI   │ ◄─────────────────────►│  OPUS   │
└─────────┘                        └─────────┘
     │                                  │
     │ Execução                         │ Documentos .md
     ▼                                  ▼
┌─────────┐                        ┌─────────┐
│ CURSOR  │ ◄──────────────────────│  DOCS   │
└─────────┘    Instruções          └─────────┘
```

- **Opus:** Planejamento, arquitetura, revisão, decisões
- **Cursor:** Implementação, debugging, código
- **Vini:** Validação, testes, direção do projeto

## Metodologia VRVS

Para entender completamente a metodologia por trás do VRVS, consulte o documento **METODOLOGIA_VRVS.md** nesta pasta.

**Resumo:** O VRVS é um sistema de gestão de estudos baseado em revisão espaçada (spaced repetition) e recall ativo. Ele organiza temas, calcula automaticamente quando revisar cada conteúdo, e garante que o conhecimento seja consolidado através de revisões em intervalos crescentes.

