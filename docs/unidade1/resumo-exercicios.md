# 7. Resumo e exercícios

Chegamos ao final da Unidade 1! Vamos recapitular o que aprendemos e propor algumas atividades para fixar o conteúdo.

## Resumo dos principais conceitos

### 1. Desenvolvimento mobile tem particularidades próprias

- Tela pequena
- Interação por toque
- Contexto de uso variado
- Acesso a recursos específicos do hardware (GPS, câmera, sensores)
- Limitações de bateria e dados

### 2. Existem diferentes abordagens para criar apps mobile

| Abordagem          | Código único?                 | Performance | Custo |
| ------------------ | ----------------------------- | ----------- | ----- |
| **Nativo**         | Não (iOS e Android separados) | Excelente   | Alto  |
| **Híbrido**        | Sim (tecnologias web)         | Bom         | Médio |
| **Web Responsivo** | Sim                           | Muito bom   | Baixo |
| **PWA**            | Sim                           | Muito bom   | Baixo |

### 3. PWAs oferecem funcionalidades avançadas

Um PWA precisa de:

- **HTTPS** (conexão segura)
- **Service Worker** (funcionar offline e notificações)
- **Web App Manifest** (instalação na tela inicial)

Vantagens:

- Um código para todas as plataformas
- Atualizações automáticas
- Não depende de lojas de apps
- Funciona offline

Limitações:

- Acesso limitado a recursos do hardware (comparado ao nativo)
- Suporte inconsistente no iOS
- Performance inferior em apps pesados

### 4. O navegador é uma plataforma completa

Navegadores modernos oferecem Web APIs para:

- Geolocalização (GPS)
- Câmera e microfone
- Notificações push
- Armazenamento local
- Vibração, bateria, orientação do dispositivo

Mas com limitações de segurança:

- Sempre pede permissão ao usuário
- HTTPS obrigatório
- Nem todas as APIs estão disponíveis em todos os navegadores

### 5. UX mobile segue princípios específicos

- **Mobile-first:** pense no mobile primeiro, depois adapte para telas maiores
- **Elementos tocáveis grandes:** mínimo 44x44px (ideal: 48x48px)
- **Sem hover:** use estados `:active` para feedback
- **Ações principais ao alcance do polegar:** parte inferior da tela
- **Feedback visual:** sempre confirme as ações do usuário
- **Performance percebida:** otimize e use carregamento progressivo

## Conceitos-chave

- **Progressive Web App (PWA)**
- **Service Worker**
- **Web App Manifest**
- **Mobile-first**
- **Web APIs**
- **Feedback visual**
- **Área de alcance do polegar**

---

## Exercício proposto

Agora é a sua vez de praticar! Crie uma interface mobile-first para um aplicativo de **controle de gastos pessoais**.

### Requisitos:

1. **Interface mobile-first** (HTML + CSS apenas, sem JavaScript por enquanto)
2. **Cabeçalho fixo** mostrando o saldo atual
3. **Lista de transações** (receitas e despesas)
4. **Botão de ação fixo na parte inferior** para adicionar nova transação
5. **Feedback visual** ao tocar nos itens
6. **Elementos tocáveis com tamanho adequado** (mínimo 44px)

### Estrutura sugerida:

```
┌─────────────────────────┐
│ Saldo: R$ 1.234,56      │ ← Cabeçalho fixo
├─────────────────────────┤
│ ▼ Almoço     -R$ 45,00  │
│ ▲ Salário  +R$ 3.000,00 │ ← Lista de transações (scroll)
│ ▼ Uber       -R$ 12,50  │
│ ▼ Mercado    -R$ 180,00 │
├─────────────────────────┤
│ [+ Nova Transação]      │ ← Botão fixo na parte inferior
└─────────────────────────┘
```

### Dicas:

- Use cores diferentes para receitas (verde) e despesas (vermelho)
- Aplique sombras sutis para dar sensação de profundidade
- Use `position: fixed` para cabeçalho e botão
- Adicione transições suaves para feedback visual
- Teste no modo mobile do navegador

### Diferencial:

Se quiser ir além:

- Use media query para adaptar para telas maiores
- Adicione ícones (podem ser emojis: 🍔 💰 🚗 🛒)
- Crie variações de cores para categorias diferentes

---

## Pergunta reflexiva

**Pense e discuta:**

> "Considerando que PWAs funcionam via navegador e têm limitações em relação a apps nativos, em que tipos de projetos você acredita que eles sejam a melhor escolha? Dê exemplos concretos e justifique sua resposta."

**Pontos para considerar:**

- Orçamento e prazo do projeto
- Necessidade de recursos específicos do hardware
- Público-alvo (usuários frequentes vs ocasionais)
- Requisitos de performance
- Necessidade de estar nas lojas de apps

---

## Recursos adicionais

Para aprofundar seus estudos:

- **[MDN Web Docs - Progressive Web Apps](https://developer.mozilla.org/pt-BR/docs/Web/Progressive_web_apps)**: documentação completa sobre PWAs
- **[Can I Use](https://caniuse.com)**: verifique suporte a APIs em diferentes navegadores
- **[web.dev](https://web.dev/progressive-web-apps/)**: guias e boas práticas do Google
- **[PWA Stats](https://www.pwastats.com)**: estatísticas e casos de sucesso de PWAs

---

## Próximos passos

Na **Unidade 2**, vamos:

- Criar nosso primeiro PWA com Vue.js
- Configurar Service Workers
- Implementar funcionalidades offline
- Adicionar a aplicação à tela inicial

Prepare-se para a parte prática!

---

**Anterior:** [Exemplo prático inicial](exemplo-pratico.md) | **Voltar ao início:** [Unidade 1](index.md)
