# Passo 1 – Preparação do ambiente

## Objetivo

Neste passo, vamos subir o backend, instalar as dependências necessárias no frontend e entender o que vai mudar no projeto.

## Subindo o backend

Com o Docker instalado, execute:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:1.0
```

Na primeira execução, o Docker baixa a imagem automaticamente. Nas próximas, ela já estará disponível localmente.

Para verificar que o servidor está rodando, acesse `http://localhost:8001/docs` no navegador. Você verá a documentação interativa com os quatro endpoints disponíveis.

## Instalando as dependências

Acesse a pasta do projeto frontend e instale o **axios** e o **Pinia**:

```bash
cd registro-atividades-pwa
npm install axios pinia
```

**axios** é uma biblioteca para fazer requisições HTTP. É mais conveniente que o `fetch` nativo porque lida automaticamente com a serialização JSON, permite configurar uma URL base e facilita o tratamento de erros.

**Pinia** é a biblioteca oficial de gerenciamento de estado para Vue 3. Vamos usá-la para compartilhar o estado das tarefas entre os componentes e centralizar todas as chamadas à API.

## O que vamos criar e modificar

| Arquivo                       | Ação      |
| ----------------------------- | --------- |
| `src/api/config.js`           | Criar     |
| `src/api/tasksApi.js`         | Criar     |
| `src/stores/tasks.js`         | Criar     |
| `src/main.js`                 | Modificar |
| `src/views/HomeView.vue`      | Modificar |
| `src/components/TaskItem.vue` | Modificar |
| `src/components/TaskForm.vue` | Modificar |
| `src/composables/useTasks.js` | Remover   |
| `vite.config.js`              | Modificar |

## Estado atual do projeto

O arquivo `src/composables/useTasks.js` é o ponto central do projeto hoje. Ele mantém as tarefas num array reativo e expõe funções para adicionar, marcar como concluída e remover:

```javascript title="src/composables/useTasks.js (atual)"
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
    tasks.value.push({ id: nextId++, title: title.trim(), done: false });
  }

  function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === id);
    if (task) task.done = !task.done;
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

Ao final do tutorial, esse arquivo terá sido substituído pelo store Pinia, e as tarefas serão buscadas e salvas no backend.

## Resumo do passo

Neste passo, você:

- Iniciou o backend via Docker
- Instalou o axios e o Pinia no projeto
- Entendeu o que vai mudar ao longo do tutorial

---

**Anterior:** [Visão geral do tutorial](index.md) | **Próximo:** [Passo 2 – Camada de acesso à API](02-camada-api.md)
