# ✅ CHECKLIST TESTE IPHONE - Patch 3-1-2 + 4

**Data:** 20/12/2024  
**Objetivo:** Validar patches aplicados no iPhone Safari (PWA)  
**Prioridade:** ALTA (validação crítica antes de considerar concluído)

---

## 📱 PRÉ-REQUISITOS

- [ ] iPhone com Safari atualizado
- [ ] PWA instalado (ou acesso via Safari)
- [ ] Cache limpo (se necessário: Ajustes → Safari → Avançado → Limpar histórico)
- [ ] Dados de teste disponíveis (entradas com VRVS 3P ativo)

---

## 🧪 TESTES FUNCIONAIS

### 1. Indicadores no Cabeçalho (Patch 2)
- [ ] Abrir aba "Diário" → "Lista"
- [ ] Verificar contadores no topo aparecem: 🧠 ativos | ⏰ hoje | 📆 próximas
- [ ] Números batem com expectativa (contar manualmente se necessário)
- [ ] Contadores são visíveis sem precisar scrollar

### 2. Chips nas Entradas (Patch 1)
- [ ] Abrir aba "Diário" → "Lista" → Filtrar "Por Tema"
- [ ] Verificar chip 🧠 aparece em entradas com VRVS 3P ativo
- [ ] Verificar chip ⏰ aparece em entradas due hoje
- [ ] Verificar chip ⚠️ NÃO aparece (removido - Patch 4)
- [ ] Chips são clicáveis/tocáveis (tooltip aparece ao tocar)

### 3. Agrupamento "Por Tema" (Patch 1)
- [ ] Abrir aba "Diário" → "Lista" → Filtrar "Por Tema"
- [ ] Verificar que NÃO existe bloco separado "Revisar Hoje"
- [ ] Todas as entradas do mesmo tema aparecem juntas no mesmo grupo
- [ ] Entradas não aparecem duplicadas

### 4. Checkbox "Incluir nas revisões programadas" (Patch 4)
- [ ] Criar nova entrada → Marcar checkbox → Salvar
- [ ] Verificar que entrada aparece com chip 🧠 após salvar
- [ ] Verificar que contador "ativos" aumenta após salvar
- [ ] Editar entrada → Desmarcar checkbox → Salvar
- [ ] Verificar que chip 🧠 desaparece após salvar
- [ ] Verificar que contador "ativos" diminui após salvar

### 5. Atualização Automática dos Contadores (Patch 2)
- [ ] Criar nova entrada com checkbox marcado → Verificar contadores atualizam imediatamente
- [ ] Responder sessão programada → Verificar contadores atualizam após resposta
- [ ] Editar entrada (ativar/desativar SRS) → Verificar contadores atualizam após salvar

### 6. Sessão Programada (Patch 3)
- [ ] Abrir aba "Diário" → "Sessão"
- [ ] Verificar que apenas entradas due hoje aparecem na fila
- [ ] Verificar que contador "hoje" bate com número de cards na sessão
- [ ] Responder card (Esqueci/Lembrei/Fácil) → Verificar próximo card aparece
- [ ] Verificar que contadores atualizam após responder

### 7. Filtros e Visualizações
- [ ] Filtrar "Por Tema" → Verificar agrupamento funciona
- [ ] Filtrar "Por Data" → Verificar agrupamento funciona
- [ ] Filtrar por Área → Verificar apenas entradas da área aparecem
- [ ] Filtrar por Tema → Verificar apenas entradas do tema aparecem

---

## 🐛 TESTES DE REGRESSÃO

### 8. Performance e Estabilidade
- [ ] App não trava ao criar/editar múltiplas entradas
- [ ] App não trava ao responder sessão longa
- [ ] Contadores atualizam sem delay perceptível
- [ ] Renderização não causa "flash" ou "flicker"

### 9. Offline (PWA)
- [ ] App funciona offline após carregar inicialmente
- [ ] Dados persistem após fechar/abrir app
- [ ] Contadores mantêm valores corretos após reload

### 10. Navegação e UX
- [ ] Transições entre abas são suaves
- [ ] Modais abrem/fecham corretamente
- [ ] Botões são tocáveis (não precisam múltiplos toques)
- [ ] Scroll funciona suavemente

---

## ⚠️ PROBLEMAS CONHECIDOS (VALIDAR SE RESOLVIDOS)

### 11. Bug de Agrupamento Original
- [ ] Entrada isolada em "Revisar Hoje" separada do tema → **NÃO deve mais acontecer**
- [ ] Todas as entradas do mesmo tema aparecem juntas → **Deve acontecer**

### 12. Inconsistência Sessão vs Listagem
- [ ] Número de entradas na sessão bate com contador "hoje" → **Deve bater**
- [ ] Entradas na sessão são as mesmas que aparecem com chip ⏰ → **Devem ser as mesmas**

---

## 📊 RESULTADO ESPERADO

**Todos os itens acima devem estar ✅ (check)**

**Se algum item falhar:**
1. Anotar qual item falhou
2. Descrever comportamento observado
3. Tirar screenshot se possível
4. Reportar no próximo chat

---

## 🎯 CRITÉRIO DE SUCESSO

**PATCH CONSIDERADO VÁLIDO SE:**
- ✅ Itens 1-7 (funcionais) todos passam
- ✅ Itens 8-10 (regressão) não introduzem novos problemas
- ✅ Itens 11-12 (problemas conhecidos) estão resolvidos

**PATCH CONSIDERADO INVÁLIDO SE:**
- ❌ Qualquer item funcional (1-7) falha
- ❌ Regressões críticas introduzidas (8-10)
- ❌ Problemas conhecidos (11-12) ainda existem

