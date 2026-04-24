# Passo 3 – Atualizando o store

## Objetivo

O store tem uma função `updateTaskTitle` que enviava somente o novo título ao endpoint `PATCH /tasks/{id}`. Agora precisamos que ela também aceite uma `attachment_key` — o identificador da imagem que foi enviada previamente — e a inclua no payload quando estiver disponível.

## A mudança necessária

A função atual recebe dois parâmetros: `id` e `title`. A versão nova receberá `id` e um objeto `{ title, imgAttachmentKey }`, seguindo o mesmo padrão das outras funções do store. O nome muda de `updateTaskTitle` para `updateTask` para refletir que agora ela pode atualizar mais de um campo.

Abra `src/stores/tasks.js` e substitua a função `updateTaskTitle`:

```javascript title="src/stores/tasks.js" linenums="1" hl_lines="64-78 90"
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

  async function updateTask(id, { title, imgAttachmentKey } = {}) {
    if (title !== undefined && !title.trim()) return;
    error.value = null;
    const payload = {};
    if (title !== undefined) payload.title = title.trim();
    if (imgAttachmentKey != null) payload.img_attachment_key = imgAttachmentKey;
    try {
      const response = await tasksApi.update(id, payload);
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
    updateTask,
  };
});
```

### Entendendo as mudanças

**Assinatura: `updateTask(id, { title, imgAttachmentKey } = {})`**

O segundo parâmetro agora é um objeto desestruturado. O valor padrão `= {}` garante que a função pode ser chamada sem o segundo argumento sem gerar erro. Essa é a mesma convenção já usada em `toggleTask`.

**Construção condicional do payload**

```javascript
const payload = {};
if (title !== undefined) payload.title = title.trim();
if (imgAttachmentKey != null) payload.img_attachment_key = imgAttachmentKey;
```

O payload é construído incrementalmente, adicionando apenas os campos que de fato chegaram. Isso é importante porque:

- `title` pode ser `undefined` se o componente não quiser alterar o título (não é o caso atual, mas torna a função reutilizável).
- `imgAttachmentKey` pode ser `null` se o usuário não selecionou nenhuma imagem nessa edição. Usar `!= null` (em vez de `!== null`) descarta tanto `null` quanto `undefined`, evitando enviar uma chave vazia ao backend.

**Nome do campo: `img_attachment_key`**

O backend espera o campo com underscore (`img_attachment_key`). A variável JavaScript usa camelCase (`imgAttachmentKey`). A tradução entre os dois estilos é feita explicitamente aqui, centralizando a diferença na camada de store — os componentes nunca precisam conhecer o nome do campo no backend.

**`return` atualizado**

Substitua `updateTaskTitle` por `updateTask` no objeto retornado no final do store. Componentes que chamavam `updateTaskTitle` precisarão ser atualizados — o `HomeView.vue` é o único, e será ajustado no próximo passo.

??? example "Código completo — src/stores/tasks.js"

    ```javascript title="src/stores/tasks.js" linenums="1"
    import { computed, ref } from 'vue'
    import { defineStore } from 'pinia'
    import tasksApi from '../api/tasksApi.js'

    export const useTasksStore = defineStore('tasks', () => {
      const tasks = ref([])
      const loading = ref(false)
      const error = ref(null)

      const pendingTasks = computed(() => tasks.value.filter((t) => !t.done))
      const completedTasks = computed(() => tasks.value.filter((t) => t.done))

      async function fetchTasks() {
        loading.value = true
        error.value = null
        try {
          const response = await tasksApi.getAll()
          tasks.value = response.data
        } catch (err) {
          error.value = 'Erro ao carregar tarefas.'
          console.error(err)
        } finally {
          loading.value = false
        }
      }

      async function addTask(title) {
        if (!title.trim()) return
        error.value = null
        try {
          const response = await tasksApi.create(title.trim())
          tasks.value.push(response.data)
        } catch (err) {
          error.value = 'Erro ao adicionar tarefa.'
          console.error(err)
        }
      }

      async function toggleTask(id) {
        const task = tasks.value.find((t) => t.id === id)
        if (!task) return
        error.value = null
        try {
          const response = await tasksApi.update(id, { done: !task.done })
          const index = tasks.value.findIndex((t) => t.id === id)
          if (index !== -1) tasks.value[index] = response.data
        } catch (err) {
          error.value = 'Erro ao atualizar tarefa.'
          console.error(err)
        }
      }

      async function removeTask(id) {
        error.value = null
        try {
          await tasksApi.remove(id)
          tasks.value = tasks.value.filter((t) => t.id !== id)
        } catch (err) {
          error.value = 'Erro ao remover tarefa.'
          console.error(err)
        }
      }

      async function updateTask(id, { title, imgAttachmentKey } = {}) {
        if (title !== undefined && !title.trim()) return
        error.value = null
        const payload = {}
        if (title !== undefined) payload.title = title.trim()
        if (imgAttachmentKey != null) payload.img_attachment_key = imgAttachmentKey
        try {
          const response = await tasksApi.update(id, payload)
          const index = tasks.value.findIndex((t) => t.id === id)
          if (index !== -1) tasks.value[index] = response.data
        } catch (err) {
          error.value = 'Erro ao editar tarefa.'
          console.error(err)
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
        updateTask,
      }
    })
    ```

## Resumo do passo

Neste passo, você:

- Renomeou `updateTaskTitle` para `updateTask`
- Adicionou o parâmetro `imgAttachmentKey` ao segundo argumento
- Construiu o payload condicionalmente para não enviar campos desnecessários

---

**Anterior:** [Passo 2 – Método de upload na camada de API](02-api-upload.md) | **Próximo:** [Passo 4 – Atualizando os componentes](04-componentes.md)
