# Passo 1 – Configuração do suporte a PWA

## Objetivo

Neste passo, vamos criar um novo projeto Vue.js 3 com Vite, implementar uma interface básica de gerenciamento de tarefas e então adicionar o suporte a PWA usando o plugin `vite-plugin-pwa`.

## Criando o projeto Vue.js

Abra o terminal e execute:

```bash
npm init vue@latest tarefas-pwa
```

Durante a configuração, escolha as seguintes opções:

- **Add TypeScript?** → No
- **Add JSX Support?** → No
- **Add Vue Router?** → Yes
- **Add Pinia?** → No
- **Add Vitest?** → No
- **Add an End-to-End Testing Solution?** → Yes
- **Add ESLint for code quality?** → Yes
- **Add Vue DevTools browser extension?** → Yes

Em seguida, entre na pasta do projeto e instale as dependências:

```bash
cd tarefas-pwa
npm install
```

Verifique se o projeto funciona:

```bash
npm run dev -- --host
```

Acesse `http://localhost:5173` no navegador. Você deve ver a página inicial padrão do Vue.js.

## Implementando a aplicação base

Antes de adicionar o suporte a PWA, precisamos de uma aplicação funcional. Vamos criar um gerenciador de tarefas simples.

### Estrutura de pastas

Organize a pasta `src/` da seguinte forma:

```
src/
├── assets/
│   └── css/
│       └── global.css
├── components/
│   ├── AppHeader.vue
│   ├── TaskForm.vue
│   └── TaskItem.vue
├── composables/
│   └── useTasks.js
├── views/
│   ├── HomeView.vue
│   └── AboutView.vue
├── router/
│   └── index.js
├── App.vue
└── main.js
```

### Estilos globais

Crie o arquivo `src/assets/css/global.css`:

```css title='./src/assets/css/global.css' linenums='1'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  min-height: 100vh;
}

#app {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 16px;
}
```

### Composable para gerenciar tarefas

Crie o arquivo `./src/composables/useTasks.js`. Este composable centraliza a lógica de gerenciamento das tarefas:

```javascript title='src/composables/useTasks.js' linenums='1'
import { ref, computed } from 'vue';

const tasks = ref([
  { id: 1, title: 'Estudar Progressive Web Apps', done: false },
  { id: 2, title: 'Configurar o Service Worker', done: false },
  { id: 3, title: 'Testar funcionamento offline', done: true },
]);

let nextId = 4;

export function useTasks() {
  const pendingTasks = computed(() => tasks.value.filter((t) => !t.done));
  const completedTasks = computed(() => tasks.value.filter((t) => t.done));

  function addTask(title) {
    if (!title.trim()) return;
    tasks.value.push({
      id: nextId++,
      title: title.trim(),
      done: false,
    });
  }

  function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      task.done = !task.done;
    }
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id);
  }

  return {
    tasks,
    pendingTasks,
    completedTasks,
    addTask,
    toggleTask,
    removeTask,
  };
}
```

### Componentes

**`src/components/AppHeader.vue`**

```vue title='src/components/AppHeader.vue' linenums='1'
<template>
  <header class="app-header">
    <h1>Tarefas</h1>
    <nav>
      <router-link to="/">Início</router-link>
      <router-link to="/about">Sobre</router-link>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 2px solid #4a90d9;
  margin-bottom: 24px;
}

.app-header h1 {
  font-size: 1.4rem;
  color: #4a90d9;
}

nav {
  display: flex;
  gap: 16px;
}

nav a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  font-size: 0.9rem;
}

nav a.router-link-active {
  color: #4a90d9;
}
</style>
```

**`src/components/TaskForm.vue`**

```vue title='src/components/TaskForm.vue' linenums='1'
<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <input
      v-model="newTask"
      type="text"
      placeholder="Nova tarefa..."
      class="task-input"
    />
    <button type="submit" class="task-button">Adicionar</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add']);
const newTask = ref('');

function handleSubmit() {
  if (newTask.value.trim()) {
    emit('add', newTask.value);
    newTask.value = '';
  }
}
</script>

<style scoped>
.task-form {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.task-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.task-input:focus {
  border-color: #4a90d9;
}

.task-button {
  padding: 12px 20px;
  background-color: #4a90d9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.task-button:hover {
  background-color: #357abd;
}
</style>
```

