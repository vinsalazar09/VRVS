# PROTOCOLO RÁPIDO DE ENCERRAMENTO — CURSOR

**⚠️ EXECUÇÃO AUTOMÁTICA:** Quando usuário disser "protocolo de encerramento de chat" ou similar

---

## EXECUÇÃO AUTOMÁTICA (SEM PERGUNTAR)

### PASSO 1: Criar resumo de sessão (com proteção contra sobrescrita)
```python
# Verificar se já existe resumo do dia
data_hoje = datetime.now().strftime("%Y%m%d")
resumo_existente = glob_file_search(f"RESUMO_SESSAO_{data_hoje}*.txt")

# Se existir, usar formato com hora
if resumo_existente:
    nome_arquivo = f"RESUMO_SESSAO_{data_hoje}_{datetime.now().strftime('%H%M')}.txt"
else:
    nome_arquivo = f"RESUMO_SESSAO_{data_hoje}.txt"

# Criar resumo estruturado
write(f"DIARIO/CURSOR/{nome_arquivo}", conteudo_resumo_completo)
```

**Conteúdo do resumo:**
- Data, horário, duração
- Objetivo da sessão
- O que foi feito (lista completa)
- Arquivos modificados/criados
- Problemas resolvidos
- Problemas identificados (não resolvidos)
- Próximos passos
- Aprendizados

### PASSO 2: Atualizar estado atual (adicionar ao final)
```python
# Ler estado atual
estado_atual = read_file("DIARIO/01_ESTADO_ATUAL.txt")

# Adicionar atualização ao final (não sobrescrever)
novo_conteudo = estado_atual + "\n\n" + atualizacao_sessao
write("DIARIO/01_ESTADO_ATUAL.txt", novo_conteudo)
```

### PASSO 3: Atualizar caderno de erros/acertos (adicionar ao final)
```python
# Ler caderno atual
caderno = read_file("DIARIO/CURSOR/CADERNO_ERROS_ACERTOS.txt")

# Adicionar novos erros/acertos ao final (não sobrescrever)
novo_caderno = caderno + "\n\n" + novos_registros
write("DIARIO/CURSOR/CADERNO_ERROS_ACERTOS.txt", novo_caderno)
```

### PASSO 4: Criar documentos de sucesso (se houver sucessos)
```python
# Para cada sucesso confirmado nesta sessão
for sucesso in sucessos_sessao:
    write(f"SUCESSO_{sucesso.nome}_{data_hoje}.md", sucesso.conteudo)
```

### PASSO 5: Organizar e limpar (automático)
```python
# Limpar temporários de handoff
temporarios = glob_file_search("*HANDOFF*TEMPORARIO*.md")
for temp in temporarios:
    # Mover para pasta ou deletar conforme protocolo
    move_or_delete(temp, "DIARIO/CURSOR/_TEMPORARIOS_HANDOFF/")

# Verificar estrutura
verificar_estrutura_pastas()
```

### PASSO 6: Criar handoff para próximo Cursor (se necessário)
```python
# Se houver problema pendente ou contexto importante
if problema_pendente or contexto_importante:
    write(f"HANDOFF_CURSOR_{proximo_contexto}_{data_hoje}.md", conteudo_handoff)
```

### PASSO 7: Confirmar encerramento (resposta automática)
```
✅ Protocolo de encerramento executado

📝 Resumo criado: RESUMO_SESSAO_[DATA].txt
📊 Estado atual atualizado
📖 Caderno de erros/acertos atualizado
📁 Estrutura organizada

✅ Pronto para próximo chat
```

**TEMPO ESTIMADO:** ~1-2 minutos  
**TOKENS:** ~1000-2000 (apenas escrita, não leitura)

---

## REGRAS CRÍTICAS

1. **SEMPRE adicionar ao final** (nunca sobrescrever)
2. **SEMPRE proteger contra sobrescrita** (verificar antes de criar)
3. **SEMPRE organizar automaticamente** (limpar temporários)
4. **SEMPRE criar handoff** se houver contexto importante para próximo Cursor

---

**FIM DO PROTOCOLO RÁPIDO DE ENCERRAMENTO**

