# 🔍 ANÁLISE PRÉ-EXECUÇÃO — ROLLBACK PARA BASELINE ESTÁVEL

**Data:** 2024-12-20  
**Objetivo:** Rollback para baseline pré-HOTFIXs + ferramentas de recuperação

---

## ✅ PASSO 0 — IDENTIFICAÇÃO DO BASELINE

### Histórico de Commits (últimos 40)

**HOTFIXs identificados:**
1. `129c4e2` - HOTFIX5 - PREBOOT ES5 independente
2. `8c111c1` - HOTFIX4 - Destravar boot no iPhone
3. `ff29c94` - HOTFIX3 - Destravar boot + observabilidade
4. `ccaff85` - HOTFIX2 - Boot resiliente a JSON corrompido
5. `b6ed44f` - HOTFIX1 - Corrigir travamento iPhone (QuotaExceeded)

**Commits ANTES dos HOTFIXs:**
- `0dadca9` - feat: FASE 1 + FASE 2 - Correções críticas e Sessão de Treino MVP
- `1525daa` - fix: FASE 1 - Correções críticas VRVS 5.3
- `6322a74` - docs: Adicionar relatório técnico das correções de bugs
- `f438a82` - fix: Corrigir 4 bugs críticos da plataforma
- `fd53d6f` - fix: Melhorar painel VRVS 3P e garantir carregamento do diário ⭐ (mencionado pelo usuário)

### 🎯 BASELINE ESCOLHIDO

**Hash:** `0dadca9`  
**Mensagem:** `feat: FASE 1 + FASE 2 - Correções críticas e Sessão de Treino MVP`

**Justificativa:**
- ✅ É o commit imediatamente ANTES do primeiro HOTFIX (`b6ed44f`)
- ✅ Representa o último estado "estável" antes das tentativas de correção do splash travado
- ✅ Inclui correções críticas e funcionalidades já testadas
- ✅ Commit `fd53d6f` está mais antigo (antes de outras correções importantes)

**Alternativa considerada:**
- `fd53d6f` - Mais antigo, mas mencionado pelo usuário como possível baseline
- **Decisão:** Usar `0dadca9` por ser mais recente e incluir correções críticas

---

## 📋 PASSO 1 — RESTAURAR ARQUIVOS DO BASELINE

### Arquivos a restaurar:
- `docs/index.html`
- `docs/sw.js`

### Comando a executar:
```bash
git checkout 0dadca9 -- docs/index.html docs/sw.js
```

### Verificação pós-restauração:
- Verificar sintaxe moderna problemática:
  ```bash
  grep -n "??" docs/index.html || true
  grep -n "\?\." docs/index.html || true
  ```
- Se aparecerem ocorrências: **STOP e reportar** (não fazer replace automático)

---

## 🛠️ PASSO 2 — FERRAMENTA DE DUMP DO LOCALSTORAGE

### Arquivo: `docs/dump_localstorage.html`

### Requisitos:
- ✅ ES5 puro (`var`, `function`, sem arrow functions)
- ✅ NÃO altera localStorage (apenas leitura)
- ✅ Lista todas as chaves com tamanho aproximado
- ✅ Filtra e destaca chaves VRVS comuns:
  - `vrvs_dados`
  - `vrvs_historico`
  - `vrvs_anotacoes`
  - `vrvs_diario`
  - `vrvs_config`
  - `vrvs_lembretes`
  - `vrvs_tarefas`
- ✅ Botão "Gerar Dump" que monta JSON:
  ```json
  {
    "timestamp": "...",
    "origin": "...",
    "userAgent": "...",
    "keys": {
      "<key>": "<value_string>"
    }
  }
  ```
- ✅ Botão "Baixar dump" (Blob + URL.createObjectURL + `<a download>`)
- ✅ Exibir JSON em `<textarea>` (fallback se download falhar no iOS)

