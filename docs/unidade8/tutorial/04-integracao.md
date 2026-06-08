# Passo 4 – Integração com autenticação

## Objetivo

Neste passo, vamos conectar o composable de push ao fluxo de autenticação: o browser se inscreve automaticamente ao fazer login e cancela a subscription ao fazer logout. Também adicionamos o header `X-Push-Endpoint` em todo request para o backend saber qual sessão não deve receber notificação.

## 4.1 O header X-Push-Endpoint

Imagine que o usuário cria uma tarefa no browser A. O backend envia push para todas as subscriptions do usuário — incluindo o browser A. Resultado: o browser A recebe uma notificação de uma ação que ele mesmo fez, o que é confuso.

A solução é simples: o frontend envia o endpoint da própria subscription em cada request. O backend compara e exclui esse endpoint ao distribuir os pushs.

```
PATCH /api/tasks/42
Authorization: Bearer eyJ...
X-Push-Endpoint: https://fcm.googleapis.com/fcm/send/abc123...
```

O interceptor do Axios é o lugar ideal para adicionar esse header automaticamente em todos os requests.

## 4.2 Atualizando o config.js

Adicione o trecho de leitura do `push_endpoint` no interceptor de request que já existe em `src/api/config.js`:

```javascript title="src/api/config.js" linenums="1"
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Injeta o access token e o endpoint push em todas as requisições
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Permite que o backend exclua esta sessão ao enviar notificações
  const pushEndpoint = localStorage.getItem('push_endpoint') // (1)
  if (pushEndpoint) {
    config.headers['X-Push-Endpoint'] = pushEndpoint
  }
  return config
})

// Em caso de 401, tenta renovar o token e reenviar a requisição original
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/api/token')
    ) {
      original._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/token/refresh`, {
            refresh_token: refreshToken,
          })
          localStorage.setItem('access_token', data.access_token)
          localStorage.setItem('refresh_token', data.refresh_token)
          original.headers.Authorization = `Bearer ${data.access_token}`
          return apiClient(original)
        } catch {
          // refresh falhou — continua para o logout
        }
      }
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
```

1. O `localStorage` é lido a cada request — assim o header reflete o estado atual (endpoint presente após subscribe, ausente após unsubscribe).

## 4.3 Atualizando o auth.js

Agora integramos o composable de push ao store de autenticação:

- **Login**: se a permissão já foi concedida, subscribes automaticamente (fire-and-forget — não pode bloquear o login)
- **Logout**: cancela a subscription e remove o endpoint do localStorage

```javascript title="src/stores/auth.js" linenums="1"
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import authApi from '../api/authApi'
import { usePushNotifications } from '../composables/usePushNotifications'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access_token'))
  const refreshToken = ref(localStorage.getItem('refresh_token'))

  const isAuthenticated = computed(() => !!accessToken.value)

  const { requestPermission, subscribe, unsubscribe } = usePushNotifications()

  async function login(email, password) {
    const { data } = await authApi.login(email, password)
    accessToken.value = data.access_token
    refreshToken.value = data.refresh_token
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)

    // Se a permissão já foi concedida, subscribe agora — sem await para não bloquear o login
    if (
      'serviceWorker' in navigator &&
      'Notification' in window &&
      Notification.permission === 'granted' // (1)
    ) {
      navigator.serviceWorker.ready
        .then((reg) => subscribe(reg))
        .catch(() => {})
    }
  }

  async function logout() {
    await unsubscribe() // (2)
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return { accessToken, refreshToken, isAuthenticated, login, logout, requestPermission, subscribe }
})
```

1. Verificamos `Notification.permission === 'granted'` antes de tentar subscribes. Se a permissão ainda não foi concedida, o banner de notificação (criado no próximo passo) se encarregará de pedir e então chamar `subscribe`.
2. No logout, esperamos o `unsubscribe` completar antes de limpar os tokens — assim a requisição `DELETE /api/subscriptions` ainda sai com o token válido.

!!! warning "Por que não usar await no login?"

    `navigator.serviceWorker.ready` retorna uma Promise que pode demorar indefinidamente se o Service Worker não estiver instalado ainda (por exemplo, no primeiro acesso). Usar `await` travaria a tela de login até que o SW estivesse pronto — ou eternamente se houvesse algum problema.

    A estratégia "fire-and-forget" com `.then().catch()` garante que o login termine imediatamente e a subscription acontece em segundo plano.

## Resumo do passo

Neste passo, você:

- Adicionou o header `X-Push-Endpoint` no interceptor Axios
- Integrou `subscribe` e `unsubscribe` ao fluxo de login/logout no auth store
- Aprendeu por que o subscribe no login deve ser fire-and-forget

---

**Anterior:** [Passo 3 – Permissão e subscription](03-subscribe.md) | **Próximo:** [Passo 5 – Interface de notificação](05-notificacao-ui.md)
