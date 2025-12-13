# 🏗️ ARQUITETURA ATUAL - VRVS v5.3

## Estrutura de Abas (9 abas)

1. **Tarefas** - Missões do dia, timeline, atrasados
2. **Feedback** - Registro de sessão de estudo
3. **Diário** - Entradas de recall ativo
4. **Caderno** - Anotações por área/tema (colapsável)
5. **Agenda** - Tarefas agendadas
6. **Dados** - Gestão de temas
7. **Análises** - Analytics (Resumo, Gráficos, Detalhado, Histórico)
8. **Backup** - Importar/Exportar CSV
9. **Ajuda** - Tutorial, lembretes, FAQ

## Funcionalidades por Módulo

### Tarefas
- Cards de tema com prioridade
- Botão "Mostrar Contexto" (Hot Topics + Diário ⚠️)
- Toggle tempos (questões/flashcards)

### Diário
- Entradas com área, tema, tópico, resposta
- Flag ⚠️ para pontos de atenção
- Visualização por Tema ou por Data
- Áreas colapsáveis (por área → por tema)
- "Revisar Hoje" colapsável

### Caderno
- Anotações + Hot Topics por tema
- Áreas colapsáveis (iniciam fechadas)
- Contagem de conteúdo por área

### Analytics
- **Resumo:** stats gerais, performance média
- **Gráficos:** barras (por área), linha (evolução), radar (competências)
  - Gráficos colapsáveis
  - Toggles no gráfico de linha (checkboxes)
- **Detalhado:** filtros por área/tema/período, análises de tempo
- **Histórico:** tabela de sessões

## Arquivo Principal

`docs/index.html` (~9976 linhas)
- HTML: linhas 1-3000
- CSS: linhas 100-1000 (inline no <style>)
- JavaScript: linhas 3000-9976

## Última Refatoração

- Data: 12-13 de Dezembro de 2025
- Consolidação de 16 → 9 abas
- Sistema de áreas colapsáveis
- Analytics unificado com sub-navegação
- Instâncias separadas para gráficos (Stats vs Analytics)

