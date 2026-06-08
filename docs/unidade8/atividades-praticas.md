# Atividades Práticas

## Atividade 1 – Testando em dois dispositivos reais

Até agora você testou abrindo duas abas no mesmo computador. Nesta atividade, experimente em dispositivos diferentes.

**Passos:**

1. Descubra o IP local do seu computador (ex.: `192.168.1.10`)
2. No `.env` do frontend, troque `VITE_API_BASE_URL` para `http://192.168.1.10:8001`
3. Inicie o servidor de desenvolvimento com `npm run dev -- --host` para expor na rede local
4. No celular (na mesma rede Wi-Fi), acesse `http://192.168.1.10:5173`
5. Faça login em ambos e ative as notificações
6. Crie ou atualize uma tarefa no computador — observe a notificação chegar no celular

!!! warning "Push requer HTTPS fora de localhost"

    Notificações push e Service Workers exigem HTTPS em qualquer origem que não seja `localhost`. Em uma rede local com IP, **o Service Worker não será registrado** — e portanto não haverá push. Para testar em dispositivo físico, você precisaria de um proxy HTTPS ou de um deploy em um domínio com SSL.

    Para fins de teste em aula, use duas abas/janelas no mesmo computador.

---

## Atividade 2 – Notificações personalizadas por tipo de evento

A função `buildNotificationContent` no `sw.js` decide o conteúdo da notificação com base no campo `event` do payload.

**Desafio:** personalize as notificações para incluir mais contexto:

- Para `task_created`: inclua a mensagem `"Prioridade: alta"` no body se o campo `payload.task.priority` for `"high"`
- Para `task_deleted`: inclua o nome da tarefa removida (o backend já envia o `id` — veja se ele também envia o `title`)
- Adicione um ícone diferente por tipo de evento usando o campo `icon` das opções de `showNotification`

Dica: inspecione o payload completo no DevTools com `console.log(payload)` dentro do handler `push`.

---

## Atividade 3 – Badge de notificações não lidas

Adicione um indicador visual no `AppHeader` que mostre o número de notificações recebidas enquanto o app estava em segundo plano.

**Sugestão de implementação:**

1. No `App.vue`, adicione um `ref` para contar as notificações recebidas
2. Incremente o contador quando o SW enviar `PUSH_NOTIFICATION_CLICKED`
3. Passe o contador como prop para o `AppHeader`
4. No `AppHeader`, exiba um círculo vermelho com o número ao lado do ícone de usuário
5. Zere o contador quando o usuário clicar no badge

---

## Atividade 4 (Desafio) – "Não perguntar por 7 dias"

Atualmente, ao clicar em "Agora não" no `NotificationPrompt`, o banner não aparece mais — nunca. Isso é inflexível: o usuário pode mudar de ideia depois.

**Desafio:** substitua o comportamento por "não perguntar por 7 dias":

1. Em vez de salvar `push_prompt_dismissed` sem valor, salve um timestamp: `localStorage.setItem('push_prompt_dismissed', Date.now())`
2. No `onMounted` do `NotificationPrompt`, verifique se o timestamp existe e se já passaram 7 dias:
   ```javascript
   const dismissed = localStorage.getItem('push_prompt_dismissed')
   const sevenDays = 7 * 24 * 60 * 60 * 1000
   if (dismissed && Date.now() - Number(dismissed) < sevenDays) return
   ```
3. Após 7 dias, o banner voltará a aparecer automaticamente

---

**Anterior:** [Passo 5 – Interface de notificação](tutorial/05-notificacao-ui.md)
