# Passo 6 – Instalação do aplicativo

## Objetivo

Neste passo, vamos demonstrar como instalar o PWA no desktop e no celular, entender a diferença entre usar a aplicação no navegador e como aplicativo instalado, e aprender a personalizar a experiência de instalação.

## Requisitos para instalação

Para que o navegador ofereça a opção de instalar o PWA, todos estes critérios devem ser atendidos:

1. A aplicação é servida via HTTPS (ou localhost para desenvolvimento)
2. O manifesto possui os campos obrigatórios (`name`, `icons`, `start_url`, `display`)
3. O Service Worker está registrado e ativo
4. Há pelo menos um ícone de 192x192 e um de 512x512 pixels
5. O campo `display` no manifesto não é `browser`

Se algum critério não for atendido, o navegador não oferecerá a instalação.

## Instalando no desktop (Chrome)

### Método 1: Ícone na barra de endereço

Quando a aplicação atende aos critérios, o Chrome exibe um ícone de instalação na barra de endereço (lado direito). Ao clicar nele:

1. Uma janela de confirmação aparece com o nome e ícone da aplicação
2. Clique em "Instalar"
3. A aplicação será aberta em uma janela separada, sem barra de endereço

### Método 2: Menu do Chrome

1. Clique nos três pontos (menu) no canto superior direito do Chrome
2. Selecione "Instalar Gerenciador de Tarefas..." (ou nome similar)
3. Confirme a instalação

Após a instalação:

- A aplicação aparece como atalho na área de trabalho
- Pode ser aberta pelo menu de aplicativos do sistema operacional
- Funciona em janela própria, sem barra de endereço
- Tem seu próprio ícone na barra de tarefas

### Desinstalando no desktop

Para desinstalar:

1. Abra a aplicação instalada
2. Clique nos três pontos no canto superior direito da janela
3. Selecione "Desinstalar Gerenciador de Tarefas"

Ou, no Chrome, acesse `chrome://apps`, clique com o botão direito no aplicativo e selecione "Remover do Chrome".

## Instalando no celular (Android)

### Chrome para Android

1. Acesse a aplicação pelo Chrome
2. O Chrome exibe automaticamente um banner na parte inferior da tela: "Adicionar Gerenciador de Tarefas à tela inicial"
3. Toque em "Adicionar"
4. O aplicativo é adicionado à tela inicial do celular

Se o banner não aparecer automaticamente:

1. Toque nos três pontos (menu) no canto superior direito
2. Selecione "Adicionar à tela inicial"
3. Confirme

Após a instalação:

- O ícone aparece na tela inicial, como qualquer outro aplicativo
- Ao abrir, a aplicação carrega em tela cheia (sem barra de endereço)
- Aparece na lista de aplicativos recentes
- Pode ser desinstalado como qualquer app (segure o ícone e arraste para "Desinstalar")

### Safari no iOS

O processo de instalação no iOS é diferente, pois o Safari não exibe banners automáticos. O usuário precisa:

1. Acessar a aplicação pelo Safari
2. Tocar no ícone de compartilhamento (quadrado com seta para cima)
3. Rolar a lista de opções e selecionar "Adicionar à Tela de Início"
4. Confirmar o nome e tocar em "Adicionar"

!!! note "Suporte no iOS"

    O suporte a PWA no iOS tem melhorado ao longo dos anos, mas ainda possui algumas limitações em relação ao Android. Notificações push, por exemplo, só foram adicionadas a partir do iOS 16.4.

## Diferença entre navegador e app instalado

| Aspecto                   | No navegador                        | Instalado como app             |
| ------------------------- | ----------------------------------- | ------------------------------ |
| Barra de endereço         | Visível                             | Oculta (modo `standalone`)     |
| Ícone na tela inicial     | Não                                 | Sim                            |
| Aparece nos apps recentes | Não (aparece como aba do navegador) | Sim                            |
| Experiência visual        | Interface do navegador visível      | Aparência de app nativo        |
| Funcionamento offline     | Depende do Service Worker           | Depende do Service Worker      |
| Atualizações              | Automáticas via Service Worker      | Automáticas via Service Worker |

A funcionalidade é a mesma. A diferença principal está na experiência visual. O modo `standalone` remove a interface do navegador e faz a aplicação parecer um app nativo.

## Personalizando a experiência de instalação

### Botão customizado de instalação

Os navegadores oferecem a instalação de formas que nem sempre são visíveis para o usuário. Uma prática comum é criar um botão de instalação dentro da própria aplicação.

Para isso, usamos o evento `beforeinstallprompt` do navegador.

Crie o arquivo `src/components/InstallButton.vue`:

