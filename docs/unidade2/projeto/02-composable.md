# 2. Composable useRecords

## Objetivo

Nesta etapa, vamos criar um **composable** que encapsula toda a lógica de gerenciamento de registros. Este é um dos conceitos mais importantes do Vue.js 3: separar a lógica de negócio da interface visual.

## O que é um Composable?

Um **composable** é uma função JavaScript que:

- Encapsula lógica reutilizável usando a Composition API
- Pode usar recursos reativos do Vue (`ref`, `reactive`, `computed`, `watch`)
- Pode ser importado e usado em qualquer componente
- Promove reutilização de código e organização

### Vantagens dos Composables

1. **Reutilização**: Mesma lógica em múltiplos componentes
2. **Organização**: Código separado por funcionalidade
3. **Testabilidade**: Lógica isolada é mais fácil de testar
4. **Manutenibilidade**: Mudanças em um lugar refletem em toda aplicação

## Implementação do useRecords

### Código completo

Crie o arquivo `src/composables/useRecords.js`:

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

## Análise Detalhada

### Imports e Estado Global (linhas 1-7)

```javascript
import { ref, computed } from 'vue';

const records = ref([]);
const STORAGE_KEY = 'records';
```

#### `ref([])`

Cria uma variável reativa que começa como array vazio. Quando `records.value` muda, todos os componentes que o utilizam são atualizados automaticamente.

#### Estado fora da função

Note que `records` está **fora** da função `useRecords()`. Isso cria um **estado global compartilhado** entre todos os componentes que usam o composable.

**Por que isso é importante?**

- Se estivesse dentro da função, cada componente teria sua própria cópia dos dados
- Com o estado externo, todos os componentes veem e modificam os mesmos dados

### Persistência com LocalStorage (linhas 9-20)

```javascript
function loadFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    records.value = JSON.parse(stored);
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value));
}

loadFromStorage();
```

#### `loadFromStorage()`

- Busca dados do LocalStorage usando a chave `'records'`
- Se existir, converte de JSON string para array JavaScript
- Atualiza `records.value` com os dados recuperados

#### `saveToStorage()`

- Converte array JavaScript para JSON string
- Salva no LocalStorage

#### `loadFromStorage()` executado imediatamente

Quando o composable é importado pela primeira vez, carrega automaticamente os dados salvos.

### Propriedades Computadas (linhas 23-27)

```javascript
const totalRecords = computed(() => records.value.length);
const totalDuration = computed(() => {
  return records.value.reduce((sum, r) => sum + r.duration, 0);
});
```

#### `totalRecords`

Calcula automaticamente o total de registros. Atualiza sempre que `records` muda.

#### `totalDuration`

Usa `reduce()` para somar a duração de todos os registros:

- Começa com 0 (valor inicial)
- Para cada registro `r`, adiciona `r.duration` ao total
- Retorna a soma final

**Por que usar `computed`?**

- Resultados são cacheados
- Só recalcula quando `records` muda
- Mais eficiente que recalcular em cada render

### Operações CRUD

#### Create - addRecord (linhas 29-37)

```javascript
function addRecord(record) {
  const newRecord = {
    id: Date.now(),
    ...record,
    createdAt: new Date().toISOString(),
  };
  records.value.unshift(newRecord);
  saveToStorage();
  return newRecord;
}
```

**O que faz:**

1. Cria um novo objeto com ID único (timestamp)
2. Usa spread operator `...record` para copiar dados recebidos
3. Adiciona data de criação em formato ISO
4. Insere no **início** do array com `unshift()`
5. Salva no LocalStorage
6. Retorna o novo registro criado

**Por que `Date.now()` como ID?**

- Simples e único (milissegundos desde 1970)
- Ordena automaticamente por data de criação
- Suficiente para aplicações client-side

#### Read - getRecord (linhas 39-41)

```javascript
function getRecord(id) {
  return records.value.find((r) => r.id === parseInt(id));
}
```

**O que faz:**

- Busca registro por ID usando `find()`
- Converte `id` para número com `parseInt()` (importante porque IDs de rotas vêm como string)
- Retorna o registro encontrado ou `undefined`

#### Update - updateRecord (linhas 43-53)

```javascript
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
```

**O que faz:**

1. Encontra o índice do registro com `findIndex()`
2. Se encontrado (índice ≠ -1):
   - Cria novo objeto mantendo dados originais
   - Aplica atualizações com spread operator
   - Adiciona data de atualização
   - Substitui o registro no array
   - Salva no LocalStorage
   - Retorna registro atualizado
3. Se não encontrado, retorna `null`

**Por que criar novo objeto?**

- Vue detecta mudanças melhor com novos objetos
- Evita mutação direta que pode causar bugs
- Pattern imutável é mais seguro

#### Delete - deleteRecord (linhas 55-58)

```javascript
function deleteRecord(id) {
  records.value = records.value.filter((r) => r.id !== parseInt(id));
  saveToStorage();
}
```

**O que faz:**

- Usa `filter()` para criar novo array sem o registro deletado
- Mantém todos os registros cujo ID é diferente do informado
- Salva no LocalStorage

**Por que `filter()` ao invés de `splice()`?**

- Mais declarativo e legível
- Não modifica array original
- Retorna novo array, disparando reatividade corretamente

### Retorno do Composable (linhas 60-72)

```javascript
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
```

O composable retorna um objeto com:

- **Estado reativo**: `records`
- **Propriedades computadas**: `totalRecords`, `totalDuration`
- **Métodos CRUD**: `addRecord`, `getRecord`, `updateRecord`, `deleteRecord`

Todos podem ser desestruturados ao usar o composable.

## Como Usar em Componentes

### Exemplo de uso

```javascript
import { useRecords } from '@/composables/useRecords';

// No setup() do componente
const { records, totalRecords, addRecord, deleteRecord } = useRecords();

// Agora você pode:
console.log(totalRecords.value); // Acessar computed
addRecord({ title: 'Estudar', duration: 60 }); // Criar registro
deleteRecord(123); // Deletar registro
```

### Observações importantes

1. **Não precisa de `.value`** nos métodos quando desestruturados
2. **Precisa de `.value`** para acessar valores de `ref` e `computed`
3. Todos os componentes compartilham o mesmo estado

## Fluxo de Dados

```
Componente 1 → useRecords() → Estado Global (records)
                              ↓
Componente 2 → useRecords() → Mesmos dados
                              ↓
                         LocalStorage
```

Quando qualquer componente modifica os dados:

1. Estado global é atualizado
2. Dados são salvos no LocalStorage
3. Todos os componentes que usam `records` são re-renderizados automaticamente

## Conceitos Aplicados

### ✅ Composition API

- `ref()` para estado reativo
- `computed()` para valores calculados
- Função que retorna recursos reativos

### ✅ Padrão de Estado Global

- Estado compartilhado fora da função
- Sincronização automática entre componentes

### ✅ Persistência de Dados

- LocalStorage para armazenamento local
- Carregamento automático na inicialização
- Salvamento após cada operação

### ✅ Operações CRUD Completas

- Create, Read, Update, Delete
- Validações básicas
- Tratamento de erros (retorno `null`)

## Próximos Passos

Com o composable pronto, temos toda a lógica de negócio implementada. Na próxima etapa, criaremos os componentes reutilizáveis que formarão a interface da aplicação.

**[← Voltar: Setup](01-setup.md)** | **[Próximo: Componentes Reutilizáveis →](03-componentes.md)**
