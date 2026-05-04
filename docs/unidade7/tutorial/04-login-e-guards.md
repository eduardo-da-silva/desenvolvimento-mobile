# Passo 4 – Login, guards e logout

## Objetivo

Neste passo, vamos criar a tela de login, proteger as rotas que exigem autenticação e adicionar o botão de logout no cabeçalho da aplicação.

## 4.1 Criando a tela de login

Crie o arquivo `src/views/LoginView.vue`:

```vue title="src/views/LoginView.vue" linenums="1"
<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h1>Entrar</h1>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="seu@email.com"
          required
          autocomplete="email"
        />
      </div>

      <div class="field">
        <label for="password">Senha</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="••••••••"
          required
          autocomplete="current-password"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    errorMessage.value =
      err.response?.data?.detail ??
      'Erro ao entrar. Verifique suas credenciais.';
  } finally {
    loading.value = false;
  }
}
</script>
```

### Pontos importantes

**Linha 6 – `v-if="errorMessage"`**
A div de erro só renderiza quando há mensagem. O backend retorna o detalhe do erro em `response.data.detail` — o mesmo campo que o FastAPI usa em seus `HTTPException`. Se não houver detalhe, exibimos uma mensagem genérica.

**Linha 53 – `authStore.login(email, password)`**
A action `login` da store faz a chamada à API, salva os tokens e retorna. Se der erro, a exception sobe até o `catch`. Se der certo, o `router.push('/')` redireciona para a tela inicial.

**Linha 60 – `finally`**
O `loading` é desativado independentemente do resultado — seja sucesso ou erro.

## 4.2 Configurando as rotas

Atualize o `src/router/index.js`:

```javascript title="src/router/index.js" linenums="1" hl_lines="4-5 12 19-23 31-36"
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  }
});

export default router;
```

### O navigation guard

**Linha 12 – `meta: { requiresAuth: true }`**
O campo `meta` é um objeto livre que pode ser associado a qualquer rota. Aqui usamos para sinalizar quais rotas exigem autenticação. Rotas sem esse campo (como `/about` e `/login`) ficam abertas a qualquer visitante.

**Linhas 32–36 – `router.beforeEach`**
Este hook é executado antes de cada navegação. Ele recebe o objeto da rota de destino (`to`) e decide se a navegação pode prosseguir.

A lógica é direta: se a rota de destino exige autenticação **e** o usuário não está autenticado, redireciona para o login. Caso contrário, a navegação segue normalmente (retorno `undefined`).

!!! note "Por que `useAuthStore` dentro do guard?"

    O guard é definido fora do ciclo de vida dos componentes Vue. Para ter acesso ao Pinia, a store precisa ser instanciada no momento em que o guard é executado — não na definição do arquivo. Por isso a chamada `useAuthStore()` fica **dentro** do callback, não no escopo externo.

## 4.3 Adicionando o botão de logout no cabeçalho

Atualize o `src/components/AppHeader.vue`:

```vue title="src/components/AppHeader.vue" linenums="1" hl_lines="7-12 20 23 25-28"
<template>
  <header class="app-header">
    <h1>Meus gestor de Tarefas!!!!</h1>
    <nav>
      <router-link to="/">Início</router-link>
      <router-link to="/about">Sobre</router-link>
      <button
        v-if="authStore.isAuthenticated"
        class="logout-btn"
        @click="handleLogout"
      >
        Sair
      </button>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
```

**Linha 7 – `v-if="authStore.isAuthenticated"`**
O botão só aparece quando o usuário está logado. Como `isAuthenticated` é um computed reativo, o Vue remove o botão automaticamente após o logout, sem precisar de nenhuma lógica adicional no template.

**`handleLogout`**
Chama `authStore.logout()` — que limpa tokens do state e do `localStorage` — e depois redireciona para `/login`. O guard do router garantirá que o usuário não consiga voltar para `/` sem autenticar de novo.

## Resumo do passo

Neste passo, você:

- Criou a `LoginView` com formulário, feedback de erro e redirecionamento pós-login
- Configurou as rotas com `meta.requiresAuth` e o `beforeEach` guard
- Adicionou o botão de logout condicional no `AppHeader`

Com isso, o fluxo completo de autenticação está implementado:

| Situação                       | Comportamento                                             |
| ------------------------------ | --------------------------------------------------------- |
| Usuário não logado acessa `/`  | Redirecionado para `/login`                               |
| Login com credenciais corretas | Tokens salvos, redirecionado para `/`                     |
| Login com credenciais erradas  | Mensagem de erro exibida na tela                          |
| Access token expirado          | Interceptor renova automaticamente e reemite a requisição |
| Refresh token expirado         | Logout automático e redirecionamento para `/login`        |
| Usuário clica em "Sair"        | Tokens removidos, redirecionado para `/login`             |

---

**Anterior:** [Passo 3 – Interceptors e Axios](03-interceptors.md) | **Próximo:** [Atividades práticas](../atividades-praticas.md)
