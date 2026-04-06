# Arquitetura em camadas

## O problema de misturar tudo

É tecnicamente possível fazer uma requisição HTTP direto dentro de um componente Vue:

```vue title="Exemplo do que NÃO fazer"
<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

const tasks = ref([]);

onMounted(async () => {
  const response = await axios.get('http://localhost:8001/tasks');
  tasks.value = response.data;
});

async function addTask(title) {
  const response = await axios.post('http://localhost:8001/tasks', { title });
  tasks.value.push(response.data);
}
</script>
```

Isso funciona. Mas à medida que o projeto cresce, surgem problemas:

- A URL do backend está repetida em vários componentes
- Se a URL mudar, você precisa editar vários arquivos
- Outros componentes que precisam das mesmas tarefas refazem a requisição ou ficam sem acesso
- Lógica de negócio (tratar erros, filtrar dados) fica misturada com lógica de interface
- Difícil de testar qualquer parte de forma isolada

A solução é separar o código em camadas com responsabilidades claras.

## As três camadas

```
┌─────────────────────────────────────┐
│         Componentes Vue             │  ← exibem e interagem com o usuário
│   (TaskItem, TaskForm, HomeView)    │
└────────────────┬────────────────────┘
                 │ usa
┌────────────────▼────────────────────┐
│           Store (Pinia)             │  ← gerencia o estado da aplicação
│         src/stores/tasks.js         │
└────────────────┬────────────────────┘
                 │ usa
┌────────────────▼────────────────────┐
│         Camada de API               │  ← faz as requisições HTTP
│   src/api/config.js                 │
│   src/api/tasksApi.js               │
└────────────────┬────────────────────┘
                 │
         [ Backend REST ]
```

### Camada de API — `src/api/`

Responsabilidade: saber como se comunicar com o servidor.

- Configurar a URL base e os cabeçalhos padrão
- Mapear cada operação para um endpoint (método + URL)
- Não conhece Vue, não conhece Pinia, não manipula estado

Essa camada tem dois arquivos: `config.js` (a instância do axios configurada) e `tasksApi.js` (os métodos de cada operação).

### Store — `src/stores/tasks.js`

Responsabilidade: gerenciar o estado das tarefas na aplicação.

- Armazenar a lista de tarefas de forma reativa
- Chamar a camada de API e atualizar o estado com os dados retornados
- Expor getters (ex: tarefas pendentes, tarefas concluídas)
- Gerenciar estados de carregamento e erro

O store usa Pinia, que é a biblioteca oficial de gerenciamento de estado para Vue 3.

### Componentes Vue

Responsabilidade: exibir dados e capturar interações do usuário.

- Leem dados do store
- Chamam ações do store
- Nunca chamam diretamente a camada de API
- Nunca usam axios diretamente

Essa regra mantém os componentes simples. Se a forma de buscar dados mudar, só o store e a camada de API precisam ser alterados.

## Por que Pinia

O Pinia é a biblioteca de gerenciamento de estado recomendada para Vue 3. Ele usa a Composition API, o que torna o código familiar para quem já trabalha com Vue 3.

Com Pinia, o estado definido em um store é reativo e compartilhado entre todos os componentes que o usam. Se a lista de tarefas for atualizada no store, todos os componentes que exibem essa lista são atualizados automaticamente.

## Visão geral dos arquivos

Ao longo do tutorial, vamos criar e modificar os seguintes arquivos:

| Arquivo                       | Ação      | O que faz                                   |
| ----------------------------- | --------- | ------------------------------------------- |
| `src/api/config.js`           | Criar     | Instância do axios com URL base configurada |
| `src/api/tasksApi.js`         | Criar     | Métodos para cada endpoint da API           |
| `src/stores/tasks.js`         | Criar     | Store Pinia com estado, getters e actions   |
| `src/main.js`                 | Modificar | Registrar o Pinia na aplicação              |
| `src/views/HomeView.vue`      | Modificar | Usar o store em vez do composable local     |
| `src/components/TaskItem.vue` | Modificar | Adicionar botão de edição de título         |
| `src/components/TaskForm.vue` | Modificar | Suportar modo de edição                     |
| `src/composables/useTasks.js` | Remover   | Substituído pelo store                      |
| `vite.config.js`              | Modificar | URL da API no cache do Workbox              |

---

**Anterior:** [REST e HTTP](rest-e-http.md) | **Próximo:** [Tutorial prático](tutorial/index.md)
