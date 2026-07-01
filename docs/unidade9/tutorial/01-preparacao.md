# Passo 1 – Preparação do ambiente

## Objetivo

Neste passo, vamos verificar que o backend está no ar, confirmar que o endpoint de upload continua funcional e identificar no código atual os pontos que serão alterados.

## Verificando o backend

A versão do backend para esta unidade é a mesma da Unidade 8 (`4.0`). Se o container ainda estiver rodando da unidade anterior, ele continua funcionando — não é necessário trocar de imagem.

```bash
docker ps
```

Se o container não estiver listado, inicie-o:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:4.0
```

Acesse `http://localhost:8001/docs` e confirme que o endpoint `POST /uploads/images/` está presente no grupo **uploads**.

## Testando o fluxo atual

Antes de começar as alterações, abra o projeto no navegador e verifique o comportamento atual:

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Faça login (se a autenticação estiver ativa) e clique em "Editar" em uma tarefa
3. Clique em "Adicionar imagem" — observe que o seletor de arquivos é aberto
4. Selecione uma imagem da máquina e confirme o upload

Este é o comportamento que vamos modificar: em dispositivos móveis, queremos que a câmera seja aberta diretamente.

## Estado atual do código

O arquivo que concentrará as mudanças é o `src/components/TaskForm.vue`. No estado atual (final da Unidade 8), a seção de imagem tem esta estrutura:

```vue title="src/components/TaskForm.vue" linenums="1"
<div v-if="editingTask" class="image-section">
  <img
    v-if="previewUrl || editingTask.img_url"
    :src="previewUrl || editingTask.img_url"
    class="image-preview"
    alt="Imagem da tarefa"
  />
  <label class="image-label" :class="{ disabled: uploading }">
    <span v-if="uploading" class="upload-status">Enviando...</span>
    <span v-else>
      {{ previewUrl || editingTask.img_url
        ? 'Trocar imagem'
        : 'Adicionar imagem'
      }}
    </span>
    <input
      type="file"
      accept="image/jpeg,image/png"
      class="image-input"
      :disabled="uploading"
      @change="handleImageChange"
    />
  </label>
</div>
```

Observe duas coisas importantes:

1. A seção inteira só aparece **durante a edição** (`v-if="editingTask"`). Na criação de novas tarefas, não é possível anexar imagem.
2. O `<input type="file">**não tem** o atributo `capture`. É por isso que o seletor de arquivos é aberto em vez da câmera.

## O que vamos alterar

Nesta unidade, as mudanças são todas no `TaskForm.vue`:

| O que muda | Por quê |
| --- | --- |
| `capture="environment"` no input | Para abrir a câmera no celular |
| `revokeObjectURL` no cancelamento/troca | Para liberar memória do preview |
| Seção de imagem **sempre visível** | Para permitir captura também na criação |
| Mensagens adaptativas | "Toque para fotografar" no celular, "Selecionar arquivo" no desktop |
| Texto de ajuda sobre o comportamento | Para informar o usuário sobre a diferença mobile vs desktop |

## Resumo do passo

Neste passo, você:

- Verificou que o backend `2.0` está rodando
- Testou o fluxo atual e identificou a ausência do `capture`
- Entendeu os pontos que serão alterados no `TaskForm.vue`

---

**Anterior:** [Visão geral do tutorial](index.md) | **Próximo:** [Passo 2 – Adicionando o atributo capture](02-captura-camera.md)
