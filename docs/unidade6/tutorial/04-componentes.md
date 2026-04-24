# Passo 4 – Atualizando os componentes

Chegamos ao último passo do tutorial. Neste passo, vamos atualizar os três componentes que precisam de mudanças para que o upload de imagens funcione de ponta a ponta.

---

## 4.1 Adicionando a miniatura no `TaskItem.vue`

O `TaskItem` exibe uma tarefa individual na lista. Com a nova versão do backend, o objeto de tarefa pode ter um campo `img_url` preenchido. Vamos exibir essa imagem como uma miniatura à esquerda do título.

### O que muda

Adicione a tag `<img>` condicional no início do template, antes do `<label>`:

```vue title="src/components/TaskItem.vue" linenums="1" hl_lines="3-8"
<template>
  <div class="task-item" :class="{ done: task.done }">
    <img
      v-if="task.img_url"
      :src="task.img_url"
      class="task-thumbnail"
      alt="Imagem da tarefa"
    />
    <label class="task-label">
      <input
        type="checkbox"
        :checked="task.done"
        @change="$emit('toggle', task.id)"
      />
      <span class="task-title">{{ task.title }}</span>
    </label>
    <div class="task-actions">
      <button class="task-edit" @click="$emit('edit', task)">Editar</button>
      <button class="task-remove" @click="$emit('remove', task.id)">
        Remover
      </button>
    </div>
  </div>
</template>
```

A diretiva `v-if="task.img_url"` garante que a imagem só aparece quando o campo está preenchido — tarefas sem imagem continuam exibidas normalmente.

Adicione os estilos para a miniatura ao final do bloco `<style scoped>`:

```vue title="src/components/TaskItem.vue"
<style scoped>
/* ... estilos existentes ... */

.task-thumbnail {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
  flex-shrink: 0;
}
</style>
```

`object-fit: cover` garante que a imagem preencha o quadrado sem distorção, cortando as bordas se necessário. `flex-shrink: 0` impede que a miniatura encolha quando o título for longo.

??? example "Código completo — src/components/TaskItem.vue"

    ```vue title="src/components/TaskItem.vue"
    <template>
      <div class="task-item" :class="{ done: task.done }">
        <img
          v-if="task.img_url"
          :src="task.img_url"
          class="task-thumbnail"
          alt="Imagem da tarefa"
        />
        <label class="task-label">
          <input type="checkbox" :checked="task.done" @change="$emit('toggle', task.id)" />
          <span class="task-title">{{ task.title }}</span>
        </label>
        <div class="task-actions">
          <button class="task-edit" @click="$emit('edit', task)">Editar</button>
          <button class="task-remove" @click="$emit('remove', task.id)">Remover</button>
        </div>
      </div>
    </template>

    <script setup>
    defineProps({
      task: {
        type: Object,
        required: true,
      },
    })

    defineEmits(['toggle', 'remove', 'edit'])
    </script>

    <style scoped>
    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background-color: white;
      border-radius: 8px;
      margin-bottom: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: opacity 0.2s;
      gap: 10px;
    }

    .task-thumbnail {
      width: 44px;
      height: 44px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid #eee;
      flex-shrink: 0;
    }

    .task-item.done {
      opacity: 0.6;
    }

    .task-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      flex: 1;
    }

    .task-label input[type='checkbox'] {
      width: 20px;
      height: 20px;
      accent-color: #4a90d9;
    }

    .task-title {
      font-size: 1rem;
    }

    .task-item.done .task-title {
      text-decoration: line-through;
      color: #999;
    }

    .task-remove {
      background: none;
      border: none;
      color: #e74c3c;
      cursor: pointer;
      font-size: 0.85rem;
      padding: 4px 8px;
    }

    .task-remove:hover {
      text-decoration: underline;
    }

    .task-actions {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .task-edit {
      background: none;
      border: none;
      color: #4a90d9;
      cursor: pointer;
      font-size: 0.85rem;
      padding: 4px 8px;
    }

    .task-edit:hover {
      text-decoration: underline;
    }
    </style>
    ```

