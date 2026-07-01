# Atividades Práticas – Unidade 9

Estas atividades complementam o tutorial de captura de imagens pela câmera. Elas foram pensadas para consolidar os conceitos trabalhados e explorar situações próximas de projetos reais.

---

## Atividade 1 – Alternar entre câmera traseira e frontal

**Objetivo:** permitir que o usuário escolha entre a câmera traseira e a frontal no momento da captura.

**Contexto:** no estado atual, usamos `capture="environment"` (câmera traseira). Para algumas tarefas, o usuário pode querer usar a câmera frontal (ex.: autorretrato, videoconferência).

**O que implementar:**

1. Adicione um estado reativo `cameraMode` que comece como `'environment'`:
   ```javascript
   const cameraMode = ref('environment');
   ```
2. Vincule o atributo `capture` dinamicamente ao valor de `cameraMode`:
   ```vue
   <input type="file" :capture="cameraMode" accept="image/jpeg,image/png" ... />
   ```
3. Adicione um botão "Usar câmera frontal" ao lado do label de imagem. Quando clicado, alterne `cameraMode` para `'user'`:
   ```vue
   <button
     v-if="!previewUrl"
     type="button"
     class="task-button-secondary"
     @click="toggleCamera"
   >
     {{ cameraMode === 'environment' ? 'Usar selfie' : 'Usar traseira' }}
   </button>
   ```
4. Implemente `toggleCamera()`:
   ```javascript
   function toggleCamera() {
     cameraMode.value = cameraMode.value === 'environment' ? 'user' : 'environment';
   }
   ```

**Resultado esperado:** o usuário pode alternar qual câmera será aberta com um clique. O texto do botão reflete o modo atual.

---

## Atividade 2 – Indicador de câmera indisponível

**Objetivo:** detectar quando o navegador não suporta o atributo `capture` e exibir uma mensagem alternativa.

**Contexto:** o `capture` é suportado na grande maioria dos navegadores modernos, mas alguns navegadores desktop antigos ou WebViews específicos podem ignorá-lo sem aviso. O usuário não tem feedback de que a câmera não está disponível.

**O que implementar:**

1. Crie um detection helper para verificar o suporte a `capture`. Uma forma prática é verificar se o dispositivo tem câmera usando `navigator.mediaDevices.enumerateDevices()`:
   ```javascript
   async function checkCameraSupport() {
     if (!navigator.mediaDevices?.enumerateDevices) return false;
     const devices = await navigator.mediaDevices.enumerateDevices();
     return devices.some((d) => d.kind === 'videoinput');
   }
   ```
2. No `onMounted` do `TaskForm` (ou em um `watch`), chame a função e guarde o resultado:
   ```javascript
   const hasCamera = ref(false);

   onMounted(async () => {
     hasCamera.value = await checkCameraSupport();
   });
   ```
3. No template, exiba um aviso discreto quando `capture="environment"` estiver definido mas não houver câmera:
   ```vue
   <p v-if="!hasCamera" class="camera-warning">
     Câmera não detectada. Você pode selecionar um arquivo manualmente.
   </p>
   ```
4. Adicione o estilo:
   ```css
   .camera-warning {
     font-size: 0.75rem;
     color: #e67e22;
     margin: 0;
   }
   ```

**Resultado esperado:** em dispositivos sem câmera, o usuário vê um aviso amarelo informando que pode selecionar um arquivo manualmente — em vez de ficar sem feedback ao clicar no botão.

---

## Atividade 3 (Desafio) – Captura com preview ao vivo

**Objetivo:** implementar o componente `CameraCapture.vue` apresentado no passo bônus e integrá-lo ao `TaskForm.vue` como alternativa ao `capture`.

**Contexto:** o passo 5 do tutorial apresentou o `getUserMedia` como alternativa. Esta atividade pede para você implementar a integração completa.

**O que implementar:**

1. Crie o arquivo `src/components/CameraCapture.vue` com o código completo fornecido no passo 5
2. No script setup do `TaskForm`, adicione o import e o estado de visibilidade:
   ```javascript
   import CameraCapture from './CameraCapture.vue';
   const showCameraCapture = ref(false);
   ```
3. Registre o componente no `components` (se estiver usando a Options API) ou apenas importe (se estiver usando Composition API com `<script setup>`)
4. No template, adicione o `CameraCapture` dentro da `image-section`, com o botão de alternância:
   ```vue
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
   ```
5. Implemente `handleCameraCapture` para enviar o arquivo ao backend:
   ```javascript
   async function handleCameraCapture(file) {
     if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
     previewUrl.value = URL.createObjectURL(file);
     uploading.value = true;
     try {
       const response = await tasksApi.uploadImage(file);
       imgAttachmentKey.value = response.data.attachment_key;
     } catch (err) {
       console.error(err);
       previewUrl.value = null;
     } finally {
       uploading.value = false;
       showCameraCapture.value = false;
     }
   }
   ```

**Dica:** cuidado para não ter dois fluxos de captura ativos ao mesmo tempo — se o usuário abrir o `CameraCapture` e também usar o input `capture`, o comportamento pode ficar confuso. Uma abordagem é esconder o label de "Adicionar imagem" enquanto o preview ao vivo estiver aberto:

```vue
<label v-if="!showCameraCapture" class="image-label" ...>
```

**Resultado esperado:** o usuário pode optar entre o fluxo simples (capture) e o fluxo avançado (preview ao vivo com `getUserMedia`), ambos levando ao mesmo resultado: upload da imagem e exibição na tarefa.

---

## Atividade 4 (Desafio) – Foto com geolocalização

**Objetivo:** capturar a localização no momento da foto, não no momento do submit.

**Contexto:** a Unidade 6 não incluía geolocalização, mas a Unidade 9 poderia explorar a integração entre câmera e geolocalização — útil para aplicações de registro de campo, atividades externas, etc.

**O que implementar:**

1. Ao capturar a foto (tanto via `capture` quanto via `getUserMedia`), dispare uma chamada à `navigator.geolocation.getCurrentPosition()` para obter a localização no exato momento da foto
2. Armazene latitude/longitude junto com o `imgAttachmentKey`
3. No submit, envie os dados de localização junto com o título e a chave da imagem
4. Exiba a localização como parte dos detalhes da tarefa (opcional)

**Dica:** o `useGeolocation` composable usado no projeto já fornece `requestCurrentLocation()`. Você pode chamá-lo dentro de `handleImageChange`.

**Resultado esperado:** cada foto anexada a uma tarefa carrega consigo a localização geográfica do momento em que foi capturada.

---

**Anterior:** [Passo 5 – Captura com getUserMedia](tutorial/05-camera-nativa.md)
