# Passo 3 – Store com Pinia

## Objetivo

Neste passo, vamos criar o store de tarefas com Pinia e registrá-lo na aplicação. O store centraliza o estado das tarefas e toda a lógica de chamada à API.

## Registrando o Pinia no `main.js`

Abra o `src/main.js` e adicione o Pinia antes de montar a aplicação:

```javascript title="src/main.js" linenums="1" hl_lines="16 20"
import './assets/css/global.css';

import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 1000);
    }
  },
});

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
```

O `createPinia()` inicializa o sistema de stores. Ele precisa ser registrado antes da montagem da aplicação.

## Criando o store

Crie o arquivo `src/stores/tasks.js`:

```javascript title="src/stores/tasks.js" linenums="1"
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import tasksApi from '../api/tasksApi.js';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const pendingTasks = computed(() => tasks.value.filter((t) => !t.done));
  const completedTasks = computed(() => tasks.value.filter((t) => t.done));

  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    try {
      const response = await tasksApi.getAll();
      tasks.value = response.data;
    } catch (err) {
      error.value = 'Erro ao carregar tarefas.';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function addTask(title) {
    if (!title.trim()) return;
    error.value = null;
    try {
      const response = await tasksApi.create(title.trim());
      tasks.value.push(response.data);
    } catch (err) {
      error.value = 'Erro ao adicionar tarefa.';
      console.error(err);
    }
  }

  async function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) return;
    error.value = null;
    try {
      const response = await tasksApi.update(id, { done: !task.done });
      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1) tasks.value[index] = response.data;
    } catch (err) {
      error.value = 'Erro ao atualizar tarefa.';
      console.error(err);
    }
  }

  async function removeTask(id) {
    error.value = null;
    try {
      await tasksApi.remove(id);
      tasks.value = tasks.value.filter((t) => t.id !== id);
    } catch (err) {
      error.value = 'Erro ao remover tarefa.';
      console.error(err);
    }
  }

  async function updateTaskTitle(id, title) {
    if (!title.trim()) return;
    error.value = null;
    try {
      const response = await tasksApi.update(id, { title: title.trim() });
      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1) tasks.value[index] = response.data;
    } catch (err) {
      error.value = 'Erro ao editar tarefa.';
      console.error(err);
    }
  }

  return {
    tasks,
    loading,
    error,
    pendingTasks,
    completedTasks,
    fetchTasks,
    addTask,
    toggleTask,
    removeTask,
    updateTaskTitle,
  };
});
```

## Entendendo o store

### State

O store tem três variáveis reativas:

| Variável  | Tipo  | Uso                                              |
| --------- | ----- | ------------------------------------------------ |
| `tasks`   | `Ref` | A lista de tarefas retornada pelo backend        |
| `loading` | `Ref` | `true` enquanto uma requisição está em andamento |
| `error`   | `Ref` | Mensagem de erro, ou `null` quando não há erro   |

### Getters

```javascript
const pendingTasks = computed(() => tasks.value.filter((t) => !t.done));
const completedTasks = computed(() => tasks.value.filter((t) => t.done));
```

São computados derivados de `tasks`. Quando `tasks` muda, os componentes que usam `pendingTasks` ou `completedTasks` atualizam automaticamente.

### Actions e o padrão try/catch/finally

Cada action que chama a API segue o mesmo padrão:

```javascript
async function fetchTasks() {
  loading.value = true; // indica que a requisição começou
  error.value = null; // limpa erro anterior
  try {
    const response = await tasksApi.getAll();
    tasks.value = response.data; // atualiza o estado com os dados
  } catch (err) {
    error.value = 'Erro ao carregar tarefas.'; // armazena a mensagem de erro
    console.error(err);
  } finally {
    loading.value = false; // sempre desliga o loading, com ou sem erro
  }
}
```

O bloco `finally` garante que `loading` volta para `false` independente do resultado. Sem isso, uma requisição que falha deixaria a aplicação travada com o indicador de carregamento ativo.

### Atualização local após resposta

Nas actions de `toggleTask` e `updateTaskTitle`, o estado local é atualizado com o dado retornado pelo servidor, não com o valor que foi enviado:

```javascript
const response = await tasksApi.update(id, { done: !task.done });
tasks.value[index] = response.data; // usa o dado confirmado pelo servidor
```

Isso garante que o frontend sempre exibe o estado real que está no banco de dados.

## Removendo o composable antigo

O arquivo `src/composables/useTasks.js` não é mais necessário. O store substitui todas as suas funcionalidades. Delete o arquivo:

```bash
rm src/composables/useTasks.js
```

## Resumo do passo

Neste passo, você:

- Registrou o Pinia no `main.js`
- Criou o store `src/stores/tasks.js` com state, getters e as cinco actions
- Entendeu o padrão `try/catch/finally` nas actions assíncronas
- Removeu o composable `useTasks.js`

---

**Anterior:** [Passo 2 – Camada de acesso à API](02-camada-api.md) | **Próximo:** [Passo 4 – Integrando os componentes](04-integrando-componentes.md)
