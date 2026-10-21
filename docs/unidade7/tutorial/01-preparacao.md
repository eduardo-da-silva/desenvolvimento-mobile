# Passo 1 – Preparação do ambiente

## Objetivo

Neste passo, vamos ativar a autenticação no frontend, explorar os endpoints de `auth` no Swagger e criar o primeiro usuário para testar o fluxo completo.

## Conferindo o backend

A imagem `:latest` já tem o módulo de autenticação — não é preciso trocar de container. Se o `registro-atividades-api` não estiver rodando:

```bash
docker start registro-atividades-api
```

!!! note "O que muda para os seus dados"

    Até agora, sem token, a API tratava você como um usuário `demo` compartilhado — foi ele o "dono" das tarefas que você criou nas Unidades 5 e 6. A partir do momento em que o frontend enviar o token de um usuário logado, a API passa a responder com a lista **daquele** usuário. Ao criar o seu usuário e entrar pela primeira vez, sua lista de tarefas aparece vazia: as tarefas do `demo` continuam no banco, mas não pertencem a você. Isso é esperado.

## Explorando os endpoints no Swagger

Acesse `http://localhost:8001/docs`. Entre os grupos de endpoints, três interessam a esta unidade:

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

Agora tente um `GET /tasks`. Com o token, a resposta é `200` com a lista **do seu usuário** (vazia por enquanto). Remova a autorização (**Authorize → Logout**) e repita: a resposta continua `200`, mas agora traz as tarefas do usuário `demo` — as que você criou nas unidades anteriores. O token não libera o acesso; ele define **de quem** são os dados.

!!! info "Quando o token passa a ser obrigatório"

    Nesta imagem, os endpoints de `/tasks` aceitam requisições sem token (usuário `demo`) para que as Unidades 5 e 6 funcionem antes desta. Em um cenário real, a API recusaria qualquer requisição sem token — comportamento que se obtém aqui iniciando o container com a variável `AUTH_OPTIONAL=0`.

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

- Confirmou que o backend (imagem `:latest`) está rodando
- Explorou os endpoints de autenticação no Swagger
- Criou um usuário e obteve um token de acesso
- Viu como o token muda qual usuário os endpoints de tarefas enxergam

---

**Anterior:** [Visão geral do tutorial](index.md) | **Próximo:** [Passo 2 – A store de autenticação](02-auth-store.md)
