# 4. Views (Páginas)

## Objetivo

Nesta etapa, vamos criar as páginas (views) da aplicação. Cada view representa uma rota e utiliza os componentes reutilizáveis para construir a interface completa.

## Views que Criaremos

1. **HomeView**: Página inicial com estatísticas e menu
2. **RecordsView**: Listagem de todos os registros
3. **RecordDetailView**: Detalhes completos de um registro
4. **RecordFormView**: Formulário para criar/editar registros

---

## 1. HomeView - Página Inicial

### Código completo

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

### Pontos relevantes

#### Uso do composable (linhas 2-6)

```javascript
import { useRecords } from '@/composables/useRecords';

const { totalRecords, totalDuration } = useRecords();
```

Desestrutura apenas o que precisa do composable. As propriedades computadas são reativas e atualizam automaticamente quando os dados mudam.

#### Estatísticas em tempo real (linhas 19-28)

```vue
<div class="stat-value">{{ totalRecords }}</div>
<div class="stat-value">{{ totalDuration }}</div>
```

Exibe contadores que refletem o estado atual dos registros. Como usam `computed`, atualizam automaticamente quando registros são adicionados/removidos.

#### Grid layout para cards (linhas 55-59)

```css
.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
```

CSS Grid cria layout de duas colunas iguais, responsivo e sem necessidade de media queries.

---

## 2. RecordsView - Listagem de Registros

### Código completo

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

### Pontos relevantes

#### Renderização condicional (linhas 20-40)

```vue
<div v-if="records.length > 0" class="list">
  <!-- Lista de registros -->
</div>

<div v-else class="empty">
  <!-- Mensagem de lista vazia -->
</div>
```

Exibe lista se houver registros, caso contrário mostra mensagem amigável incentivando criar o primeiro registro.

#### v-for com RouterLink (linhas 21-32)

```vue
<RouterLink
  v-for="record in records"
  :key="record.id"
  :to="`/records/${record.id}`"
  class="link"
>
  <RecordCard ... />
</RouterLink>
```

Cada card é clicável e navega para página de detalhes. O `:key` é essencial para performance do Vue ao renderizar listas.

#### FAB - Floating Action Button (linhas 42 e 81-100)

```vue
<RouterLink to="/records/new/edit" class="fab"> + </RouterLink>
```

Botão flutuante fixo no canto inferior direito, padrão comum em apps mobile para ação primária.

#### Formatação de data (linhas 10-12)

```javascript
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('pt-BR');
}
```

Converte data ISO (2024-01-15T10:30:00.000Z) para formato brasileiro (15/01/2024).

---

## 3. RecordDetailView - Detalhes do Registro

### Código completo

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

### Pontos relevantes

#### Carregamento de dados no ciclo de vida (linhas 14-18)

```javascript
onMounted(() => {
  record.value = getRecord(route.params.id);
  if (!record.value) {
    router.push('/records');
  }
});
```

- `onMounted`: Hook executado quando componente é montado
- Busca registro pelo ID da rota
- Se não encontrar, redireciona para listagem (proteção contra IDs inválidos)

#### Parâmetros de rota (linha 9)

```javascript
const route = useRoute();
// Acessa ID da URL: /records/123 → route.params.id = "123"
```

`useRoute()` fornece acesso aos parâmetros da rota atual.

#### Confirmação de exclusão (linhas 33-37)

```javascript
function handleDelete() {
  if (confirm('Deseja realmente excluir este registro?')) {
    deleteRecord(route.params.id);
    router.push('/records');
  }
}
```

Usa `confirm()` nativo do navegador para confirmar ação destrutiva antes de executar.

#### Renderização condicional v-if (linha 41)

```vue
<div v-if="record">
```

Aguarda carregamento do registro antes de renderizar. Evita erro ao tentar acessar propriedades de `null`.

---

## 4. RecordFormView - Formulário de Registro

### Código completo

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

### Pontos relevantes

#### Modo de edição vs. criação (linha 13)

```javascript
const isEditMode = computed(() => route.params.id !== 'new');
```

- URL `/records/new/edit` → `id = 'new'` → Modo criação
- URL `/records/123/edit` → `id = '123'` → Modo edição

Um único componente serve para ambos os casos.

#### Carregamento de dados existentes (linhas 21-34)

```javascript
onMounted(() => {
  if (isEditMode.value) {
    const record = getRecord(route.params.id);
    if (record) {
      form.value = { ...record };
    } else {
      router.push('/records');
    }
  }
});
```

No modo edição, carrega dados do registro e preenche formulário.

#### Modificador .number no v-model (linha 68)

```vue
<AppInput v-model.number="form.duration" type="number" />
```

`.number` converte automaticamente valor de string para número. Essencial para campos numéricos.

#### Validação simples (linhas 36-40)

```javascript
function handleSubmit() {
  if (!form.value.title || !form.value.duration) {
    alert('Preencha os campos obrigatórios');
    return;
  }
  // ...
}
```

Valida campos obrigatórios antes de salvar. Em produção, seria melhor usar biblioteca de validação.

#### Prevenção de submit padrão (linha 60)

```vue
<form @submit.prevent="handleSubmit">
```

`.prevent` chama `event.preventDefault()`, evitando reload da página no submit do formulário.

---

## Conceitos Aplicados

### ✅ Composition API

- `ref()` para estado local
- `computed()` para valores derivados
- `onMounted()` para lifecycle hooks

### ✅ Vue Router

- `useRouter()` para navegação programática
- `useRoute()` para acessar parâmetros
- `RouterLink` para navegação declarativa

### ✅ Composables

- Integração com `useRecords()`
- Estado compartilhado entre views

### ✅ Formulários

- v-model bidirecional
- Validação de campos
- Submit handling

### ✅ UX Mobile

- FAB para ação primária
- Feedback visual em interações
- Estados vazios com mensagens amigáveis

## Próximos Passos

Com as views implementadas, precisamos configurar o Vue Router para definir as rotas e permitir navegação entre páginas.

**[← Voltar: Componentes](03-componentes.md)** | **[Próximo: Configuração de Rotas →](05-router.md)**
