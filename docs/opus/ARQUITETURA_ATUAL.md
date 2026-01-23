# 🏗️ ARQUITETURA ATUAL - VRVS v5.3

## Estrutura de Abas (9 abas)

| # | Aba | Função |
|---|-----|--------|
| 1 | Tarefa | Missões do dia, timeline, atrasados |
| 2 | Feedback | Registro de sessão de estudo |
| 3 | Diário | Entradas de recall ativo |
| 4 | Caderno | Anotações por área/tema (colapsável) |
| 5 | Agenda | Calendário de revisões |
| 6 | Dados | Gestão de temas |
| 7 | Análises | Analytics (Resumo, Gráficos, Histórico) |
| 8 | Backup | Importar/Exportar CSV |
| 9 | Ajuda | Tutorial, lembretes, FAQ |

## Funcionalidades por Módulo

### Tarefas
- Cards de tema com prioridade visual
- Botão "Mostrar Contexto" (Hot Topics + Diário ⚠️)
- Toggle tempos (questões/flashcards)
- Seção de atrasados

### Diário
- Entradas com área, tema, tópico, resposta
- Flag ⚠️ para pontos de atenção
- Visualização: Por Tema ou Por Data
- Áreas e temas colapsáveis
- Scroll funcional no iOS

### Caderno
- Anotações + Hot Topics por tema
- Áreas colapsáveis (iniciam fechadas)
- Contagem de conteúdo por área

### Analytics
- **Resumo:** Stats gerais, performance média, contadores
- **Gráficos:** Barras (por área), Linha (evolução), Radar (competências)
- **Histórico:** Tabela de todas as sessões

## Arquivo Principal

**Localização:** `docs/index.html` (~9500 linhas)

```
Estrutura do arquivo:
├── HTML (linhas 1-3000)
│   ├── Head, meta, manifest
│   ├── Estrutura das abas
│   └── Modais
├── CSS (linhas 100-1000, inline no <style>)
│   ├── Variáveis CSS
│   ├── Layout responsivo
│   └── Componentes
└── JavaScript (linhas 3000-9500)
    ├── Configurações e constantes
    ├── Funções de dados (CRUD)
    ├── Funções de renderização
    ├── Funções de analytics
    └── Event handlers
```

## Sistema VRVS 3P (Revisão Espaçada)

O VRVS 3P é o sistema de revisão espaçada da plataforma, baseado em 11 estágios (0-10) com intervalos crescentes.

### Estágios e Intervalos

| Estágio | Intervalo | Retenção | Classificação |
|---------|-----------|----------|--------------|
| 0 | 1 dia | 40% | Novo |
| 1 | 2 dias | 48% | Novo |
| 2 | 4 dias | 56% | Fixando |
| 3 | 7 dias | 64% | Fixando |
| 4 | 12 dias | 72% | Maduro |
| 5 | 20 dias | 80% | Maduro |
| 6 | 35 dias | 86% | Maduro |
| 7 | 60 dias | 90% | Consolidado |
| 8 | 90 dias | 93% | Consolidado |
| 9 | 135 dias | 96% | Consolidado |
| 10 | 200 dias | 98% | Consolidado |

### Regras de Transição

- **ESQUECI:** Se estágio ≤ 1 → volta para 0; Se ≥ 2 → desce 2 estágios
- **LEMBREI:** Sobe 1 estágio (até máximo 10)
- **FÁCIL:** Sobe 2 estágios (até máximo 10)

### Algoritmo de Repetição Espaçada (Temas)

```javascript
// Cálculo do próximo intervalo para temas (Feedback)
if (rendimento < 50) intervalo = 1;
else if (rendimento < 80) intervalo = 3;
else {
    // Progressão: 7 → 14 → 30 → 60 dias
    if (contador80 === 0) intervalo = 7;
    else if (contador80 === 1) intervalo = 14;
    else if (contador80 === 2) intervalo = 30;
    else intervalo = 60;
}
// Limite para prioridade 5
if (prioridade === 5 && intervalo > 30) intervalo = 30;
```

**Nota:** O algoritmo acima é para revisão de **temas** (aba Feedback). O sistema VRVS 3P (cards do Diário) usa os 11 estágios descritos acima.

## Última Refatoração

- **Data:** 12-13 de Dezembro de 2025
- **Mudanças:** Consolidação 16 → 9 abas
- **Novidades:** Sistema colapsável, Analytics unificado, Mostrar Contexto

