# 🧼 PROTOCOLO PATCH LIMPO – VRVS (FRONTEND)

## 1. Objetivo

Garantir que TODO ajuste de código na VRVS seja:

- mínimo e cirúrgico,
- tecnicamente justificado (diagnóstico antes do remendo),
- alinhado ao design system existente,
- sem virar "monstro" cheio de `!important`, hacks e remendos.

Este protocolo vale para:

- HTML
- CSS
- JavaScript do `index.html`
- Ajustes em `sw.js` e `manifest.json` quando citados explicitamente.

---

## 2. Gatilho de ativação

**Sempre que o usuário escrever:**

> `ATIVAR PROTOCOLO PATCH LIMPO`

você deve:

1. Ler este documento.
2. Aplicar TODAS as regras abaixo.
3. Deixar claro na resposta que está seguindo o PROTOCOLO PATCH LIMPO.

Esse protocolo também vale por padrão para qualquer tarefa de refino/bugfix em VRVS, mesmo sem o gatilho, a menos que o usuário peça explicitamente um "experimento livre".

---

## 3. Regras de Ouro

### ⚠️ REGRA CRÍTICA: Remover conflitos antes de adicionar regras

**Sempre que identificar um conflito CSS/JS:**

1. **PRIMEIRO:** Identificar qual regra está causando o conflito
2. **SEGUNDO:** Remover ou ajustar a regra conflitante
3. **TERCEIRO:** Só então adicionar regras novas se realmente necessário

**Exemplo prático:**
- ❌ ERRADO: Adicionar `#novaDiarioTopico { min-height: 80px !important; }` quando já existe `#modalNovaDiario .form-textarea { min-height: 300px !important; }`
- ✅ CORRETO: Remover ou ajustar `#modalNovaDiario .form-textarea` para não afetar `#novaDiarioTopico`, ou usar especificidade maior sem `!important`

## 3. Regras de Ouro (continuação)

### 3.1. Diagnóstico antes de solução

Antes de sugerir qualquer mudança:

1. **Mostrar o diagnóstico completo**:

   - Quais regras CSS/JS/HTML estão afetando o elemento?

   - Onde há conflitos (especificidade, `!important`, media queries)?

   - **Identificar a causa raiz provável** - não apenas sintomas.

   - **Verificar se há regras conflitantes que podem ser REMOVIDAS** em vez de adicionar novas.

2. **Priorizar remover conflitos** em vez de adicionar regras novas.

3. Só depois propor a correção mínima.

**Proibido:** já sair colando bloco gigante de CSS/JS sem explicar o motivo.

**Proibido:** adicionar propriedades "por tentar" sem evidência clara de necessidade (ex: `position: relative`, `left: 0`, `transform: translateZ(0)`).

---

### 3.2. Alterar o mínimo necessário

Sempre preferir:

- Ajustar **1–3 regras bem específicas**  

  em vez de criar blocos enormes com `!important`.

- Reescrever **uma função inteira** quando for preciso mudar a lógica,

  em vez de encaixar remendos no meio.

**Exemplo correto:**

- "Remover esta regra X que está em conflito"

- "Definir `#novaDiarioTopico` assim, com essas propriedades…"

**Exemplo errado:**

- "Adicionar 15 propriedades com `!important` em cima de tudo".

---

### 3.3. `!important` é último recurso

Regras:

- NÃO introduzir novos `!important` sem justificativa explícita.

- Se já existir `!important` causando problema:

  - tentar **remover** ou reduzir o uso,

  - ou escopar melhor as regras.

---

### 3.4. Não adicionar `transform` em pais de inputs/textarea sem necessidade

- `transform`, `translateZ(0)` e hacks similares podem quebrar caret em iOS.

- **REGRA RÍGIDA:** NÃO adicionar `transform: translateZ(0)`, `will-change: transform`, ou qualquer hack de aceleração hardware em containers de inputs/textarea "por tentar" ou "para melhorar performance".

- Só usar se o usuário pedir explicitamente **efeito visual específico** ou se o diagnóstico mostrar evidência clara de que é realmente necessário (ex: problema de renderização específico documentado).

- **Se não há evidência clara, NÃO adicionar.** Prefira remover conflitos existentes primeiro.

- Se for usar, explicar claramente o impacto e por que é necessário.

**Exemplo do erro que NÃO deve repetir:**
- ❌ **ERRADO:** Sugerir adicionar `transform: translateZ(0)` no `.modal-content` "para melhorar renderização" sem evidência clara
- ✅ **CORRETO:** Remover conflitos de CSS primeiro, só adicionar transform se houver evidência específica de necessidade

