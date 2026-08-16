# Tutorial prático: registrando tarefas com localização

## O que vamos construir

Vamos evoluir o `registro-atividades-pwa` para permitir que uma tarefa tenha localização opcional.

Ao final, o usuário poderá clicar em **Usar localização atual**, autorizar o navegador, visualizar a rua quando existir, conferir o ponto no mapa e salvar a tarefa com os dados de localização.

## Backend

A unidade usa a imagem Docker `5.0`:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:5.0
```

O contrato de tarefa passa a aceitar:

```json
{
  "title": "Visitar a praça",
  "latitude": -26.9154,
  "longitude": -49.0719,
  "geolocation_accuracy": 12.5,
  "geolocation_timestamp": "2026-08-15T12:30:00.000Z",
  "location_label": "Rua das Flores, Blumenau"
}
```

Todos os campos de localização são opcionais. Uma tarefa continua podendo ser criada sem localização.

## Etapas

1. [Preparação e segurança](01-preparacao.md)
2. [Captura da localização](02-captura-localizacao.md)
3. [Rua e geocodificação reversa](03-endereco-e-nominatim.md)
4. [Mapa com Leaflet](04-mapa-leaflet.md)
5. [Integração com a tarefa](05-integracao-atividade.md)
6. [Testes e limitações](06-testes-e-limitacoes.md)

## Regra para os blocos de código

Cada trecho apresentado abaixo deve ser copiado somente depois da explicação do conceito. Depois do trecho, explicaremos o papel dos arquivos e como testar o resultado.

---

**Anterior:** [Mapas, Leaflet e OpenStreetMap](../mapas-openstreetmap.md) | **Próximo:** [Preparação e segurança](01-preparacao.md)
