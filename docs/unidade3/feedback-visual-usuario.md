# 3. Feedback visual para o usuário

No mobile, o usuário toca e espera uma resposta imediata. **Sem feedback, ele acha que nada aconteceu**. Como regra geral, toda ação precisa de um retorno visual.

## Tipos de feedback importantes

### 1. Feedback de toque

- Botão muda de cor ao tocar
- Ícone muda de estado
- Elemento "afunda" levemente

**Exemplo:** ao tocar em "Salvar", o botão fica cinza e depois volta ao normal, indicando que a ação foi reconhecida.

### 2. Feedback de carregamento

- Spinner quando algo demora
- Skeleton quando o conteúdo ainda está chegando
- Mostre que algo está acontecendo
- Dê uma noção de progresso

**Exemplo:** lista de registros com skeleton enquanto busca dados.

### 3. Feedback de sucesso ou erro

- Mensagem curta e clara
- Cor ou ícone para reforçar o estado
- Explique o que aconteceu
- Diga o que o usuário pode fazer
- Evite mensagens técnicas

**Exemplo:** "Não foi possível carregar os registros. Tente novamente."

## 4. Feedback quando o conteúdo está vazio

- Indique que não há dados
- Oriente o próximo passo
- Use linguagem simples

**Exemplo:** "Nenhum registro ainda. Toque em + para criar o primeiro."

## O que o feedback resolve

- Confirma que a ação foi reconhecida
- Reduz a ansiedade do usuário
- Evita toques repetidos

## Implementando feedback com Vue.js

### Componente de notificação (Toast)

Um toast é uma mensagem temporária que aparece após uma ação. É um dos feedbacks mais comuns em apps mobile:

```vue linenums="1" title="src/components/ToastNotification.vue"
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'info' }, // 'info', 'success', 'error'
  duration: { type: Number, default: 3000 },
});

const emit = defineEmits(['close']);
const visible = ref(false);

watch(
  () => props.message,
  (newVal) => {
    if (newVal) {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
        emit('close');
      }, props.duration);
    }
  },
);
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 16px;
  padding: 14px 16px;
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  text-align: center;
  z-index: 1000;
}

.toast.success {
  background: #2e7d32;
}
.toast.error {
  background: #c62828;
}
.toast.info {
  background: #1565c0;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    transform 0.3s,
    opacity 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
```

### Componente de estado vazio

Quando uma lista não tem itens, é importante comunicar isso de forma clara e orientar o próximo passo:

```vue linenums="1" title="src/components/EmptyState.vue"
<script setup>
defineProps({
  title: { type: String, default: 'Nenhum item ainda' },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
});

const emit = defineEmits(['action']);
</script>

<template>
  <div class="empty-state">
    <p class="empty-title">{{ title }}</p>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <button v-if="actionLabel" class="empty-action" @click="emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 16px;
}

.empty-action {
  background: #0b5cff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.9rem;
  min-height: 44px;
  cursor: pointer;
}
</style>
```

Uso na view de listagem:

```vue linenums="1" title="Uso em HomeView.vue"
<template>
  <div class="home">
    <ul v-if="records.length" class="record-list">
      <li v-for="r in records" :key="r.id">{{ r.title }}</li>
    </ul>
    <EmptyState
      v-else
      title="Nenhum registro ainda"
      description="Toque no botão abaixo para criar seu primeiro registro."
      action-label="+ Novo Registro"
      @action="router.push({ name: 'registro-novo' })"
    />
  </div>
</template>
```

### Indicador de carregamento

```vue linenums="1" title="src/components/LoadingSpinner.vue"
<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p class="loading-text">Carregando...</p>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 0;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e0e0e0;
  border-top-color: #0b5cff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 12px;
  color: #666;
  font-size: 0.9rem;
}
</style>
```

### Padrão de uso combinado

Na prática, uma view combina os três estados — carregando, vazio e com dados:

```vue linenums="1" title="Padrão completo na view"
<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <EmptyState
      v-else-if="!records.length"
      title="Nenhum registro"
      description="Comece adicionando uma atividade."
      action-label="+ Novo"
      @action="criarNovo"
    />
    <RecordList v-else :records="records" />
    <ToastNotification
      :message="toast.message"
      :type="toast.type"
      @close="toast.message = ''"
    />
  </div>
</template>
```

Esse padrão garante que o usuário sempre veja algo relevante na tela, independentemente do estado dos dados.

**Exemplo no projeto:**

Depois de salvar um registro, mostre uma confirmação simples (ex.: "Registro salvo com sucesso").

### Atividade prática

Revise uma tela do seu app e identifique:

- Qual ação não tem feedback hoje
- Que tipo de feedback é mais adequado

---

**Próximo:** [Acessibilidade básica em aplicações web/mobile](acessibilidade-basica.md)
