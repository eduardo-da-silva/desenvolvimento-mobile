# 5. Configuração de Rotas

## Objetivo

Nesta etapa, vamos configurar o Vue Router para permitir navegação entre as diferentes páginas da aplicação. O roteamento é essencial para criar uma Single Page Application (SPA) com URLs específicas para cada view.

## O que é Vue Router?

O **Vue Router** é a biblioteca oficial de roteamento para Vue.js. Ele permite:

- **Navegação client-side**: Mudança de páginas sem recarregar o navegador
- **URLs amigáveis**: Cada página tem sua própria URL (ex: `/records/123`)
- **Parâmetros dinâmicos**: Rotas com IDs variáveis
- **Navegação programática**: Navegar via código JavaScript
- **Histórico do navegador**: Botões voltar/avançar funcionam corretamente

## Estrutura de Rotas

Nossa aplicação terá as seguintes rotas:

| URL                 | View             | Descrição               |
| ------------------- | ---------------- | ----------------------- |
| `/`                 | HomeView         | Página inicial          |
| `/records`          | RecordsView      | Lista de registros      |
| `/records/:id`      | RecordDetailView | Detalhes de um registro |
| `/records/:id/edit` | RecordFormView   | Criar/editar registro   |

## Implementação

### Código completo do router

Crie o arquivo `src/router/index.js`:

```javascript title="./src/router/index.js" linenums="1"
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/records',
    name: 'records',
    component: () => import('@/views/RecordsView.vue'),
  },
  {
    path: '/records/:id',
    name: 'record-detail',
    component: () => import('@/views/RecordDetailView.vue'),
  },
  {
    path: '/records/:id/edit',
    name: 'record-edit',
    component: () => import('@/views/RecordFormView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

## Análise Detalhada

### Imports (linha 1)

```javascript
import { createRouter, createWebHistory } from 'vue-router';
```

- **createRouter**: Função que cria instância do router
- **createWebHistory**: Modo de histórico HTML5 (URLs limpas sem `#`)

### Definição de Rotas (linhas 3-24)

#### Estrutura de uma rota

```javascript
{
  path: '/',
  name: 'home',
  component: () => import('@/views/HomeView.vue'),
}
```

**path**: URL da rota (ex: `/`, `/records`, `/records/123`)

**name**: Identificador único para referenciar a rota por nome ao invés de path

**component**: Componente Vue a ser renderizado. Usa import dinâmico `() => import()` para **lazy loading**

### Lazy Loading de Componentes

```javascript
component: () => import('@/views/HomeView.vue');
```

#### O que é lazy loading?

Ao invés de carregar todos os componentes ao iniciar a aplicação, cada view é carregada apenas quando o usuário acessa sua rota.

#### Vantagens:

- ✅ **Bundle inicial menor**: Aplicação carrega mais rápido
- ✅ **Performance otimizada**: Código carregado sob demanda
- ✅ **Experiência melhor**: Especialmente importante em mobile com conexões lentas

#### Como funciona:

1. Usuário acessa `/`
2. Vue carrega apenas `HomeView.vue`
3. Usuário navega para `/records`
4. Vue carrega `RecordsView.vue` neste momento
5. Views já carregadas ficam em cache

### Rotas com Parâmetros Dinâmicos

```javascript
{
  path: '/records/:id',
  name: 'record-detail',
  component: () => import('@/views/RecordDetailView.vue'),
}
```

#### `:id` é um parâmetro dinâmico

- `/records/123` → `id = "123"`
- `/records/456` → `id = "456"`
- `/records/abc` → `id = "abc"`

#### Acessando o parâmetro no componente:

```javascript
import { useRoute } from 'vue-router';

const route = useRoute();
console.log(route.params.id); // "123"
```

### Rota para Criar e Editar

```javascript
{
  path: '/records/:id/edit',
  name: 'record-edit',
  component: () => import('@/views/RecordFormView.vue'),
}
```

Esta rota usa o mesmo componente `RecordFormView` para:

- **Criar**: `/records/new/edit` (id = "new")
- **Editar**: `/records/123/edit` (id = "123")

O componente detecta o modo baseado no valor de `:id`.

### Criação da Instância do Router (linhas 26-29)

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
});
```

#### `createRouter()`

Cria instância do router com configurações.

#### `history: createWebHistory()`

Define modo de histórico HTML5:

- **URLs limpas**: `/records` ao invés de `/#/records`
- **Funciona com HTML5 History API**
- **Requer configuração no servidor** para produção (fallback para index.html)

**Alternativas:**

- `createWebHashHistory()`: Usa `#` nas URLs (ex: `/#/records`)
  - Não requer configuração servidor
  - Bom para ambientes sem controle do servidor

- `createMemoryHistory()`: Não altera URL do navegador
  - Usado em testes ou SSR

#### `routes`

Array de rotas definido anteriormente.

### Export (linha 31)

```javascript
export default router;
```

Exporta instância do router para ser usado em `main.js`.

## Configurando o App

### App.vue

Este arquivo já foi configurado na etapa de setup:

```vue title="./src/App.vue" linenums="1"
<script setup>
// Não precisa de lógica aqui
</script>

<template>
  <RouterView />
</template>

<style>
@import './assets/css/global.css';
</style>
```

