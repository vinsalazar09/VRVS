# PREVIEW — ALVO B: GERENCIAR PERFIS (CRUD) + BACKUP POR PERFIL

**Data:** 2026-02-05  
**Status:** FASE 1 — PREVIEW / DIAGNÓSTICO (SEM EXECUTAR)  
**Prioridade:** MÉDIA (melhoria de funcionalidade)

---

## 1. CONTEXTO

**Status atual:**
- ✅ Perfis isolados funcionando (VIDA realmente zerado)
- ✅ Namespacing completo implementado (`window.vrvs_key()`)
- ✅ Modal "Gerenciar Perfis" existe mas é apenas informativo
- ❌ Não há CRUD de perfis (criar/renomear/apagar)
- ❌ Backup/Exportar/Importar não respeita perfil ativo

**Objetivo:**
- Implementar CRUD completo de perfis
- Backup/Exportar/Importar por perfil (não misturar datasets)

---

## 2. MAPEAMENTO COMPLETO

### A) Selector de perfil ativo

**Localização:**
- **Linha 5115:** Select HTML:
  ```html
  <select id="perfilAtivoSelect" onchange="trocarPerfil(this.value)">
      <option value="DEFAULT">DEFAULT</option>
      <option value="VIDA">VIDA</option>
  </select>
  ```
- **Linha 11108-11148:** `window.trocarPerfil(perfilNome)` - função de troca

**Armazenamento:**
- **Linha 5613:** `window.vrvs_perfilAtivo = localStorage.getItem('vrvs_perfil_ativo') || 'DEFAULT';`
- **Chave:** `vrvs_perfil_ativo` (string simples: 'DEFAULT' ou 'VIDA')

---

### B) Armazenamento de perfis (estrutura atual)

**Perfis existentes:**
- **DEFAULT:** Perfil padrão (usa chaves legacy sem namespace)
- **VIDA:** Perfil secundário (usa chaves namespaced: `vrvs_VIDA_*`)

**Como perfis são armazenados:**
- **NÃO há lista centralizada de perfis** (apenas `vrvs_perfil_ativo` indica qual está ativo)
- Perfis são **inferidos** pela existência de chaves namespaced no localStorage
- Exemplo: Se existe `vrvs_VIDA_diario`, então perfil "VIDA" existe
- **DEFAULT:** Usa chaves legacy (`vrvs_diario`, `vrvs_dados`, etc.) - SEM namespace
- **Outros perfis:** Usam chaves namespaced (`vrvs_VIDA_diario`, `vrvs_VIDA_dados`, etc.)

**Problema atual:**
- Não há forma de listar todos os perfis existentes dinamicamente
- Lista no modal é hardcoded (DEFAULT e VIDA)
- Não há forma de criar/renomear/apagar perfis
- Não há validação de nomes únicos

---

### C) Lógica de namespacing por perfil

**Função central:** `window.vrvs_key(baseKey)`  
**Localização:** Linha 5615-5625

**Lógica atual:**
```javascript
// Linha 5777-5783
window.vrvs_key = function(baseKey) {
    const p = window.vrvs_perfilAtivo || 'DEFAULT';
    if (p === 'DEFAULT') {
        return `vrvs_${baseKey}`;  // Legacy compat (sem prefixo de perfil)
    }
    return `vrvs_${p}_${baseKey}`; // Namespaced (ex: vrvs_VIDA_dados)
};
```

**Observação importante:**
- DEFAULT retorna `vrvs_diario` (não `diario`)
- Outros perfis retornam `vrvs_VIDA_diario` (com prefixo de perfil)

**Chaves afetadas:**
- `diario` → `vrvs_DEFAULT_diario` ou `vrvs_VIDA_diario`
- `dados` → `vrvs_DEFAULT_dados` ou `vrvs_VIDA_dados`
- `historico` → `vrvs_DEFAULT_historico` ou `vrvs_VIDA_historico`
- `anotacoes` → `vrvs_DEFAULT_anotacoes` ou `vrvs_VIDA_anotacoes`
- `lembretes` → `vrvs_DEFAULT_lembretes` ou `vrvs_VIDA_lembretes`
- `areas_custom` → `vrvs_DEFAULT_areas_custom` ou `vrvs_VIDA_areas_custom`

**Exceções (chaves globais, não namespaced):**
- `vrvs_config` (configuração global)
- `vrvs_perfil_ativo` (perfil ativo)
- `vrvs_backup_*` (backups)

---

### D) Modal "Gerenciar Perfis" atual

