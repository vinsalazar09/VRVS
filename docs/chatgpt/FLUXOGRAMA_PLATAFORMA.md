# 🔄 FLUXOGRAMA DA PLATAFORMA VRVS

**Versão:** v5.3  
**Data:** 13 de Dezembro de 2025

---

## 🎯 FLUXO GERAL DA APLICAÇÃO

```
INÍCIO
    ↓
Carrega dados do localStorage
    ↓
Renderiza interface inicial (Aba "Tarefas")
    ↓
Usuário interage
    ↓
JavaScript processa ação
    ↓
Atualiza localStorage
    ↓
Re-renderiza interface
    ↓
Usuário vê resultado
    ↓
[LOOP]
```

---

## 📊 FLUXO DE DADOS (Sem Backend)

```
┌─────────────────────────────────────────┐
│         NAVEGADOR (Client-Side)         │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐                      │
│  │  index.html  │                      │
│  │  (10k linhas)│                      │
│  └──────┬───────┘                      │
│         │                               │
│         ├── HTML (estrutura)           │
│         ├── CSS (estilos)               │
│         └── JavaScript (lógica)        │
│                                         │
│  ┌──────────────┐                      │
│  │ localStorage │                      │
│  │              │                      │
│  │ vrvs_dados   │                      │
│  │ vrvs_historico│                     │
│  │ vrvs_anotacoes│                     │
│  │ vrvs_diario  │                      │
│  │ vrvs_config  │                      │
│  └──────────────┘                      │
│                                         │
│  ┌──────────────┐                      │
│  │ Service Worker│                     │
│  │ (sw.js)      │                      │
│  │ Cache/Offline│                      │
│  └──────────────┘                      │
│                                         │
└─────────────────────────────────────────┘
         │
         │ (sem comunicação externa)
         │
         ▼
    [NENHUM BACKEND]
```

---

## 🔄 FLUXO DE REGISTRO DE SESSÃO

```
Usuário clica "Feedback"
    ↓
Abre modal de registro
    ↓
Preenche formulário:
  - Tema
  - Rendimento
  - Tempo questões
  - Quantidade questões
  - Tempo flashcards
  - Quantidade flashcards
  - Diretriz
    ↓
Clica "Salvar Sessão"
    ↓
JavaScript valida dados
    ↓
Cria objeto sessão:
  {
    id: novoId,
    temaId: tema.id,
    data: hoje,
    rendimento: valor,
    ...
  }
    ↓
Adiciona em vrvs_historico[]
    ↓
Atualiza tema em vrvs_dados[]:
  - sessoes += 1
  - rendimento = média ponderada
  - ultEstudo = hoje
  - proximaRevisao = calcularProximaRevisao()
    ↓
Salva em localStorage
    ↓
Fecha modal
    ↓
Re-renderiza aba "Tarefas"
    ↓
Tema aparece atualizado
```

---

## 📝 FLUXO DE CRIAÇÃO DE ENTRADA NO DIÁRIO

```
Usuário clica "+ Nova" no Diário
    ↓
Abre modal "Nova Entrada"
    ↓
Preenche:
  - Área
  - Tema
  - Tópico
  - Resposta
  - Flag ⚠️ (opcional)
    ↓
Clica "Salvar"
    ↓
JavaScript valida
    ↓
Cria objeto entrada:
  {
    id: novoId,
    data: hoje,
    area: valor,
    tema: valor,
    topico: valor,
    resposta: valor,
    atencao: true/false
  }
    ↓
Adiciona em vrvs_diario[]
    ↓
Salva em localStorage
    ↓
Fecha modal
    ↓
Re-renderiza aba "Diário"
    ↓
Nova entrada aparece
```

---

## 📚 FLUXO DE CRIAÇÃO DE ANOTAÇÃO NO CADERNO

```
Usuário seleciona tema no Caderno
    ↓
Clica "Editar" ou área vazia
    ↓
Abre modal de edição
    ↓
Preenche:
  - Hot Topics (opcional)
  - Conteúdo (opcional)
    ↓
Clica "Salvar"
    ↓
JavaScript valida
    ↓
Busca anotação existente ou cria nova:
  {
    temaId: tema.id,
    hotTopics: valor,
    conteudo: valor,
    ultimaAtualizacao: agora
  }
    ↓
Atualiza/adiciona em vrvs_anotacoes[]
    ↓
Salva em localStorage
    ↓
Fecha modal
    ↓
Re-renderiza aba "Caderno"
    ↓
Anotação aparece atualizada
```

---

## 📊 FLUXO DE CÁLCULO DE PRÓXIMA REVISÃO

