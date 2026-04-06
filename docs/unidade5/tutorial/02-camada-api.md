# Passo 2 – Camada de acesso à API

## Objetivo

Neste passo, vamos criar a camada de API. Ela é responsável por toda a comunicação com o backend — configurar a URL base, os cabeçalhos e mapear cada operação para um endpoint.

## Configurando o axios

Crie o arquivo `src/api/config.js`:

```javascript title="src/api/config.js" linenums="1"
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

O `axios.create()` cria uma instância com configurações padrão. Toda requisição feita com `apiClient` usará automaticamente a `baseURL` definida aqui, sem precisar repetir o endereço em cada chamada.

A URL base vem da variável de ambiente `VITE_API_BASE_URL`. Se ela não estiver definida — como no desenvolvimento local — o valor padrão `http://localhost:8001` é usado. Isso facilita mudar o endereço ao fazer o deploy sem alterar o código.

## Mapeando os endpoints

Crie o arquivo `src/api/tasksApi.js`:

```javascript title="src/api/tasksApi.js" linenums="1"
import apiClient from './config.js';

const tasksApi = {
  getAll() {
    return apiClient.get('/tasks');
  },

  create(title) {
    return apiClient.post('/tasks', { title });
  },

  update(id, data) {
    return apiClient.patch(`/tasks/${id}`, data);
  },

  remove(id) {
    return apiClient.delete(`/tasks/${id}`);
  },
};

export default tasksApi;
```

Cada método corresponde a um endpoint:

| Método             | Requisição           | Retorno esperado            |
| ------------------ | -------------------- | --------------------------- |
| `getAll()`         | `GET /tasks`         | Array de tarefas            |
| `create(title)`    | `POST /tasks`        | Tarefa criada com `id`      |
| `update(id, data)` | `PATCH /tasks/{id}`  | Tarefa atualizada           |
| `remove(id)`       | `DELETE /tasks/{id}` | Sem conteúdo (status `204`) |

O parâmetro `data` em `update()` é um objeto com os campos a alterar — pode ser `{ done: true }` para marcar como concluída, `{ title: "Novo título" }` para editar o nome, ou os dois juntos.

Esse objeto não conhece Vue e não usa nenhuma reatividade. Ele só sabe fazer requisições HTTP.

## Atualizando o cache do Workbox

O `vite.config.js` configurado na Unidade 4 tem uma entrada de `runtimeCaching` com uma URL de exemplo. Substitua essa entrada para que o Workbox saiba cachear as respostas da API com a estratégia `NetworkFirst`:

```javascript title="vite.config.js" hl_lines="2"
{
  urlPattern: /^http:\/\/localhost:8001\/.*/i,
  handler: 'NetworkFirst',
  options: {
    cacheName: 'api-cache',
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 60 * 60 * 24, // 24 horas
    },
    networkTimeoutSeconds: 10,
    cacheableResponse: {
      statuses: [0, 200],
    },
  },
},
```

Com `NetworkFirst`, o Workbox tenta buscar os dados na rede. Se não conseguir (sem conexão ou timeout de 10 segundos), usa a versão em cache. Isso mantém o comportamento offline que já tínhamos.

## Resumo do passo

Neste passo, você:

- Criou `src/api/config.js` com a instância do axios configurada
- Criou `src/api/tasksApi.js` mapeando os quatro endpoints
- Atualizou o `vite.config.js` para cachear as respostas da API

---

**Anterior:** [Passo 1 – Preparação do ambiente](01-preparacao.md) | **Próximo:** [Passo 3 – Store com Pinia](03-pinia-store.md)
