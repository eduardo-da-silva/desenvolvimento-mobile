# 6. Finalização e Testes

## Objetivo

Nesta etapa final, vamos executar a aplicação, testar todas as funcionalidades e revisar os conceitos aprendidos. Você também encontrará sugestões de melhorias para expandir o projeto.

## Executando o Projeto

### Passo 1: Verificar estrutura

Certifique-se de que todos os arquivos foram criados:

```
src/
├── assets/
│   └── css/
│       └── global.css ✓
├── components/
│   ├── layout/
│   │   └── AppHeader.vue ✓
│   ├── forms/
│   │   ├── AppInput.vue ✓
│   │   └── AppButton.vue ✓
│   └── records/
│       └── RecordCard.vue ✓
├── views/
│   ├── HomeView.vue ✓
│   ├── RecordsView.vue ✓
│   ├── RecordDetailView.vue ✓
│   └── RecordFormView.vue ✓
├── composables/
│   └── useRecords.js ✓
├── router/
│   └── index.js ✓
├── App.vue ✓
└── main.js ✓
```

### Passo 2: Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Você verá algo como:

```
VITE v5.0.0  ready in 250 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

### Passo 3: Acessar no navegador

- **Desktop**: http://localhost:5173/
- **Mobile**: Use o IP da rede (ex: http://192.168.1.100:5173/)

> 💡 **Dica**: Abra o DevTools do navegador (F12) e use o modo responsivo para simular dispositivos móveis.

## Testando Funcionalidades

### ✅ Checklist de Testes

#### 1. Página Inicial (HomeView)

**Testes:**

- [ ] Header exibe "Registro de Atividades"
- [ ] Mensagem de boas-vindas aparece
- [ ] Cards de estatísticas mostram 0 registros e 0 minutos
- [ ] Botões "Ver registros" e "Novo registro" são clicáveis
- [ ] Clicar "Ver registros" navega para `/records`
- [ ] Clicar "Novo registro" navega para `/records/new/edit`

#### 2. Criação de Registro (RecordFormView)

**Testes:**

- [ ] Navegar para criação via botão ou FAB
- [ ] Header exibe "Novo Registro"
- [ ] Botão voltar funciona
- [ ] Campos título e duração são obrigatórios (\*)
- [ ] Campo observações é opcional
- [ ] Tentar submeter sem preencher mostra alerta
- [ ] Preencher campos e submeter cria registro
- [ ] Após criar, redireciona para `/records`
- [ ] Novo registro aparece na lista

**Dados de teste:**

```
Título: Estudar Vue.js
Duração: 60
Observações: Revisão de Composition API
```

#### 3. Listagem de Registros (RecordsView)

**Testes:**

- [ ] Header exibe "Meus Registros"
- [ ] Registros aparecem em cards
- [ ] Cada card mostra título, duração e data
- [ ] FAB (+) aparece no canto inferior direito
- [ ] Clicar no card navega para detalhes
- [ ] Clicar no FAB abre formulário de criação

#### 4. Detalhes do Registro (RecordDetailView)

**Testes:**

- [ ] Header exibe "Detalhes"
- [ ] Título aparece em destaque
- [ ] Duração está corretamente formatada
- [ ] Data está em formato brasileiro (dd/mês/ano)
- [ ] Observações aparecem se existirem
- [ ] Botão "Editar" navega para formulário
- [ ] Botão "Excluir" mostra confirmação
- [ ] Confirmar exclusão remove registro e volta para lista

#### 5. Edição de Registro (RecordFormView)

**Testes:**

- [ ] Abrir edição através do botão "Editar"
- [ ] Header exibe "Editar Registro"
- [ ] Campos vêm preenchidos com dados atuais
- [ ] Modificar campos e salvar atualiza registro
- [ ] Após salvar, redireciona para listagem
- [ ] Mudanças aparecem no card e detalhes

#### 6. Persistência de Dados

**Testes:**

- [ ] Criar alguns registros
- [ ] Atualizar página (F5)
- [ ] Registros continuam aparecendo
- [ ] Fechar navegador e reabrir
- [ ] Dados permanecem salvos
- [ ] Abrir DevTools → Application → Local Storage
- [ ] Verificar chave "records" com dados JSON

#### 7. Navegação

**Testes:**

- [ ] Botões voltar do header funcionam
- [ ] Botão voltar do navegador funciona
- [ ] URLs mudam ao navegar
- [ ] Acessar URL diretamente funciona
- [ ] Histórico do navegador funciona corretamente

#### 8. Estatísticas em Tempo Real

**Testes:**

- [ ] Na home, criar novo registro
- [ ] Voltar para home
- [ ] Contador de registros aumentou
- [ ] Total de minutos foi atualizado
- [ ] Excluir registro
- [ ] Contadores diminuem automaticamente

#### 9. Mobile/Responsividade

**Testes:**

- [ ] Abrir no celular ou modo responsivo
- [ ] Elementos têm tamanho adequado para toque
- [ ] Textos são legíveis sem zoom
- [ ] Layout se adapta à tela pequena
- [ ] Transições são suaves
- [ ] FAB não sobrepõe conteúdo importante

#### 10. Estados Vazios

**Testes:**

- [ ] Excluir todos os registros
- [ ] Página de listagem mostra emoji 📭
- [ ] Mensagem "Nenhum registro ainda" aparece
- [ ] Botão "Criar primeiro registro" funciona

## Inspecionando o LocalStorage

### Ver dados salvos

1. Abra DevTools (F12)
2. Vá para aba **Application** (Chrome) ou **Storage** (Firefox)
3. Expanda **Local Storage**
4. Clique na URL da aplicação
5. Veja a chave `records`

### Exemplo de dados:

```json
[
  {
    "id": 1705332000000,
    "title": "Estudar Vue.js",
    "duration": 60,
    "notes": "Revisão de Composition API",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 1705335600000,
    "title": "Exercício físico",
    "duration": 45,
    "notes": "",
    "createdAt": "2024-01-15T11:30:00.000Z"
  }
]
```

### Limpar dados

Para resetar aplicação:

1. No DevTools → Application → Local Storage
2. Clique direito na chave `records`
3. Selecione "Delete"
4. Recarregue página

Ou via console:

```javascript
localStorage.removeItem('records');
location.reload();
```

## Fluxo de Dados Completo

### Visualização do fluxo

```
┌─────────────┐
│   Views     │ ← Componentes de página
└──────┬──────┘
       │ usa
       ↓
