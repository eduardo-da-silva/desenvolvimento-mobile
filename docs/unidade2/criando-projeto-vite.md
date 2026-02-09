# 1. Criando projeto Vue.js 3 com Vite

## O que é Vite?

**Vite** (pronuncia-se "vit", que significa "rápido" em francês) é uma ferramenta moderna de build criada pelo Evan You, o mesmo autor do Vue.js.

### Por que usar Vite em vez do Vue CLI?

| Característica        | Vite                    | Vue CLI (antigo) |
| --------------------- | ----------------------- | ---------------- |
| **Velocidade**        | ⚡ Extremamente rápido  | 🐢 Mais lento    |
| **Servidor de dev**   | Inicia em milissegundos | Leva segundos    |
| **Hot reload**        | Instantâneo             | Perceptível      |
| **Build de produção** | Otimizado com Rollup    | Webpack          |
| **Configuração**      | Simples e moderna       | Mais verbosa     |

Para desenvolvimento mobile, onde você testa constantemente no navegador, **velocidade importa muito**. Vite é a escolha recomendada atualmente.

## Criando o projeto

Abra o terminal e execute:

```bash
npm create vite@latest
```

O Vite fará algumas perguntas. Responda assim:

```
? Project name: › registro-atividades-vue
? Select a framework: › Vue
? Select a variant: › JavaScript
```

**Observações:**

- Nome do projeto: escolha algo descritivo
- Framework: Vue
- Variant: JavaScript (TypeScript é opcional, mas vamos focar em JS por simplicidade)

## Instalando dependências

Entre na pasta do projeto e instale as dependências:

```bash
cd registro-atividades-vue
npm install
```

## Estrutura inicial do projeto

Após a criação, o Vite gera esta estrutura:

```
registro-atividades-vue/
├─ node_modules/          # Dependências instaladas
├─ public/                # Arquivos públicos (favicon, etc)
│  └─ vite.svg
├─ src/                   # Código fonte do app
│  ├─ assets/            # Imagens, CSS global
│  ├─ components/        # Componentes Vue
│  ├─ App.vue           # Componente raiz
│  └─ main.js           # Ponto de entrada
├─ index.html            # HTML principal
├─ package.json          # Configuração do projeto
└─ vite.config.js        # Configuração do Vite
```

### Arquivos importantes

**`index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registro de Atividades</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

Pontos importantes:

- `viewport` para mobile (já vem configurado)
- `<div id="app">`: onde o Vue monta a aplicação
- Script `main.js` carregado como módulo

**`src/main.js`**

```javascript
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

createApp(App).mount('#app');
```

Aqui acontece:

1. Importa a função `createApp` do Vue
2. Importa o CSS global
3. Importa o componente raiz `App.vue`
4. Cria e monta a aplicação no elemento `#app`

**`src/App.vue`**

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div>
    <h1>Olá Vue!</h1>
    <button @click="count++">Contagem: {{ count }}</button>
  </div>
</template>

<style scoped>
/* Estilos do componente */
</style>
```

Este é um **Single File Component (SFC)** — toda a lógica, template e estilo em um arquivo.

## Executando o projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Você verá algo como:

```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Abra o navegador em `http://localhost:5173/` e veja a aplicação rodando!

**Dica:** use F12 para abrir o DevTools e testar no modo mobile.

## Limpando o projeto inicial

O Vite cria um exemplo básico. Vamos limpar para começar do zero:

### 1. Limpe `src/App.vue`

```vue
<script setup>
// Lógica aqui
</script>

<template>
  <div class="app">
    <h1>Registro de Atividades</h1>
    <p>App mobile com Vue.js 3</p>
  </div>
</template>

<style scoped>
.app {
  padding: 20px;
  text-align: center;
}
</style>
```

### 2. Limpe `src/style.css`

Substitua todo o conteúdo por um reset básico:

```css
/* Reset básico */
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
```

### 3. Remova componentes de exemplo

Delete a pasta `src/components/` por enquanto. Vamos recriar do zero.

## Comandos úteis

Durante o desenvolvimento, você usará:

```bash
# Inicia servidor de desenvolvimento
npm run dev

# Cria build de produção
npm run build

# Preview do build
npm run preview
```

## Estrutura mobile-first no Vite

O Vite já vem configurado para desenvolvimento mobile:

- Meta tag viewport no `index.html`
- Hot Module Replacement (HMR) funciona bem em navegadores mobile
- Build otimizado e pequeno

## Resumo

Nesta seção você:

- ✅ Criou um projeto Vue.js 3 com Vite
- ✅ Entendeu a estrutura de pastas inicial
- ✅ Limpou o projeto para começar do zero
- ✅ Executou o servidor de desenvolvimento

Na próxima seção, vamos entender a **Composition API**, que é a forma moderna de escrever componentes Vue.

---

**Anterior:** [Apresentação da Unidade](index.md) | **Próximo:** [Composition API](composition-api.md)
