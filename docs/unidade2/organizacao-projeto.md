# 5. Organização de projeto mobile

## Por que organização importa?

Em aplicações mobile, você lidará com:

- Múltiplas telas (views)
- Dezenas de componentes reutilizáveis
- Lógica compartilhada (composables)
- Integrações com APIs
- Gerenciamento de estado

Sem organização clara, o projeto vira um caos rapidamente.

## Estrutura recomendada

### Estrutura básica (projeto pequeno)

```
src/
├─ assets/              # Recursos estáticos
│  ├─ css/
│  │  └─ global.css
│  ├─ images/
│  └─ icons/
├─ components/          # Componentes reutilizáveis
│  ├─ layout/
│  │  ├─ AppHeader.vue
│  │  └─ AppFooter.vue
│  ├─ forms/
│  │  ├─ AppInput.vue
│  │  └─ AppButton.vue
│  └─ cards/
│     └─ RecordCard.vue
├─ views/               # Páginas/telas
│  ├─ HomeView.vue
│  ├─ RecordsView.vue
│  └─ RecordDetailView.vue
├─ router/              # Configuração de rotas
│  └─ index.js
├─ App.vue             # Componente raiz
└─ main.js             # Ponto de entrada
```

### Estrutura avançada (projeto médio/grande)

```
src/
├─ assets/
├─ components/          # Componentes reutilizáveis
│  ├─ layout/
│  ├─ forms/
│  └─ cards/
├─ views/               # Telas principais
├─ composables/         # Lógica reutilizável (Composition API)
│  ├─ useAuth.js
│  ├─ useRecords.js
│  └─ useLocalStorage.js
├─ services/            # Integrações externas
│  ├─ api.js
│  └─ storage.js
├─ stores/              # Estado global (Pinia)
│  └─ recordsStore.js
├─ router/
│  └─ index.js
├─ utils/               # Funções auxiliares
│  ├─ formatters.js
│  └─ validators.js
├─ App.vue
└─ main.js
```

## Convenções de nomenclatura

### Componentes

**Componentes reutilizáveis:**

```
components/
├─ AppButton.vue      # Prefixo "App" para componentes globais
├─ BaseCard.vue       # Prefixo "Base" para componentes base
└─ TheHeader.vue      # Prefixo "The" para componentes únicos (singleton)
```

**Componentes específicos de feature:**

```
components/
└─ records/
   ├─ RecordCard.vue
   ├─ RecordForm.vue
   └─ RecordFilters.vue
```

### Views (páginas)

```
views/
├─ HomeView.vue           # Sufixo "View"
├─ RecordsView.vue
├─ RecordDetailView.vue
└─ ProfileView.vue
```

### Composables

```
composables/
├─ useAuth.js             # Prefixo "use"
├─ useRecords.js
└─ useLocalStorage.js
```

### Stores (Pinia)

```
stores/
├─ authStore.js           # Sufixo "Store"
├─ recordsStore.js
└─ settingsStore.js
```

## Organização de componentes

### Por tipo vs por feature

**Por tipo (recomendado para projetos pequenos):**

```
components/
├─ buttons/
├─ forms/
├─ cards/
└─ modals/
```

**Por feature (recomendado para projetos médios/grandes):**

```
components/
├─ auth/
│  ├─ LoginForm.vue
│  └─ RegisterForm.vue
├─ records/
│  ├─ RecordCard.vue
│  ├─ RecordForm.vue
│  └─ RecordList.vue
└─ shared/              # Componentes usados em várias features
   ├─ AppButton.vue
   └─ AppInput.vue
```

## Composables: lógica reutilizável

Composables encapsulam lógica que pode ser reutilizada em múltiplos componentes.

### Exemplo: `useLocalStorage.js`

```javascript
// src/composables/useLocalStorage.js
import { ref, watch } from 'vue';

export function useLocalStorage(key, defaultValue) {
  // Lê valor inicial do localStorage
  const storedValue = localStorage.getItem(key);
  const data = ref(storedValue ? JSON.parse(storedValue) : defaultValue);

  // Salva no localStorage sempre que mudar
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true },
  );

  return data;
}
```

### Usando o composable

```vue
<script setup>
import { useLocalStorage } from '@/composables/useLocalStorage';

// Automaticamente persiste no localStorage
const records = useLocalStorage('records', []);

function addRecord(record) {
  records.value.push(record);
  // Salva automaticamente!
}
</script>
```

### Exemplo: `useRecords.js`

