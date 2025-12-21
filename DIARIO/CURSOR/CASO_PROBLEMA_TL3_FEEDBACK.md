# 🎯 CASO-PROBLEMA: TL-3 FEEDBACK ALGORITMO

**Data:** 21 de Dezembro de 2024  
**Status:** Documento para discussão técnica (Opus + Cursor + Usuário)  
**Objetivo:** Definir algoritmo robusto para calcular feedback 0-100% a partir de TL-3 (Treino Livre com notas)

---

## 1) CONTEXTO DO VRVS

### TL-3: Treino Livre com Notas

**O que é:**
- Extensão do TL-2 (Treino Livre Runner READ-ONLY)
- Usuário revisa cards do Diário em modo "treino livre"
- Para cada card, usuário atribui nota: **0 (esqueci)**, **1 (lembrei)**, **2 (fácil)**
- Usuário pode **pular** cards (sem atribuir nota)
- Ao finalizar treino, sistema calcula um **feedback 0-100%**

**Características críticas:**
- ✅ **Efêmero:** Notas do TL-3 NÃO persistem em `localStorage`
- ✅ **Não altera SRS:** TL-3 não modifica `srs.estagio`, `srs.proximaRevisao`, `srs.repeticoes`
- ✅ **Não salva histórico:** TL-3 não cria entrada em `window.diario.historicoRespostas`
- ✅ **Fonte única:** Usa `window.treinoLivreFila` (montada pelo TL-1)

**Problema central:**
- Usuário quer usar o resultado do TL-3 como **"Feedback oficial 0-100%"** na aba Feedback
- Esse feedback é registrado manualmente na aba Feedback (campo `feedbackRendimento`)
- O feedback registrado **afeta algoritmo/ordem de revisão** (alto impacto no sistema)

---

## 2) O CONFLITO CENTRAL (PROBLEMA INTELECTUAL)

### 2.1 Mistura de Cards Novos vs Revisados

**Problema:**
- `window.treinoLivreFila` pode conter:
  - Cards **novos** (nunca revisados): `srs.repeticoes === 0` e `!srs.ultimaResposta`
  - Cards **revisados** (já tiveram pelo menos 1 revisão): `srs.repeticoes > 0` ou `!!srs.ultimaResposta`

**Por que é problema:**
- Cards novos têm retenção esperada **baixa** (40-50% no estágio 0)
- Cards revisados têm retenção esperada **alta** (70-95% dependendo do estágio)
- **Média simples** mistura ambos e distorce resultado:
  - Exemplo: 10 novos (40%) + 10 revisados (90%) = média 65%
  - Mas usuário pode ter feito muito bem nos revisados (95%) e mal nos novos (30%)
  - Média simples não reflete desempenho real

**Impacto:**
- Feedback oficial pode ser **subestimado** (se muitos novos) ou **superestimado** (se poucos novos)
- Algoritmo de revisão recebe sinal errado
- Usuário perde confiança no sistema

---

### 2.2 Pulos/Sem Nota

**Problema:**
- Usuário pode **pular** cards (sem atribuir nota)
- Pulos podem ser:
  - Cards difíceis que usuário quer evitar (gaming)
  - Cards que usuário já sabe muito bem (não precisa avaliar)
  - Cards que usuário não tem tempo de revisar

**Por que é problema:**
- Se pulos não são contabilizados, usuário pode:
  - Pular todos os difíceis → inflar feedback artificialmente
  - Pular todos os fáceis → deflacionar feedback artificialmente
- Se pulos são tratados como 0 (erro), penaliza usuário injustamente
- Se pulos são ignorados completamente, reduz amostra (n pequeno)

**Impacto:**
- Risco de **manipulação** (gaming do sistema)
- Feedback pode não refletir desempenho real
- Sistema perde confiabilidade

---

### 2.3 Amostra Pequena (n pequeno)

**Problema:**
- TL-3 pode ter **n pequeno** (ex: 3, 5, 10 cards)
- Com n pequeno:
  - Média simples oscila muito (instabilidade)
  - Um único erro ou acerto muda resultado drasticamente
  - Feedback não é confiável

