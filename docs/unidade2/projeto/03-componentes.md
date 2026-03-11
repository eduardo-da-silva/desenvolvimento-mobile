# 3. Componentes Reutilizáveis

## Objetivo

Nesta etapa, vamos criar componentes reutilizáveis que serão usados em várias partes da aplicação. Componentes reutilizáveis promovem consistência visual, reduzem duplicação de código e facilitam manutenção.

## O que são Componentes Reutilizáveis?

São componentes genéricos que:

- **Não dependem de contexto específico**: Podem ser usados em diferentes páginas
- **Recebem dados via props**: Configuráveis para cada uso
- **Emitem eventos**: Comunicam ações para componentes pai
- **Têm estilo encapsulado**: CSS scoped não vaza para outros componentes

## Componentes que Criaremos

1. **AppHeader**: Cabeçalho fixo com título e botão voltar
2. **AppInput**: Campo de entrada estilizado
3. **AppButton**: Botão com variantes (primário, secundário, danger)
4. **RecordCard**: Card para exibir resumo de um registro

---

## 1. AppHeader - Cabeçalho da Aplicação

### Código completo

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

### Análise do componente

#### Props (linhas 2-8)

```javascript
defineProps({
  title: {
    type: String,
    default: 'Meu App',
  },
  showBack: Boolean,
});
```

**`title`**: Texto exibido no cabeçalho

- Tipo: String
- Valor padrão: "Meu App"
- Exemplo de uso: `:title="Detalhes"`

**`showBack`**: Controla visibilidade do botão voltar

- Tipo: Boolean (não precisa especificar default para boolean, é `false` por padrão)
- Exemplo de uso: `show-back` (presença = true)

#### Eventos (linha 10)

```javascript
defineEmits(['back']);
```

Declara que o componente pode emitir evento `'back'`. Quando o botão voltar é clicado, o evento é disparado para o componente pai.

#### Template (linhas 13-18)

```vue
<header class="app-header">
  <button v-if="showBack" @click="$emit('back')" class="btn-back">←</button>
  <h1>{{ title }}</h1>
  <div class="spacer"></div>
</header>
```

**`v-if="showBack"`**: Renderiza botão voltar condicionalmente

**`@click="$emit('back')"`**: Emite evento quando clicado

**`<div class="spacer"></div>`**: Elemento vazio para balancear o layout quando não há botão voltar

#### Estilos (linhas 21-55)

**Header fixo (linhas 22-35)**:

- `position: fixed`: Fixo no topo ao scrollar
- `z-index: 100`: Fica acima do conteúdo
- `display: flex`: Layout flexível para alinhar itens

**Botão voltar (linhas 37-44)**:

- `background: none; border: none`: Remove estilos padrão do botão
- `font-size: 24px`: Seta grande para facilitar toque em mobile

**Título centralizado (linhas 46-50)**:

- `flex: 1`: Ocupa espaço disponível, centralizando o texto

### Como usar

```vue
<!-- Sem botão voltar -->
<AppHeader title="Página Inicial" />

<!-- Com botão voltar -->
<AppHeader title="Detalhes" show-back @back="router.back()" />
```

---

## 2. AppInput - Campo de Entrada

### Código completo

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

### Análise do componente

#### v-model customizado (linhas 4-20)

```javascript
const props = defineProps({
  modelValue: [String, Number],
  // ...
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
```

Este é o padrão para criar **v-model customizado** em Vue 3:

1. **Prop `modelValue`**: Recebe o valor externo
2. **Evento `update:modelValue`**: Emitido quando valor muda
3. **Computed bidirecional**:
   - `get`: Retorna o valor da prop
   - `set`: Emite evento com novo valor

**No template**: `v-model="value"` vincula o input ao computed

**Resultado**: O componente suporta `v-model` ao ser usado:

```vue
<AppInput v-model="form.title" />
```

#### Props configuráveis (linhas 4-13)

- **modelValue**: Valor atual (string ou número)
- **label**: Texto do rótulo
- **type**: Tipo do input (text, number, email, etc.)
- **placeholder**: Texto de exemplo
- **required**: Se campo é obrigatório

#### Template (linhas 23-37)

```vue
<label v-if="label" class="label">
  {{ label }}
  <span v-if="required" class="required">*</span>
</label>
```