---

## 4.2 Adicionando a seção de upload no `TaskForm.vue`

`TaskForm` é o componente que concentra as maiores mudanças. Quando o usuário está editando uma tarefa (ou seja, quando `editingTask` não é `null`), o formulário passa a exibir uma seção de upload com pré-visualização da imagem.

### Novos estados reativos

No bloco `<script setup>`, adicione três novas variáveis além das que já existem:

```vue title="src/components/TaskForm.vue" linenums="50" hl_lines="14-16"
<script setup>
import { ref, watch } from 'vue'
import tasksApi from '../api/tasksApi.js'

const props = defineProps({
  editingTask: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['add', 'update', 'cancel'])
const newTask = ref('')
const previewUrl = ref(null)
const imgAttachmentKey = ref(null)
const uploading = ref(false)
```

| Variável           | Uso                                                                         |
| ------------------ | --------------------------------------------------------------------------- |
| `previewUrl`       | URL local criada com `URL.createObjectURL()` para exibir a pré-visualização |
| `imgAttachmentKey` | Chave retornada pelo backend após o upload; enviada ao salvar a tarefa      |
| `uploading`        | `true` durante o upload; bloqueia o botão de submit e o input de arquivo    |

### Limpando os estados ao trocar de tarefa

O `watch` existente observa `editingTask` para preencher o campo de título. Adicione a limpeza dos novos estados dentro do mesmo `watch`:

```javascript title="src/components/TaskForm.vue" linenums="67" hl_lines="5-6"
watch(
  () => props.editingTask,
  (task) => {
    newTask.value = task ? task.title : '';
    previewUrl.value = null;
    imgAttachmentKey.value = null;
  },
);
```

Sempre que o usuário começa a editar uma tarefa diferente, os rastros da edição anterior são descartados: a pré-visualização some e a chave de imagem é zerada.

### A função de upload

Adicione a função `handleImageChange` que é chamada quando o usuário seleciona um arquivo:

```javascript title="src/components/TaskForm.vue" linenums="76"
async function handleImageChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  previewUrl.value = URL.createObjectURL(file);
  uploading.value = true;
  try {
    const response = await tasksApi.uploadImage(file);
    imgAttachmentKey.value = response.data.attachment_key;
  } catch (err) {
    console.error('Erro ao fazer upload da imagem', err);
    previewUrl.value = null;
    imgAttachmentKey.value = null;
  } finally {
    uploading.value = false;
  }
}
```

O fluxo é:

1. `event.target.files[0]` acessa o arquivo selecionado pelo `<input type="file">`.
2. `URL.createObjectURL(file)` cria uma URL temporária apontando para o arquivo ainda na memória do navegador. A pré-visualização aparece imediatamente, sem esperar o upload terminar.
3. `uploading.value = true` bloqueia interações enquanto a requisição está em andamento.
4. `tasksApi.uploadImage(file)` faz a requisição `POST /uploads/images/`. Ao concluir, a `attachment_key` retornada é guardada em `imgAttachmentKey`.
5. Se o upload falhar, a pré-visualização é revertida e a chave fica `null`, sinalizando que não há imagem para vincular.

### Passando a chave no submit

Atualize `handleSubmit` para incluir `imgAttachmentKey.value` no evento `update` e para limpar os estados ao finalizar:

```javascript title="src/components/TaskForm.vue" linenums="93" hl_lines="8 14-15"
function handleSubmit() {
  if (!newTask.value.trim()) return;
  if (props.editingTask) {
    emit(
      'update',
      props.editingTask.id,
      newTask.value.trim(),
      imgAttachmentKey.value,
    );
  } else {
    emit('add', newTask.value.trim());
  }
  newTask.value = '';
  previewUrl.value = null;
  imgAttachmentKey.value = null;
}
```

O terceiro argumento emitido é `imgAttachmentKey.value`. Se o usuário não fez upload de imagem, o valor será `null` — e o store, como visto no passo anterior, só incluirá esse campo no payload quando ele não for `null`.

`handleCancel` também precisa limpar os novos estados:

