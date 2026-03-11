# 4. Comunicação entre componentes: props e eventos

## Fluxo de dados no Vue.js

No Vue, a comunicação entre componentes segue um padrão claro:

```
        Props (dados) ↓
    ┌──────────────────────┐
    │  Componente Pai      │
    └──────────────────────┘
            ↓ props
            ↓
    ┌──────────────────────┐
    │  Componente Filho    │
    └──────────────────────┘
            ↑ eventos
            ↑
        Eventos ↑
```

- **Props:** pai passa dados para filho (fluxo descendente)
- **Eventos:** filho comunica mudanças para pai (fluxo ascendente)

Este padrão é chamado de **one-way data flow** (fluxo de dados unidirecional).

## Props: passando dados do pai para o filho

Props são como parâmetros de função — você passa dados para customizar o comportamento do componente.

### Definindo props

```vue
<!-- RecordCard.vue -->
<script setup>
defineProps({
  title: String,
  duration: Number,
  date: String,
});
</script>

<template>
  <div class="record-card">
    <h3>{{ title }}</h3>
    <p>Duração: {{ duration }} min</p>
    <p>Data: {{ date }}</p>
  </div>
</template>
```

### Usando o componente com props

```vue
<!-- App.vue -->
<script setup>
import RecordCard from './components/RecordCard.vue';
</script>

<template>
  <RecordCard title="Estudar Vue.js" :duration="60" date="2026-02-06" />
</template>
```

**Observações:**

- Props string: sem `:` → `title="texto"`
- Props dinâmicas: com `:` → `:duration="60"`
- Props de variáveis: `:title="variavel"`

### Props com validação completa

```vue
<script setup>
defineProps({
  // Tipo simples
  title: String,

  // Com valor padrão
  duration: {
    type: Number,
    default: 0,
  },

  // Obrigatória
  id: {
    type: [String, Number],
    required: true,
  },

  // Com validação customizada
  status: {
    type: String,
    default: 'pending',
    validator: (value) => {
      return ['pending', 'completed', 'cancelled'].includes(value);
    },
  },
});
</script>
```

### Props com múltiplos tipos

```vue
<script setup>
defineProps({
  // Aceita string ou número
  id: [String, Number],

  // Aceita objeto ou null
  user: [Object, null],
});
</script>
```

## Eventos: filho notifica o pai

Quando algo acontece no componente filho, ele emite um evento que o pai pode escutar.

### Emitindo eventos

```vue
<!-- AppButton.vue -->
<script setup>
// Declara quais eventos o componente pode emitir
const emit = defineEmits(['click', 'longPress']);

function handleClick() {
  // Emite o evento
  emit('click');
}

function handleLongPress() {
  emit('longPress');
}
</script>

<template>
  <button
    @click="handleClick"
    @mousedown.prevent="handleLongPress"
    class="app-button"
  >
    <slot></slot>
  </button>
</template>
```

### Escutando eventos no pai

```vue
<!-- App.vue -->
<script setup>
import AppButton from './components/AppButton.vue';

function handleClick() {
  console.log('Botão clicado!');
}

function handleLongPress() {
  console.log('Botão pressionado!');
}
</script>

<template>
  <AppButton @click="handleClick" @longPress="handleLongPress">
    Clique ou segure
  </AppButton>
</template>
```

### Emitindo eventos com dados (payload)

```vue
<!-- RecordCard.vue -->
<script setup>
const props = defineProps({
  id: Number,
  title: String,
});

const emit = defineEmits(['delete', 'edit']);

function handleDelete() {
  // Emite evento com o ID
  emit('delete', props.id);
}

function handleEdit() {
  emit('edit', { id: props.id, title: props.title });
}
</script>

<template>
  <div class="record-card">
    <h3>{{ title }}</h3>
    <button @click="handleEdit">Editar</button>
    <button @click="handleDelete">Excluir</button>
  </div>
</template>
```

### Recebendo dados do evento

```vue
<!-- App.vue -->
<script setup>
import RecordCard from './components/RecordCard.vue';

function handleDelete(id) {
  console.log('Deletar registro:', id);
  // Lógica de exclusão
}

function handleEdit(data) {
  console.log('Editar registro:', data.id, data.title);
  // Lógica de edição
}
</script>

<template>
  <RecordCard
    :id="1"
    title="Estudar Vue"
    @delete="handleDelete"
    @edit="handleEdit"
  />
</template>
```

## v-model: two-way binding simplificado

O `v-model` é um atalho para props + eventos.

