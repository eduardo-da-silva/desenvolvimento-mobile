# Passo 3 – Interceptors e Axios

## Objetivo

Neste passo, vamos atualizar o `src/api/config.js` para que todas as requisições ao backend incluam automaticamente o token de autenticação — e para que tokens expirados sejam renovados de forma transparente.

## O problema que os interceptors resolvem

Sem interceptors, cada chamada na `tasksApi` precisaria incluir manualmente o cabeçalho `Authorization`. Isso seria repetitivo e frágil: qualquer nova função de API que esquecesse o cabeçalho quebraria silenciosamente.

Os interceptors do Axios permitem definir esse comportamento **uma única vez**: toda requisição que sair pelo `apiClient` recebe o token automaticamente, e toda resposta `401` é tratada de forma centralizada.

## O novo `config.js`

Substitua o conteúdo de `src/api/config.js`:

```javascript title="src/api/config.js" linenums="1"
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Injeta o access token em todas as requisições
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Em caso de 401, tenta renovar o token e reenviar a requisição original
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/api/token')
    ) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/token/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return apiClient(original);
        } catch {
          // refresh falhou — segue para o logout
        }
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

## Entendendo o interceptor de request

**Linhas 13–18 – Request interceptor**

Toda requisição que passar pelo `apiClient` executa essa função antes de ser enviada. Ela lê o token direto do `localStorage` (fonte da verdade) e, se existir, adiciona o cabeçalho `Authorization: Bearer <token>`. Requisições sem token saem sem o cabeçalho — o servidor responderá `401`.

## Entendendo o interceptor de response

**Linhas 21–53 – Response interceptor**

O Axios chama o segundo argumento quando a requisição falha. A lógica tem três condições para tentar o refresh:

| Condição                      | Por quê                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `status === 401`              | Só vale para "não autorizado"                                           |
| `!original._retry`            | Evita loop infinito: marca a requisição para não tentar refresh de novo |
| `!url.includes('/api/token')` | Não tenta refresh durante o próprio login ou refresh                    |

Se as três condições forem verdadeiras e houver um refresh token disponível, o interceptor:

1. Chama `POST /api/token/refresh` com o refresh token (usando `axios` puro, não o `apiClient`, para evitar que este interceptor intercepte a própria chamada de refresh)
2. Salva os novos tokens no `localStorage`
3. Reemite a requisição original com o novo access token

Se o refresh falhar, ou se não houver refresh token, os tokens são removidos do `localStorage` e o usuário é redirecionado para `/login`.

!!! note "Por que `window.location.href` e não `router.push`?"

    O `config.js` não tem acesso ao router do Vue — ele existe fora do contexto da aplicação. Usar `window.location.href` força um redirecionamento completo, o que também limpa o estado em memória da aplicação. É uma solução prática para esse cenário específico.

## Resumo do passo

Neste passo, você configurou dois interceptors no Axios:

| Interceptor | O que faz                                                    |
| ----------- | ------------------------------------------------------------ |
| Request     | Injeta `Authorization: Bearer <token>` em toda requisição    |
| Response    | Captura `401`, tenta refresh, reemite; se falhar, faz logout |

A partir de agora, nenhum código nas stores ou na camada de API precisa se preocupar com tokens — o `config.js` cuida disso automaticamente.

---

**Anterior:** [Passo 2 – A store de autenticação](02-auth-store.md) | **Próximo:** [Passo 4 – Login, guards e logout](04-login-e-guards.md)
