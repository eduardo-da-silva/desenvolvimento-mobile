# Unidade 7 – Autenticação com JWT

## Apresentação da Unidade

Nas unidades anteriores, o projeto `registro-atividades-pwa` ganhou integração com um backend real, persistência de dados e upload de imagens. Mas qualquer pessoa com acesso à URL da API pode criar, listar e apagar tarefas — não há nenhum controle de quem está fazendo o quê.

Nesta unidade, vamos resolver isso implementando **autenticação**. A partir de agora, cada usuário terá suas próprias tarefas. Para acessar a aplicação, será necessário fazer login. O servidor passará a identificar quem faz cada requisição e só devolverá os dados daquele usuário.

Para isso, vamos trabalhar com dois temas:

- **JWT e o token Bearer** – o mecanismo pelo qual o servidor reconhece o usuário em cada requisição sem precisar guardar sessões
- **Autenticação no frontend** – como persistir o token, proteger rotas, automatizar o envio do token via interceptors e implementar o logout

**Objetivos de aprendizagem:**

- Entender o que é um token JWT e como ele é estruturado
- Compreender a diferença entre access token e refresh token
- Saber por que e como guardar tokens no `localStorage`
- Criar uma store Pinia dedicada à autenticação
- Configurar interceptors no Axios para autenticar todas as requisições automaticamente
- Proteger rotas no Vue Router com navigation guards
- Implementar login e logout no frontend

## Navegação da Unidade

1. [Autenticação com JWT](autenticacao-jwt.md)
2. [Onde guardar o token](armazenamento-cliente.md)
3. [Tutorial prático: autenticação de ponta a ponta](tutorial/index.md)
   1. [Preparação do ambiente](tutorial/01-preparacao.md)
   2. [A store de autenticação](tutorial/02-auth-store.md)
   3. [Interceptors e Axios](tutorial/03-interceptors.md)
   4. [Login, guards e logout](tutorial/04-login-e-guards.md)
4. [Atividades práticas](atividades-praticas.md)

## Pré-requisitos

- Projeto `registro-atividades-pwa` no estado final da Unidade 6
- Backend rodando via Docker (será substituído por uma nova versão nesta unidade)
- Node.js, npm e Docker instalados

---

**Anterior:** [Unidade 6 – Upload de Imagens](../unidade6/index.md) | **Próximo:** [Autenticação com JWT](autenticacao-jwt.md)
