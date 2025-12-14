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

### 3.1. Diagnóstico antes de solução

Antes de sugerir qualquer mudança:

1. **Mostrar o diagnóstico**:

   - Quais regras CSS/JS/HTML estão afetando o elemento?

   - Onde há conflitos (especificidade, `!important`, media queries)?

   - Se possível, apontar a **causa raiz provável**.

2. Só depois propor a correção.

**Proibido:** já sair colando bloco gigante de CSS/JS sem explicar o motivo.

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

- Só usar se o usuário pedir explicitamente **efeito visual específico** ou se o diagnóstico mostrar que é realmente necessário.

- Se for usar, explicar claramente o impacto.

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

4. **Propor solução mínima**, por exemplo:

   - "Remover esta regra…"

   - "Substituir a função `renderAgendaAtrasados()` por esta versão completa…"

   - "Definir este seletor específico assim…"

5. **Deixar o patch bem delimitado**, com instruções do tipo:

   - "Localize a função X e substitua TODO o corpo por…"

   - "Remova esta regra CSS específica…"

6. **Checklist final de validação**:

   - listar o que o usuário deve testar, RELEVANTE ao patch.

---

## 5. Coisas explicitamente proibidas

Quando o PROTOCOLO PATCH LIMPO estiver ativo, **NÃO FAZER**:

1. Jogar blocos grandes com `!important` em ids sem real necessidade.

2. Adicionar `transform: translateZ(0)` ou hacks de aceleração em containers de inputs/textarea só "por tentar".

3. Alterar múltiplas abas/telas de uma vez quando o usuário pediu só uma (ex: pediu Agenda → Atrasados, não mexer em Tarefas).

4. Mudar sem avisar:

   - hierarquia HTML importante,

   - nomes de classes/id usados em outros lugares,

   - comportamento de funções globais.

5. Responder "Pronto, corrigido" sem:

   - explicar o que mudou,

   - nem listar o que testar.

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