**Localização:**
- **Linha 5010:** Botão que abre modal:
  ```html
  <button class="btn btn-secondary" onclick="abrirModalGerenciarPerfis()">⚙️ Gerenciar perfis</button>
  ```
- **Linha 5186-5220:** HTML do modal `#vrvsModalPerfis`
- **Linha 8747-8780:** Função `window.abrirModalGerenciarPerfis()`

**Conteúdo atual:**
- Apenas informativo (mostra status atual, destino, perfis existentes)
- Não tem ações (criar/renomear/apagar)
- Não tem formulários

---

### E) Backup/Exportar/Importar atual

**Funções principais:**
- **Linha 5371:** `exportarBackupCompleto()` - exporta TODAS as chaves `vrvs_*`
- **Linha 5420:** `importarBackupJSON()` - importa backup completo
- **Linha 5290:** `fazerBackupCompleto()` - cria backup automático

**Problema atual:**
- Exporta/importa **TODOS** os perfis misturados
- Não respeita `window.vrvs_perfilAtivo`
- Não permite escolher qual perfil exportar/importar

---

## 3. PROPOSTA DE DESIGN MÍNIMO

### A) CRUD de Perfis

#### 1. **Criar Perfil**

**Fluxo:**
1. Botão "➕ Criar Perfil" no modal
2. Input para nome (validar: não vazio, único, sem caracteres especiais)
3. Validação: não pode criar perfil com nome já existente
4. Ao criar: inicializar dataset zerado (chaves namespaced vazias)
5. Atualizar lista de perfis no modal

**Validações:**
- Nome obrigatório (não vazio)
- Nome único (não pode existir perfil com mesmo nome)
- Nome válido (apenas letras, números, underscore, hífen)
- Não pode criar "DEFAULT" (reservado)

**Implementação:**
- Função `criarPerfil(nome)` que:
  - Valida nome (não vazio, único, sem caracteres especiais, não pode ser "DEFAULT")
  - Cria chaves namespaced vazias usando `window.vrvs_key()`:
    - `vrvs_${nome}_diario`: `{"entradas":[],"schemaVersion":"1.0"}`
    - `vrvs_${nome}_dados`: `[]`
    - `vrvs_${nome}_historico`: `[]`
    - `vrvs_${nome}_anotacoes`: `{}`
    - `vrvs_${nome}_lembretes`: `[]`
    - `vrvs_${nome}_areas_custom`: `[]`
  - Não muda perfil ativo automaticamente
  - Atualiza lista no modal dinamicamente

#### 2. **Renomear Perfil**

**Fluxo:**
1. Botão "✏️ Renomear" ao lado de cada perfil (exceto DEFAULT)
2. Input para novo nome (validar: não vazio, único)
3. Ao renomear: renomear todas as chaves namespaced no localStorage
4. Se perfil renomeado é o ativo, atualizar `vrvs_perfil_ativo`

**Validações:**
- Novo nome obrigatório e único
- Não pode renomear DEFAULT
- Não pode renomear para nome existente

**Implementação:**
- Função `renomearPerfil(nomeAntigo, nomeNovo)` que:
  - Valida novo nome (não vazio, único, não pode ser "DEFAULT")
  - Lista todas as chaves do localStorage que começam com `vrvs_${nomeAntigo}_`
  - Para cada chave:
    - Ler valor com `localStorage.getItem(chaveAntiga)`
    - Criar nova chave `vrvs_${nomeNovo}_${sufixo}`
    - Escrever valor com `localStorage.setItem(chaveNova, valor)`
    - Apagar chave antiga com `localStorage.removeItem(chaveAntiga)`
  - Se `nomeAntigo === window.vrvs_perfilAtivo`, atualizar `vrvs_perfil_ativo = nomeNovo`
  - Atualizar lista no modal

#### 3. **Apagar Perfil**

**Fluxo:**
1. Botão "🗑️ Apagar" ao lado de cada perfil (exceto DEFAULT)
2. Confirmação forte: modal com aviso "Esta ação não pode ser desfeita"
3. Listar quantos dados serão apagados (ex: "X entradas do Diário, Y temas, etc.")
4. Ao confirmar: apagar todas as chaves namespaced do perfil
5. Se perfil apagado é o ativo, trocar para DEFAULT

**Validações:**
- Não pode apagar último perfil (deve ter pelo menos DEFAULT)
- Não pode apagar DEFAULT
- Confirmação obrigatória (não pode ser acidental)

