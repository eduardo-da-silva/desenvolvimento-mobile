# Passo 3 – Pré-visualização e upload

## Objetivo

No passo anterior, adicionamos o `capture` e o input já abre a câmera. Mas, depois que o usuário fotografa, nada muda na tela — a imagem foi capturada, mas não há feedback visual. Neste passo, vamos garantir que o preview apareça **antes** do upload terminar e que o upload seja iniciado automaticamente após a captura.

## Revisão: o que já existe

Na Unidade 6, a função `handleImageChange` já foi implementada no `TaskForm.vue`. Ela:

1. Pega o arquivo de `event.target.files[0]`
2. Cria uma URL local com `URL.createObjectURL(file)` para preview
3. Envia o arquivo via `tasksApi.uploadImage(file)`
4. Guarda o `attachment_key` retornado
5. Em caso de erro, reverte o preview

```javascript
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

Esse código **já funciona** com a câmera. Quando o usuário fotografa, o arquivo `File` gerado pela câmera é exatamente igual a um arquivo selecionado no seletor de arquivos — a `handleImageChange` trata os dois casos da mesma forma.

## Adicionando revokeObjectURL

A única melhoria necessária neste passo é garantir que a URL de preview seja liberada quando não for mais necessária, evitando vazamento de memória.

No `watch` que observa `editingTask`, adicione `revokeObjectURL` antes de substituir o preview:

```javascript title="src/components/TaskForm.vue" linenums="1" hl_lines="5"
watch(
  () => props.editingTask,
  (task) => {
    newTask.value = task ? task.title : '';
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
    imgAttachmentKey.value = null;
  },
);
```

Faça o mesmo no `handleCancel`:

```javascript title="src/components/TaskForm.vue" linenums="1" hl_lines="3"
function handleCancel() {
  newTask.value = '';
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  imgAttachmentKey.value = null;
  emit('cancel');
}
```

E também no início da `handleImageChange`, para liberar o preview anterior antes de criar um novo:

```javascript title="src/components/TaskForm.vue" linenums="1" hl_lines="4"
async function handleImageChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = URL.createObjectURL(file);
  uploading.value = true;
  // ...
}
```

## O fluxo completo

Com a câmera + preview + upload, o fluxo atualizado fica assim:

```
Usuário clica em "Adicionar imagem"
        │
        ▼
Navegador abre a câmera (capture="environment")
        │
Usuário fotografa e confirma
        │
        ▼
handleImageChange é chamada:
  1. Revoga URL anterior (se houver)
  2. Cria nova URL local (preview instantâneo)
  3. Inicia upload (POST /uploads/images/)
  4. Armazena attachment_key retornada
        │
        ▼
Preview aparece na tela imediatamente
        │
Upload termina (mesmo que demore alguns segundos)
        │
        ▼
Usuário salva a tarefa
        │
        ▼
PATCH /tasks/{id} com img_attachment_key
```

## Verificando o funcionamento

1. Abra a aplicação e edite uma tarefa
2. Clique em "Adicionar imagem" — a câmera abre (no celular)
3. Fotografe e confirme
4. O preview aparece instantaneamente, antes do upload terminar
5. O texto no botão muda para "Enviando..." durante o upload
6. Após o upload, o botão volta a ficar habilitado
7. Salve a tarefa — a imagem aparece na lista

## Resumo do passo

Neste passo, você:

- Revisou o código existente de `handleImageChange`
- Adicionou `URL.revokeObjectURL()` nos pontos corretos para evitar vazamento de memória
- Verificou que o preview instantâneo e o upload funcionam com a imagem capturada pela câmera

---

**Anterior:** [Passo 2 – Adicionando o atributo capture](02-captura-camera.md) | **Próximo:** [Passo 4 – Integração visual e feedback](04-integracao-visual.md)