**Exemplo numérico:**
- n=3: notas [2, 2, 0] → média 66.7%
- n=3: notas [2, 2, 1] → média 83.3%
- Diferença de 16.6% por causa de 1 card!

**Por que é problema:**
- Feedback oficial precisa ser **estável** e **confiável**
- Oscilação grande descredibiliza sistema
- Usuário não confia em número que muda muito

**Impacto:**
- Feedback oscila muito com n pequeno
- Sistema perde credibilidade
- Usuário não usa feedback oficial

---

### 2.4 Risco de Manipulação (Gaming)

**Problema:**
- Usuário pode **manipular** feedback pulando cards difíceis
- Exemplo:
  - 20 cards: 10 fáceis (nota 2), 10 difíceis (nota 0)
  - Média real: 50%
  - Se pular 10 difíceis: média 100% (manipulação)

**Por que é problema:**
- Feedback oficial deve refletir **desempenho real**
- Manipulação distorce algoritmo de revisão
- Sistema perde integridade

**Impacto:**
- Feedback inflado artificialmente
- Algoritmo de revisão recebe sinal errado
- Sistema perde confiabilidade

---

### 2.5 Risco de Punir Criação de Cards Novos

**Problema:**
- Se feedback oficial considera cards novos, usuário pode ser **punido** por criar conteúdo novo
- Exemplo:
  - Usuário cria 20 cards novos
  - Faz TL-3 com esses 20 cards novos
  - Retenção esperada de novos: 40-50%
  - Feedback oficial: 45%
  - Usuário é "punido" por criar conteúdo novo

**Por que é problema:**
- Sistema deve **incentivar** criação de conteúdo novo
- Punir criação desincentiva uso do sistema
- Feedback deve refletir **aprendizado**, não volume

**Impacto:**
- Usuário evita criar cards novos
- Sistema perde utilidade
- Feedback não reflete aprendizado real

---

### 2.6 Por Que Cálculo Ingênuo (Média Simples) Quebra

**Cálculo ingênuo:**
```javascript
const notas = [2, 2, 1, 0, 2, 1, 2, 0, 1, 2];
const media = notas.reduce((a, b) => a + b, 0) / notas.length;
const feedback = (media / 2) * 100; // 0-2 → 0-100%
```

**Problemas:**
1. **Não separa novos vs revisados:** Mistura retenção esperada diferente
2. **Não trata pulos:** Ignora ou penaliza injustamente
3. **Não estabiliza n pequeno:** Oscila muito com poucos cards
4. **Não previne gaming:** Permite manipulação por pulos
5. **Pune criação:** Cards novos derrubam feedback

**Resultado:** Feedback não é confiável, não reflete desempenho real, não é útil para algoritmo de revisão.

---

## 3) REQUISITOS (CRITÉRIOS DE QUALIDADE)

### 3.1 "Justo": Não Punir Criação de Cards Novos

**Critério:**
- Cards novos **não devem derrubar** feedback oficial
- Feedback deve refletir **aprendizado**, não volume de conteúdo novo
- Sistema deve **incentivar** criação de conteúdo novo

**Validação:**
- Adicionar 20 cards novos → feedback não deve cair
- Feedback deve ser baseado em **cards revisados** (já tiveram pelo menos 1 revisão)

---

### 3.2 "Estável": Não Oscilar com n Pequeno

**Critério:**
- Feedback deve ser **estável** mesmo com n pequeno (3-5 cards)
- Oscilação máxima aceitável: ±5% com n=3
- Sistema deve usar **shrinkage/Bayes** para estabilizar

**Validação:**
- n=3: feedback não deve oscilar mais que ±5% entre execuções similares
- n=10: feedback deve ser mais estável que n=3

---

### 3.3 "Antifraude": Pulo Não Pode Inflar Demais

**Critério:**
- Pulos devem ter **penalidade leve** ou **cobertura mínima**
- Feedback não deve ser inflado artificialmente por pulos
- Sistema deve detectar e prevenir manipulação

**Validação:**
- 20 cards: 10 fáceis (nota 2), 10 difíceis (pulados) → feedback não deve ser 100%
- Cobertura mínima: pelo menos 70% dos cards devem ter nota

