# Unidade 5 – Integração com Backend

## Apresentação da Unidade

Nas unidades anteriores, você criou um aplicativo PWA funcional com Vue.js 3. Ele gerencia tarefas, funciona offline, pode ser instalado e atualiza automaticamente. Mas tem uma limitação: tudo fica em memória. Ao recarregar a página, os dados somem.

Nesta unidade, vamos conectar esse mesmo aplicativo a um backend real. As tarefas passarão a ser salvas em um banco de dados e qualquer dispositivo que acessar a aplicação verá os mesmos dados.

Para isso, vamos trabalhar com três temas:

- **REST e HTTP** – como o frontend e o backend se comunicam
- **Arquitetura em camadas** – como organizar o código para separar responsabilidades
- **Integração prática** – axios, Pinia e a evolução do projeto `registro-atividades-pwa`

**Objetivos de aprendizagem:**

- Entender o funcionamento de uma API REST
- Identificar os verbos HTTP e os status codes mais comuns
- Organizar o código frontend em camadas bem definidas
- Usar axios para fazer requisições HTTP
- Usar Pinia para gerenciar o estado da aplicação
- Conectar o projeto existente a um backend via API REST
- Tratar erros e exibir feedback ao usuário

## Navegação da Unidade

1. [REST e HTTP](rest-e-http.md)
2. [Arquitetura em camadas](arquitetura-camadas.md)
3. [Tutorial prático: integrando o frontend ao backend](tutorial/index.md)
   1. [Preparação do ambiente](tutorial/01-preparacao.md)
   2. [Camada de acesso à API](tutorial/02-camada-api.md)
   3. [Store com Pinia](tutorial/03-pinia-store.md)
   4. [Integrando os componentes](tutorial/04-integrando-componentes.md)
4. [Atividades práticas](atividades-praticas.md)

## Pré-requisitos

- Vue.js 3 com Composition API (Unidade 2)
- Projeto `registro-atividades-pwa` criado e funcionando (Unidade 4)
- Node.js e npm instalados
- Docker instalado (para rodar o backend)

---

**Anterior:** [Unidade 4 – Progressive Web Apps](../unidade4/index.md) | **Próximo:** [REST e HTTP](rest-e-http.md)
