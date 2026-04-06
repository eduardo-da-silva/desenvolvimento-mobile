# Passo 4 – Integrando os componentes

Chegamos ao último passo do tutorial. Agora vamos atualizar os três componentes visuais do app para que utilizem o store Pinia — ao invés do composable `useTasks` que estava diretamente acoplado ao `localStorage`.

Ao fim desta etapa o aplicativo estará totalmente integrado com o backend FastAPI.

---

## 4.1 Atualizando o `HomeView.vue`

`HomeView` é o componente de página que orquestra tudo. Ele precisa:

- Importar o store ao invés do composable
- Chamar `fetchTasks()` ao montar a página (carregamento inicial)
- Exibir mensagens de _loading_ e _erro_
- Repassar eventos de edição de título (funcionalidade nova)

### Código final

```vue title="src/views/HomeView.vue"
<template>
  <div>
    <p v-if="store.error" class="error-message">{{ store.error }}</p>

    <TaskForm
      :editing-task="editingTask"
      @add="handleAdd"
      @update="handleUpdate"
      @cancel="handleCancel"
    />

    <p v-if="store.loading" class="loading-message">Carregando tarefas...</p>

    <template v-else>
      <section v-if="store.pendingTasks.length > 0">
        <h2 class="section-title">
          Pendentes ({{ store.pendingTasks.length }})
        </h2>
        <TaskItem
          v-for="task in store.pendingTasks"
          :key="task.id"
          :task="task"
          @toggle="handleToggle"
          @remove="handleRemove"
          @edit="handleEdit"
        />
      </section>

      <section v-if="store.completedTasks.length > 0">
        <h2 class="section-title">
          Concluídas ({{ store.completedTasks.length }})
        </h2>
        <TaskItem
          v-for="task in store.completedTasks"
          :key="task.id"
          :task="task"
          @toggle="handleToggle"
          @remove="handleRemove"
          @edit="handleEdit"
        />
      </section>

      <p v-if="store.tasks.length === 0" class="empty-message">
        Nenhuma tarefa cadastrada. Adicione uma acima.
      </p>
    </template>

    <InstallButton />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TaskForm from '../components/TaskForm.vue';
import TaskItem from '../components/TaskItem.vue';
import InstallButton from '../components/InstallButton.vue';
import { useTasksStore } from '../stores/tasks.js';

const store = useTasksStore();
const editingTask = ref(null);

onMounted(() => {
  store.fetchTasks();
});

function handleAdd(title) {
  store.addTask(title);
}

function handleUpdate(id, title) {
  store.updateTaskTitle(id, title);
  editingTask.value = null;
}

function handleCancel() {
  editingTask.value = null;
}

function handleEdit(task) {
  editingTask.value = task;
}

function handleToggle(id) {
  store.toggleTask(id);
}

function handleRemove(id) {
  if (editingTask.value?.id === id) editingTask.value = null;
  store.removeTask(id);
}
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

.error-message {
  color: #c0392b;
  background-color: #fdecea;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.loading-message {
  color: #666;
  font-size: 0.9rem;
  padding: 8px 0;
}
</style>
```

### O que mudou em relação à versão anterior

| Antes (`useTasks`)                                      | Agora (`useTasksStore`)                              |
| ------------------------------------------------------- | ---------------------------------------------------- |
| `import { useTasks } from '../composables/useTasks.js'` | `import { useTasksStore } from '../stores/tasks.js'` |
| `const { tasks, ... } = useTasks()`                     | `const store = useTasksStore()`                      |
| Sem carregamento inicial                                | `onMounted(() => store.fetchTasks())`                |
| Sem estados de loading/erro                             | `v-if="store.loading"` e `v-if="store.error"`        |
| Sem edição de título                                    | `editingTask ref` + handlers de edição               |
| `@edit` ausente no `TaskItem`                           | `@edit="handleEdit"` em ambas as listas              |

---

## 4.2 Atualizando o `TaskItem.vue`

`TaskItem` exibe uma tarefa individual. Precisamos adicionar o botão **Editar** ao lado do botão **Remover**, agrupados em um `div.task-actions`.

