# 🔬 DIAGNÓSTICO PARA IPHONE

**Data:** 2025-12-03  
**Problema:** Itens na aba Pendências não respondem ao toque no iPhone

---

## 📋 INSTRUÇÕES PARA DIAGNÓSTICO NO IPHONE

### Passo 1: Conectar iPhone ao Mac e abrir Console

1. Conecte iPhone ao Mac via cabo USB
2. No Mac: Safari → Desenvolvedor → [Seu iPhone] → Console
3. No iPhone: Abra o app VRVS

### Passo 2: Executar Script de Diagnóstico

Cole este código no console do Safari (Mac) enquanto o app está aberto no iPhone:

```javascript
// ═══════════════════════════════════════════════════════════════
// DIAGNÓSTICO COMPLETO - ABA PENDÊNCIAS
// ═══════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════');
console.log('DIAGNÓSTICO ABA PENDÊNCIAS - IPHONE');
console.log('═══════════════════════════════════════════════════════');

// 1. Verificar se função togglePendencia existe
console.log('\n1️⃣ VERIFICANDO FUNÇÃO togglePendencia:');
if (typeof window.togglePendencia === 'function') {
    console.log('✅ Função togglePendencia existe');
} else {
    console.log('❌ Função togglePendencia NÃO existe!');
}

// 2. Verificar elementos renderizados
console.log('\n2️⃣ VERIFICANDO ELEMENTOS RENDERIZADOS:');
const items = document.querySelectorAll('.task-theme-item');
console.log(`Total de itens encontrados: ${items.length}`);

if (items.length === 0) {
    console.log('❌ NENHUM ITEM ENCONTRADO! Aba Pendências pode não estar renderizada.');
} else {
    console.log('✅ Itens encontrados');
    
    // Verificar atributos onclick de cada item
    items.forEach((item, index) => {
        const temaId = item.getAttribute('data-tema-id');
        const onclick = item.getAttribute('onclick');
        const temaNome = item.querySelector('.task-theme-name')?.textContent || 'Sem nome';
        
        console.log(`\n📋 Item ${index + 1}: ${temaNome}`);
        console.log(`   data-tema-id: ${temaId}`);
        console.log(`   onclick: ${onclick}`);
        
        // Verificar se onclick está válido
        if (!onclick) {
            console.log('   ❌ SEM ATRIBUTO onclick!');
        } else if (!onclick.includes('togglePendencia')) {
            console.log('   ❌ onclick não chama togglePendencia!');
        } else {
            // Tentar parsear o onclick
            try {
                // Extrair o ID do onclick
                const match = onclick.match(/togglePendencia\(['"](.*?)['"]\)/);
                if (match) {
                    const idNoOnclick = match[1];
                    console.log(`   ✅ onclick válido, ID: ${idNoOnclick}`);
                    if (idNoOnclick !== temaId) {
                        console.log(`   ⚠️  ID no onclick (${idNoOnclick}) diferente do data-tema-id (${temaId})`);
                    }
                } else {
                    console.log('   ⚠️  Não conseguiu extrair ID do onclick');
                }
            } catch (e) {
                console.log(`   ❌ Erro ao parsear onclick: ${e.message}`);
            }
        }
        
        // Verificar se item tem eventos de touch configurados
        const touchAction = window.getComputedStyle(item).touchAction;
        const pointerEvents = window.getComputedStyle(item).pointerEvents;
        console.log(`   touch-action: ${touchAction}`);
        console.log(`   pointer-events: ${pointerEvents}`);
    });
}

// 3. Verificar IDs problemáticos específicos
console.log('\n3️⃣ VERIFICANDO ITENS PROBLEMÁTICOS ESPECÍFICOS:');
const temasProblema = ['Fratura de clavícula', 'Epifisiolistese', 'Sd manguito rotador', 'DDQ', 'Luxação e Instabilidade do cotovelo', 'LAC/LEC', 'Epicondilites', 'Fraturas do cotovelo'];

temasProblema.forEach(temaNome => {
    const item = Array.from(items).find(item => {
        const nome = item.querySelector('.task-theme-name')?.textContent;
        return nome && nome.includes(temaNome);
    });
    
    if (item) {
        console.log(`\n🔴 ${temaNome}:`);
        const temaId = item.getAttribute('data-tema-id');
        const onclick = item.getAttribute('onclick');
        console.log(`   data-tema-id: ${temaId}`);
        console.log(`   onclick: ${onclick}`);
        
        // Tentar executar onclick manualmente
        console.log(`   Testando onclick manualmente...`);
        try {
            // Criar função temporária para testar
            const testFn = new Function('return ' + onclick.replace('togglePendencia', 'window.togglePendencia'));
            console.log(`   ✅ onclick pode ser executado`);
        } catch (e) {
            console.log(`   ❌ Erro ao executar onclick: ${e.message}`);
        }
    } else {
        console.log(`\n⚠️  ${temaNome}: NÃO ENCONTRADO na lista`);
    }
});

// 4. Testar evento de toque diretamente
console.log('\n4️⃣ TESTANDO EVENTO DE TOQUE:');
if (items.length > 0) {
    const primeiroItem = items[0];
    const temaNome = primeiroItem.querySelector('.task-theme-name')?.textContent || 'Item teste';
    console.log(`Testando toque no primeiro item: ${temaNome}`);
    
    // Adicionar listener de teste
    let touchTestado = false;
    primeiroItem.addEventListener('touchstart', (e) => {
        console.log('✅ touchstart detectado!');
        touchTestado = true;
    }, { once: true });
    
    primeiroItem.addEventListener('touchend', (e) => {
        console.log('✅ touchend detectado!');
        touchTestado = true;
    }, { once: true });
    
    primeiroItem.addEventListener('click', (e) => {
        console.log('✅ click detectado!');
        touchTestado = true;
    }, { once: true });
    
    console.log('👆 Toque no primeiro item agora e veja se os eventos são detectados');
    console.log('(Aguarde 10 segundos para ver resultado...)');
    
    setTimeout(() => {
        if (!touchTestado) {
            console.log('❌ NENHUM evento de toque foi detectado após 10 segundos!');
            console.log('Isso indica que há algo bloqueando os eventos de toque.');
        }
    }, 10000);
}

// 5. Verificar se há elementos sobrepostos
console.log('\n5️⃣ VERIFICANDO ELEMENTOS SOBREPOSTOS:');
if (items.length > 0) {
    const primeiroItem = items[0];
    const rect = primeiroItem.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const elementoNoCentro = document.elementFromPoint(centerX, centerY);
    console.log(`Elemento no centro do primeiro item: ${elementoNoCentro?.tagName} ${elementoNoCentro?.className}`);
    
    if (elementoNoCentro !== primeiroItem && !primeiroItem.contains(elementoNoCentro)) {
        console.log('⚠️  Há um elemento diferente sobrepondo o item!');
        console.log(`   Elemento sobreposto: ${elementoNoCentro?.outerHTML.substring(0, 100)}`);
    } else {
        console.log('✅ Nenhum elemento sobrepondo');
    }
}

// 6. Verificar backdrop-filter (pode causar problemas no iOS)
console.log('\n6️⃣ VERIFICANDO CSS PROBLEMÁTICO:');
if (items.length > 0) {
    const primeiroItem = items[0];
    const styles = window.getComputedStyle(primeiroItem);
    const backdropFilter = styles.backdropFilter || styles.webkitBackdropFilter;
    const zIndex = styles.zIndex;
    
    console.log(`backdrop-filter: ${backdropFilter}`);
    console.log(`z-index: ${zIndex}`);
    
    if (backdropFilter && backdropFilter !== 'none') {
        console.log('⚠️  backdrop-filter está ativo - pode causar problemas no iOS');
    }
}

console.log('\n═══════════════════════════════════════════════════════');
console.log('DIAGNÓSTICO CONCLUÍDO');
console.log('═══════════════════════════════════════════════════════');
```