---

### 3.4 "Compreensível": Usuário Entende e Confia

**Critério:**
- Feedback deve ser **compreensível** para usuário
- Usuário deve entender **como** feedback foi calculado
- Sistema deve mostrar **breakdown** (retenção revisados, cobertura, etc.)

**Validação:**
- Usuário consegue explicar feedback para outra pessoa
- Sistema mostra métricas auxiliares (retenção revisados, cobertura, etc.)

---

### 3.5 "Compatível": Funciona com Legado de Dados

**Critério:**
- Critério de "card revisado" deve ser **robusto a legado**
- Deve funcionar com dados antigos (sem `repeticoes` ou `ultimaResposta`)
- Sistema deve ser **retrocompatível**

**Validação:**
- Dados legados (sem `repeticoes`) → sistema funciona
- Dados novos (com `repeticoes`) → sistema funciona
- Critério robusto: `(repeticoes || 0) > 0 || !!ultimaResposta`

---

## 4) PROPOSTA A (BASEADA NA IDEIA DO CHAT)

### 4.1 Separação: Retenção (Revisados) vs Aprendizado (Novos)

**Conceito:**
- **Retenção (revisados):** Feedback baseado em cards já revisados (já tiveram pelo menos 1 revisão)
- **Aprendizado (novos):** Feedback baseado em cards novos (nunca revisados)
- **Feedback oficial:** Baseado **principalmente** em retenção (revisados), com ajuste leve por aprendizado (novos)

**Critério de "card revisado":**
```javascript
const isRevisado = (entrada) => {
    const srs = entrada.srs;
    return (srs.repeticoes || 0) > 0 || !!srs.ultimaResposta;
};
```

**Critério de "card novo":**
```javascript
const isNovo = (entrada) => {
    const srs = entrada.srs;
    return (srs.repeticoes || 0) === 0 && !srs.ultimaResposta;
};
```

---

### 4.2 Mapeamento de Notas: 0/1/2 → 0/0.5/1

**Mapeamento:**
- Nota **0 (esqueci)** → Score **0.0** (0% de retenção)
- Nota **1 (lembrei)** → Score **0.5** (50% de retenção)
- Nota **2 (fácil)** → Score **1.0** (100% de retenção)

**Justificativa:**
- Nota 1 (lembrei) indica retenção **parcial** (lembrou, mas precisou pensar)
- Nota 2 (fácil) indica retenção **total** (lembrou imediatamente)
- Nota 0 (esqueci) indica retenção **zero** (não lembrou)

---

### 4.3 Shrinkage/Bayes Simples para Estabilidade

**Conceito:**
- Usar **prior mean** e **prior n** para estabilizar com n pequeno
- Fórmula: `feedback = (n * media + priorN * priorMean) / (n + priorN)`

**Parâmetros sugeridos:**
- **PriorMean:** 0.70 (70% de retenção esperada)
- **PriorN:** 5 (equivalente a 5 observações)

**Justificativa:**
- PriorMean 70% reflete retenção esperada de cards revisados (estágio médio)
- PriorN 5 estabiliza com n pequeno (3-5 cards) sem dominar com n grande (20+ cards)

**Exemplo:**
- n=3, média=0.67 (66.7%): `feedback = (3 * 0.67 + 5 * 0.70) / (3 + 5) = 0.689 = 68.9%`
- Sem shrinkage: 66.7%
- Com shrinkage: 68.9% (mais estável)

---

### 4.4 Cobertura + Penalidade Leve para Pulos

**Conceito:**
- **Cobertura:** Percentual de cards com nota (não pulados)
- **Penalidade leve:** Reduzir feedback proporcionalmente à falta de cobertura

**Fórmula:**
```javascript
const cobertura = cardsComNota / totalCards;
const penalidade = Math.max(0, 1 - (1 - cobertura) * 0.3); // Máx 30% de penalidade
const feedbackAjustado = feedback * penalidade;
```

**Justificativa:**
- Cobertura 100% → sem penalidade
- Cobertura 70% → penalidade 9% (30% de falta * 30% de penalidade)
- Cobertura 50% → penalidade 15% (50% de falta * 30% de penalidade)

