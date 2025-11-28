#!/usr/bin/env python3
"""
Script de Inicialização Automática de Contexto
Plataforma de Revisão TEOT (VRVS)

Este script automatiza a leitura dos arquivos de contexto ao iniciar um chat.
Execute antes de começar a trabalhar para garantir que você tem todo o contexto necessário.
"""

import os
from datetime import datetime
from pathlib import Path

# Cores para terminal
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text:^60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_section(text):
    print(f"\n{Colors.OKCYAN}{Colors.BOLD}▶ {text}{Colors.ENDC}")
    print(f"{Colors.OKCYAN}{'-'*60}{Colors.ENDC}")

def print_success(text):
    print(f"{Colors.OKGREEN}✅ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠️  {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}❌ {text}{Colors.ENDC}")

def ler_arquivo(caminho, descricao):
    """Lê um arquivo e retorna seu conteúdo."""
    caminho_obj = Path(caminho)
    if not caminho_obj.exists():
        print_warning(f"{descricao} não encontrado: {caminho}")
        return None
    
    try:
        with open(caminho_obj, 'r', encoding='utf-8') as f:
            conteudo = f.read()
        print_success(f"{descricao} lido: {caminho}")
        return conteudo
    except Exception as e:
        print_error(f"Erro ao ler {descricao}: {e}")
        return None

def encontrar_ultimo_resumo(diretorio):
    """Encontra o resumo de sessão mais recente."""
    diretorio_obj = Path(diretorio)
    if not diretorio_obj.exists():
        return None
    
    resumos = list(diretorio_obj.glob("RESUMO_SESSAO_*.txt"))
    if not resumos:
        return None
    
    # Ordena por data de modificação (mais recente primeiro)
    resumos.sort(key=lambda x: x.stat().st_mtime, reverse=True)
    return resumos[0]

def main():
    # Diretório base do projeto
    base_dir = Path(__file__).parent.parent.parent
    diario_dir = base_dir / "DIARIO"
    cursor_dir = diario_dir / "CURSOR"
    docs_dir = base_dir / "docs"
    
    print_header("INICIALIZAÇÃO DE CONTEXTO - PLATAFORMA DE REVISÃO TEOT")
    
    print(f"{Colors.OKBLUE}Diretório base: {base_dir}{Colors.ENDC}")
    print(f"{Colors.OKBLUE}Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{Colors.ENDC}\n")
    
    # PASSO 1: Ler código de conduta
    print_section("PASSO 1: Código de Conduta")
    codigo_conduta = ler_arquivo(
        cursor_dir / "00_LEIA_PRIMEIRO_SEMPRE.txt",
        "Código de conduta"
    )
    
    # PASSO 2: Ler estado atual
    print_section("PASSO 2: Estado Atual")
    estado_atual = ler_arquivo(
        diario_dir / "01_ESTADO_ATUAL.txt",
        "Estado atual"
    )
    
    # PASSO 3: Ler último resumo
    print_section("PASSO 3: Última Sessão")
    ultimo_resumo = encontrar_ultimo_resumo(cursor_dir)
    if ultimo_resumo:
        resumo_conteudo = ler_arquivo(ultimo_resumo, f"Último resumo ({ultimo_resumo.name})")
    else:
        print_warning("Nenhum resumo de sessão encontrado")
        resumo_conteudo = None
    
    # PASSO 4: Ler caderno de erros
    print_section("PASSO 4: Caderno de Erros e Acertos")
    caderno = ler_arquivo(
        cursor_dir / "CADERNO_ERROS_ACERTOS.txt",
        "Caderno de erros e acertos"
    )
    
    # PASSO 5: Ler documentação técnica
    print_section("PASSO 5: Documentação Técnica")
    doc_completa = ler_arquivo(
        docs_dir / "DOCUMENTACAO_COMPLETA.md",
        "Documentação completa"
    )
    arquitetura = ler_arquivo(
        docs_dir / "ARQUITETURA_DADOS.md",
        "Arquitetura de dados"
    )
    
    # Resumo
    print_header("RESUMO DO CONTEXTO CARREGADO")
    
    arquivos_lidos = []
    if codigo_conduta:
        arquivos_lidos.append("✅ Código de conduta")
    if estado_atual:
        arquivos_lidos.append("✅ Estado atual")
    if resumo_conteudo:
        arquivos_lidos.append(f"✅ Último resumo ({ultimo_resumo.name})")
    if caderno:
        arquivos_lidos.append("✅ Caderno de erros e acertos")
    if doc_completa:
        arquivos_lidos.append("✅ Documentação completa")
    if arquitetura:
        arquivos_lidos.append("✅ Arquitetura de dados")
    
    for item in arquivos_lidos:
        print(f"  {item}")
    
    print(f"\n{Colors.OKGREEN}{Colors.BOLD}✅ Contexto inicializado com sucesso!{Colors.ENDC}")
    print(f"{Colors.OKBLUE}Você está pronto para trabalhar na plataforma.{Colors.ENDC}\n")
    
    # Criar entrada de início
    agora = datetime.now()
    entrada_inicio = f"CHAT INICIADO: {agora.strftime('%Y-%m-%d')} ({agora.strftime('%A')}) {agora.strftime('%H:%M')}"
    print(f"{Colors.OKCYAN}{entrada_inicio}{Colors.ENDC}\n")

if __name__ == "__main__":
    main()

