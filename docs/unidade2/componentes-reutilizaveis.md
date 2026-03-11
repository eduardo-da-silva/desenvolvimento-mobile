# 3. Criando componentes reutilizáveis

## Por que componentes reutilizáveis?

Em aplicações mobile, você frequentemente usa os mesmos elementos visuais em várias telas:

- Botões padronizados
- Cards de listagem
- Headers
- Modais
- Inputs customizados

Criar componentes reutilizáveis:

- Evita duplicação de código
- Garante consistência visual
- Facilita manutenção (muda em um lugar, atualiza em todos)
- Acelera o desenvolvimento

## Anatomia de um componente Vue

Um Single File Component (SFC) tem três seções:

```vue
<script setup>
// Lógica do componente
</script>

<template>
  <!-- Estrutura HTML -->
</template>

<style scoped>
/* Estilos isolados */
</style>
```

## Exemplo 1: Botão reutilizável

Vamos criar um botão mobile-friendly que será usado em todo o app.

### Estrutura de pastas

```
src/
├─ components/
│  └─ AppButton.vue
└─ App.vue
```

### `src/components/AppButton.vue`

```vue
<script setup>
// Por enquanto, sem lógica
</script>

<template>
  <button class="app-button">
    <!-- slot: permite inserir conteúdo de fora -->
    <slot></slot>
  </button>
</template>

<style scoped>
.app-button {
  width: 100%;
  min-height: 48px;
  padding: 12px 24px;
  background: #0b5cff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
}

.app-button:active {
  transform: scale(0.98);
}

.app-button:hover {
  background: #0a4fd6;
}
</style>
```

### Usando o componente

```vue
<!-- src/App.vue -->
<script setup>
import AppButton from './components/AppButton.vue';

function handleClick() {
  alert('Botão clicado!');
}
</script>

<template>
  <div class="app">
    <h1>Meu App</h1>
    <AppButton @click="handleClick"> Clique aqui </AppButton>
  </div>
</template>
```

**Pontos importantes:**

- Nome do componente em PascalCase (`AppButton`)
- `<slot>` permite inserir conteúdo customizado
- Eventos (`@click`) funcionam normalmente

## Exemplo 2: Card de registro

Vamos criar um card para exibir um registro de atividade.

### `src/components/RecordCard.vue`

```vue
<script setup>
// Props serão explicadas na próxima seção
</script>

<template>
  <div class="record-card">
    <div class="record-header">
      <h3 class="record-title">
        <slot name="title">Sem título</slot>
      </h3>
    </div>
    <div class="record-body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.record-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: transform 0.1s;
}

.record-card:active {
  transform: scale(0.98);
}

.record-header {
  margin-bottom: 8px;
}

.record-title {
  font-size: 18px;
  font-weight: 600;
  color: #111;
}

.record-body {
  font-size: 14px;
  color: #666;
}
</style>
```

### Usando com slots nomeados

```vue
<script setup>
import RecordCard from './components/RecordCard.vue';
</script>

<template>
  <RecordCard>
    <template #title>Estudar Vue.js</template>
    Duração: 60 minutos
  </RecordCard>

  <RecordCard>
    <template #title>Fazer exercícios</template>
    Duração: 30 minutos
  </RecordCard>
</template>
```

## Exemplo 3: Header mobile

Um cabeçalho fixo no topo, padrão em apps mobile.

### `src/components/AppHeader.vue`

```vue
<script setup>
// Props para customizar o título
defineProps({
  title: {
    type: String,
    default: 'Meu App',
  },
});
</script>

<template>
  <header class="app-header">
    <h1>{{ title }}</h1>
    <slot name="actions"></slot>
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
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.app-header h1 {
  font-size: 18px;
  font-weight: 600;
}
</style>
```

### Usando

```vue
<script setup>
import AppHeader from './components/AppHeader.vue';
</script>

<template>
  <AppHeader title="Registro de Atividades">
    <template #actions>
      <button>⚙️</button>
    </template>
  </AppHeader>

  <!-- Lembre-se de adicionar padding-top para não ficar atrás do header fixo -->
  <div style="padding-top: 72px;">
    <p>Conteúdo da página</p>
  </div>
</template>
```

## Exemplo 4: Input mobile-friendly

Input com label e validação visual.

### `src/components/AppInput.vue`

```vue
<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: String,
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <div class="app-input">
    <label v-if="label" class="label">{{ label }}</label>
    <input
      v-model="value"
      :type="type"
      :placeholder="placeholder"
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

### Usando com v-model

```vue
<script setup>
import { ref } from 'vue';
import AppInput from './components/AppInput.vue';

const name = ref('');
const email = ref('');
</script>

<template>
  <AppInput v-model="name" label="Nome" placeholder="Digite seu nome" />

  <AppInput
    v-model="email"
    label="E-mail"
    type="email"
    placeholder="seu@email.com"
  />

  <p>Nome: {{ name }}</p>
  <p>E-mail: {{ email }}</p>
</template>
```

## Boas práticas para componentes reutilizáveis

### 1. **Nomenclatura clara**

- Use prefixo comum (`App`, `Base`, `The`)
- Nome descritivo (`AppButton`, não `Button`)
- PascalCase nos arquivos e no uso

### 2. **Props com validação**

```javascript
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
});
```

### 3. **Estilos escopados**

Sempre use `<style scoped>` para evitar vazamento de estilos.

### 4. **Slots para flexibilidade**

Permita customização quando fizer sentido.

### 5. **Emissão de eventos clara**

```javascript
defineEmits(['click', 'submit', 'cancel']);
```

## Estrutura de componentes sugerida

```
src/
├─ components/
│  ├─ layout/          # Componentes de layout
│  │  ├─ AppHeader.vue
│  │  ├─ AppFooter.vue
│  │  └─ AppContainer.vue
│  ├─ forms/           # Componentes de formulário
│  │  ├─ AppInput.vue
│  │  ├─ AppButton.vue
│  │  └─ AppSelect.vue
│  └─ cards/           # Cards e listagens
│     ├─ RecordCard.vue
│     └─ EmptyState.vue
```

## Resumo

Nesta seção você aprendeu:

- Por que criar componentes reutilizáveis
- Estrutura básica de um SFC
- Usar `<slot>` para conteúdo customizável
- Criar componentes mobile-friendly
- Organizar componentes por categoria

Na próxima seção, vamos aprofundar em **props e eventos** para comunicação entre componentes.

---

**Anterior:** [Composition API](composition-api.md) | **Próximo:** [Props e eventos](props-eventos.md)