```vue title='./src/components/InstallButton.vue' linenums='1'
<template>
  <button v-if="showInstallButton" class="install-button" @click="installApp">
    Instalar aplicativo
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showInstallButton = ref(false);
let deferredPrompt = null;

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Impede o banner automático do navegador
    event.preventDefault();
    // Armazena o evento para usar depois
    deferredPrompt = event;
    // Mostra o botão customizado
    showInstallButton.value = true;
  });

  window.addEventListener('appinstalled', () => {
    // Esconde o botão quando o app for instalado
    showInstallButton.value = false;
    deferredPrompt = null;
  });
});

async function installApp() {
  if (!deferredPrompt) return;

  // Mostra o prompt de instalação do navegador
  deferredPrompt.prompt();

  // Aguarda a resposta do usuário
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    showInstallButton.value = false;
  }

  deferredPrompt = null;
}
</script>

<style scoped>
.install-button {
  display: block;
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.install-button:hover {
  background-color: #219a52;
}
</style>
```

Vamos entender o que acontece:

1. O navegador dispara o evento `beforeinstallprompt` quando os critérios de instalação são atendidos
2. Chamamos `event.preventDefault()` para impedir o banner automático do navegador
3. Armazenamos o evento na variável `deferredPrompt`
4. Quando o usuário clica no botão, chamamos `deferredPrompt.prompt()` para exibir o prompt nativo de instalação
5. Após a instalação, o evento `appinstalled` é disparado e escondemos o botão

Adicione o componente na `HomeView.vue`:

```vue title='./src/views/HomeView.vue' linenums='1' hl_lines="30-31 38"
<template>
  <div>
    <TaskForm @add="addTask" />

    <section v-if="pendingTasks.length > 0">
      <h2 class="section-title">Pendentes ({{ pendingTasks.length }})</h2>
      <TaskItem
        v-for="task in pendingTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @remove="removeTask"
      />
    </section>

    <section v-if="completedTasks.length > 0">
      <h2 class="section-title">Concluídas ({{ completedTasks.length }})</h2>
      <TaskItem
        v-for="task in completedTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @remove="removeTask"
      />
    </section>

    <p v-if="tasks.length === 0" class="empty-message">
      Nenhuma tarefa cadastrada. Adicione uma acima.
    </p>

    <InstallButton />
  </div>
</template>

<script setup>
import TaskForm from '../components/TaskForm.vue';
import TaskItem from '../components/TaskItem.vue';
import InstallButton from '../components/InstallButton.vue';
import { useTasks } from '../composables/useTasks';

const { tasks, pendingTasks, completedTasks, addTask, toggleTask, removeTask } =
  useTasks();
</script>

<style scoped>
.section-title {
  font-size: 1rem;
  color: #666;
  margin-bottom: 12px;
  margin-top: 20px;
}

.empty-message {
  text-align: center;
  color: #999;
  margin-top: 40px;
  font-size: 0.95rem;
}
</style>
```

!!! warning "Atenção"

    O evento `beforeinstallprompt` **não é disparado no Safari (iOS)**. No iOS, a única forma de instalar é pelo menu de compartilhamento do Safari. Por isso, é comum exibir uma instrução manual para usuários de iPhone.

## Testando a instalação

### No desktop

1. Faça o build: `npm run build`
2. Sirva: `npm run preview -- --host`
3. Acesse `http://localhost:4173`
4. Observe o ícone de instalação na barra de endereço do Chrome
5. Clique para instalar
6. A aplicação abre em janela própria

### No celular

Para testar no celular, a aplicação precisa estar acessível na rede local ou publicada em um servidor com HTTPS.

**Opção para rede local:**

1. Descubra o IP da sua máquina (ex: `192.168.1.100`)
2. Após o `npm run preview -- --host`, acesse `http://192.168.1.100:4173` no celular
3. O Service Worker pode não funcionar sem HTTPS. Para testes locais, o Chrome permite usar a flag `chrome://flags/#unsafely-treat-insecure-origin-as-secure`

**Opção com hospedagem:**

1. Publique a aplicação no Netlify, Vercel ou GitHub Pages
2. Acesse a URL (com HTTPS) no celular
3. Instale normalmente

## Resumo do passo

Neste passo, você:

- Aprendeu a instalar o PWA no desktop e no celular
- Entendeu a diferença visual entre navegador e app instalado
- Criou um botão customizado de instalação usando o evento `beforeinstallprompt`
- Testou a instalação no desktop e conheceu as opções para teste no celular

---

**Anterior:** [Passo 5 – Funcionamento offline](05-offline.md) | **Próximo:** [Passo 7 – Atualização de versão](07-atualizacao.md)
