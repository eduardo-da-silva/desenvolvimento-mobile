# Passo 4 – Mapa com Leaflet

## Objetivo

Vamos mostrar a localização em um mapa interativo, com marcador e círculo representando a precisão.

## Componente de mapa

Crie `src/components/TaskLocationMap.vue`:

```vue title="src/components/TaskLocationMap.vue" linenums="1"
<template>
  <div ref="mapElement" class="task-location-map" aria-label="Mapa da localização" />
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const props = defineProps({
  location: { type: Object, required: true },
})

const mapElement = ref(null)
let map
let marker
let accuracyCircle

function renderLocation() {
  if (!map || !props.location) return
  const point = [props.location.latitude, props.location.longitude]
  map.setView(point, 17)

  marker?.remove()
  accuracyCircle?.remove()
  marker = L.marker(point).addTo(map)
  if (props.location.label) marker.bindPopup(props.location.label).openPopup()

  if (props.location.accuracy > 0) {
    accuracyCircle = L.circle(point, {
      radius: props.location.accuracy,
      color: '#4a90d9',
      fillColor: '#4a90d9',
      fillOpacity: 0.15,
    }).addTo(map)
  }
  nextTick(() => map.invalidateSize())
}

onMounted(() => {
  map = L.map(mapElement.value).setView([0, 0], 2)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)
  renderLocation()
})

watch(() => props.location, renderLocation, { deep: true })
onBeforeUnmount(() => map?.remove())
</script>

<style scoped>
.task-location-map {
  width: 100%;
  height: 240px;
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
```

O `ref` identifica o elemento HTML onde o Leaflet será montado. O `watch` atualiza o marcador quando a localização muda. O `onBeforeUnmount` remove o mapa para evitar listeners e objetos pendurados.

O círculo usa `accuracy` em metros. Quando a posição não tem precisão, mostramos apenas o marcador.

## Atribuição e tiles

A atribuição é obrigatória e permanece visível no controle do mapa. Não remova esse controle nem implemente precache de tiles.

---

**Anterior:** [Rua e geocodificação reversa](03-endereco-e-nominatim.md) | **Próximo:** [Integração com a tarefa](05-integracao-atividade.md)