```javascript
// src/composables/useRecords.js
import { ref, computed } from 'vue';

export function useRecords() {
  const records = ref([]);
  const loading = ref(false);

  const totalRecords = computed(() => records.value.length);

  function addRecord(record) {
    records.value.push({
      id: Date.now(),
      ...record,
      createdAt: new Date().toISOString(),
    });
  }

  function deleteRecord(id) {
    records.value = records.value.filter((r) => r.id !== id);
  }

  function getRecord(id) {
    return records.value.find((r) => r.id === id);
  }

  return {
    // Estado
    records,
    loading,

    // Computed
    totalRecords,

    // Métodos
    addRecord,
    deleteRecord,
    getRecord,
  };
}
```

## Services: camada de integração

Services encapsulam lógica de acesso a dados externos.

### Exemplo: `api.js`

```javascript
// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  // Records
  getRecords: () => request('/records'),
  getRecord: (id) => request(`/records/${id}`),
  createRecord: (data) =>
    request('/records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateRecord: (id, data) =>
    request(`/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteRecord: (id) =>
    request(`/records/${id}`, {
      method: 'DELETE',
    }),
};
```

### Usando o service

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';

const records = ref([]);
const loading = ref(false);

async function loadRecords() {
  loading.value = true;
  try {
    records.value = await api.getRecords();
  } catch (error) {
    console.error('Erro ao carregar registros:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadRecords();
});
</script>
```

## Utils: funções auxiliares

Funções puras sem dependências do Vue.

### Exemplo: `formatters.js`

```javascript
// src/utils/formatters.js
export function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
```

### Exemplo: `validators.js`

```javascript
// src/utils/validators.js
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

export function isRequired(value) {
  return value !== null && value !== undefined && value !== '';
}

export function minLength(value, min) {
  return value.length >= min;
}
```

## Alias de importação

Configure alias para facilitar imports.

### `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@views': path.resolve(__dirname, './src/views'),
      '@composables': path.resolve(__dirname, './src/composables'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
```

### Usando alias

```javascript
// Em vez de:
import RecordCard from '../../../components/cards/RecordCard.vue';

// Use:
import RecordCard from '@components/cards/RecordCard.vue';
// ou
import RecordCard from '@/components/cards/RecordCard.vue';
```

## Boas práticas de organização

### 1. **Um componente, um arquivo**

Nunca defina múltiplos componentes no mesmo arquivo (exceto em casos muito específicos).

### 2. **Componentes pequenos e focados**

Se um componente passa de 200 linhas, considere dividir.

### 3. **Lógica fora dos componentes**

Use composables e services para lógica complexa.

### 4. **Nomes consistentes**

Siga as convenções: sufixos, prefixos, PascalCase.

### 5. **Evite acoplamento**

Componentes não devem depender de estruturas específicas de views.

### 6. **Documente decisões**

Use comentários para explicar escolhas não óbvias.

## Exemplo de projeto organizado

```
registro-atividades-vue/
├─ public/
│  └─ favicon.ico
├─ src/
│  ├─ assets/
│  │  ├─ css/
│  │  │  └─ global.css
│  │  └─ images/
│  │     └─ logo.svg
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ AppHeader.vue
│  │  │  └─ AppFooter.vue
│  │  ├─ forms/
│  │  │  ├─ AppInput.vue
│  │  │  └─ AppButton.vue
│  │  └─ records/
│  │     ├─ RecordCard.vue
│  │     └─ RecordList.vue
│  ├─ views/
│  │  ├─ HomeView.vue
│  │  ├─ RecordsView.vue
│  │  └─ RecordDetailView.vue
│  ├─ composables/
│  │  ├─ useRecords.js
│  │  └─ useLocalStorage.js
│  ├─ services/
│  │  └─ api.js
│  ├─ utils/
│  │  ├─ formatters.js
│  │  └─ validators.js
│  ├─ router/
│  │  └─ index.js
│  ├─ App.vue
│  └─ main.js
├─ .gitignore
├─ package.json
└─ vite.config.js
```

## Resumo

Nesta seção você aprendeu:

- ✅ Estrutura recomendada para projetos Vue mobile
- ✅ Convenções de nomenclatura
- ✅ Como usar composables para lógica reutilizável
- ✅ Como organizar services e utils
- ✅ Configurar alias de importação
- ✅ Boas práticas de organização

Na próxima seção, vamos implementar **navegação entre páginas com Vue Router**.

---

**Anterior:** [Props e eventos](props-eventos.md) | **Próximo:** [Vue Router](vue-router.md)
