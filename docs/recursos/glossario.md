# Glossário

Termos técnicos utilizados ao longo do curso, organizados em ordem alfabética.

---

**API (Application Programming Interface)**  
Conjunto de regras e definições que permitem que diferentes softwares se comuniquem entre si. No contexto web, frequentemente se refere a endpoints HTTP que fornecem dados em formato JSON.

**Build**  
Processo de transformar o código-fonte de desenvolvimento em arquivos otimizados para produção. No Vite, o comando `npm run build` gera os arquivos finais na pasta `dist/`.

**Cache**  
Armazenamento temporário de dados para acesso rápido. Em PWAs, o cache é gerenciado pelo Service Worker para permitir carregamento rápido e funcionamento offline.

**Cache First**  
Estratégia de cache em que o Service Worker sempre busca o recurso no cache local primeiro. Só acessa a rede se o recurso não estiver armazenado.

**CDN (Content Delivery Network)**  
Rede de servidores distribuídos que entrega conteúdo ao usuário a partir do servidor mais próximo geograficamente, melhorando a velocidade de carregamento.

**Composable**  
No Vue.js 3, é uma função que encapsula e reutiliza lógica reativa usando a Composition API. Convencionalmente nomeada com o prefixo `use` (ex: `useTasks`, `useOnlineStatus`).

**Composition API**  
API do Vue.js 3 que permite organizar a lógica do componente em funções compostas, em vez de separar por opções (`data`, `methods`, `computed`). Usa `setup()`, `ref()`, `reactive()`, `computed()`, entre outros.

**DOM (Document Object Model)**  
Representação em árvore da estrutura HTML de uma página, que pode ser manipulada por JavaScript para alterar o conteúdo e a aparência da página.

**HMR (Hot Module Replacement)**  
Funcionalidade de ferramentas de desenvolvimento que atualiza módulos alterados no navegador sem recarregar a página inteira, preservando o estado da aplicação.

**HTTPS (Hypertext Transfer Protocol Secure)**  
Versão segura do protocolo HTTP, que criptografa a comunicação entre o navegador e o servidor. Obrigatório para registro de Service Workers em produção.

**Lazy Loading**  
Técnica de carregamento sob demanda, em que recursos (componentes, imagens, módulos) são carregados apenas quando necessários, reduzindo o tempo de carregamento inicial.

**localStorage**  
API do navegador que permite armazenar dados como pares chave-valor de forma persistente. Os dados permanecem mesmo após fechar o navegador.

**Manifesto (Web App Manifest)**  
Arquivo JSON que descreve uma aplicação web para o navegador, contendo informações como nome, ícones, cores e modo de exibição. É um dos requisitos para que um site seja considerado um PWA.

**Maskable Icon**  
Ícone de PWA projetado para ser recortado em diferentes formatos pelo sistema operacional (circular, quadrado com cantos arredondados, etc.). O conteúdo importante deve estar centralizado na zona segura.

**Network First**  
Estratégia de cache em que o Service Worker tenta buscar o recurso na rede primeiro. Se a rede não estiver disponível, retorna a versão do cache.

**Node.js**  
Ambiente de execução JavaScript fora do navegador, baseado no motor V8 do Chrome. Utilizado para executar ferramentas de desenvolvimento como Vite e npm.

**npm (Node Package Manager)**  
Gerenciador de pacotes do Node.js, usado para instalar, atualizar e gerenciar dependências de projetos JavaScript.

**Precache**  
Armazenamento antecipado de recursos no cache durante a fase de instalação do Service Worker. Os arquivos são listados previamente e baixados de uma vez.

**PWA (Progressive Web App)**  
Aplicação web que utiliza tecnologias modernas (Service Worker, manifesto, HTTPS) para oferecer experiência semelhante a um aplicativo nativo, incluindo instalação, funcionamento offline e carregamento rápido.

**Reatividade**  
No Vue.js, é o mecanismo que detecta automaticamente mudanças nos dados e atualiza a interface sem manipulação manual do DOM.

**Runtime Cache**  
Cache de recursos que são solicitados durante o uso da aplicação (em tempo de execução), como respostas de APIs ou imagens carregadas dinamicamente.

**Service Worker**  
Script JavaScript que o navegador executa em segundo plano, separado da página web. Atua como intermediário entre a aplicação e a rede, permitindo cache, funcionamento offline e notificações push.

**SFC (Single File Component)**  
Formato de arquivo do Vue.js (`.vue`) que combina template HTML, lógica JavaScript e estilos CSS em um único arquivo.

**SPA (Single Page Application)**  
Aplicação web que carrega uma única página HTML e atualiza dinamicamente o conteúdo sem recarregar, proporcionando uma experiência mais fluida.

**Splash Screen**  
Tela de carregamento exibida brevemente quando o usuário abre um PWA instalado. A cor de fundo é definida pelo campo `background_color` do manifesto.

**Stale While Revalidate**  
Estratégia de cache em que o Service Worker retorna o recurso do cache imediatamente e, ao mesmo tempo, busca uma versão atualizada na rede para armazenar no cache.

**Standalone**  
Modo de exibição de PWA (`display: standalone`) que remove a barra de endereço do navegador, fazendo a aplicação parecer um app nativo.

**Vite**  
Ferramenta moderna de build para projetos web, criada pelo autor do Vue.js. Oferece servidor de desenvolvimento rápido com HMR e build otimizado para produção.

**Vue Router**  
Biblioteca oficial de roteamento do Vue.js, que permite criar navegação entre páginas (views) em uma SPA.

**Workbox**  
Biblioteca do Google que simplifica o trabalho com Service Workers, oferecendo estratégias de cache prontas, precaching e gerenciamento de atualizações.
