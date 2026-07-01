# Passo 4 – Integração visual e feedback

## Objetivo

No estado atual da Unidade 8, a seção de imagem só aparece durante a **edição** (`v-if="editingTask"`). Isso significa que, ao criar uma nova tarefa, o usuário não consegue anexar uma foto. Neste passo, vamos tornar a seção de imagem **sempre visível** e adicionar textos adaptativos que orientem o usuário conforme o dispositivo.

## 4.1 Tornando a seção de imagem sempre visível

Remova o `v-if="editingTask"` da `div.image-section`:

```vue title="src/components/TaskForm.vue" linenums="14" hl_lines="1"
<div class="image-section">
  <img
    v-if="previewUrl || editingTask?.img_url"
    :src="previewUrl || editingTask?.img_url"
    class="image-preview"
    alt="Imagem da tarefa"
  />
  <label class="image-label" :class="{ disabled: uploading }">
    <span v-if="uploading" class="upload-status">Enviando...</span>
    <span v-else>
      {{ previewUrl || editingTask?.img_url
        ? 'Trocar imagem'
        : 'Adicionar imagem'
      }}
    </span>
    <input
      type="file"
      accept="image/jpeg,image/png"
      capture="environment"
      class="image-input"
      :disabled="uploading"
      @change="handleImageChange"
    />
  </label>
</div>
```

Agora, ao criar uma nova tarefa, o usuário também pode capturar ou selecionar uma imagem.

## 4.2 Atualizando o `handleSubmit` para criação com imagem

Na Unidade 6, o `handleSubmit` emitia o evento `add` apenas com o título. Agora que a imagem está disponível também na criação, precisamos incluir o `imgAttachmentKey` no payload de `add`.

Atualize a função `handleSubmit` no `TaskForm.vue`:

```javascript title="src/components/TaskForm.vue" linenums="1" hl_lines="9-13"
function handleSubmit() {
  if (!newTask.value.trim()) return;

  const payload = {
    title: newTask.value.trim(),
    imgAttachmentKey: imgAttachmentKey.value,
  };

  if (props.editingTask) {
    emit('update', props.editingTask.id, payload);
  } else {
    emit('add', payload);
  }

  newTask.value = '';
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  imgAttachmentKey.value = null;
}
```

Note que `payload` é um objeto com `title` e `imgAttachmentKey`. Isso segue o mesmo padrão já usado na Unidade 6 para o `update` — e o store (`tasks.js`) já trata `addTask` recebendo um objeto via `normalizeTaskInput`.

## 4.3 Atualizando o `HomeView.vue` para receber payload

O `HomeView` chama `store.addTask(título)` com uma string. Agora que `handleAdd` pode receber um objeto, precisamos atualizar a função:

```javascript title="src/views/HomeView.vue" linenums="62" hl_lines="1-3"
function handleAdd(payload) {
  store.addTask(payload);
}
```

Edite também o `addTask` da store para aceitar o payload como objeto, confome o código abaixo:

```javascript title="src/store/tasks.js" linenums="1""
  async function addTask(payload) {
    if (!payload.title?.trim()) return;
    error.value = null;
    try {
      const response = await tasksApi.create(payload)
      tasks.value.push(response.data)
    } catch (err) {
      error.value = 'Erro ao adicionar tarefa.'
      console.error(err)
    }
  }
```

## 4.4 Adicionando texto de ajuda

Adicione um pequeno texto abaixo do label para informar o usuário sobre o comportamento da câmera:

```vue title="src/components/TaskForm.vue" linenums="1" hl_lines="25-28"
<div class="image-section">
  <img
    v-if="previewUrl || editingTask?.img_url"
    :src="previewUrl || editingTask?.img_url"
    class="image-preview"
    alt="Imagem da tarefa"
  />
  <label class="image-label" :class="{ disabled: uploading }">
    <span v-if="uploading" class="upload-status">Enviando...</span>
    <span v-else>
      {{ previewUrl || editingTask?.img_url
        ? 'Trocar imagem'
        : 'Adicionar imagem'
      }}
    </span>
    <input
      type="file"
      accept="image/jpeg,image/png"
      capture="environment"
      class="image-input"
      :disabled="uploading"
      @change="handleImageChange"
    />
  </label>
  <p class="image-help">
    Em celular, o botão pode abrir a câmera.
    Em notebook, abre o seletor de arquivos.
  </p>
</div>
```

Adicione o estilo correspondente no bloco `<style scoped>`:

```css
.image-help {
  font-size: 0.75rem;
  color: #999;
  margin: 0;
  flex-basis: 100%;
}
```

## 4.5 Texto adaptativo (opcional)

Para uma experiência ainda melhor, podemos usar JavaScript para detectar se o dispositivo é mobile e adaptar o texto do label:

```vue title="src/components/TaskForm.vue"
<span v-else>
  {{ previewUrl || editingTask?.img_url
    ? 'Trocar imagem'
    : isMobileDevice
      ? 'Fotografar'
      : 'Adicionar imagem'
  }}
</span>
```

E no `<script setup>`, adicione a detecção:

```javascript
const isMobileDevice = ref(
  /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  ),
);
```

Ou, de forma mais confiável, usando `matchMedia` para detectar a ausência de mouse (comum em celulares):

```javascript
const isMobileDevice = ref(
  !window.matchMedia('(pointer: fine)').matches,
);
```

A detecção de dispositivo não é obrigatória para o funcionamento — o `capture` já faz o trabalho pesado —, mas melhora a experiência ao mostrar o texto correto ("Fotografar" no celular, "Adicionar imagem" no desktop).

## Seção de imagem completa

Após todas as alterações, a seção de imagem no template fica assim:

```vue title="src/components/TaskForm.vue"
<div class="image-section">
  <img
    v-if="previewUrl || editingTask?.img_url"
    :src="previewUrl || editingTask?.img_url"
    class="image-preview"
    alt="Imagem da tarefa"
  />
  <label class="image-label" :class="{ disabled: uploading }">
    <span v-if="uploading" class="upload-status">Enviando...</span>
    <span v-else>
      {{ previewUrl || editingTask?.img_url
        ? 'Trocar imagem'
        : 'Adicionar imagem'
      }}
    </span>
    <input
      type="file"
      accept="image/jpeg,image/png"
      capture="environment"
      class="image-input"
      :disabled="uploading"
      @change="handleImageChange"
    />
  </label>
  <p class="image-help">
    Em celular, o botão pode abrir a câmera.
    Em notebook, abre o seletor de arquivos.
  </p>
</div>
```

## Checklist de verificação

- [ ] A seção de imagem aparece **também na criação** de tarefas, não apenas na edição
- [ ] Ao clicar em "Adicionar imagem" no celular, a câmera abre (não o seletor de arquivos)
- [ ] Ao clicar em "Adicionar imagem" no desktop, o seletor de arquivos abre (comportamento normal)
- [ ] O preview aparece imediatamente após fotografar/selecionar
- [ ] O texto de ajuda explica o comportamento para cada tipo de dispositivo
- [ ] Ao criar uma nova tarefa com imagem, a foto aparece na lista
- [ ] Ao cancelar, o preview é removido e a memória é liberada

---

**Anterior:** [Passo 3 – Pré-visualização e upload](03-preview-e-upload.md) | **Próximo:** [Passo 5 – Captura com getUserMedia](05-camera-nativa.md)
