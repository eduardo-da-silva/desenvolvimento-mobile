# Uploads e multipart/form-data

## Por que JSON não serve para arquivos

Nas unidades anteriores, toda comunicação com o backend usou JSON. O axios serializa o objeto JavaScript em texto, o backend deserializa e tudo funciona. Mas JSON representa apenas texto. Um arquivo de imagem é uma sequência de bytes binários — e bytes binários não cabem num campo de texto sem uma conversão (como Base64), que inflaria o tamanho do dado em cerca de 33%.

A solução do protocolo HTTP para enviar arquivos é o tipo de conteúdo `multipart/form-data`. Nele, o corpo da requisição é dividido em **partes** separadas por um delimitador (boundary), e cada parte carrega seus próprios cabeçalhos e conteúdo:

```
POST /uploads/images/ HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXyZ

------WebKitFormBoundaryXyZ
Content-Disposition: form-data; name="file"; filename="foto.jpg"
Content-Type: image/jpeg

<bytes da imagem>
------WebKitFormBoundaryXyZ
Content-Disposition: form-data; name="description"

Foto da tarefa
------WebKitFormBoundaryXyZ--
```

O navegador e o axios montam esse corpo automaticamente quando você passa um objeto `FormData` no lugar de um objeto JavaScript comum.

## A classe FormData

`FormData` é uma API nativa do navegador. Ela representa um conjunto de campos chave-valor onde os valores podem ser strings ou arquivos (`File`/`Blob`):

```javascript
const formData = new FormData();
formData.append('file', arquivoSelecionado);
formData.append('description', 'Foto da tarefa');
```

Ao passar um `FormData` para o axios, ele detecta o tipo automaticamente e define o cabeçalho `Content-Type: multipart/form-data` com o boundary correto. Não é necessário configurar nada manualmente além de sobrescrever o cabeçalho padrão da instância.

## A estratégia em duas fases

Uma abordagem comum em aplicações que combinam formulários com uploads é separar o envio do arquivo da submissão do formulário. O motivo é simples: se o usuário preenche um formulário longo e o upload falha só no final, perder tudo é uma experiência ruim.

A estratégia adotada neste projeto funciona assim:

1. **Fase 1 — upload imediato:** quando o usuário seleciona uma imagem, o frontend envia o arquivo ao backend imediatamente (`POST /uploads/images/`). O backend salva o arquivo em disco, cria um registro no banco e retorna uma `attachment_key` — um UUID único que identifica aquele arquivo temporariamente.

2. **Fase 2 — vínculo no salvamento:** quando o usuário confirma a edição da tarefa, o frontend envia o título e a `attachment_key` na mesma requisição (`PATCH /tasks/{id}`). O backend localiza o arquivo pelo UUID, vincula a imagem à tarefa e retorna o objeto atualizado com o campo `img_url` preenchido.

```
Usuário seleciona imagem
        │
        ▼
POST /uploads/images/
        │
        ▼
Backend salva arquivo e retorna
{ attachment_key: "uuid-gerado" }
        │
        ▼
Frontend exibe pré-visualização
        │
   (usuário salva)
        │
        ▼
PATCH /tasks/{id}
{ title: "...", img_attachment_key: "uuid-gerado" }
        │
        ▼
Backend vincula imagem à tarefa
e retorna { ..., img_url: "http://.../media/images/..." }
```

Essa separação torna as duas operações independentes. Se o upload falhar, o formulário não é afetado. Se o usuário cancelar a edição depois de fazer o upload, a imagem fica armazenada no servidor mas não vinculada a nenhuma tarefa — o que pode ser gerenciado com uma rotina de limpeza periódica no backend.

## O campo img_url no retorno

O backend desta unidade retorna `img_url` em todos os endpoints de tarefas. Quando a tarefa não tem imagem, o valor é `null`. Quando tem, é uma URL pública acessível diretamente pelo navegador:

```json
{
  "id": 3,
  "title": "Preparar apresentação",
  "done": false,
  "img_url": "http://localhost:8001/media/images/a1b2c3d4.jpg"
}
```

O frontend usa esse valor para exibir a miniatura no `TaskItem`.

---

**Anterior:** [Apresentação da Unidade](index.md) | **Próximo:** [Tutorial prático](tutorial/index.md)
