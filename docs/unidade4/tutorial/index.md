# Tutorial prático: criando um PWA com Vue.js

## Visão geral

Neste tutorial, vamos criar um projeto Vue.js 3 com Vite do zero e transformá-lo em um Progressive Web App funcional. O projeto será um **gerenciador de tarefas** simples, com funcionalidades suficientes para demonstrar todos os conceitos de PWA.

Ao final do tutorial, você terá:

- Um projeto Vue.js 3 com suporte completo a PWA
- Manifesto configurado com ícones e cores
- Service Worker gerenciando cache automaticamente
- Aplicação funcionando offline
- Aplicativo instalável no desktop e no celular
- Estratégia de atualização de versão implementada

## Estrutura do tutorial

O tutorial está dividido em 7 passos, cada um focando em um aspecto do PWA:

| Passo | Conteúdo                                         |
| ----- | ------------------------------------------------ |
| 1     | [Configuração do suporte a PWA](01-setup-pwa.md) |
| 2     | [Configuração do manifesto](02-manifesto.md)     |
| 3     | [Service Worker](03-service-worker.md)           |
| 4     | [Estratégias de cache](04-estrategias-cache.md)  |
| 5     | [Funcionamento offline](05-offline.md)           |
| 6     | [Instalação do aplicativo](06-instalacao.md)     |
| 7     | [Atualização de versão](07-atualizacao.md)       |

## O projeto base

Antes de começar a parte de PWA, precisamos de uma aplicação Vue.js funcional. No Passo 1, vamos criar o projeto e implementar uma interface básica de gerenciamento de tarefas, com:

- Uma tela principal com lista de tarefas
- Formulário para adicionar novas tarefas
- Opção de marcar tarefas como concluídas
- Navegação entre telas usando Vue Router

A aplicação será simples, mas suficiente para demonstrar o comportamento de um PWA em um cenário real.

---

**Próximo:** [Passo 1 – Configuração do suporte a PWA](01-setup-pwa.md)
