# Captura a partir do dispositivo

## O problema da câmera em PWAs

Na Unidade 6, o upload de imagens foi implementado com um `<input type="file">` comum. O usuário clica no botão, o navegador abre o seletor de arquivos do sistema operacional, e a imagem é enviada ao servidor.

Em um celular, esse mesmo seletor de arquivos oferece duas opções: "Galeria" (fotos existentes) e "Câmera" (fotografar agora). O problema é que essa escolha depende do sistema operacional e do navegador — às vezes a câmera não é oferecida, às vezes está enterrada em um submenu. A experiência não é consistente.

O atributo `capture` resolve isso: ele diz ao navegador que o arquivo **deve** ser capturado no momento, pulando o seletor de arquivos e abrindo a câmera diretamente.

## O atributo `capture`

O atributo `capture` é aplicado ao `<input type="file">` e aceita três valores:

| Valor | Comportamento |
| --- | --- |
| `"environment"` | Abre a **câmera traseira** do dispositivo |
| `"user"` | Abre a **câmera frontal** (selfie) |
| Ausente | Comportamento padrão: abre o **seletor de arquivos** |

```html
<!-- Abre a câmera traseira no celular; seletor de arquivos no desktop -->
<input type="file" accept="image/*" capture="environment" />

<!-- Abre a câmera frontal no celular -->
<input type="file" accept="image/*" capture="user" />

<!-- Sem capture: seletor de arquivos em todos os dispositivos -->
<input type="file" accept="image/*" />
```

### Como o navegador decide o comportamento

O `capture` é uma **dica** (hint), não uma ordem. O navegador decide com base no dispositivo e no contexto:

| Cenário | Comportamento |
| --- | --- |
| Celular, `capture="environment"` | Abre a câmera traseira |
| Celular, `capture="user"` | Abre a câmera frontal |
| Celular, sem `capture` | Abre o seletor de arquivos (com opção de câmera) |
| Desktop, qualquer `capture` | **Ignorado** — abre o seletor de arquivos |
| Tablet com câmera traseira e frontal | Segue o valor de `capture` |

Em desktop, o atributo `capture` é simplesmente ignorado. O navegador não tem como abrir uma câmera que não existe, então cai no comportamento padrão do `<input type="file">`. Isso é um **fallback automático** — não é necessário nenhum código extra para tratar desktop vs mobile.

!!! tip "Testando no desktop"

    Para testar o `capture` sem um celular, use o modo de dispositivos móveis do Chrome DevTools (`Ctrl+Shift+M`). Mesmo sem câmera real, você verá que o sistema operacional ainda abre o seletor de arquivos — mas o comportamento simulado é próximo do real.

## O atributo `accept`

O `accept` trabalha junto com o `capture` para definir quais tipos de arquivo são aceitos. No contexto de captura, ele também influencia qual aplicativo é aberto:

| `accept` | Efeito no celular com `capture` |
| --- | --- |
| `image/*` | Abre a câmera (foto) |
| `video/*` | Abre a câmera (vídeo) |
| `audio/*` | Abre o gravador de voz |
| `image/jpeg,image/png` | Abre a câmera (foto), filtrando formatos |

Usar `image/*` é mais permissivo e aceita qualquer formato de imagem (incluindo WebP, HEIC, etc.). Usar `image/jpeg,image/png` restringe aos formatos que o backend aceita — o que evita erros de upload.

```html
<input
  type="file"
  accept="image/jpeg,image/png"
  capture="environment"
/>
```

No celular, a câmera abre e, ao fotografar, a imagem é salva em JPEG (formato padrão da maioria das câmeras). O atributo `accept` é respeitado na medida do possível.

## Pré-visualização com URL.createObjectURL

Quando o usuário captura ou seleciona uma imagem, o navegador disponibiliza o arquivo como um objeto `File`. Esse arquivo está na memória do navegador — ainda não foi enviado ao servidor.

Para exibir um preview instantâneo, usamos `URL.createObjectURL()`:

```javascript
const previewUrl = URL.createObjectURL(file);
// previewUrl → "blob:http://localhost:5173/550e8400-e29b-..."
```

Essa URL especial aponta para o arquivo na memória do navegador. Ela pode ser usada como `src` de uma tag `<img>` imediatamente, sem esperar upload. O preview aparece no mesmo instante em que o usuário tira a foto.

### Ciclo de vida da object URL

Cada `URL.createObjectURL()` consome memória do navegador. Enquanto a URL existir, o arquivo original não pode ser liberado pelo garbage collector. Por isso, é importante chamar `revokeObjectURL()` quando a URL não for mais necessária:

```javascript
// Criar
const url = URL.createObjectURL(file);

// Usar (exibir preview, etc.)
imgElement.src = url;

// Liberar quando não precisar mais
URL.revokeObjectURL(url);
```

No nosso fluxo, o preview é substituído ou removido em três situações:

1. **Upload concluído**: a URL local é substituída pela URL do servidor (`img_url`)
2. **Usuário cancela**: o preview é removido
3. **Usuário troca de tarefa**: o preview da tarefa anterior é descartado

## Limitações da abordagem com `capture`

O atributo `capture` é simples e eficaz, mas tem limitações:

- **Sem controle de resolução**: a câmera usa as configurações padrão do sistema
- **Sem preview ao vivo**: não é possível mostrar o que a câmera está vendo antes de fotografar
- **Sem flash, zoom ou outras configurações**: o usuário depende dos controles nativos da câmera
- **Sem suporte a múltiplas fotos**: o `capture` só permite capturar uma imagem por vez

Para cenários que exigem mais controle (como um documento que precisa ser enquadrado corretamente, ou uma foto com resolução específica), a alternativa é usar a **MediaDevices API** com `getUserMedia`, que veremos no passo bônus do tutorial.

## Resumo

- `capture="environment"` abre a câmera traseira no celular; em desktop é ignorado
- `capture="user"` abre a câmera frontal
- `accept` define quais tipos de arquivo são aceitos e influencia o app aberto
- `URL.createObjectURL()` cria um preview instantâneo sem esperar upload
- `revokeObjectURL()` libera a memória quando o preview não é mais necessário
- A abordagem com `capture` é simples, mas tem limitações de controle sobre a captura

---

**Anterior:** [Apresentação da Unidade](index.md) | **Próximo:** [Tutorial prático](tutorial/index.md)
