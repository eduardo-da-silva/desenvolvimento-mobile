# Passo 2 – Método de upload na camada de API

## Objetivo

Neste passo, vamos adicionar o método `uploadImage` ao arquivo `src/api/tasksApi.js`. Ele é responsável por enviar um arquivo ao endpoint `POST /uploads/images/` e retornar a `attachment_key` gerada pelo backend.

## O que o endpoint espera

O endpoint `POST /uploads/images/` recebe uma requisição `multipart/form-data` com dois campos:

| Campo         | Tipo    | Obrigatório | Descrição                    |
| ------------- | ------- | ----------- | ---------------------------- |
| `file`        | arquivo | sim         | Imagem JPEG ou PNG           |
| `description` | texto   | não         | Descrição opcional da imagem |

O retorno é um objeto com `attachment_key` — o identificador temporário que será usado ao salvar a tarefa.

## A mudança no tasksApi.js

Abra `src/api/tasksApi.js` e adicione o método `uploadImage` ao objeto `tasksApi`:

```javascript title="src/api/tasksApi.js" linenums="1" hl_lines="20-28"
import apiClient from './config.js';

const tasksApi = {
  getAll() {
    return apiClient.get('/tasks');
  },

  create(title) {
    return apiClient.post('/tasks', { title });
  },

  update(id, data) {
    return apiClient.patch(`/tasks/${id}`, data);
  },

  remove(id) {
    return apiClient.delete(`/tasks/${id}`);
  },

  uploadImage(file, description = '') {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    return apiClient.post('/uploads/images/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default tasksApi;
```

### Entendendo o método linha a linha

**Linha 20 – `uploadImage(file, description = '')`**

O método recebe o objeto `File` retornado pelo `<input type="file">` e uma descrição opcional. O valor padrão de `description` é uma string vazia, então a chamada `tasksApi.uploadImage(file)` já é suficiente na maioria dos casos.

**Linha 21 – `new FormData()`**

Cria uma instância de `FormData`. É a forma nativa do navegador de montar um corpo `multipart/form-data`. Sem ela, não há como enviar um arquivo binário numa requisição HTTP sem convertê-lo para texto.

**Linha 22 – `formData.append('file', file)`**

Adiciona o arquivo ao campo `file`. O nome `'file'` deve coincidir exatamente com o nome do parâmetro esperado pelo endpoint FastAPI.

**Linha 23-24 – `formData.append('description', ...)`**

Adiciona o campo de texto apenas se ele tiver valor, evitando enviar um campo vazio desnecessariamente.

**Linha 24 – override do `Content-Type`**

A instância `apiClient` configurada em `config.js` define `Content-Type: application/json` como padrão. Para esta requisição específica, esse cabeçalho é sobrescrito para `multipart/form-data`. O axios então inclui automaticamente o `boundary` correto no valor do cabeçalho — não é necessário (nem correto) defini-lo manualmente.

## Resumo do passo

Neste passo, você:

- Adicionou o método `uploadImage` ao `tasksApi`
- Viu como montar um `FormData` com arquivo e campo de texto
- Entendeu por que o `Content-Type` precisa ser sobrescrito para esta requisição

??? example "Código completo — src/api/tasksApi.js"

    ```javascript title="src/api/tasksApi.js" linenums="1"
    import apiClient from './config.js'

    const tasksApi = {
      getAll() {
        return apiClient.get('/tasks')
      },

      create(title) {
        return apiClient.post('/tasks', { title })
      },

      update(id, data) {
        return apiClient.patch(`/tasks/${id}`, data)
      },

      remove(id) {
        return apiClient.delete(`/tasks/${id}`)
      },

      uploadImage(file, description = '') {
        const formData = new FormData()
        formData.append('file', file)
        if (description) formData.append('description', description)
        return apiClient.post('/uploads/images/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      },
    }

    export default tasksApi
    ```

---

**Anterior:** [Passo 1 – Preparação do ambiente](01-preparacao.md) | **Próximo:** [Passo 3 – Atualizando o store](03-store.md)
