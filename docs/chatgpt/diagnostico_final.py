#!/usr/bin/env python3
"""
Diagnóstico final - Comparar itens que funcionam vs não funcionam
"""

import json
import re

ITENS_PROBLEMA = [
    'Fratura de clavícula',
    'Epifisiolistese', 
    'Sd manguito rotador',
    'DDQ',
    'Luxação e Instabilidade do cotovelo',
    'LAC/LEC',
    'Epicondilites',
    'Fraturas do cotovelo'
]

def analisar_html_gerado():
    """Analisa o HTML gerado para ver se há diferenças"""
    print("=" * 80)
    print("ANÁLISE DO HTML GERADO")
    print("=" * 80)
    
    with open('docs/index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Encontrar função renderPendencias
    match = re.search(r'function renderPendencias\(\)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}', html, re.DOTALL)
    if not match:
        print("❌ Função renderPendencias não encontrada")
        return
    
    codigo = match.group(1)
    
    # Verificar como IDs são processados
    print("\n📋 Processamento de IDs:")
    if 'temaIdStr = String(temaId)' in codigo:
        print("   ✅ Converte para string")
    if 'temaIdEscaped' in codigo:
        print("   ✅ Usa temaIdEscaped")
        # Ver como escapa
        escape_match = re.search(r'temaIdEscaped\s*=\s*([^;]+)', codigo)
        if escape_match:
            print(f"   Método de escape: {escape_match.group(1)[:50]}...")
    
    # Verificar onclick gerado
    print("\n📋 Onclick gerado:")
    onclick_match = re.search(r'onclick="([^"]+)"', codigo)
    if onclick_match:
        onclick_pattern = onclick_match.group(1)
        print(f"   Padrão: {onclick_pattern[:100]}...")
        
        # Simular com ID problemático
        tema_id_exemplo = "1762224383901"
        tema_id_underscore = "1762224383901_5"
        
        # Simular escape
        temaIdEscaped1 = tema_id_exemplo.replace("'", "\\'")
        temaIdEscaped2 = tema_id_underscore.replace("'", "\\'")
        
        onclick1 = f"togglePendencia('{temaIdEscaped1}')"
        onclick2 = f"togglePendencia('{temaIdEscaped2}')"
        
        print(f"\n   Exemplo ID normal: onclick=\"{onclick1}\"")
        print(f"   Exemplo ID underscore: onclick=\"{onclick2}\"")
        
        # Verificar se há problema de sintaxe
        if '_' in onclick2 and "'" in onclick2:
            print("   ⚠️ ID com underscore pode ter problema se não for tratado corretamente")
    
    # Verificar event delegation
    print("\n📋 Event Delegation:")
    if 'pendenciasDelegationHandler' in codigo:
        print("   ✅ Event delegation implementado")
        if 'touchend' in codigo:
            print("   ✅ Listener touchend adicionado")
        if 'closest' in codigo:
            print("   ✅ Usa closest() para encontrar item")
    else:
        print("   ❌ Event delegation NÃO encontrado")

def checklist_diagnostico():
    """Checklist de diagnóstico"""
    print("\n" + "=" * 80)
    print("CHECKLIST DE DIAGNÓSTICO")
    print("=" * 80)
    
    print("""
1. ✅ Onclick inline implementado com aspas simples
2. ✅ Event delegation como fallback implementado
3. ✅ IDs convertidos para string
4. ✅ Escape de aspas implementado
5. ⚠️ VERIFICAR: Há diferença nos dados dos itens problema?
6. ⚠️ VERIFICAR: Há caracteres especiais nos nomes dos temas?
7. ⚠️ VERIFICAR: Há elementos CSS bloqueando?
8. ⚠️ VERIFICAR: Há problema com Set() e comparação de IDs?
    """)

def instrucoes_console():
    """Instruções para diagnóstico no console"""
    print("\n" + "=" * 80)
    print("COMANDOS PARA EXECUTAR NO CONSOLE DO NAVEGADOR")
    print("=" * 80)
    
    print("""
// 1. Verificar IDs dos itens problema vs funcionam
const dados = JSON.parse(localStorage.getItem('vrvs_dados'));
const problema = dados.filter(t => ['Fratura de clavícula', 'Epifisiolistese', 'Sd manguito rotador', 'DDQ', 'Luxação e Instabilidade do cotovelo', 'LAC/LEC', 'Epicondilites', 'Fraturas do cotovelo'].includes(t.tema));
const funcionam = dados.filter(t => t.agenda && !problema.map(p => p.tema).includes(t.tema)).slice(0, 8);

console.log('=== ITENS PROBLEMA ===');
problema.forEach(t => console.log(t.tema, 'ID:', t.id, 'Tipo:', typeof t.id, 'Tem underscore?', String(t.id).includes('_')));
console.log('\\n=== ITENS QUE FUNCIONAM ===');
funcionam.forEach(t => console.log(t.tema, 'ID:', t.id, 'Tipo:', typeof t.id, 'Tem underscore?', String(t.id).includes('_')));

// 2. Inspecionar HTML gerado
const items = document.querySelectorAll('.task-theme-item');
items.forEach((el, i) => {
    const tema = el.querySelector('.task-theme-name')?.textContent;
    const onclick = el.getAttribute('onclick');
    const dataId = el.getAttribute('data-tema-id');
    if (problema.some(p => p.tema === tema)) {
        console.log(`PROBLEMA ${i}:`, tema);
        console.log('  onclick:', onclick);
        console.log('  data-tema-id:', dataId);
        console.log('  onclick válido?', onclick && onclick.includes('togglePendencia'));
    }
});

// 3. Testar togglePendencia diretamente
// Pegue um ID de um item problema e teste:
togglePendencia('ID_DO_ITEM_PROBLEMA');
    """)

def main():
    print("\n" + "=" * 80)
    print("DIAGNÓSTICO FINAL - ABA PENDÊNCIAS")
    print("=" * 80)
    
    analisar_html_gerado()
    checklist_diagnostico()
    instrucoes_console()
    
    print("\n" + "=" * 80)
    print("RECOMENDAÇÃO")
    print("=" * 80)
    print("""
Antes de consultar externamente:

1. Execute os comandos do console acima
2. Compare os resultados dos itens problema vs funcionam
3. Verifique se há padrão diferente nos IDs
4. Verifique se o HTML gerado está correto
5. Teste togglePendencia diretamente no console

Se após isso ainda não funcionar, aí sim consultar externamente com:
- Resultados do console
- Comparação dos dados
- HTML gerado dos itens problema
    """)

if __name__ == '__main__':
    main()