#### `<RouterView />`

Componente especial do Vue Router que:

- Renderiza o componente correspondente à rota atual
- Atualiza automaticamente quando rota muda
- É onde as views (HomeView, RecordsView, etc.) aparecem

### main.js

Arquivo principal que integra o router:

```javascript title="./src/main.js" linenums="1"
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
```

#### Linha por linha:

1. **Linha 1**: Importa função para criar aplicação Vue
2. **Linha 2**: Importa componente raiz
3. **Linha 3**: Importa configuração do router
4. **Linha 5**:
   - `createApp(App)`: Cria instância da aplicação
   - `.use(router)`: Registra plugin do router
   - `.mount('#app')`: Monta aplicação no elemento com id="app"

## Navegação na Aplicação

### Navegação Declarativa com RouterLink

```vue
<RouterLink to="/records">Ver registros</RouterLink>

<RouterLink :to="`/records/${record.id}`">Ver detalhes</RouterLink>

<RouterLink :to="{ name: 'home' }">Início</RouterLink>
```

#### Vantagens do RouterLink:

- ✅ Não recarrega página (SPA)
- ✅ Adiciona classe `router-link-active` quando rota está ativa
- ✅ Funciona com teclas de atalho (Ctrl+Click para nova aba)
- ✅ Intercepta cliques e usa navegação client-side

### Navegação Programática

```javascript
import { useRouter } from 'vue-router';

const router = useRouter();

// Por path
router.push('/records');

// Por nome
router.push({ name: 'record-detail', params: { id: 123 } });

// Voltar página anterior
router.back();

// Ir para frente
router.forward();

// Substituir rota atual (não adiciona ao histórico)
router.replace('/home');
```

### Quando usar cada tipo?

**RouterLink**: Links clicáveis na interface

**router.push()**: Navegação após ações (ex: salvar formulário)

**router.back()**: Botões de voltar

## Ordem de Prioridade de Rotas

**IMPORTANTE**: Rotas mais específicas devem vir **antes** de rotas genéricas.

### ❌ Ordem incorreta:

```javascript
// Esta ordem causa problema!
{ path: '/records/:id', ... },        // Captura tudo
{ path: '/records/:id/edit', ... },  // Nunca será alcançada!
```

### ✅ Ordem correta:

```javascript
// Mais específico primeiro
{ path: '/records/:id/edit', ... },   // /records/123/edit
{ path: '/records/:id', ... },        // /records/123
```

### Por que?

O Vue Router testa rotas na ordem definida. A primeira que corresponder será usada.

Se `/records/:id` vier primeiro, `/records/123/edit` será interpretado como `id = "123/edit"`, nunca chegando na rota de edição.

## Guardas de Navegação (Opcional)

Você pode adicionar verificações antes de acessar rotas:

```javascript
// Verificar autenticação antes de acessar rota
router.beforeEach((to, from) => {
  const isAuthenticated = checkAuth();

  if (to.name !== 'login' && !isAuthenticated) {
    return { name: 'login' };
  }
});
```

**Casos de uso:**

- Autenticação
- Validação de permissões
- Confirmação antes de sair de formulário não salvo
- Redirecionamentos condicionais

## Configuração para Produção

### Problema: 404 em produção

Quando usar `createWebHistory()`, URLs limpas requerem configuração no servidor.

**Por quê?**

- Usuário acessa `/records/123` diretamente (não via navegação SPA)
- Servidor busca arquivo `/records/123/index.html`
- Arquivo não existe → 404

**Solução:** Servidor deve redirecionar todas as requisições para `index.html`, deixando Vue Router resolver a rota.

### Configuração Vite (vite.config.js)

Para preview local:

```javascript
export default {
  preview: {
    port: 3000,
    open: true,
  },
};
```

### Configuração Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Configuração Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Conceitos Aplicados

### ✅ Single Page Application (SPA)

- Navegação sem reload da página
- Experiência fluida como app nativo

### ✅ Lazy Loading

- Componentes carregados sob demanda
- Performance otimizada

### ✅ Rotas Dinâmicas

- Parâmetros variáveis na URL
- Acesso via `route.params`

### ✅ História do Navegador

- Botões voltar/avançar funcionam
- URLs compartilháveis

## Testando as Rotas

### URLs para testar:

1. **Home**: http://localhost:5173/
2. **Listagem**: http://localhost:5173/records
3. **Detalhes**: http://localhost:5173/records/123 (criar registro primeiro)
4. **Criar**: http://localhost:5173/records/new/edit
5. **Editar**: http://localhost:5173/records/123/edit

### Verificações:

- ✅ Cada URL renderiza a view correta
- ✅ Navegação entre páginas funciona
- ✅ Botão voltar do navegador funciona
- ✅ URLs mudam ao navegar
- ✅ Atualizar página mantém rota atual

## Próximos Passos

Com o router configurado, temos uma aplicação completa e funcional! Na próxima etapa, vamos finalizar o projeto, executá-lo e revisar todos os conceitos aplicados.

**[← Voltar: Views](04-views.md)** | **[Próximo: Finalização e Testes →](06-finalizacao.md)**