**Exemplo:**
- Feedback: 80%
- Cobertura: 70% (7 de 10 cards com nota)
- Penalidade: 9%
- Feedback ajustado: 80% * 0.91 = 72.8%

---

### 4.5 Resultado Final: Sugestão de Feedback Oficial 0-100%

**Algoritmo completo (Proposta A):**

```javascript
function calcularFeedbackTL3(fila, notas) {
    // 1. Separar cards revisados vs novos
    const revisados = fila.filter((e, i) => {
        const entrada = e;
        const srs = entrada.srs;
        return (srs.repeticoes || 0) > 0 || !!srs.ultimaResposta;
    });
    const novos = fila.filter((e, i) => {
        const entrada = e;
        const srs = entrada.srs;
        return (srs.repeticoes || 0) === 0 && !srs.ultimaResposta;
    });
    
    // 2. Mapear notas para scores (0/1/2 → 0/0.5/1)
    const scoresRevisados = revisados.map((e, i) => {
        const nota = notas[i];
        if (nota === 0) return 0.0;
        if (nota === 1) return 0.5;
        if (nota === 2) return 1.0;
        return null; // pulado
    }).filter(s => s !== null);
    
    // 3. Calcular média de retenção (revisados)
    const nRevisados = scoresRevisados.length;
    if (nRevisados === 0) {
        // Se não há revisados, usar apenas novos (com ajuste)
        const scoresNovos = novos.map((e, i) => {
            const nota = notas[revisados.length + i];
            if (nota === 0) return 0.0;
            if (nota === 1) return 0.5;
            if (nota === 2) return 1.0;
            return null;
        }).filter(s => s !== null);
        
        if (scoresNovos.length === 0) return null; // Sem dados
        
        const mediaNovos = scoresNovos.reduce((a, b) => a + b, 0) / scoresNovos.length;
        // Ajuste: novos têm retenção esperada menor, então ajustar para cima
        const mediaAjustada = Math.min(1.0, mediaNovos * 1.2); // +20% de ajuste
        
        // Shrinkage
        const priorMean = 0.70;
        const priorN = 5;
        const feedback = (scoresNovos.length * mediaAjustada + priorN * priorMean) / (scoresNovos.length + priorN);
        
        // Cobertura
        const cobertura = scoresNovos.length / fila.length;
        const penalidade = Math.max(0, 1 - (1 - cobertura) * 0.3);
        
        return Math.round(feedback * penalidade * 100);
    }
    
    const mediaRevisados = scoresRevisados.reduce((a, b) => a + b, 0) / nRevisados;
    
    // 4. Shrinkage para estabilidade
    const priorMean = 0.70;
    const priorN = 5;
    const feedback = (nRevisados * mediaRevisados + priorN * priorMean) / (nRevisados + priorN);
    
    // 5. Cobertura + penalidade leve
    const cobertura = scoresRevisados.length / revisados.length;
    const penalidade = Math.max(0, 1 - (1 - cobertura) * 0.3);
    
    // 6. Resultado final (0-100%)
    return Math.round(feedback * penalidade * 100);
}
```

**Breakdown mostrado ao usuário:**
- Retenção revisados: X%
- Cobertura: Y%
- Feedback sugerido: Z%

---

## 5) PROPOSTA B (ALTERNATIVA PLausível)

### 5.1 Tratamento Mais Rígido de Pulos

**Conceito:**
- Pulos são tratados como **0 (erro)** se card é revisado
- Pulos são **ignorados** se card é novo
- **Bloqueio:** Não permite finalizar TL-3 sem nota em pelo menos 70% dos cards revisados

**Justificativa:**
- Mais rígido previne gaming
- Força usuário a avaliar cards revisados
- Cards novos podem ser pulados (não afetam feedback)

**Algoritmo:**

