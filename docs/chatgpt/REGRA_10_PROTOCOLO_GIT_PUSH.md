# 📋 REGRA 10: PROTOCOLO GIT PUSH

**Data de Criação:** 13 de Dezembro de 2025  
**Status:** ATIVO

---

## 🎯 PROPÓSITO

Garantir que o usuário sempre saiba quando precisa fazer `git push` após alterações feitas pelo Cursor.

---

## ⚠️ REGRA CRÍTICA

**SEMPRE informar explicitamente ao usuário se é necessário fazer `git push` após commits.**

---

## 📝 PROTOCOLO

### Quando o Cursor faz commits:

1. **Ao finalizar uma correção/implementação:**
   - Fazer commit com mensagem descritiva
   - **INFORMAR ao usuário:** "✅ Alterações commitadas. **Você precisa fazer `git push` para sincronizar com o repositório remoto.**"

2. **Quando copiar arquivo para Desktop:**
   - Informar: "✅ Arquivo copiado para Desktop. **Para sincronizar com o repositório remoto, faça `git push`.**"

3. **Quando múltiplos commits são feitos:**
   - Informar: "✅ X commits realizados. **Faça `git push` para enviar todas as alterações ao repositório remoto.**"

### Quando NÃO é necessário push:

- Apenas leitura de arquivos
- Apenas análise/investigação
- Quando o usuário já fez push recentemente e não houve novos commits

---

## 💬 TEMPLATE DE MENSAGEM

### Após commit:
```
✅ Correção aplicada e commitada.

📤 PRÓXIMO PASSO: Faça `git push` para sincronizar com o repositório remoto.
```

### Após múltiplos commits:
```
✅ X alterações commitadas.

📤 PRÓXIMO PASSO: Faça `git push` para enviar todas as alterações ao repositório remoto.
```

### Quando copiar para Desktop:
```
✅ Arquivo copiado para Desktop.

📤 PRÓXIMO PASSO: Faça `git push` para sincronizar com o repositório remoto.
```

---

## 🔍 VERIFICAÇÃO

Após o usuário informar que fez push, o Cursor deve:

1. Verificar status do git:
   ```bash
   git status
   git log --oneline -3
   ```

2. Confirmar se o push foi bem-sucedido:
   - Se `git status` mostrar "Your branch is up to date", confirmar ✅
   - Se mostrar commits não enviados, informar que ainda precisa fazer push

---

## ⚠️ IMPORTÂNCIA

- O usuário usa a plataforma principalmente no iPhone
- Arquivo Desktop é usado para testes locais
- Push é necessário para sincronizar alterações
- Usuário não deve precisar adivinhar quando fazer push

---

## 📋 CHECKLIST

Após fazer commits, o Cursor deve:

- [ ] Fazer commit com mensagem descritiva
- [ ] **INFORMAR explicitamente que é necessário fazer push**
- [ ] Usar template de mensagem claro
- [ ] Se usuário informar que fez push, verificar e confirmar

---

**Regra criada em 13/12/2025 após feedback do usuário**