```javascript title="src/components/TaskForm.vue" linenums="110" hl_lines="3-4"
function handleCancel() {
  newTask.value = '';
  previewUrl.value = null;
  imgAttachmentKey.value = null;
  emit('cancel');
}
```

### A seção de imagem no template

Adicione o bloco `image-section` logo após a `.task-row` no template. Ele só aparece quando uma tarefa está sendo editada:

```vue title="src/components/TaskForm.vue" linenums="1" hl_lines="23-47"
<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <div class="task-row">
      <input
        v-model="newTask"
        type="text"
        placeholder="Nova tarefa..."
        class="task-input"
      />
      <button type="submit" class="task-button" :disabled="uploading">
        {{ editingTask ? 'Alterar' : 'Adicionar' }}
      </button>
      <button
        v-if="editingTask"
        type="button"
        class="task-button-cancel"
        @click="handleCancel"
      >
        Cancelar
      </button>
    </div>

    <div v-if="editingTask" class="image-section">
      <img
        v-if="previewUrl || editingTask.img_url"
        :src="previewUrl || editingTask.img_url"
        class="image-preview"
        alt="Imagem da tarefa"
      />
      <label class="image-label" :class="{ disabled: uploading }">
        <span v-if="uploading" class="upload-status">Enviando...</span>
        <span v-else>
          {{
            previewUrl || editingTask.img_url
              ? 'Trocar imagem'
              : 'Adicionar imagem'
          }}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png"
          class="image-input"
          :disabled="uploading"
          @change="handleImageChange"
        />
      </label>
    </div>
  </form>
</template>
```

Alguns pontos do template:

- **`:disabled="uploading"`** no botão de submit: impede que o usuário salve a tarefa enquanto o upload ainda não terminou. Sem isso, `imgAttachmentKey` poderia estar `null` no momento do submit mesmo que o usuário tenha selecionado uma imagem.
- **`:src="previewUrl || editingTask.img_url"`**: exibe o preview local se houver (`previewUrl`), caso contrário mostra a imagem já salva na tarefa (`editingTask.img_url`). Se nenhum dos dois existir, a tag `<img>` não é renderizada graças ao `v-if`.
- **`accept="image/jpeg,image/png"`**: restringe o seletor de arquivos do sistema operacional aos formatos aceitos pelo backend.
- **`class="image-input"` com `display: none`**: o `<input type="file">` nativo tem aparência inconsistente entre sistemas. Ocultá-lo e usar um `<label>` estilizado ao redor é a forma padrão de personalizar o botão de seleção.

