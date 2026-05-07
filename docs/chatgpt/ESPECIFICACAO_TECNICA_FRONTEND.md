# 🎨 ESPECIFICAÇÃO TÉCNICA DO FRONT-END VRVS

**Versão:** v5.3  
**Data:** 13 de Dezembro de 2025  
**Tipo:** PWA (Progressive Web App) - 100% Client-Side

---

## ⚠️ IMPORTANTE: CLARIFICAÇÃO

**VRVS é uma plataforma STANDALONE, não tem backend Python separado.**

- ✅ **100% Client-Side:** Todo código roda no navegador
- ✅ **Sem Backend:** Não há servidor ou API externa
- ✅ **Sem Python:** Não há engine Python separado
- ✅ **LocalStorage:** Todos os dados ficam no navegador
- ✅ **PWA:** Funciona offline após primeiro carregamento

**VRVS NÃO é parte do TEOT Planner.** São projetos separados.

---

## 📁 ESTRUTURA DE ARQUIVOS

### Arquivo Principal
- **`index.html`** (480KB, 10.000+ linhas)
  - HTML completo (linhas 1-3000)
  - CSS completo (linhas 3000-6000)
  - JavaScript completo (linhas 6000-10000)
  - **Tudo em um único arquivo**

### Arquivos de Configuração
- **`sw.js`** - Service Worker (PWA)
- **`manifest.json`** - Manifest do PWA
- **`favicon.ico`** - Ícone do app

---

## 🏗️ ARQUITETURA TÉCNICA

### Stack Tecnológico
```
Frontend:
├── HTML5 (semântico)
├── CSS3 (Grid, Flexbox, Animations)
├── JavaScript ES6+ (Vanilla, sem frameworks)
├── Chart.js (via CDN) - Gráficos
└── Service Worker API - PWA/Offline

Armazenamento:
└── localStorage (navegador)

Sem:
├── Backend
├── Python
├── Banco de dados
├── API REST
└── Servidor
```

---

## 📊 ESTRUTURA DE DADOS (localStorage)

### Chaves do localStorage:
```javascript
'vrvs_dados'      // Array de temas cadastrados
'vrvs_historico'  // Array de sessões de estudo
'vrvs_anotacoes'  // Array de anotações do Caderno
'vrvs_diario'     // Array de entradas do Diário
'vrvs_config'     // Objeto de configurações
```

### Estrutura de um Tema (`vrvs_dados`):
```javascript
{
    id: Number,                    // ID único
    area: String,                  // Ex: "Ombro e Cotovelo"
    tema: String,                  // Ex: "LAC/LEC"
    status: String,                // "Não iniciado" | "Em andamento" | "Suspenso"
    prioridade: Number,            // 1-5
    sessoes: Number,               // Total de sessões
    rendimento: Number,            // 0.0 - 1.0 (decimal)
    ultEstudo: String,             // "YYYY-MM-DD"
    proximaRevisao: String,        // "YYYY-MM-DD"
    agenda: String,                 // "YYYY-MM-DD" ou ""
    contador80: Number,            // Sessões consecutivas >= 80%
    criadoEm: String,              // Timestamp
    ultimaAtualizacao: String      // Timestamp
}
```

### Estrutura de uma Sessão (`vrvs_historico`):
```javascript
{
    id: Number,
    temaId: Number,                // Referência ao tema
    data: String,                  // "YYYY-MM-DD"
    rendimento: Number,            // 0.0 - 1.0
    tempoQuestoes: Number,         // minutos
    quantQuestoes: Number,
    tempoFlashcards: Number,       // minutos
    quantFlashcards: Number,
    diretriz: String,              // Texto livre
    area: String,                  // Cópia da área do tema
    tema: String                   // Cópia do tema
}
```

---

## 🎯 FUNCIONALIDADES DA INTERFACE

### 1. Aba "Tarefas" (Missões do Dia)
**Função:** Mostrar temas que precisam ser revisados hoje

**Componentes:**
- Cards de tema com prioridade visual
- Botão "Mostrar Contexto" (Hot Topics + Diário ⚠️)
- Toggle "Mostrar Tempos" (questões/flashcards)
- Seção de atrasados

**Lógica:**
- Filtra temas com `proximaRevisao <= hoje`
- Ordena por prioridade
- Mostra contagem de sessões e rendimento

---

### 2. Aba "Feedback" (Registro de Sessão)
**Função:** Registrar uma sessão de estudo

**Componentes:**
- Modal com formulário
- Campos: Tema, Rendimento, Tempo, Quantidade
- Botão "Salvar Sessão"

**Lógica:**
- Cria entrada em `vrvs_historico`
- Atualiza `vrvs_dados` (sessões, rendimento, última data)
- Calcula próxima revisão (spaced repetition)

---

### 3. Aba "Diário" (Recall Ativo)
**Função:** Entradas de recall ativo por tema

**Componentes:**
- Filtros: Vista (Por Data/Por Tema), Área, Data
- Seção "Revisar Hoje" (entradas com ⚠️)
- Áreas e temas colapsáveis
- Entradas com área, tema, tópico, resposta

**Lógica:**
- Agrupa por data ou por tema
- Filtra por área e data
- Mostra entradas com flag `atencao: true` em "Revisar Hoje"

