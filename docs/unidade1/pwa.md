# 3. Progressive Web Apps (PWA)

Agora que você conhece as diferentes abordagens para desenvolvimento mobile, vamos entender melhor o que são os **Progressive Web Apps (PWA)** e onde eles se encaixam.

## O que caracteriza um PWA?

Um PWA é, essencialmente, um **site turbinado**. Ele parece e funciona como um aplicativo nativo, mas é construído com tecnologias web.

Para ser considerado um PWA, uma aplicação precisa ter três elementos principais:

### 1. **HTTPS**

O site deve ser servido via conexão segura (HTTPS). Isso é obrigatório porque PWAs acessam recursos sensíveis do dispositivo.

### 2. **Service Worker**

Um **Service Worker** é um script JavaScript que roda em segundo plano, separado da página web. Ele funciona como um intermediário entre a aplicação e a rede, permitindo:

- Funcionamento offline (cache de recursos)
- Notificações push
- Sincronização em background

### 3. **Web App Manifest**

É um arquivo JSON que contém metadados sobre a aplicação:

- Nome do app
- Ícones (para a tela inicial)
- Cores de tema
- Orientação preferida (retrato/paisagem)

Com esses três elementos, a aplicação pode ser **instalada na tela inicial** do celular e se comportar como um app nativo.

## Características de um PWA

Além dos requisitos técnicos, os PWAs seguem alguns princípios:

### **Progressive (Progressivo)**

Funciona para qualquer usuário, independentemente do navegador, usando aprimoramento progressivo.

### **Responsive (Responsivo)**

Se adapta a qualquer tamanho de tela: celular, tablet, desktop.

### **Connectivity Independent (Independente de conexão)**

Funciona offline ou com conexões ruins, graças aos Service Workers.

### **App-like (Como um app)**

Tem interface e navegação que lembram apps nativos.

### **Fresh (Atualizado)**

Sempre atualizado graças aos Service Workers, que buscam novas versões automaticamente.

### **Safe (Seguro)**

Servido via HTTPS, protegendo contra ataques.

### **Discoverable (Descobrível)**

Pode ser encontrado por mecanismos de busca (como um site comum).

### **Re-engageable (Re-engajável)**

Pode enviar notificações push para trazer usuários de volta.

### **Installable (Instalável)**

Pode ser adicionado à tela inicial sem passar por lojas de apps.

### **Linkable (Linkável)**

Facilmente compartilhado via URL.

## Vantagens e limitações reais

Vamos ser honestos: PWAs são ótimos, mas não são perfeitos.

### ✅ Vantagens

**1. Desenvolvimento mais rápido e barato**
Um único código para todas as plataformas (iOS, Android, desktop).

**2. Não precisa de loja de aplicativos**
Não depende de aprovação da Apple ou Google. Basta publicar na web.

**3. Atualizações instantâneas**
Quando você atualiza o código, todos os usuários recebem a nova versão automaticamente.

**4. SEO e compartilhamento**
Como é web, pode ser indexado pelo Google e compartilhado via link.

**5. Menos espaço no celular**
PWAs ocupam menos espaço que apps nativos equivalentes.

### ❌ Limitações

**1. Acesso limitado ao hardware**
Alguns recursos não estão disponíveis via API web, especialmente no iOS:

- NFC (pagamentos por aproximação)
- Bluetooth (limitado)
- Contatos do telefone
- Calendário nativo

**2. Performance inferior em apps pesados**
Para jogos 3D ou apps de edição de vídeo, nativo ainda é melhor.

**3. Suporte inconsistente no iOS**
A Apple tem sido historicamente mais resistente aos PWAs. Funcionalidades como notificações push só foram totalmente suportadas recentemente.

**4. Descoberta mais difícil**
Usuários estão acostumados a buscar apps nas lojas. PWAs dependem de outros canais de divulgação.

**5. Limitações de integração com o sistema**
PWAs não aparecem em listas de compartilhamento, não podem ser apps padrão para abrir arquivos, etc.

## Quando faz sentido usar PWA?

PWAs são ideais para:

### ✅ Quando usar

- **Apps de conteúdo:** notícias, blogs, portfólios
- **E-commerces:** compras online
- **Apps de produtividade simples:** listas de tarefas, anotações
- **Redes sociais:** feeds, mensagens
- **Apps corporativos:** uso interno, sem necessidade de estar nas lojas
- **MVPs:** validar ideias rapidamente
- **Quando o público usa muito o navegador mobile**

### ❌ Quando evitar

- **Jogos 3D complexos**
- **Apps que precisam de integração profunda com o sistema**
- **Apps que dependem de recursos exclusivos de uma plataforma**
- **Quando a performance é crítica** (processamento pesado)

## Exemplos reais de PWAs

Muitas empresas grandes já adotaram PWAs:

- **Twitter Lite:** versão PWA do Twitter, consome 70% menos dados
- **Starbucks:** permite navegar no menu e fazer pedidos offline
- **Uber:** versão leve para conexões ruins
- **Trivago:** busca de hotéis, funciona offline
- **Spotify Web:** reproduz músicas, funciona offline (com cache)

## PWA vs App Nativo: não é "ou isso ou aquilo"

Muitas empresas têm **tanto o app nativo quanto o PWA**. Cada um serve a um propósito:

- **App nativo:** para usuários engajados, que querem a melhor experiência
- **PWA:** para novos usuários, acesso rápido, uso ocasional

Exemplo: o Twitter tem o app nativo (completo) e o Twitter Lite (PWA, mais leve).

## Resumo

PWAs são aplicações web com superpoderes:

- Funcionam offline
- Podem ser instalados
- Enviam notificações
- Têm aparência de app nativo

São ideais para a maioria dos casos de uso, especialmente quando desenvolvimento rápido, custo reduzido e alcance multiplataforma são importantes.

Nas próximas seções, vamos entender melhor a tecnologia por trás dos PWAs e como o navegador se comporta como uma plataforma de desenvolvimento.

---

**Anterior:** [Abordagens para desenvolvimento mobile](abordagens.md) | **Próximo:** [O navegador como plataforma](navegador-plataforma.md)
