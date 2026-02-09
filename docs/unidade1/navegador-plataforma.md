# 4. O navegador como plataforma

Quando falamos de PWAs, estamos, na prática, usando o **navegador como plataforma de desenvolvimento**. Mas o que isso significa?

Tradicionalmente, "plataforma" era o sistema operacional (Windows, macOS, Android, iOS). Para desenvolver para essas plataformas, você precisava usar suas linguagens e ferramentas específicas.

Com os PWAs, a plataforma é o **navegador web**. E navegadores modernos oferecem APIs (interfaces de programação) que permitem acessar recursos do dispositivo diretamente via JavaScript.

## APIs disponíveis

Nos últimos anos, os navegadores evoluíram muito. Hoje, é possível acessar uma série de recursos via **Web APIs**:

### APIs de Hardware e Sensores

- **Geolocation API:** acessa a localização do dispositivo (GPS)
- **Camera API / MediaDevices:** acessa câmera e microfone
- **Vibration API:** faz o celular vibrar
- **Battery Status API:** verifica o nível de bateria
- **Device Orientation API:** detecta orientação e movimento do dispositivo

### APIs de Armazenamento

- **LocalStorage:** armazena dados simples localmente
- **IndexedDB:** banco de dados local, para dados estruturados
- **Cache API:** armazena recursos (HTML, CSS, JS, imagens) para acesso offline

### APIs de Comunicação

- **Fetch API:** faz requisições HTTP para servidores
- **WebSockets:** comunicação em tempo real
- **Push API:** recebe notificações push do servidor

### APIs de Interface e Experiência

- **Fullscreen API:** entra em modo tela cheia
- **Web Share API:** compartilha conteúdo com outros apps
- **Notifications API:** mostra notificações no sistema
- **Payment Request API:** facilita pagamentos online

### APIs de Produtividade

- **Service Workers:** scripts que rodam em segundo plano
- **Web Workers:** execução de código JavaScript em paralelo
- **Clipboard API:** acessa a área de transferência (copiar/colar)

## Exemplo prático: acessando a geolocalização

Veja como é simples acessar a localização do usuário via JavaScript:

```javascript linenums="1"
// Verifica se a API está disponível
if ('geolocation' in navigator) {
  // Solicita a localização
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Sucesso: localização obtida
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Você está em: ${latitude}, ${longitude}`);
    },
    (error) => {
      // Erro: usuário negou ou falha técnica
      console.error('Erro ao obter localização:', error);
    },
  );
} else {
  console.log('Geolocalização não disponível neste navegador');
}
```

Com apenas esse código, você consegue a localização do usuário — desde que ele permita.

## Limitações de hardware e segurança

Embora as Web APIs sejam poderosas, existem **limitações importantes**.

### 1. **Permissões do usuário**

Para acessar recursos sensíveis (câmera, microfone, localização), o navegador **sempre pede permissão ao usuário**.

Isso é bom para privacidade, mas significa que você precisa lidar com dois cenários:

- O usuário permite
- O usuário nega

Seu código precisa estar preparado para ambos os casos.

### 2. **HTTPS obrigatório**

A maioria das APIs sensíveis só funciona em **sites seguros (HTTPS)**. Isso inclui:

- Service Workers
- Geolocation (em alguns navegadores)
- Camera/Microphone

Em desenvolvimento local (`localhost`), o navegador permite, mas em produção, HTTPS é obrigatório.

### 3. **APIs não disponíveis em todos os navegadores**

Nem todas as APIs funcionam em todos os navegadores. Por exemplo:

- A **Web Bluetooth API** funciona no Chrome, mas tem suporte limitado no Safari e Firefox.
- A **Payment Request API** tem suporte variável.

Por isso, é importante sempre verificar a compatibilidade antes de usar uma API.

**Dica:** use o site [caniuse.com](https://caniuse.com) para verificar o suporte a APIs específicas.

### 4. **Recursos ainda inacessíveis**

Algumas coisas ainda não são possíveis via web (ou são muito limitadas):

- **NFC (Near Field Communication):** usado em pagamentos por aproximação
- **Acesso completo ao sistema de arquivos:** por segurança, o acesso é restrito
- **Acesso a contatos e calendário:** proteção à privacidade
- **Integração profunda com outras apps:** não é possível ser "app padrão" para abrir arquivos

Para esses casos, apps nativos ainda são necessários.

## Diferença entre rodar no navegador e rodar como app instalado

Quando um PWA é instalado na tela inicial, ele continua sendo uma aplicação web, mas **se comporta de forma diferente**:

### No navegador (não instalado):

- Aparece a barra de endereço (URL visível)
- Aparece o menu do navegador
- Ocupa uma aba do navegador
- Comportamento típico de site

### Instalado na tela inicial:

- Abre em tela cheia (sem barra de endereço)
- Parece um app nativo
- Aparece na lista de apps recentes
- Pode ter splash screen personalizada (tela de carregamento)
- Pode funcionar offline (se configurado)

A diferença é mais de **experiência do usuário** do que técnica. O código é o mesmo, mas a forma como é apresentado muda.

## Service Workers: o coração do PWA

O **Service Worker** é o que torna PWAs realmente poderosos. Ele é um script JavaScript que roda **separado da página principal**, em segundo plano.

### O que ele faz:

- **Cache inteligente:** armazena recursos para funcionar offline
- **Intercepta requisições de rede:** pode responder com cache ou buscar na rede
- **Recebe notificações push:** mesmo quando o app está fechado
- **Sincroniza em background:** envia dados quando a conexão volta

### Como funciona:

```javascript linenums="1"
// Registrando um Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registrado:', registration);
    })
    .catch((error) => {
      console.error('Falha ao registrar Service Worker:', error);
    });
}
```

Uma vez registrado, o Service Worker continua funcionando mesmo quando você fecha a aba ou o app.

Vamos estudar Service Workers em detalhes nas próximas unidades. Por enquanto, entenda que eles são essenciais para funcionalidades offline e notificações.

## Resumo

O navegador é uma plataforma completa para desenvolvimento mobile:

- Oferece APIs para acessar hardware e recursos do dispositivo
- Impõe limitações de segurança (permissões, HTTPS)
- Nem tudo que é possível em apps nativos é possível na web
- PWAs instalados se comportam como apps nativos, mas continuam sendo web

O segredo é conhecer essas possibilidades e limitações, e usá-las a seu favor.

---

**Anterior:** [Progressive Web Apps (PWA)](pwa.md) | **Próximo:** [Primeiros cuidados com UX mobile](ux-mobile.md)
