# 5. Boas práticas para PWAs

## Introdução

Configurar um PWA é relativamente simples com as ferramentas atuais. O desafio está em tomar decisões adequadas sobre cache, offline e performance. Nesta seção, reunimos as práticas que devem orientar o desenvolvimento e a manutenção de PWAs com Vue.js.

## 1. Evitar cache excessivo

Armazenar tudo em cache pode parecer uma boa ideia, mas traz problemas:

- **Uso de espaço**: o armazenamento do navegador tem limites. Se o cache crescer demais, o navegador pode removê-lo automaticamente.
- **Conteúdo desatualizado**: quanto mais coisas estiverem em cache, maior a chance de o usuário ver uma versão antiga de algum recurso.
- **Complexidade**: gerenciar cache de muitos recursos diferentes exige mais estratégias e mais código.

**O que fazer:**

- Defina limites de tamanho e idade para cada cache (`maxEntries` e `maxAgeSeconds`)
- Faça precache apenas dos arquivos essenciais para o funcionamento da aplicação
- Use runtime cache com expiração para recursos dinâmicos
- Não faça cache de dados de autenticação ou informações sensíveis

```javascript
// Exemplo: cache com limites definidos
{
  urlPattern: /^https:\/\/api\.exemplo\.com\/.*/i,
  handler: 'NetworkFirst',
  options: {
    cacheName: 'api-cache',
    expiration: {
      maxEntries: 50,       // máximo de 50 respostas no cache
      maxAgeSeconds: 86400, // expira após 24 horas
    },
  },
}
```

## 2. Pensar na experiência offline desde o início

A experiência offline não deve ser uma funcionalidade adicionada no final do desenvolvimento. Pensar nela desde o início influencia decisões de arquitetura:

- **Onde armazenar dados?** Se os dados ficam apenas no servidor, a aplicação não funciona offline. Considere usar `localStorage` ou IndexedDB para manter dados localmente.
- **Como lidar com ações offline?** Se o usuário preenche um formulário sem conexão, o dado deve ser armazenado localmente e sincronizado quando a conexão retornar.
- **Quais telas são prioritárias?** Identifique as funcionalidades que fazem sentido offline e garanta que elas funcionem.

**Perguntas para orientar o planejamento:**

- O que o usuário mais faz nesta aplicação?
- Quais dessas ações podem funcionar sem rede?
- Quais dados podem ser pré-carregados?
- O que deve acontecer quando o usuário tenta fazer algo que exige rede?

## 3. Não depender 100% da rede

Uma aplicação que trava ou exibe uma tela em branco quando perde a conexão oferece uma experiência ruim. Mesmo que nem tudo funcione offline, a aplicação deve reagir de forma previsível.

**Práticas recomendadas:**

- Sempre exiba alguma interface, mesmo sem dados. Uma tela com a mensagem "Sem conexão" é melhor que uma tela em branco.
- Use indicadores visuais para informar o estado de conexão (como o `OfflineBanner` que criamos).
- Desabilite controles que não funcionam offline em vez de permitir ações que vão falhar silenciosamente.
- Armazene os dados mais recentes localmente para exibir mesmo sem rede.

```vue
<!-- Exemplo: botão desabilitado quando offline -->
<template>
  <button :disabled="!isOnline" @click="syncData">
    {{ isOnline ? 'Sincronizar dados' : 'Sem conexão' }}
  </button>
</template>

<script setup>
import { useOnlineStatus } from '../composables/useOnlineStatus';
const { isOnline } = useOnlineStatus();
</script>
```

## 4. Manter o app leve e rápido

A performance é um dos pilares de um bom PWA. Uma aplicação lenta compromete a experiência, especialmente em dispositivos móveis com hardware limitado.

**Práticas para manter a aplicação leve:**

### Otimizar o tamanho do bundle

- Use importação dinâmica (`lazy loading`) para carregar páginas sob demanda:

```javascript
// Em vez de importar todas as views de uma vez:
import AboutView from '../views/AboutView.vue';

// Use importação dinâmica:
const AboutView = () => import('../views/AboutView.vue');
```

