# Unidade 8 – Notificações Push em PWAs

## Apresentação da Unidade

Nas unidades anteriores, o projeto `registro-atividades-pwa` ganhou integração com backend, persistência de dados, upload de imagens e autenticação por JWT. A aplicação está funcional e segura.

Mas imagine este cenário: você está com a aplicação aberta no celular e no computador ao mesmo tempo, com o mesmo usuário. Você conclui uma tarefa no computador — e no celular, a lista continua desatualizada. Para ver a mudança, é preciso recarregar manualmente.

Nesta unidade, vamos resolver isso com **notificações push**: quando uma tarefa é criada, atualizada ou removida em uma sessão, o backend avisa as demais sessões do mesmo usuário — mesmo que a aba esteja em segundo plano ou a tela do celular esteja bloqueada.

Para isso, vamos trabalhar com duas tecnologias:

- **Web Push API** – o protocolo que permite ao servidor enviar mensagens ao browser via Service Worker, sem que o usuário precise estar com a aba aberta
- **VAPID** – o mecanismo de autenticação que comprova que a mensagem veio do seu servidor, e não de qualquer outro

**Objetivos de aprendizagem:**

- Entender como funciona o protocolo Web Push de ponta a ponta
- Compreender o que é VAPID e por que ele é necessário
- Migrar o Service Worker de gerado (`generateSW`) para customizado (`injectManifest`)
- Implementar os handlers `push` e `notificationclick` no Service Worker
- Criar o composable `usePushNotifications` para gerenciar permissão e subscription
- Integrar o subscribe ao fluxo de login e logout
- Criar uma interface não-intrusiva para solicitar permissão de notificação

## Navegação da Unidade

1. [Como funciona o Web Push](web-push.md)
2. [VAPID – autenticação do servidor](vapid.md)
3. [Tutorial prático: notificações push no PWA](tutorial/index.md)
   1. [Preparação do ambiente](tutorial/01-preparacao.md)
   2. [Service Worker customizado](tutorial/02-service-worker.md)
   3. [Permissão e subscription](tutorial/03-subscribe.md)
   4. [Integração com autenticação](tutorial/04-integracao.md)
   5. [Interface de notificação](tutorial/05-notificacao-ui.md)
4. [Atividades práticas](atividades-praticas.md)

## Pré-requisitos

Para acompanhar esta unidade, você deve ter:

- Projeto `registro-atividades-pwa` no estado final da **Unidade 7**
- **Docker** instalado e funcionando
- Dois browsers diferentes disponíveis para teste (ex: Chrome e Firefox)
- Node.js e npm instalados

---

**Anterior:** [Unidade 7 – Autenticação com JWT](../unidade7/index.md) | **Próximo:** [Como funciona o Web Push](web-push.md)
