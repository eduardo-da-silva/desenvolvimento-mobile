# 2. Fluxo de navegação em aplicações mobile

O fluxo de navegação é o **caminho que o usuário percorre** para completar uma tarefa. Como regra geral, quanto mais simples o caminho, melhor a experiência.

## Pense em jornadas curtas

No mobile, o usuário não quer "explorar" o aplicativo, mas **resolver algo rapidamente**. Por isso:

- Evite muitos passos para uma tarefa simples
- Mostre o próximo passo com clareza
- Use nomes de telas que façam sentido

### Fluxo típico (exemplo do projeto)

**Home → Lista de registros → Detalhe → Editar ou excluir**

O caminho deve ser previsível. O usuário não pode "se perder" no meio do percurso (tarefa).

### Padrões de navegação comuns

- **Barra inferior (tabs):** boa para 3 a 5 seções principais
- **Navegação por pilha (stack):** lista → detalhe → ação
- **Botão voltar claro:** sempre retorne ao ponto anterior

## Evite caminhos sem saída

Toda tela precisa deixar claro:

- Como voltar
- Como seguir
- O que acontece se nada for feito

## Implementando navegação mobile com Vue Router

No Vue.js, o Vue Router controla a navegação entre telas. A configuração do router define o fluxo que o usuário vai percorrer.

### Estrutura de rotas para navegação por pilha

```javascript linenums="1" title="src/router/index.js"
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Registros' },
  },
  {
    path: '/registro/:id',
    name: 'registro-detalhe',
    component: () => import('@/views/RegistroDetalheView.vue'),
    meta: { title: 'Detalhes' },
  },
  {
    path: '/registro/:id/editar',
    name: 'registro-editar',
    component: () => import('@/views/RegistroEditarView.vue'),
    meta: { title: 'Editar' },
  },
  {
    path: '/novo',
    name: 'registro-novo',
    component: () => import('@/views/RegistroNovoView.vue'),
    meta: { title: 'Novo Registro' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

Observe como a estrutura de rotas reflete o fluxo: **lista → detalhe → editar**. Cada nível de profundidade tem uma rota própria.

### Barra de navegação inferior com Vue Router

A barra inferior (tab bar) é o padrão mais comum em apps mobile. Cada aba leva a uma seção principal:

```vue linenums="1" title="src/components/BottomNav.vue"
<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const tabs = [
  { name: 'home', label: 'Início', icon: 'home' },
  { name: 'registro-novo', label: 'Novo', icon: 'add_circle' },
  { name: 'configuracoes', label: 'Config', icon: 'settings' },
];

function isActive(tabName) {
  return route.name === tabName;
}
</script>

<template>
  <nav class="bottom-nav">
    <router-link
      v-for="tab in tabs"
      :key="tab.name"
      :to="{ name: tab.name }"
      class="nav-tab"
      :class="{ active: isActive(tab.name) }"
    >
      <span class="material-icons">{{ tab.icon }}</span>
      <span class="nav-label">{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 8px 0;
  z-index: 100;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #999;
  font-size: 0.75rem;
  min-width: 64px;
  padding: 4px 0;
}

.nav-tab.active {
  color: #0b5cff;
}

.nav-label {
  margin-top: 2px;
}
</style>
```

### Botão voltar contextual

Em telas de detalhe ou edição, é importante oferecer um botão de retorno claro:

```vue linenums="1" title="src/components/AppHeader.vue"
<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  title: { type: String, default: '' },
});

const showBack = route.name !== 'home';

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'home' });
  }
}
</script>

<template>
  <header class="app-header">
    <button v-if="showBack" class="back-btn" @click="goBack">← Voltar</button>
    <h1 class="header-title">{{ title || route.meta.title }}</h1>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #0b5cff;
  color: #fff;
  padding: 12px 16px;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px;
  min-height: 44px;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
}
</style>
```

O botão voltar aparece automaticamente em telas internas e usa `router.back()` para manter o histórico de navegação. Se não houver histórico, redireciona para a home.

## Atividade prática

Desenhe o fluxo de uma tarefa no seu app (ex.: adicionar registro) e responda:

- Quantas telas são necessárias?
- Há algum passo desnecessário?
- O caminho é o mesmo para todos os usuários?

---

**Próximo:** [Feedback visual para o usuário](feedback-visual-usuario.md)
