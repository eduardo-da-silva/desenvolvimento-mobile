# Passo 5 – Interface de notificação

## Objetivo

Neste passo, vamos criar o banner que pede permissão de notificações ao usuário, montar esse componente no `App.vue` e adicionar a lógica de re-fetch automático quando o usuário clica em uma notificação.

## 5.1 O banner NotificationPrompt

O browser exige que o pedido de permissão (`Notification.requestPermission()`) seja disparado por uma interação do usuário. Um banner não-invasivo — que aparece alguns segundos depois do login — é a solução ideal.

**Quando o banner aparece:**

- O usuário está autenticado
- A permissão ainda não foi concedida (`"default"`) — nem negada
- O usuário não clicou em "Agora não" antes (verificamos `push_prompt_dismissed` no localStorage)

**Ações disponíveis:**

| Botão | O que faz |
| ----- | --------- |
| **Ativar** | Chama `requestPermission()`, se concedida, chama `subscribe()` |
| **Agora não** | Fecha o banner, salva `push_prompt_dismissed` no localStorage |

Crie o arquivo `src/components/NotificationPrompt.vue`:

```html title="src/components/NotificationPrompt.vue" linenums="1"
<template>
  <Transition name="slide-up">
    <div v-if="visible" class="notification-prompt">
      <div class="prompt-content">
        <span class="prompt-icon">🔔</span>
        <div class="prompt-text">
          <strong>Ativar notificações?</strong>
          <p>Seja avisado quando tarefas forem criadas ou atualizadas em outros dispositivos.</p>
        </div>
      </div>
      <div class="prompt-actions">
        <button class="btn-allow" @click="allow">Ativar</button>
        <button class="btn-dismiss" @click="dismiss">Agora não</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const visible = ref(false)
const authStore = useAuthStore()

onMounted(() => {
  if (
    authStore.isAuthenticated &&
    'Notification' in window &&
    Notification.permission === 'default' && // (1)
    !localStorage.getItem('push_prompt_dismissed')
  ) {
    setTimeout(() => { visible.value = true }, 2000) // (2)
  }
})

async function allow() {
  visible.value = false
  const granted = await authStore.requestPermission()
  if (granted) {
    const reg = await navigator.serviceWorker.ready
    await authStore.subscribe(reg) // (3)
  }
}

function dismiss() {
  visible.value = false
  localStorage.setItem('push_prompt_dismissed', '1') // (4)
}
</script>

<style scoped>
.notification-prompt {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: min(480px, calc(100vw - 2rem));
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 1rem 1.25rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.prompt-content { display: flex; align-items: flex-start; gap: 0.75rem; }
.prompt-icon { font-size: 1.5rem; flex-shrink: 0; }
.prompt-text strong { display: block; font-size: 0.95rem; color: #1a202c; }
.prompt-text p { margin: 0.2rem 0 0; font-size: 0.85rem; color: #718096; line-height: 1.4; }
.prompt-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
.btn-allow {
  padding: 0.4rem 1rem; background: #4a90d9; color: #fff;
  border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;
}
.btn-dismiss {
  padding: 0.4rem 1rem; background: transparent; color: #718096;
  border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; font-size: 0.85rem;
}
/* Animação slide-up */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(1rem); }
</style>
```

1. `"default"` significa que o usuário ainda não respondeu — nem concedeu, nem negou. Se for `"denied"`, não adianta pedir.
2. O atraso de 2 segundos evita que o banner apareça ao mesmo tempo que a tela carrega, o que seria invasivo.
3. Passamos a registration do Service Worker diretamente para `subscribe()` — assim não precisamos chamar `navigator.serviceWorker.ready` de novo.
4. Uma vez que o usuário dispensa o banner, não mostramos novamente. Apenas o logout + login apagaria esse flag (intencionalmente — um usuário que dispensou não quer ser perguntado de novo na mesma sessão).

## 5.2 Atualizando o App.vue

