# VRVS — Fase 2 TEOT: Configurações + Fichários/Perfis

## 1) Objetivo do Vinícius (resumo)
- Preparar plataforma para Fase 2 do TEOT.
- Ter uma aba de Configurações.
- Ter toggles para DESLIGAR tudo do Diário VRVS sem apagar histórico.
- Possibilidade de "plataforma zerada" só para o Vinícius sem afetar mãe/amiga.

## 2) Requisitos (o que precisa acontecer)
### 2.1 Configurações (Diário)
- Toggle mestre: "Desligar tudo do Diário" (sem deletar dados).
- Toggle mestre: "Ligar tudo do Diário".
- Ao desligar: UI e fluxos do Diário ficam inativos/ocultos; dados permanecem salvos (histórico intacto).
- Depois: usuário liga só o que quiser.

### 2.2 Fichários/Perfis (multi datasets)
- Criar perfis (ex.: DEFAULT, TEOT_F2, FILOSOFIA, R4_ESPORTIVA).
- Cada perfil tem seus próprios dados (diário, histórico, anotações, temas, config).
- Trocar perfil não deve corromper dados nem exigir reinstalar PWA.

## 3) Não-objetivos (para não explodir escopo)
- Não refatorar a plataforma inteira.
- Não migrar todo mundo automaticamente sem necessidade.
- Não mexer em Service Worker além do necessário por patch.

## 4) Opções de implementação (com prós/contras)
### Opção A — Perfis dentro do app (recomendado)
- Prefixo por perfil nas chaves do localStorage (ex.: vrvs:TEOT_F2:vrvs_diario)
- DEFAULT continua compatível com chaves antigas.
Prós: um app só, sem duplicar repo; não afeta usuários se default for o mesmo.
Contras: exige UI mínima de troca de perfil + wrappers de storage.

### Opção B — Outro repo GitHub Pages
- Atenção: mesma origem => localStorage compartilhado => colisão se chaves iguais.
- Para funcionar: mudar prefixo OU hospedar em outra origem.
Prós: isolamento de código.
Contras: manutenção duplicada; risco de colisão se mesma origem.

## 5) MVP recomendado (por etapas)
### Etapa 1 (segura): Aba Configurações + toggles do Diário
- Introduzir vrvs_config.diario.enabled + flags
- Botões "desligar tudo" e "ligar tudo"
- Nenhuma deleção de dados
- Teste iPhone: abrir/fechar e navegar abas 5x

### Etapa 2 (segura): Perfis (somente infra + troca simples)
- Criar "activeProfile" em vrvs_config
- Criar wrapper getKey(profile, baseKey)
- DEFAULT lê/escreve chaves antigas (compatibilidade)
- Novo perfil usa namespace

### Etapa 3: Polimento UX e proteções
- Aviso ao trocar perfil
- Backup/export por perfil
- Indicador discreto do perfil ativo

## 6) Riscos e mitigação
- Risco: quebrar compatibilidade com dados antigos -> Mitigar mantendo DEFAULT legado.
- Risco: confusão de usuário -> Mitigar escondendo perfil em "Avançado".
- Risco: quota -> Mitigar com boas práticas já existentes + avisos.

## 7) Perguntas abertas (para Opus ajudar)
- UX ideal para troca de perfil (dropdown? modal? botão oculto?)
- Nomenclatura: Perfil vs Fichário vs Caderno
- Se vale ter "perfis" antes de expandir configurações
