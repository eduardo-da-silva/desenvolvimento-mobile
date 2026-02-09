# 2. Abordagens para desenvolvimento mobile

Existem diferentes formas de criar aplicações mobile. Cada abordagem tem suas vantagens, desvantagens e situações onde faz mais sentido.

Vamos explorar as quatro principais abordagens:

## 1. Aplicações Nativas

São desenvolvidas **especificamente para uma plataforma**, usando as linguagens e ferramentas oficiais de cada sistema operacional.

### Tecnologias

- **iOS:** Swift ou Objective-C, usando Xcode
- **Android:** Kotlin ou Java, usando Android Studio

### Características

**Vantagens:**

- Máximo desempenho
- Acesso total aos recursos do dispositivo
- Interface e experiência nativas (seguem os padrões da plataforma)
- Melhor integração com o sistema operacional

**Desvantagens:**

- É necessário desenvolver duas vezes (uma para iOS, outra para Android)
- Equipe precisa conhecer linguagens diferentes
- Custo e tempo de desenvolvimento maiores
- Manutenção em dobro

**Quando usar:**

- Apps que exigem performance máxima (jogos 3D, editores de vídeo)
- Apps que usam intensamente recursos do hardware
- Apps que precisam seguir rigorosamente os padrões de interface de cada plataforma
- Quando há orçamento e tempo disponíveis

**Exemplos:** Instagram, Spotify, Uber (usam nativo para partes críticas).

---

## 2. Aplicações Híbridas

São desenvolvidas usando **tecnologias web** (HTML, CSS, JavaScript), mas **empacotadas como aplicativos nativos**.

### Tecnologias

- **Ionic**
- **Cordova / PhoneX**
- **Capacitor**

### Como funciona

O código web roda dentro de um "navegador invisível" (WebView) embutido no aplicativo. Uma camada de plugins permite acessar recursos nativos do celular (câmera, GPS, etc.).

**Vantagens:**

- Um único código para iOS e Android
- Usa tecnologias web conhecidas
- Pode ser distribuído nas lojas oficiais
- Acesso a recursos nativos via plugins

**Desvantagens:**

- Performance inferior ao nativo (depende do WebView)
- Interface pode não parecer totalmente nativa
- Dependência de plugins de terceiros para acessar recursos do hardware
- Limitações em apps que exigem muito processamento

**Quando usar:**

- Apps corporativos e internos
- MVPs (produtos mínimos viáveis)
- Apps com interface e lógica relativamente simples
- Quando há prazo e orçamento limitados

**Exemplos:** Apps de bancos menores, apps de empresas para uso interno.

---

## 3. Aplicações Web Responsivas

São **sites comuns**, acessados pelo navegador do celular, mas otimizados para telas pequenas.

### Tecnologias

- HTML, CSS, JavaScript
- Qualquer framework frontend (Vue.js, React, etc.)

### Características

**Vantagens:**

- Não precisa instalar nada
- Funciona em qualquer dispositivo com navegador
- Um código para todas as plataformas (desktop, tablet, mobile)
- Atualizações instantâneas (não depende de aprovação de lojas)

**Desvantagens:**

- Acesso limitado aos recursos do hardware
- Não aparece na tela inicial por padrão
- Depende de conexão com internet
- Não recebe notificações push (na maioria dos casos)

**Quando usar:**

- Conteúdo informativo
- Apps que serão usados pontualmente (não precisa instalar)
- Quando o acesso a recursos do hardware não é essencial
- Prototipagem rápida

**Exemplos:** Sites de notícias, e-commerces, blogs.

---

## 4. Progressive Web Apps (PWA)

São **aplicações web avançadas** que oferecem funcionalidades típicas de apps nativos, mesmo rodando no navegador.

### Tecnologias

- HTML, CSS, JavaScript
- Service Workers (para funcionar offline)
- Web App Manifest (para instalação)
- HTTPS obrigatório

### Características

**Vantagens:**

- Um código para todas as plataformas
- Pode ser instalado na tela inicial (sem passar pelas lojas)
- Funciona offline
- Pode enviar notificações push
- Acesso a recursos do hardware via APIs web modernas
- Atualizações automáticas

**Desvantagens:**

- Ainda limitado em comparação com nativos (especialmente no iOS)
- Nem todas as APIs estão disponíveis em todos os navegadores
- Descoberta mais difícil (não está nas lojas oficiais, necessariamente)
- Interface pode não ser totalmente nativa

**Quando usar:**

- Apps que precisam funcionar offline
- Quando quer atingir desktop e mobile com um código
- Aplicações com conteúdo dinâmico que atualizam com frequência
- Quando não é viável ou necessário desenvolver nativo

**Exemplos:** Twitter Lite, Starbucks, Trivago.

---

## Comparativo Rápido

| Abordagem      | Código único? | Performance          | Acesso ao hardware   | Custo/Tempo |
| -------------- | ------------- | -------------------- | -------------------- | ----------- |
| Nativo         | ❌ Não        | ⭐⭐⭐⭐⭐ Excelente | ⭐⭐⭐⭐⭐ Total     | 💰💰💰 Alto |
| Híbrido        | ✅ Sim        | ⭐⭐⭐ Bom           | ⭐⭐⭐⭐ Quase total | 💰💰 Médio  |
| Web Responsivo | ✅ Sim        | ⭐⭐⭐⭐ Muito bom   | ⭐⭐ Limitado        | 💰 Baixo    |
| PWA            | ✅ Sim        | ⭐⭐⭐⭐ Muito bom   | ⭐⭐⭐ Bom           | 💰 Baixo    |

## Qual escolher?

Não existe uma resposta única. Depende de:

- **Orçamento e prazo:** quanto menos tempo e dinheiro, mais vantajoso usar tecnologias web.
- **Requisitos de performance:** jogos e apps pesados pedem nativo.
- **Recursos necessários:** se precisa de algo muito específico do hardware, nativo pode ser necessário.
- **Público-alvo:** se o app é para uso interno ou MVP, híbrido/PWA podem ser suficientes.

Neste curso, vamos focar em **PWA com Vue.js**, pois permite criar aplicações ricas e modernas usando as tecnologias web que você já conhece.

---

**Anterior:** [O que é desenvolvimento mobile?](o-que-e-mobile.md) | **Próximo:** [Progressive Web Apps (PWA)](pwa.md)
