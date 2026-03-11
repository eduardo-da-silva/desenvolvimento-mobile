# 5. Design simples e funcional

Design mobile eficiente é aquele que **resolve o problema com o mínimo de esforço**.

## Evite excesso de elementos

- Cada elemento deve ter um propósito
- Se algo não ajuda a tarefa, remova
- Evite elementos decorativos desnecessários que distraem

## Hierarquia visual clara

- Título mais forte
- Ação principal destacada
- Informação secundária em segundo plano

## Consistência melhora usabilidade

- Mesmas cores para a mesma ação
- Botões com formato consistente
- Espaçamento e alinhamento padrão

**Exemplo no projeto:**

Se "Salvar" é verde em uma tela, mantenha o mesmo padrão nas outras.

## Aplicando design simples em Vue.js

### Sistema de variáveis CSS para consistência

Um sistema de design começa com variáveis CSS centralizadas. Isso garante que cores, espaçamentos e tipografia sejam consistentes em todo o app:

```css linenums="1" title="src/assets/css/variables.css"
:root {
  /* Cores principais */
  --color-primary: #0b5cff;
  --color-primary-dark: #0847cc;
  --color-success: #2e7d32;
  --color-error: #c62828;
  --color-warning: #f57f17;

  /* Cores neutras */
  --color-text: #333;
  --color-text-secondary: #666;
  --color-border: #e0e0e0;
  --color-background: #f4f4f6;
  --color-surface: #fff;

  /* Espaçamentos */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Tipografia */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* Bordas */
  --radius: 8px;

  /* Tamanho mínimo de toque */
  --touch-min: 44px;
}
```

### Componente de botão consistente

Em vez de estilizar botões individualmente em cada componente, crie um componente de botão reutilizável:

```vue linenums="1" title="src/components/AppButton.vue"
<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger'].includes(v),
  },
  fullWidth: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <button
    class="app-btn"
    :class="[variant, { 'full-width': fullWidth }]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 12px var(--space-md);
  border: none;
  border-radius: var(--radius);
  font-size: var(--font-size-base);
  font-weight: 600;
  min-height: var(--touch-min);
  cursor: pointer;
  transition: background-color 0.2s;
}

.app-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  background: var(--color-primary);
  color: #fff;
}

.primary:active:not(:disabled) {
  background: var(--color-primary-dark);
}

.secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.danger {
  background: var(--color-error);
  color: #fff;
}

.full-width {
  width: 100%;
}
</style>
```

Uso nos componentes:

```vue linenums="1" title="Exemplo de uso"
<template>
  <div class="actions">
    <AppButton variant="primary" full-width @click="salvar"> Salvar </AppButton>
    <AppButton variant="secondary" full-width @click="cancelar">
      Cancelar
    </AppButton>
    <AppButton variant="danger" @click="excluir"> Excluir </AppButton>
  </div>
</template>
```

Com esse componente, todos os botões do app têm aparência e comportamento consistentes. Alterações no design são feitas em um único lugar.

### Componente de card padronizado

Cards são usados em muitas telas. Padronizá-los garante consistência visual:

```vue linenums="1" title="src/components/AppCard.vue"
<script setup>
defineProps({
  clickable: { type: Boolean, default: false },
});
</script>

<template>
  <div class="app-card" :class="{ clickable }" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: var(--space-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.app-card.clickable {
  cursor: pointer;
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}

.app-card.clickable:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
</style>
```

### Atividade prática

Escolha uma tela do app e tente remover 20% dos elementos sem perder funcionalidade. Avalie o resultado.

---

**Próximo:** [Uso com uma mão: zonas de alcance](uso-uma-mao.md)
