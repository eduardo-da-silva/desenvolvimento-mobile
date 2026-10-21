# Passo 1 – Preparação do ambiente

## Objetivo

Neste passo, vamos confirmar que o backend está no ar, verificar o endpoint de upload no Swagger e entender o que vai mudar no projeto.

## Conferindo o backend

Desde a Unidade 5 usamos a imagem `:latest`, que **já inclui** o módulo de upload e o campo `img_url` no modelo de tarefa. Não é preciso trocar de imagem.

Se o container `registro-atividades-api` não estiver rodando, inicie-o:

```bash
docker start registro-atividades-api
```

Se ele não existir mais (`docker ps -a` não o lista), recrie-o:

```bash
docker run -d --name registro-atividades-api -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:latest
```

Acesse `http://localhost:8001/docs`. Entre os grupos exibidos, dois interessam a esta unidade:

**tasks**

| Método   | Rota          | O que faz                                    |
| -------- | ------------- | -------------------------------------------- |
| `GET`    | `/tasks`      | Lista todas as tarefas (agora com `img_url`) |
| `POST`   | `/tasks`      | Cria uma tarefa                              |
| `PATCH`  | `/tasks/{id}` | Atualiza título, status e/ou imagem          |
| `DELETE` | `/tasks/{id}` | Remove uma tarefa                            |

**uploads**

| Método | Rota               | O que faz                                                |
| ------ | ------------------ | -------------------------------------------------------- |
| `POST` | `/uploads/images/` | Recebe um arquivo JPEG ou PNG e retorna `attachment_key` |

## Verificando os novos campos no Swagger

Para confirmar que o backend está funcionando corretamente, faça um teste manual no Swagger:

1. No grupo **uploads**, clique em `POST /uploads/images/` → **Try it out**
2. Selecione um arquivo JPEG ou PNG no campo `file`
3. Clique em **Execute**
4. O retorno deve ter status `201` e um corpo parecido com:

```json
{
  "attachment_key": "550e8400-e29b-41d4-a716-446655440000",
  "description": null,
  "uploaded_on": "2026-04-22T10:30:00Z",
  "url": "http://localhost:8001/media/images/a1b2c3d4.jpg"
}
```

Guarde o valor de `attachment_key`. Ele pode ser passado ao endpoint `PATCH /tasks/{id}` para vincular a imagem a uma tarefa.

!!! note "O banco de dados"

    O banco é o mesmo desde a Unidade 5. As tarefas que você já criou continuam lá — apenas com o campo `img_url` vazio (`null`) até você anexar uma imagem.

## O que vamos alterar

Nenhuma dependência nova precisa ser instalada. Todas as mudanças são nos arquivos existentes do projeto:

| Arquivo                       | Ação      |
| ----------------------------- | --------- |
| `src/api/tasksApi.js`         | Modificar |
| `src/stores/tasks.js`         | Modificar |
| `src/components/TaskItem.vue` | Modificar |
| `src/components/TaskForm.vue` | Modificar |
| `src/views/HomeView.vue`      | Modificar |

## Resumo do passo

Neste passo, você:

- Confirmou que o backend (imagem `:latest`) está rodando
- Verificou o endpoint de upload no Swagger
- Entendeu o que vai mudar ao longo do tutorial

---

**Anterior:** [Visão geral do tutorial](index.md) | **Próximo:** [Passo 2 – Método de upload na camada de API](02-api-upload.md)
