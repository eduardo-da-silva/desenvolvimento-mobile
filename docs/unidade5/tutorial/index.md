# Tutorial prático: integrando o frontend ao backend

## Visão geral

Neste tutorial, vamos evoluir o projeto `registro-atividades-pwa` criado na Unidade 4. O aplicativo já tem interface, roteamento e suporte a PWA. O que falta é persistência real: as tarefas somem ao recarregar a página porque ficam em memória.

Ao conectar o frontend a um backend via API REST, as tarefas passarão a ser salvas num banco de dados. O comportamento do usuário não muda — o que muda é como os dados são armazenados e recuperados.

## O backend

O backend já está pronto e disponível como imagem Docker. Você não precisa conhecer o código — basta rodá-lo:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:1.0
```

O servidor inicia na porta 8001. A documentação dos endpoints fica em:

```
http://localhost:8001/docs
```

## Estrutura do tutorial

| Passo | Conteúdo                                                  |
| ----- | --------------------------------------------------------- |
| 1     | [Preparação do ambiente](01-preparacao.md)                |
| 2     | [Camada de acesso à API](02-camada-api.md)                |
| 3     | [Store com Pinia](03-pinia-store.md)                      |
| 4     | [Integrando os componentes](04-integrando-componentes.md) |

## O que muda no projeto

O projeto atual usa um composable (`src/composables/useTasks.js`) que mantém as tarefas em um array reativo local. Vamos substituir isso por:

- Uma **camada de API** (`src/api/`) que faz as requisições HTTP
- Um **store Pinia** (`src/stores/tasks.js`) que gerencia o estado e chama a camada de API

Os componentes `TaskItem.vue` e `TaskForm.vue` também receberão ajustes para suportar edição de título.

---

**Anterior:** [Arquitetura em camadas](../arquitetura-camadas.md) | **Próximo:** [Passo 1 – Preparação do ambiente](01-preparacao.md)