O `App.vue` tem duas responsabilidades de push:

1. **Montar o `NotificationPrompt`** para usuários autenticados
2. **Escutar mensagens do Service Worker** — quando o usuário clica em uma notificação, o SW envia `PUSH_NOTIFICATION_CLICKED` e o app refaz o fetch das tarefas
3. **Auto-subscribe** caso o usuário já tenha concedido permissão em uma sessão anterior mas a subscription local esteja perdida (ex.: limpeza de localStorage)

```html title="src/App.vue" linenums="1"
<template>
  <OfflineBanner />
  <AppHeader />
  <main>
    <router-view />
  </main>
  <NotificationPrompt />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import OfflineBanner from './components/OfflineBanner.vue'
import NotificationPrompt from './components/NotificationPrompt.vue'
import { useTasksStore } from './stores/tasks'
import { useAuthStore } from './stores/auth'

const tasksStore = useTasksStore()
const authStore = useAuthStore()

// Re-fetch automático quando o usuário clica em uma notificação e foca o app
function onSwMessage(event) {
  if (event.data?.type === 'PUSH_NOTIFICATION_CLICKED') {
    tasksStore.fetchTasks() // (1)
  }
}

onMounted(async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', onSwMessage)
  }

  // Se autenticado + permissão granted + sem endpoint local → re-subscribe silenciosamente
  if (
    authStore.isAuthenticated &&
    'serviceWorker' in navigator &&
    'Notification' in window &&
    Notification.permission === 'granted' &&
    !localStorage.getItem('push_endpoint') // (2)
  ) {
    navigator.serviceWorker.ready
      .then((reg) => authStore.subscribe(reg))
      .catch(() => {})
  }
})

onUnmounted(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.removeEventListener('message', onSwMessage)
  }
})
</script>
```

1. `fetchTasks()` atualiza silenciosamente a lista de tarefas — o usuário vê o estado mais recente imediatamente ao focar o app depois de clicar na notificação.
2. Isso cobre o cenário em que o usuário limpou o localStorage ou trocou de dispositivo: se a permissão já está concedida e o endpoint não está mais salvo, recriamos a subscription automaticamente.

## 5.3 Como testar

Para ver as notificações em ação, você precisa de duas sessões autenticadas com o mesmo usuário:

1. Abra o app no **Chrome** em `http://localhost:5173`. Faça login e ative as notificações.
2. Abra o app no **Firefox** (ou em uma aba anônima) também em `http://localhost:5173`. Faça login com o mesmo usuário.
3. Na sessão do Chrome, crie uma tarefa ou marque uma como concluída.
4. Observe a notificação push aparecendo na sessão do Firefox.

!!! tip "Inspecionando no DevTools"

    Em **Application → Service Workers** do Chrome DevTools, você pode ver o SW registrado e até enviar eventos `push` manualmente para testar a notificação sem precisar do backend:

    ```json
    {"event": "task_updated", "task": {"id": 1, "title": "Comprar pão", "done": true}}
    ```

    Cole esse JSON no campo **Push** e clique em **Push** — o Service Worker processará como se fosse um push real.

!!! warning "HTTPS em produção"

    Push Notifications exigem HTTPS em produção. `localhost` é a única exceção — por isso o tutorial inteiro roda em `localhost`. Ao fazer deploy, certifique-se de que o domínio tem certificado SSL válido.

## Resumo do passo

Neste passo, você:

- Criou o `NotificationPrompt.vue` com animação e lógica de "não perguntar novamente"
- Atualizou o `App.vue` para escutar mensagens do SW e re-fazer fetch automático
- Adicionou auto-subscribe para recuperar subscriptions perdidas após reload
- Aprendeu como testar notificações push com duas sessões simultâneas

---

**Anterior:** [Passo 4 – Integração com autenticação](04-integracao.md) | **Próximo:** [Atividades práticas](../atividades-praticas.md)
