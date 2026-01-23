# 🧠 METODOLOGIA VRVS — EXPLICAÇÃO COMPLETA

**Data:** 23/01/2026  
**Versão:** 1.0  
**Tom:** Explicação simples e direta, como se fosse o Vini falando para um amigo

---

## O QUE É O VRVS?

O VRVS é um sistema de gestão de estudos que eu criei para me ajudar a estudar para o TEOT 2026 (prova de título em ortopedia). A ideia central é simples: **quando você estuda algo, precisa revisar depois, senão esquece**.

---

## POR QUE FUNCIONA?

A ciência já mostrou que a melhor forma de lembrar algo é revisar em intervalos crescentes. Se você revisa algo hoje, amanhã, depois de 3 dias, depois de 7 dias... você lembra muito melhor do que se revisar tudo de uma vez.

O problema é: **como saber quando revisar cada coisa?** É aí que entra o VRVS.

---

## COMO FUNCIONA NA PRÁTICA?

### 1. Cadastrar Temas

Você cadastra os temas que precisa estudar (ex: "LCA", "Espondilolistese", etc.) na aba **Dados**.

### 2. Estudar e Registrar

Você estuda e registra no sistema quando estudou e quanto aprendeu (0-100%) na aba **Feedback**.

### 3. Sistema Calcula Automaticamente

O sistema calcula automaticamente quando você deve revisar cada tema baseado em:
- Quantas vezes você já estudou
- Quanto você aprendeu em cada sessão
- A prioridade do tema

### 4. Revisar Quando Avisado

Você revisa quando o sistema avisa que é hora (aparece na aba **Tarefas**).

### 5. Sistema Aprende

O sistema aprende com suas respostas:
- Se você lembrou bem → aumenta o intervalo até a próxima revisão
- Se esqueceu → diminui o intervalo

---

## O SISTEMA VRVS 3P (REVISÃO ESPAÇADA)

O coração do VRVS é o sistema de revisão espaçada chamado "VRVS 3P". Ele funciona assim:

### Como Funciona

1. **Criar Anotação no Diário**
   - Você anota algo que aprendeu no formato pergunta/resposta
   - Marca o checkbox "VRVS 3P" se quiser que vire card de revisão

2. **Card Aparece para Revisão**
   - No dia seguinte, esse card aparece para você revisar
   - Você vê a pergunta primeiro (sem ver a resposta)

3. **Você Responde**
   - Tenta lembrar a resposta mentalmente
   - Depois vê a resposta e escolhe:
     - **❌ ESQUECI** — Não lembrei
     - **👍 LEMBREI** — Lembrei bem
     - **😌 FÁCIL** — Muito fácil, lembrei na hora

4. **Sistema Agenda Próxima Revisão**
   - **ESQUECI** → Volta mais cedo (diminui o estágio)
   - **LEMBREI** → Aumenta um pouco o intervalo (sobe 1 estágio)
   - **FÁCIL** → Aumenta bastante o intervalo (sobe 2 estágios)

### Os 11 Estágios

O VRVS 3P usa 11 estágios (0 a 10), cada um com um intervalo específico:

| Estágio | Intervalo | Retenção | Classificação |
|---------|-----------|----------|--------------|
| 0 | 1 dia | 40% | 🆕 Novo |
| 1 | 2 dias | 48% | 🆕 Novo |
| 2 | 4 dias | 56% | 🔧 Fixando |
| 3 | 7 dias | 64% | 🔧 Fixando |
| 4 | 12 dias | 72% | 📚 Maduro |
| 5 | 20 dias | 80% | 📚 Maduro |
| 6 | 35 dias | 86% | 📚 Maduro |
| 7 | 60 dias | 90% | ✅ Consolidado |
| 8 | 90 dias | 93% | ✅ Consolidado |
| 9 | 135 dias | 96% | ✅ Consolidado |
| 10 | 200 dias | 98% | ✅ Consolidado |

### Regras de Transição

- **ESQUECI:**
  - Se estágio ≤ 1 → Volta para estágio 0
  - Se estágio ≥ 2 → Desce 2 estágios (ex: 6 → 4)

