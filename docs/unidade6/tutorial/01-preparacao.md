# Passo 1 – Preparação do ambiente

## Objetivo

Neste passo, vamos trocar a versão do backend, verificar os novos endpoints disponíveis e entender o que vai mudar no projeto.

## Atualizando o backend

O backend da Unidade 5 (`1.0`) não possui suporte a imagens. A versão `2.0` adiciona o módulo de upload e estende o modelo de tarefa com o campo `img_url`.

Se o container anterior ainda estiver rodando, pare-o:

??? warning "Parando o container antigo"

    ```bash
    docker ps                          # anota o CONTAINER ID do container rodando
    docker stop <CONTAINER_ID>
    ```

Inicie o novo container:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:2.0
```

Acesse `http://localhost:8001/docs`. A documentação agora exibe dois grupos de endpoints:

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

    A versão `2.0` cria automaticamente as tabelas necessárias ao iniciar — incluindo a nova tabela `images`. Se você tinha tarefas salvas com a versão `1.0`, elas continuarão lá; só o campo `img_url` estará vazio (`null`) nelas.

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

- Substituiu o container Docker pela versão `2.0` do backend
- Verificou os novos endpoints no Swagger
- Entendeu o que vai mudar ao longo do tutorial

---

**Anterior:** [Visão geral do tutorial](index.md) | **Próximo:** [Passo 2 – Método de upload na camada de API](02-api-upload.md)
