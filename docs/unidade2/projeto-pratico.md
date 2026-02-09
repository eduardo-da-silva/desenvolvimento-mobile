# 7. Projeto prático: App de Registro com Vue.js

## Objetivo

Criar uma aplicação completa de registro de atividades usando Vue.js 3, Vue Router e todos os conceitos aprendidos nesta unidade.

**Funcionalidades:**

- ✅ Tela inicial (Home)
- ✅ Lista de registros
- ✅ Criação de novo registro
- ✅ Visualização de detalhes
- ✅ Edição de registro
- ✅ Exclusão de registro

**Tecnologias:**

- Vue.js 3 com Composition API
- Vue Router para navegação
- LocalStorage para persistência
- CSS mobile-first

## Passo 1: Criar o projeto

```bash
npm create vue@latest registro-atividades-vue
cd registro-atividades-vue
npm install
npm install vue-router@4 # Caso não tenha escolhido o Router na instalação.
```

## Passo 2: Configurar estrutura de pastas

Crie a seguinte estrutura:

```
src/
├─ assets/
│  └─ css/
│     └─ global.css
├─ components/
│  ├─ layout/
│  │  └─ AppHeader.vue
│  ├─ forms/
│  │  ├─ AppInput.vue
│  │  └─ AppButton.vue
│  └─ records/
│     └─ RecordCard.vue
├─ views/
│  ├─ HomeView.vue
│  ├─ RecordsView.vue
│  ├─ RecordDetailView.vue
│  └─ RecordFormView.vue
├─ composables/
│  └─ useRecords.js
├─ router/
│  └─ index.js
├─ App.vue
└─ main.js
```

## Passo 3: Configurar estilos globais

```css title="./src/assets/css/global.css" linenums="1"
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
  background: #f4f4f6;
  color: #111;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
}

/* Espaçamento para conteúdo abaixo do header fixo */
.page {
  padding: 72px 16px 16px;
  max-width: 600px;
  margin: 0 auto;
}
```

## Passo 4: Criar composable de gerenciamento

```javascript title="./src/composables/useRecords.js" linenums="1"
import { ref, computed } from 'vue';

// Estado global compartilhado entre componentes
const records = ref([]);

// Nome da chave para LocalStorage
const STORAGE_KEY = 'records';

function loadFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    records.value = JSON.parse(stored);
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value));
}

// Carrega dados ao importar o composable
loadFromStorage();

export function useRecords() {
  const totalRecords = computed(() => records.value.length);
  const totalDuration = computed(() => {
    return records.value.reduce((sum, r) => sum + r.duration, 0);
  });

  function addRecord(record) {
    const newRecord = {
      id: Date.now(),
      ...record,
      createdAt: new Date().toISOString(),
    };
    records.value.unshift(newRecord); // Adiciona no início
    saveToStorage();
    return newRecord;
  }

  function getRecord(id) {
    return records.value.find((r) => r.id === parseInt(id));
  }

  function updateRecord(id, updates) {
    const index = records.value.findIndex((r) => r.id === parseInt(id));
    if (index !== -1) {
      records.value[index] = {
        ...records.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage();
      return records.value[index];
    }
    return null;
  }

  function deleteRecord(id) {
    records.value = records.value.filter((r) => r.id !== parseInt(id));
    saveToStorage();
  }

  return {
    // Estado
    records,

    // Computed
    totalRecords,
    totalDuration,

    // Métodos
    addRecord,
    getRecord,
    updateRecord,
    deleteRecord,
  };
}
```

## Passo 5: Criar componentes reutilizáveis

```vue title="./src/components/layout/AppHeader.vue" linenums="1"
<script setup>
defineProps({
  title: {
    type: String,
    default: 'Meu App',
  },
  showBack: Boolean,
});

defineEmits(['back']);
</script>

<template>
  <header class="app-header">
    <button v-if="showBack" @click="$emit('back')" class="btn-back">←</button>
    <h1>{{ title }}</h1>
    <div class="spacer"></div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #0b5cff;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.btn-back {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  margin-right: 8px;
}

.app-header h1 {
  font-size: 18px;
  font-weight: 600;
  flex: 1;
}

.spacer {
  width: 40px; /* Espaço para balancear o botão de voltar */
}
</style>
```

```vue title="./src/components/forms/AppInput.vue" linenums="1"
<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  required: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <div class="app-input">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      class="input"
    />
  </div>
</template>

<style scoped>
.app-input {
  margin-bottom: 16px;
}

.label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #ff4444;
}

.input {
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #0b5cff;
}
</style>
```