- **LEMBREI:**
  - Sobe 1 estágio (até máximo de 10)

- **FÁCIL:**
  - Sobe 2 estágios (até máximo de 10)

---

## POR QUE ISSO FUNCIONA?

Porque você está fazendo **recall ativo** — tentando lembrar sem olhar a resposta primeiro. Isso força seu cérebro a trabalhar mais e cria conexões mais fortes na memória.

A ciência mostra que:
- **Revisão passiva** (só ler de novo) → Retenção baixa (~30%)
- **Recall ativo** (tentar lembrar primeiro) → Retenção alta (~70-90%)

O VRVS força você a fazer recall ativo toda vez que revisa um card.

---

## O VALOR REAL

O VRVS não é só um app de flashcards. É um sistema completo que:

### Organiza
- Todos os seus temas em um só lugar
- Por área (13 áreas da ortopedia)
- Por prioridade (1-5)

### Calcula
- Automaticamente quando revisar cada tema
- Você não precisa pensar nisso
- Baseado em ciência (spaced repetition)

### Registra
- Seus aprendizados do dia
- Em formato pergunta/resposta (recall ativo)
- Com opção de virar card de revisão

### Mostra
- Seu progresso com gráficos
- Estatísticas por área e tema
- Painel de saúde do VRVS 3P

### Garante
- Que você não esquece o que estudou
- Que revisa no momento certo
- Que não perde tempo revisando coisas que já sabe bem

---

## A DIFERENÇA PARA OUTROS SISTEMAS

Muitos sistemas de revisão espaçada são:
- **Muito complexos** → Difíceis de usar
- **Genéricos** → Não focados em provas médicas
- **Caros** → Assinaturas mensais
- **Limitados** → Não permitem customização

O VRVS foi feito especificamente para quem está estudando para provas médicas, com:
- **Áreas pré-definidas** → As 13 áreas da ortopedia
- **Hot Topics** → Pontos que sempre caem em prova
- **Foco em recall ativo** → Pergunta/resposta, não só leitura
- **Interface simples** → Não precisa aprender a usar
- **Gratuito** → PWA, funciona offline
- **Customizável** → Você controla tudo

---

## RESUMO EM UMA FRASE

**"O VRVS é como ter um assistente que nunca esquece quando você precisa revisar cada coisa que estudou."**

---

## COMO USAR NO DIA A DIA

### De Manhã (10-15 min)
1. Abrir a aba **Tarefas**
2. Ver quantos cards VRVS 3P precisam ser revisados hoje
3. Tocar em "Revisar Todos" e responder os cards
4. Escolher 1-2 temas para estudar hoje

### Durante o Estudo
1. Ver os **Hot Topics** do tema (expandindo o card na aba Tarefas)
2. Estudar o conteúdo
3. Quando aprender algo importante, anotar no **Diário**
4. Marcar **VRVS 3P** se quiser revisar depois

### Depois de Estudar
1. Ir na aba **Feedback**
2. Selecionar o tema que estudou
3. Informar o rendimento (0-100)
4. Tocar em "Registrar Sessão"

**Pronto!** O sistema calcula automaticamente quando revisar.

---

## DICAS DE OURO

1. **Ser honesto nas respostas**
   - Se não lembrou, marcar "ESQUECI"
   - Isso ajuda o sistema a calcular melhor

2. **Revisar todos os dias**
   - Mesmo que seja só 10 minutos
   - Consistência é mais importante que quantidade

3. **Usar VRVS 3P para coisas importantes**
   - Não precisa marcar tudo
   - Só o que realmente precisa revisar

4. **Preencher os Hot Topics**
   - Ajuda muito na hora de estudar
   - Mostra o que é mais importante

5. **Fazer backup regularmente**
   - Exportar o JSON semanalmente
   - Guardar em lugar seguro

---

## CONCLUSÃO

O VRVS não é mágica. É ciência aplicada de forma simples e prática. Se você usar consistentemente, vai lembrar muito mais do que estudou do que se não usasse.

A chave é: **confiar no sistema e usar todos os dias**. Os resultados aparecem com o tempo.

---

**Última atualização:** 23/01/2026  
**Versão da plataforma:** v5.3