---

### 4. Aba "Caderno" (Anotações)
**Função:** Anotações e Hot Topics por tema

**Componentes:**
- Filtros: Área, Tema
- Áreas colapsáveis (iniciam fechadas)
- Anotações por tema (Hot Topics + Conteúdo)

**Lógica:**
- Agrupa por área
- Mostra Hot Topics e conteúdo por tema
- Permite edição inline

---

### 5. Aba "Agenda" (Calendário)
**Função:** Visualizar temas agendados

**Componentes:**
- Toggle: Timeline / Atrasados
- Cards de tema com data
- Filtros de período

**Lógica:**
- Mostra temas com `agenda` preenchido
- Filtra por período
- Ordena por data

---

### 6. Aba "Dados" (Gestão de Temas)
**Função:** CRUD de temas

**Componentes:**
- Tabela de temas
- Botões: Novo Tema, Nova Área, Editar, Deletar
- Filtros e busca

**Lógica:**
- CRUD completo em `vrvs_dados`
- Validação de campos
- Atualização de selects em outras abas

---

### 7. Aba "Análises" (Analytics)
**Função:** Estatísticas e gráficos

**Sub-abas:**
- **Resumo:** Stats gerais, performance média
- **Gráficos:** Barras, Linha, Radar
- **Histórico:** Tabela de sessões

**Lógica:**
- Calcula métricas de `vrvs_historico`
- Agrupa por área para gráficos
- Filtra por período

---

### 8. Aba "Backup" (Importar/Exportar)
**Função:** Backup e migração de dados

**Componentes:**
- Botão "Exportar Dados" (CSV)
- Botão "Exportar Histórico" (CSV)
- Botão "Exportar Anotações" (CSV)
- Input "Importar CSV"

**Lógica:**
- Exporta `vrvs_dados`, `vrvs_historico`, `vrvs_anotacoes` para CSV
- Importa CSV e mescla com dados existentes
- Validação e limpeza de dados

---

### 9. Aba "Ajuda" (Tutorial)
**Função:** Tutorial e FAQ

**Componentes:**
- Tutorial interativo
- FAQ por aba
- Lembretes

---

## 🎨 DESIGN SYSTEM

### Cores Principais
```css
--turquesa-main: #00CED1;
--turquesa-light: #00FFE0;
--cobre-main: #FF7F50;
--cobre-light: #FFA366;
```

### Tipografia
- **Fonte:** System fonts (San Francisco no iOS, Segoe UI no Windows)
- **Tamanhos:** 11px - 20px (responsivo)

### Componentes Visuais
- **Cards:** Glassmorphism com backdrop-filter
- **Botões:** Gradiente com hover effects
- **Modais:** Blur background, slide animation
- **Áreas Colapsáveis:** Header clicável com toggle arrow

---

## 📱 RESPONSIVIDADE

### Breakpoints
```css
Desktop: > 768px
Mobile: <= 768px
```

### Mobile-First
- Todos os componentes são mobile-first
- Modais ocupam 95vh no mobile
- Áreas expandidas: min-height 50vh no mobile
- Containers principais: min-height 60vh no mobile

---

## 🔄 FLUXO DE DADOS

### Sem Backend - Tudo Client-Side

```
Usuário interage
    ↓
JavaScript processa
    ↓
Atualiza localStorage
    ↓
Re-renderiza interface
    ↓
Usuário vê resultado
```

**Não há:**
- Requisições HTTP
- API calls
- Comunicação com servidor
- Sincronização externa

---

## 🧪 TESTES (Atual)

**Status:** ❌ Não há testes automatizados

**Testes Manuais:**
- Teste no iPhone Safari (dispositivo principal)
- Teste no MacBook Safari/Chrome
- Verificação de funcionalidades críticas

**Necessário (Futuro):**
- Testes unitários para funções críticas
- Testes de integração para fluxos principais
- Testes E2E para cenários de uso

---

## 📝 DOCUMENTAÇÃO ADICIONAL

### Arquivos Relacionados
- `ARQUITETURA_DADOS.md` - Estrutura detalhada de dados
- `ARQUITETURA_ATUAL.md` - Arquitetura atual do sistema
- `PRINCIPIO_ORGANIZACAO_VISUAL_PLATAFORMA.md` - Regras de UI/UX
- `ERROS_E_ACERTOS_TECNICOS.md` - Análise técnica completa

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Front-End Completo
- [x] HTML estruturado (9 abas)
- [x] CSS responsivo (mobile-first)
- [x] JavaScript funcional (todas as abas)
- [x] Service Worker (PWA)
- [x] Manifest (instalação)
- [x] LocalStorage (persistência)
- [x] Exportação/Importação CSV
- [x] Gráficos (Chart.js)
- [x] Modais e formulários
- [x] Áreas colapsáveis
- [x] Filtros e busca
- [x] Validação de dados
- [x] Tratamento de erros

### Pendente
- [ ] Testes automatizados
- [ ] Documentação de API (se necessário)
- [ ] Performance optimization (para grandes volumes)

---

**Este documento esclarece que VRVS é 100% front-end, sem backend Python.**

