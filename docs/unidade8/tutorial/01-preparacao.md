# Passo 1 – Preparação do ambiente

## Objetivo

Neste passo, vamos atualizar o backend para a versão `4.0`, explorar os novos endpoints no Swagger e configurar as variáveis de ambiente do frontend.

## Atualizando o backend

A versão `3.0` não tem suporte a notificações push. A versão `4.0` adiciona:

- A tabela `push_subscriptions` para armazenar os endpoints dos browsers
- Os endpoints de gerenciamento de subscription
- O endpoint que expõe a chave pública VAPID
- Envio automático de push ao criar, editar ou remover tarefas

Se o container anterior ainda estiver rodando, pare-o:

??? warning "Parando o container antigo"

    ```bash
    docker ps                        # anota o CONTAINER ID
    docker stop <CONTAINER_ID>
    ```

Inicie o novo container:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:4.0
```

!!! warning "Banco de dados zerado"

    A versão `4.0` adiciona a tabela `push_subscriptions`. Por isso, ao iniciar pela primeira vez, o banco é recriado. **Qualquer dado salvo com a versão anterior será perdido.** Recrie seu usuário de teste antes de continuar.

## Explorando os novos endpoints no Swagger

Acesse `http://localhost:8001/docs`. Além dos endpoints já conhecidos, você verá um novo grupo:

**push**

| Método   | Rota                      | O que faz                                                    |
| -------- | ------------------------- | ------------------------------------------------------------ |
| `GET`    | `/api/vapid-public-key`   | Retorna a chave pública VAPID do servidor                    |
| `POST`   | `/api/subscriptions`      | Salva ou atualiza a subscription do browser autenticado      |
| `DELETE` | `/api/subscriptions`      | Remove a subscription do browser autenticado                 |

### Testando `GET /api/vapid-public-key`

Esse endpoint é público — não precisa de autenticação. Clique em **Try it out** → **Execute**. A resposta deve ser:

```json
{
  "publicKey": "BEBiQ5Zw_CbEYQgKhsmEufYYFuMaBo_WV79nn8a9op2GLSD8hpjOFgJHhD8NOUawvH1YUgjNKNKZUCw0t1SFJJY"
}
```

Essa string é a chave pública VAPID que usaremos no frontend. Ela identifica o servidor e vincula cada subscription ao backend.

## Configurando as variáveis de ambiente

Na raiz do projeto `registro-atividades-pwa`, crie o arquivo `.env`:

```bash title=".env"
VITE_API_BASE_URL=http://localhost:8001
VITE_VAPID_PUBLIC_KEY=BEBiQ5Zw_CbEYQgKhsmEufYYFuMaBo_WV79nn8a9op2GLSD8hpjOFgJHhD8NOUawvH1YUgjNKNKZUCw0t1SFJJY
```

!!! info "Por que a chave pública vai no frontend?"

    Como vimos na seção sobre [VAPID](../vapid.md), a chave pública é exposta intencionalmente. O browser precisa dela para criar uma subscription vinculada exclusivamente ao seu servidor. Qualquer pessoa pode ler essa chave — o que não compromete a segurança, pois sem a chave **privada** (que fica apenas no servidor) ninguém consegue enviar mensagens.

## O que vamos alterar no frontend

Nenhuma dependência nova precisa ser instalada — a `vite-plugin-pwa` já inclui o workbox. As mudanças são todas nos arquivos do projeto:

| Arquivo | Ação |
| --- | --- |
| `vite.config.js` | Modificar — trocar `generateSW` por `injectManifest` |
| `src/sw.js` | Criar — Service Worker com push handlers e cache workbox |
| `src/composables/usePushNotifications.js` | Criar — lógica de permissão e subscription |
| `src/api/config.js` | Modificar — adicionar header `X-Push-Endpoint` |
| `src/stores/auth.js` | Modificar — subscribe no login, unsubscribe no logout |
| `src/components/NotificationPrompt.vue` | Criar — banner para solicitar permissão |
| `src/App.vue` | Modificar — montar o banner e reagir a cliques em notificações |

## Resumo do passo

Neste passo, você:

- Substituiu o container Docker pela versão `4.0` do backend
- Explorou os novos endpoints de push no Swagger
- Confirmou a chave pública VAPID
- Criou o arquivo `.env` com as variáveis do frontend

---

**Anterior:** [Visão geral do tutorial](index.md) | **Próximo:** [Passo 2 – Service Worker customizado](02-service-worker.md)
