# 📚 DOCUMENTOS COMPLEMENTARES - REFERÊNCIA RÁPIDA

**Data:** 20 de Dezembro de 2024  
**Objetivo:** Listar documentos importantes para referência durante implementação

---

## 📖 DOCUMENTOS PRINCIPAIS

### 1. Contexto Completo
**Arquivo:** `01_CONTEXTO_COMPLETO_SAGA_TREINO_LIVRE.md`

**Conteúdo:**
- Objetivo principal da customização
- Contexto técnico completo
- Arquitetura atual do sistema
- Estrutura de dados do Diário
- Funções críticas mapeadas
- Bug crítico identificado
- Estado atual do código
- Objetivos da customização
- Restrições críticas

**Quando Usar:**
- Antes de começar qualquer implementação
- Para entender contexto técnico completo
- Para referenciar estrutura de dados

---

### 2. Narrativa da Saga
**Arquivo:** `02_NARRATIVA_SAGA_SPLASH_TRAVADO.md`

**Conteúdo:**
- Objetivo original
- Problema que surgiu (splash travado)
- Investigação inicial
- Tentativas de correção (HOTFIX 1-5)
- Decisão de rollback
- Lições aprendidas
- Objetivo original (ainda pendente)

**Quando Usar:**
- Para entender o que aconteceu antes
- Para evitar repetir erros
- Para referenciar lições aprendidas

---

### 3. Erros e Tentativas (Cronológico)
**Arquivo:** `03_ERROS_TENTATIVAS_CRONOLOGICO.md`

**Conteúdo:**
- Timeline detalhada de todos os erros
- Cada tentativa de correção documentada
- Análise pós-falha de cada tentativa
- Padrões identificados
- Lições aprendidas específicas

**Quando Usar:**
- Para entender ordem cronológica dos eventos
- Para ver o que foi tentado e por que falhou
- Para evitar repetir mesmos erros

---

### 4. Plano de Implementação Metodológico
**Arquivo:** `04_PLANO_IMPLEMENTACAO_METODOLOGICO.md`

**Conteúdo:**
- Protocolo de segurança
- Fase 0: Preparação e diagnóstico
- Fase 1: Corrigir bug do filtro automático
- Fase 2: Adicionar controles de UI
- Fase 3: Adicionar filtros avançados
- Fase 4: Testes finais e validação
- Checklist geral
- Protocolo de emergência

**Quando Usar:**
- Durante toda a implementação
- Para seguir metodologia segura
- Para referenciar tarefas de cada fase

---

## 🔧 DOCUMENTOS TÉCNICOS

### 5. Material Master - Investigação VRVS 3P
**Arquivo:** `MATERIAL_MASTER_INVESTIGACAO_VRVS3P.md`

**Conteúdo:**
- Problema principal de agrupamento
- Contexto correto do sistema
- Dúvidas sobre VRVS 3P
- Checklist de investigação
- Correções necessárias
- Ferramentas de debug disponíveis

**Quando Usar:**
- Para entender sistema VRVS 3P
- Para usar ferramentas de debug
- Para referenciar helpers unificados

---

### 6. Relatório Completo - Patches Dezembro 2024
**Arquivo:** `RELATORIO_COMPLETO_PATCHES_DEZEMBRO_2024.md`

**Conteúdo:**
- Todos os patches aplicados em dezembro
- HOTFIX 1-5 documentados
- ROLLBACK documentado
- Patches pós-rollback (3-1-2, 4, I)
- Checklist de validação

**Quando Usar:**
- Para entender histórico de patches
- Para ver o que foi feito após rollback
- Para referenciar versões e commits

---

### 7. Protocolo de Encerramento
**Arquivo:** `PROTOCOLO_ENCERRAMENTO_20241220.md`

**Conteúdo:**
- Resumo executivo da sessão
- Commits realizados
- Acertos e conquistas
- Problemas identificados (não resolvidos)
- Pendências e próximos passos
- Propostas de otimização

**Quando Usar:**
- Para entender estado final da sessão anterior
- Para ver pendências
- Para referenciar próximos passos

---

### 8. Caderno de Erros e Acertos
**Arquivo:** `CADERNO_ERROS_ACERTOS.txt`

**Conteúdo:**
- Registro histórico de erros resolvidos
- Acertos e soluções bem sucedidas
- Problemas conhecidos (ainda não resolvidos)
- Lições aprendidas ao longo do tempo

**Quando Usar:**
- Para ver histórico completo de erros
- Para evitar repetir erros conhecidos
- Para referenciar soluções que funcionaram

---

## 🗺️ MAPEAMENTO DE FUNÇÕES

### Funções Críticas do Diário

**`iniciarSessaoDiario(tipo)`** (linha ~11442-11485)
- Popula `sessaoDiario.filaIds` baseado no tipo
- **BUG:** Usa filtro da UI automaticamente
- **MODIFICAR:** Remover uso automático de `filtroDiarioArea`

