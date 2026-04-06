# REST e HTTP

## O que é HTTP

HTTP (_HyperText Transfer Protocol_) é o protocolo de comunicação usado na web. Quando o seu navegador carrega uma página, está fazendo uma requisição HTTP. Quando a aplicação busca dados de um servidor, também usa HTTP.

Uma requisição HTTP tem:

- **Método (verbo)**: o que você quer fazer (buscar, criar, alterar, remover)
- **URL**: o endereço do recurso
- **Cabeçalhos (headers)**: informações sobre a requisição, como o tipo do conteúdo
- **Corpo (body)**: dados enviados junto com a requisição (nem toda requisição tem corpo)

A resposta do servidor inclui:

- **Status code**: um número que indica o resultado
- **Cabeçalhos**: informações sobre a resposta
- **Corpo**: os dados retornados (normalmente em JSON)

## O que é REST

REST (_Representational State Transfer_) é um estilo de arquitetura para APIs. Uma API REST organiza os recursos em URLs e usa os verbos HTTP para indicar a operação desejada.

Um "recurso" é qualquer coisa que a API gerencia. No nosso caso, o recurso é a **tarefa**. A API expõe esse recurso em uma URL (`/tasks`) e define quais operações são possíveis sobre ele.

## Verbos HTTP

Os quatro verbos que usaremos:

| Verbo    | Uso                            | Tem body? |
| -------- | ------------------------------ | --------- |
| `GET`    | Buscar dados                   | Não       |
| `POST`   | Criar um novo recurso          | Sim       |
| `PATCH`  | Atualizar campos de um recurso | Sim       |
| `DELETE` | Remover um recurso             | Não       |

Aplicados à API de tarefas:

| Verbo    | URL           | O que faz                           |
| -------- | ------------- | ----------------------------------- |
| `GET`    | `/tasks`      | Retorna a lista de todas as tarefas |
| `POST`   | `/tasks`      | Cria uma nova tarefa                |
| `PATCH`  | `/tasks/{id}` | Atualiza título ou status da tarefa |
| `DELETE` | `/tasks/{id}` | Remove a tarefa com o id informado  |

## Status codes

O servidor sempre responde com um número que indica o que aconteceu:

| Código | Significado           | Quando aparece                                            |
| ------ | --------------------- | --------------------------------------------------------- |
| `200`  | OK                    | Requisição bem-sucedida com dados retornados              |
| `201`  | Created               | Recurso criado com sucesso (resposta ao `POST`)           |
| `204`  | No Content            | Operação concluída sem dados para retornar (ex: `DELETE`) |
| `404`  | Not Found             | O recurso com o id informado não existe                   |
| `422`  | Unprocessable Entity  | Os dados enviados são inválidos (ex: `title` vazio)       |
| `500`  | Internal Server Error | Erro inesperado no servidor                               |

## JSON

A comunicação entre o frontend e o backend usa JSON (_JavaScript Object Notation_). É um formato de texto que representa objetos JavaScript.

Quando o frontend cria uma tarefa, envia:

```json
{
  "title": "Estudar Vue.js"
}
```

O servidor responde com a tarefa criada, incluindo o `id` gerado:

```json
{
  "id": 1,
  "title": "Estudar Vue.js",
  "done": false
}
```

Quando o frontend busca todas as tarefas com `GET /tasks`, recebe um array:

```json
[
  { "id": 1, "title": "Estudar Vue.js", "done": false },
  { "id": 2, "title": "Configurar o Service Worker", "done": true }
]
```

## O backend do projeto

O backend que usaremos nesta unidade é uma API REST construída com FastAPI. Você não precisa conhecer o código — ele funciona como uma caixa-preta. Basta rodá-lo via Docker:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:1.0
```

Esse comando baixa a imagem e inicia o servidor na porta 8001. As requisições serão feitas para `http://localhost:8001`.

### Explorando a documentação automática

O FastAPI gera automaticamente uma interface interativa para testar os endpoints. Acesse:

```
http://localhost:8001/docs
```

Você verá todos os endpoints disponíveis e poderá executá-los diretamente pelo navegador, sem precisar escrever nenhum código.

Para testar um `POST /tasks`:

1. Clique em `POST /tasks`
2. Clique em "Try it out"
3. No corpo da requisição, coloque `{ "title": "Minha tarefa de teste" }`
4. Clique em "Execute"
5. Observe o status `201` e o objeto retornado com o `id` gerado

Em seguida, faça um `GET /tasks` e veja a tarefa na lista.

---

**Anterior:** [Unidade 5 – Integração com Backend](index.md) | **Próximo:** [Arquitetura em camadas](arquitetura-camadas.md)
