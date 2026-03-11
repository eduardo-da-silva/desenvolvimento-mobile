# 6. Uso com uma mão: zonas de alcance

A maioria das pessoas usa o celular com **uma mão só**. Isso muda onde colocar ações importantes.

## Zonas de alcance

- **Parte inferior:** mais fácil de alcançar
- **Parte superior:** mais difícil
- **Cantos superiores:** pior acesso

## Como aplicar

- Botões principais na parte inferior
- Ações secundárias no topo
- Menus de navegação próximos ao polegar

**Exemplo no projeto:**

O botão de "Novo registro" fica melhor na parte inferior do que no topo.

## Implementando zonas de alcance em Vue.js

### Floating Action Button (FAB)

O FAB é um padrão de design comum em apps mobile. Ele fica na parte inferior da tela, facilmente acessível com o polegar:

```vue linenums="1" title="src/components/FloatingActionButton.vue"
<script setup>
defineProps({
  label: { type: String, default: '' },
});

const emit = defineEmits(['click']);
</script>

<template>
  <button
    class="fab"
    :aria-label="label || 'Ação principal'"
    @click="emit('click')"
  >
    <span class="fab-icon">+</span>
  </button>
</template>

<style scoped>
.fab {
  position: fixed;
  bottom: 80px; /* acima da barra de navegação */
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary, #0b5cff);
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.fab:active {
  transform: scale(0.92);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.fab-icon {
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1;
}
</style>
```

### Layout com ações na parte inferior

Em telas de detalhe ou formulário, as ações de confirmação devem ficar na parte inferior. Esse componente de layout padroniza essa estrutura:

```vue linenums="1" title="src/components/BottomActions.vue"
<script setup>
defineProps({
  sticky: { type: Boolean, default: true },
});
</script>

<template>
  <div class="bottom-actions" :class="{ sticky }">
    <slot />
  </div>
</template>

<style scoped>
.bottom-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid var(--color-border, #e0e0e0);
}

.bottom-actions.sticky {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
}
</style>
```

Uso em uma tela de edição:

```vue linenums="1" title="Uso em RegistroEditarView.vue"
<template>
  <div class="editar-view">
    <AppHeader title="Editar Registro" />

    <main class="content">
      <!-- campos do formulário -->
    </main>

    <BottomActions>
      <AppButton variant="secondary" full-width @click="cancelar">
        Cancelar
      </AppButton>
      <AppButton variant="primary" full-width @click="salvar">
        Salvar
      </AppButton>
    </BottomActions>
  </div>
</template>

<style scoped>
.content {
  padding: 72px 16px 80px; /* espaço para header e bottom actions */
}
</style>
```

Com essa estrutura, os botões de ação ficam sempre ao alcance do polegar, e o conteúdo do formulário fica na área central com scroll.

### Atividade prática

Refaça a distribuição dos botões principais de uma tela, pensando no uso com uma mão. Teste no celular.

---

**Próximo:** [Exercício prático: melhorando um app "ruim"](exercicio-app-ruim.md)
