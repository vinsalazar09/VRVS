# 📖 NARRATIVA COMPLETA - SAGA SPLASH TRAVADO

**Período:** 19 de Dezembro (noite) → 20 de Dezembro (tarde) de 2024  
**Objetivo Original:** Criar nova sessão de treino customizado  
**Resultado:** Rollback para baseline estável após múltiplos hotfixes falharem

---

## 🎯 OBJETIVO INICIAL

**Meta:** Implementar funcionalidade de **Treino Livre Customizado** na aba Diário, permitindo:
- Seleção de área/tema específicos
- Controle de quantidade de cards
- Filtros avançados
- Experiência personalizada

**Contexto:** Usuário queria melhorar a experiência de treino livre, que atualmente mostra todos os cards sem filtros ou controles.

---

## ⚠️ PROBLEMA QUE SURGIU

### Sintoma: Splash Screen Travado no iPhone

**Quando:** Ao tentar implementar nova sessão de treino

**Comportamento:**
- App carregava normalmente no MacBook (Chrome/Safari)
- No iPhone Safari (PWA instalado), splash screen ficava travado
- Splash não sumia, app não iniciava
- Usuário não conseguia usar a aplicação

**Impacto:** 
- **CRÍTICO** - App completamente inutilizável no iPhone
- Usuário não conseguia acessar seus dados
- Frustração alta - "sempre na mesma lama"

---

## 🔍 INVESTIGAÇÃO INICIAL

### Hipóteses Consideradas

1. **Erro JavaScript bloqueando execução**
   - Sintaxe incorreta
   - Função não definida
   - Erro em operação síncrona

2. **Problema de cache do Service Worker**
   - Cache antigo servindo código quebrado
   - Service Worker não atualizando
   - Conflito entre versões

3. **Operação pesada bloqueando UI**
   - Loop sobre muitas entradas
   - Operação síncrona no boot
   - Processamento de dados grande

4. **Problema específico do iOS Safari**
   - Diferenças de comportamento entre navegadores
   - Limitações do PWA no iOS
   - Problemas de timing/race conditions

---

## 🛠️ TENTATIVAS DE CORREÇÃO (ORDEM CRONOLÓGICA)

### HOTFIX 1: Correção QuotaExceededError no Boot

**Commit:** `b6ed44f`  
**Data:** 2024-12-20 (manhã)

**O que foi feito:**
- Implementado `window.onerror` e `unhandledrejection` handlers
- Adicionado watchdog de 10 segundos para esconder splash em caso de erro
- Banner de erro exibido quando boot falha

**Hipótese:** Erro silencioso estava bloqueando execução

**Resultado:** ❌ **FALHOU** - Splash continuou travado

**Lição:** Erro handlers não resolvem se problema é antes do JavaScript executar

---

### HOTFIX 2: Proteção JSON.parse e localStorage

**Commit:** `ccaff85`  
**Data:** 2024-12-20 (manhã)

**O que foi feito:**
- Criada função helper `safeJSONParseLS()` para parsing seguro
- Substituídos `JSON.parse` diretos em `fazerBackupCompleto()` e inicializações globais
- Todas operações `localStorage` envolvidas em `try/catch`
- `fazerBackupCompleto()` com retry logic para `QuotaExceededError`
- `CACHE_NAME` atualizado em `sw.js`

**Hipótese:** JSON corrompido ou localStorage cheio estava causando erro

**Resultado:** ❌ **FALHOU** - Splash continuou travado

**Lição:** Proteções não resolvem se problema é de timing ou execução bloqueada

---

### HOTFIX 3: Observabilidade e Boot Resiliente

**Commit:** `ff29c94`  
**Data:** 2024-12-20 (manhã)

**O que foi feito:**
- Elementos de observabilidade no splash (`bootSetStatus`, `bootSetBuild`)
- Watchdog adicional de 3 segundos
- Funções síncronas problemáticas deferidas:
  - `limparDadosCorretos()`
  - `limparHistoricoInvalido()`
  - `normalizarAreasEmMassa()`
- `bootForceHideSplash()` chamado antes das operações deferidas
- `CACHE_NAME` atualizado

**Hipótese:** Operações pesadas no boot estavam bloqueando UI

**Resultado:** ❌ **FALHOU** - Splash continuou travado

**Lição:** Deferir operações não resolve se problema é mais fundamental

---

### HOTFIX 4: Destravar Boot no iPhone (Splash Travado)

**Commit:** `8c111c1`  
**Data:** 2024-12-20 (tarde)

**O que foi feito:**

