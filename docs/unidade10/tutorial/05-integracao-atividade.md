# Passo 5 – Integração com a tarefa

## Objetivo

Agora vamos combinar captura, endereço, mapa e API no fluxo existente do `TaskForm`.

## Payload

O frontend envia os dados com nomes correspondentes ao contrato do backend:

```javascript
{
  "title": "Visitar a praça",
  "latitude": -26.9154,
  "longitude": -49.0719,
  "geolocation_accuracy": 12.5,
  "geolocation_timestamp": "2026-08-15T12:30:00.000Z",
  "location_label": "Rua das Flores, Blumenau"
}
```

Latitude e longitude representam a posição. `geolocation_accuracy` informa a estimativa de erro em metros. `geolocation_timestamp` informa quando o navegador capturou a posição. `location_label` é o texto obtido pelo geocoder e pode ser nulo.

## Capturar e consultar

O componente deve esperar a captura antes de consultar o endereço:

```javascript
async function handleGetLocation() {
  const captured = await requestCurrentLocation()
  if (!captured) return

  try {
    const address = await geocodingApi.reverse(
      captured.latitude,
      captured.longitude,
    )
    setLocationLabel(address?.label)
  } catch {
    locationError.value =
      'Localização obtida, mas não foi possível identificar a rua.'
  }
}
```

A falha do geocoder não apaga a localização: o usuário ainda pode salvar coordenadas e visualizar o mapa.

## Salvar e editar

Ao criar uma tarefa, todos os campos podem ser nulos. Ao editar, o formulário carrega a localização existente. O botão **Remover localização** envia os campos de localização como `null`, enquanto não capturar uma nova posição preserva a posição existente.

## Store

A store continua sendo responsável por chamar `tasksApi`. Ela normaliza os nomes usados pelo componente e envia o payload para `POST /tasks` ou `PATCH /tasks/{id}`. A regra de negócio de persistência permanece no backend.

## Verificação

- [ ] Criar uma tarefa sem localização.
- [ ] Criar uma tarefa com localização.
- [ ] Fechar e reabrir a edição.
- [ ] Confirmar endereço e mapa.
- [ ] Substituir a localização.
- [ ] Remover a localização.
- [ ] Recarregar a página e confirmar a persistência.

---

**Anterior:** [Mapa com Leaflet](04-mapa-leaflet.md) | **Próximo:** [Testes e limitações](06-testes-e-limitacoes.md)
