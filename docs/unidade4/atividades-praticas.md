# 4. Atividades práticas

## Visão geral

Os exercícios a seguir permitem que você pratique os conceitos estudados nesta unidade. Alguns exercícios são variações do que foi feito no tutorial; outros pedem análise crítica e adaptação a novos cenários.

---

## Exercício 1 – Transformar um projeto existente em PWA

**Objetivo:** aplicar os conhecimentos de PWA em um projeto Vue.js que você já possui.

**Instruções:**

1. Escolha um dos projetos desenvolvidos nas unidades anteriores (como o App de Registro de Atividades da Unidade 2)
2. Instale o `vite-plugin-pwa` no projeto
3. Configure o manifesto com:
   - Nome e nome curto adequados ao projeto
   - Cores que combinem com a identidade visual existente
   - Ícones nos tamanhos obrigatórios (192x192 e 512x512)
4. Configure o Workbox para fazer precache dos arquivos estáticos
5. Faça o build e teste:
   - O manifesto aparece corretamente no DevTools?
   - O Service Worker foi registrado?
   - Os arquivos estão no cache?

**Entrega:** projeto com suporte a PWA configurado e funcionando.

---

## Exercício 2 – Simular perda de conexão

**Objetivo:** observar e documentar o comportamento da aplicação em diferentes cenários de rede.

**Instruções:**

1. Faça o build de produção do projeto de tarefas (`npm run build` e `npm run preview`)
2. Acesse a aplicação e navegue por todas as telas
3. Ative o modo offline no DevTools (Application > Service Workers > Offline)
4. Teste os seguintes cenários e anote o comportamento:

| Cenário                          | O que aconteceu? |
| -------------------------------- | ---------------- |
| Recarregar a página inicial      |                  |
| Navegar para a página "Sobre"    |                  |
| Adicionar uma nova tarefa        |                  |
| Marcar uma tarefa como concluída |                  |
| Fechar e reabrir a aplicação     |                  |

5. Desative o modo offline e repita os testes
6. Compare os resultados

**Entrega:** tabela preenchida com observações sobre o comportamento online e offline.

---

## Exercício 3 – Testar instalação no celular

**Objetivo:** instalar o PWA em um dispositivo móvel e comparar a experiência.

**Instruções:**

1. Publique o projeto em uma plataforma com HTTPS (Netlify, Vercel ou GitHub Pages)
2. Acesse a URL no celular usando o Chrome (Android) ou Safari (iOS)
3. Instale o aplicativo seguindo os passos para o seu dispositivo
4. Compare a experiência respondendo:
   - A aplicação abriu em tela cheia (sem barra de endereço)?
   - O ícone apareceu na tela inicial?
   - A aplicação aparece na lista de apps recentes?
   - O carregamento é rápido?
   - A aplicação funciona offline após a instalação?

5. Tire capturas de tela mostrando:
   - O ícone na tela inicial
   - A aplicação aberta como app
   - A aplicação aberta no navegador (para comparação)

**Entrega:** capturas de tela e respostas às perguntas.

---

## Exercício 4 – Comparar experiência online vs offline

**Objetivo:** identificar as diferenças de funcionalidade entre uso online e offline.

**Instruções:**

1. Use o projeto de tarefas com localStorage implementado (Passo 5 do tutorial)
2. Faça o build de produção e sirva localmente
3. Com a aplicação **online**:
   - Adicione 5 tarefas
   - Marque 2 como concluídas
   - Navegue para a página "Sobre" e volte
4. Ative o modo **offline**:
   - As tarefas aparecem?
   - É possível adicionar novas tarefas?
   - É possível marcar e desmarcar tarefas?
   - A navegação entre telas funciona?
5. Feche o navegador completamente (todas as abas)
6. Reabra e acesse a aplicação (ainda offline):
   - As tarefas foram preservadas?
   - As que você marcou como concluídas continuam marcadas?

**Entrega:** relatório descrevendo a experiência nos dois modos, destacando o que funciona e o que não funciona.

---

## Exercício 5 – Identificar melhorias para experiência offline

**Objetivo:** analisar criticamente a aplicação e propor melhorias.

**Instruções:**

Considere o projeto de tarefas que construímos. Responda às seguintes perguntas:

1. **Dados locais:** Se a aplicação usasse uma API para armazenar tarefas no servidor, o que aconteceria offline? Como você resolveria isso?

2. **Sincronização:** Se o usuário adicionasse tarefas offline e depois recuperasse a conexão, como os dados poderiam ser sincronizados com o servidor?

3. **Feedback visual:** Além do banner de offline, que outros indicadores visuais poderiam melhorar a experiência? Liste pelo menos 3.

4. **Conteúdo estático:** Que tipos de conteúdo poderiam ser pré-carregados para garantir disponibilidade offline? Considere o cenário de um e-commerce.

5. **Limites do cache:** Se muitos dados fossem armazenados em cache, quais problemas poderiam surgir? Como limitar o uso de cache de forma inteligente?

**Entrega:** respostas escritas com pelo menos um parágrafo para cada pergunta.

---

## Exercício extra – Adicionando uma página offline personalizada

**Objetivo:** criar uma página offline que seja exibida quando o usuário tenta acessar um recurso não cacheado.

**Instruções:**

1. Crie um arquivo `public/offline.html` com uma mensagem amigável para o usuário:

   ```html
   <!DOCTYPE html>
   <html lang="pt-BR">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Offline - Gerenciador de Tarefas</title>
       <style>
         body {
           font-family: 'Segoe UI', sans-serif;
           display: flex;
           justify-content: center;
           align-items: center;
           min-height: 100vh;
           margin: 0;
           background-color: #f5f5f5;
           color: #333;
           text-align: center;
           padding: 20px;
         }
         .container {
           max-width: 400px;
         }
         h1 {
           font-size: 1.5rem;
           margin-bottom: 16px;
           color: #4a90d9;
         }
         p {
           line-height: 1.6;
           color: #666;
         }
         button {
           margin-top: 20px;
           padding: 12px 24px;
           background-color: #4a90d9;
           color: white;
           border: none;
           border-radius: 8px;
           font-size: 1rem;
           cursor: pointer;
         }
       </style>
     </head>
     <body>
       <div class="container">
         <h1>Sem conexão</h1>
         <p>
           Você está offline e esta página não está disponível no cache.
           Verifique sua conexão e tente novamente.
         </p>
         <button onclick="window.location.reload()">Tentar novamente</button>
       </div>
     </body>
   </html>
   ```

2. Configure o Workbox para usar esta página como fallback offline. Adicione ao `vite.config.js`, dentro das opções do `workbox`:

   ```javascript
   workbox: {
     // ... outras opções
     navigateFallback: '/offline.html',
     navigateFallbackDenylist: [/^\/api\//],
   }
   ```

3. Faça o build, sirva e teste: acesse uma URL inexistente da aplicação enquanto estiver offline.

**Entrega:** página offline funcionando e captura de tela mostrando o resultado.

---

**Anterior:** [Passo 7 – Atualização de versão](tutorial/07-atualizacao.md) | **Próximo:** [Boas práticas para PWAs](boas-praticas.md)
