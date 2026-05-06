# 📋 RECAP TÉCNICO — Saúde do Diário VRVS 3P

**Data:** 21 de Dezembro de 2024  
**Objetivo:** Documentação técnica para correção UX

---

## 1. FUNÇÃO DE CÁLCULO

**Nome:** `calcularEstatisticasVrvs3p(diario, hojeStrParam)`  
**Linha:** ~9999

**USA:**
- `e.srs.ativo === true`
- `e.srs.engine === 'VRVS_FSRS3_v1'`
- `e.srs.estagio` (0-10)
- `e.srs.proximaRevisao`
- `e.srs.intervalo`

**LÓGICA:**
```javascript
// 1. Filtra entradas ativas com SRS VRVS 3P
const entradasAtivas = diario.entradas.filter(e => 
    e.srs && 
    e.srs.ativo === true &&
    e.srs.engine === 'VRVS_FSRS3_v1'
);

// 2. Para cada entrada ativa:
entradasAtivas.forEach(entrada => {
    const estagio = srs.estagio || 0;
    const retencaoEstagio = obterRetencaoPorEstagio(estagio);
    somaRetencao += retencaoEstagio;
    contagemRetencao++;
});

// 3. Calcula média global
stats.retencaoGlobal = somaRetencao / contagemRetencao;
stats.retencaoGlobalPct = Math.round(stats.retencaoGlobal * 100);
```

**RESPOSTA DIRETA:**
- Considera **TODOS os cards ativos** (`srs.ativo === true`)
- **NÃO verifica** se tem revisões (`sessoes`, `repeticoes`, `ultimaResposta`)
- Cards recém-criados (estágio 0) **ENTRAM no cálculo** com retenção 40%

---

## 2. FUNÇÃO DE RENDERIZAÇÃO

**Nome:** Renderização inline no `renderStats()` ou `renderAnalise()`  
**Linha:** ~7073-7165 (dentro da função que renderiza Stats/Analise)

**CÓDIGO:**
```javascript
const faixa = classificarFaixaRetencao(stats.retencaoGlobal);
// faixa: 'baixa' | 'media' | 'alta'

// Renderiza barra:
<div style="width: ${stats.retencaoGlobalPct}%; background: ${faixa === 'alta' ? 'linear-gradient(90deg, #22c55e, #16a34a)' : faixa === 'media' ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #dc3545, #b91c1c)'};"></div>
```

**CORES:**
- **Vermelho (`baixa`):** `< 65%` (0.65)
- **Âmbar (`media`):** `65% - 79%` (0.65 a 0.79)
- **Verde (`alta`):** `>= 80%` (>= 0.80)

**FUNÇÃO CLASSIFICADORA:**
- `classificarFaixaRetencao(pct)` — linha ~9770
- Recebe porcentagem em 0-1 (não 0-100)

---

## 3. ESTRUTURA DE DADOS

**ENTRADA DO DIÁRIO COM SRS ATIVO:**

```javascript
{
    id: "uuid-123",
    topico: "Classificação de Neer para fratura de úmero proximal",
    resposta: "4 partes: cabeça, trocânter maior, trocânter menor, diáfise...",
    area: "Trauma MMSS",
    tema: "Fratura de Úmero Proximal",
    data: "2024-12-20",
    criadoEm: "2024-12-20",
    srs: {
        ativo: true,
        engine: "VRVS_FSRS3_v1",
        estagio: 2,                    // 0-10 (usado no cálculo)
        intervalo: 4,                  // dias (1, 2, 4, 7, 12, 20, 35, 60, 90, 135, 200)
        proximaRevisao: "2024-12-25", // usado para contar "hoje" e "atrasados"
        ultimaRevisaoData: "2024-12-20",
        repeticoes: 3,                // NÃO usado no cálculo de saúde
        facilidade: 2.5,              // NÃO usado no cálculo de saúde
        historicoRespostas: [],       // NÃO usado no cálculo de saúde
        ultimaResposta: "lembrei"     // NÃO usado no cálculo de saúde
    }
}
```

**CAMPOS RELEVANTES PARA CÁLCULO:**
- ✅ `srs.ativo` — filtra entradas ativas
- ✅ `srs.engine` — filtra apenas VRVS 3P
- ✅ `srs.estagio` — usado para obter retenção estimada
- ✅ `srs.proximaRevisao` — usado para contar "hoje" e "atrasados"
- ✅ `srs.intervalo` — usado para detectar atrasados

**CAMPOS NÃO USADOS:**
- ❌ `srs.repeticoes` — não usado
- ❌ `srs.ultimaResposta` — não usado
- ❌ `srs.facilidade` — não usado
- ❌ `srs.historicoRespostas` — não usado
- ❌ `srs.sessoes` — campo não existe (é `repeticoes`)

---

## 4. LÓGICA ATUAL

### Cálculo de Retenção Global

**FÓRMULA:**
```
retencaoGlobal = média de todas as retenções por estágio
retencaoGlobalPct = Math.round(retencaoGlobal * 100)
```

**RETENÇÃO POR ESTÁGIO (VRVS3P_RETENCAO_POR_ESTAGIO):**
```javascript
Estágio 0:  40% (novo)
Estágio 1:  55%
Estágio 2:  65%
Estágio 3:  72%
Estágio 4:  78%
Estágio 5:  83%
Estágio 6:  88%
Estágio 7:  92%
Estágio 8:  95%
Estágio 9:  97%
Estágio 10: 98% (máximo)
```

**O QUE ENTRA NO CÁLCULO:**
- ✅ **TODOS os cards ativos** (`srs.ativo === true`)
- ✅ Cards recém-criados (estágio 0) com retenção 40%
- ✅ Cards sem revisões ainda (estágio 0)
- ✅ Cards com qualquer estágio (0-10)

**O QUE NÃO ENTRA:**
- ❌ Cards com `srs.ativo === false`
- ❌ Cards sem `srs.engine === 'VRVS_FSRS3_v1'`
- ❌ Cards sem objeto `srs`

---

## 5. PROBLEMA IDENTIFICADO

**CARDS COM ESTÁGIO 0 (RECÉM-CRIADOS) ESTÃO ENTRANDO NO CÁLCULO**

**Impacto:**
- Cards novos (estágio 0) têm retenção 40%
- Se há muitos cards novos, média global cai
- Usuário pode ver saúde "baixa" mesmo tendo cards bem revisados

**Exemplo:**
- 10 cards estágio 8 (95% cada) = média 95% → Verde ✅
- Adiciona 10 cards novos (estágio 0, 40% cada)
- Nova média: (10×95% + 10×40%) / 20 = 67.5% → Amarelo ⚠️

**Possível correção (a definir):**
- Excluir cards estágio 0 do cálculo?
- Ou usar retenção mínima diferente?
- Ou considerar apenas cards com pelo menos 1 revisão?

---

## 6. FUNÇÕES AUXILIARES

**`obterRetencaoPorEstagio(estagio)`** — linha ~9764
- Retorna retenção estimada (0-1) baseado no estágio
- Usa array `VRVS3P_RETENCAO_POR_ESTAGIO`

**`classificarFaixaRetencao(pct)`** — linha ~9770
- Recebe porcentagem em 0-1
- Retorna: `'baixa'` (< 0.65), `'media'` (0.65-0.79), `'alta'` (>= 0.80)

---

**Documento criado para Opus preparar UX PATCH SPEC de correção.**

