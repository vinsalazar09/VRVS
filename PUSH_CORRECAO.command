#!/bin/bash
cd "$(dirname "$0")"

echo "================================================"
echo "🚀 PUSH DA CORREÇÃO ANTI-TRUNCAMENTO"
echo "================================================"
echo ""
echo "Enviando correção para o GitHub..."
echo ""

git push --force-with-lease origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ PUSH CONCLUÍDO COM SUCESSO!"
    echo ""
    echo "Agora:"
    echo "1. Abra o app no iPhone"
    echo "2. Force refresh (puxar para baixo)"
    echo "3. Teste se o texto NÃO trunca mais"
    echo ""
else
    echo ""
    echo "❌ ERRO NO PUSH"
    echo ""
    echo "Solução: use o GitHub Desktop manualmente"
    echo "Vá em: Repository > Push (e force se necessário)"
    echo ""
fi

echo "Pressione ENTER para fechar..."
read