┌─────────────┐
│ useRecords  │ ← Composable (lógica)
└──────┬──────┘
       │ modifica
       ↓
┌─────────────┐
│   records   │ ← Estado global (ref)
└──────┬──────┘
       │ persiste
       ↓
┌─────────────┐
│LocalStorage │ ← Navegador
└─────────────┘
```

### Exemplo prático:

**Ação**: Usuário cria registro

1. `RecordFormView` chama `addRecord()`
2. `useRecords.addRecord()` cria objeto com ID e timestamp
3. Adiciona ao array `records.value`
4. Salva no `localStorage`
5. Vue detecta mudança reativa
6. Todos os componentes usando `records` re-renderizam
7. `HomeView` atualiza estatísticas automaticamente
8. `RecordsView` mostra novo card na lista

## Revisão de Conceitos

### 📚 Vue.js 3 - Composition API

**Aplicado no projeto:**

- ✅ `ref()` para valores reativos simples (ex: `const record = ref(null)`)
- ✅ `reactive()` para objetos reativos (ex: `const form = ref({ title: '', duration: '' })`)
- ✅ `computed()` para valores derivados (ex: `totalRecords`, `isEditMode`)
- ✅ `onMounted()` para lifecycle hooks (ex: carregar dados ao montar)
- ✅ `watch()` poderia ser usado para reagir a mudanças

**Por que usar?**

- Organização por funcionalidade ao invés de opção
- Reutilização de lógica com composables
- Melhor TypeScript support
- Código mais limpo e testável

### 🧩 Componentes Reutilizáveis

**Criados:**

- `AppHeader`, `AppInput`, `AppButton`, `RecordCard`

**Benefícios:**

- Consistência visual
- Redução de código duplicado
- Manutenção centralizada
- Facilita testes

**Props e Eventos:**

```vue
<!-- Props: passar dados para componente filho -->
<AppHeader title="Meu Título" show-back />

