# A Geolocation API

## O que significa acessar o GPS?

Uma aplicação web não conversa necessariamente com o chip GPS diretamente. O navegador combina fontes disponíveis no dispositivo, como GPS, redes Wi-Fi, torres de celular e informações de rede, e entrega uma posição estimada para a aplicação.

Por isso, uma localização sempre deve ser acompanhada de uma **precisão aproximada**, medida em metros. Um valor de `12` indica uma estimativa mais precisa que um valor de `500`.

## Obtendo uma posição

O método principal desta unidade é:

```javascript
navigator.geolocation.getCurrentPosition(sucesso, falha, opcoes)
```

O método é assíncrono: a função não devolve a posição imediatamente. O navegador chama `sucesso` quando consegue obter os dados ou `falha` quando algo dá errado.

Uma posição contém:

```javascript
{
  coords: {
    latitude: -26.9154,
    longitude: -49.0719,
    accuracy: 12.5
  },
  timestamp: 1786797000000
}
```

`latitude` varia de `-90` a `90`, `longitude` varia de `-180` a `180` e `timestamp` informa quando a posição foi obtida.

## Permissão e HTTPS

O navegador não deve liberar localização silenciosamente. O usuário precisa autorizar o acesso e pode negar, revogar ou alterar essa decisão depois.

A Geolocation API exige um contexto seguro. `http://localhost` é tratado como seguro para desenvolvimento local, mas um endereço HTTP da rede, como `http://192.168.0.10:5173`, normalmente não serve para testar localização no celular. Nesse caso, use HTTPS publicado, túnel HTTPS ou um certificado local confiável.

## Por que não usar `watchPosition()`?

`watchPosition()` acompanha mudanças continuamente. Ele é útil para navegação e rastreamento, mas consome mais bateria e transforma o aplicativo em um coletor de histórico de deslocamento.

Nesta unidade, cada tarefa precisa de uma captura pontual. Portanto, usamos `getCurrentPosition()` somente depois que o usuário toca em **Usar localização atual**.

## Tratamento de falhas

O código deve tratar pelo menos:

| Situação | Comportamento da interface |
| --- | --- |
| Navegador sem suporte | Informar que a tarefa pode ser salva sem localização |
| Permissão negada | Explicar como reativar a permissão |
| Timeout | Permitir nova tentativa |
| Precisão baixa | Mostrar a precisão recebida |
| Falha de endereço | Manter coordenadas e mapa |

Consultar a localização também é uma decisão de produto: a tarefa deve continuar funcionando sem ela.

---

**Anterior:** [Apresentação da Unidade](index.md) | **Próximo:** [Mapas, Leaflet e OpenStreetMap](mapas-openstreetmap.md)
