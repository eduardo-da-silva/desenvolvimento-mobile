# Passo 2 – Configuração do manifesto

## Objetivo

Neste passo, vamos aprofundar a configuração do **Web App Manifest**, entender o papel de cada campo e personalizar o manifesto da nossa aplicação.

## O que é o manifesto?

O manifesto é um arquivo JSON que informa ao navegador como a aplicação deve se comportar quando instalada. Ele define o nome, os ícones, as cores e o modo de exibição do aplicativo.

No nosso projeto, o `vite-plugin-pwa` gera o manifesto automaticamente a partir da configuração em `vite.config.js`. Não precisamos criar o arquivo manualmente.

## Campos do manifesto em detalhe

### `name`

O nome completo da aplicação. É exibido na tela de instalação e na lista de aplicativos instalados.

```json
"name": "Gerenciador de Tarefas"
```

Boas práticas:

- Use o nome real da aplicação
- Evite nomes muito longos (acima de 45 caracteres podem ser cortados)

### `short_name`

Nome curto, usado quando o espaço é limitado — por exemplo, abaixo do ícone na tela inicial do celular.

```json
"short_name": "Tarefas"
```

Boas práticas:

- Máximo de 12 caracteres é o recomendado
- Deve ser reconhecível mesmo sem o nome completo

### `description`

Uma descrição breve sobre a aplicação. Usada em algumas interfaces do sistema operacional.

```json
"description": "Aplicativo PWA para gerenciar tarefas diárias"
```

### `start_url`

A URL que será aberta quando o usuário iniciar a aplicação instalada. Geralmente é a raiz do projeto.

```json
"start_url": "/"
```

!!! note "Observação"

    Se você hospedar a aplicação em um subdiretório (ex: `https://meusite.com/tarefas/`), o `start_url` deve refletir isso: `"/tarefas/"`.

### `scope`

Define o escopo de navegação da aplicação. Páginas fora desse escopo serão abertas no navegador em vez de dentro do app.

```json
"scope": "/"
```

### `display`

Define como a aplicação é exibida quando instalada. As opções são:

| Valor        | Comportamento                                  |
| ------------ | ---------------------------------------------- |
| `standalone` | Sem barra de endereço, parece um app nativo    |
| `fullscreen` | Ocupa toda a tela, inclusive a barra de status |
| `minimal-ui` | Exibe controles mínimos de navegação           |
| `browser`    | Abre no navegador normalmente                  |

Para a nossa aplicação, usamos `standalone`:

```json
"display": "standalone"
```

### `theme_color`

Cor da barra de status do navegador e da barra de título em alguns sistemas operacionais. Deve combinar com a identidade visual da aplicação.

```json
"theme_color": "#4a90d9"
```

Essa cor também precisa ser definida no `index.html` como meta tag:

```html
<meta name="theme-color" content="#4a90d9" />
```

O `vite-plugin-pwa` injeta essa tag automaticamente no HTML de produção.

### `background_color`

Cor de fundo da tela de carregamento (splash screen) que aparece enquanto a aplicação é iniciada após a instalação.

```json
"background_color": "#ffffff"
```

### `icons`

Lista de ícones usados pelo sistema operacional. Cada ícone é um objeto com:

- `src`: caminho para o arquivo de imagem
- `sizes`: dimensões em pixels
- `type`: tipo MIME da imagem
- `purpose`: (opcional) como o ícone pode ser usado

```json
"icons": [
  {
    "src": "/icons/icon-192x192.png",
    "sizes": "192x192",
    "type": "image/png"
  },
  {
    "src": "/icons/icon-512x512.png",
    "sizes": "512x512",
    "type": "image/png"
  },
  {
    "src": "/icons/icon-512x512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "maskable"
  }
]
```

#### Tamanhos obrigatórios

No mínimo, você deve fornecer:

- **192x192**: usado como ícone do app na tela inicial
- **512x512**: usado na tela de splash e em contextos que exigem alta resolução

#### Ícone maskable

O `purpose: "maskable"` indica que o ícone pode ser recortado pelo sistema operacional para se adaptar a diferentes formatos (circular no Android, quadrado com cantos arredondados no iOS, etc.).

Para funcionar bem como maskable, o ícone deve ter uma **zona segura**: o conteúdo importante deve estar centralizado, ocupando cerca de 80% da área total, com fundo preenchido ao redor.

## Configuração completa no `vite.config.js`

Veja a configuração completa do manifesto no nosso projeto:

```javascript title='./vite.config.js' linenums='1'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
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

## Verificando o manifesto no navegador

Para conferir se o manifesto está correto:

1. Faça o build da aplicação:

   ```bash
   npm run build
   ```

2. Sirva os arquivos de produção localmente:

   ```bash
   npm run preview -- --host
   ```

3. Abra o DevTools (F12) no navegador
4. Vá até a aba **Application**
5. Clique em **Manifest** no menu lateral

Você verá todas as informações que configuramos:

- Nome e nome curto
- URL de início
- Modo de exibição
- Cores
- Ícones (com preview)

Se algum campo estiver ausente ou incorreto, o navegador mostrará um aviso nessa mesma tela.

## Adicionando a meta tag para iOS

O Safari no iOS tem suporte parcial ao manifesto padrão. Para garantir uma boa experiência em dispositivos Apple, é recomendado adicionar as seguintes meta tags no `index.html`:

```html title='index.html' linenums='1'
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Tarefas" />
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    <title>Gerenciador de Tarefas</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

As meta tags específicas para Apple:

| Tag                                     | Função                                |
| --------------------------------------- | ------------------------------------- |
| `apple-mobile-web-app-capable`          | Permite abrir em tela cheia no Safari |
| `apple-mobile-web-app-status-bar-style` | Define o estilo da barra de status    |
| `apple-mobile-web-app-title`            | Nome exibido na tela inicial do iOS   |
| `apple-touch-icon`                      | Ícone usado na tela inicial do iOS    |

## Resumo do passo

Neste passo, você:

- Entendeu o papel de cada campo do manifesto
- Configurou o manifesto completo no `vite.config.js`
- Aprendeu sobre ícones maskable e tamanhos obrigatórios
- Verificou o manifesto no DevTools do navegador
- Adicionou suporte para dispositivos iOS

---

**Anterior:** [Passo 1 – Configuração do suporte a PWA](01-setup-pwa.md) | **Próximo:** [Passo 3 – Service Worker](03-service-worker.md)