<!-- Eventos: filho comunica com pai -->
<AppHeader @back="handleBack" />
```

### 🗂️ Composables

**Criado:**

- `useRecords()` - Gerencia estado e operações CRUD

**Características:**

- Estado global compartilhado
- Lógica isolada e reutilizável
- Pode usar recursos reativos do Vue
- Testável independentemente

**Quando criar composables:**

- Lógica complexa usada em múltiplos componentes
- Gerenciamento de estado
- Integração com APIs externas
- Funcionalidades reutilizáveis

### 🧭 Vue Router

**Conceitos aplicados:**

- Rotas estáticas e dinâmicas
- Parâmetros de rota (`:id`)
- Navegação declarativa (`RouterLink`)
- Navegação programática (`router.push()`)
- Lazy loading de componentes

**Padrões usados:**

```javascript
// Acessar parâmetros
const route = useRoute();
const id = route.params.id;

// Navegar programaticamente
const router = useRouter();
router.push('/records');
router.back();
```

### 💾 Persistência com LocalStorage

**Implementado:**

- Salvamento automático após cada operação
- Carregamento na inicialização
- Sincronização com estado Vue

**Limitações:**

- Dados apenas no navegador
- Limite de ~5-10MB
- Não sincroniza entre dispositivos
- Pode ser limpo pelo usuário

**Próximo passo:**

Integrar com backend para persistência real e sincronização.

### 🎨 Design Mobile-First

**Aplicado:**

- Elementos com min 48px de altura
- Fonte ≥ 16px para evitar zoom iOS
- FAB para ação principal
- Feedback visual em toques
- Layout adaptável sem media queries (Grid/Flexbox)
- Espaçamento generoso

## Melhorias Sugeridas

### 🚀 Nível Básico

#### 1. Adicionar categorias

```javascript
const categories = ['Estudo', 'Trabalho', 'Exercício', 'Lazer'];

// No formulário
<select v-model="form.category">
  <option v-for="cat in categories">{{ cat }}</option>
</select>;
```

#### 2. Ordenação de registros

```javascript
// Por data (mais recente primeiro)
const sortedRecords = computed(() => {
  return [...records.value].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
});

// Por duração
const sortedByDuration = computed(() => {
  return [...records.value].sort((a, b) => b.duration - a.duration);
});
```

#### 3. Busca/Filtro

```vue
<script setup>
const searchQuery = ref('');

const filteredRecords = computed(() => {
  return records.value.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});
</script>

<template>
  <input v-model="searchQuery" placeholder="Buscar..." />
  <RecordCard v-for="record in filteredRecords" ... />
</template>
```

#### 4. Validação de formulário

```javascript
// Usar biblioteca como VeeValidate ou Zod
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  duration: z.number().min(1, 'Duração deve ser positiva'),
});

function handleSubmit() {
  try {
    schema.parse(form.value);
    // Salvar
  } catch (error) {
    // Mostrar erros
  }
}
```

### 🎨 Nível Intermediário

#### 5. Dark mode

```css
/* Em global.css */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #f0f0f0;
  }
}
```

```javascript
// Toggle manual
const darkMode = ref(false);

