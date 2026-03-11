# Passo 7 – Atualização de versão

## Objetivo

Neste passo, vamos entender como o Service Worker lida com atualizações, como gerenciar o cache de versões antigas e como notificar o usuário sobre novas versões disponíveis.

## O problema da atualização

Quando você publica uma nova versão da aplicação, os usuários que já instalaram o PWA podem continuar vendo a versão antiga. Isso acontece porque o Service Worker serve os arquivos do cache — e o cache contém a versão anterior.

O fluxo de atualização funciona assim:

1. O usuário acessa a aplicação
2. O navegador verifica se há uma nova versão do Service Worker
3. Se houver, o novo Service Worker é **baixado e instalado**, mas **não ativado imediatamente**
4. O novo Service Worker fica em estado de **espera** ("waiting")
5. Apenas quando todas as abas da aplicação forem fechadas, o novo Service Worker é ativado
6. Na próxima visita, o usuário vê a nova versão

Esse comportamento é seguro (evita inconsistências), mas pode ser frustrante para o usuário.

## Estratégias de atualização

### 1. Auto Update (atualização automática)

É a estratégia que configuramos no nosso projeto com `registerType: 'autoUpdate'`. O novo Service Worker pula a fase de espera e assume o controle imediatamente. A página é atualizada automaticamente.

```javascript title="vite.config.js (parte do arquivo para ilustrar)"
VitePWA({
  registerType: 'autoUpdate',
  // ...
});
```

**Vantagens:**

- O usuário sempre recebe a versão mais recente
- Não exige ação do usuário

**Desvantagens:**

- A página pode recarregar em um momento inesperado (embora na prática isso ocorra apenas quando o usuário recarrega ou acessa novamente)

### 2. Prompt (notificação ao usuário)

Nesta estratégia, quando uma nova versão é detectada, a aplicação exibe uma mensagem perguntando se o usuário deseja atualizar. O Service Worker novo só é ativado quando o usuário aceita.

```javascript title="vite.config.js (parte do arquivo para ilustrar)"
VitePWA({
  registerType: 'prompt',
  // ...
});
```

Essa abordagem dá mais controle ao usuário e evita recarregamentos inesperados.

## Implementando atualização com prompt

Vamos modificar a configuração do projeto para usar a estratégia de prompt e criar um componente que notifica o usuário.

### Alterando a configuração

Atualize o `vite.config.js`:

```javascript title="vite.config.js" linenums='8' hl_lines='2'
VitePWA({
  registerType: 'prompt',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    cleanupOutdatedCaches: true,
    sourcemap: false,
  },
  // ... restante da configuração
});
```

### Registrando o Service Worker manualmente

Para usar a estratégia de prompt, precisamos do pacote `virtual:pwa-register/vue`, que é fornecido pelo `vite-plugin-pwa`.

Crie o componente `src/components/UpdatePrompt.vue`:

```vue title='./src/components/UpdatePrompt.vue' linenums='1'
<template>
  <div v-if="needRefresh" class="update-prompt">
    <p>Uma nova versão está disponível.</p>
    <div class="update-actions">
      <button class="update-button" @click="updateServiceWorker()">
        Atualizar agora
      </button>
      <button class="dismiss-button" @click="close()">Depois</button>
    </div>
  </div>
</template>

<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisteredSW(swUrl, registration) {
    // Verifica novas versões periodicamente (a cada hora)
    if (registration) {
      setInterval(
        () => {
          registration.update();
        },
        60 * 60 * 1000,
      );
    }
  },
  onRegisterError(error) {
    console.error('Erro ao registrar o Service Worker:', error);
  },
});

function close() {
  needRefresh.value = false;
}
</script>

<style scoped>
.update-prompt {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-width: 400px;
  width: calc(100% - 32px);
}

.update-prompt p {
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.update-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.update-button {
  padding: 8px 16px;
  background-color: #4a90d9;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.update-button:hover {
  background-color: #357abd;
}

.dismiss-button {
  padding: 8px 16px;
  background-color: transparent;
  color: #ccc;
  border: 1px solid #666;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.dismiss-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
```

### Entendendo o `useRegisterSW`

O composable `useRegisterSW` é fornecido pelo `vite-plugin-pwa` e retorna:

| Propriedade           | Tipo   | Descrição                                              |
| --------------------- | ------ | ------------------------------------------------------ |
| `needRefresh`         | `Ref`  | `true` quando há uma nova versão disponível            |
| `offlineReady`        | `Ref`  | `true` quando a aplicação está pronta para uso offline |
| `updateServiceWorker` | Função | Força a atualização para a nova versão                 |

O callback `onRegisteredSW` é chamado quando o Service Worker é registrado. Usamos isso para configurar uma verificação periódica de novas versões (a cada hora).

### Adicionando ao App.vue

Adicione o componente `UpdatePrompt` no `App.vue`:

```vue title='./src/App.vue' linenums='1' hl_lines="7 13"
<template>
  <OfflineBanner />
  <AppHeader />
  <main>
    <router-view />
  </main>
  <UpdatePrompt />
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import OfflineBanner from './components/OfflineBanner.vue';
import UpdatePrompt from './components/UpdatePrompt.vue';
</script>

<style scoped>
main {
  padding-bottom: 40px;
}
</style>
```

## Como funciona a atualização na prática

1. Você faz uma alteração no código e publica uma nova versão (`npm run build` + deploy)
2. O usuário acessa a aplicação (ou a verificação periódica dispara)
3. O navegador detecta que o arquivo `sw.js` mudou
4. O novo Service Worker é baixado e instalado (em segundo plano)
5. O composable `useRegisterSW` define `needRefresh.value = true`
6. O componente `UpdatePrompt` exibe a notificação
7. O usuário clica em "Atualizar agora"
8. A função `updateServiceWorker()` ativa o novo Service Worker
9. A página é recarregada com a nova versão

## Limpeza de caches antigos

A opção `cleanupOutdatedCaches: true` que configuramos no Workbox cuida automaticamente de remover caches de versões antigas. Sem essa opção, os caches se acumulariam no navegador do usuário.

Cada vez que o Service Worker é ativado, ele verifica se existem caches de versões anteriores e os remove.

## Verificando atualizações no DevTools

Para monitorar o processo de atualização:

1. Abra o DevTools (F12)
2. Vá até **Application > Service Workers**
3. Observe os estados:
   - **Active**: Service Worker atualmente em uso
   - **Waiting**: novo Service Worker aguardando ativação
   - **Installing**: novo Service Worker sendo instalado

Você pode forçar a atualização clicando em "Update" na seção de Service Workers do DevTools. Também pode marcar "Update on reload" para que o Service Worker sempre atualize ao recarregar a página (útil durante o desenvolvimento).

## Resumo do passo

Neste passo, você:

- Entendeu como o Service Worker gerencia atualizações de versão
- Conheceu as estratégias `autoUpdate` e `prompt`
- Implementou um componente de notificação de atualização
- Configurou verificação periódica de novas versões
- Aprendeu a monitorar o processo de atualização no DevTools

---

**Anterior:** [Passo 6 – Instalação do aplicativo](06-instalacao.md) | **Próximo:** [Atividades práticas](../atividades-praticas.md)