### Como funciona por baixo dos panos

Quando você escreve:

```vue
<AppInput v-model="name" />
```

Vue traduz para:

```vue
<AppInput :modelValue="name" @update:modelValue="name = $event" />
```

### Implementando v-model em componente customizado

```vue
<!-- AppInput.vue -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

// Computed para facilitar o uso de v-model interno
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <input v-model="value" type="text" class="app-input" />
</template>
```

### Usando

```vue
<script setup>
import { ref } from 'vue';
import AppInput from './components/AppInput.vue';

const name = ref('');
</script>

<template>
  <AppInput v-model="name" />
  <p>Nome: {{ name }}</p>
</template>
```

## Exemplo completo: lista de tarefas

Vamos juntar tudo em um exemplo prático.

### `TaskItem.vue` (componente filho)

```vue
<script setup>
defineProps({
  id: Number,
  text: String,
  completed: Boolean,
});

const emit = defineEmits(['toggle', 'delete']);
</script>

<template>
  <div class="task-item" :class="{ completed }">
    <input type="checkbox" :checked="completed" @change="emit('toggle', id)" />
    <span class="text">{{ text }}</span>
    <button @click="emit('delete', id)" class="btn-delete">🗑️</button>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
}

.task-item.completed .text {
  text-decoration: line-through;
  color: #999;
}

.text {
  flex: 1;
}

.btn-delete {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
```

### `App.vue` (componente pai)

```vue
<script setup>
import { ref } from 'vue';
import TaskItem from './components/TaskItem.vue';

const tasks = ref([
  { id: 1, text: 'Estudar Vue.js', completed: false },
  { id: 2, text: 'Fazer exercícios', completed: true },
  { id: 3, text: 'Criar projeto', completed: false },
]);

const newTask = ref('');

function addTask() {
  if (newTask.value.trim()) {
    tasks.value.push({
      id: Date.now(),
      text: newTask.value,
      completed: false,
    });
    newTask.value = '';
  }
}

function toggleTask(id) {
  const task = tasks.value.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
  }
}

function deleteTask(id) {
  tasks.value = tasks.value.filter((t) => t.id !== id);
}
</script>

<template>
  <div class="app">
    <h1>Minhas Tarefas</h1>

    <div class="add-task">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Nova tarefa..."
      />
      <button @click="addTask">Adicionar</button>
    </div>

    <div class="tasks">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :id="task.id"
        :text="task.text"
        :completed="task.completed"
        @toggle="toggleTask"
        @delete="deleteTask"
      />
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-task {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.add-task input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
}

.add-task button {
  padding: 12px 24px;
  background: #0b5cff;
  color: white;
  border: none;
  border-radius: 8px;
}
</style>
```

## Padrões avançados

### 1. Props com desestruturação

```vue
<script setup>
const { title, duration = 0 } = defineProps({
  title: String,
  duration: Number,
});

// Agora pode usar direto: title, duration
</script>
```

### 2. Múltiplos v-models

```vue
<!-- UserForm.vue -->
<script setup>
defineProps({
  firstName: String,
  lastName: String,
});

defineEmits(['update:firstName', 'update:lastName']);
</script>

<template>
  <input
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

Uso:

```vue
<UserForm v-model:firstName="user.firstName" v-model:lastName="user.lastName" />
```

### 3. Event validation

```vue
<script setup>
const emit = defineEmits({
  // Validação simples
  click: null,

  // Com validação
  submit: (payload) => {
    if (payload.email && payload.password) {
      return true;
    }
    console.warn('Email e senha são obrigatórios');
    return false;
  },
});
</script>
```

## Boas práticas

### Fazer

- Validar props sempre
- Usar nomes descritivos para eventos
- Documentar props complexas
- Manter componentes pequenos e focados
- Emitir eventos específicos (não reutilizar nomes genéricos)

### Evitar

- Modificar props diretamente no filho
- Emitir muitos eventos do mesmo componente
- Props muito complexas (objetos aninhados)
- Lógica de negócio em componentes de apresentação

## Resumo

Nesta seção você aprendeu:

- Props passam dados de pai para filho
- Eventos comunicam mudanças de filho para pai
- v-model é um atalho para props + eventos
- Como validar props e eventos
- Padrões de comunicação entre componentes

Na próxima seção, vamos ver como **organizar um projeto mobile** com Vue.js.

---

**Anterior:** [Componentes reutilizáveis](componentes-reutilizaveis.md) | **Próximo:** [Organização de projeto](organizacao-projeto.md)
