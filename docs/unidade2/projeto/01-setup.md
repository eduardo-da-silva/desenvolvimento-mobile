# 1. Configuração do Projeto

## Objetivo

Nesta etapa, vamos criar e configurar a estrutura inicial do nosso projeto Vue.js 3 com Vite. Você aprenderá a organizar pastas de forma profissional e criar estilos globais para a aplicação.

## Criando o Projeto

### Passo 1: Inicializar o projeto Vue.js

Execute o comando para criar um novo projeto Vue.js:

```bash
npm create vue@latest registro-atividades-vue
```

Durante a configuração, escolha as seguintes opções:

- **Add TypeScript?** → No
- **Add JSX Support?** → No
- **Add Vue Router?** → Yes ✓
- **Add Pinia?** → No
- **Add Vitest?** → No
- **Add ESLint?** → No (opcional)

### Passo 2: Instalar dependências

```bash
cd registro-atividades-vue
npm install
```

### Por que Vite?

O **Vite** é a ferramenta de build moderna recomendada para Vue.js 3. Principais vantagens:

- **Extremamente rápido**: Inicia em milissegundos
- **Hot Module Replacement (HMR)**: Atualizações instantâneas durante o desenvolvimento
- **Build otimizado**: Produz bundles menores para produção
- **Configuração mínima**: Funciona out-of-the-box

## Estrutura de Pastas

### Organizando o projeto

Crie a seguinte estrutura dentro da pasta `src/`:

```
src/
├── assets/
│   └── css/
│       └── global.css
├── components/
│   ├── layout/
│   │   └── AppHeader.vue
│   ├── forms/
│   │   ├── AppInput.vue
│   │   └── AppButton.vue
│   └── records/
│       └── RecordCard.vue
├── views/
│   ├── HomeView.vue
│   ├── RecordsView.vue
│   ├── RecordDetailView.vue
│   └── RecordFormView.vue
├── composables/
│   └── useRecords.js
├── router/
│   └── index.js
├── App.vue
└── main.js
```

### Entendendo a organização

#### `assets/css/`

Contém recursos estáticos como estilos CSS e imagens. Aqui colocamos o `global.css` com estilos que serão aplicados em toda a aplicação.

#### `components/`

Componentes reutilizáveis organizados por categoria:

- **layout/**: Componentes de estrutura (cabeçalho, rodapé, menu)
- **forms/**: Componentes de formulário (inputs, botões, selects)
- **records/**: Componentes específicos de registros (cards, listas)

#### `views/`

Páginas completas da aplicação. Cada view representa uma rota e utiliza os componentes para construir a interface.

#### `composables/`

Funções JavaScript que encapsulam lógica reutilizável usando a Composition API. No projeto, `useRecords` gerencia todas as operações CRUD.

#### `router/`

Configuração das rotas da aplicação com Vue Router.

## Estilos Globais

### Criando o CSS global

Crie o arquivo `src/assets/css/global.css`:

```css title="./src/assets/css/global.css" linenums="1"
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
  background: #f4f4f6;
  color: #111;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
}

/* Espaçamento para conteúdo abaixo do header fixo */
.page {
  padding: 72px 16px 16px;
  max-width: 600px;
  margin: 0 auto;
}
```

### Analisando o CSS

#### Reset básico (linhas 1-5)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

- Remove margens e paddings padrão de todos os elementos
- `box-sizing: border-box` faz com que padding e border sejam incluídos no tamanho total do elemento

#### Estilização do body (linhas 7-16)

```css
body {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
  background: #f4f4f6;
  color: #111;
  -webkit-font-smoothing: antialiased;
}
```

- **font-family**: Utiliza fontes do sistema operacional para melhor performance e aparência nativa
- **background**: Cinza claro para contraste suave
- **color**: Texto preto (#111 ao invés de #000 para reduzir contraste excessivo)
- **-webkit-font-smoothing**: Suaviza a renderização de fontes em dispositivos Apple

#### Container da aplicação (linhas 18-20)

```css
#app {
  min-height: 100vh;
}
```

Garante que a aplicação ocupe pelo menos toda a altura da tela (100vh = 100% da viewport height).

#### Classe `.page` (linhas 22-27)

```css
.page {
  padding: 72px 16px 16px;
  max-width: 600px;
  margin: 0 auto;
}
```

Classe utilitária para páginas da aplicação:

- **padding**: `72px` no topo (altura do header fixo + espaçamento) e `16px` nas laterais
- **max-width**: Limita largura máxima a 600px para melhor legibilidade em telas grandes
- **margin: 0 auto**: Centraliza horizontalmente

### Mobile-First Design

Este CSS segue princípios **mobile-first**:

1. **Fonte legível**: Tamanho base adequado para dispositivos móveis
2. **Espaçamento generoso**: 16px de padding lateral para touch targets confortáveis
3. **Largura limitada**: Máximo de 600px evita linhas de texto muito longas
4. **Cores acessíveis**: Contraste adequado para leitura em qualquer ambiente

## Importando os Estilos

### Configurando App.vue

Edite o arquivo `src/App.vue` para importar os estilos globais:

```vue title="./src/App.vue" linenums="1"
<script setup>
// Não precisa de lógica aqui por enquanto
</script>

<template>
  <RouterView />
</template>

<style>
@import './assets/css/global.css';
</style>
```

### Entendendo o App.vue

#### `<script setup>` (linha 1)

Define a lógica do componente usando Composition API. Por enquanto está vazio, mas é onde colocaríamos imports e lógica futura.

#### `<template>` (linhas 5-7)

- **RouterView**: Componente do Vue Router que renderiza a view correspondente à rota atual
- É onde as páginas (HomeView, RecordsView, etc.) serão exibidas

#### `<style>` (linhas 9-11)

- **sem `scoped`**: Os estilos são globais
- **@import**: Importa o arquivo `global.css` criado anteriormente

## Verificando a Instalação

### Executando o servidor de desenvolvimento

```bash
npm run dev -- --host
```

Você verá uma saída similar a:

```
VITE v5.0.0  ready in 250 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

### Acessando a aplicação

- **No computador**: Acesse http://localhost:5173/
- **No celular**: Use o endereço da rede (ex: http://192.168.1.100:5173/)

> **Dica**: Certifique-se de que o computador e o celular estão na mesma rede Wi-Fi.

## Próximos Passos

Com o projeto configurado e os estilos globais prontos, podemos avançar para criar o composable que gerenciará a lógica de negócio da aplicação.

Na próxima seção, você aprenderá:

- Como criar composables reutilizáveis
- Gerenciar estado reativo com `ref()` e `reactive()`
- Implementar operações CRUD
- Persistir dados no LocalStorage

**[Próximo: Composable useRecords →](02-composable.md)**
