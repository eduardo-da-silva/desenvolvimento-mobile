# 2. Critérios e requisitos de um PWA

## O que torna uma aplicação web um PWA?

Nem toda aplicação web é um PWA. Para que uma aplicação seja considerada um Progressive Web App, ela precisa atender a um conjunto de requisitos técnicos. Nesta seção, vamos detalhar cada um deles.

## 1. HTTPS (conexão segura)

O primeiro requisito é que a aplicação seja servida via **HTTPS** (Hypertext Transfer Protocol Secure). Isso é obrigatório porque:

- O Service Worker intercepta requisições de rede. Sem HTTPS, um atacante poderia modificar essas requisições e comprometer a aplicação.
- APIs modernas do navegador (como geolocalização, câmera e notificações) exigem HTTPS.
- Os navegadores não permitem registrar um Service Worker em páginas sem HTTPS.

!!! note "Exceção para desenvolvimento"
Durante o desenvolvimento local, o navegador permite usar `http://localhost` como se fosse HTTPS. Isso facilita o desenvolvimento e os testes. Em produção, HTTPS é obrigatório.

Na prática, a maioria das hospedagens modernas já oferece HTTPS gratuitamente. Serviços como GitHub Pages, Netlify e Vercel configuram certificados SSL automaticamente.

## 2. Manifesto da aplicação (Web App Manifest)

O **manifesto** é um arquivo JSON que descreve a aplicação para o navegador. Ele contém informações como nome, ícones, cores e comportamento de exibição. É esse arquivo que permite ao navegador oferecer a opção de instalação.

O manifesto é referenciado no `index.html` da aplicação:

```html
<link rel="manifest" href="/manifest.webmanifest" />
```

### Campos principais do manifesto

```json
{
  "name": "Gerenciador de Tarefas",
  "short_name": "Tarefas",
  "description": "Aplicativo para gerenciar tarefas diárias",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4a90d9",
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
    }
  ]
}
```

Vamos detalhar cada campo:

| Campo              | Descrição                                                               |
| ------------------ | ----------------------------------------------------------------------- |
| `name`             | Nome completo da aplicação. Exibido na tela de instalação.              |
| `short_name`       | Nome curto, usado quando há pouco espaço (ex: ícone na tela inicial).   |
| `description`      | Descrição breve da aplicação.                                           |
| `start_url`        | URL que será aberta quando o usuário iniciar o app instalado.           |
| `display`          | Modo de exibição. `standalone` remove a barra de endereço do navegador. |
| `background_color` | Cor de fundo da tela de splash (carregamento inicial).                  |
| `theme_color`      | Cor da barra de status e da interface do sistema operacional.           |
| `icons`            | Lista de ícones em diferentes tamanhos para instalação e tela inicial.  |

### Modos de exibição (`display`)

O campo `display` define como a aplicação aparece quando instalada:

- **`standalone`**: sem barra de endereço, parece um app nativo. É o modo mais comum para PWAs.
- **`fullscreen`**: ocupa toda a tela, inclusive a barra de status. Usado em jogos.
- **`minimal-ui`**: exibe controles mínimos de navegação.
- **`browser`**: abre no navegador normalmente (comportamento padrão).

Para a maioria das aplicações, `standalone` é a escolha adequada.

## 3. Service Worker

O **Service Worker** é o componente técnico central de um PWA. É um script JavaScript que o navegador executa em segundo plano, separado da página web.

### O que ele faz?

O Service Worker atua como um intermediário entre a aplicação e a rede. Ele pode:

- **Interceptar requisições de rede** e decidir se busca o recurso na rede ou no cache
- **Armazenar recursos em cache** para uso offline
- **Executar tarefas em segundo plano**, como sincronização de dados
- **Receber notificações push** do servidor

### Ciclo de vida do Service Worker

O Service Worker possui um ciclo de vida bem definido:

```
Registro → Instalação → Ativação → Funcionamento
```

**1. Registro**  
A aplicação registra o Service Worker no navegador. Isso acontece quando o usuário acessa a aplicação pela primeira vez.

