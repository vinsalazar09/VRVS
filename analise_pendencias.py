#!/usr/bin/env python3
"""
Script de análise sistemática para comparar itens que funcionam vs não funcionam
na aba Pendências.
"""

import json
import re
from collections import defaultdict

# Itens que NÃO funcionam (conforme usuário)
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

def analisar_html():
    """Analisa o HTML para entender como os itens são renderizados"""
    print("=" * 80)
    print("ANÁLISE DO CÓDIGO HTML")
    print("=" * 80)
    
    with open('docs/index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Encontrar função renderPendencias
    match = re.search(r'function renderPendencias\(\)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}', html, re.DOTALL)
    if match:
        print("✅ Função renderPendencias encontrada")
        codigo = match.group(1)
        
        # Verificar como IDs são processados
        if 'JSON.stringify' in codigo:
            print("✅ Usa JSON.stringify para escape")
        if 'temaIdEscaped' in codigo:
            print("✅ Usa temaIdEscaped")
        
        # Verificar onclick
        onclick_matches = re.findall(r'onclick="([^"]+)"', codigo)
        print(f"\n📋 Onclick encontrados: {len(onclick_matches)}")
        for i, onclick in enumerate(onclick_matches[:3], 1):
            print(f"   {i}. {onclick[:100]}...")
    
    # Comparar com renderTarefas
    match_tarefas = re.search(r'function renderTarefas\(\)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}', html, re.DOTALL)
    if match_tarefas:
        codigo_tarefas = match_tarefas.group(1)
        print("\n📊 COMPARAÇÃO COM renderTarefas:")
        if 'onclick' not in codigo_tarefas:
            print("   ⚠️ renderTarefas NÃO usa onclick (não precisa de toggle)")
        else:
            onclick_tarefas = re.findall(r'onclick="([^"]+)"', codigo_tarefas)
            print(f"   Onclick em Tarefas: {onclick_tarefas[:3]}")

def analisar_dados_localstorage():
    """Tenta analisar dados do localStorage se disponível"""
    print("\n" + "=" * 80)
    print("ANÁLISE DE DADOS (se disponível)")
    print("=" * 80)
    
    # Tentar ler dados exportados ou do console
    print("⚠️ Para análise completa, exporte os dados do localStorage:")
    print("   localStorage.getItem('vrvs_dados')")
    print("\nOu execute no console do navegador:")
    print("   JSON.stringify(JSON.parse(localStorage.getItem('vrvs_dados')).filter(t => ['Fratura de clavícula', 'Epifisiolistese', 'Sd manguito rotador', 'DDQ', 'Luxação e Instabilidade do cotovelo', 'LAC/LEC', 'Epicondilites', 'Fraturas do cotovelo'].includes(t.tema)))")

def verificar_diferencas_ids():
    """Verifica padrões de IDs"""
    print("\n" + "=" * 80)
    print("ANÁLISE DE PADRÕES DE ID")
    print("=" * 80)
    
    print("\n🔍 Padrões esperados:")
    print("   - IDs numéricos puros: 1733174400000")
    print("   - IDs sintéticos: 1733174400000_5 (timestamp_linha)")
    
    print("\n📝 Verificações necessárias:")
    print("   1. Itens problema têm IDs com underscore?")
    print("   2. Itens que funcionam têm IDs numéricos puros?")
    print("   3. Há diferença no formato de geração?")
    
    # Verificar código de geração de ID
    with open('docs/index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    match = re.search(r'id:\s*getVal\([^)]+\)\s*\|\|\s*`([^`]+)`', html)
    if match:
        print(f"\n✅ Padrão de geração encontrado: {match.group(1)}")
        print("   Isso gera IDs como: Date.now()_lineNum")

def comparar_funcoes_auxiliares():
    """Compara funções auxiliares usadas"""
    print("\n" + "=" * 80)
    print("ANÁLISE DE FUNÇÕES AUXILIARES")
    print("=" * 80)
    
    with open('docs/index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    funcoes_usadas = [
        'obterSugestaoTema',
        'calcularTipoRevisao',
        'formatarDataBR',
        'dataValida'
    ]
    
    print("\n📋 Funções chamadas em renderPendencias:")
    for func in funcoes_usadas:
        if func in html:
            print(f"   ✅ {func} - definida")
        else:
            print(f"   ❌ {func} - NÃO encontrada")

def checklist_diagnostico():
    """Checklist de diagnóstico"""
    print("\n" + "=" * 80)
    print("CHECKLIST DE DIAGNÓSTICO")
    print("=" * 80)
    
    checklist = [
        ("IDs têm formato diferente?", "Verificar se itens problema têm underscore"),
        ("Função togglePendencia recebe ID correto?", "Adicionar console.log na função"),
        ("Set() está comparando corretamente?", "Verificar tipo de dado no Set"),
        ("HTML gerado está correto?", "Inspecionar elemento no navegador"),
        ("Há elementos sobrepondo?", "Verificar z-index e pointer-events"),
        ("iOS Safari está bloqueando onclick?", "Testar com addEventListener como fallback"),
        ("Cache do Service Worker?", "Verificar versão do SW"),
    ]
    
    for i, (pergunta, acao) in enumerate(checklist, 1):
        print(f"\n{i}. {pergunta}")
        print(f"   → {acao}")

def main():
    print("\n" + "=" * 80)
    print("ANÁLISE SISTEMÁTICA - ABA PENDÊNCIAS")
    print("=" * 80)
    
    analisar_html()
    verificar_diferencas_ids()
    comparar_funcoes_auxiliares()
    checklist_diagnostico()
    analisar_dados_localstorage()
    
    print("\n" + "=" * 80)
    print("PRÓXIMOS PASSOS")
    print("=" * 80)
    print("""
1. Exportar dados do localStorage (console do navegador):
   JSON.stringify(JSON.parse(localStorage.getItem('vrvs_dados')))

2. Comparar IDs dos itens problema vs itens que funcionam

3. Inspecionar HTML gerado no navegador:
   - Abrir DevTools
   - Ir para aba Pendências
   - Inspecionar elemento de um item problema
   - Verificar atributo onclick gerado

4. Testar togglePendencia diretamente no console:
   togglePendencia('ID_DO_ITEM_PROBLEMA')
   """)

if __name__ == '__main__':
    main()

