# 📷 ANÁLISE FASE 4.2 - INSERIR IMAGENS (DECISÃO OPUS)

**Data:** 12 de Dezembro de 2025  
**Status:** APROVADO - PRIORIDADE BAIXA  
**Implementação:** Opção A Modificada

---

## ✅ DECISÃO DO OPUS

**Opção escolhida:** Opção A Modificada (Base64 com limites rigorosos)

**Motivo:** Manter 100% offline, melhor UX no iPhone

---

## 📐 ESPECIFICAÇÕES APROVADAS

### Limites Definidos

| Parâmetro | Valor | Justificativa |
|-----------|-------|---------------|
| **Largura máxima** | 600px (não 800) | iPhone não precisa mais que isso |
| **Qualidade** | 0.5 (não 0.7) | Compressão mais agressiva |
| **Tamanho máximo por imagem** | 150KB após compressão | Se passar, rejeitar |
| **Imagens por anotação** | Máximo 2 | Controla crescimento |
| **Aviso de storage** | Quando > 60% usado | Proativo |

### Cálculo de Segurança

- **Storage disponível:** ~5MB
- **Dados atuais estimados:** ~1.5MB (temas, histórico, anotações)
- **Reserva segura:** 1MB
- **Disponível para imagens:** ~2.5MB
- **Com limite 150KB/imagem:** ~16 imagens total

**Resultado:** Usuário pode ter ~16 imagens no total, razoável para pontos de atenção específicos.

---

## 💡 COMPORTAMENTO ESPERADO

### Fluxo de Upload

1. Usuário clica "📷 Adicionar Imagem"
2. Seleciona foto do iPhone
3. Sistema:
   - Comprime para 600px, quality 0.5
   - Verifica se < 150KB
   - Se > 150KB → "Imagem muito grande, tente outra"
   - Se OK → mostra preview
4. Usuário confirma
5. Salva em Base64 na anotação

### Avisos de Storage

**Se storage > 60%:**
```
⚠️ Espaço de armazenamento em 60%. Considere exportar backup.
```

**Se storage > 80%:**
```
🔴 Espaço crítico! Exporte backup e remova imagens antigas.
```

**Se storage > 90%:**
- Bloquear novos uploads de imagem
- Mensagem: "❌ Sem espaço. Exporte backup antes de adicionar mais imagens."

---

## 📝 ESTRUTURA DE DADOS APROVADA

```javascript
// Entrada do Diário com imagem
{
    id: 123,
    data: "2025-12-12",
    area: "Ombro e Cotovelo",
    tema: "LAC/LEC",
    topico: "Classificação de Rockwood",
    resposta: "Tipo 1- distensão...",
    atencao: true, // flag ⚠️
    imagens: [
        {
            id: "img_" + Date.now(),
            base64: "data:image/jpeg;base64,...",
            tamanhoKB: 142,
            dataAdicao: "2025-12-12T18:30:00"
        }
    ],
    criadoEm: "2025-12-12T18:00:00",
    ultimaAtualizacao: "2025-12-12T18:30:00"
}
```

---

## 🚦 STATUS FINAL

**Prioridade:** BAIXA - implementar após itens 4.1 e 4.3

**Escopo:** Apenas Diário por enquanto (Caderno depois)

**Ordem de Implementação:**
1. ✅ 5.1 - Radar transparente (5 min) - CONCLUÍDO
2. ✅ 3.4 - Formatação Diário (15 min) - CONCLUÍDO
3. ✅ 4.3 - Padronizar Diário (1h) - CONCLUÍDO
4. ✅ 5.2 - Agrupar Traumas (30 min) - CONCLUÍDO
5. ✅ 5.3 - Toggles gráfico (45 min) - CONCLUÍDO
6. ✅ 4.1 - Botão Mostrar Contexto (2h) - CONCLUÍDO
7. ⏳ 4.2 - Inserir Imagens (1.5h) ← **BAIXA PRIORIDADE**

**Item 4.2 é OPCIONAL nesta sprint.** Se sobrar tempo, implementa. Se não, fica para próxima versão.

---

## ✅ IMPLEMENTAÇÃO APROVADA

Cursor pode prosseguir com implementação quando tiver tempo disponível.

