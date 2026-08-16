# Passo 2 – Captura da localização

## Objetivo

Vamos encapsular a Geolocation API em um composable para que o componente Vue não precise conhecer todos os detalhes de permissão e erro.

## O composable

Crie `src/composables/useGeolocation.js`:

```javascript title="src/composables/useGeolocation.js" linenums="1"
import { ref } from 'vue'

export function useGeolocation() {
  const isSupported =
    typeof navigator !== 'undefined' && typeof navigator.geolocation !== 'undefined'
  const permissionState = ref('unknown')
  const loadingLocation = ref(false)
  const locationError = ref('')
  const location = ref(null)

  async function readPermissionState() {
    if (!navigator.permissions?.query) return
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' })
      permissionState.value = status.state
      status.onchange = () => {
        permissionState.value = status.state
      }
    } catch {
      permissionState.value = 'unknown'
    }
  }

  function setLocationFromTask(task) {
    if (!task || task.latitude == null || task.longitude == null) {
      location.value = null
      return
    }
    location.value = {
      latitude: task.latitude,
      longitude: task.longitude,
      accuracy: task.geolocation_accuracy ?? null,
      timestamp: task.geolocation_timestamp
        ? Date.parse(task.geolocation_timestamp)
        : Date.now(),
      label: task.location_label ?? null,
    }
  }

  function clearLocation() {
    location.value = null
    locationError.value = ''
  }

  function setLocationLabel(label) {
    if (location.value) location.value = { ...location.value, label: label || null }
  }

  function requestCurrentLocation() {
    if (!isSupported) {
      locationError.value = 'Geolocalização não suportada neste dispositivo.'
      return Promise.resolve(null)
    }

    loadingLocation.value = true
    locationError.value = ''

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          permissionState.value = 'granted'
          location.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            label: null,
          }
          loadingLocation.value = false
          resolve(location.value)
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            permissionState.value = 'denied'
            locationError.value = 'Permissão de localização negada.'
          } else if (error.code === error.TIMEOUT) {
            locationError.value = 'Tempo esgotado para obter localização.'
          } else {
            locationError.value = 'Não foi possível obter a localização agora.'
          }
          loadingLocation.value = false
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    })
  }

  return {
    isSupported,
    permissionState,
    loadingLocation,
    locationError,
    location,
    readPermissionState,
    setLocationFromTask,
    clearLocation,
    setLocationLabel,
    requestCurrentLocation,
  }
}
```

O composable usa `ref` para tornar os estados reativos. A Promise permite que o componente espere a conclusão da captura. `enableHighAccuracy` solicita a melhor precisão disponível, mas pode aumentar tempo e consumo de bateria.

## Captura explícita

O botão chama `requestCurrentLocation()` somente quando o usuário decide capturar. A interface mostra carregamento enquanto o navegador responde e mantém a tarefa utilizável se a captura falhar.

## Teste

Abra o projeto em `localhost`, clique no botão de localização e observe a caixa de permissão. Negue a permissão e confirme que a tarefa ainda pode ser salva sem localização.

---

**Anterior:** [Preparação e segurança](01-preparacao.md) | **Próximo:** [Rua e geocodificação reversa](03-endereco-e-nominatim.md)