---

## 🔍 O QUE PROCURAR NOS RESULTADOS

### Se onclick está ausente ou inválido:
- Problema: HTML não está sendo gerado corretamente
- Solução: Verificar função `renderPendencias()`

### Se onclick está válido mas não funciona:
- Problema: Evento de toque está sendo bloqueado
- Possíveis causas:
  1. Elemento sobreposto bloqueando toque
  2. `backdrop-filter` causando problemas no iOS
  3. `pointer-events` bloqueando eventos
  4. Service Worker servindo código antigo

### Se eventos de toque não são detectados:
- Problema: Algo está bloqueando eventos completamente
- Solução: Verificar CSS (`pointer-events`, `z-index`, `backdrop-filter`)

---

## 🛠️ SOLUÇÕES ALTERNATIVAS

Se o diagnóstico mostrar que o onclick está correto mas ainda não funciona:

### Solução A: Remover backdrop-filter temporariamente
```css
.task-theme-item {
    /* backdrop-filter: blur(15px); */ /* Comentar temporariamente */
    background: rgba(20, 35, 45, 0.95); /* Fallback sólido */
}
```

### Solução B: Adicionar event listener programático como fallback
```javascript
// Adicionar após renderPendencias()
document.querySelectorAll('.task-theme-item').forEach(item => {
    const temaId = item.getAttribute('data-tema-id');
    item.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.togglePendencia(temaId);
    });
});
```

### Solução C: Verificar se Service Worker está atualizado
```javascript
// No console do iPhone
navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => {
        console.log('SW ativo:', reg.active?.scriptURL);
        reg.update(); // Forçar atualização
    });
});
```

---

**Execute o diagnóstico e me envie os resultados!**