#### PATCH 1 — Função Unificada para Destravar UI
- **MODIFICADO** função `bootForceHideSplash()` existente (linha 4038)
- Flag idempotente `window.__vrvsSplashHidden`
- `splash.style.display = 'none'` para forçar esconder
- `document.body.style.overflow = 'auto'` para garantir scroll
- Retry com `setTimeout(100ms)` para remover classe `splash-loading`

#### PATCH 2 — Failsafe Extra (3s + DOMContentLoaded)
- Watchdog 3s ajustado para usar flag `window.__vrvsSplashHidden`
- Failsafe `DOMContentLoaded` com `setTimeout(800ms)`
- Ambos verificam flag antes de executar (idempotente)

#### PATCH 3 — Remover `dados.map()` do Boot
- **REMOVIDO** do boot síncrono: `dados = dados.map(d => fixAreaTemaObjeto(d));`
- Operação movida para `agendarSaneamentoPosBoot()` com proteção `try/catch` individual

#### PATCH 4 — Unificar Lógica do Splash no `window.onload`
- No início do `window.onload`: chamada a `bootForceHideSplash('window-onload')`
- `localStorage.getItem('vrvs_tutorial_completo')` protegido com `try/catch`
- Lógica antiga de splash **SUBSTITUÍDA** por verificação simples da flag
- Removida animação `fade-out` e `setTimeout(2500ms)` que podia conflitar

#### PATCH 5 — Chart.js Lazy-Load
- **REMOVIDO** script bloqueante do Chart.js
- Criada função `vrvsLazyLoadChartJs()` para carregamento assíncrono
- Chart.js carregado após UI liberada: `setTimeout(1500ms)` após splash
- Guardas adicionadas em todas funções que usam Chart.js

**Hipótese:** Múltiplas causas possíveis - operações pesadas, lógica conflitante, scripts bloqueantes

**Resultado:** ❌ **FALHOU** - Splash continuou travado

**Lição:** Múltiplas correções simultâneas dificultam identificar causa raiz

---

### HOTFIX 5: PREBOOT ES5 Independente

**Commit:** `129c4e2`  
**Data:** 2024-12-20 (tarde)

**O que foi feito:**

#### PATCH 1 — Build ID Visível no Splash
- Reutilizado elemento existente `#bootBuildVRVS` (linha 2565)
- PREBOOT atualiza build: `"build: HOTFIX5-BOOT-PREBOOT-2025-12-20-2100"`
- Build hard-coded no PREBOOT ES5

#### PATCH 2 — PREBOOT ES5 (Independente do Script Principal)
- PREBOOT inserido **ANTES** do script principal (linha 2569-2684)
- **100% ES5 PURO** (zero sintaxe moderna):
  - ✅ `var` (não `const`/`let`)
  - ✅ `function() {}` (não arrow `()=>`)
  - ✅ Concatenação `"a" + b` (não template string `` `${}` ``)
  - ✅ Sem optional chaining `?.`
  - ✅ Sem nullish coalescing `??`
- Função `vrvsPrebootHideSplash()` independente (não chama funções do script principal)
- Reutiliza flag `window.__vrvsSplashHidden` existente
- Handlers de erro: `window.onerror` e `window.onunhandledrejection`
- Watchdog curto: 1.5s (não depende do script principal)
- DOMContentLoaded failsafe: 800ms após DOM montar
- Status atualizado: `"status: PREBOOT OK"` (prova visual)

#### PATCH 3 — Confirmação do Boot do App (Flag)
- `window.__vrvsAppBooted = true;` inserido **imediatamente após** a âncora
- Localização: linha 4109 (logo após `// ==================== DADOS E INICIALIZAÇÃO ====================`)
- Serve para watchdog do PREBOOT não "atirar" se script principal iniciou

#### PATCH 4 — Operações Pesadas Movidas para Pós-Boot
- `agendarSaneamentoPosBoot()` já existia (linha 4228)
- **Aumentado defer de 300ms para 800ms** (garante UI já apareceu)
- Operações pesadas já estavam movidas para defer (HOTFIX 4)

#### PATCH 5 — window.onload Unificado com PREBOOT
- `window.onload` chama `vrvsPrebootHideSplash('window-onload')` se disponível
- Fallback para `bootForceHideSplash()` se PREBOOT não disponível
- Protegido com `try/catch` completo

**Hipótese:** Script principal estava bloqueando antes mesmo de executar. PREBOOT independente garantiria escape do splash mesmo se resto falhar.

**Resultado:** ❌ **FALHOU** - Splash continuou travado

**Lição:** Mesmo código ES5 puro antes do script principal não resolveu. Problema pode ser mais fundamental (cache, Service Worker, ou código quebrado antes do PREBOOT)

---

## 🔄 DECISÃO: ROLLBACK

### Por que Rollback?

