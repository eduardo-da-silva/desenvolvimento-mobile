# Passo 4 – Estratégias de cache

## Objetivo

Neste passo, vamos entender as diferentes estratégias de cache que o Service Worker pode usar e como configurá-las no nosso projeto com Workbox.

## O que é cache no contexto de um PWA?

Quando falamos de cache em um PWA, nos referimos ao armazenamento local de recursos (arquivos HTML, CSS, JavaScript, imagens, fontes, dados de APIs) no navegador do usuário. Isso permite que a aplicação:

- **Carregue mais rápido**: recursos já armazenados não precisam ser baixados novamente
- **Funcione offline**: quando não há rede, os recursos são servidos do cache local

O Service Worker gerencia o cache e decide, para cada requisição, de onde buscar o recurso.

## Tipos de cache

### Precache (cache na instalação)

O **precache** armazena recursos durante a fase de instalação do Service Worker. Os arquivos são listados previamente e baixados de uma vez.

No nosso projeto, o `vite-plugin-pwa` gera automaticamente a lista de precache com todos os arquivos estáticos produzidos pelo build (HTML, CSS, JS, imagens).

**Quando usar**: para todos os arquivos estáticos da aplicação que são conhecidos no momento do build.

### Runtime cache (cache em tempo de execução)

O **runtime cache** armazena recursos que são solicitados durante o uso da aplicação — por exemplo, dados de uma API ou imagens carregadas dinamicamente.

**Quando usar**: para recursos que não são conhecidos no momento do build, como respostas de APIs ou imagens externas.

## Estratégias de cache

O Workbox oferece cinco estratégias de cache. Cada uma define uma política diferente para decidir entre buscar na rede ou no cache.

### 1. Cache First (cache primeiro)

```
Requisição -> Cache existe? -> Sim -> Retorna do cache
                            -> Não -> Busca na rede -> Armazena no cache
```

O Service Worker verifica primeiro o cache. Se o recurso estiver armazenado, retorna do cache sem acessar a rede. Se não estiver, busca na rede e armazena para uso futuro.

**Quando usar**: para recursos que mudam raramente, como fontes, ícones e imagens estáticas.

**Vantagem**: extremamente rápido, pois evita a rede sempre que possível.

**Desvantagem**: o usuário pode ver versões desatualizadas dos recursos.

### 2. Network First (rede primeiro)

```
Requisição -> Rede disponível? -> Sim -> Retorna da rede -> Atualiza cache
                               -> Não -> Retorna do cache
```

O Service Worker tenta buscar o recurso na rede primeiro. Se a rede estiver disponível, retorna a resposta da rede e atualiza o cache. Se não houver rede, retorna do cache.

**Quando usar**: para conteúdo que muda frequentemente, como dados de APIs.

**Vantagem**: o usuário sempre recebe o conteúdo mais recente quando há rede.

**Desvantagem**: mais lento que Cache First, pois depende da rede.

### 3. Stale While Revalidate (cache com revalidação)

```
Requisição -> Retorna do cache imediatamente
           -> Ao mesmo tempo, busca na rede -> Atualiza cache para a próxima vez
```

O Service Worker retorna o recurso do cache imediatamente (se disponível) e, ao mesmo tempo, faz uma requisição à rede para atualizar o cache. Na próxima requisição, o usuário receberá a versão atualizada.

**Quando usar**: para recursos que devem carregar rápido, mas que precisam ser atualizados eventualmente — como avatares de perfil ou dados de configuração.

**Vantagem**: combinação de velocidade (cache) com atualização (rede).

**Desvantagem**: o usuário pode ver uma versão desatualizada na primeira visita após uma mudança.

### 4. Network Only (somente rede)

O Service Worker sempre busca na rede. Não usa cache.

**Quando usar**: para requisições que não devem ser armazenadas, como autenticação ou pagamentos.

### 5. Cache Only (somente cache)

O Service Worker sempre retorna do cache. Não acessa a rede.

**Quando usar**: para recursos que foram adicionados durante a instalação (precache) e nunca mudam.

### Resumo das estratégias