### Estrutura proposta:
```html
<!DOCTYPE html>
<html>
<head>
    <title>VRVS - Dump localStorage</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: monospace; padding: 20px; background: #0a1a1f; color: #fff; }
        button { padding: 10px 20px; margin: 10px 0; background: #00CED1; border: none; cursor: pointer; }
        textarea { width: 100%; height: 300px; background: #1a2a2f; color: #fff; }
    </style>
</head>
<body>
    <h1>VRVS - Dump localStorage</h1>
    <button onclick="gerarDump()">Gerar Dump</button>
    <button onclick="baixarDump()">Baixar Dump</button>
    <textarea id="dumpOutput"></textarea>
    <script>
        // ES5 puro
        var dumpData = null;
        
        function gerarDump() {
            var keys = [];
            var data = {
                timestamp: new Date().toISOString(),
                origin: window.location.origin,
                userAgent: navigator.userAgent,
                keys: {}
            };
            
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var value = localStorage.getItem(key);
                data.keys[key] = value;
            }
            
            dumpData = data;
            document.getElementById('dumpOutput').value = JSON.stringify(data, null, 2);
        }
        
        function baixarDump() {
            if (!dumpData) {
                alert('Gere o dump primeiro!');
                return;
            }
            
            var blob = new Blob([JSON.stringify(dumpData, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'vrvs_localstorage_dump_' + new Date().getTime() + '.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>
```

---

## 🔧 PASSO 3 — FERRAMENTA DE RECOVERY DO SERVICE WORKER

### Arquivo: `docs/recovery_sw.html`

### Requisitos:
- ✅ ES5 puro
- ✅ NÃO mexe no localStorage
- ✅ Ao carregar, tenta:
  - `navigator.serviceWorker.getRegistrations().then(unregister)`
  - `caches.keys().then(delete)`
- ✅ Exibir status passo-a-passo na tela
- ✅ No final, mostrar link grande para abrir:
  - `./index.html?cachebust=<timestamp>`

### Estrutura proposta:
```html
<!DOCTYPE html>
<html>
<head>
    <title>VRVS - Recovery Service Worker</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: monospace; padding: 20px; background: #0a1a1f; color: #fff; }
        .status { padding: 10px; margin: 10px 0; background: #1a2a2f; }
        .success { background: #0a4a0a; }
        .error { background: #4a0a0a; }
        a { display: block; padding: 20px; background: #00CED1; color: #000; text-decoration: none; font-size: 24px; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>VRVS - Recovery Service Worker</h1>
    <div id="status"></div>
    <script>
        // ES5 puro
        function addStatus(msg, isError) {
            var div = document.createElement('div');
            div.className = 'status' + (isError ? ' error' : ' success');
            div.textContent = msg;
            document.getElementById('status').appendChild(div);
        }
        
        function recovery() {
            addStatus('Iniciando recovery...');
            
            // Unregister Service Workers
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    if (registrations.length === 0) {
                        addStatus('Nenhum Service Worker registrado.');
                    } else {
                        var promises = [];
                        for (var i = 0; i < registrations.length; i++) {
                            promises.push(registrations[i].unregister());
                        }
                        Promise.all(promises).then(function() {
                            addStatus('Service Workers desregistrados: ' + registrations.length);
                        }).catch(function(e) {
                            addStatus('Erro ao desregistrar SW: ' + e, true);
                        });
                    }
                }).catch(function(e) {
                    addStatus('Erro ao obter registrations: ' + e, true);
                });
            } else {
                addStatus('Service Worker não suportado.');
            }
            
            // Limpar Cache Storage
            if ('caches' in window) {
                caches.keys().then(function(cacheNames) {
                    if (cacheNames.length === 0) {
                        addStatus('Nenhum cache encontrado.');
                    } else {
                        var promises = [];
                        for (var i = 0; i < cacheNames.length; i++) {
                            promises.push(caches.delete(cacheNames[i]));
                        }
                        Promise.all(promises).then(function() {
                            addStatus('Caches deletados: ' + cacheNames.length);
                        }).catch(function(e) {
                            addStatus('Erro ao deletar caches: ' + e, true);
                        });
                    }
                }).catch(function(e) {
                    addStatus('Erro ao obter caches: ' + e, true);
                });
            } else {
                addStatus('Cache Storage não suportado.');
            }
            
            // Link para abrir index.html com cachebust
            setTimeout(function() {
                var timestamp = new Date().getTime();
                var link = document.createElement('a');
                link.href = './index.html?cachebust=' + timestamp;
                link.textContent = 'Abrir VRVS (com cachebust)';
                document.body.appendChild(link);
                addStatus('Recovery concluído! Clique no link acima.');
            }, 2000);
        }
        
        // Executar ao carregar
        window.onload = recovery;
    </script>
</body>
</html>
```

---

## 📦 PASSO 4 — BUMP CACHE_NAME NO SW.JS

