# 2. Composition API: setup, ref e reactive

## O que é a Composition API?

A **Composition API** é a forma moderna de escrever componentes Vue.js 3. Ela oferece:

- Código mais organizado e reutilizável
- Melhor suporte a TypeScript
- Lógica agrupada por funcionalidade (não por opções)

Você já conhece a **Options API** (com `data()`, `methods`, `computed`). A Composition API é uma evolução, não uma substituição — ambas funcionam.

### Options API vs Composition API

**Options API (antigo, mas ainda válido):**

```vue
<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>
```

**Composition API (moderno, recomendado):**

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}
</script>
```

Vantagens:

- Menos verbosidade
- Não precisa de `this`
- Mais fácil de testar e reutilizar lógica

## `<script setup>`

O `<script setup>` é uma sintaxe açucarada que:

- Elimina boilerplate (código repetitivo)
- Torna tudo declarado disponível no template automaticamente
- Melhora a performance

```vue
<script setup>
// Tudo aqui fica disponível no template
const message = 'Olá!';
const count = ref(0);
</script>

<template>
  <p>{{ message }}</p>
  <p>Contagem: {{ count }}</p>
</template>
```

## `ref()` - Reatividade para valores primitivos

Use `ref()` para tornar valores primitivos (string, number, boolean) reativos.

### Sintaxe

```javascript
import { ref } from 'vue';

const count = ref(0);
```

### Como funciona

```vue
<script setup>
import { ref } from 'vue';

// Cria uma referência reativa
const count = ref(0);

// Para acessar/modificar o valor, use .value
function increment() {
  count.value++;
}

function decrement() {
  count.value--;
}
</script>

<template>
  <div>
    <!-- No template, não precisa de .value -->
    <p>Contagem: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

**Regras importantes:**

- No JavaScript (dentro do `<script>`): use `count.value`
- No template: use `count` direto (Vue desempacota automaticamente)

### Exemplo prático: campo de texto

```vue
<script setup>
import { ref } from 'vue';

const name = ref('');
</script>

<template>
  <div>
    <input v-model="name" placeholder="Digite seu nome" />
    <p>Olá, {{ name }}!</p>
  </div>
</template>
```

## `reactive()` - Reatividade para objetos

Use `reactive()` para tornar objetos e arrays reativos.

### Sintaxe

```javascript
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  message: 'Olá',
});
```

### Como funciona

```vue
<script setup>
import { reactive } from 'vue';

// Cria um objeto reativo
const state = reactive({
  count: 0,
  message: 'Olá Vue!',
});

function increment() {
  // Acessa propriedades diretamente, sem .value
  state.count++;
}

function updateMessage() {
  state.message = 'Mensagem atualizada!';
}
</script>

<template>
  <div>
    <p>{{ state.message }}</p>
    <p>Contagem: {{ state.count }}</p>
    <button @click="increment">Incrementar</button>
    <button @click="updateMessage">Mudar mensagem</button>
  </div>
</template>
```

**Regras importantes:**

- Não precisa de `.value` (mesmo no JavaScript)
- Acessa propriedades diretamente: `state.count`
- Mantém reatividade em propriedades aninhadas

### Exemplo prático: lista de tarefas

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({
  tasks: [],
  newTask: '',
});

function addTask() {
  if (state.newTask.trim()) {
    state.tasks.push({
      id: Date.now(),
      text: state.newTask,
    });
    state.newTask = '';
  }
}
</script>

<template>
  <div>
    <input v-model="state.newTask" @keyup.enter="addTask" />
    <button @click="addTask">Adicionar</button>

    <ul>
      <li v-for="task in state.tasks" :key="task.id">
        {{ task.text }}
      </li>
    </ul>
  </div>
</template>
```

## `ref()` vs `reactive()`: qual usar?

| Cenário                                   | Use          | Exemplo                                 |
| ----------------------------------------- | ------------ | --------------------------------------- |
| Valor primitivo (string, number, boolean) | `ref()`      | `const count = ref(0)`                  |
| Objeto ou array                           | `reactive()` | `const state = reactive({ items: [] })` |
| Precisa reatribuir a variável             | `ref()`      | `const user = ref(null)`                |

**Dica prática:** para começar, use:

- `ref()` para valores simples
- `reactive()` para estado complexo de componentes

## Computed properties

Valores derivados que são recalculados automaticamente quando suas dependências mudam.

```vue
<script setup>
import { ref, computed } from 'vue';

const firstName = ref('João');
const lastName = ref('Silva');

// Computed: sempre atualizado automaticamente
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
</script>

<template>
  <div>
    <input v-model="firstName" />
    <input v-model="lastName" />
    <p>Nome completo: {{ fullName }}</p>
  </div>
</template>
```

## Watchers

Para executar código quando uma variável reativa muda.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);

// Executa sempre que count muda
watch(count, (newValue, oldValue) => {
  console.log(`Mudou de ${oldValue} para ${newValue}`);
});

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">Contagem: {{ count }}</button>
</template>
```

## Exemplo completo: contador mobile

Vamos criar um contador estilizado para mobile usando Composition API:

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}

function decrement() {
  count.value--;
}

function reset() {
  count.value = 0;
}
</script>

<template>
  <div class="counter">
    <h1>Contador</h1>
    <div class="display">{{ count }}</div>
    <div class="buttons">
      <button @click="decrement" class="btn">-</button>
      <button @click="reset" class="btn btn-reset">Reset</button>
      <button @click="increment" class="btn">+</button>
    </div>
  </div>
</template>

<style scoped>
.counter {
  padding: 20px;
  text-align: center;
}

.display {
  font-size: 72px;
  font-weight: bold;
  margin: 40px 0;
  color: #0b5cff;
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  min-width: 60px;
  min-height: 60px;
  font-size: 24px;
  border: none;
  border-radius: 8px;
  background: #0b5cff;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s;
}

.btn:active {
  transform: scale(0.95);
}

.btn-reset {
  background: #ff4444;
}
</style>
```

## Resumo

Nesta seção você aprendeu:

- ✅ Composition API é a forma moderna de escrever Vue
- ✅ `<script setup>` elimina boilerplate
- ✅ `ref()` para valores primitivos (use `.value` no JS)
- ✅ `reactive()` para objetos e arrays
- ✅ `computed()` para valores derivados
- ✅ `watch()` para reagir a mudanças

Na próxima seção, vamos criar **componentes reutilizáveis** que serão a base do nosso app mobile.

---

**Anterior:** [Criando projeto com Vite](criando-projeto-vite.md) | **Próximo:** [Componentes reutilizáveis](componentes-reutilizaveis.md)