Exibe label apenas se fornecido, com asterisco vermelho se obrigatório.

#### Estilos mobile-friendly (linhas 56-66)

```css
.input {
  width: 100%;
  min-height: 48px; /* Tamanho mínimo recomendado para touch */
  padding: 12px 16px;
  font-size: 16px; /* Evita zoom em iOS */
  /* ... */
}
```

**Pontos importantes**:

- **min-height: 48px**: Tamanho adequado para toque em dispositivos móveis
- **font-size: 16px**: Em iOS, inputs com fonte < 16px ativam zoom automático
- **transition**: Animação suave ao focar

### Como usar

```vue
<AppInput
  v-model="form.title"
  label="Título"
  placeholder="Digite o título"
  required
/>

<AppInput
  v-model.number="form.duration"
  label="Duração (minutos)"
  type="number"
  placeholder="60"
/>
```

---

## 3. AppButton - Botão Estilizado

### Código completo

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

### Análise do componente

#### Props (linhas 2-12)

- **type**: Tipo do botão HTML (`button`, `submit`, `reset`)
- **variant**: Estilo visual (`primary`, `secondary`, `danger`)
- **disabled**: Se botão está desabilitado

#### Slot (linha 20)

```vue
<slot></slot>
```

O `<slot>` permite que o conteúdo do botão seja customizado:

```vue
<AppButton>Salvar</AppButton>
<AppButton variant="danger">Excluir</AppButton>
```

#### Classes dinâmicas (linha 19)

```vue
:class="['app-button', `variant-${variant}`]"
```

Aplica classes baseadas na prop `variant`:

- `variant="primary"` → `app-button variant-primary`
- `variant="danger"` → `app-button variant-danger`

#### Feedback visual (linhas 40-46)

```css
.app-button:active {
  transform: scale(0.98);
}

.app-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

- **:active**: Efeito de "apertar" ao tocar
- **:disabled**: Aparência desabilitada

### Como usar

```vue
<!-- Botão primário -->
<AppButton type="submit">
  Salvar
</AppButton>

<!-- Botão secundário -->
<AppButton variant="secondary" @click="handleCancel">
  Cancelar
</AppButton>

<!-- Botão de perigo -->
<AppButton variant="danger" @click="handleDelete">
  Excluir
</AppButton>

<!-- Botão desabilitado -->
<AppButton :disabled="!isValid">
  Continuar
</AppButton>
```

---

## 4. RecordCard - Card de Registro

### Código completo

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

### Análise do componente

#### Props simples (linhas 2-6)

```javascript
defineProps({
  title: String,
  duration: Number,
  date: String,
});
```

Props obrigatórias para exibir informações do registro.

#### Template com emojis (linhas 9-16)

```vue
<h3 class="title">{{ title }}</h3>
<div class="meta">
  <span class="duration">⏱️ {{ duration }} min</span>
  <span class="date">📅 {{ date }}</span>
</div>
```

Usa emojis para tornar interface mais amigável e reduzir necessidade de ícones externos.

#### Feedback de toque (linhas 29-31)

```css
.record-card:active {
  transform: scale(0.98);
}
```

Feedback visual ao tocar no card, indicando que é clicável.

### Como usar

```vue
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
```

Note que o card é envolvido por `RouterLink` para torná-lo clicável e navegável.

---

## Conceitos Aplicados

### Componentização

- Componentes pequenos e focados
- Reutilizáveis em múltiplos contextos
- Fácil manutenção e teste

### Props e Eventos

- Props para passar dados para o componente
- Eventos para comunicar ações ao pai
- v-model customizado para two-way binding

### Scoped CSS

- Estilos não vazam para outros componentes
- Nomes de classes podem se repetir sem conflito

### Design Mobile-First

- Tamanhos adequados para toque (min 48px)
- Fonte ≥ 16px para evitar zoom em iOS
- Feedback visual em interações

### Acessibilidade

- Labels associados aos inputs
- Indicação visual de campos obrigatórios
- Estados de disabled claramente visíveis

## Próximos Passos

Com os componentes reutilizáveis prontos, podemos criar as views (páginas) da aplicação. Cada view utilizará estes componentes para construir interfaces completas e funcionais.

**[← Voltar: Composable](02-composable.md)** | **[Próximo: Views (Páginas) →](04-views.md)**