| Estratégia             | Cache  | Rede   | Melhor para                       |
| ---------------------- | ------ | ------ | --------------------------------- |
| Cache First            | Sim    | Backup | Fontes, ícones, imagens estáticas |
| Network First          | Backup | Sim    | Dados de APIs, conteúdo dinâmico  |
| Stale While Revalidate | Sim    | Sim    | Avatares, configurações, listas   |
| Network Only           | Não    | Sim    | Login, pagamentos                 |
| Cache Only             | Sim    | Não    | Recursos do precache              |

## Configurando estratégias no projeto

Vamos configurar estratégias de runtime cache no nosso `vite.config.js`. Imagine que nossa aplicação, no futuro, consumirá dados de uma API e usará fontes do Google Fonts.

Atualize a configuração:

```javascript title='./vite.config.js' linenums='1' hl_lines="14-58"
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        sourcemap: false,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\.exemplo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
      manifest: {
        name: 'Gerenciador de Tarefas',
        short_name: 'Tarefas',
        description: 'Aplicativo PWA para gerenciar tarefas diárias',
        theme_color: '#4a90d9',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
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
    }),
  ],
});
```

### Entendendo a configuração de runtime cache

Cada entrada no array `runtimeCaching` (linhas 14 a 58) define uma regra:

```javascript title='./vite.config.js' linenums='15'
{
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/._/i, // (1)
    handler: 'CacheFirst', // (2)
    options: {
    cacheName: 'google-fonts-cache', // (3)
    expiration: {
        maxEntries: 10, // (4)
        maxAgeSeconds: 60 _ 60 _ 24 _ 365, // (5)
    },
        cacheableResponse: {
            statuses: [0, 200], // (6)
        },
    },
}

```

1. **`urlPattern`**: expressão regular que define quais URLs essa regra cobre
2. **`handler`**: estratégia de cache a ser usada (`CacheFirst`, `NetworkFirst`, etc.)
3. **`cacheName`**: nome do cache no navegador (aparece no DevTools)
4. **`maxEntries`**: número máximo de itens no cache
5. **`maxAgeSeconds`**: tempo máximo que um item permanece no cache
6. **`statuses`**: quais códigos HTTP são cacheáveis (`0` é para requisições opacas de CORS)

### Opção `networkTimeoutSeconds`

Na regra da API, usamos `networkTimeoutSeconds: 10`. Isso significa: se a rede não responder em 10 segundos, o Service Worker retorna a versão do cache. É útil para evitar que o usuário fique esperando indefinidamente.

## Verificando o cache no DevTools

Após o build e o preview, abra o DevTools e navegue até **Application > Cache Storage**. Você verá os caches criados:

```

workbox-precache-v2-... -> arquivos estáticos (precache)
google-fonts-cache -> fontes do Google (se utilizadas)
api-cache -> dados da API (se houver requisições)

```

Cada cache pode ser expandido para ver os recursos armazenados, com detalhes como URL, tamanho e data de armazenamento.

## Como decidir qual estratégia usar

A escolha da estratégia depende da natureza do recurso:

| Recurso                       | Estratégia recomendada | Motivo                                    |
| ----------------------------- | ---------------------- | ----------------------------------------- |
| Arquivos da aplicação (build) | Precache               | São conhecidos no momento do build        |
| Fontes (Google Fonts, etc.)   | Cache First            | Mudam raramente                           |
| Imagens de CDN                | Cache First            | Geralmente estáticas                      |
| Dados de API (listas, itens)  | Network First          | Precisam estar atualizados                |
| Avatar do usuário             | Stale While Revalidate | Carrega rápido, atualiza em segundo plano |
| Login / autenticação          | Network Only           | Não deve ser cacheado                     |

## Resumo do passo

Neste passo, você:

- Entendeu a diferença entre precache e runtime cache
- Conheceu as cinco estratégias de cache do Workbox
- Configurou regras de runtime cache no `vite.config.js`
- Aprendeu a definir expiração e limites para o cache
- Verificou os caches criados no DevTools

---

**Anterior:** [Passo 3 – Service Worker](03-service-worker.md) | **Próximo:** [Passo 5 – Funcionamento offline](05-offline.md)

```

```
