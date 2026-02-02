# FREEZE — Pendência: Imagem na Pergunta/Tópico (VRVS)

## Contexto (por que congelamos)
- Implementar "imagemPergunta" mostrou risco real de instabilidade (overlay travando touch no iPhone).
- Prioridade atual mudou: preparar plataforma para Fase 2 do TEOT com Configurações e possível "fichário/perfis".
- Decisão: manter estabilidade; retomar esta feature somente em micro-etapas.

## Estado atual (preencher pelo Cursor)
- HEAD local: `fcb2ac5`
- HEAD origin/main: `fcb2ac5`
- CACHE_NAME atual: `vrvs-v5.3.180-rescue-revert-mp2-20260127-0300`

## O que está OK hoje
- MP1: salvar imagemPergunta no modal (persistência) — ok.
- Produção estável após hotfix/revert do MP2 (sem overlay travando).

## O que NÃO está em produção / NÃO retomar agora
- MP2 completo (render em Diário/Sessão/Treino + viewer/overlay) — congelado.

## Plano de retomada (micro-etapas, 1 commit por vez, com teste iPhone)
- MP2-A: render thumb no Diário (SEM viewer/overlay).
- MP2-B: render thumb na Sessão Programada (SEM viewer/overlay).
- MP2-C: render thumb no Treino Livre + navegação runner (SEM viewer/overlay).
- MP2-D: viewer/overlay apenas no final, REUSANDO viewer existente da Resposta (ou com kill-switch + try/finally + single-overlay rule).

## Critério de sucesso (mensurável)
- 5 navegações seguidas no Treino Livre sem sumir thumb
- 5 aberturas seguidas do PWA sem travar touch

## PROVAS (anexadas automaticamente)

### git status -sb
## main...origin/main
 M DIARIO/CURSOR/CADERNO_ERROS_ACERTOS.txt
?? mapeamento_completo.txt
?? poc_texto_p1-50.txt
?? poc_titulos.txt
?? teot_data.json

### HEAD local
fcb2ac5
fcb2ac5 hotfix: reverter MP2 bug iPhone + rescue overlay + cache bump
8235f24 feat(diario): renderizar imagem na pergunta (MP2 diario+sessoes+treino)
79fc9f5 feat(diario): adicionar imagem na pergunta (MP1 modal+persistencia)
6cfb66a fix(treino): recarregar thumbnail ao navegar quando resposta ja mostrada
36b95de fix(treino): re-render TL ao salvar edicao e recarregar thumbnail

### HEAD origin/main
fcb2ac5 hotfix: reverter MP2 bug iPhone + rescue overlay + cache bump
8235f24 feat(diario): renderizar imagem na pergunta (MP2 diario+sessoes+treino)
79fc9f5 feat(diario): adicionar imagem na pergunta (MP1 modal+persistencia)
6cfb66a fix(treino): recarregar thumbnail ao navegar quando resposta ja mostrada
36b95de fix(treino): re-render TL ao salvar edicao e recarregar thumbnail
4048013 fix(tarefas): excluir status Planejado de tarefas do dia
8914bd7 fix(splash): remove debug lines completely from splash screen
59adaaa fix(splash): show full CACHE (wrap) and stack bottom lines; bump cache
0f58a3d fix(splash): evitar overlap BUILD/CACHE vs BOOT/ERR (ellipsis + spacing) + bump cache
164a594 fix(splash): centralize ERR writer and sanitize cache leak; bump sw cache

### CACHE_NAME
docs/sw.js
3:const CACHE_NAME = "vrvs-v5.3.180-rescue-revert-mp2-20260127-0300";