??? example "Código completo — src/components/TaskForm.vue"

    ```vue title="src/components/TaskForm.vue" linenums="1"
    <template>
      <form class="task-form" @submit.prevent="handleSubmit">
        <div class="task-row">
          <input
            v-model="newTask"
            type="text"
            placeholder="Nova tarefa..."
            class="task-input"
          />
          <button type="submit" class="task-button" :disabled="uploading">
            {{ editingTask ? 'Alterar' : 'Adicionar' }}
          </button>
          <button
            v-if="editingTask"
            type="button"
            class="task-button-cancel"
            @click="handleCancel"
          >
            Cancelar
          </button>
        </div>

        <div v-if="editingTask" class="image-section">
          <img
            v-if="previewUrl || editingTask.img_url"
            :src="previewUrl || editingTask.img_url"
            class="image-preview"
            alt="Imagem da tarefa"
          />
          <label class="image-label" :class="{ disabled: uploading }">
            <span v-if="uploading" class="upload-status">Enviando...</span>
            <span v-else>
              {{ previewUrl || editingTask.img_url
                ? 'Trocar imagem'
                : 'Adicionar imagem'
              }}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              class="image-input"
              :disabled="uploading"
              @change="handleImageChange"
            />
          </label>
        </div>
      </form>
    </template>

    <script setup>
    import { ref, watch } from 'vue'
    import tasksApi from '../api/tasksApi.js'

    const props = defineProps({
      editingTask: {
        type: Object,
        default: null,
      },
    })

    const emit = defineEmits(['add', 'update', 'cancel'])
    const newTask = ref('')
    const previewUrl = ref(null)
    const imgAttachmentKey = ref(null)
    const uploading = ref(false)

    watch(
      () => props.editingTask,
      (task) => {
        newTask.value = task ? task.title : ''
        previewUrl.value = null
        imgAttachmentKey.value = null
      },
    )

    async function handleImageChange(event) {
      const file = event.target.files[0]
      if (!file) return
      previewUrl.value = URL.createObjectURL(file)
      uploading.value = true
      try {
        const response = await tasksApi.uploadImage(file)
        imgAttachmentKey.value = response.data.attachment_key
      } catch (err) {
        console.error('Erro ao fazer upload da imagem', err)
        previewUrl.value = null
        imgAttachmentKey.value = null
      } finally {
        uploading.value = false
      }
    }

    function handleSubmit() {
      if (!newTask.value.trim()) return
      if (props.editingTask) {
        emit(
          'update',
          props.editingTask.id,
          newTask.value.trim(),
          imgAttachmentKey.value
        )
      } else {
        emit( 'add', newTask.value.trim() )
      }
      newTask.value = ''
      previewUrl.value = null
      imgAttachmentKey.value = null
    }

    function handleCancel() {
      newTask.value = ''
      previewUrl.value = null
      imgAttachmentKey.value = null
      emit('cancel')
    }
    </script>

    <style scoped>
    .task-form {
      margin-bottom: 24px;
    }

    .task-row {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .task-input {
      flex: 1;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }

    .task-input:focus {
      border-color: #4a90d9;
    }

    .task-button {
      padding: 12px 20px;
      background-color: #4a90d9;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .task-button:hover:not(:disabled) {
      background-color: #357abd;
    }

    .task-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .task-button-cancel {
      padding: 12px 16px;
      background-color: transparent;
      color: #666;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .task-button-cancel:hover {
      border-color: #aaa;
    }

    .image-section {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px dashed #ccc;
    }

    .image-preview {
      width: 56px;
      height: 56px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid #ddd;
      flex-shrink: 0;
    }

    .image-label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: white;
      border: 1.5px solid #4a90d9;
      color: #4a90d9;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .image-label:hover:not(.disabled) {
      background: #eaf2fb;
    }

    .image-label.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .image-input {
      display: none;
    }

    .upload-status {
      color: #888;
    }
    </style>
    ```

---

## 4.3 Atualizando o `HomeView.vue`

A única mudança em `HomeView` é na função `handleUpdate`. Na Unidade 5, ela recebia dois argumentos (`id` e `title`). Agora o `TaskForm` emite três: `id`, `title` e `imgAttachmentKey`.

```javascript title="src/views/HomeView.vue" linenums="66" hl_lines="1-2"
function handleUpdate(id, title, imgAttachmentKey) {
  store.updateTask(id, { title, imgAttachmentKey });
  editingTask.value = null;
}
```

O nome do parâmetro local (`imgAttachmentKey`) pode ser qualquer coisa — o que importa é que o objeto passado ao `store.updateTask` use as chaves esperadas pela função do store.

