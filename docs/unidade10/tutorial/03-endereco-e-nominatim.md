# Passo 3 – Rua e geocodificação reversa

## Objetivo

Latitude e longitude são úteis para o computador, mas não são uma informação amigável para o usuário. Vamos consultar o Nominatim para obter uma descrição textual do ponto.

## Uma consulta controlada

Crie `src/api/geocodingApi.js`:

```javascript title="src/api/geocodingApi.js" linenums="1"
import { extractAddressLabel, locationCacheKey } from '../utils/location.js'

const REVERSE_URL =
  import.meta.env.VITE_GEOCODING_BASE_URL ?? 'https://nominatim.openstreetmap.org/reverse'

const CACHE_PREFIX = 'reverse-geocode:'

function readCache(key) {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value))
  } catch {
    // O cache é opcional; não deve impedir o salvamento da tarefa.
  }
}

const geocodingApi = {
  async reverse(latitude, longitude) {
    const key = locationCacheKey(latitude, longitude)
    if (!key) return null

    const cached = readCache(key)
    if (cached) return cached

    const params = new URLSearchParams({
      format: 'jsonv2',
      lat: String(latitude),
      lon: String(longitude),
      zoom: '18',
      addressdetails: '1',
    })
    const response = await fetch(`${REVERSE_URL}?${params}`)
    if (!response.ok) throw new Error(`Falha HTTP ${response.status}`)

    const result = await response.json()
    const location = {
      label: extractAddressLabel(result),
      displayName: result.display_name ?? null,
    }
    writeCache(key, location)
    return location
  },
}

export default geocodingApi
```

Antes desse arquivo, crie `src/utils/location.js`. Ele concentra a normalização do endereço e do payload para evitar que o componente conheça detalhes da resposta do Nominatim:

```javascript title="src/utils/location.js" linenums="1"
export function extractAddressLabel(result) {
  const address = result?.address ?? {}
  return (
    address.road ||
    address.pedestrian ||
    address.path ||
    result?.display_name ||
    'Endereço não identificado'
  )
}

export function locationCacheKey(latitude, longitude) {
  if (latitude == null || longitude == null) return null
  return `${Number(latitude).toFixed(4)},${Number(longitude).toFixed(4)}`
}

export function buildLocationPayload(location) {
  if (!location) {
    return {
      latitude: null,
      longitude: null,
      geolocation_accuracy: null,
      geolocation_timestamp: null,
      location_label: null,
    }
  }

  return {
    latitude: location.latitude ?? null,
    longitude: location.longitude ?? null,
    geolocation_accuracy: location.accuracy ?? null,
    geolocation_timestamp: location.timestamp
      ? new Date(location.timestamp).toISOString()
      : null,
    location_label: location.label?.trim() || null,
  }
}
```

`locationCacheKey` arredonda apenas a chave do cache. A tarefa continua armazenando as coordenadas originais recebidas do navegador.

O `REVERSE_URL` pode ser trocado sem alterar o componente. A chave de cache reduz consultas repetidas para o mesmo ponto. A consulta acontece somente após uma captura feita pelo usuário.

## Escolhendo a rua

Nem todo ponto possui `road`. A função auxiliar verifica `road`, `pedestrian`, `path` e, por fim, `display_name`.

O resultado é uma aproximação cartográfica. Ele não deve ser apresentado como garantia de que o usuário está exatamente naquele endereço.

## Política de uso

O Nominatim público não é um serviço de autocomplete ou de rastreamento. A turma deve fazer consultas manuais e moderadas, respeitando a política do serviço:

<https://operations.osmfoundation.org/policies/nominatim/>

Se a aplicação crescer, o endpoint deve ser substituído por um provedor adequado ou por um proxy/backend com cache.

---

**Anterior:** [Captura da localização](02-captura-localizacao.md) | **Próximo:** [Mapa com Leaflet](04-mapa-leaflet.md)
