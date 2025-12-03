# 📋 INSTRUÇÕES PARA EXECUTAR DIAGNÓSTICO SISTEMÁTICO

## 🎯 OBJETIVO

Coletar dados completos sobre os itens da aba Pendências para identificar diferenças entre itens que funcionam e itens que não funcionam.

---

## 📱 NO MACBOOK (Mais fácil)

### Passo 1: Abrir o site
1. Abra o site no Chrome ou Safari do MacBook
2. Vá para a aba "Pendências"

### Passo 2: Abrir Console
1. Pressione `Cmd + Option + I` (Chrome) ou `Cmd + Option + C` (Safari)
2. Vá para a aba "Console"

### Passo 3: Executar Script
1. Abra o arquivo `diagnostico_sistematico_pendencias.js`
2. Copie TODO o conteúdo
3. Cole no console do navegador
4. Pressione Enter

### Passo 4: Copiar Resultados
1. O script vai mostrar resultados no console
2. Para copiar dados completos, digite no console:
   ```javascript
   copy(JSON.stringify(window.diagnosticoPendencias, null, 2))
   ```
3. Cole em um arquivo de texto para análise

---

## 📱 NO IPHONE (Via Safari DevTools)

### Passo 1: Conectar iPhone ao Mac
1. Conecte iPhone ao Mac via cabo USB
2. No iPhone: Ajustes → Safari → Avançado → Web Inspector (ativar)

### Passo 2: Abrir Safari DevTools no Mac
1. No Mac: Abra Safari
2. Safari → Preferências → Avançado → "Mostrar menu Desenvolvedor na barra de menus"
3. Safari → Desenvolvedor → [Seu iPhone] → Console

### Passo 3: Abrir App no iPhone
1. No iPhone, abra o app VRVS
2. Vá para a aba "Pendências"

### Passo 4: Executar Script
1. No console do Safari (Mac), cole o script completo
2. Pressione Enter
3. Copie os resultados

---

## 📊 O QUE O SCRIPT FAZ

1. **Coleta dados** de todos os itens na aba Pendências
2. **Separa** itens problemáticos vs funcionando
3. **Compara características:**
   - Tipos de ID (numérico vs string com underscore)
   - Atributo onclick
   - CSS (touch-action, pointer-events, etc)
   - Estrutura de filhos
4. **Verifica dados** do localStorage
5. **Testa event listeners**
6. **Gera resumo** com diferenças encontradas

---

## 📤 ENVIAR RESULTADOS

Após executar o diagnóstico:

1. **No MacBook:** Copie o objeto `window.diagnosticoPendencias` completo
2. **No iPhone:** Se possível, copie também para comparar
3. **Salve em arquivo:** `docs/RESULTADOS_DIAGNOSTICO_MACBOOK.json` e `docs/RESULTADOS_DIAGNOSTICO_IPHONE.json`

---

## ⚠️ IMPORTANTE

- Execute no MacBook PRIMEIRO (mais fácil)
- Depois execute no iPhone para comparar
- Não faça mudanças no código até analisar os resultados
- Documente tudo que encontrar

