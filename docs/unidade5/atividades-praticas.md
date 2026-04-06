# Atividades Práticas – Unidade 5

Estas atividades complementam o tutorial de integração com backend. Elas foram pensadas para consolidar os conceitos e explorar situações próximas de um projeto real.

---

## Atividade 1 – Filtro de tarefas no frontend

**Objetivo:** praticar propriedades computadas no store Pinia.

**Contexto:** o app já separa as tarefas em "Pendentes" e "Concluídas" usando as computed `pendingTasks` e `completedTasks` do store. Adicione uma terceira computed que filtre as tarefas pelo texto digitado pelo usuário.

**O que implementar:**

1. No store `tasks.js`, adicione um estado `filterText = ref('')` e uma computed `filteredTasks` que retorne apenas as tarefas cujo `title` contenha o valor de `filterText` (sem diferenciar maiúsculas/minúsculas).
2. No `HomeView.vue`, adicione um campo `<input>` de busca ligado a `store.filterText` (use `v-model`).
3. Substitua o uso de `store.pendingTasks` e `store.completedTasks` nas listas por versões filtradas (aplique o filtro antes de separar por estado).

**Dica:** você pode compor as computeds. Exemplo:

```js
const filteredPendingTasks = computed(() =>
  pendingTasks.value.filter((t) =>
    t.title.toLowerCase().includes(filterText.value.toLowerCase()),
  ),
);
```

**Resultado esperado:** conforme o usuário digita no campo de busca, as listas são atualizadas em tempo real sem nenhuma requisição ao backend.

---

## Atividade 2 – Comportamento offline

**Objetivo:** observar como o app se comporta quando o backend fica indisponível.

**Contexto:** o app tem `OfflineBanner.vue` que detecta a conectividade de rede via `useOnlineStatus`. Mas "sem rede" e "backend fora do ar" são situações diferentes.

**O que observar:**

1. Com o frontend rodando (`npm run dev`) e o backend **parado**, tente adicionar uma tarefa.
   - O que aparece no campo `store.error`?
   - A tarefa fica na tela temporariamente ou some imediatamente?

2. Pare o backend e recarregue o app.
   - A tela fica em branco? A mensagem de erro é exibida?

3. Inicie o backend novamente e, sem recarregar o app, tente adicionar uma tarefa.
   - O que acontece?

**O que implementar:** adicione um botão **"Tentar novamente"** que chame `store.fetchTasks()` quando `store.error` estiver definido.

```vue
<div v-if="store.error" class="error-message">
  {{ store.error }}
  <button @click="store.fetchTasks()">Tentar novamente</button>
</div>
```

**Resultado esperado:** o usuário consegue recuperar o estado normal clicando em "Tentar novamente" após o backend ser reiniciado, sem precisar recarregar a página.

---

## Atividade 3 – Adicionando um campo de prioridade

**Objetivo:** exercitar alterações em múltiplas camadas (backend + frontend).

**Contexto:** as tarefas atualmente têm apenas `title` e `done`. Implemente um campo `priority` com valores `"baixa"`, `"normal"` ou `"alta"`.

**Backend (`registro-atividades-backend/`):**

1. Em `models.py`, adicione a coluna:
   ```python
   priority = Column(String, default="normal", nullable=False)
   ```
2. Em `schemas.py`, adicione o campo em `TaskCreate` e `TaskOut`:
   ```python
   priority: str = "normal"
   ```
3. Apague o arquivo `tasks.db` (o SQLAlchemy recriará o banco com a nova coluna ao reiniciar).

**Frontend (`registro-atividades-pwa/src/`):**

1. Em `api/tasksApi.js`, passe `priority` no corpo da requisição de criação:
   ```js
   create: (title, priority = 'normal') =>
     api.post('/tasks', { title, priority }),
   ```
2. Em `stores/tasks.js`, atualize `addTask` para aceitar `priority`:
   ```js
   async function addTask(title, priority = 'normal') {
     const { data } = await tasksApi.create(title, priority);
     tasks.value.push(data);
   }
   ```
3. Em `TaskForm.vue`, adicione um `<select>` com as três opções e passe o valor ao emitir `add`.
4. Em `TaskItem.vue`, exiba a prioridade ao lado do título (ou use uma classe CSS para colorir o item).

**Resultado esperado:** é possível criar tarefas com prioridade. A prioridade é persistida no banco e aparece após recarregar a página.

---

## Para saber mais

- [Documentação do Pinia](https://pinia.vuejs.org/)
- [Documentação do Axios](https://axios-http.com/docs/intro)
- [FastAPI – Tutorial oficial](https://fastapi.tiangolo.com/tutorial/)
- [SQLAlchemy – Core concepts](https://docs.sqlalchemy.org/en/20/core/)
- [Vue 3 – Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

---

**Anterior:** [4. Integrando os componentes](tutorial/04-integrando-componentes.md) | **Início da unidade:** [Unidade 5 – Integração com Backend](index.md)
