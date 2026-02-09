# Unidade 2 – Estruturação de Aplicações com Vue.js 3

## Apresentação da Unidade

Na Unidade 1, você conheceu o panorama do desenvolvimento mobile com tecnologias web e criou sua primeira interface mobile usando HTML, CSS e JavaScript puro. Agora é hora de evoluir para uma abordagem mais profissional e escalável.

Nesta unidade, vamos utilizar o **Vue.js 3** para estruturar aplicações mobile de forma organizada, reutilizável e mantível. Você já conhece o Vue.js do desenvolvimento web tradicional — agora vamos adaptá-lo para o contexto mobile.

**Objetivos de aprendizagem:**

- Criar projetos Vue.js 3 com Vite otimizados para desenvolvimento rápido
- Dominar a Composition API para código mais limpo e modular
- Estruturar componentes reutilizáveis pensando em apps mobile
- Implementar comunicação entre componentes com props e eventos
- Organizar projetos seguindo boas práticas
- Criar navegação entre telas com Vue Router

## Navegação da Unidade

1. [Criando projeto Vue.js 3 com Vite](criando-projeto-vite.md)
2. [Composition API: setup, ref e reactive](composition-api.md)
3. [Criando componentes reutilizáveis](componentes-reutilizaveis.md)
4. [Comunicação entre componentes: props e eventos](props-eventos.md)
5. [Organização de projeto mobile](organizacao-projeto.md)
6. [Vue Router: navegação entre páginas](vue-router.md)
7. [Projeto prático: App de Registro com Vue.js](projeto/index.md)

## Do HTML puro ao Vue.js

Na unidade anterior, você criou uma interface funcional manipulando diretamente o DOM com JavaScript:

```javascript
// Abordagem da Unidade 1
const recordsList = document.getElementById('records');
records.forEach((r) => {
  const li = document.createElement('li');
  li.textContent = `${r.title} — ${r.duration} min`;
  recordsList.appendChild(li);
});
```

Essa abordagem funciona, mas tem limitações:

- Código repetitivo
- Difícil de manter quando cresce
- Sem reutilização de partes da interface
- Lógica misturada com manipulação de DOM

Com Vue.js, você vai escrever:

```vue
<!-- Abordagem com Vue.js -->
<template>
  <ul>
    <RecordItem
      v-for="record in records"
      :key="record.id"
      :title="record.title"
      :duration="record.duration"
    />
  </ul>
</template>
```

Bem mais limpo, reutilizável e fácil de manter!

## Por que Vue.js para aplicações mobile?

O Vue.js traz benefícios importantes para o desenvolvimento mobile:

### 1. **Componentes reutilizáveis**

Crie uma vez, use em várias telas. Perfeito para manter consistência visual em apps.

### 2. **Reatividade automática**

Os dados mudam, a interface atualiza sozinha. Sem manipulação manual do DOM.

### 3. **Single File Components (SFC)**

Tudo relacionado a um componente (template, lógica, estilo) em um arquivo só.

### 4. **Ecossistema maduro**

Vue Router (navegação), Pinia (estado global), ferramentas de build otimizadas.

### 5. **Performance**

Virtual DOM garante atualizações eficientes — importante em dispositivos móveis.

### 6. **Developer Experience**

Hot Module Replacement (HMR), ferramentas de debug, TypeScript opcional.

## O que vamos construir

Ao longo desta unidade, vamos evoluir o projeto da Unidade 1 (App de Registro de Atividades) para Vue.js 3:

**Funcionalidades que implementaremos:**

- ✅ Tela inicial (Home) com lista de registros
- ✅ Tela de criação de novo registro
- ✅ Tela de detalhes de um registro
- ✅ Componentes reutilizáveis (Header, Card, Button)
- ✅ Navegação entre telas
- ✅ Dados reativos (ainda em memória)

**O que fica para unidades futuras:**

- ⏭️ Estado global com Pinia
- ⏭️ Persistência com localStorage
- ⏭️ Integração com API backend
- ⏭️ Transformação em PWA

## Pré-requisitos

Antes de começar, certifique-se de ter:

- **Node.js** instalado (versão 18 ou superior)
- **npm** ou **yarn** para gerenciar pacotes
- Editor de código (VS Code recomendado)
- Conhecimento básico de Vue.js (como aprendeu em disciplinas anteriores)

Vamos começar!

---

**Próximo:** [Criando projeto Vue.js 3 com Vite](criando-projeto-vite.md)