```vue title="./src/components/forms/AppButton.vue" linenums="1"
<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary', // primary, secondary, danger
  },
  disabled: Boolean,
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['app-button', `variant-${variant}`]"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.app-button {
  width: 100%;
  min-height: 48px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;
}

.app-button:active {
  transform: scale(0.98);
}

.app-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.variant-primary {
  background: #0b5cff;
  color: white;
}

.variant-secondary {
  background: #f0f0f0;
  color: #333;
}

.variant-danger {
  background: #ff4444;
  color: white;
}
</style>
```

```vue title="./src/components/records/RecordCard.vue" linenums="1"
<script setup>
defineProps({
  title: String,
  duration: Number,
  date: String,
});
</script>

<template>
  <div class="record-card">
    <h3 class="title">{{ title }}</h3>
    <div class="meta">
      <span class="duration">⏱️ {{ duration }} min</span>
      <span class="date">📅 {{ date }}</span>
    </div>
  </div>
</template>

<style scoped>
.record-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: transform 0.1s;
  cursor: pointer;
}

.record-card:active {
  transform: scale(0.98);
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111;
}

.meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}
</style>
```

## Passo 6: Criar Views

```vue title="./src/views/HomeView.vue" linenums="1"
<script setup>
import { RouterLink } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import { useRecords } from '@/composables/useRecords';

const { totalRecords, totalDuration } = useRecords();
</script>

<template>
  <div>
    <AppHeader title="Registro de Atividades" />

    <div class="page">
      <div class="hero">
        <h2>Bem-vindo!</h2>
        <p>Registre e acompanhe suas atividades diárias</p>
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">{{ totalRecords }}</div>
          <div class="stat-label">Registros</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalDuration }}</div>
          <div class="stat-label">Minutos</div>
        </div>
      </div>

      <nav class="menu">
        <RouterLink to="/records" class="menu-item">
          📋 Ver registros
        </RouterLink>
        <RouterLink to="/records/new/edit" class="menu-item">
          ➕ Novo registro
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 32px;
}

.hero h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.hero p {
  color: #666;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #0b5cff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
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

```vue title="./src/views/RecordsView.vue" linenums="1"
<script setup>
import { RouterLink, useRouter } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import RecordCard from '@/components/records/RecordCard.vue';
import { useRecords } from '@/composables/useRecords';

const router = useRouter();
const { records } = useRecords();

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('pt-BR');
}
</script>

<template>
  <div>
    <AppHeader title="Meus Registros" show-back @back="router.push('/')" />

    <div class="page">
      <div v-if="records.length > 0" class="list">
        <RouterLink
          v-for="record in records"
          :key="record.id"
          :to="`/records/${record.id}`"
          class="link"
        >
          <RecordCard
            :title="record.title"
            :duration="record.duration"
            :date="formatDate(record.createdAt)"
          />
        </RouterLink>
      </div>

      <div v-else class="empty">
        <p>📭</p>
        <p>Nenhum registro ainda</p>
        <RouterLink to="/records/new/edit" class="btn">
          Criar primeiro registro
        </RouterLink>
      </div>

      <RouterLink to="/records/new/edit" class="fab"> + </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link {
  text-decoration: none;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty p:first-child {
  font-size: 48px;
  margin-bottom: 16px;
}

.btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background: #0b5cff;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #0b5cff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.fab:active {
  transform: scale(0.9);
}
</style>
```

```vue title="./src/views/RecordFormView.vue" linenums="1"
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppInput from '@/components/forms/AppInput.vue';
import AppButton from '@/components/forms/AppButton.vue';
import { useRecords } from '@/composables/useRecords';

const router = useRouter();
const route = useRoute();
const { addRecord, getRecord, updateRecord } = useRecords();

const isEditMode = computed(() => route.params.id !== 'new');

const form = ref({
  title: '',
  duration: '',
  notes: '',
});

onMounted(() => {
  if (isEditMode.value) {
    const record = getRecord(route.params.id);
    if (record) {
      form.value = {
        title: record.title,
        duration: record.duration,
        notes: record.notes || '',
      };
    } else {
      router.push('/records');
    }
  }
});

function handleSubmit() {
  if (!form.value.title || !form.value.duration) {
    alert('Preencha os campos obrigatórios');
    return;
  }

  if (isEditMode.value) {
    updateRecord(route.params.id, form.value);
  } else {
    addRecord(form.value);
  }

  router.push('/records');
}
</script>

<template>
  <div>
    <AppHeader
      :title="isEditMode ? 'Editar Registro' : 'Novo Registro'"
      show-back
      @back="router.back()"
    />

    <div class="page">
      <form @submit.prevent="handleSubmit" class="form">
        <AppInput
          v-model="form.title"
          label="Título"
          placeholder="Ex: Estudar Vue.js"
          required
        />

        <AppInput
          v-model.number="form.duration"
          label="Duração (minutos)"
          type="number"
          placeholder="Ex: 60"
          required
        />

        <div class="textarea-group">
          <label class="label">Observações</label>
          <textarea
            v-model="form.notes"
            rows="4"
            class="textarea"
            placeholder="Adicione observações sobre a atividade..."
          ></textarea>
        </div>

        <AppButton type="submit">
          {{ isEditMode ? 'Salvar alterações' : 'Criar registro' }}
        </AppButton>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form {
  background: white;
  padding: 20px;
  border-radius: 12px;
}

