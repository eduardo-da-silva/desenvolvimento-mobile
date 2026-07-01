# Passo 2 – Service Worker customizado

## Objetivo

Neste passo, vamos migrar o Service Worker de gerado automaticamente (`generateSW`) para um arquivo customizado (`injectManifest`), e adicionar os handlers de push notification.

## Por que precisamos de um SW customizado

Na Unidade 4, configuramos o `vite-plugin-pwa` com a estratégia `generateSW`: o plugin gera automaticamente um Service Worker com as regras de cache do Workbox. Isso é conveniente, mas tem uma limitação — não é possível adicionar código personalizado no Service Worker gerado.

Para escutar o evento `push`, precisamos escrever nosso próprio Service Worker. A estratégia `injectManifest` resolve isso: o plugin ainda injeta o manifesto de precache automaticamente, mas o restante do código é escrito por nós.

!!! info "O cache não muda"

    A migração para `injectManifest` não altera o comportamento de cache. As mesmas estratégias que existiam (NetworkFirst para API, CacheFirst para fontes) serão reescritas no novo arquivo — com a vantagem de termos controle total sobre o Service Worker.

## 2.1 Atualizando o vite.config.js

Abra o `vite.config.js` e localize o bloco `VitePWA`. Substitua as opções `registerType` e `workbox` pelas opções de `injectManifest`:

```javascript title="vite.config.js" linenums="1"
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest', // (1)
      srcDir: 'src',                // (2)
      filename: 'sw.js',            // (3)

      manifest: {
        name: 'Gerenciador de Tarefas',
        short_name: 'Tarefas',
        description: 'Aplicativo PWA para gerenciar tarefas diárias',
        theme_color: '#4a90d9',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        id: 'com.task-manager.app',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module', // (4)
      },
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

1. `injectManifest` — em vez de gerar o SW completo, o plugin injeta apenas o manifesto de precache no nosso arquivo
2. `srcDir: 'src'` — pasta onde o nosso `sw.js` está localizado
3. `filename: 'sw.js'` — nome do arquivo fonte do Service Worker
4. `type: 'module'` — necessário para que imports ES modules funcionem no SW durante o desenvolvimento

## 2.2 Criando o Service Worker

Crie o arquivo `src/sw.js`. Ele tem três responsabilidades: cache das assets (workbox), lifecycle do SW e handlers de push:

```javascript title="src/sw.js" linenums="1"
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

// O vite-plugin-pwa injeta o manifesto de precache aqui em tempo de build
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// ── Cache de fontes do Google ──────────────────────────────────────────────

registerRoute(
  ({ url }) => url.hostname === 'fonts.googleapis.com',
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  }),
)

registerRoute(
  ({ url }) => url.hostname === 'fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'gstatic-fonts-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  }),
)

// ── Cache da API — NetworkFirst ────────────────────────────────────────────

registerRoute(
  ({ url }) => url.hostname === 'localhost' && url.port === '8001',
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }),
    ],
  }),
)

// ── Lifecycle ─────────────────────────────────────────────────────────────

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting() // (1)
  }
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()) // (2)
})

// ── Recebendo push notifications ───────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json() // (3)
  } catch {
    payload = { event: 'unknown', message: event.data.text() }
  }

  const { title, body, icon } = buildNotificationContent(payload)

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: payload,          // (4)
      vibrate: [200, 100, 200],
    }),
  )
})

function buildNotificationContent(payload) {
  switch (payload.event) {
    case 'task_created':
      return {
        title: 'Nova tarefa criada',
        body: payload.task?.title ?? 'Uma nova tarefa foi adicionada.',
      }
    case 'task_updated': {
      const task = payload.task
      if (task?.done) {
        return { title: 'Tarefa concluída ✓', body: task.title }
      }
      return { title: 'Tarefa atualizada', body: task?.title ?? 'Uma tarefa foi modificada.' }
    }
    case 'task_deleted':
      return { title: 'Tarefa removida', body: 'Uma tarefa foi excluída.' }
    default:
      return {
        title: 'Gerenciador de Tarefas',
        body: payload.message ?? 'Você tem uma atualização.',
      }
  }
}

// ── Clique na notificação ─────────────────────────────────────────────────

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se o app já está aberto em alguma aba, foca ela
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            client.postMessage({ // (5)
              type: 'PUSH_NOTIFICATION_CLICKED',
              payload: event.notification.data,
            })
            return client.focus()
          }
        }
        // Senão, abre uma nova janela
        if (self.clients.openWindow) {
          return self.clients.openWindow('/')
        }
      }),
  )
})
```

1. `skipWaiting()` faz o novo SW assumir o controle imediatamente, sem esperar todas as abas fecharem.
2. `clients.claim()` faz o SW recém-ativado controlar as abas abertas que ainda não usavam um SW.
3. O payload enviado pelo backend é um objeto JSON com os campos `event` e, dependendo do evento, `task` ou `id`.
4. `data: payload` armazena o payload na notificação para que o handler de clique possa acessá-lo.
5. `postMessage` envia uma mensagem ao `App.vue`, que então faz o re-fetch das tarefas.

## Resumo do passo

Neste passo, você:

- Entendeu a diferença entre `generateSW` e `injectManifest`
- Atualizou o `vite.config.js` para usar `injectManifest` com suporte a módulos ES em dev
- Criou o `src/sw.js` com as mesmas estratégias de cache da unidade anterior mais os handlers `push` e `notificationclick`

---

**Anterior:** [Passo 1 – Preparação do ambiente](01-preparacao.md) | **Próximo:** [Passo 3 – Permissão e subscription](03-subscribe.md)