**Implementação:**
- Função `apagarPerfil(nome)` que:
  - Valida que não é último perfil (deve ter pelo menos DEFAULT)
  - Valida que não é DEFAULT
  - Conta dados antes de apagar (para mostrar no modal de confirmação):
    - Entradas do Diário: `JSON.parse(localStorage.getItem(window.vrvs_key('diario')) || '{"entradas":[]}').entradas.length`
    - Temas: `JSON.parse(localStorage.getItem(window.vrvs_key('dados')) || '[]').length`
    - etc.
  - Mostra modal de confirmação com detalhes ("X entradas, Y temas serão apagados permanentemente")
  - Lista todas as chaves `vrvs_${nome}_*` e apaga com `localStorage.removeItem()`
  - Se `nome === window.vrvs_perfilAtivo`, trocar para DEFAULT e atualizar UI
  - Atualizar lista no modal

---

### B) Backup por Perfil

#### 1. **Exportar por Perfil**

**Fluxo:**
1. Botão "📥 Exportar dados deste perfil" no modal
2. Exportar APENAS chaves do perfil ativo (`window.vrvs_perfilAtivo`)
3. Incluir metadata: nome do perfil, data, versão
4. Download JSON

**Implementação:**
- Função `exportarBackupPerfil(perfilNome)` que:
  - Se `perfilNome === 'DEFAULT'`: usar chaves legacy (`vrvs_dados`, `vrvs_diario`, etc.)
  - Se `perfilNome !== 'DEFAULT'`: usar chaves namespaced (`vrvs_${perfilNome}_dados`, etc.)
  - Coletar usando `window.vrvs_key()` temporariamente:
    ```javascript
    const perfilAnterior = window.vrvs_perfilAtivo;
    window.vrvs_perfilAtivo = perfilNome; // Temporário para usar vrvs_key()
    const dadosKey = window.vrvs_key('dados');
    const diarioKey = window.vrvs_key('diario');
    // ... coletar todas as chaves
    window.vrvs_perfilAtivo = perfilAnterior; // Restaurar
    ```
  - Inclui `vrvs_config` (global, mas necessário)
  - Cria JSON com metadata: `{ schemaVersion, perfilOrigem, createdAt, ...dados }`
  - Download via `URL.createObjectURL()` + `<a download>`

#### 2. **Importar para Perfil**

**Fluxo:**
1. Botão "📤 Importar dados para este perfil" no modal
2. Selecionar arquivo JSON
3. Validar formato e perfil de origem
4. Confirmação: "Importar para perfil [NOME]? Isso substituirá todos os dados atuais."
5. Importar APENAS para perfil ativo (não misturar com outros perfis)

**Implementação:**
- Função `importarBackupPerfil(perfilDestino, arquivoJSON)` que:
  - Valida formato JSON
  - Detecta perfil de origem do backup (metadata `perfilOrigem` ou inferir pelas chaves)
  - Backup automático antes de importar (`fazerBackupCompleto()`)
  - Para cada chave no backup:
    - Se backup tem chaves legacy (`vrvs_dados`): importar para `window.vrvs_key('dados')` do perfil destino
    - Se backup tem chaves namespaced (`vrvs_${origem}_dados`): renomear para `vrvs_${destino}_dados`
  - Restaurar dados no localStorage usando `window.vrvs_key()` do perfil destino
  - Re-renderizar seções afetadas (`renderDados()`, `renderDiario()`, etc.)
  - Se perfil destino é o ativo, atualizar UI imediatamente

**Proteções:**
- Backup automático antes de importar (`fazerBackupCompleto()`)
- Validação de formato JSON
- Confirmação obrigatória: "Importar para perfil [NOME]? Isso substituirá todos os dados atuais."
- Validação de schema (`schemaVersion`)

---

## 4. ARQUIVOS QUE SERIAM TOCADOS

### Arquivos modificados:
- `docs/index.html` (principal):
  - Atualizar HTML do modal `#vrvsModalPerfis` (adicionar botões/formulários)
- Adicionar funções CRUD: `criarPerfil()`, `renomearPerfil()`, `apagarPerfil()`
- Adicionar funções backup: `exportarBackupPerfil()`, `importarBackupPerfil()`
- Adicionar função helper: `listarPerfisExistentes()` que:
  - Percorre todas as chaves do localStorage com `Object.keys(localStorage)`
  - Filtra chaves que começam com `vrvs_` e têm formato `vrvs_${perfil}_${sufixo}`
  - Extrai nomes de perfis únicos (excluindo DEFAULT que usa chaves legacy)
  - Retorna array: `['DEFAULT', 'VIDA', ...]` (sempre inclui DEFAULT)