No Vue Router, isso fica:

```javascript
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
];
```

Dessa forma, o código da página "Sobre" só é carregado quando o usuário acessa essa rota.

### Otimizar imagens

- Use formatos modernos como WebP em vez de PNG ou JPEG quando possível
- Defina dimensões adequadas — não carregue uma imagem de 4000x3000 para exibir em 400x300
- Use o atributo `loading="lazy"` em imagens que não estão visíveis na tela inicial

```html
<img src="/images/foto.webp" alt="Descrição" loading="lazy" />
```

### Minimizar dependências externas

- Cada biblioteca adicionada ao projeto aumenta o tamanho do bundle
- Avalie se a biblioteca é realmente necessária ou se é possível implementar a funcionalidade com poucas linhas de código
- Verifique o tamanho das dependências com ferramentas como [Bundlephobia](https://bundlephobia.com/)

## 5. Testar em dispositivos reais

Emuladores e simuladores são úteis, mas não substituem o teste em dispositivos reais. Comportamentos podem variar entre:

- Diferentes navegadores (Chrome, Safari, Firefox)
- Diferentes sistemas operacionais (Android, iOS)
- Diferentes versões de sistema operacional
- Dispositivos com hardware limitado (pouca memória, processador lento)

**Checklist de testes:**

- [ ] A aplicação carrega corretamente no Chrome (Android)?
- [ ] A aplicação carrega corretamente no Safari (iOS)?
- [ ] A instalação funciona no Android?
- [ ] A instalação funciona no iOS (via menu de compartilhamento)?
- [ ] O funcionamento offline opera como esperado?
- [ ] O banner de offline aparece quando perde conexão?
- [ ] A atualização de versão funciona?
- [ ] O carregamento é rápido em rede 3G?

## 6. Usar o Lighthouse para auditar o PWA

O **Lighthouse** é uma ferramenta integrada ao Chrome DevTools que audita a qualidade de aplicações web, incluindo critérios de PWA.

**Como usar:**

1. Abra o DevTools (F12)
2. Vá até a aba **Lighthouse**
3. Selecione as categorias: **Performance**, **Progressive Web App**, **Best Practices**
4. Clique em **Analyze page load**

O Lighthouse gera um relatório com pontuação e sugestões de melhoria. Para PWA, ele verifica:

- Presença e validade do manifesto
- Service Worker registrado e funcionando
- Funcionamento offline
- Uso de HTTPS
- Responsividade
- Ícones nos tamanhos corretos

!!! tip "Dica"
Execute o Lighthouse no build de produção (`npm run build` + `npm run preview`), não no servidor de desenvolvimento. Os resultados serão mais precisos.

## 7. Manter o Service Worker simples

O Service Worker é um componente crítico da aplicação. Um Service Worker com lógica complexa pode causar problemas difíceis de depurar.

**Recomendações:**

- Use o `generateSW` do Workbox na maioria dos projetos em vez de escrever o Service Worker manualmente
- Limite o número de estratégias de cache — na maioria dos projetos, precache para arquivos estáticos e Network First para APIs é suficiente
- Ative `cleanupOutdatedCaches: true` para remover caches antigos automaticamente
- Defina uma estratégia de atualização clara (autoUpdate ou prompt) e mantenha-a consistente

## Resumo

| Prática                         | Descrição                                            |
| ------------------------------- | ---------------------------------------------------- |
| Evitar cache excessivo          | Definir limites de tamanho e expiração               |
| Planejar offline desde o início | Considerar armazenamento local e ações sem rede      |
| Não depender 100% da rede       | Exibir interface e feedback mesmo sem conexão        |
| Manter o app leve               | Lazy loading, otimizar imagens, limitar dependências |
| Testar em dispositivos reais    | Verificar em diferentes navegadores, SO e hardware   |
| Auditar com Lighthouse          | Usar a ferramenta para identificar melhorias         |
| Manter o Service Worker simples | Usar Workbox generateSW e limitar a complexidade     |

---

**Anterior:** [Atividades práticas](atividades-praticas.md) | **Voltar:** [Apresentação da Unidade](index.md)
