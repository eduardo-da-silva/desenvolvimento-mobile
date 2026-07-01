# Passo 2 – Adicionando o atributo `capture`

## Objetivo

Neste passo, vamos adicionar o atributo `capture="environment"` ao `<input type="file">` do `TaskForm.vue`. Esta é a mudança central da unidade: com uma única linha, a câmera será aberta automaticamente em dispositivos móveis.

## A mudança

Abra `src/components/TaskForm.vue` e localize o `<input type="file">` na seção de imagem. Adicione o atributo `capture="environment"`:

```vue title="src/components/TaskForm.vue" linenums="1" hl_lines="4"
<input
  type="file"
  accept="image/jpeg,image/png"
  capture="environment"
  class="image-input"
  :disabled="uploading"
  @change="handleImageChange"
/>
```

É isso. Uma única linha.

## O que o `capture` faz exatamente

O atributo `capture="environment"` diz ao navegador:

> "O arquivo que o usuário vai selecionar deve ser capturado agora, neste momento, usando a câmera traseira do dispositivo."

O navegador então:

1. **No celular**: abre o aplicativo de câmera padrão do sistema. O usuário fotografa e confirma. A foto retorna como um objeto `File` no `event.target.files[0]`.
2. **No desktop**: simplesmente ignora o atributo e abre o seletor de arquivos normalmente.

Não é necessário nenhum código JavaScript adicional para detectar o dispositivo ou mudar o comportamento. O navegador faz isso sozinho.

## Testando a mudança

### No celular (ou emulador)

1. Inicie o servidor de desenvolvimento com `--host` para expor na rede local:
   ```bash
   npm run dev -- --host
   ```
2. Acesse `http://<SEU_IP>:5173` pelo celular (na mesma rede Wi-Fi)
3. Clique em "Adicionar imagem" — a câmera traseira deve abrir
4. Fotografe e confirme
5. O preview da imagem aparece e o upload é iniciado

### No desktop

1. No mesmo servidor, acesse pelo computador
2. Clique em "Adicionar imagem" — o seletor de arquivos abre normalmente
3. O `capture="environment"` é ignorado, e o fluxo continua igual

### Usando o DevTools para simular mobile

1. Abra o Chrome DevTools (`F12`)
2. Ative o modo de dispositivos móveis (`Ctrl+Shift+M`)
3. Escolha um dispositivo como "Pixel 7" ou "iPhone 14"
4. Clique em "Adicionar imagem" — mesmo sem câmera real, o seletor de arquivos aparece, mas o comportamento simulado se aproxima do mobile

## Usando a câmera frontal

Se o cenário exigir a câmera frontal (por exemplo, para selfies ou avatar), use `capture="user"`:

```vue
<input
  type="file"
  accept="image/*"
  capture="user"
  class="image-input"
  :disabled="uploading"
  @change="handleImageChange"
/>
```

No nosso projeto, a câmera traseira (`environment`) é mais adequada porque o usuário provavelmente vai fotografar algo relacionado à tarefa (um quadro, um documento, um objeto), não a si mesmo.

## Por que não usar `accept="image/*"` em vez de `"image/jpeg,image/png"`

O backend usad aceita apenas JPEG e PNG. Usar `accept="image/jpeg,image/png"` restringe o seletor de arquivos (e a câmera, quando possível) a esses formatos, evitando que o usuário capture uma foto em HEIC ou WebP e receba um erro de upload.

Se no futuro o backend passar a aceitar mais formatos, basta atualizar o `accept`:

```html
<!-- Aceita JPEG, PNG, WebP e GIF -->
<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" capture="environment" />

<!-- Aceita qualquer imagem -->
<input type="file" accept="image/*" capture="environment" />
```

## Resumo do passo

Neste passo, você:

- Adicionou `capture="environment"` ao `<input type="file">`
- Entendeu como o navegador se comporta em mobile vs desktop
- Testou a mudança no celular e/ou no DevTools

---

**Anterior:** [Passo 1 – Preparação do ambiente](01-preparacao.md) | **Próximo:** [Passo 3 – Pré-visualização e upload](03-preview-e-upload.md)
