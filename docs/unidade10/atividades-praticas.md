# Atividades práticas – Unidade 10

## Atividade 1 – Selo de qualidade da localização

**Objetivo:** classificar visualmente a precisão recebida do navegador, para que o usuário entenda que `accuracy` é uma estimativa, não uma garantia.

**Contexto:** `useGeolocation` já expõe `location.value.accuracy` em metros. Falta traduzir esse número em algo que o usuário leigo entenda de relance.

**O que implementar:**

1. Em `src/utils/location.js`, adicione uma função que classifica a precisão:
   ```javascript
   export function classifyAccuracy(accuracy) {
     if (accuracy == null) return null
     if (accuracy < 20) return 'boa'
     if (accuracy <= 100) return 'moderada'
     return 'baixa'
   }
   ```
2. No componente que exibe a localização capturada (ex.: `TaskForm.vue`, próximo ao botão **Usar localização atual**), importe e use a função:
   ```javascript
   import { classifyAccuracy } from '../utils/location.js'

   const accuracyLevel = computed(() => classifyAccuracy(location.value?.accuracy))
   ```
3. Exiba um selo com a classificação:
   ```vue
   <span v-if="accuracyLevel" :class="`accuracy-badge accuracy-badge--${accuracyLevel}`">
     Precisão {{ accuracyLevel }}
   </span>
   ```
4. Adicione o estilo:
   ```css
   .accuracy-badge {
     font-size: 0.75rem;
     padding: 2px 8px;
     border-radius: 12px;
   }
   .accuracy-badge--boa { background: #d4edda; color: #155724; }
   .accuracy-badge--moderada { background: #fff3cd; color: #856404; }
   .accuracy-badge--baixa { background: #f8d7da; color: #721c24; }
   ```

**Resultado esperado:** ao capturar a localização, o usuário vê um selo colorido ("Precisão boa/moderada/baixa") ao lado das coordenadas.

---

## Atividade 2 – Indicar tarefas com localização na lista

**Objetivo:** deixar visível, na listagem de tarefas, quais delas têm localização salva — sem consultar o Nominatim de novo.

**Contexto:** cada tarefa já traz `location_label` (pode ser `null`). A lista atual não usa esse campo.

**O que implementar:**

1. No componente que renderiza cada item da lista (ex.: `TaskItem.vue`), exiba um indicador quando houver localização:
   ```vue
   <span v-if="task.location_label" class="task-location-tag" :title="task.location_label">
     📍 {{ task.location_label }}
   </span>
   ```
2. Se a lista tiver algum filtro existente (por status, por texto), adicione um filtro "Somente com localização":
   ```javascript
   const onlyWithLocation = ref(false)

   const filteredTasks = computed(() =>
     onlyWithLocation.value
       ? tasks.value.filter((t) => t.latitude != null)
       : tasks.value,
   )
   ```
3. Adicione o checkbox correspondente no template, ao lado dos outros filtros já existentes.

**Resultado esperado:** a lista mostra de relance quais tarefas têm local registrado, e é possível filtrar só essas — sem nenhuma nova chamada de rede.

---

## Atividade 3 – Privacidade por arredondamento

**Objetivo:** oferecer uma opção que reduz a precisão salva, como demonstração do trade-off entre utilidade e privacidade.

**Contexto:** hoje a tarefa sempre salva as coordenadas exatas recebidas do navegador.

**O que implementar:**

1. Em `src/utils/location.js`, adicione:
   ```javascript
   export function roundCoordinate(value, decimals = 2) {
     if (value == null) return null
     const factor = 10 ** decimals
     return Math.round(value * factor) / factor
   }
   ```
   Duas casas decimais equivalem a, aproximadamente, 1 km de margem — suficiente para descaracterizar o endereço exato mantendo o bairro/região.
2. Adicione um checkbox "Salvar localização aproximada" próximo ao botão de captura:
   ```javascript
   const useApproximateLocation = ref(false)
   ```
3. Ao montar o payload (onde `buildLocationPayload` é chamado, antes do `POST`/`PATCH`), arredonde as coordenadas se a opção estiver marcada:
   ```javascript
   const payloadLocation = useApproximateLocation.value
     ? {
         ...location.value,
         latitude: roundCoordinate(location.value.latitude),
         longitude: roundCoordinate(location.value.longitude),
       }
     : location.value

   const locationPayload = buildLocationPayload(payloadLocation)
   ```
4. No mapa, deixe visível qual localização está sendo exibida (exata ou aproximada) — por exemplo, um texto abaixo do mapa: `{{ useApproximateLocation ? 'Localização aproximada' : 'Localização exata' }}`.

**Resultado esperado:** com o checkbox marcado, a tarefa salva coordenadas arredondadas em vez das coordenadas exatas capturadas pelo navegador.

---

## Atividade 4 (Desafio) – Mini-mapa ao expandir a tarefa

**Objetivo:** reaproveitar `TaskLocationMap.vue` fora do formulário, mostrando o mapa na própria listagem quando o usuário expande uma tarefa.

**Contexto:** hoje o mapa só aparece dentro do `TaskForm`, durante criação/edição. Uma tarefa salva com localização não mostra o mapa na lista.

**O que implementar:**

1. Se a lista de tarefas já tiver um estado de "expandir para ver detalhes", adicione ali a condição para mostrar o mapa; senão, crie um `ref` simples de controle por item (ex.: `expandedTaskId`).
2. Importe `TaskLocationMap` no componente da lista:
   ```javascript
   import TaskLocationMap from './TaskLocationMap.vue'
   ```
3. Renderize o componente somente quando a tarefa estiver expandida e tiver localização:
   ```vue
   <TaskLocationMap
     v-if="isExpanded(task.id) && task.latitude != null"
     :location="{
       latitude: task.latitude,
       longitude: task.longitude,
       accuracy: task.geolocation_accuracy,
       label: task.location_label,
     }"
   />
   ```

**Dica:** `TaskLocationMap` espera a prop `location` como objeto, não como campos soltos — monte o objeto a partir dos campos da tarefa, como no exemplo acima.

**Resultado esperado:** ao clicar para expandir uma tarefa com localização, um mini-mapa aparece mostrando marcador e círculo de precisão, sem precisar abrir o formulário de edição.

---

**Anterior:** [Testes e limitações](tutorial/06-testes-e-limitacoes.md)
