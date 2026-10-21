# Tutorial prático: adicionando upload de imagens

## Visão geral

Neste tutorial, vamos evoluir o projeto `registro-atividades-pwa` a partir do estado final da Unidade 5. O objetivo é permitir que, ao editar uma tarefa, o usuário possa anexar uma imagem. A imagem aparece como miniatura ao lado do título na lista de tarefas.

O backend já suporta o recurso — é a mesma imagem `:latest` de sempre. No frontend, cinco arquivos serão alterados.

## O backend

Continuamos com o mesmo container `registro-atividades-api` criado na Unidade 5. Se ele não estiver rodando, inicie-o:

```bash
docker start registro-atividades-api
```

Acesse `http://localhost:8001/docs` para confirmar que o servidor está no ar. Entre os grupos de endpoints, dois interessam a esta unidade:

- **tasks** – `GET /tasks` e `PATCH /tasks/{id}` retornam também o campo `img_url`
- **uploads** – o endpoint `POST /uploads/images/` para envio de arquivos

## Estrutura do tutorial

| Passo | Conteúdo                                              |
| ----- | ----------------------------------------------------- |
| 1     | [Preparação do ambiente](01-preparacao.md)            |
| 2     | [Método de upload na camada de API](02-api-upload.md) |
| 3     | [Atualizando o store](03-store.md)                    |
| 4     | [Atualizando os componentes](04-componentes.md)       |

## O que muda no projeto

Todos os arquivos modificados já existem. Nenhum arquivo novo será criado no frontend.

| Arquivo                       | O que muda                                                  |
| ----------------------------- | ----------------------------------------------------------- |
| `src/api/tasksApi.js`         | Novo método `uploadImage(file)`                             |
| `src/stores/tasks.js`         | `updateTaskTitle` → `updateTask`, recebe `imgAttachmentKey` |
| `src/components/TaskItem.vue` | Miniatura de imagem condicional                             |
| `src/components/TaskForm.vue` | Seção de upload com pré-visualização                        |
| `src/views/HomeView.vue`      | `handleUpdate` passa o terceiro argumento ao store          |

---

**Anterior:** [Uploads e multipart/form-data](../upload-e-multipart.md) | **Próximo:** [Passo 1 – Preparação do ambiente](01-preparacao.md)