function toggleDarkMode() {
  darkMode.value = !darkMode.value;
  document.body.classList.toggle('dark-mode');
}
```

#### 6. Animações de transição

```vue
<template>
  <TransitionGroup name="list" tag="div">
    <RecordCard v-for="record in records" :key="record.id" ... />
  </TransitionGroup>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

#### 7. Gráficos e estatísticas

```bash
npm install chart.js vue-chartjs
```

```vue
<script setup>
import { Bar } from 'vue-chartjs';

const chartData = computed(() => ({
  labels: records.value.map((r) => r.title),
  datasets: [
    {
      label: 'Duração',
      data: records.value.map((r) => r.duration),
    },
  ],
}));
</script>

<template>
  <Bar :data="chartData" />
</template>
```

### 🔥 Nível Avançado

#### 8. Gerenciamento de estado com Pinia

```bash
npm install pinia
```

```javascript
// stores/records.js
import { defineStore } from 'pinia';

export const useRecordsStore = defineStore('records', () => {
  const records = ref([]);

  function addRecord(record) {
    // ...
  }

  return { records, addRecord };
});
```

#### 9. Integração com API backend

```javascript
// api/records.js
const API_URL = 'https://api.example.com';

export async function fetchRecords() {
  const response = await fetch(`${API_URL}/records`);
  return response.json();
}

export async function createRecord(data) {
  const response = await fetch(`${API_URL}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

#### 10. Transformar em PWA

```bash
npm install -D vite-plugin-pwa
```

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Registro de Atividades',
        short_name: 'Registros',
        description: 'App para registrar atividades diárias',
        theme_color: '#0b5cff',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
};
```

## Troubleshooting

### Problema: Página em branco

**Possíveis causas:**

- Erro de JavaScript (verificar console)
- Rota não configurada
- Componente não importado corretamente

**Solução:**

1. Abrir DevTools (F12)
2. Ver aba Console
3. Procurar erros em vermelho
4. Verificar importações de arquivos

### Problema: Dados não persistem

**Possíveis causas:**

- LocalStorage desabilitado
- Modo anônimo do navegador
- Erro ao salvar

**Solução:**

```javascript
// Verificar suporte
if (typeof localStorage !== 'undefined') {
  console.log('LocalStorage suportado');
} else {
  console.error('LocalStorage não disponível');
}

// Verificar dados salvos
console.log(localStorage.getItem('records'));
```

### Problema: Rotas não funcionam em produção

**Causa:**
Servidor não configurado para SPAs

**Solução:**
Ver seção de configuração para produção em [05-router.md](05-router.md)

## Conclusão

Parabéns! 🎉 Você completou um projeto completo de aplicação Vue.js 3 com:

- ✅ **12 arquivos criados** organizados profissionalmente
- ✅ **4 views** com funcionalidades completas
- ✅ **4 componentes reutilizáveis** bem estruturados
- ✅ **1 composable** com lógica de negócio
- ✅ **Roteamento completo** com Vue Router
- ✅ **Persistência de dados** com LocalStorage
- ✅ **Design mobile-first** responsivo

### O que você aprendeu

- **Composition API**: setup, ref, reactive, computed, onMounted
- **Componentização**: Props, eventos, slots, CSS scoped
- **Composables**: Lógica reutilizável e estado global
- **Vue Router**: Rotas, navegação, parâmetros dinâmicos
- **Formulários**: v-model, validação, submit handling
- **LocalStorage**: Persistência client-side
- **Boas práticas**: Organização de código, lazy loading, mobile-first

### Próximos estudos

Na **Unidade 3**, você aprenderá:

- **Pinia**: Gerenciamento de estado global avançado
- **API REST**: Integração com backend
- **PWA**: Transformar aplicação em Progressive Web App
- **Testes**: Unit tests e E2E tests
- **Deploy**: Publicar aplicação em produção

---

**[← Voltar: Configuração de Rotas](05-router.md)** | **[Voltar ao índice do projeto](index.md)** | **[Unidade 2](../index.md)**
