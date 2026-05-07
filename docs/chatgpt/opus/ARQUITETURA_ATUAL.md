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

## Algoritmo de Repetição Espaçada

```javascript
// Cálculo do próximo intervalo
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

## Última Refatoração

- **Data:** 12-13 de Dezembro de 2025
- **Mudanças:** Consolidação 16 → 9 abas
- **Novidades:** Sistema colapsável, Analytics unificado, Mostrar Contexto

