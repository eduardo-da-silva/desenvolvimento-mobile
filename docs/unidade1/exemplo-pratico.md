# 6. Exemplo prático inicial

Agora que você já conhece os conceitos básicos, vamos ver um exemplo prático de uma interface mobile-first. Vamos criar uma **lista de tarefas simples** usando apenas HTML e CSS.

O objetivo é entender **o que muda** quando pensamos em mobile desde o início.

## O que vamos criar

Uma interface simples para listar tarefas, com:

- Cabeçalho fixo
- Lista de tarefas
- Botão de ação na parte inferior (fácil de alcançar com o polegar)

## Código completo

### HTML

```html linenums="1" title="./index.html"
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Minhas Tarefas</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <!-- Cabeçalho fixo -->
    <header class="header">
      <h1>Minhas Tarefas</h1>
    </header>

    <!-- Lista de tarefas -->
    <main class="main">
      <ul class="task-list">
        <li class="task-item">
          <span class="task-text">Estudar Progressive Web Apps</span>
        </li>
        <li class="task-item">
          <span class="task-text">Fazer exercícios de Vue.js</span>
        </li>
        <li class="task-item">
          <span class="task-text">Revisar conceitos de mobile-first</span>
        </li>
        <li class="task-item">
          <span class="task-text">Criar protótipo do projeto final</span>
        </li>
      </ul>
    </main>

    <!-- Botão de ação fixo (parte inferior) -->
    <footer class="footer">
      <button class="add-button">+ Nova Tarefa</button>
    </footer>
  </body>
</html>
```

### CSS

```css linenums="1" title="./styles.css"
/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
  /* Impede que a página seja puxada além dos limites (efeito bounce) */
  overscroll-behavior: none;
}

/* Cabeçalho fixo no topo */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #6200ea;
  color: white;
  padding: 16px;
  /* Mantém o cabeçalho acima de outros elementos */
  z-index: 10;
  /* Sombra sutil para dar sensação de elevação */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 20px;
  font-weight: 600;
}

/* Área principal com scroll */
.main {
  /* Espaço para o cabeçalho (56px) e o botão inferior (80px) */
  margin-top: 56px;
  margin-bottom: 80px;
  padding: 16px;
}

/* Lista de tarefas */
.task-list {
  list-style: none;
}

.task-item {
  background-color: white;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  /* Sombra sutil para dar profundidade */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  /* Feedback visual ao tocar */
  transition:
    transform 0.1s,
    box-shadow 0.1s;
}

/* Estado ativo (quando o usuário toca) */
.task-item:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.task-text {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

/* Rodapé fixo na parte inferior */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: white;
  /* Sombra para cima, dando sensação de elevação */
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* Botão de adicionar tarefa */
.add-button {
  width: 100%;
  /* Altura mínima recomendada para elementos tocáveis */
  min-height: 48px;
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  /* Cursor pointer (funciona no desktop também) */
  cursor: pointer;
  /* Feedback visual suave */
  transition: background-color 0.2s;
}

/* Estado ativo do botão */
.add-button:active {
  background-color: #5300d1;
}

/* Para telas maiores (desktop), limitar a largura */
@media (min-width: 768px) {
  .header,
  .main,
  .footer {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

## Explicação do código

Vamos entender o que cada parte faz e **por que** foi feita dessa forma.

### 1. **Meta tag viewport**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Essa linha é **essencial** para mobile. Ela diz ao navegador:

- `width=device-width`: use a largura real do dispositivo
- `initial-scale=1.0`: sem zoom inicial

Sem ela, o navegador assume que você está vendo um site desktop e diminui tudo para caber na tela (experiência horrível).

### 2. **Cabeçalho fixo no topo**

```css
.header {
  position: fixed;
  top: 0;
  /* ... */
}
```

O cabeçalho fica fixo no topo, mesmo quando você faz scroll na lista. Isso mantém o contexto (você sempre vê "Minhas Tarefas").

**Por que isso é bom para mobile?**

- Economiza espaço (não precisa reaparecer a cada scroll)
- Mantém a identidade visual da tela

### 3. **Área de conteúdo com margem**

```css
.main {
  margin-top: 56px; /* Altura do cabeçalho */
  margin-bottom: 80px; /* Altura do rodapé */
  /* ... */
}
```

Como o cabeçalho e o rodapé são fixos, precisamos de margem para que o conteúdo não fique escondido atrás deles.

### 4. **Itens da lista com feedback visual**

```css
.task-item:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
```

Quando o usuário toca um item, ele **encolhe levemente** e a sombra diminui. Isso dá feedback visual claro de que o toque foi registrado.

**Isso é importante porque:**

- No mobile, não há hover para indicar interatividade
- O feedback imediato melhora a experiência

### 5. **Botão de ação na parte inferior**

```css
.footer {
  position: fixed;
  bottom: 0;
  /* ... */
}

.add-button {
  min-height: 48px; /* Tamanho adequado para toque */
  /* ... */
}
```

O botão fica fixo na parte inferior, onde o polegar alcança facilmente. E tem 48px de altura, tamanho recomendado para elementos tocáveis.

### 6. **Responsividade progressiva**

```css
@media (min-width: 768px) {
  .header,
  .main,
  .footer {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

Em telas grandes (tablets, desktops), a interface fica centralizada com largura máxima de 600px. Isso evita que os elementos fiquem esticados demais.

**Princípio mobile-first:**

- Código base é mobile
- Ajustes para telas maiores vêm depois (via media query)

## O que muda em relação a uma página desktop?

Se fôssemos fazer isso para desktop, teríamos:

- Cabeçalho poderia ter menu lateral
- Lista poderia ter colunas (categoria, data, status)
- Botão de adicionar poderia ficar no canto superior direito
- Hover seria usado para indicar interatividade

No mobile:

- Interface linear e simples
- Uma coluna apenas
- Botão de ação ao alcance do polegar
- Feedback visual por estados de toque (:active)

## Testando no navegador

Para testar esse exemplo:

1. Salve o HTML em um arquivo `index.html`
2. Salve o CSS em um arquivo `styles.css`
3. Abra o `index.html` no navegador
4. **Importante:** use o modo de desenvolvedor para simular mobile
   - Chrome: F12 → ícone de celular (toggle device toolbar)
   - Firefox: F12 → ícone de celular

Você verá a interface otimizada para mobile.

## Resumo

Este exemplo mostrou:

- Como usar `position: fixed` para cabeçalho e rodapé
- Como dar feedback visual com `:active`
- Como garantir que elementos tocáveis tenham tamanho adequado
- Como aplicar mobile-first e adaptar para telas maiores

Nas próximas unidades, vamos adicionar Vue.js e transformar isso em um PWA completo, com funcionalidades offline e interatividade avançada.

---

**Anterior:** [Primeiros cuidados com UX mobile](ux-mobile.md) | **Próximo:** [Resumo e exercícios](resumo-exercicios.md)
