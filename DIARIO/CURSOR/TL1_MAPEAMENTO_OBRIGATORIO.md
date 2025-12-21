# 📍 TL-1 - MAPEAMENTO OBRIGATÓRIO

**Data:** 20 de Dezembro de 2024  
**Objetivo:** Mapear pontos que serão tocados antes de implementar TL-1

---

## 1) MODO SESSÃO ATUAL

### Onde fica a UI de seleção de modo:

**HTML:** Linha 3392-3402
```html
<div class="diario-sessao-modos" style="display: flex; gap: 8px; margin-bottom: 16px;">
    <button id="sessaoDiarioProgramado"
            class="diario-sessao-modo-btn active"
            onclick="setModoSessaoDiario('programado')">
        📅 Revisão programada
    </button>
    <button id="sessaoDiarioLivre"
            class="diario-sessao-modo-btn"
            onclick="setModoSessaoDiario('livre')">
        🧪 Treino livre
    </button>
</div>
```

**JS - Função de mudança de modo:** Linha 11349-11366
```javascript
function setModoSessaoDiario(modo) {
    modoSessaoDiario = modo; // 'programado' ou 'livre'
    const btnProgramado = document.getElementById('sessaoDiarioProgramado');
    const btnLivre = document.getElementById('sessaoDiarioLivre');
    
    if (btnProgramado && btnLivre) {
        if (modo === 'programado') {
            btnProgramado.classList.add('active');
            btnLivre.classList.remove('active');
        } else {
            btnLivre.classList.add('active');
            btnProgramado.classList.remove('active');
        }
    }
    
    // Reiniciar sessão quando modo muda
    iniciarSessaoDiario(modo);
}
```

**Variável global:** Linha 9575
```javascript
let modoSessaoDiario = 'programado';
```

**Como funciona:**
- Dois botões toggle entre 'programado' e 'livre'
- Ao clicar, chama `setModoSessaoDiario(modo)`
- Isso chama `iniciarSessaoDiario(modo)` que monta a fila
- `renderSessaoDiario(entradaAtual)` renderiza o card ou empty state

---

## 2) ESTRUTURA DE DADOS DAS ENTRADAS DO DIÁRIO

### Estrutura completa (linha 10820-10840):

```javascript
{
    id: Number,                    // Timestamp (Date.now())
    data: String,                  // "YYYY-MM-DD"
    area: String,                  // Ex: "Coluna"
    tema: String,                  // Ex: "Anatomia da Coluna"
    topico: String,                // Pergunta/tópico
    resposta: String,              // Resposta (pode ser vazio)
    criadoEm: String,             // "YYYY-MM-DD"
    ultimaAtualizacao: String,     // "YYYY-MM-DD"
    srs: {                         // Objeto SRS (pode ser null)
        ativo: Boolean,            // true/false
        estagio: Number,          // 0-10
        intervalo: Number,         // Dias até próxima revisão
        proximaRevisao: String,    // "YYYY-MM-DD"
        ultimaRevisaoData: String, // "YYYY-MM-DD"
        repeticoes: Number,        // Contador de repetições
        facilidade: Number,        // 2.3 (padrão)
        engine: String,            // "VRVS_FSRS3_v1"
        historicoRespostas: Array, // Histórico de respostas
        ultimaResposta: String     // "esqueci" | "lembrei" | "facil" | null
    } | null
}
```

**Armazenamento:** `window.diario.entradas[]` (array de objetos acima)

**Verificação de VRVS 3P ativo:** `entrada.srs && entrada.srs.ativo === true`

---

## 3) LISTA POR ÁREA/TEMA

### Função existente: `getEntradasTreinoLivreDiario()` - Linha 10064-10071

```javascript
function getEntradasTreinoLivreDiario(filtros) {
    if (!window.diario || !Array.isArray(window.diario.entradas)) return [];
    return window.diario.entradas.filter(e => {
        const bateArea = !filtros.area || e.area === filtros.area;
        // Usar apenas filtro de área (OPÇÃO B - filtro de tema não existe)
        return bateArea;
    });
}
```

**Observação:** Função atual só filtra por área, não por tema. TL-1 precisará expandir isso.

### Como obter lista de áreas/temas:

**Áreas únicas:** 
```javascript
const areas = [...new Set(window.diario.entradas.map(e => e.area))].sort();
```

**Temas de uma área específica:**
```javascript
const temas = [...new Set(
    window.diario.entradas
        .filter(e => e.area === areaSelecionada)
        .map(e => e.tema)
)].sort();
```

**Exemplo real no código:** Linha 11025 (em `renderDiario()`)

---

## 📊 PONTOS QUE SERÃO TOCADOS NO TL-1

### A) HTML (UI de configuração)

**Localização:** Dentro de `<div id="diarioSessao">` (linha 3404)

**O que será adicionado:**
- Painel de configuração do Treino Livre (quando modo = 'livre')
- Toggle "Somente 🧠" vs "Todas"
- Dropdown Área
- Dropdown Tema (dependente da Área)
- Dropdown Quantidade (5/10/20/30)
- Botão "Montar Treino"
- Tela de confirmação (após montar)

**Função afetada:** `renderSessaoDiario()` (linha 11423) - precisa renderizar configuração quando modo = 'livre' e não há fila montada

---

### B) JavaScript (Lógica)

**Funções que serão criadas:**
1. `montarTreinoLivre()` - Monta fila baseada em configuração
2. `renderConfigTreinoLivre()` - Renderiza painel de configuração
3. `atualizarTemasTreinoLivre(area)` - Atualiza dropdown de temas baseado na área selecionada
4. `renderConfirmacaoTreinoLivre(fila)` - Renderiza tela de confirmação

**Funções que serão modificadas:**
1. `renderSessaoDiario()` (linha 11423) - Adicionar lógica para renderizar configuração quando modo = 'livre'
2. `setModoSessaoDiario()` (linha 11349) - Pode precisar limpar fila quando muda modo

**Variáveis globais que serão criadas:**
- `window.treinoLivreFila = []` - Fila montada (em memória)
- `window.treinoLivreConfig = { fonte: 'srs', area: null, tema: null, quantidade: 10 }` - Configuração atual

**Funções existentes que serão reutilizadas:**
- `getEntradasTreinoLivreDiario(filtros)` (linha 10064) - Expandir para suportar filtro de tema também
- `isSrsActive(entrada)` (linha 10520) - Verificar se entrada tem VRVS 3P ativo

---

### C) CSS (Estilos)

**O que será adicionado:**
- Estilos para painel de configuração (iPhone-friendly)
- Estilos para dropdowns
- Estilos para toggle "Somente 🧠" vs "Todas"
- Estilos para tela de confirmação

**Localização:** Dentro do bloco `<style>` principal (após linha ~570)

---

## ✅ CONCLUSÃO DO MAPEAMENTO

**Pontos principais:**
1. ✅ UI de modo já existe (botões Programada/Livre)
2. ✅ Estrutura de dados das entradas mapeada
3. ✅ Função base `getEntradasTreinoLivreDiario()` existe (precisa expandir)
4. ✅ `renderSessaoDiario()` é onde será injetada a configuração
5. ✅ `setModoSessaoDiario()` já gerencia alternância de modos

**Pronto para análise crítica e planejamento de execução.**

