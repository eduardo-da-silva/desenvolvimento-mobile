# Tutorial prático: adicionando upload de imagens

## Visão geral

Neste tutorial, vamos evoluir o projeto `registro-atividades-pwa` a partir do estado final da Unidade 5. O objetivo é permitir que, ao editar uma tarefa, o usuário possa anexar uma imagem. A imagem aparece como miniatura ao lado do título na lista de tarefas.

O backend foi atualizado e já suporta o recurso. No frontend, cinco arquivos serão alterados.

## O backend

A nova versão do backend está disponível como imagem Docker. Pare o container da versão anterior (se estiver rodando) e inicie com a versão `2.0`:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:2.0
```

Acesse `http://localhost:8001/docs` para confirmar que o servidor está no ar. Você verá dois grupos de endpoints:

- **tasks** – os mesmos de antes, mas agora `GET /tasks` e `PATCH /tasks/{id}` incluem `img_url` no retorno
- **uploads** – novo endpoint `POST /uploads/images/` para envio de arquivos

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