??? example "Código completo — src/views/HomeView.vue"

    ```vue title="src/views/HomeView.vue" linenums="1"
    <template>
      <div>
        <p v-if="store.error" class="error-message">{{ store.error }}</p>

        <TaskForm
          :editing-task="editingTask"
          @add="handleAdd"
          @update="handleUpdate"
          @cancel="handleCancel"
        />

        <p v-if="store.loading" class="loading-message">Carregando tarefas...</p>

        <template v-else>
          <section v-if="store.pendingTasks.length > 0">
            <h2 class="section-title">Pendentes ({{ store.pendingTasks.length }})</h2>
            <TaskItem
              v-for="task in store.pendingTasks"
              :key="task.id"
              :task="task"
              @toggle="handleToggle"
              @remove="handleRemove"
              @edit="handleEdit"
            />
          </section>

          <section v-if="store.completedTasks.length > 0">
            <h2 class="section-title">Concluídas ({{ store.completedTasks.length }})</h2>
            <TaskItem
              v-for="task in store.completedTasks"
              :key="task.id"
              :task="task"
              @toggle="handleToggle"
              @remove="handleRemove"
              @edit="handleEdit"
            />
          </section>

          <p v-if="store.tasks.length === 0" class="empty-message">
            Nenhuma tarefa cadastrada. Adicione uma acima.
          </p>
        </template>

        <InstallButton />
      </div>
    </template>

    <script setup>
    import { onMounted, ref } from 'vue'
    import TaskForm from '../components/TaskForm.vue'
    import TaskItem from '../components/TaskItem.vue'
    import InstallButton from '../components/InstallButton.vue'
    import { useTasksStore } from '../stores/tasks.js'

    const store = useTasksStore()
    const editingTask = ref(null)

    onMounted(() => {
      store.fetchTasks()
    })

    function handleAdd(title) {
      store.addTask(title)
    }

    function handleUpdate(id, title, imgAttachmentKey) {
      store.updateTask(id, { title, imgAttachmentKey })
      editingTask.value = null
    }

    function handleCancel() {
      editingTask.value = null
    }

    function handleEdit(task) {
      editingTask.value = task
    }

    function handleToggle(id) {
      store.toggleTask(id)
    }

    function handleRemove(id) {
      if (editingTask.value?.id === id) editingTask.value = null
      store.removeTask(id)
    }
    </script>

    <style scoped>
    .section-title {
      font-size: 1rem;
      color: #666;
      margin-bottom: 12px;
      margin-top: 20px;
    }

    .empty-message {
      text-align: center;
      color: #999;
      margin-top: 40px;
      font-size: 0.95rem;
    }

    .error-message {
      color: #c0392b;
      background-color: #fdecea;
      border: 1px solid #e74c3c;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 12px;
      font-size: 0.9rem;
    }

    .loading-message {
      color: #666;
      font-size: 0.9rem;
      padding: 8px 0;
    }
    </style>
    ```

---

## Fluxo completo

Com todas as alterações aplicadas, o fluxo de upload funciona assim:

```
Usuário clica em "Editar" numa tarefa
        │
        ▼
TaskForm exibe a seção de upload
        │
Usuário seleciona uma imagem
        │
        ▼
handleImageChange executa:
  1. Cria URL local → exibe pré-visualização imediata
  2. POST /uploads/images/ → backend salva o arquivo
  3. Armazena attachment_key retornada
        │
Usuário confirma (clica em "Alterar")
        │
        ▼
handleSubmit emite 'update' com (id, title, attachment_key)
        │
        ▼
HomeView → store.updateTask(id, { title, imgAttachmentKey })
        │
        ▼
PATCH /tasks/{id} com { title, img_attachment_key }
        │
        ▼
Backend vincula imagem à tarefa e retorna { ..., img_url: "..." }
        │
        ▼
store atualiza tasks[index] com o objeto retornado
        │
        ▼
TaskItem renderiza a miniatura via img_url
```

## Checklist de verificação

Antes de seguir para as atividades, verifique:

- [ ] O container Docker `2.0` está rodando em `localhost:8001`
- [ ] `GET /tasks` em `localhost:8001/docs` retorna o campo `img_url` (mesmo que `null`)
- [ ] Ao clicar em "Editar" numa tarefa, a seção de upload aparece abaixo do campo de texto
- [ ] Ao selecionar uma imagem, a pré-visualização aparece antes do upload terminar
- [ ] Durante o upload, o botão "Alterar" fica desabilitado e o label exibe "Enviando..."
- [ ] Ao salvar a edição, a miniatura aparece ao lado da tarefa na lista
- [ ] Ao clicar em "Editar" novamente na mesma tarefa, a imagem já salva aparece na seção de upload
- [ ] Ao cancelar a edição, a pré-visualização some e a próxima edição começa limpa

---

**Anterior:** [Passo 3 – Atualizando o store](03-store.md) | **Próximo:** [Atividades práticas](../atividades-praticas.md)