**Análise:**
- 5 hotfixes aplicados, nenhum resolveu
- Cada hotfix adicionava complexidade sem resolver problema
- Risco de mais hotfixes piorarem situação
- Baseline anterior (`f438a82`) estava funcionando

**Decisão:** Rollback cirúrgico para baseline estável antes dos hotfixes

---

### ROLLBACK: Baseline Estável

**Commits:** `346e97f`, `bd4439b`  
**Data:** 2024-12-20 (tarde)

**O que foi feito:**

1. **Restauração de Arquivos**
   - `docs/index.html` restaurado do commit `f438a82` (2024-12-16)
   - `docs/sw.js` restaurado do commit `f438a82`

2. **Ferramentas de Recovery Criadas**
   - `docs/dump_localstorage.html` - Dump completo do localStorage
   - `docs/recovery_sw.html` - Recovery de Service Worker e Cache Storage

3. **Atualização de Cache**
   - `CACHE_NAME` atualizado para `vrvs-ROLLBACK-STABLE-20251220-2200`
   - Força atualização do Service Worker

**Resultado:** ✅ **SUCESSO** - App voltou a funcionar no iPhone

**Confirmação do Usuário:** "App está funcionando novamente após rollback"

---

## 💡 LIÇÕES APRENDIDAS

### 1. Diagnóstico Antes de Correção

**Erro:** Tentamos corrigir sem identificar causa raiz exata

**Lição:** 
- Sempre investigar completamente antes de aplicar correções
- Usar ferramentas de debug disponíveis
- Validar hipóteses antes de implementar

**Aplicação Futura:**
- Criar ferramentas de diagnóstico antes de modificar código
- Usar `window.debugVRVS3P` para inspecionar estado
- Adicionar logs estruturados para rastrear execução

---

### 2. Mudanças Incrementais

**Erro:** Aplicamos múltiplas correções simultâneas

**Lição:**
- Mudanças incrementais facilitam identificar o que funciona
- Se uma mudança quebra algo, é fácil reverter apenas ela
- Acumular múltiplas mudanças dificulta debugging

**Aplicação Futura:**
- Uma mudança por vez
- Testar após cada mudança
- Commitar após cada mudança funcional

---

### 3. Rollback Plan Sempre Pronto

**Erro:** Não tínhamos plano de rollback claro desde o início

**Lição:**
- Sempre ter baseline conhecido e funcionando
- Commitar estado estável antes de mudanças grandes
- Ter ferramentas de recovery prontas

**Aplicação Futura:**
- Criar branch de backup antes de mudanças grandes
- Documentar exatamente o que será mudado
- Ter script de rollback automatizado se possível

---

### 4. Testes no iPhone Primeiro

**Erro:** Testamos principalmente no MacBook, iPhone era secundário

**Lição:**
- iPhone Safari tem comportamentos diferentes
- PWA instalado pode ter cache mais agressivo
- Problemas aparecem primeiro no iPhone

**Aplicação Futura:**
- Testar no iPhone PRIMEIRO
- Validar cada mudança no iPhone antes de continuar
- Considerar iPhone como plataforma principal

---

### 5. Cache e Service Worker

**Erro:** Subestimamos impacto do cache do Service Worker

**Lição:**
- Service Worker pode servir código antigo mesmo após commit
- Cache pode persistir entre versões
- Limpeza manual pode ser necessária

**Aplicação Futura:**
- Sempre atualizar `CACHE_NAME` quando mudar código
- Criar ferramentas de recovery de cache
- Documentar processo de limpeza de cache

---

## 🎯 OBJETIVO ORIGINAL (AINDA PENDENTE)

**Meta Original:** Customizar aba Treino Livre

**Status:** ⏳ **PENDENTE** - Adiado após rollback

**Próximos Passos:**
1. ✅ Preparar terreno com documentos completos (este documento)
2. ✅ Documentar erros e tentativas
3. ✅ Criar plano metodológico seguro
4. ⏳ Implementar customização seguindo protocolo de segurança

---

## 📊 RESUMO ESTATÍSTICO

**Período:** ~24 horas (noite 19/12 → tarde 20/12)  
**Hotfixes Aplicados:** 5  
**Commits Criados:** 7+  
**Tempo Investido:** ~8-10 horas  
**Resultado:** Rollback para baseline estável  
**Status:** ✅ App funcionando novamente

**Custo:**
- Tempo perdido em tentativas que não funcionaram
- Frustração do usuário
- Complexidade adicional no código (depois revertida)

**Benefício:**
- Lições aprendidas valiosas
- Ferramentas de recovery criadas
- Protocolo de segurança estabelecido
- Baseline estável confirmada

---

**Documento criado para documentar narrativa completa da saga e evitar repetir erros**

