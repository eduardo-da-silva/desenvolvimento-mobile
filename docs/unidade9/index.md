# Unidade 9 – Captura de Imagens pela Câmera

## Apresentação da Unidade

Na Unidade 6, o projeto `registro-atividades-pwa` ganhou a capacidade de anexar imagens às tarefas. O usuário seleciona um arquivo no computador e a imagem é enviada ao servidor. No celular, o seletor de arquivos ainda permite escolher uma foto da galeria — mas não oferece a opção de fotografar na hora.

Nesta unidade, vamos resolver isso adicionando **captura direta pela câmera** ao fluxo de upload. Quando o usuário estiver em um dispositivo móvel, o botão de seleção de imagem abrirá a câmera em vez do seletor de arquivos. Em desktop, o comportamento continua o mesmo de antes.

Para isso, vamos trabalhar com dois temas:

- **O atributo `capture`** — um atributo nativo do HTML que informa ao navegador que o arquivo deve ser capturado no momento, seja pela câmera (`environment` ou `user`) ou pelo microfone
- **Captura programática com `getUserMedia`** — uma alternativa mais flexível que permite preview ao vivo, controle de resolução e captura personalizada via `<canvas>`

**Objetivos de aprendizagem:**

- Entender como o atributo `capture` funciona e como ele se comporta em diferentes dispositivos
- Diferenciar `capture="environment"` (câmera traseira) de `capture="user"` (câmera frontal)
- Saber quando usar `accept="image/*"` vs `accept="image/jpeg,image/png"`
- Aplicar `URL.createObjectURL()` para pré-visualização instantânea
- Gerenciar o ciclo de vida do preview com `revokeObjectURL()`
- Implementar captura programática com `getUserMedia` como alternativa avançada
- Oferecer uma experiência adaptativa: câmera no celular, seletor de arquivos no desktop

## Navegação da Unidade

1. [Captura a partir do dispositivo](captura-dispositivo.md)
2. [Tutorial prático: adicionando captura pela câmera](tutorial/index.md)
   1. [Preparação do ambiente](tutorial/01-preparacao.md)
   2. [Adicionando o atributo capture](tutorial/02-captura-camera.md)
   3. [Pré-visualização e upload](tutorial/03-preview-e-upload.md)
   4. [Integração visual e feedback](tutorial/04-integracao-visual.md)
   5. [Bônus: captura com getUserMedia](tutorial/05-camera-nativa.md)
3. [Atividades práticas](atividades-praticas.md)

## Pré-requisitos

- Projeto `registro-atividades-pwa` no estado final da **Unidade 8**
- Backend rodando via Docker (mesma versão da Unidade 6 — `2.0`)
- Node.js e npm instalados
- Um celular ou emulador para testar a captura pela câmera (opcional, mas recomendado)

---

**Anterior:** [Unidade 8 – Notificações Push](../unidade8/index.md) | **Próximo:** [Captura a partir do dispositivo](captura-dispositivo.md)