```javascript
function calcularFeedbackTL3_B(fila, notas) {
    // 1. Separar revisados vs novos
    const revisados = fila.filter(e => isRevisado(e));
    const novos = fila.filter(e => isNovo(e));
    
    // 2. Verificar cobertura mínima (70% dos revisados)
    const notasRevisados = revisados.map((e, i) => notas[i]);
    const coberturaRevisados = notasRevisados.filter(n => n !== null).length / revisados.length;
    
    if (coberturaRevisados < 0.70) {
        return null; // Bloquear finalização
    }
    
    // 3. Tratar pulos em revisados como 0
    const scoresRevisados = notasRevisados.map(n => {
        if (n === null) return 0.0; // Pulo = erro
        if (n === 0) return 0.0;
        if (n === 1) return 0.5;
        if (n === 2) return 1.0;
        return 0.0;
    });
    
    // 4. Calcular média (sem shrinkage, mais direto)
    const media = scoresRevisados.reduce((a, b) => a + b, 0) / scoresRevisados.length;
    
    // 5. Ajuste por cobertura (penalidade mais forte)
    const penalidade = coberturaRevisados; // Penalidade linear
    
    // 6. Resultado final
    return Math.round(media * penalidade * 100);
}
```

**Prós:**
- ✅ Mais simples (sem shrinkage)
- ✅ Mais rígido (previne gaming)
- ✅ Força avaliação de revisados

**Contras:**
- ❌ Pulos em revisados penalizam muito (tratados como 0)
- ❌ Bloqueio pode frustrar usuário
- ❌ Não estabiliza n pequeno (sem shrinkage)

---

### 5.2 Mediana Ponderada por Estágio

**Conceito:**
- Usar **mediana** em vez de média (mais robusta a outliers)
- **Ponderar** por estágio do card (cards em estágios mais altos têm mais peso)
- Ignorar pulos completamente (não contabilizar)

**Justificativa:**
- Mediana é mais robusta que média
- Ponderar por estágio reflete importância do card
- Ignorar pulos evita penalização injusta

**Algoritmo:**

```javascript
function calcularFeedbackTL3_C(fila, notas) {
    // 1. Separar revisados
    const revisados = fila.filter(e => isRevisado(e));
    
    // 2. Mapear notas para scores (ignorar pulos)
    const scoresComPeso = revisados.map((e, i) => {
        const nota = notas[i];
        if (nota === null) return null; // Ignorar pulo
        
        const srs = e.srs;
        const estagio = srs.estagio || 0;
        const peso = Math.pow(1.1, estagio); // Peso exponencial por estágio
        
        let score = 0;
        if (nota === 0) score = 0.0;
        if (nota === 1) score = 0.5;
        if (nota === 2) score = 1.0;
        
        return { score, peso };
    }).filter(s => s !== null);
    
    // 3. Calcular mediana ponderada
    // (implementação mais complexa, requer ordenação e cálculo de mediana ponderada)
    
    // 4. Resultado final
    return Math.round(medianaPonderada * 100);
}
```

**Prós:**
- ✅ Mediana é mais robusta
- ✅ Ponderar por estágio reflete importância
- ✅ Ignorar pulos evita penalização

**Contras:**
- ❌ Implementação mais complexa
- ❌ Não previne gaming (pulos ignorados)
- ❌ Não estabiliza n pequeno

---

## 6) EXEMPLOS NUMÉRICOS (MÍNIMO 5)

### Exemplo 1: Muitos Novos + Poucos Revisados (Não Deve Derrubar Feedback)

**Cenário:**
- Fila: 20 cards (15 novos, 5 revisados)
- Notas novos: [2, 2, 1, 2, 0, 1, 2, 2, 1, 2, 0, 1, 2, 2, 1] → média 1.47 (73.5%)
- Notas revisados: [2, 2, 2, 1, 2] → média 1.8 (90%)
- Cobertura: 100% (todos com nota)

**Proposta A:**
- Feedback baseado em revisados: 90%
- Shrinkage: `(5 * 0.90 + 5 * 0.70) / 10 = 0.80 = 80%`
- Cobertura: 100% → sem penalidade
- **Feedback final: 80%**

**Proposta B:**
- Feedback baseado em revisados: 90%
- Cobertura: 100% → sem penalidade
- **Feedback final: 90%**

**Validação:** ✅ Novos não derrubam feedback (baseado em revisados)

---

### Exemplo 2: Muitos Pulos (Mostrar Impacto)