.textarea-group {
  margin-bottom: 16px;
}

.label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.textarea {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.textarea:focus {
  outline: none;
  border-color: #0b5cff;
}
</style>
```

```vue title="./src/views/RecordDetailView.vue" linenums="1"
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppButton from '@/components/forms/AppButton.vue';
import { useRecords } from '@/composables/useRecords';

const router = useRouter();
const route = useRoute();
const { getRecord, deleteRecord } = useRecords();

const record = ref(null);

onMounted(() => {
  record.value = getRecord(route.params.id);
  if (!record.value) {
    router.push('/records');
  }
});

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function handleEdit() {
  router.push(`/records/${route.params.id}/edit`);
}

function handleDelete() {
  if (confirm('Deseja realmente excluir este registro?')) {
    deleteRecord(route.params.id);
    router.push('/records');
  }
}
</script>

<template>
  <div v-if="record">
    <AppHeader title="Detalhes" show-back @back="router.back()" />

    <div class="page">
      <div class="card">
        <h1 class="title">{{ record.title }}</h1>

        <div class="info">
          <div class="info-item">
            <span class="label">⏱️ Duração:</span>
            <span class="value">{{ record.duration }} minutos</span>
          </div>
          <div class="info-item">
            <span class="label">📅 Data:</span>
            <span class="value">{{ formatDate(record.createdAt) }}</span>
          </div>
        </div>

        <div v-if="record.notes" class="notes">
          <h3>Observações</h3>
          <p>{{ record.notes }}</p>
        </div>

        <div class="actions">
          <AppButton @click="handleEdit"> Editar </AppButton>
          <AppButton variant="danger" @click="handleDelete">
            Excluir
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.info {
  margin-bottom: 24px;
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

.value {
  color: #111;
}

.notes {
  margin-bottom: 24px;
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
}

.notes h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #666;
}

.notes p {
  line-height: 1.6;
  color: #111;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
```

## Passo 7: Configurar rotas

```javascript title="./src/router/index.js" linenums="1"
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/records',
    name: 'records',
    component: () => import('@/views/RecordsView.vue'),
  },
  {
    path: '/records/:id',
    name: 'record-detail',
    component: () => import('@/views/RecordDetailView.vue'),
  },
  {
    path: '/records/:id/edit',
    name: 'record-edit',
    component: () => import('@/views/RecordFormView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

## Passo 8: Configurar App.vue e main.js

```vue title="./src/App.vue" linenums="1"
<script setup>
// Não precisa de lógica aqui
</script>

<template>
  <RouterView />
</template>

<style>
@import './assets/css/global.css';
</style>
```

```javascript title="./src/main.js" linenums="1"
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
```

## Passo 9: Executar o projeto

```bash
npm run dev -- --host
```

Abra http://localhost:5173/ e teste todas as funcionalidades! Para acessar a partir do celular, use o IP da sua máquina que está aparecendo no terminal

## Funcionalidades implementadas

✅ **CRUD completo:**

- Create: criar novos registros
- Read: listar e visualizar detalhes
- Update: editar registros existentes
- Delete: excluir registros

✅ **Navegação fluida:**

- Transições entre páginas
- Botões de voltar
- FAB (Floating Action Button)

✅ **Persistência:**

- Dados salvos no localStorage
- Sobrevivem ao recarregar a página

✅ **UX mobile:**

- Interface mobile-first
- Feedback visual em toques
- Elementos com tamanho adequado

## Melhorias sugeridas (desafios)

1. **Adicionar categorias:** permita categorizar as atividades
2. **Filtros e busca:** filtre por data, duração ou categoria
3. **Estatísticas:** gráficos de tempo por atividade
4. **Dark mode:** tema escuro opcional
5. **Validações:** mensagens de erro mais amigáveis
6. **Animações:** transições suaves entre rotas

## Resumo

Neste projeto você aplicou:

- ✅ Criação de projeto Vue.js 3 com Vite
- ✅ Composition API (ref, reactive, computed)
- ✅ Componentes reutilizáveis organizados
- ✅ Comunicação via props e eventos
- ✅ Vue Router para navegação
- ✅ Composables para lógica reutilizável
- ✅ LocalStorage para persistência
- ✅ Organização profissional do código

**Próximos passos (Unidade 3):**

- Gerenciamento de estado global com Pinia
- Integração com API backend
- Transformação em PWA

---

**Anterior:** [Vue Router](vue-router.md) | **Voltar ao início:** [Unidade 2](index.md)
