# 6. Vue Router: navegação entre páginas

## Por que usar Vue Router?

Em aplicações mobile, você precisa navegar entre diferentes telas:

- Tela inicial → Lista de registros
- Lista → Detalhes de um registro
- Detalhes → Edição

O **Vue Router** permite criar navegação fluida e organizada, simulando o comportamento de um aplicativo nativo.

## Instalação

```bash
npm install vue-router@4
```

## Conceitos básicos

### 1. **Rotas**

Associam URLs a componentes (views).

### 2. **Router**

Gerencia as rotas e a navegação.

### 3. **RouterView**

Local onde os componentes das rotas são renderizados.

### 4. **RouterLink**

Cria links de navegação.

## Configuração inicial

### Estrutura de arquivos

```
src/
├─ router/
│  └─ index.js       # Configuração das rotas
├─ views/            # Componentes de tela
│  ├─ HomeView.vue
│  ├─ RecordsView.vue
│  └─ RecordDetailView.vue
└─ App.vue
```

### Criar `router/index.js`

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/records',
    name: 'records',
    // Lazy loading: carrega apenas quando necessário
    component: () => import('@/views/RecordsView.vue'),
  },
  {
    path: '/records/:id',
    name: 'record-detail',
    component: () => import('@/views/RecordDetailView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

### Configurar no `main.js`

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
```

### Atualizar `App.vue`

```vue
<script setup>
import AppHeader from './components/layout/AppHeader.vue';
</script>

<template>
  <div class="app">
    <AppHeader title="Registro de Atividades" />

    <!-- Componentes das rotas renderizam aqui -->
    <RouterView />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
}
</style>
```

## Criando as views

### `HomeView.vue`

```vue
<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="home">
    <div class="hero">
      <h1>Bem-vindo!</h1>
      <p>Registre e acompanhe suas atividades diárias</p>
    </div>

    <nav class="menu">
      <RouterLink to="/records" class="menu-item">
        📋 Ver registros
      </RouterLink>
      <RouterLink to="/records/new" class="menu-item">
        ➕ Novo registro
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.home {
  padding: 72px 16px 16px;
}

.hero {
  text-align: center;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 28px;
  margin-bottom: 12px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: block;
  padding: 20px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #111;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: transform 0.1s;
}

.menu-item:active {
  transform: scale(0.98);
}
</style>
```

### `RecordsView.vue`

```vue
<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import RecordCard from '@/components/records/RecordCard.vue';

const records = ref([
  { id: 1, title: 'Estudar Vue.js', duration: 60, date: '2026-02-06' },
  { id: 2, title: 'Fazer exercícios', duration: 30, date: '2026-02-05' },
]);
</script>

<template>
  <div class="records">
    <h2>Meus Registros</h2>

    <div class="list">
      <RouterLink
        v-for="record in records"
        :key="record.id"
        :to="`/records/${record.id}`"
        class="link"
      >
        <RecordCard
          :title="record.title"
          :duration="record.duration"
          :date="record.date"
        />
      </RouterLink>
    </div>

    <div v-if="records.length === 0" class="empty">
      <p>Nenhum registro ainda</p>
      <RouterLink to="/records/new" class="btn">
        Criar primeiro registro
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.records {
  padding: 72px 16px 16px;
}

.list {
  margin-top: 20px;
}

.link {
  text-decoration: none;
  color: inherit;
}

.empty {
  text-align: center;
  padding: 40px 20px;
}

.btn {
  display: inline-block;
  margin-top: 16px;
  padding: 12px 24px;
  background: #0b5cff;
  color: white;
  border-radius: 8px;
  text-decoration: none;
}
</style>
```

### `RecordDetailView.vue`

```vue
<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Pega o ID da URL
const recordId = computed(() => route.params.id);

// Simula busca do registro (futuramente virá de uma store ou API)
const record = ref({
  id: recordId.value,
  title: 'Estudar Vue.js',
  duration: 60,
  date: '2026-02-06',
  notes: 'Estudei Composition API e Vue Router',
});

function goBack() {
  router.push('/records');
}

function editRecord() {
  router.push(`/records/${recordId.value}/edit`);
}
</script>

<template>
  <div class="detail">
    <button @click="goBack" class="btn-back">← Voltar</button>

    <div class="card">
      <h1>{{ record.title }}</h1>

      <div class="info">
        <div class="info-item">
          <span class="label">Duração:</span>
          <span class="value">{{ record.duration }} min</span>
        </div>
        <div class="info-item">
          <span class="label">Data:</span>
          <span class="value">{{ record.date }}</span>
        </div>
      </div>

      <div class="notes">
        <h3>Observações</h3>
        <p>{{ record.notes }}</p>
      </div>

      <button @click="editRecord" class="btn-edit">Editar</button>
    </div>
  </div>
</template>

<style scoped>
.detail {
  padding: 72px 16px 16px;
}

.btn-back {
  margin-bottom: 16px;
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.info {
  margin: 20px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.label {
  font-weight: 600;
  color: #666;
}

.notes {
  margin: 20px 0;
}

.notes h3 {
  margin-bottom: 8px;
  font-size: 16px;
}

.btn-edit {
  width: 100%;
  padding: 14px;
  background: #0b5cff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
</style>
```

## Navegação programática

### `useRouter()`

Para navegar via código JavaScript.

```vue
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToRecords() {
  router.push('/records');
}

function goToRecordDetail(id) {
  router.push(`/records/${id}`);
}

function goBack() {
  router.back();
}

function goForward() {
  router.forward();
}

function replaceRoute() {
  // Substitui a rota atual (não adiciona ao histórico)
  router.replace('/records');
}
</script>
```

### Métodos disponíveis

```javascript
// Navega para uma rota
router.push('/path');
router.push({ name: 'route-name' });
router.push({ path: '/path', query: { id: 1 } });

// Substitui a rota atual
router.replace('/path');

// Navega no histórico
router.back();
router.forward();
router.go(-2); // Volta 2 páginas
```

## Acessando parâmetros de rota

### `useRoute()`

Para ler informações da rota atual.

```vue
<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

// Parâmetros da URL
console.log(route.params.id);

// Query params (?key=value)
console.log(route.query.search);

// Nome da rota
console.log(route.name);

// Path completo
console.log(route.path);
</script>
```

### Exemplo com query params

```javascript
// Navegando com query params
router.push({
  path: '/records',
  query: { filter: 'completed', page: 2 },
});

// URL resultante: /records?filter=completed&page=2

// Acessando
const filter = route.query.filter; // 'completed'
const page = route.query.page; // '2'
```

## Rotas dinâmicas

### Parâmetros na URL

```javascript
const routes = [
  // Parâmetro obrigatório
  {
    path: '/records/:id',
    component: RecordDetailView,
  },

  // Parâmetro opcional
  {
    path: '/records/:id?',
    component: RecordsView,
  },

  // Múltiplos parâmetros
  {
    path: '/users/:userId/records/:recordId',
    component: UserRecordView,
  },
];
```

### Validando parâmetros

```javascript
{
  path: '/records/:id',
  component: RecordDetailView,
  beforeEnter: (to, from) => {
    const id = parseInt(to.params.id)
    if (isNaN(id)) {
      return '/records' // Redireciona se ID inválido
    }
  }
}
```

## Navegação com transições

Para animações suaves entre páginas.

```vue
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### Transição deslizante (mobile-style)

```vue
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="slide" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
```

## Guards de navegação

Para controlar acesso a rotas.

### Guard global

```javascript
// router/index.js
router.beforeEach((to, from) => {
  // Verifica autenticação
  const isAuthenticated = localStorage.getItem('token');

  if (to.name !== 'login' && !isAuthenticated) {
    return { name: 'login' };
  }
});
```

### Guard por rota

```javascript
{
  path: '/admin',
  component: AdminView,
  beforeEnter: (to, from) => {
    if (!isAdmin()) {
      return '/home'
    }
  }
}
```

## Meta informações

Adicione metadados às rotas.

```javascript
{
  path: '/admin',
  component: AdminView,
  meta: {
    requiresAuth: true,
    title: 'Administração'
  }
}
```

Usando no guard:

```javascript
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login';
  }

  // Atualiza título da página
  document.title = to.meta.title || 'Meu App';
});
```

## Lazy loading de rotas

Para melhorar performance, carregue rotas apenas quando necessário.

```javascript
const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/records',
    component: () => import('@/views/RecordsView.vue'),
  },
];
```

Isso cria chunks separados que são carregados sob demanda.

## Resumo

Nesta seção você aprendeu:

- Instalar e configurar Vue Router
- Criar rotas e views
- Navegar com `RouterLink` e `router.push()`
- Acessar parâmetros com `useRoute()`
- Criar rotas dinâmicas
- Adicionar transições entre páginas
- Usar guards para controle de acesso
- Implementar lazy loading

Na próxima seção, vamos juntar tudo em um **projeto prático completo**.

Para aprofundar os padrões de navegação no contexto mobile, consulte também [Fluxo de navegação em aplicações mobile](../unidade3/fluxo-navegacao-mobile.md) na Unidade 3.

---

**Anterior:** [Organização de projeto](organizacao-projeto.md) | **Próximo:** [Projeto prático](projeto/index.md)
