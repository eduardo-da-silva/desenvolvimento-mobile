<template>
  <div class="app">
    <div class="header">
      <h1>Minha Lista de Tarefas</h1>
      <div class="menu">
        <button @click="mode = 'all'">Todas</button>
        <button @click="mode = 'done'">Feitas</button>
        <button @click="mode = 'open'">Abertas</button>
      </div>
    </div>

    <div class="layout">
      <div class="panel">
        <h2>Nova tarefa</h2>
        <input
          class="task-input"
          v-model="newTitle"
          placeholder="Digite a tarefa"
        />
        <div style="margin-top: 6px; display: flex; gap: 6px;">
          <button class="small-btn" @click="addTask">Add</button>
          <button class="small-btn" @click="clearAll">Limpar tudo</button>
        </div>
      </div>

      <div class="panel">
        <h2>Lista</h2>
        <ul class="list">
          <li v-for="task in filtered" :key="task.id">
            <input type="checkbox" v-model="task.done" />
            <span :style="task.done ? 'text-decoration: line-through' : ''">
              {{ task.title }}
            </span>
            <button class="small-btn" @click="removeTask(task.id)">
              X
            </button>
          </li>
        </ul>
        <p v-if="filtered.length === 0" class="bad-empty">
          Sem tarefas. So vai ficando assim mesmo.
        </p>
      </div>
    </div>

    <div class="footer">
      Total: {{ tasks.length }} | Abertas: {{ openCount }} | Feitas: {{ doneCount }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const tasks = ref([
  { id: 1, title: 'Comprar pao e leite', done: false },
  { id: 2, title: 'Estudar para a prova', done: true },
  { id: 3, title: 'Ler mensagens antigas', done: false },
]);

const mode = ref('all');
const newTitle = ref('');

const filtered = computed(() => {
  if (mode.value === 'done') {
    return tasks.value.filter((t) => t.done);
  }
  if (mode.value === 'open') {
    return tasks.value.filter((t) => !t.done);
  }
  return tasks.value;
});

const openCount = computed(() => tasks.value.filter((t) => !t.done).length);
const doneCount = computed(() => tasks.value.filter((t) => t.done).length);

function addTask() {
  if (!newTitle.value.trim()) {
    alert('Digite algo antes de adicionar');
    return;
  }
  tasks.value.push({
    id: Date.now(),
    title: newTitle.value,
    done: false,
  });
  newTitle.value = '';
}

function removeTask(id) {
  tasks.value = tasks.value.filter((t) => t.id !== id);
}

function clearAll() {
  if (!confirm('Tem certeza?')) {
    return;
  }
  tasks.value = [];
}
</script>