- Atualizar `abrirModalGerenciarPerfis()` para:
  - Chamar `listarPerfisExistentes()` e renderizar lista dinamicamente
  - Mostrar botões de ação (Criar/Renomear/Apagar) para cada perfil
  - Atualizar lista após criar/renomear/apagar

- `docs/sw.js` (bump CACHE_NAME após execução)

### Estimativa de linhas:
- HTML modal: +50 linhas (formulários, botões)
- Funções CRUD: +200 linhas (validações, renomeação de chaves)
- Funções backup: +150 linhas (exportar/importar por perfil)
- Helper listar perfis: +30 linhas
- **Total:** ~430 linhas adicionadas

---

## 5. RISCOS / ROLLBACK / CONFIANÇA

### Riscos identificados:

1. **Risco ALTO:** Apagar perfil pode perder dados permanentemente
   - **Mitigação:** Confirmação forte obrigatória, validação de último perfil
   - **Impacto:** Crítico se usuário apagar acidentalmente

2. **Risco MÉDIO:** Renomear perfil pode falhar se houver muitas chaves
   - **Mitigação:** Loop seguro, try/catch, validação antes de renomear
   - **Impacto:** Médio (pode deixar perfil em estado inconsistente)

3. **Risco MÉDIO:** Importar backup pode misturar dados se formato incorreto
   - **Mitigação:** Validação rigorosa de formato, renomeação explícita de chaves
   - **Impacto:** Médio (pode corromper dados do perfil)

4. **Risco BAIXO:** Listar perfis pode ser lento se houver muitas chaves
   - **Mitigação:** Cachear lista, atualizar apenas quando necessário
   - **Impacto:** Baixo (performance)

### Rollback simples:
- Reverter commit
- Bump `CACHE_NAME` de volta
- Push

### Confiança:
- **80% de confiança** para execução
  - Funcionalidade complexa (múltiplas operações críticas)
  - Requer testes extensivos
  - Risco de perda de dados se não implementado corretamente

### Confiança para corrigir se der ruim:
- **Média (70%):** Operações críticas (apagar/renomear) podem deixar dados inconsistentes
- **Rollback pode não restaurar dados apagados:** Dados perdidos não podem ser recuperados

---

## 6. CHECKLIST DE VALIDAÇÃO (iPhone - sem console)

### Teste 1: Criar Perfil
- [ ] Abrir modal "Gerenciar Perfis"
- [ ] Clicar "➕ Criar Perfil"
- [ ] Inserir nome válido (ex: "ESTUDO")
- [ ] **ESPERADO:** Perfil criado, aparece na lista ✅
- [ ] Trocar para novo perfil → **ESPERADO:** Dataset zerado ✅

### Teste 2: Renomear Perfil
- [ ] Criar perfil "TESTE"
- [ ] Adicionar alguns dados (entrada no Diário)
- [ ] Renomear para "TESTE2"
- [ ] Trocar para "TESTE2" → **ESPERADO:** Dados preservados ✅
- [ ] Verificar que "TESTE" não existe mais ✅

### Teste 3: Apagar Perfil
- [ ] Criar perfil "TEMP"
- [ ] Adicionar dados
- [ ] Tentar apagar → **ESPERADO:** Modal de confirmação aparece ✅
- [ ] Confirmar → **ESPERADO:** Perfil apagado, dados removidos ✅
- [ ] Tentar apagar último perfil → **ESPERADO:** Bloqueado ✅

### Teste 4: Exportar por Perfil
- [ ] Trocar para perfil "VIDA"
- [ ] Adicionar dados
- [ ] Exportar backup deste perfil
- [ ] Abrir JSON → **ESPERADO:** Apenas chaves `vrvs_VIDA_*` presentes ✅

### Teste 5: Importar para Perfil
- [ ] Trocar para perfil "VIDA"
- [ ] Importar backup de outro perfil
- [ ] **ESPERADO:** Dados importados apenas para VIDA ✅
- [ ] Trocar para DEFAULT → **ESPERADO:** Dados de DEFAULT não foram afetados ✅

---

## CONCLUSÃO

**Status:** ✅ Preview completo  
**Confiança:** 80% (funcionalidade complexa, requer testes extensivos)  
**Riscos:** Médios a altos (operações críticas de dados)  
**Recomendação:** Implementar em fases:
1. **Fase 1:** Listar perfis + Criar perfil (baixo risco)
2. **Fase 2:** Exportar/Importar por perfil (médio risco)
3. **Fase 3:** Renomear perfil (médio risco)
4. **Fase 4:** Apagar perfil (alto risco, última fase)

**Próximo passo:** Aguardar autorização para FASE 2 (execução) ou decidir ordem de implementação
