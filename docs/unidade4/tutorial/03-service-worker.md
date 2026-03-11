# Passo 3 – Service Worker

## Objetivo

Neste passo, vamos entender em detalhes o que é o Service Worker, como ele funciona e como ele é configurado automaticamente pelo `vite-plugin-pwa` no nosso projeto.

## O que é um Service Worker?

O Service Worker é um script JavaScript que o navegador executa em **segundo plano**, separado da thread principal da aplicação. Ele funciona como um intermediário (proxy) entre a aplicação web e a rede.

Diferente de scripts comuns, o Service Worker:

- **Não tem acesso ao DOM** — não pode manipular a página diretamente
- **Roda em uma thread separada** — não bloqueia a interface do usuário
- **Permanece ativo** mesmo quando a aba ou a aplicação estão fechadas
- **É ativado por eventos** — responde a eventos como `install`, `activate` e `fetch`

## Ciclo de vida do Service Worker

O Service Worker segue um ciclo de vida com etapas bem definidas. Entender esse ciclo é fundamental para configurar corretamente o cache e as atualizações.

### 1. Registro

O primeiro passo é registrar o Service Worker no navegador. Isso é feito no código da aplicação, geralmente no arquivo de entrada (`main.js`).

O `vite-plugin-pwa` faz esse registro automaticamente. Quando você define `registerType: 'autoUpdate'` na configuração, o plugin injeta o código de registro sem que você precise escrever manualmente.

Internamente, o registro acontece assim:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

O navegador verifica se o recurso de Service Worker está disponível e, em caso positivo, registra o arquivo `sw.js`.

### 2. Instalação (`install`)

Após o registro, o navegador baixa o script do Service Worker e dispara o evento `install`. Esse é o momento em que geralmente fazemos o **precache** — armazenamos em cache os arquivos essenciais da aplicação.

```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/index.css',
        '/assets/index.js',
      ]);
    }),
  );
});
```

!!! note "Importante"

    No nosso projeto, **não precisamos escrever esse código manualmente**. O `vite-plugin-pwa` usa a biblioteca **Workbox** (desenvolvida pelo Google) para gerar o Service Worker automaticamente, incluindo a lista de arquivos para cache.

### 3. Ativação (`activate`)

Depois da instalação, o Service Worker é ativado. O evento `activate` é usado para limpeza — remover caches antigos, por exemplo.

```javascript
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== 'app-cache-v1')
          .map((name) => caches.delete(name)),
      );
    }),
  );
});
```

### 4. Interceptação de requisições (`fetch`)

Uma vez ativo, o Service Worker intercepta **todas as requisições de rede** feitas pela aplicação. Para cada requisição, ele decide se busca o recurso na rede ou retorna do cache.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se encontrou no cache, retorna do cache
      // Caso contrário, busca na rede
      return response || fetch(event.request);
    }),
  );
});
```

### Diagrama do ciclo

```
Usuário acessa o site
        │
        ▼
┌───────────────┐
│   Registro    │  navigator.serviceWorker.register('/sw.js')
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Instalação   │  Evento 'install' → precache de arquivos
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Ativação    │  Evento 'activate' → limpeza de caches antigos
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Funcionamento │  Evento 'fetch' → intercepta requisições
└───────────────┘
```

## Como o `vite-plugin-pwa` gera o Service Worker

O plugin utiliza a biblioteca **Workbox** para gerar o Service Worker automaticamente. Existem duas estratégias de geração:

### `generateSW` (padrão)

O plugin gera o Service Worker completo automaticamente. Você não precisa escrever nenhum código de Service Worker. Apenas configura as opções no `vite.config.js`.

Essa é a opção mais simples e adequada para a maioria dos projetos.

### `injectManifest`

Você escreve seu próprio Service Worker e o plugin injeta a lista de arquivos para precache. Essa opção dá mais controle, mas exige mais conhecimento.

Para o nosso projeto, usamos `generateSW` (que é o padrão), pois o Workbox já cuida de tudo que precisamos.

## Configurando o Service Worker no projeto

Vamos atualizar o `vite.config.js` para incluir configurações específicas do Service Worker:

```javascript title='./vite.config.js' linenums='1' hl_lines="10-14"
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

As novas opções dentro de `workbox` (linhas 10-14) configuram o comportamento do Service Worker:

| Opção                   | Descrição                                                                |
| ----------------------- | ------------------------------------------------------------------------ |
| `globPatterns`          | Padrões de arquivos que serão incluídos no precache                      |
| `cleanupOutdatedCaches` | Remove caches de versões anteriores automaticamente                      |
| `sourcemap`             | Se deve gerar source maps para o Service Worker (desativado em produção) |

O padrão `**/*.{js,css,html,ico,png,svg,woff2}` significa: coloque em cache todos os arquivos JavaScript, CSS, HTML, ícones, imagens PNG, SVG e fontes WOFF2 da aplicação.

## Testando o Service Worker

O Service Worker só funciona no build de produção. Para testar:

### 1. Faça o build

```bash
npm run build
```

### 2. Sirva os arquivos de produção

```bash
npm run preview
```

### 3. Verifique no DevTools

Abra o DevTools (F12) e vá até a aba **Application**:

**Service Workers** (menu lateral):

- Você verá o Service Worker registrado
- O status deve ser "activated and is running"
- A URL será algo como `sw.js`

**Cache Storage** (menu lateral):

- Você verá os caches criados pelo Workbox
- Dentro deles, os arquivos da aplicação armazenados

### Exemplo do que você verá

Na seção "Service Workers" do DevTools:

```
Source:    sw.js
Status:    activated and is running
Clients:   http://localhost:4173/
```

Na seção "Cache Storage":

```
workbox-precache-v2-http://localhost:4173/
  ├── /index.html
  ├── /assets/index-abc123.js
  ├── /assets/index-def456.css
  ├── /icons/icon-192x192.png
  └── /icons/icon-512x512.png
```

## O papel do Workbox

O **Workbox** é uma biblioteca do Google que simplifica o trabalho com Service Workers. Em vez de escrever todo o código manualmente, o Workbox oferece:

- **Precaching**: lista automática de arquivos para cache durante a instalação
- **Runtime caching**: estratégias prontas para cache em tempo de execução
- **Atualização**: gerenciamento automático de novas versões do Service Worker
- **Fallback offline**: respostas para quando não há conexão

O `vite-plugin-pwa` usa o Workbox internamente. Quando fazemos o build, o plugin gera um arquivo `sw.js` otimizado no diretório de saída (`dist/`).

## Resumo do passo

Neste passo, você:

- Entendeu o que é um Service Worker e como ele funciona
- Conheceu as quatro etapas do ciclo de vida: registro, instalação, ativação e funcionamento
- Configurou o Workbox no `vite.config.js`
- Testou o Service Worker no build de produção
- Entendeu o papel do Workbox na geração automática do Service Worker

---

**Anterior:** [Passo 2 – Configuração do manifesto](02-manifesto.md) | **Próximo:** [Passo 4 – Estratégias de cache](04-estrategias-cache.md)
