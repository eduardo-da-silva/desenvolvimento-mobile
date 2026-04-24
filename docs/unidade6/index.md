# Unidade 6 – Upload de Imagens

## Apresentação da Unidade

Na Unidade 5, o projeto `registro-atividades-pwa` passou a se comunicar com um backend real. As tarefas são salvas num banco de dados e qualquer dispositivo que acesse a aplicação vê os mesmos dados.

Mas as tarefas ainda carregam apenas texto. Nesta unidade, vamos adicionar a capacidade de anexar uma imagem a uma tarefa no momento da edição. A imagem será enviada ao servidor, e o endereço público retornado pelo backend será exibido como miniatura junto à tarefa na lista.

Para isso, vamos trabalhar com dois temas:

- **Uploads e `multipart/form-data`** – por que arquivos não trafegam como JSON e como o protocolo HTTP lida com isso
- **Estratégia em duas fases** – enviar o arquivo antes de salvar o formulário principal, vinculando as duas operações por uma chave temporária

**Objetivos de aprendizagem:**

- Entender a diferença entre `application/json` e `multipart/form-data`
- Compreender a estratégia de upload em duas fases com `attachment_key`
- Criar e enviar um `FormData` com axios
- Manipular `<input type="file">` em Vue 3
- Exibir uma pré-visualização local antes do upload confirmar
- Exibir miniaturas de imagem na lista de tarefas

## Navegação da Unidade

1. [Uploads e multipart/form-data](upload-e-multipart.md)
2. [Tutorial prático: adicionando upload de imagens](tutorial/index.md)
   1. [Preparação do ambiente](tutorial/01-preparacao.md)
   2. [Método de upload na camada de API](tutorial/02-api-upload.md)
   3. [Atualizando o store](tutorial/03-store.md)
   4. [Atualizando os componentes](tutorial/04-componentes.md)
3. [Atividades práticas](atividades-praticas.md)

## Pré-requisitos

- Projeto `registro-atividades-pwa` no estado final da Unidade 5
- Backend rodando via Docker (será substituído por uma nova versão nesta unidade)
- Node.js, npm e Docker instalados

---

**Anterior:** [Unidade 5 – Integração com Backend](../unidade5/index.md) | **Próximo:** [Uploads e multipart/form-data](upload-e-multipart.md)