**`getEntradasParaRevisarHojeDiario(filtros)`** (linha ~10109-10134)
- Filtra entradas devidas hoje
- Usa helpers unificados (`isDueToday`)
- **NÃO MODIFICAR:** Funciona corretamente

**`getEntradasTreinoLivreDiario(filtros)`** (linha ~10137-10144)
- Retorna todas as entradas (apenas filtra por área)
- **MODIFICAR:** Adicionar filtros avançados

**`responderSessaoDiario(qualidade)`** (linha ~11576-11600)
- Atualiza SRS se modo `programado`
- Avança na fila
- **NÃO MODIFICAR:** Funciona corretamente

**`setModoSessaoDiario(modo)`** (linha ~11422-11439)
- Muda modo entre 'programado' e 'livre'
- Chama `iniciarSessaoDiario(modo)`
- **NÃO MODIFICAR:** Funciona corretamente

---

## 🛠️ FERRAMENTAS DE DEBUG

### `window.debugVRVS3P`

**Disponível em:** `docs/index.html` linha ~10136-10582

**Funções Disponíveis:**

1. **`inspecionar(textoTopico)`**
   - Inspeciona entrada específica por texto do tópico
   - Mostra tabela completa com todos os campos

2. **`listarAtivas()`**
   - Lista todas entradas com VRVS 3P ativo
   - Mostra resumo em tabela formatada

3. **`devidasHoje()`**
   - Lista entradas devidas hoje
   - Separa por motivo (atenção manual vs VRVS 3P)

4. **`compararSessaoListagem()`**
   - Compara lógica da SESSÃO vs LISTAGEM
   - Identifica diferenças que causam bugs

5. **`performance()`**
   - Mede tempo de filtragem
   - Estima tempo de processamento completo

6. **`historico(limite)`**
   - Mostra últimas execuções do algoritmo
   - Inclui estado antes/depois, tempo de execução

7. **`validar()`**
   - Valida estrutura do algoritmo
   - Verifica constantes e intervalos

8. **`testar()`**
   - Teste unitário simples do algoritmo
   - Testa transições de estágio

9. **`resumo()`**
   - Executa todas as análises acima
   - Retorna objeto completo com todos os dados

**Como Usar:**
```javascript
// No console do navegador:
window.debugVRVS3P.resumo();
window.debugVRVS3P.inspecionar("texto do tópico");
window.debugVRVS3P.listarAtivas();
```

---

## 📍 ÂNCORAS NO CÓDIGO

### Localizações Importantes

**Sessão de Diário:**
- `setModoSessaoDiario()`: linha ~11422-11439
- `iniciarSessaoDiario()`: linha ~11442-11485
- `renderSessaoDiario()`: linha ~11496-11600
- `responderSessaoDiario()`: linha ~11576-11600

**Filtros e Helpers:**
- `getEntradasParaRevisarHojeDiario()`: linha ~10109-10134
- `getEntradasTreinoLivreDiario()`: linha ~10137-10144
- `isSrsActive()`: linha ~10596-10600
- `isDueToday()`: linha ~10596-10600
- `isUpcoming()`: linha ~10603-10607

**Debug:**
- `window.debugVRVS3P`: linha ~10136-10582

**UI:**
- Aba Lista: `diarioTabLista` (linha ~3355)
- Aba Sessão: `diarioTabSessao` (linha ~3358)
- Filtro de área: `filtroDiarioArea` (linha ~3389)

---

## 🔗 LINKS ÚTEIS

### Commits Importantes

**Baseline Estável:**
- `f438a82` - "fix: Corrigir 4 bugs críticos da plataforma" (2024-12-16)

**Rollback:**
- `346e97f` - "rollback: restore baseline pre-hotfix + add recovery tools"
- `bd4439b` - "fix: rollback para baseline estável (pré-HOTFIX) + ferramentas recovery"

**Patches Pós-Rollback:**
- `0952eb4` - "fix: Patch 3-1-2 - Correção agrupamento Diário + indicadores visuais iPhone"
- `3d9bc00` - "fix: Patch 4 - Remover legado ⚠️ atenção e priorizar VRVS 3P + indicador próximas"
- `fd27710` - "feat: PATCH I - UX Refinada (touch/focus) + relatório completo patches dezembro 2024"

---

## 📝 CHECKLIST DE REFERÊNCIA

### Antes de Modificar Código

- [ ] Li todos os documentos principais?
- [ ] Entendi o contexto completo?
- [ ] Identifiquei todas as funções relacionadas?
- [ ] Testei ferramentas de debug?
- [ ] Tenho rollback plan pronto?

### Durante Modificação

- [ ] Estou seguindo protocolo de segurança?
- [ ] Estou fazendo uma mudança por vez?
- [ ] Estou testando após cada mudança?
- [ ] Estou documentando cada mudança?

### Após Modificação

- [ ] Testei no iPhone?
- [ ] Validei que não quebrou nada?
- [ ] Documentei todas as mudanças?
- [ ] Commitei código funcional?

---

**Documento criado para referência rápida durante implementação**

