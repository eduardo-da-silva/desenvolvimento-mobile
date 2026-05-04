# Passo 2 – A store de autenticação

## Objetivo

Neste passo, vamos criar a camada de API de autenticação e a store Pinia que centraliza o estado do usuário logado.

## 2.1 Criando a camada de API

Crie o arquivo `src/api/authApi.js`. Seguindo o padrão já estabelecido com `tasksApi.js`, este módulo encapsula as chamadas ao backend relacionadas à autenticação:

```javascript title="src/api/authApi.js" linenums="1"
import apiClient from './config';

export default {
  login(email, password) {
    return apiClient.post('/api/token', { email, password });
  },
};
```

Por enquanto, apenas o `login` é necessário. O refresh token será chamado diretamente no interceptor do Axios, que criaremos no próximo passo.

## 2.2 Criando a store de autenticação

Crie o arquivo `src/stores/auth.js`:

```javascript title="src/stores/auth.js" linenums="1"
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import authApi from '../api/authApi';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('access_token'));
  const refreshToken = ref(localStorage.getItem('refresh_token'));

  const isAuthenticated = computed(() => !!accessToken.value);

  async function login(email, password) {
    const { data } = await authApi.login(email, password);
    accessToken.value = data.access_token;
    refreshToken.value = data.refresh_token;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
  }

  function logout() {
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  return { accessToken, refreshToken, isAuthenticated, login, logout };
});
```

### State

**Linha 6 – `accessToken`**
Inicializado lendo diretamente do `localStorage`. Se o usuário já tinha feito login antes de recarregar a página, o token estará disponível imediatamente — sem precisar de login novamente.

**Linha 7 – `refreshToken`**
O mesmo padrão. Ambos os tokens são carregados na inicialização.

### Computed

**Linha 9 – `isAuthenticated`**
Um computed derivado: vale `true` se `accessToken` tem algum valor, `false` se for `null`. É esse valor que o router e o header vão consultar para decidir o que exibir.

### Actions

**`login(email, password)`**
Chama a API, recebe os dois tokens e os salva em dois lugares simultaneamente: no state reativo (para que os componentes que usam a store reajam) e no `localStorage` (para que a sessão persista entre recargas).

**`logout()`**
Operação inversa: zera o state e remove as chaves do `localStorage`. Após o logout, `isAuthenticated` passa a ser `false` e o navigation guard redirecionará automaticamente para o login.

## Resumo do passo

Neste passo, você criou:

| Arquivo              | O que faz                                              |
| -------------------- | ------------------------------------------------------ |
| `src/api/authApi.js` | Encapsula a chamada a `POST /api/token`                |
| `src/stores/auth.js` | Gerencia tokens, `isAuthenticated`, `login` e `logout` |

---

**Anterior:** [Passo 1 – Preparação do ambiente](01-preparacao.md) | **Próximo:** [Passo 3 – Interceptors e Axios](03-interceptors.md)