**2. Instalação (`install`)**  
O navegador baixa o script do Service Worker e executa o evento `install`. Nesta fase, geralmente se faz o cache dos recursos estáticos da aplicação.

**3. Ativação (`activate`)**  
Após a instalação, o Service Worker é ativado. Nesta fase, é comum limpar caches antigos de versões anteriores.

**4. Funcionamento (`fetch`)**  
Uma vez ativo, o Service Worker intercepta todas as requisições de rede feitas pela aplicação. Ele decide, para cada requisição, se retorna o recurso do cache ou busca na rede.

### Representação visual do ciclo

```
┌──────────┐     ┌──────────────┐     ┌───────────┐     ┌──────────────┐
│ Registro │ ──▶ │  Instalação  │ ──▶ │ Ativação  │ ──▶ │Funcionamento │
└──────────┘     │ (cache init) │     │ (limpeza) │     │  (fetch)     │
                 └──────────────┘     └───────────┘     └──────────────┘
```

!!! info "Importante"
O Service Worker **não tem acesso ao DOM**. Ele roda em uma thread separada. A comunicação com a página é feita por meio de mensagens (`postMessage`).

## 4. Capacidade de instalação

Para que o navegador ofereça a opção de instalar a aplicação, todos os requisitos anteriores precisam estar atendidos:

- A aplicação é servida via HTTPS
- Possui um manifesto válido com os campos obrigatórios (`name`, `icons`, `start_url`, `display`)
- Possui um Service Worker registrado e ativo
- O usuário interagiu minimamente com a aplicação

Quando esses critérios são satisfeitos, o navegador exibe um banner ou botão de instalação. O comportamento exato varia entre navegadores:

- **Chrome (Android)**: exibe um banner na parte inferior da tela
- **Chrome (Desktop)**: exibe um ícone na barra de endereço
- **Safari (iOS)**: o usuário precisa usar a opção "Adicionar à Tela de Início" manualmente
- **Firefox**: suporte variável, com opções no menu do navegador

## 5. Funcionamento offline

O funcionamento offline é uma das características mais importantes de um PWA. Quando o usuário perde a conexão com a internet, a aplicação deve continuar funcionando — pelo menos parcialmente.

Isso é possível porque o Service Worker armazena recursos em cache durante a primeira visita. Nas visitas seguintes, se não houver conexão, o Service Worker serve os recursos diretamente do cache.

### O que pode funcionar offline?

- **Sempre**: arquivos estáticos da aplicação (HTML, CSS, JavaScript, imagens, fontes)
- **Com estratégia adequada**: dados previamente carregados e armazenados em cache
- **Não funciona offline**: dados que dependem de uma API externa e nunca foram carregados

### Testando o funcionamento offline

O Chrome DevTools oferece uma forma simples de simular offline:

1. Abra o DevTools (F12)
2. Vá até a aba **Application**
3. No menu lateral, clique em **Service Workers**
4. Marque a opção **Offline**

!!! tip "Dica"
Outra forma de testar é desligar o Wi-Fi ou colocar o celular em modo avião. Isso simula uma situação real de perda de conexão.

## Resumo dos requisitos

| Requisito             | Descrição                                     | Obrigatório? |
| --------------------- | --------------------------------------------- | ------------ |
| HTTPS                 | Conexão segura                                | Sim          |
| Manifesto             | Arquivo JSON com metadados da aplicação       | Sim          |
| Service Worker        | Script em segundo plano para cache e offline  | Sim          |
| Ícones                | Pelo menos ícones de 192x192 e 512x512 pixels | Sim          |
| Funcionamento offline | Resposta mesmo sem conexão de rede            | Recomendado  |
| Responsividade        | Adaptação a diferentes tamanhos de tela       | Recomendado  |

Com esses fundamentos claros, estamos prontos para a parte prática: configurar um projeto Vue.js 3 como PWA.

---

**Anterior:** [Introdução a Progressive Web Apps](o-que-e-pwa.md) | **Próximo:** [Tutorial prático: criando um PWA com Vue.js](tutorial/index.md)
