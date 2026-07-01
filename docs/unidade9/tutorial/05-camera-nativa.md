# Passo 5 (Bônus) – Captura com `getUserMedia`

## Objetivo

O atributo `capture` é simples e eficaz, mas tem limitações: não permite controle sobre a resolução, não mostra preview ao vivo, e não funciona em todos os cenários (como em um quiosque ou aplicativo embutido em um WebView).

Neste passo bônus, vamos explorar uma alternativa mais poderosa: a **MediaDevices API** com `navigator.mediaDevices.getUserMedia`. Com ela, podemos:

- Exibir um preview **ao vivo** da câmera antes de capturar
- Controlar a resolução da imagem capturada
- Oferecer botões de zoom, flash e alternância entre câmeras
- Capturar o quadro exato que o usuário deseja

!!! warning "Passo opcional"

    Este passo é opcional e mais avançado. O `capture` resolvido nos passos anteriores já atende ao requisito da unidade. O `getUserMedia` é apresentado aqui como referência para projetos futuros que precisem de mais controle.

## Como funciona o `getUserMedia`

O `getUserMedia` solicita acesso ao stream de vídeo da câmera:

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: 'environment',  // 'user' para frontal
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
  audio: false,
});
```

O `stream` resultante pode ser atribuído a um elemento `<video>` para exibir o preview ao vivo:

```javascript
const video = document.createElement('video');
video.srcObject = stream;
await video.play();
```

Para capturar um quadro (foto), usamos um `<canvas>`:

```javascript
const canvas = document.createElement('canvas');
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
const ctx = canvas.getContext('2d');
ctx.drawImage(video, 0, 0);

canvas.toBlob((blob) => {
  const file = new File([blob], 'foto.jpg', { type: 'image/jpeg' });
  // agora 'file' pode ser enviado via tasksApi.uploadImage(file)
}, 'image/jpeg', 0.9);
```

Ao finalizar, é importante parar o stream para liberar a câmera:

```javascript
stream.getTracks().forEach((track) => track.stop());
```

## Exemplo completo: um seletor com preview ao vivo

Abaixo está um componente Vue funcional que demonstra o uso de `getUserMedia` para captura de foto com preview ao vivo:

```vue title="src/components/CameraCapture.vue"
<template>
  <div class="camera-capture">
    <video
      ref="videoRef"
      autoplay
      playsinline
      class="camera-preview"
      :class="{ hidden: captured }"
    ></video>

    <img
      v-if="capturedUrl"
      :src="capturedUrl"
      class="camera-result"
      alt="Foto capturada"
    />

    <div class="camera-actions">
      <button
        v-if="!streamActive"
        type="button"
        class="camera-btn"
        @click="startCamera"
      >
        Abrir câmera
      </button>

      <button
        v-if="streamActive && !captured"
        type="button"
        class="camera-btn"
        @click="capturePhoto"
      >
        Fotografar
      </button>

      <button
        v-if="captured"
        type="button"
        class="camera-btn secondary"
        @click="retake"
      >
        Refazer
      </button>

      <button
        v-if="streamActive"
        type="button"
        class="camera-btn danger"
        @click="stopCamera"
      >
        Fechar câmera
      </button>
    </div>

    <p v-if="error" class="camera-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['captured']);

const videoRef = ref(null);
const captured = ref(false);
const capturedUrl = ref(null);
const capturedFile = ref(null);
const streamActive = ref(false);
const error = ref(null);
let stream = null;

async function startCamera() {
  error.value = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    videoRef.value.srcObject = stream;
    streamActive.value = true;
    captured.value = false;
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      error.value = 'Permissão de câmera negada.';
    } else if (err.name === 'NotFoundError') {
      error.value = 'Nenhuma câmera encontrada.';
    } else {
      error.value = 'Erro ao acessar a câmera.';
    }
    console.error(err);
  }
}

function capturePhoto() {
  const video = videoRef.value;
  if (!video) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  canvas.toBlob(
    (blob) => {
      const file = new File([blob], 'camera-capture.jpg', {
        type: 'image/jpeg',
      });
      capturedUrl.value = URL.createObjectURL(blob);
      capturedFile.value = file;
      captured.value = true;
      emit('captured', file);
    },
    'image/jpeg',
    0.9,
  );
}