**Cenário:**
- Fila: 10 cards revisados
- Notas: [2, 2, null, null, 1, null, 2, null, 1, null]
- Cards com nota: 5 de 10 (50% de cobertura)
- Média dos com nota: 1.6 (80%)

**Proposta A:**
- Feedback: 80%
- Shrinkage: `(5 * 0.80 + 5 * 0.70) / 10 = 0.75 = 75%`
- Cobertura: 50% → penalidade: `1 - (1 - 0.50) * 0.30 = 0.85` (15% de penalidade)
- **Feedback final: 75% * 0.85 = 63.75% ≈ 64%**

**Proposta B:**
- Pulos tratados como 0: [2, 2, 0, 0, 1, 0, 2, 0, 1, 0]
- Média: 0.8 (40%)
- Cobertura: 50% → penalidade: 0.50
- **Feedback final: 40% * 0.50 = 20%**

**Validação:** ✅ Pulos têm impacto, mas Proposta A é mais justa

---

### Exemplo 3: n Pequeno (3 cards) (Mostrar Shrinkage)

**Cenário:**
- Fila: 3 cards revisados
- Notas: [2, 2, 0]
- Média: 1.33 (66.7%)

**Proposta A:**
- Sem shrinkage: 66.7%
- Com shrinkage: `(3 * 0.667 + 5 * 0.70) / 8 = 0.689 = 68.9%`
- **Feedback final: 68.9%** (mais estável)

**Proposta B:**
- Sem shrinkage: 66.7%
- **Feedback final: 66.7%** (oscila mais)

**Validação:** ✅ Shrinkage estabiliza n pequeno

---

### Exemplo 4: Alto Desempenho com Alta Cobertura

**Cenário:**
- Fila: 20 cards revisados
- Notas: [2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2]
- Média: 1.85 (92.5%)
- Cobertura: 100%

**Proposta A:**
- Feedback: 92.5%
- Shrinkage: `(20 * 0.925 + 5 * 0.70) / 25 = 0.88 = 88%`
- Cobertura: 100% → sem penalidade
- **Feedback final: 88%**

**Proposta B:**
- Feedback: 92.5%
- Cobertura: 100% → sem penalidade
- **Feedback final: 92.5%**

**Validação:** ✅ Alto desempenho reflete no feedback

---

### Exemplo 5: Baixo Desempenho Real em Revisados (Deve Refletir)

**Cenário:**
- Fila: 10 cards revisados
- Notas: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1]
- Média: 0.4 (20%)
- Cobertura: 100%

**Proposta A:**
- Feedback: 20%
- Shrinkage: `(10 * 0.20 + 5 * 0.70) / 15 = 0.367 = 36.7%`
- Cobertura: 100% → sem penalidade
- **Feedback final: 36.7%** (shrinkage puxa para cima, mas ainda reflete baixo desempenho)

**Proposta B:**
- Feedback: 20%
- Cobertura: 100% → sem penalidade
- **Feedback final: 20%** (reflete baixo desempenho diretamente)

**Validação:** ✅ Baixo desempenho reflete no feedback (Proposta B mais direta)

---

## 7) DECISÕES FINAIS QUE PRECISAM SER VALIDADAS "NÓS TRÊS"

### 7.1 Critério de "Card Revisado"

**Sugestão (robusto a legado):**
```javascript
const isRevisado = (entrada) => {
    const srs = entrada.srs;
    return (srs.repeticoes || 0) > 0 || !!srs.ultimaResposta;
};
```

**Validação necessária:**
- [ ] Confirmar que `srs.repeticoes` existe em dados legados
- [ ] Confirmar que `srs.ultimaResposta` existe em dados legados
- [ ] Testar com dados legados (sem `repeticoes`)
- [ ] Testar com dados novos (com `repeticoes`)

**Decisão:** ✅ Usar critério robusto acima

---

### 7.2 Penalidade de Pulo (Se Existe e Quão Forte)

**Opções:**
- **Opção A:** Penalidade leve (30% máximo) por falta de cobertura
- **Opção B:** Pulos tratados como 0 (mais rígido)
- **Opção C:** Pulos ignorados (sem penalidade)