---

### 3.5. Manter design system e semântica

- Usar sempre as variáveis e cores do design system:  

  `var(--turquesa-*)`, `var(--cobre-*)`, etc.

- Não inventar novas cores aleatórias se não for pedido.

- Não mudar comportamento de outras abas/componentes fora do escopo pedido.

---

## 4. Ordem de Ação (passo a passo)

Sempre que for aplicar um patch:

1. **Repetir o escopo** com suas palavras:

   - "Vou mexer APENAS em X e Y; não vou tocar em Z."

2. **Mostrar o trecho atual relevante** (resumo sicuro, sem colar o arquivo inteiro).

3. **Apontar o conflito ou problema:**

   - estilo X sobrescreve Y

   - função Z é chamada com parâmetros errados

   - etc.

4. **Propor solução mínima**, sempre priorizando:

   - **REMOVER regras conflitantes** em vez de adicionar novas

   - **AJUSTAR especificidade** em vez de usar `!important`

   - **CORRIGIR a causa raiz** em vez de adicionar hacks

   Exemplos corretos:

   - "Remover esta regra X que está em conflito…"

   - "Ajustar especificidade desta regra para não conflitar…"

   - "Substituir a função `renderAgendaAtrasados()` por esta versão completa…"

   Exemplos ERRADOS (evitar):

   - "Adicionar `position: relative` e `left: 0` para forçar posição…" (sem evidência)

   - "Adicionar `transform: translateZ(0)` para melhorar renderização…" (hack sem necessidade)

   - "Adicionar mais `!important` para sobrescrever…" (prefira remover conflito)

5. **Deixar o patch bem delimitado**, com instruções do tipo:

   - "Localize a função X e substitua TODO o corpo por…"

   - "Remova esta regra CSS específica…"

6. **Checklist final de validação**:

   - listar o que o usuário deve testar, RELEVANTE ao patch.

---

## 5. Coisas explicitamente proibidas

Quando o PROTOCOLO PATCH LIMPO estiver ativo, **NÃO FAZER**:

1. Jogar blocos grandes com `!important` em ids sem real necessidade.

2. Adicionar `transform: translateZ(0)`, `will-change`, `position: relative`, `left: 0`, ou qualquer hack "por tentar" sem evidência clara de necessidade.

3. **Adicionar propriedades sem evidência:** Se não há evidência clara de que uma propriedade resolve o problema, NÃO adicionar. Prefira remover conflitos existentes primeiro.

4. Alterar múltiplas abas/telas de uma vez quando o usuário pediu só uma (ex: pediu Agenda → Atrasados, não mexer em Tarefas).

5. Mudar sem avisar:

   - hierarquia HTML importante,

   - nomes de classes/id usados em outros lugares,

   - comportamento de funções globais.

6. Responder "Pronto, corrigido" sem:

   - explicar o que mudou,

   - nem listar o que testar.

7. **Ignorar conflitos existentes:** Se identificar uma regra conflitante (ex: `min-height: 300px !important` sobrescrevendo `min-height: 80px`), REMOVER ou ajustar a regra conflitante primeiro, não adicionar mais regras em cima.

---

## 6. Template de resposta (quando o protocolo estiver ativo)

Quando o usuário pedir um ajuste com este protocolo ativo, a resposta deve seguir esse formato:

1. **Resumo do problema** (1–3 linhas)

2. **Diagnóstico** (o que você encontrou no CSS/HTML/JS)

3. **Solução proposta mínima** (com os trechos a substituir/remover/adicionar)

4. **Garantias**:

   - o que você garante que NÃO será alterado

5. **Checklist de testes** para o usuário

Exemplo de início de resposta:

> Estou ativando o PROTOCOLO PATCH LIMPO.
> 
> **Problema:** caret do `#novaDiarioTopico` aparece fora do box no iOS e campo é curto.
> 
> **Diagnóstico resumido:** regra `#modalNovaDiario .form-textarea` com `min-height: 300px !important` está conflitando com `#novaDiarioTopico`, etc…

---

## 7. Persistência

A partir de agora, para o projeto VRVS:

- Considere este protocolo como padrão.

- Se em algum momento eu quiser **suspender** temporariamente e testar algo mais agressivo, vou avisar explicitamente.

- Caso contrário, SEMPRE siga estas regras.

