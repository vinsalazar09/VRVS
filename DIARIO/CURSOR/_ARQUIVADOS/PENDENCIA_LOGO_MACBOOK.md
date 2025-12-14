# PENDÊNCIA: Logo não aparece no MacBook

**Data:** 12 de Dezembro de 2025  
**Status:** Pendente  
**Prioridade:** Baixa (funciona no iPhone)

## Problema
A logo (`logo.png`) não está carregando no MacBook quando o arquivo é aberto localmente (`file:///Users/viniciussalazar/Desktop/index.html`), mas funciona normalmente no iPhone.

## Tentativas Realizadas

### Tentativa 1: Fallback para logo.jpeg
- **Ação:** Adicionado `onerror` na tag `<img>` para tentar carregar `logo.jpeg` como fallback
- **Código:** `<img src="./logo.png?v=3" alt="VRVS Logo" class="splash-logo" onerror="this.onerror=null; this.src='./logo.jpeg?v=3';">`
- **Resultado:** Não resolveu

### Tentativa 2: Múltiplos caminhos relativos
- **Ação:** Tentativa de usar múltiplos caminhos (`./logo.png`, `docs/logo.png`, `./docs/logo.png`)
- **Resultado:** Causou travamento da aplicação, foi revertido

### Tentativa 3: Verificação de logo carregada
- **Ação:** Função `garantirLogoCarregada()` que testa carregamento da imagem
- **Localização:** Linha ~6335
- **Resultado:** Não resolveu o problema no MacBook

## Análise Técnica

### Possíveis Causas
1. **Caminho relativo:** Quando aberto do Desktop, o caminho `./logo.png` pode não estar correto
2. **Permissões do Safari:** Safari pode bloquear carregamento de recursos locais por segurança
3. **Cache do navegador:** Cache antigo pode estar interferindo
4. **Formato da imagem:** Problema de formato ou corrupção do arquivo `logo.png`

### Arquivos Envolvidos
- `docs/index.html` (linha ~1524 - splash screen)
- `docs/index.html` (linha ~14-20 - favicons e apple-touch-icon)
- `docs/index.html` (linha ~6335 - função garantirLogoCarregada)
- `docs/logo.png` (arquivo da logo)
- `docs/logo.jpeg` (fallback)

### Contexto
- **Desktop:** `file:///Users/viniciussalazar/Desktop/index.html`
- **GitHub Pages:** `https://vinsalazar09.github.io/VRVS/`
- **iPhone:** Funciona normalmente (PWA instalado)

## Próximos Passos Sugeridos

1. **Verificar caminho absoluto:** Testar com caminho absoluto no MacBook
2. **Verificar formato:** Confirmar que `logo.png` está em formato válido e não corrompido
3. **Testar em servidor local:** Rodar em servidor HTTP local (não `file://`)
4. **Verificar console:** Verificar erros no console do Safari no MacBook
5. **Base64 inline:** Considerar usar logo em base64 inline como último recurso

## Notas
- O problema não afeta a funcionalidade da aplicação
- A logo aparece corretamente no iPhone
- O splash screen mostra texto "VRVS" mesmo sem a logo, então não é crítico

