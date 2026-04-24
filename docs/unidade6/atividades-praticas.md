# Atividades Práticas – Unidade 6

Estas atividades complementam o tutorial de upload de imagens. Elas foram pensadas para consolidar os conceitos trabalhados e explorar situações próximas de projetos reais.

---

## Atividade 1 – Indicador visual de imagem anexada

**Objetivo:** praticar renderização condicional e ícones SVG inline no Vue.

**Contexto:** no estado atual, a miniatura aparece na lista apenas quando a tarefa tem imagem. Uma alternativa mais discreta seria exibir um ícone de câmera ou um badge no `TaskItem` sempre que `img_url` estiver preenchido — mesmo que a miniatura não seja exibida por padrão.

**O que implementar:**

1. No `TaskItem.vue`, substitua a miniatura por um ícone pequeno que indique a presença de imagem. Ao clicar no ícone, a imagem é exibida em tamanho maior (ou então numa `<dialog>` nativa).
2. Alternativamente, mantenha a miniatura mas adicione um badge de texto `"foto"` sobre ela usando posicionamento absoluto.

**Dica:** o SVG a seguir pode ser usado como ícone de câmera inline:

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
>
  <path
    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8
           a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
  />
  <circle cx="12" cy="13" r="4" />
</svg>
```

**Resultado esperado:** é possível distinguir visualmente quais tarefas têm imagem sem que a miniatura consuma espaço horizontal na lista.

---

## Atividade 2 – Remover a imagem de uma tarefa

**Objetivo:** exercitar o fluxo inverso — desvinculação de imagem — e a construção condicional de payload.

**Contexto:** no estado atual, não há como remover uma imagem após ela ter sido associada a uma tarefa. O endpoint `PATCH /tasks/{id}` do backend ignora o campo `img_attachment_key` quando ele não está presente no payload, então é necessário definir um comportamento explícito para remoção.

**O que implementar:**

1. No `TaskForm.vue`, adicione um botão "Remover imagem" ao lado da pré-visualização. Ele deve aparecer apenas quando `editingTask.img_url` estiver preenchido **e** o usuário não tiver selecionado uma nova imagem (`previewUrl === null`).

2. Ao clicar no botão, defina uma flag reativa `removeImage = ref(false)` como `true`.

3. Em `handleSubmit`, passe a flag junto com os outros dados:

   ```javascript
   emit(
     'update',
     props.editingTask.id,
     newTask.value.trim(),
     imgAttachmentKey.value,
     removeImage.value,
   );
   ```

4. No store, aceite o quarto parâmetro `removeImage`. Quando `true`, inclua `img_attachment_key: null` no payload:
   ```javascript
   if (removeImage) payload.img_attachment_key = null;
   ```

!!! note "Suporte no backend"

    Verifique no Swagger se o endpoint `PATCH /tasks/{id}` já aceita `img_attachment_key: null`. Se o schema `TaskUpdate` definir o campo como `UUID | None`, o valor `null` será aceito e o backend desvinculará a imagem.

**Resultado esperado:** ao remover a imagem e salvar a tarefa, a miniatura desaparece da lista e `img_url` volta a ser `null` no retorno do backend.

---

## Atividade 3 – Validar tamanho do arquivo no frontend

**Objetivo:** praticar validação no lado do cliente antes de fazer requisições desnecessárias.

**Contexto:** o backend aceita qualquer JPEG ou PNG independentemente do tamanho. Um arquivo de 20 MB consumiria largura de banda sem necessidade. É responsabilidade do frontend alertar o usuário antes de iniciar o upload.

**O que implementar:**

No início da função `handleImageChange`, adicione uma verificação de tamanho:

```javascript
async function handleImageChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const MAX_SIZE_MB = 5;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    alert(`O arquivo excede o limite de ${MAX_SIZE_MB} MB.`);
    event.target.value = '';
    return;
  }

  // ... restante da função
}
```

Depois, melhore a experiência substituindo o `alert` por uma mensagem reativa exibida no template:

```javascript
const uploadError = ref(null);
```

```vue
<p v-if="uploadError" class="upload-error">{{ uploadError }}</p>
```

Lembre de limpar `uploadError` ao iniciar um novo upload e ao trocar de tarefa no `watch`.

**Resultado esperado:** ao selecionar um arquivo maior que 5 MB, uma mensagem de erro aparece no formulário e nenhuma requisição é feita ao backend.

---

## Para saber mais

- [MDN – FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [MDN – URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
- [MDN – `<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
- [Axios – Multipart/Form Data](https://axios-http.com/docs/multipart)

---

**Anterior:** [4. Atualizando os componentes](tutorial/04-componentes.md) | **Início da unidade:** [Unidade 6 – Upload de Imagens](index.md)