```vue title="src/components/TaskItem.vue"
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
    <div class="task-actions">
      <button class="task-edit" @click="$emit('edit', task)">Editar</button>
      <button class="task-remove" @click="$emit('remove', task.id)">
        Remover
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
});

defineEmits(['toggle', 'remove', 'edit']);
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

.task-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.task-edit {
  background: none;
  border: none;
  color: #4a90d9;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
}

.task-edit:hover {
  text-decoration: underline;
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

Pontos de atenção:

- O botão **Editar** emite o evento `edit` passando o objeto **tarefa inteiro** (`task`), não apenas o `id`. Isso permite que o formulário pré-carregue o título.
- O `defineEmits` agora declara três eventos: `toggle`, `remove` e `edit`.
- O `div.task-actions` agrupa os dois botões para facilitar o alinhamento via flexbox.

---

## 4.3 Atualizando o `TaskForm.vue`

`TaskForm` precisa receber a tarefa que está sendo editada via prop, pré-carregar o título no campo de texto e mudar o rótulo do botão de envio.

```vue title="src/components/TaskForm.vue"
<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <input
      v-model="newTask"
      type="text"
      placeholder="Nova tarefa..."
      class="task-input"
    />
    <button type="submit" class="task-button">
      {{ editingTask ? 'Alterar' : 'Adicionar' }}
    </button>
    <button
      v-if="editingTask"
      type="button"
      class="task-button-cancel"
      @click="handleCancel"
    >
      Cancelar
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  editingTask: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['add', 'update', 'cancel']);
const newTask = ref('');

watch(
  () => props.editingTask,
  (task) => {
    newTask.value = task ? task.title : '';
  },
);

function handleSubmit() {
  if (!newTask.value.trim()) return;
  if (props.editingTask) {
    emit('update', props.editingTask.id, newTask.value.trim());
  } else {
    emit('add', newTask.value.trim());
  }
  newTask.value = '';
}

function handleCancel() {
  newTask.value = '';
  emit('cancel');
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

.task-button-cancel {
  padding: 12px 16px;
  background-color: transparent;
  color: #666;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s;
}

.task-button-cancel:hover {
  border-color: #aaa;
  color: #333;
}
</style>
```

### Como funciona o modo de edição

```
Usuário clica "Editar"
        │
        ▼
TaskItem emite @edit(task)
        │
        ▼
HomeView salva em editingTask.value
        │
        ▼
TaskForm recebe :editing-task="editingTask"
        │
        ▼
watch() detecta mudança → preenche o input com task.title
        │
        ▼
Botão muda para "Alterar" + aparece "Cancelar"
        │
     ┌──┴──┐
Envio    Cancelar
  │          │
  ▼          ▼
emit('update')  emit('cancel')
  │          │
  ▼          ▼
HomeView    HomeView
updateTask  editingTask = null
```

---

## 4.4 Verificando o fluxo completo

Com todos os arquivos salvos, o fluxo de dados na aplicação é:

```
[Interface do usuário]
        │
        ▼
[Componentes Vue]         TaskForm / TaskItem / HomeView
        │
        ▼
[Store Pinia]             src/stores/tasks.js
        │
        ▼
[Camada de API]           src/api/tasksApi.js + src/api/config.js
        │
        ▼
[Backend FastAPI]         localhost:8001
        │
        ▼
[Banco de dados SQLite]   tasks.db
```

Cada camada tem uma responsabilidade única. Os componentes nunca falam diretamente com o `axios` — isso é papel do store e da camada de API.

---

## 4.5 Checklist de testes

Antes de considerar a integração completa, verifique cada ponto abaixo:

- [ ] **Backend rodando**: `docker run -p 8001:8001 registro-atividades-backend` (ou `uvicorn main:app --port 8001` localmente)
- [ ] **Frontend rodando**: `npm run dev` no diretório `registro-atividades-pwa`
- [ ] **Carregamento inicial**: ao abrir o app, as tarefas existentes no banco aparecem na tela
- [ ] **Adicionar tarefa**: digitar um título e clicar "Adicionar" → tarefa aparece na lista "Pendentes"
- [ ] **Marcar como concluída**: clicar no checkbox → tarefa migra para "Concluídas"
- [ ] **Editar título**: clicar "Editar" → título carrega no input → alterar → clicar "Alterar" → título atualizado na lista
- [ ] **Cancelar edição**: clicar "Editar" → clicar "Cancelar" → formulário volta ao estado normal
- [ ] **Remover tarefa**: clicar "Remover" → tarefa some da lista
- [ ] **Persistência**: recarregar a página → tarefas continuam aparecendo (dados vêm do banco, não do localStorage)
- [ ] **Swagger**: acessar [http://localhost:8001/docs](http://localhost:8001/docs) → confirmar os 4 endpoints

---

## Resumo do tutorial

Ao longo dos 4 passos deste tutorial você:

1. **Instalou as dependências** (`axios` e `pinia`) e subiu o backend com Docker
2. **Criou a camada de acesso à API** (`api/config.js` + `api/tasksApi.js`), isolando o `axios` do resto do app
3. **Criou o store Pinia** (`stores/tasks.js`), centralizando o estado e a lógica de negócio
4. **Atualizou os componentes** para consumir o store e suportar a edição de título

O resultado é uma arquitetura em três camadas, extensível e fácil de testar — a mesma usada em aplicações Vue.js profissionais.

---

**Anterior:** [3. Store com Pinia](03-pinia-store.md) | **Próximo:** [Atividades práticas](../atividades-praticas.md)
