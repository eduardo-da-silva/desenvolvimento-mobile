# Passo 5 – Funcionamento offline

## Objetivo

Neste passo, vamos testar o funcionamento offline da nossa aplicação, entender o que acontece quando não há rede e implementar melhorias na experiência offline.

## Preparando o build de produção

O Service Worker só funciona no build de produção. Vamos gerar o build e servir localmente:

```bash
npm run build
npm run preview -- --host
```

Acesse `http://localhost:4173` no navegador. Navegue pela aplicação normalmente para que o Service Worker faça o precache dos arquivos.

## Testando offline no navegador

### Método 1: DevTools do Chrome

1. Abra o DevTools (F12)
2. Vá até a aba **Application**
3. Clique em **Service Workers** no menu lateral
4. Marque a opção **Offline**
5. Recarregue a página (F5)

A aplicação deve continuar funcionando normalmente, mesmo com a simulação de perda de rede.

### Método 2: Aba Network do DevTools

1. Abra o DevTools (F12)
2. Vá até a aba **Network**
3. No dropdown de throttling, selecione **Offline**
4. Recarregue a página

### Método 3: Desconectar a rede

Se estiver testando em um computador, desconecte o Wi-Fi ou o cabo de rede. Se estiver testando em um celular, ative o modo avião. Essa é a forma mais realista de teste.

## O que acontece quando não há rede?

### Cenário 1: Precache funcionando

Se o precache foi realizado corretamente, ao ficar offline:

- A aplicação carrega normalmente
- A navegação entre páginas funciona (Home e Sobre)
- Os estilos e ícones são exibidos
- As tarefas em memória continuam visíveis

Isso acontece porque todos os arquivos estáticos (HTML, CSS, JS, ícones) foram armazenados no cache durante a primeira visita.

### Cenário 2: Recurso não cacheado

Se a aplicação tentar acessar um recurso que **não está no cache** (por exemplo, uma imagem externa ou uma API), o resultado depende da estratégia configurada:

- **Network First sem cache prévio**: exibe erro ou conteúdo vazio
- **Cache First com recurso cacheado**: retorna a versão do cache
- **Sem estratégia definida**: o navegador exibe erro de rede

### Cenário 3: Sem Service Worker

Se o Service Worker não estiver registrado ou ativo, o navegador exibe a tela padrão de "sem conexão" (o dinossauro do Chrome, por exemplo).

## Melhorando a experiência offline

### Indicador de estado de conexão

Uma boa prática é informar ao usuário quando ele está offline. Vamos criar um componente que monitora o estado da conexão.

Crie o arquivo `src/components/OfflineBanner.vue`:

```vue title='./src/components/OfflineBanner.vue' linenums='1'
<template>
  <div v-if="!isOnline" class="offline-banner">
    Você está offline. Algumas funcionalidades podem estar indisponíveis.
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isOnline = ref(navigator.onLine);

function updateOnlineStatus() {
  isOnline.value = navigator.onLine;
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>

<style scoped>
.offline-banner {
  background-color: #e74c3c;
  color: white;
  text-align: center;
  padding: 8px 16px;
  font-size: 0.85rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>
```

O componente usa a API `navigator.onLine` do navegador e escuta os eventos `online` e `offline` para atualizar o estado em tempo real.

Agora, adicione o componente no `App.vue`:

```vue title='./src/App.vue' linenums='1' hl_lines="2 11"
<template>
  <OfflineBanner />
  <AppHeader />
  <main>
    <router-view />
  </main>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import OfflineBanner from './components/OfflineBanner.vue';
</script>

<style scoped>
main {
  padding-bottom: 40px;
}
</style>
```

Quando o usuário perder a conexão, uma barra vermelha aparecerá no topo da tela. Quando a conexão for restabelecida, a barra desaparecerá automaticamente.

### Usando um composable para o estado de conexão

O método acima é simples e funciona, mas se você precisar verificar o estado de conexão em vários componentes, pode ser útil criar um composable reutilizável. Além disso, a API `navigator.onLine` nem sempre é confiável, pois pode indicar "online" mesmo quando a conexão real com a internet está indisponível. Para melhorar isso, podemos implementar uma verificação ativa de conectividade.

Nesse caso, vamos criar um composable que não apenas monitora os eventos de conexão, mas também faz requisições periódicas para verificar se a internet está realmente acessível.

Crie o arquivo `src/composables/useOnlineStatus.js`:

```javascript title='./src/composables/useOnlineStatus.js' linenums='1'
import { ref, onMounted, onUnmounted } from 'vue';

const HEARTBEAT_INTERVAL = 10_000; // 10 segundos
const FETCH_TIMEOUT = 5_000; // 5 segundos

export function useOnlineStatus() {
  const isOnline = ref(navigator.onLine);
  let intervalId = null;

  function updateStatus() {
    isOnline.value = navigator.onLine;
  }

  async function checkConnectivity() {
    if (!navigator.onLine) {
      isOnline.value = false;
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      // Faz HEAD request para um recurso pequeno do próprio domínio
      // O cache-bust via query string evita resposta do cache HTTP
      await fetch(
        `${window.location.origin}/icons/icon-192x192.png?_=${Date.now()}`,
        {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);
      isOnline.value = true;
    } catch {
      isOnline.value = false;
    }
  }

  onMounted(() => {
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Verificação inicial real de conectividade
    checkConnectivity();

    // Heartbeat periódico
    intervalId = setInterval(checkConnectivity, HEARTBEAT_INTERVAL);
  });

  onUnmounted(() => {
    window.removeEventListener('online', updateStatus);
    window.removeEventListener('offline', updateStatus);

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  return { isOnline };
}
```

Agora, qualquer componente pode usar:

```vue title='É apenas um exemplo de uso'
<script setup>
import { useOnlineStatus } from '../composables/useOnlineStatus';

const { isOnline } = useOnlineStatus();
</script>

<template>
  <button :disabled="!isOnline">Enviar dados</button>
</template>
```

No exemplo acima, o botão "Enviar dados" é desabilitado quando o usuário está offline. Essa é uma prática importante: em vez de permitir ações que vão falhar, informe o usuário e desabilite os controles.

Exemplos de funcionalidades que podem ser desabilitadas offline:

- Envio de formulários para uma API
- Busca por dados remotos
- Upload de arquivos
- Sincronização de dados

No caso do componente `OfflineBanner.vue`, você pode substituir a lógica interna pelo uso do composable:

```vue title='./src/components/OfflineBanner.vue' linenums='1'
<template>
  <div v-if="!isOnline" class="offline-banner">
    Você está offline. Algumas funcionalidades podem estar indisponíveis.
  </div>
</template>

<script setup>
import { useOnlineStatus } from '@/composables/useOnlineStatus';

const { isOnline } = useOnlineStatus();
</script>

<style scoped>
.offline-banner {
  background-color: #e74c3c;
  color: white;
  text-align: center;
  padding: 8px 16px;
  font-size: 0.85rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>
```

## Persistência de dados offline

No nosso projeto atual, as tarefas são armazenadas em memória (no JavaScript). Isso significa que, se o usuário fechar e reabrir a aplicação, os dados são perdidos.

Para manter os dados entre sessões, mesmo offline, podemos usar o **localStorage**:

Atualize o composable `src/composables/useTasks.js`:

```javascript title='./src/composables/useTasks.js' linenums='1'
import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'tarefas-pwa-tasks';

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    { id: 1, title: 'Estudar Progressive Web Apps', done: false },
    { id: 2, title: 'Configurar o Service Worker', done: false },
    { id: 3, title: 'Testar funcionamento offline', done: true },
  ];
}

const tasks = ref(loadTasks());

let nextId =
  tasks.value.length > 0 ? Math.max(...tasks.value.map((t) => t.id)) + 1 : 1;

// Salva no localStorage sempre que as tarefas mudarem
watch(
  tasks,
  (newTasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  },
  { deep: true },
);

export function useTasks() {
  const pendingTasks = computed(() => tasks.value.filter((t) => !t.done));
  const completedTasks = computed(() => tasks.value.filter((t) => t.done));

  function addTask(title) {
    if (!title.trim()) return;
    tasks.value.push({
      id: nextId++,
      title: title.trim(),
      done: false,
    });
  }

  function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      task.done = !task.done;
    }
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id);
  }

  return {
    tasks,
    pendingTasks,
    completedTasks,
    addTask,
    toggleTask,
    removeTask,
  };
}
```

Agora as tarefas são salvas no `localStorage` e carregadas de volta quando a aplicação é iniciada — inclusive offline.

## Limitações do funcionamento offline

É importante saber o que **não funciona** offline em um PWA:

- **Requisições a APIs**: se os dados não foram cacheados antes, não estarão disponíveis
- **Recursos externos não cacheados**: imagens de CDNs que nunca foram carregadas
- **Funcionalidades que dependem de servidor**: autenticação, envio de e-mails, processamento no backend
- **Notificações push**: não podem ser recebidas sem conexão

O objetivo não é que tudo funcione offline, mas que a aplicação se comporte de forma previsível e informe o usuário sobre o que está disponível.

## Resumo do passo

Neste passo, você:

- Testou o funcionamento offline usando três métodos diferentes
- Entendeu os cenários possíveis quando não há rede
- Criou um indicador visual de estado de conexão
- Implementou um composable para monitorar o estado online/offline
- Adicionou persistência de dados com localStorage
- Compreendeu as limitações do funcionamento offline

---

**Anterior:** [Passo 4 – Estratégias de cache](04-estrategias-cache.md) | **Próximo:** [Passo 6 – Instalação do aplicativo](06-instalacao.md)
