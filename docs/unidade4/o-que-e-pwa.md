# 1. Introdução a Progressive Web Apps

## O que é um Progressive Web App?

Um **Progressive Web App (PWA)** é uma aplicação web que utiliza tecnologias modernas para oferecer uma experiência semelhante à de um aplicativo nativo. Na prática, é uma aplicação web que pode ser instalada no dispositivo do usuário, funcionar offline e carregar rapidamente — tudo isso sem precisar ser distribuída por lojas como Google Play ou App Store.

O termo "Progressive" vem da ideia de **aprimoramento progressivo**: a aplicação funciona em qualquer navegador moderno, mas oferece recursos adicionais (como instalação e cache offline) quando o navegador e o dispositivo suportam.

## Por que PWAs são importantes?

PWAs resolvem problemas reais do desenvolvimento mobile:

**Custo e velocidade de desenvolvimento**

Em vez de manter código separado para web, Android e iOS, você mantém uma única base de código. Isso reduz custos e acelera o ciclo de desenvolvimento.

**Distribuição simplificada**

Não é necessário passar pelo processo de aprovação de lojas de aplicativos. O usuário acessa a URL e pode instalar diretamente. Atualizações são aplicadas automaticamente, sem que o usuário precise baixar uma nova versão.

**Acesso em conexões instáveis**

Em muitas regiões, a conexão com a internet é lenta ou intermitente. Um PWA pode funcionar offline ou com conexão limitada, garantindo acesso ao conteúdo mesmo sem rede.

**Menos espaço no dispositivo**

Um PWA ocupa significativamente menos espaço que um aplicativo nativo equivalente. O Twitter Lite (PWA), por exemplo, ocupa cerca de 3 MB, enquanto o aplicativo nativo pode ultrapassar 100 MB.

## Site comum, SPA e PWA: qual a diferença?

Para entender onde o PWA se encaixa, é útil comparar com outras abordagens web:

### Site comum (tradicional)

Um site tradicional funciona com navegação entre páginas. Cada clique em um link faz uma nova requisição ao servidor, que retorna uma página HTML completa.

- Cada página é carregada do zero
- Não funciona offline
- Não pode ser instalado
- Boa indexação por mecanismos de busca

### SPA (Single Page Application)

Uma SPA carrega a aplicação uma única vez e atualiza dinamicamente o conteúdo da página sem recarregar. Frameworks como Vue.js, React e Angular são usados para criar SPAs.

- Navegação fluida, sem recarregamento
- Experiência mais próxima de um app
- Não funciona offline (por padrão)
- Não pode ser instalada (por padrão)

### PWA (Progressive Web App)

Um PWA é uma SPA (ou site) que adiciona capacidades avançadas: instalação, cache, funcionamento offline e acesso a alguns recursos do dispositivo.

- Tudo que uma SPA oferece
- Funciona offline (via Service Worker)
- Pode ser instalado no dispositivo
- Carregamento rápido mesmo com rede lenta

A tabela abaixo resume as diferenças:

| Característica          | Site comum | SPA        | PWA        |
| ----------------------- | ---------- | ---------- | ---------- |
| Navegação fluida        | Não        | Sim        | Sim        |
| Funciona offline        | Não        | Não        | Sim        |
| Instalável              | Não        | Não        | Sim        |
| Atualização automática  | Recarregar | Recarregar | Automática |
| Usa tecnologias web     | Sim        | Sim        | Sim        |
| Precisa de loja de apps | —          | —          | Não        |

## Exemplos de aplicações que utilizam PWA

Diversas empresas já adotaram PWAs em suas estratégias. Alguns exemplos:

**Twitter Lite**  
Versão PWA do Twitter. Consome até 70% menos dados que o app nativo e carrega em menos de 3 segundos, mesmo em redes 3G.

**Starbucks**  
O PWA da Starbucks permite navegar no cardápio, personalizar pedidos e adicionar itens ao carrinho — tudo isso funcionando offline.

**Pinterest**  
Após adotar o PWA, o Pinterest registrou aumento de 60% no engajamento dos usuários e 44% na receita com anúncios.

**Uber**  
A versão PWA do Uber foi desenvolvida para funcionar em redes 2G, ocupando apenas 50 KB. Permite solicitar corridas mesmo com conexão extremamente lenta.

**Telegram**  
O Telegram Web funciona como PWA, permitindo enviar e receber mensagens com uma experiência muito próxima do aplicativo nativo.

Esses exemplos mostram que PWAs são viáveis para diferentes tipos de aplicação — desde redes sociais até e-commerces e aplicativos de produtividade.

## O que vamos construir nesta unidade

Ao longo desta unidade, vamos criar um novo projeto Vue.js 3 com Vite e transformá-lo em um PWA funcional. O projeto será um aplicativo simples de gerenciamento de tarefas, e ao final você terá:

- Uma aplicação Vue.js com suporte a PWA
- Um manifesto configurado com ícones e cores personalizadas
- Um Service Worker gerenciando cache de arquivos
- Funcionamento offline testado e validado
- Um aplicativo instalável no desktop e no celular

---

**Anterior:** [Apresentação da Unidade](index.md) | **Próximo:** [Critérios e requisitos de um PWA](criterios-pwa.md)
