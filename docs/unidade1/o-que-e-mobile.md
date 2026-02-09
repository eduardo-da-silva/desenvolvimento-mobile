# 1. O que é desenvolvimento mobile?

Desenvolvimento mobile é o processo de criar aplicações para dispositivos móveis, como smartphones e tablets. Mas o que torna o desenvolvimento mobile diferente do desenvolvimento para outras plataformas?

## Desktop vs Web vs Mobile

Vamos comparar três tipos de aplicações:

### Aplicações Desktop

São instaladas diretamente no computador. Exemplos: Word, Photoshop, VLC Player.

**Características:**

- Instalação local via arquivo executável
- Acesso total aos recursos do sistema operacional
- Funciona offline por padrão
- Interface otimizada para teclado e mouse
- Tela grande (geralmente 13" ou mais)

### Aplicações Web

Rodam no navegador e são acessadas por URL. Exemplos: Gmail, Google Docs, Netflix.

**Características:**

- Não precisa instalar (só acessar a URL)
- Roda em qualquer sistema operacional com navegador
- Depende de conexão com internet (geralmente)
- Interface pensada para mouse/trackpad
- Tela grande

### Aplicações Mobile

São feitas para smartphones e tablets. Exemplos: WhatsApp, Instagram, iFood.

**Características:**

- Instaladas via loja de aplicativos (Play Store, App Store)
- Interface otimizada para toque
- Tela pequena (geralmente entre 4" e 7")
- Uso em contextos variados (andando, deitado, em movimento)
- Pode funcionar offline
- Acesso a recursos específicos: GPS, câmera, acelerômetro, etc.

## Particularidades do uso em dispositivos móveis

Desenvolver para mobile não é simplesmente adaptar uma aplicação web para uma tela menor. Existem particularidades importantes:

### 1. **Contexto de uso**

O usuário mobile está frequentemente:

- Em movimento (no ônibus, caminhando, esperando)
- Com pouco tempo disponível
- Usando apenas uma mão
- Lidando com conexões instáveis

**Implicação:** A aplicação deve ser rápida, objetiva e funcionar bem mesmo com conexão ruim.

### 2. **Tamanho da tela**

Telas de celular variam de 4 a 7 polegadas, em média. Isso afeta:

- Quantidade de informação visível ao mesmo tempo
- Necessidade de navegação por níveis (menus, abas)
- Tamanho dos elementos tocáveis

**Implicação:** O design deve priorizar informações e ações principais.

### 3. **Forma de interação**

No celular, a interação principal é por **toque** (touch), não por mouse.

Diferenças práticas:

- Não existe "hover" (passar o mouse por cima)
- Dedos são menos precisos que cursores
- Gestos como deslizar (swipe) e pinçar (pinch) são comuns
- É possível tocar com múltiplos dedos ao mesmo tempo

**Implicação:** Botões devem ser grandes o suficiente. Feedback visual é essencial.

### 4. **Recursos do hardware**

Smartphones têm recursos que computadores não têm (ou têm limitados):

- GPS (localização precisa)
- Acelerômetro e giroscópio (orientação e movimento)
- Câmera frontal e traseira
- Notificações push
- Vibração

**Implicação:** É possível criar experiências contextuais e interativas únicas.

### 5. **Consumo de bateria e dados**

Dispositivos móveis dependem de bateria e dados móveis limitados.

**Implicação:** Aplicações devem ser otimizadas para consumir menos recursos.

## Por que isso importa?

Quando você desenvolve uma aplicação mobile, precisa considerar todas essas particularidades desde o início. Não é apenas uma questão de "fazer funcionar em uma tela menor" — é pensar em como a pessoa vai usar aquilo no dia a dia dela.

Exemplo prático: imagine um app de receitas.

- **Versão desktop:** pode mostrar várias receitas lado a lado, com muitas fotos e descrições.
- **Versão mobile:** deve mostrar uma receita por vez, com instruções passo a passo grandes e claras (afinal, a pessoa pode estar cozinhando e olhando de longe).

## Resumo

Desenvolvimento mobile tem suas próprias regras. As principais diferenças são:

- Tela pequena
- Interação por toque
- Contexto de uso variado
- Acesso a recursos específicos do hardware
- Limitações de bateria e dados

No próximo tópico, vamos ver as diferentes **abordagens técnicas** para criar aplicações mobile.

---

**Anterior:** [Apresentação da Unidade](index.md) | **Próximo:** [Abordagens para desenvolvimento mobile](abordagens.md)