**`src/components/TaskItem.vue`**

```vue title='src/components/TaskItem.vue' linenums='1'
<template>
  <div class="task-item" :class="{ done: task.done }">
    <label class="task-label">
      <input
        type="checkbox"
        :checked="task.done"
        @change="$emit('toggle', task.id)"
      />
      <span class="task-title">{{ task.title }}</span>
    </label>
    <button class="task-remove" @click="$emit('remove', task.id)">
      Remover
    </button>
  </div>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
});

defineEmits(['toggle', 'remove']);
</script>

<style scoped>
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s;
}

.task-item.done {
  opacity: 0.6;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.task-label input[type='checkbox'] {
  width: 20px;
  height: 20px;
  accent-color: #4a90d9;
}

.task-title {
  font-size: 1rem;
}

.task-item.done .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-remove {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
}

.task-remove:hover {
  text-decoration: underline;
}
</style>
```

### Views

**`src/views/HomeView.vue`**

```vue title='src/views/HomeView.vue' linenums='1'
<template>
  <div>
    <TaskForm @add="addTask" />

    <section v-if="pendingTasks.length > 0">
      <h2 class="section-title">Pendentes ({{ pendingTasks.length }})</h2>
      <TaskItem
        v-for="task in pendingTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @remove="removeTask"
      />
    </section>

    <section v-if="completedTasks.length > 0">
      <h2 class="section-title">Concluídas ({{ completedTasks.length }})</h2>
      <TaskItem
        v-for="task in completedTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @remove="removeTask"
      />
    </section>

    <p v-if="tasks.length === 0" class="empty-message">
      Nenhuma tarefa cadastrada. Adicione uma acima.
    </p>
  </div>
</template>

<script setup>
import TaskForm from '../components/TaskForm.vue';
import TaskItem from '../components/TaskItem.vue';
import { useTasks } from '../composables/useTasks';

const { tasks, pendingTasks, completedTasks, addTask, toggleTask, removeTask } =
  useTasks();
</script>

<style scoped>
.section-title {
  font-size: 1rem;
  color: #666;
  margin-bottom: 12px;
  margin-top: 20px;
}

.empty-message {
  text-align: center;
  color: #999;
  margin-top: 40px;
  font-size: 0.95rem;
}
</style>
```

**`src/views/AboutView.vue`**

```vue title='src/views/AboutView.vue' linenums='1'
<template>
  <div class="about">
    <h2>Sobre o aplicativo</h2>
    <p>
      Este é um gerenciador de tarefas desenvolvido como Progressive Web App
      (PWA) utilizando Vue.js 3 e Vite.
    </p>
    <p>
      O aplicativo funciona offline, pode ser instalado no seu dispositivo e
      carrega rapidamente mesmo em conexões lentas.
    </p>

    <h3>Tecnologias utilizadas</h3>
    <ul>
      <li>Vue.js 3 com Composition API</li>
      <li>Vite como ferramenta de build</li>
      <li>Vue Router para navegação</li>
      <li>vite-plugin-pwa para suporte a PWA</li>
      <li>Workbox para gerenciamento de cache</li>
    </ul>
  </div>
</template>

<style scoped>
.about {
  line-height: 1.6;
}

.about h2 {
  font-size: 1.3rem;
  color: #4a90d9;
  margin-bottom: 12px;
}

.about h3 {
  font-size: 1.1rem;
  margin-top: 20px;
  margin-bottom: 8px;
}

.about p {
  margin-bottom: 12px;
  color: #555;
}

.about ul {
  padding-left: 20px;
}

.about li {
  margin-bottom: 6px;
  color: #555;
}
</style>
```

### Configuração do Router

Edite o arquivo `src/router/index.js`:

```javascript title='src/router/index.js' linenums='1'
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

### App.vue e main.js

**`src/App.vue`**

```vue title='src/App.vue' linenums='1'
<template>
  <AppHeader />
  <main>
    <router-view />
  </main>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
