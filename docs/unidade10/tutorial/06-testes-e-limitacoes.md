# Passo 6 – Testes e limitações

## Teste no desktop

1. Inicie o backend Docker.
2. Inicie o frontend com `npm run dev`.
3. Faça login.
4. Clique em **Usar localização atual**.
5. Autorize o navegador.
6. Confira coordenadas, precisão, endereço e mapa.
7. Salve a tarefa.
8. Recarregue a página e edite a tarefa novamente.

## Teste no celular

O telefone precisa acessar uma origem HTTPS. Um endereço HTTP da rede local pode carregar a interface, mas não é uma base confiável para testar a Geolocation API.

Também é necessário que a URL do backend esteja acessível pelo telefone e esteja incluída em `CORS_ORIGINS`. Se a página for HTTPS, a API também deve ser HTTPS para evitar mixed content.

## Cenários de erro

| Cenário | Resultado esperado |
| --- | --- |
| Usuário nega permissão | Mensagem clara; tarefa continua funcionando |
| Navegador sem Geolocation API | Botão ou ação é desabilitado com explicação |
| Timeout | Mensagem e possibilidade de tentar novamente |
| Precisão de centenas de metros | Ponto e valor de precisão são mostrados sem fingir exatidão |
| Nominatim indisponível | Coordenadas e mapa continuam disponíveis |
| Rua ausente | Mostrar `display_name` ou aviso de endereço não identificado |
| Sem internet | Não capturar novo endereço; não prometer mapa offline |

## Privacidade

Antes de capturar, a interface deve deixar claro que a posição será associada à tarefa e armazenada no backend. Não registre posições automaticamente, não use `watchPosition()` e não envie coordenadas para serviços que não são necessários ao fluxo.

## Checklist final

- [ ] A captura só ocorre após ação do usuário.
- [ ] A permissão negada não quebra o formulário.
- [ ] Latitude e longitude são validadas pelo backend.
- [ ] O horário é enviado em ISO 8601.
- [ ] A rua é tratada como informação aproximada.
- [ ] O mapa mostra atribuição OpenStreetMap.
- [ ] O código não faz consultas periódicas ao Nominatim.
- [ ] A localização pode ser removida.

---

**Anterior:** [Integração com a tarefa](05-integracao-atividade.md) | **Próximo:** [Atividades práticas](../atividades-praticas.md)
