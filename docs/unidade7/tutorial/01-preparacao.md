# Passo 1 – Preparação do ambiente

## Objetivo

Neste passo, vamos atualizar o backend para a versão com autenticação, explorar os novos endpoints no Swagger e criar o primeiro usuário para testar o fluxo completo.

## Atualizando o backend

A versão `2.0` do backend não possui autenticação. A versão `3.0` adiciona o módulo de usuários e protege todos os endpoints de `/tasks`.

Se o container anterior ainda estiver rodando, pare-o:

??? warning "Parando o container antigo"

    ```bash
    docker ps                          # anota o CONTAINER ID do container rodando
    docker stop <CONTAINER_ID>
    ```

Inicie o novo container:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:3.0
```

!!! warning "Banco de dados zerado"

    A versão `3.0` adiciona a tabela `users` e uma coluna `user_id` obrigatória em `tasks`. Isso é incompatível com dados criados pela versão anterior. O banco é criado do zero ao iniciar — **as tarefas salvas anteriormente não serão migradas**.

## Explorando os endpoints no Swagger

Acesse `http://localhost:8001/docs`. Você verá três grupos de endpoints:

**auth**

| Método | Rota                  | O que faz                                            |
| ------ | --------------------- | ---------------------------------------------------- |
| `POST` | `/api/users/register` | Cria um novo usuário com email e senha               |
| `POST` | `/api/token`          | Recebe email e senha, retorna access + refresh token |
| `POST` | `/api/token/refresh`  | Recebe refresh token, retorna novo par de tokens     |

**tasks**

| Método   | Rota          | O que faz                               |
| -------- | ------------- | --------------------------------------- |
| `GET`    | `/tasks`      | Lista as tarefas do usuário autenticado |
| `POST`   | `/tasks`      | Cria uma tarefa para o usuário logado   |
| `PATCH`  | `/tasks/{id}` | Atualiza título, status e/ou imagem     |
| `DELETE` | `/tasks/{id}` | Remove uma tarefa                       |

**uploads**

| Método | Rota               | O que faz                          |
| ------ | ------------------ | ---------------------------------- |
| `POST` | `/uploads/images/` | Envia um arquivo e retorna a chave |

## Criando o primeiro usuário

Antes de testar os endpoints protegidos, é preciso criar um usuário. Faça isso direto pelo Swagger:

1. No grupo **auth**, clique em `POST /api/users/register` → **Try it out**
2. No corpo da requisição, preencha com o seu email e uma senha:

```json
{
  "email": "usuario@exemplo.com",
  "password": "minhasenha123"
}
```

3. Clique em **Execute**
4. O retorno deve ter status `201` e o objeto do usuário criado:

```json
{
  "id": 1,
  "email": "usuario@exemplo.com"
}
```

## Obtendo um token no Swagger

Com o usuário criado, faça o login:

1. No grupo **auth**, clique em `POST /api/token` → **Try it out**
2. Preencha com as credenciais criadas no passo anterior:

```json
{
  "email": "usuario@exemplo.com",
  "password": "minhasenha123"
}
```

3. Clique em **Execute**
4. O retorno terá dois tokens:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

Copie o valor de `access_token`.

## Autorizando no Swagger

1. Clique no botão **Authorize** (canto superior direito da página)
2. Cole o access token no campo **Value**
3. Clique em **Authorize** e depois em **Close**

Agora tente um `GET /tasks`. Com o token, a resposta será `200` com a lista (vazia por enquanto). Sem o token, o Swagger retorna `401 Unauthorized`.

## O que vamos alterar no frontend

Nenhuma dependência nova precisa ser instalada. As mudanças são nos arquivos do projeto:

| Arquivo                        | Ação      |
| ------------------------------ | --------- |
| `src/api/authApi.js`           | Criar     |
| `src/stores/auth.js`           | Criar     |
| `src/views/LoginView.vue`      | Criar     |
| `src/api/config.js`            | Modificar |
| `src/router/index.js`          | Modificar |
| `src/components/AppHeader.vue` | Modificar |

## Resumo do passo

Neste passo, você:

- Substituiu o container Docker pela versão `3.0` do backend
- Explorou os novos endpoints de autenticação no Swagger
- Criou um usuário e obteve um token de acesso
- Verificou que os endpoints de tarefas agora exigem autenticação

---

**Anterior:** [Visão geral do tutorial](index.md) | **Próximo:** [Passo 2 – A store de autenticação](02-auth-store.md)
