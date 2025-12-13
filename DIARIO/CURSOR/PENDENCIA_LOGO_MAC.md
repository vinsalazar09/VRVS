# PENDÊNCIA: Logo não aparece no MacBook

## Data: 2025-12-12

## Problema
A logo (`logo.png`) não está carregando no MacBook quando o arquivo é aberto localmente (`file:///Users/viniciussalazar/Desktop/index.html`), mas funciona normalmente no iPhone.

## Tentativas Realizadas

### 1. Fallback para logo.jpeg
- **Implementado:** Adicionado `onerror` na tag `<img>` para tentar carregar `logo.jpeg` como fallback
- **Resultado:** Não resolveu o problema

### 2. Ajuste de caminhos relativos
- **Tentativa:** Mudar caminhos de `./logo.png` para `docs/logo.png`
- **Resultado:** Causou travamento da aplicação, revertido

### 3. Múltiplos caminhos no JavaScript
- **Tentativa:** Criar array com múltiplos caminhos possíveis (`./logo.png`, `docs/logo.png`, `./docs/logo.png`)
- **Resultado:** Causou travamento, revertido

### 4. Verificação de carregamento via JavaScript
- **Implementado:** Função `garantirLogoCarregada()` que testa múltiplos caminhos
- **Resultado:** Não resolveu completamente

## Análise Técnica

### Possíveis Causas
1. **Restrições de segurança do Safari no macOS:** Safari pode bloquear recursos locais por políticas de segurança
2. **Caminho relativo incorreto:** Quando aberto do Desktop, o caminho `./logo.png` pode não estar correto
3. **Cache do navegador:** Cache antigo pode estar interferindo
4. **Permissões de arquivo:** macOS pode estar bloqueando acesso ao arquivo

### Arquivos Envolvidos
- `docs/index.html` (linha ~1524): Tag `<img>` do splash screen
- `docs/index.html` (linha ~6338): Função `garantirLogoCarregada()`
- `docs/logo.png`: Arquivo da logo (existe no diretório)
- `docs/logo.jpeg`: Arquivo fallback (existe no diretório)

### Código Atual
```html
<img src="./logo.png?v=3" alt="VRVS Logo" class="splash-logo" onerror="this.onerror=null; this.src='./logo.jpeg?v=3';">
```

## Soluções Futuras Sugeridas

1. **Usar base64 inline:** Converter logo para base64 e embutir no HTML
2. **Servidor local:** Usar um servidor HTTP local (ex: `python -m http.server`) em vez de `file://`
3. **Verificar permissões:** Garantir que o arquivo `logo.png` tem permissões de leitura
4. **Testar com caminho absoluto:** Tentar usar caminho absoluto temporariamente para diagnóstico
5. **Verificar console do Safari:** Analisar erros específicos no console do desenvolvedor

## Status
**PENDENTE** - Deixar para resolução futura após estabilizar outras funcionalidades críticas.

## Notas
- No iPhone funciona normalmente (via GitHub Pages ou PWA instalado)
- O problema parece ser específico do Safari no macOS com `file://` no macOS
- Não é crítico para funcionalidade da aplicação, apenas visual

