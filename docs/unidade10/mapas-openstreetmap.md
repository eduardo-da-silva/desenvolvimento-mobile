# Mapas, Leaflet e OpenStreetMap

## O que é um mapa web?

Um mapa web é composto por imagens ou dados geográficos carregados em partes. Essas partes são chamadas de **tiles**. Ao mover ou ampliar o mapa, o navegador solicita novos tiles.

O Leaflet cuida da interação: zoom, arrastar, marcador, popup e camadas. O Leaflet não fornece os mapas sozinho; precisamos indicar um servidor de tiles.

## Nossa escolha

Nesta aula usaremos:

- **Leaflet**: biblioteca JavaScript para mapas interativos;
- **OpenStreetMap**: dados cartográficos abertos;
- **tiles padrão do OpenStreetMap**: imagens usadas como camada de fundo.

O endereço usado pelo componente será:

```text
https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

O mapa deve mostrar atribuição visível:

```text
© OpenStreetMap contributors
```

O uso é adequado para a demonstração da aula, com volume moderado. Não devemos baixar uma cidade inteira, pré-carregar regiões ou prometer funcionamento offline dos tiles.

## Marcador e precisão

O marcador mostra o ponto central estimado. A precisão não é um ponto exato: é uma estimativa de raio. Por isso, o tutorial também desenha um círculo com o valor de `accuracy` recebido do navegador.

## Endereço a partir de coordenadas

Coordenadas e endereço são informações diferentes. A conversão de coordenadas em endereço é chamada de **geocodificação reversa**.

Nesta unidade, o frontend fará uma consulta explícita ao Nominatim depois da captura. A consulta terá cache local e não será repetida automaticamente.

!!! warning "Limites do Nominatim público"

    O serviço público possui limite de uso, exige atribuição e pode ficar indisponível. Ele não deve ser usado para autocomplete, consultas periódicas ou grandes volumes.

## Outra arquitetura possível

Também seria possível enviar apenas as coordenadas ao backend e deixar o backend consultar o Nominatim. Essa arquitetura facilita controle de cache, troca de provedor e proteção contra excesso de requisições. Ela também esconde o serviço externo do navegador do usuário, evita expor a URL do provedor de geocodificação no bundle do frontend e concentra em uma única camada (o backend) a responsabilidade por CORS e pela política de uso do Nominatim. Em troca, o backend passa a depender de rede externa e precisa lidar com timeout e falha de terceiro em cada requisição de tarefa.

Nesta disciplina, porém, os alunos estão consumindo um backend pronto em Docker e não escrevendo sua implementação. Para que a aula mostre claramente a relação entre navegador, API externa e interface, optamos por fazer a consulta pelo frontend.

---

**Anterior:** [A Geolocation API](geolocation-api.md) | **Próximo:** [Tutorial prático](tutorial/index.md)