</script>

<style scoped>
main {
  padding-bottom: 40px;
}
</style>
```

**`src/main.js`**

```javascript title='src/main.js' linenums='1'
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/global.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
```

### Verificando a aplicação

Execute `npm run dev -- --host` e verifique se a aplicação funciona corretamente:

- A lista de tarefas aparece na tela inicial
- É possível adicionar novas tarefas
- É possível marcar e desmarcar tarefas
- É possível remover tarefas
- A navegação entre "Início" e "Sobre" funciona

## Instalando o plugin de PWA

Agora que a aplicação base está funcionando, vamos adicionar o suporte a PWA. Para isso, usamos o **vite-plugin-pwa**, que é o plugin oficial para integrar PWA em projetos Vite.

### Instalação

Pare o servidor de desenvolvimento (Ctrl+C) e execute:

```bash
npm install -D vite-plugin-pwa
```

Este plugin cuida de:

- Gerar automaticamente o manifesto da aplicação
- Gerar e registrar o Service Worker
- Configurar o cache usando a biblioteca Workbox (do Google)
- Injetar as tags necessárias no HTML

### Configuração básica

Abra o arquivo `vite.config.js` e adicione a configuração do plugin:

```javascript title='vite.config.js' linenums='1'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Gerenciador de Tarefas',
        short_name: 'Tarefas',
        description: 'Aplicativo PWA para gerenciar tarefas diárias',
        theme_color: '#4a90d9',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
```

Vamos entender as opções:

- **`registerType: 'autoUpdate'`**: o Service Worker será atualizado automaticamente quando uma nova versão estiver disponível. Veremos mais detalhes sobre isso no Passo 7.
- **`manifest`**: configurações do manifesto da aplicação. O plugin gera o arquivo automaticamente a partir deste objeto.
- **`icons`**: lista de ícones. O terceiro ícone tem `purpose: 'maskable'`, que permite ao sistema operacional recortar o ícone em diferentes formatos (circular, quadrado com cantos arredondados, etc.).

### Criando os ícones

Os ícones são arquivos de imagem que representam a aplicação. São usados na tela inicial do dispositivo, na tela de splash e em outros locais do sistema operacional.

Crie a pasta `public/icons/` e adicione dois arquivos de ícone:

```
public/
└── icons/
    ├── icon-192x192.png
    └── icon-512x512.png
```

!!! tip "Gerando ícones"

    Você pode criar ícones simples usando ferramentas online como:

    - [Favicon.io](https://favicon.io/) — gerador de favicons e ícones
    - [PWA Builder Asset Generator](https://www.pwabuilder.com/imageGenerator) — ferramenta da PWA Builder para gerar ícones e splash screens
    - [RealFaviconGenerator](https://realfavicongenerator.net/) — gerador completo de ícones para PWA

    Para fins de estudo, você pode usar qualquer imagem PNG quadrada redimensionada para 192x192 e 512x512 pixels.

### Verificando a configuração

Inicie o servidor novamente:

```bash
npm run dev -- --host
```

!!! warning "Atenção"

    O Service Worker e o manifesto só funcionam completamente no **build de produção**. Durante o desenvolvimento (`npm run dev`), o plugin gera apenas o manifesto. Para testar o Service Worker, é necessário fazer o build e servir os arquivos estáticos. Veremos isso nos próximos passos.

Para verificar que o manifesto está sendo gerado, abra o DevTools (F12), vá até a aba **Application** e clique em **Manifest** no menu lateral. Você deve ver as informações configuradas.

## Resumo do passo

Neste passo, você:

- Criou um projeto Vue.js 3 com Vite e Vue Router
- Implementou uma aplicação de gerenciamento de tarefas
- Instalou e configurou o `vite-plugin-pwa`
- Criou a configuração inicial do manifesto
- Preparou os ícones da aplicação

No próximo passo, vamos explorar em detalhes a configuração do manifesto.

---

**Próximo:** [Passo 2 – Configuração do manifesto](02-manifesto.md)
