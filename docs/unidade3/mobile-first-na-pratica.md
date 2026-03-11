# 1. Mobile-first na prática

Mobile-first não é só sobre tamanho de tela. É sobre **priorizar o essencial** e tomar decisões que funcionem primeiro no celular.

## O que isso muda na prática?

- **Conteúdo primeiro:** o que o usuário precisa ver e fazer agora?
- **Menos distração:** cada elemento precisa ter uma função clara
- **Layout compacto:** a disposição dos elementos deve considerar o uso de espaços com intenção, sem que as informações e elementos estejam muito próximos ou distantes demais
- **Texto legível:** evite fontes pequenas ou linhas longas

## Priorize ações principais

Em mobile, o usuário tem pouco tempo e pouca tela. Pergunte:

- Qual é a ação mais importante da tela?
- O que pode ser escondido ou deixado para depois?

**Exemplo no projeto:**

Na tela de registros, a ação principal é **criar novo registro**. Ela deve estar visível e fácil de acessar (geralmente na parte inferior).

## CSS mobile-first em componentes Vue.js

No Vue.js, a abordagem mobile-first se aplica diretamente nos estilos dos componentes. O princípio é: escreva os estilos base pensando no mobile e use `@media` para adaptar a telas maiores.

### Estrutura de estilos em um componente

```vue linenums="1" title="src/components/RecordList.vue"
<template>
  <div class="record-list">
    <div v-for="record in records" :key="record.id" class="record-card">
      <h3 class="record-title">{{ record.title }}</h3>
      <span class="record-duration">{{ record.duration }} min</span>
    </div>
  </div>
</template>

<style scoped>
/* Base: mobile (uma coluna, espaçamento compacto) */
.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.record-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.record-title {
  font-size: 1rem;
  margin-bottom: 4px;
}

.record-duration {
  font-size: 0.875rem;
  color: #666;
}

/* Tablet: duas colunas */
@media (min-width: 768px) {
  .record-list {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .record-card {
    flex: 0 0 calc(50% - 6px);
  }
}

/* Desktop: três colunas com largura máxima */
@media (min-width: 1024px) {
  .record-list {
    max-width: 960px;
    margin: 0 auto;
  }

  .record-card {
    flex: 0 0 calc(33.333% - 8px);
  }
}
</style>
```

Observe que o código CSS começa com a versão mobile (uma coluna, sem media query) e **adiciona** regras para telas maiores. Esse é o princípio mobile-first aplicado.

### Composable para detectar tamanho de tela

Em alguns casos, pode ser necessário alterar o comportamento do componente (não apenas o estilo) com base no tamanho da tela. Um composable facilita isso:

```javascript linenums="1" title="src/composables/useBreakpoint.js"
import { ref, onMounted, onUnmounted } from 'vue';

export function useBreakpoint() {
  const isMobile = ref(true);
  const isTablet = ref(false);
  const isDesktop = ref(false);

  function update() {
    const width = window.innerWidth;
    isMobile.value = width < 768;
    isTablet.value = width >= 768 && width < 1024;
    isDesktop.value = width >= 1024;
  }

  onMounted(() => {
    update();
    window.addEventListener('resize', update);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', update);
  });

  return { isMobile, isTablet, isDesktop };
}
```

```vue linenums="1" title="Uso no componente"
<script setup>
import { useBreakpoint } from '@/composables/useBreakpoint';

const { isMobile } = useBreakpoint();
</script>

<template>
  <nav v-if="isMobile" class="nav-bottom">
    <!-- Navegação inferior no mobile -->
  </nav>
  <aside v-else class="nav-sidebar">
    <!-- Barra lateral no desktop -->
  </aside>
</template>
```

!!! tip "Prefira CSS quando possível"

    Use o composable apenas quando o **comportamento** precisa mudar (ex.: trocar componente de navegação). Para diferenças apenas visuais, `@media` no CSS é mais eficiente e não depende de JavaScript.

## Evite "desktopizar" o mobile

Erros comuns:

- Menus grandes demais
- Muitas colunas na mesma tela
- Texto pequeno para que todas as informações estejam na tela
- Tabelas complexas sem adaptação (use cards no mobile)

### Atividade prática

Avalie dois apps conhecidos (ex.: WhatsApp e Spotify) e responda:

- O que aparece primeiro na tela?
- Quais ações estão mais acessíveis?
- O que foi deixado em segundo plano?

---

**Próximo:** [Fluxo de navegação em aplicações mobile](fluxo-navegacao-mobile.md)