function retake() {
  if (capturedUrl.value) URL.revokeObjectURL(capturedUrl.value);
  capturedUrl.value = null;
  capturedFile.value = null;
  captured.value = false;
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  streamActive.value = false;
  if (capturedUrl.value) URL.revokeObjectURL(capturedUrl.value);
  capturedUrl.value = null;
  capturedFile.value = null;
  captured.value = false;
}
</script>

<style scoped>
.camera-capture {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.camera-preview {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  background: #000;
  border-radius: 8px;
}

.camera-preview.hidden {
  display: none;
}

.camera-result {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  border: 2px solid #4a90d9;
}

.camera-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.camera-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  background: #4a90d9;
  color: white;
}

.camera-btn.secondary {
  background: #6c757d;
}

.camera-btn.danger {
  background: #e74c3c;
}

.camera-error {
  color: #e74c3c;
  font-size: 0.85rem;
}
</style>
```

## Integrando ao TaskForm

Para usar este componente no `TaskForm.vue`, você pode exibi-lo como alternativa ao input com `capture`:

```vue title="src/components/TaskForm.vue"
<div class="image-section">
  <!-- Preview da imagem já salva ou capturada -->
  <img
    v-if="previewUrl || editingTask?.img_url"
    :src="previewUrl || editingTask?.img_url"
    class="image-preview"
    alt="Imagem da tarefa"
  />

  <!-- Input com capture (padrão) -->
  <label class="image-label" :class="{ disabled: uploading }">
    <span v-if="uploading" class="upload-status">Enviando...</span>
    <span v-else>Adicionar imagem</span>
    <input
      type="file"
      accept="image/jpeg,image/png"
      capture="environment"
      class="image-input"
      :disabled="uploading"
      @change="handleImageChange"
    />
  </label>

  <!-- Alternativa com preview ao vivo -->
  <button
    type="button"
    class="task-button-secondary"
    @click="showCameraCapture = !showCameraCapture"
  >
    {{ showCameraCapture ? 'Fechar câmera' : 'Abrir preview ao vivo' }}
  </button>

  <CameraCapture
    v-if="showCameraCapture"
    @captured="handleCameraCapture"
  />
</div>
```

A função `handleCameraCapture` recebe o `File` do `CameraCapture` e o envia para o upload:

```javascript
function handleCameraCapture(file) {
  previewUrl.value = URL.createObjectURL(file);
  uploading.value = true;
  tasksApi
    .uploadImage(file)
    .then((response) => {
      imgAttachmentKey.value = response.data.attachment_key;
    })
    .catch((err) => {
      console.error(err);
      previewUrl.value = null;
    })
    .finally(() => {
      uploading.value = false;
    });
}
```

## Comparação: `capture` vs `getUserMedia`

| Aspecto | `capture` | `getUserMedia` |
| --- | --- | --- |
| **Complexidade** | Mínima (1 atributo) | Alta (`<video>`, `<canvas>`, streams) |
| **Preview ao vivo** | Não | Sim |
| **Controle de resolução** | Não (padrão do sistema) | Sim (`width`, `height`, `aspectRatio`) |
| **Flash / zoom** | Não | Sim (via `MediaStreamTrack.applyConstraints`) |
| **Fallback em desktop** | Automático (seletor de arquivos) | Manual (câmera pode não existir) |
| **Permissão** | Gerenciada pelo sistema de arquivos | Solicitação explícita (pode ser negada) |
| **Suporte a múltiplas fotos** | Não (uma por vez) | Sim (várias capturas sem fechar) |
| **Ideal para** | Formulários simples, MVP, protótipos | Documentos, retratos, cenários com requisitos de qualidade |

## Quando usar cada abordagem

- Use **`capture`** quando a simplicidade for mais importante que o controle — a maioria dos casos de uso de um PWA.
- Use **`getUserMedia`** quando você precisa de **controle fino** sobre a captura: preview ao vivo, resolução específica, flash, ou múltiplas fotos na mesma sessão.

No `registro-atividades-pwa`, o `capture` é a escolha certa: o usuário precisa anexar uma foto rápida à tarefa, sem complicação. O `getUserMedia` seria mais adequado em um aplicativo de documentos ou de retratos, onde o enquadramento e a qualidade são críticos.

---

**Anterior:** [Passo 4 – Integração visual e feedback](04-integracao-visual.md) | **Próximo:** [Atividades práticas](../atividades-praticas.md)