**Sugestão:** Opção A (penalidade leve 30%)

**Validação necessária:**
- [ ] Definir percentual de penalidade (30%? 50%?)
- [ ] Definir cobertura mínima aceitável (70%? 80%?)
- [ ] Testar impacto de pulos no feedback

**Decisão:** ⚠️ Aguardar validação

---

### 7.3 PriorMean/PriorN (Ou Mecanismo Equivalente)

**Sugestão:**
- **PriorMean:** 0.70 (70% de retenção esperada)
- **PriorN:** 5 (equivalente a 5 observações)

**Validação necessária:**
- [ ] Confirmar que PriorMean 70% reflete retenção esperada
- [ ] Confirmar que PriorN 5 estabiliza n pequeno sem dominar n grande
- [ ] Testar com n=3, n=5, n=10, n=20

**Decisão:** ⚠️ Aguardar validação

---

### 7.4 Como o Usuário "Usa" Isso na Aba Feedback

**Opções:**
- **Opção A:** Campo sugerido (pré-preenchido, usuário pode editar)
- **Opção B:** Botão "Usar feedback do TL-3" (copia valor)
- **Opção C:** Texto explicativo (usuário digita manualmente)

**Sugestão:** Opção A (campo sugerido pré-preenchido)

**Validação necessária:**
- [ ] Confirmar que campo `feedbackRendimento` aceita valor sugerido
- [ ] Confirmar que usuário pode editar valor sugerido
- [ ] Testar UX de campo sugerido

**Decisão:** ⚠️ Aguardar validação

---

## 8) CRITÉRIOS DE ACEITE (QUANDO SABEMOS QUE ESTÁ BOM)

### 8.1 Não Punir Criação de Cards Novos

- [ ] Adicionar 20 cards novos → feedback não cai
- [ ] Feedback baseado em cards revisados (não novos)
- [ ] Cards novos não afetam feedback oficial

---

### 8.2 Não Inflar por Pulo

- [ ] 20 cards: 10 fáceis (nota 2), 10 difíceis (pulados) → feedback não é 100%
- [ ] Cobertura mínima: pelo menos 70% dos cards revisados com nota
- [ ] Penalidade por falta de cobertura aplicada corretamente

---

### 8.3 Não Oscilar com n Pequeno

- [ ] n=3: feedback não oscila mais que ±5% entre execuções similares
- [ ] Shrinkage aplicado corretamente
- [ ] Feedback estável mesmo com n pequeno

---

### 8.4 Refletir Desempenho Real

- [ ] Alto desempenho (90%+) → feedback alto (85%+)
- [ ] Baixo desempenho (20%-) → feedback baixo (30%-)
- [ ] Feedback reflete desempenho real em cards revisados

---

### 8.5 Compatível com Legado

- [ ] Dados legados (sem `repeticoes`) → sistema funciona
- [ ] Dados novos (com `repeticoes`) → sistema funciona
- [ ] Critério robusto funciona com ambos

---

### 8.6 Compreensível para Usuário

- [ ] Usuário entende como feedback foi calculado
- [ ] Sistema mostra breakdown (retenção revisados, cobertura, etc.)
- [ ] Usuário confia no número

---

## 9) OBSERVAÇÕES FINAIS

### 9.1 Não Inventar Comportamento do App

**Quando precisar confirmar:**
- Nome exato do campo `repeticoes` ou `srs.repeticoes`
- Nome exato do campo `ultimaResposta` ou `srs.ultimaResposta`
- Estrutura exata de `window.treinoLivreFila`
- Como notas são armazenadas durante TL-3 (em memória? array?)

**Ação:** Indicar "confirmar no código" quando necessário

---

### 9.2 Pronto para Enviar ao Opus

**Formato:**
- ✅ Texto técnico-didático
- ✅ Exemplos numéricos (5+)
- ✅ Edge cases documentados
- ✅ Riscos identificados (gaming, instabilidade, punição)
- ✅ Decisões pendentes claras

**Próximo passo:** Enviar para Opus para discussão técnica

---

**Documento criado para discussão técnica (Opus + Cursor + Usuário)**

