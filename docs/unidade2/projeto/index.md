# Projeto Prático: Sistema de Gestão de Registros

## Visão Geral do Projeto

Neste projeto prático, vamos desenvolver um **Sistema de Gestão de Registros** completo utilizando Vue.js 3 com Composition API. O aplicativo permite criar, visualizar, editar e excluir registros de forma simples e intuitiva, demonstrando os conceitos fundamentais do desenvolvimento com Vue.js 3.

## Objetivos de Aprendizagem

Ao concluir este projeto, você será capaz de:

- ✅ Criar e estruturar um projeto Vue.js 3 com Vite
- ✅ Utilizar a Composition API com `setup()`, `ref()` e `reactive()`
- ✅ Desenvolver composables reutilizáveis para lógica de negócio
- ✅ Criar componentes reutilizáveis com props e eventos
- ✅ Implementar navegação com Vue Router
- ✅ Gerenciar estado local com LocalStorage
- ✅ Aplicar boas práticas de organização de código

## Funcionalidades do Sistema

### 1. Página Inicial (Home)

- Apresentação do sistema
- Navegação para a listagem de registros

### 2. Listagem de Registros

- Visualização de todos os registros cadastrados
- Card para cada registro com título e descrição
- Botões de ação: visualizar detalhes, editar e excluir
- Botão para adicionar novo registro
- Contadores de estatísticas

### 3. Detalhes do Registro

- Visualização completa de um registro específico
- Exibição de título, descrição e data de criação
- Botões para editar ou excluir o registro

### 4. Formulário de Registro

- Criação de novos registros
- Edição de registros existentes
- Validação de campos obrigatórios
- Feedback visual para o usuário

## Tecnologias Utilizadas

- **Vue.js 3**: Framework JavaScript progressivo
- **Composition API**: Nova API para composição de lógica
- **Vue Router**: Gerenciamento de rotas
- **Vite**: Build tool moderna e rápida
- **LocalStorage**: Persistência de dados no navegador
- **CSS moderno**: Estilos responsivos e mobile-first

## Estrutura do Projeto

O projeto está organizado seguindo as melhores práticas:

```
src/
├── assets/             # Recursos estáticos (CSS, imagens)
├── components/         # Componentes reutilizáveis
│   ├── AppHeader.vue
│   ├── AppInput.vue
│   ├── AppButton.vue
│   └── RecordCard.vue
├── composables/        # Lógica reutilizável
│   └── useRecords.js
├── router/            # Configuração de rotas
│   └── index.js
├── views/             # Páginas da aplicação
│   ├── HomeView.vue
│   ├── RecordsView.vue
│   ├── RecordDetailView.vue
│   └── RecordFormView.vue
├── App.vue            # Componente raiz
└── main.js            # Ponto de entrada
```

## Roteiro de Implementação

Para facilitar o aprendizado, o projeto está dividido em etapas sequenciais:

1. **[Configuração do Projeto](01-setup.md)**: Criação e configuração inicial do projeto com Vite
2. **[Composable useRecords](02-composable.md)**: Implementação da lógica de negócio reutilizável
3. **[Componentes Reutilizáveis](03-componentes.md)**: Desenvolvimento dos componentes base do sistema
4. **[Views (Páginas)](04-views.md)**: Criação das páginas principais da aplicação
5. **[Configuração de Rotas](05-router.md)**: Implementação da navegação com Vue Router
6. **[Finalização e Testes](06-finalizacao.md)**: Ajustes finais e execução da aplicação

## Como Usar Este Material

Cada seção do projeto contém:

- 📖 **Explicação conceitual**: O que está sendo implementado e por quê
- 💻 **Código completo**: Implementação detalhada de cada arquivo
- 🔍 **Análise do código**: Explicação das partes mais relevantes
- 💡 **Dicas e boas práticas**: Orientações para melhorar seu código

## Conceitos Chave do Projeto

### Composables

São funções que encapsulam lógica reutilizável. No projeto, `useRecords` gerencia todas as operações relacionadas aos registros (CRUD + LocalStorage).

### Componentes Reutilizáveis

Componentes genéricos que podem ser utilizados em diferentes contextos, como `AppButton`, `AppInput` e `AppHeader`. Isso promove reutilização de código e consistência visual.

### Composition API

A nova API do Vue.js 3 permite organizar código por funcionalidade ao invés de opções. Utilizamos `ref()` para valores reativos simples e `reactive()` para objetos reativos.

### Vue Router

Gerencia a navegação entre páginas, permitindo criar uma Single Page Application (SPA) com URLs específicas para cada view.

### LocalStorage

Armazena dados no navegador do usuário, permitindo persistência simples sem necessidade de backend.

## Próximos Passos

Comece pela **[Configuração do Projeto](01-setup.md)** e siga as etapas sequencialmente. Cada seção constrói sobre a anterior, então é importante seguir a ordem recomendada.

Bons estudos! 🚀
