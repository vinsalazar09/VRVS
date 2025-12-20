#!/usr/bin/env python3
"""
Script de validação do Diário VRVS 3P
Valida integridade dos dados antes de fazer mudanças

Uso:
    python scripts/validar_diario_vrvs3p.py backup_diario.json
"""

import json
import sys
from datetime import datetime, timedelta

def validar_diario(arquivo_json='backup_diario.json'):
    """Valida estrutura e integridade do diário"""
    try:
        with open(arquivo_json, 'r', encoding='utf-8') as f:
            diario = json.load(f)
    except FileNotFoundError:
        print(f"❌ Arquivo {arquivo_json} não encontrado")
        return False
    
    if not diario.get('entradas'):
        print("⚠️ Diário vazio")
        return True
    
    entradas = diario['entradas']
    problemas = []
    stats = {
        'total': len(entradas),
        'com_srs': 0,
        'srs_ativo': 0,
        'com_atencao': 0,
        'proxima_revisao_invalida': 0,
        'estagio_invalido': 0
    }
    
    hoje = datetime.now().strftime('%Y-%m-%d')
    
    for i, entrada in enumerate(entradas):
        # Validar SRS
        if entrada.get('srs'):
            stats['com_srs'] += 1
            if entrada['srs'].get('ativo'):
                stats['srs_ativo'] += 1
                
                # Validar proximaRevisao
                proxima = entrada['srs'].get('proximaRevisao')
                if proxima:
                    try:
                        datetime.strptime(proxima, '%Y-%m-%d')
                    except:
                        problemas.append(f"Entrada {i}: proximaRevisao inválida: {proxima}")
                        stats['proxima_revisao_invalida'] += 1
                
                # Validar estágio
                estagio = entrada['srs'].get('estagio', 0)
                if estagio < 0 or estagio > 10:
                    problemas.append(f"Entrada {i}: estágio inválido: {estagio}")
                    stats['estagio_invalido'] += 1
        
        # Contar legado atencao
        if entrada.get('atencao'):
            stats['com_atencao'] += 1
    
    # Relatório
    print("📊 ESTATÍSTICAS DO DIÁRIO")
    print(f"  Total de entradas: {stats['total']}")
    print(f"  Com SRS: {stats['com_srs']}")
    print(f"  SRS ativo: {stats['srs_ativo']}")
    print(f"  Com atenção (legado): {stats['com_atencao']}")
    print(f"  Próxima revisão inválida: {stats['proxima_revisao_invalida']}")
    print(f"  Estágio inválido: {stats['estagio_invalido']}")
    
    if problemas:
        print(f"\n⚠️ {len(problemas)} problemas encontrados:")
        for p in problemas[:10]:  # Mostrar apenas primeiros 10
            print(f"  - {p}")
        return False
    
    print("\n✅ Diário válido!")
    return True

if __name__ == '__main__':
    arquivo = sys.argv[1] if len(sys.argv) > 1 else 'backup_diario.json'
    validar_diario(arquivo)

