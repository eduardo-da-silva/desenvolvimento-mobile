# Passo 1 – Preparação e segurança

## Objetivo

Neste passo, vamos confirmar o backend, instalar o Leaflet e preparar o ambiente seguro para testar localização.

## Iniciando o backend

Pare versões anteriores do container e inicie a imagem da unidade:

```bash
docker run -p 8001:8001 eduardosilvasc/gerenciamento-tarefas-2026:5.0
```

Abra `http://localhost:8001/docs` e confira se `POST /tasks`, `PATCH /tasks/{task_id}` e `GET /tasks` exibem os campos de localização.

## Instalando o Leaflet

O Leaflet será instalado pelo npm para que a versão usada no tutorial fique registrada e seja incluída no build do Vite:

```bash
npm install leaflet
```

Depois da instalação, confirme que `leaflet` aparece em `dependencies` do `package.json`. Não use uma tag `<script>` de CDN neste projeto.

## Teste no computador

Para desenvolvimento local:

```bash
npm run dev
```

O endereço `http://localhost:5173` pode ser usado para testar a permissão no computador. Para testar em um celular, a origem acessada pelo celular precisa ser HTTPS e o backend também precisa estar acessível sem gerar mixed content.

## CORS

O backend usa a variável `CORS_ORIGINS` para aceitar uma ou mais origens separadas por vírgula:

```text
CORS_ORIGINS=https://meu-tunel.exemplo,http://localhost:5173
```

Essa configuração é necessária porque o navegador aplica a política de mesma origem antes de liberar a requisição ao backend.

## Verificação

- [ ] O container responde em `/docs`.
- [ ] O frontend inicia.
- [ ] `leaflet` aparece no `package.json`.
- [ ] A origem usada no teste está configurada no CORS.
- [ ] O teste no celular usa HTTPS.

---

**Anterior:** [Visão geral do tutorial](index.md) | **Próximo:** [Captura da localização](02-captura-localizacao.md)
