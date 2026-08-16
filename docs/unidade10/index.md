# Unidade 10 – GPS, endereço e mapas

## Apresentação da Unidade

Nas unidades anteriores, o projeto `registro-atividades-pwa` ganhou persistência, autenticação, upload de imagens, notificações e captura pela câmera. Agora cada tarefa também poderá registrar o local onde aconteceu.

O resultado será um fluxo de registro de campo:

1. o usuário solicita a localização atual;
2. o navegador pede permissão;
3. o frontend recebe latitude, longitude, precisão e horário;
4. o frontend consulta uma rua ou endereço aproximado;
5. o mapa exibe o ponto e o raio de precisão;
6. a tarefa é salva com os dados de localização.

## Objetivos de aprendizagem

- Usar a Geolocation API do navegador.
- Entender permissão, HTTPS, latitude, longitude e precisão.
- Fazer geocodificação reversa a partir de coordenadas.
- Exibir uma localização com Leaflet.
- Usar tiles do OpenStreetMap com atribuição.
- Integrar dados de localização a uma API REST.
- Tratar permissão negada, timeout, baixa precisão e ausência de endereço.
- Reconhecer os riscos de privacidade de coordenadas exatas.

## Navegação da Unidade

1. [A Geolocation API](geolocation-api.md)
2. [Mapas, Leaflet e OpenStreetMap](mapas-openstreetmap.md)
3. [Tutorial prático](tutorial/index.md)
   1. [Preparação e segurança](tutorial/01-preparacao.md)
   2. [Captura da localização](tutorial/02-captura-localizacao.md)
   3. [Rua e geocodificação reversa](tutorial/03-endereco-e-nominatim.md)
   4. [Mapa com Leaflet](tutorial/04-mapa-leaflet.md)
   5. [Integração com a tarefa](tutorial/05-integracao-atividade.md)
   6. [Testes e limitações](tutorial/06-testes-e-limitacoes.md)
4. [Atividades práticas](atividades-praticas.md)

## Pré-requisitos

- Projeto `registro-atividades-pwa` no estado final da Unidade 9.
- Backend da unidade disponível como imagem Docker `5.0`.
- Node.js, npm e Docker instalados.
- Para testes no celular, uma origem HTTPS acessível pelo dispositivo.

!!! warning "Privacidade"

    Latitude e longitude podem revelar a localização de uma pessoa. Nesta unidade, a captura é opcional, explícita e associada à tarefa. Não implementaremos rastreamento contínuo.

---

**Anterior:** [Unidade 9 – Captura de imagens pela câmera](../unidade9/index.md) | **Próximo:** [A Geolocation API](geolocation-api.md)
