#!/usr/bin/env python3
"""
Análise do problema com JSON.stringify no onclick
"""

import json
import html

# Simular IDs problemáticos
ids_teste = [
    "1733174400000_5",  # ID com underscore
    "1733174400000",    # ID numérico puro
    "test'quote",       # ID com aspas simples
    "test\"double",     # ID com aspas duplas
    "test\\backslash",  # ID com barra invertida
]

print("=" * 80)
print("ANÁLISE: JSON.stringify no onclick")
print("=" * 80)

for tema_id in ids_teste:
    print(f"\n📋 ID de teste: {tema_id}")
    print(f"   Tipo: {type(tema_id).__name__}")
    
    # Simular JSON.stringify (JavaScript)
    json_stringified = json.dumps(tema_id)
    print(f"   JSON.stringify: {json_stringified}")
    
    # Simular HTML gerado COM JSON.stringify (código atual)
    html_atual = f'<div onclick="togglePendencia({json_stringified})">Teste</div>'
    print(f"   HTML ATUAL gerado:")
    print(f"   {html_atual}")
    
    # Verificar se fecha aspas prematuramente
    if '"' in json_stringified and html_atual.count('"') > 2:
        print(f"   ⚠️  PROBLEMA: Aspas duplas dentro do atributo podem quebrar HTML!")
        # Contar aspas
        aspas_antes_onclick = html_atual[:html_atual.find('onclick=')].count('"')
        aspas_depois_onclick = html_atual[html_atual.find('onclick='):].count('"')
        print(f"   Aspas antes de onclick: {aspas_antes_onclick}")
        print(f"   Aspas depois de onclick: {aspas_depois_onclick}")
        if aspas_depois_onclick > 2:
            print(f"   ❌ HTML INVÁLIDO: Aspas fecham atributo prematuramente!")
    
    # Solução alternativa 1: Escape manual com aspas simples
    tema_id_escaped = tema_id.replace("'", "\\'").replace("\\", "\\\\")
    html_alternativo1 = f"<div onclick=\"togglePendencia('{tema_id_escaped}')\">Teste</div>"
    print(f"\n   ✅ SOLUÇÃO 1 (escape manual + aspas simples):")
    print(f"   {html_alternativo1}")
    
    # Solução alternativa 2: JSON.stringify mas dentro de aspas simples
    html_alternativo2 = f"<div onclick=\"togglePendencia({json_stringified})\">Teste</div>"
    # Mas isso ainda tem o problema das aspas duplas...
    
    # Solução alternativa 3: Usar HTML entities
    tema_id_encoded = html.escape(tema_id)
    html_alternativo3 = f"<div onclick=\"togglePendencia('{tema_id_encoded}')\">Teste</div>"
    print(f"\n   ✅ SOLUÇÃO 2 (HTML escape + aspas simples):")
    print(f"   {html_alternativo3}")

print("\n" + "=" * 80)
print("CONCLUSÃO:")
print("=" * 80)
print("""
O problema com JSON.stringify é que ele retorna uma string COM ASPAS DUPLAS:
- JSON.stringify("1733174400000_5") retorna '"1733174400000_5"'
- Quando interpolado em onclick="...", fica: onclick="togglePendencia("1733174400000_5")"
- Isso fecha as aspas do atributo prematuramente = HTML INVÁLIDO

SOLUÇÃO CORRETA:
- Usar escape manual de aspas simples: temaId.replace(/'/g, "\\'")
- Usar aspas simples no onclick: onclick="togglePendencia('${temaIdEscaped}')"
- Isso gera: onclick="togglePendencia('1733174400000_5')" ✅ VÁLIDO
""")

