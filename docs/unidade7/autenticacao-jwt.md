# Autenticação com JWT

## O problema do HTTP sem estado

HTTP é um protocolo _stateless_ — sem estado. Cada requisição é independente das anteriores. O servidor não sabe, por padrão, se a requisição que está chegando é do mesmo usuário que mandou a anterior.

Nas unidades anteriores, isso não era um problema porque qualquer pessoa podia acessar qualquer tarefa. Agora que queremos tarefas por usuário, precisamos de uma forma de identificar **quem** está fazendo cada requisição.

A solução mais clássica é a **sessão no servidor**: o servidor guarda um identificador na memória e o cliente envia esse identificador em cada requisição via cookie. Funciona, mas escala mal — cada servidor precisa conhecer as sessões, o que complica ambientes com múltiplos servidores.

A alternativa moderna é o **JWT**.

## O que é um JWT

JWT (_JSON Web Token_) é um formato de token que carrega informações assinadas digitalmente. Em vez de guardar a sessão no servidor, o servidor assina um token e o entrega ao cliente. O cliente guarda esse token e o envia em cada requisição. O servidor apenas verifica a assinatura — sem precisar consultar nenhum banco de dados ou memória compartilhada.

Um JWT tem três partes separadas por pontos:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzQ1MDAwMDAwLCJ0eXBlIjoiYWNjZXNzIn0.abc123assinatura
```

| Parte         | Conteúdo                                          | Visível? |
| ------------- | ------------------------------------------------- | -------- |
| **Header**    | Algoritmo usado na assinatura (ex: `HS256`)       | Sim      |
| **Payload**   | Dados do usuário: email, expiração, tipo do token | Sim      |
| **Signature** | Hash criptográfico que garante a integridade      | Não      |

!!! warning "O payload é público"

    As partes header e payload são apenas codificadas em Base64 — qualquer um com o token pode lê-las. **Nunca coloque senhas ou dados sensíveis no payload.** A segurança do JWT está na assinatura: sem a chave secreta do servidor, não é possível forjar um token válido.

## O token Bearer

Uma vez que o cliente tem o JWT, precisa enviá-lo ao servidor em cada requisição. O padrão é incluí-lo no cabeçalho HTTP `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

A palavra `Bearer` (portador) indica que quem tiver o token tem acesso. O servidor recebe o cabeçalho, verifica a assinatura do JWT e, se for válida, identifica o usuário pelo campo `sub` (subject) no payload.

É como um crachá de evento: quem apresenta o crachá entra. O crachá tem nome e data de validade impressos, e o organizador pode verificar se é genuíno — mas não precisa consultar uma lista central para isso.

## Access token e refresh token

Tokens com validade longa são um risco: se alguém roubar o token, tem acesso indefinido. Por isso, o padrão é usar dois tokens com ciclos de vida diferentes:

| Token             | Validade | Finalidade                                                     |
| ----------------- | -------- | -------------------------------------------------------------- |
| **Access token**  | 30 min   | Enviado em cada requisição protegida                           |
| **Refresh token** | 7 dias   | Usado apenas para obter um novo access token quando ele expira |

O fluxo é:

1. Usuário faz login → recebe access token + refresh token
2. Cada requisição usa o access token no cabeçalho `Authorization`
3. Quando o access token expira e o servidor responde `401`, o frontend usa o refresh token para pedir um novo access token
4. Se o refresh token também expirou (ou foi revogado), o usuário é redirecionado para o login

Esse modelo é muito semelhante ao funcionamento do `django-simple-jwt` — a referência que usamos para definir os endpoints deste backend.

## Os endpoints de autenticação

O backend desta unidade expõe três endpoints de autenticação:

| Método | Rota                  | O que faz                                            |
| ------ | --------------------- | ---------------------------------------------------- |
| `POST` | `/api/token`          | Recebe email e senha, retorna access + refresh token |
| `POST` | `/api/token/refresh`  | Recebe refresh token, retorna novo access + refresh  |
| `POST` | `/api/users/register` | Cria um novo usuário com email e senha               |

A partir desta unidade, todos os endpoints de `/tasks` também exigem o cabeçalho `Authorization: Bearer <token>` — sem ele, o servidor responde com `401 Unauthorized`.

---

**Anterior:** [Unidade 7 – Autenticação com JWT](index.md) | **Próximo:** [Onde guardar o token](armazenamento-cliente.md)
