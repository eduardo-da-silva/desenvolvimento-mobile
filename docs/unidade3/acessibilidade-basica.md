# 4. Acessibilidade básica em aplicações web/mobile

Acessibilidade é fazer o app funcionar para **mais pessoas**. Não é algo extra — é parte da qualidade do produto.

## Princípios básicos

- **Contraste suficiente:** texto precisa ser legível
- **Tamanho de fonte adequado:** evite fontes muito pequenas
- **Alvos de toque grandes:** no mínimo 44x44 px
- **Texto claro:** mensagens curtas e diretas

## Não dependa só de cor

Se o erro é "vermelho", adicione também:

- Texto explicando o problema
- Ícone ou indicação visual

## Formulários acessíveis

- Use **rótulos (labels)** visíveis
- Evite placeholders como único guia
- Dê feedback ao erro de preenchimento

## Aplicando acessibilidade em componentes Vue.js

### Formulário acessível

Um formulário acessível usa `<label>` associado ao campo, atributos ARIA para estados de erro e mensagens claras:

```vue linenums="1" title="src/components/AccessibleForm.vue"
<script setup>
import { ref } from 'vue';

const titulo = ref('');
const duracao = ref('');
const erros = ref({});

function validar() {
  erros.value = {};
  if (!titulo.value.trim()) {
    erros.value.titulo = 'Informe o título da atividade.';
  }
  if (!duracao.value || Number(duracao.value) <= 0) {
    erros.value.duracao = 'Informe uma duração válida (em minutos).';
  }
  return Object.keys(erros.value).length === 0;
}

function salvar() {
  if (validar()) {
    // lógica de salvar
  }
}
</script>

<template>
  <form @submit.prevent="salvar" class="form" novalidate>
    <div class="field">
      <label for="titulo" class="label">Título da atividade</label>
      <input
        id="titulo"
        v-model="titulo"
        type="text"
        class="input"
        :class="{ 'input-error': erros.titulo }"
        :aria-invalid="!!erros.titulo"
        :aria-describedby="erros.titulo ? 'titulo-erro' : undefined"
        placeholder="Ex.: Estudo de Vue.js"
      />
      <p v-if="erros.titulo" id="titulo-erro" class="error-msg" role="alert">
        {{ erros.titulo }}
      </p>
    </div>

    <div class="field">
      <label for="duracao" class="label">Duração (minutos)</label>
      <input
        id="duracao"
        v-model="duracao"
        type="number"
        inputmode="numeric"
        class="input"
        :class="{ 'input-error': erros.duracao }"
        :aria-invalid="!!erros.duracao"
        :aria-describedby="erros.duracao ? 'duracao-erro' : undefined"
        placeholder="Ex.: 30"
      />
      <p v-if="erros.duracao" id="duracao-erro" class="error-msg" role="alert">
        {{ erros.duracao }}
      </p>
    </div>

    <button type="submit" class="btn-submit">Salvar</button>
  </form>
</template>

<style scoped>
.form {
  padding: 16px;
}

.field {
  margin-bottom: 16px;
}

.label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 44px;
}

.input:focus {
  outline: 2px solid #0b5cff;
  outline-offset: 2px;
  border-color: #0b5cff;
}

.input-error {
  border-color: #c62828;
}

.input-error:focus {
  outline-color: #c62828;
}

.error-msg {
  color: #c62828;
  font-size: 0.85rem;
  margin-top: 4px;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #0b5cff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  min-height: 48px;
  cursor: pointer;
}

.btn-submit:focus-visible {
  outline: 2px solid #0b5cff;
  outline-offset: 2px;
}
</style>
```

Pontos importantes do exemplo:

| Atributo/Técnica      | Função                                                                |
| --------------------- | --------------------------------------------------------------------- |
| `<label for="...">`   | Associa o rótulo ao campo — leitores de tela anunciam o nome do campo |
| `aria-invalid`        | Indica que o campo tem erro — leitores de tela informam "inválido"    |
| `aria-describedby`    | Conecta o campo à mensagem de erro — o leitor anuncia a mensagem      |
| `role="alert"`        | Faz o leitor de tela anunciar o erro imediatamente quando ele aparece |
| `inputmode="numeric"` | No mobile, abre o teclado numérico em vez do alfanumérico             |
| `:focus-visible`      | Outline visível apenas via teclado, sem atrapalhar o uso por toque    |

### Contraste e tamanho de toque

No CSS dos componentes, mantenha padrões mínimos:

```css title="Referência de boas práticas"
/* Tamanho mínimo de alvo de toque: 44x44px */
button,
a,
input[type='checkbox'],
input[type='radio'] {
  min-height: 44px;
  min-width: 44px;
}

/* Contraste mínimo: 4.5:1 para texto normal, 3:1 para texto grande */
/* Texto escuro sobre fundo claro */
body {
  color: #333; /* sobre #fff → contraste 12.6:1 */
  background: #fff;
}

/* Texto de erro: vermelho acessível */
.error {
  color: #c62828; /* sobre #fff → contraste 7.1:1 */
}
```

!!! tip "Ferramenta útil"

    Use o [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) para verificar se as combinações de cores do seu app atendem ao contraste mínimo.

### Atividade prática

Ative o aumento de fonte no celular e verifique se o app continua legível. Ajuste onde necessário.

---

**Próximo:** [Design simples e funcional](design-simples-funcional.md)