```
Função: calcularProximaRevisao(tema)
    ↓
Lê tema.sessoes
Lê tema.rendimento
Lê tema.contador80
Lê tema.ultEstudo
    ↓
Calcula diasBase:
  - Se sessoes < 3: 1 dia
  - Se sessoes < 5: 2 dias
  - Se sessoes < 10: 3 dias
  - Se rendimento >= 0.8: +1 dia
  - Se rendimento < 0.5: -1 dia
    ↓
Aplica bônus contador80:
  - Se contador80 >= 3: diasBase * 2
    ↓
Soma diasBase à data ultEstudo
    ↓
Retorna nova data (YYYY-MM-DD)
    ↓
Atualiza tema.proximaRevisao
```

---

## 📈 FLUXO DE RENDERIZAÇÃO DE GRÁFICOS

```
Usuário abre aba "Análises" → "Gráficos"
    ↓
JavaScript lê vrvs_historico[]
    ↓
Agrupa por área:
  {
    "Ombro e Cotovelo": [sessões...],
    "Coluna": [sessões...],
    ...
  }
    ↓
Calcula métricas por área:
  - Rendimento médio
  - Total de sessões
  - Evolução temporal
    ↓
Cria datasets para Chart.js:
  - Gráfico Barras: rendimento médio por área
  - Gráfico Linha: evolução temporal por área
  - Gráfico Radar: competências por área
    ↓
Renderiza gráficos nos canvas
    ↓
Usuário vê visualizações
```

---

## 💾 FLUXO DE EXPORTAÇÃO CSV

```
Usuário clica "Exportar Dados"
    ↓
JavaScript lê vrvs_dados[] do localStorage
    ↓
Converte array para CSV:
  - Headers: id,area,tema,status,prioridade,...
  - Linhas: valores separados por vírgula
    ↓
Cria Blob com conteúdo CSV
    ↓
Cria link de download:
  <a download="vrvs_dados.csv" href="blob:...">
    ↓
Dispara download
    ↓
Arquivo CSV salvo no dispositivo
```

---

## 📥 FLUXO DE IMPORTAÇÃO CSV

```
Usuário seleciona arquivo CSV
    ↓
FileReader lê arquivo
    ↓
Parse CSV:
  - Detecta headers
  - Normaliza nomes (case-insensitive)
  - Converte tipos (string → number)
    ↓
Valida dados:
  - Verifica campos obrigatórios
  - Valida ranges (rendimento 0-1)
  - Limpa dados inconsistentes
    ↓
Mescla com dados existentes:
  - Se tema.id existe: atualiza
  - Se tema.id não existe: adiciona
    ↓
Salva em localStorage
    ↓
Re-renderiza interface
    ↓
Dados importados aparecem
```

---

## 🔄 FLUXO DE ATUALIZAÇÃO AUTOMÁTICA (PWA)

```
Usuário abre app no iPhone
    ↓
Service Worker verifica atualização:
  - Compara CACHE_NAME atual com servidor
    ↓
Se há nova versão:
  - Baixa novos arquivos
  - Atualiza cache
  - Notifica usuário: "🔄 Nova versão disponível!"
    ↓
Usuário clica "Atualizar Agora"
    ↓
Service Worker ativa nova versão
    ↓
App recarrega automaticamente
    ↓
Usuário vê versão atualizada
```

---

## 🎯 FLUXO DE FILTROS E BUSCA

```
Usuário seleciona filtro (ex: Área)
    ↓
JavaScript lê valor do select
    ↓
Filtra array de dados:
  dados.filter(item => item.area === filtro)
    ↓
Atualiza array filtrado
    ↓
Re-renderiza apenas itens filtrados
    ↓
Usuário vê resultados filtrados
```

---

## 📱 FLUXO DE EXPANSÃO/COLAPSO DE ÁREAS

```
Usuário clica header de área
    ↓
toggleAreaCaderno(areaId)
    ↓
Busca elemento content:
  document.getElementById(`area-content-${areaId}`)
    ↓
Toggle classe 'collapsed':
  - Se collapsed: remove classe
  - Se não collapsed: adiciona classe
    ↓
Ajusta max-height:
  - Se expandindo: calcula scrollHeight + margem
  - Se colapsando: max-height = 0
    ↓
CSS aplica transição
    ↓
Área expande/colapsa suavemente
```

---

## ✅ RESUMO DOS FLUXOS

### Sem Backend
- ✅ Tudo acontece no navegador
- ✅ Dados ficam no localStorage
- ✅ Não há comunicação externa
- ✅ Funciona offline

### Processamento
- ✅ JavaScript processa tudo
- ✅ Validação client-side
- ✅ Cálculos client-side
- ✅ Renderização client-side

### Persistência
- ✅ localStorage salva dados
- ✅ Service Worker cacheia arquivos
- ✅ Exportação CSV para backup
- ✅ Importação CSV para restauração

---

**Todos os fluxos são 100% client-side, sem backend Python ou servidor.**