### Ação:
- Atualizar `CACHE_NAME` em `docs/sw.js` para:
  ```javascript
  const CACHE_NAME = "vrvs-ROLLBACK-STABLE-20251220-2200";
  ```

### Verificações:
- ✅ Garantir que no `activate` o SW delete caches antigos (se baseline já faz isso, manter)
- ✅ Se o `sw.js` tiver precache list, incluir:
  - `/dump_localstorage.html`
  - `/recovery_sw.html`
- ✅ Se baseline não tiver precache list explícita, não inventar arquitetura

---

## 📝 PASSO 5 — COMMIT + RELATÓRIO

### Relatório a criar:
`DIARIO/CURSOR/ROLLBACK_STABLE_RELATORIO.md`

**Conteúdo:**
- BASE escolhido (hash + mensagem)
- Quais arquivos foram restaurados do baseline
- CACHE_NAME novo
- Conteúdo/descrição das novas ferramentas (dump/recovery)
- Checklist de teste no iPhone

### Commit:
```bash
git add docs/index.html docs/sw.js docs/dump_localstorage.html docs/recovery_sw.html DIARIO/CURSOR/ROLLBACK_STABLE_RELATORIO.md
git commit -m "revert: rollback para baseline estável + ferramentas de recuperação (sem tocar localStorage)"
```

---

## ✅ CRITÉRIOS DE ACEITE

### Desktop:
- [ ] `index.html` abre e app funciona normalmente
- [ ] Dados do localStorage aparecem corretamente
- [ ] Touches/cliques funcionam

### iPhone:
- [ ] `/dump_localstorage.html` abre e gera dump
- [ ] `/recovery_sw.html` completa unregister + limpa Cache Storage
- [ ] Depois do recovery, `index.html` abre e touches funcionam
- [ ] Dados do localStorage NÃO foram apagados

### Verificações críticas:
- [ ] Nenhum código novo que escreva/apague localStorage automaticamente no boot
- [ ] Nenhuma migração/saneamento automático durante boot
- [ ] CACHE_NAME atualizado força atualização

---

## 🚨 RISCOS IDENTIFICADOS

### Risco 1: Sintaxe moderna no baseline
- **Probabilidade:** Baixa
- **Mitigação:** Verificar com `grep` após restaurar
- **Ação se ocorrer:** STOP e reportar (não fazer replace automático)

### Risco 2: Service Worker não atualiza
- **Probabilidade:** Média (cache pode persistir)
- **Mitigação:** Ferramenta `recovery_sw.html` + cachebust no link
- **Ação se ocorrer:** Usar recovery tool manualmente

### Risco 3: Dados corrompidos no localStorage
- **Probabilidade:** Baixa (não estamos mexendo)
- **Mitigação:** Ferramenta `dump_localstorage.html` para backup antes
- **Ação se ocorrer:** Restaurar do dump se necessário

---

## 📊 RESUMO EXECUTIVO

### O que será feito:
1. ✅ Restaurar `docs/index.html` e `docs/sw.js` do commit `0dadca9`
2. ✅ Criar `docs/dump_localstorage.html` (ferramenta de backup)
3. ✅ Criar `docs/recovery_sw.html` (ferramenta de recovery)
4. ✅ Bump `CACHE_NAME` no `sw.js`
5. ✅ Criar relatório completo
6. ✅ Commit e push

### O que NÃO será feito:
- ❌ Apagar localStorage
- ❌ Migrar/sanear dados automaticamente
- ❌ Refatorar código
- ❌ Criar novos HOTFIXs

### Tempo estimado:
- Restauração: ~1 minuto
- Criação de ferramentas: ~10 minutos
- Testes: ~5 minutos
- **Total:** ~15-20 minutos

---

## ✅ PRONTO PARA EXECUÇÃO?

**Status:** ✅ SIM

**Confirmações:**
- ✅ Baseline identificado: `0dadca9`
- ✅ Arquivos a restaurar: `docs/index.html`, `docs/sw.js`
- ✅ Ferramentas a criar: `dump_localstorage.html`, `recovery_sw.html`
- ✅ CACHE_NAME a atualizar: `vrvs-ROLLBACK-STABLE-20251220-2200`
- ✅ Regras críticas entendidas: NÃO apagar localStorage, NÃO migrar dados

**Aguardando validação do usuário para executar.**

---

**FIM DA ANÁLISE**

