# PROTOCOLO — TROCA DE CHAT (VRVS) — ChatGPT ⇄ ChatGPT

Data: ____/____/____

Responsável: Vinícius

## Objetivo

Garantir continuidade sem ruído, reduzir risco de confusão de estado, e impedir "tiro no escuro".

---

## Parte A — Estado Congelado (obrigatório)

Preencha e cole no novo chat:

- Status iPhone PWA: ( ) ok  ( ) bug

- Status Safari iPhone: ( ) ok  ( ) bug

- Status Desktop: ( ) ok  ( ) bug

### Git (evidência)

Cole saídas:

- `git status -sb`

- `git log --oneline -5`

- `git log origin/main..HEAD --oneline`  → deve estar vazio para "publicado e sincronizado"

### Build / SW

- CACHE_NAME atual (sw.js): ______________________

- Commit atual (HEAD): ___________________________

### Última decisão (o que foi resolvido)

- _______________________________

- _______________________________

### O que NÃO mexer (decisão de produto)

- _______________________________

---

## Parte B — Lições Aprendidas (obrigatório, curto)

1) O que quebrou (causa real):

- _______________________________

2) O que funcionou (fix real):

- _______________________________

3) Anti-padrões (proibidos):

- Assumir causa sem evidência

- Refactor fora do alvo

- Debug/overlay ligado em produção

- Pedir console / pedir apagar PWA

---

## Parte C — Pendências Atuais (lista curta, sem inventar backlog)

1) _______________________________

2) _______________________________

3) _______________________________

Escolha UMA para o próximo chat atacar primeiro: #__

---

## Parte D — Metodologia (repetir no topo do novo chat)

### Workflow 3 Fases

FASE 1 Diagnóstico/Check → FASE 2 Patch mínimo → FASE 3 Validação/Checklist

### Regras de Patch

- 5–30 linhas ideal

- 1 bug por commit (quando possível)

- Bump CACHE_NAME quando mexer em produção

### Regras de Git

- Nunca "push feito" sem status/logs

- Não poluir deploy (arquivos fora de docs/)

---

## Parte E — Papéis das ferramentas (clareza)

- ChatGPT: diagnóstico/estratégia + patch mínimo (texto preciso)

- Cursor: implementar + git + diffs + gerar relatório objetivo

- Claude Opus (se usado): planejamento e revisão crítica (sem chutar)

---

## Parte F — Checklist de Encerramento (antes de trocar de chat)

- [ ] iPhone PWA testado e OK

- [ ] `git log origin/main..HEAD` vazio (sincronizado)

- [ ] CACHE_NAME bumpado se houve mudança em produção

- [ ] Debug OFF por default (ou removido)

- [ ] "Estado Congelado" preenchido (Parte A)

- [ ] Pendência #1 escolhida para o próximo chat

