# Tutorial prático: autenticação de ponta a ponta

## Visão geral

Neste tutorial, vamos evoluir o projeto `registro-atividades-pwa` a partir do estado final da Unidade 6. O objetivo é adicionar autenticação completa: login, proteção de rotas, envio automático do token e logout.

Ao final, cada usuário terá seu próprio espaço de tarefas. Sem login, a aplicação redireciona para a tela de login. Com login, todas as requisições ao backend incluem automaticamente o token no cabeçalho `Authorization`.

## O backend

A versão `3.0` do backend adiciona o módulo de autenticação. Pare o container anterior e inicie com a nova versão:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:3.0
```

Acesse `http://localhost:8001/docs` para confirmar que o servidor está no ar. Você verá três grupos de endpoints:

- **auth** – endpoints de registro, login e refresh de token
- **tasks** – os mesmos de antes, agora protegidos (exigem token)
- **uploads** – upload de imagens, também protegido

## Estrutura do tutorial

| Passo | Conteúdo                                       |
| ----- | ---------------------------------------------- |
| 1     | [Preparação do ambiente](01-preparacao.md)     |
| 2     | [A store de autenticação](02-auth-store.md)    |
| 3     | [Interceptors e Axios](03-interceptors.md)     |
| 4     | [Login, guards e logout](04-login-e-guards.md) |

## O que muda no projeto

| Arquivo                        | Ação      |
| ------------------------------ | --------- |
| `src/api/authApi.js`           | Criar     |
| `src/stores/auth.js`           | Criar     |
| `src/views/LoginView.vue`      | Criar     |
| `src/api/config.js`            | Modificar |
| `src/router/index.js`          | Modificar |
| `src/components/AppHeader.vue` | Modificar |

---

**Anterior:** [Onde guardar o token](../armazenamento-cliente.md) | **Próximo:** [Passo 1 – Preparação do ambiente](01-preparacao.md)
