# Atividades Práticas – Unidade 7

Estas atividades complementam o tutorial de autenticação. Elas foram pensadas para consolidar os conceitos trabalhados e explorar situações próximas de projetos reais.

---

## Atividade 1 – Tela de cadastro

**Objetivo:** implementar o fluxo completo de criação de conta, do formulário ao redirecionamento pós-cadastro.

**Contexto:** no estado atual do projeto, novos usuários só podem ser criados via Swagger ou pela linha de comando do backend. A aplicação não tem uma tela de cadastro. Esta atividade completa esse fluxo no frontend.

**O endpoint já está funcionando.** Acesse `http://localhost:8001/docs`, localize o grupo **auth** e consulte a assinatura do endpoint `POST /api/users/register`. Ele mostrará quais campos o corpo deve ter e o que é retornado em caso de sucesso ou erro.

**O que implementar:**

1. Crie o arquivo `src/views/RegisterView.vue` com um formulário contendo campos de email, senha e confirmação de senha
2. Adicione uma validação no frontend: se os campos de senha não coincidirem, exiba um erro antes de enviar a requisição
3. Crie o método `register(email, password)` em `src/api/authApi.js` que chama `POST /api/users/register`
4. Após o cadastro bem-sucedido, redirecione para `/login` com uma mensagem de sucesso (você pode usar um query param: `/login?registered=true`)
5. Na `LoginView`, exiba uma mensagem de boas-vindas se `route.query.registered === 'true'`
6. Adicione a rota `/register` no router com o componente `RegisterView`
7. Adicione um link "Criar conta" na `LoginView` que aponta para `/register`

**Dica:** o backend retorna `400` com `detail: "Email já cadastrado"` se o email já existir. Trate esse caso exibindo a mensagem na tela.

**Resultado esperado:** é possível criar uma conta pelo frontend, sem precisar usar o Swagger ou a linha de comando.

---

## Atividade 2 – Exibir o email do usuário logado no cabeçalho

**Objetivo:** praticar a decodificação manual de JWT e a exposição de dados do usuário na interface.

**Contexto:** o access token contém o email do usuário no payload. O payload de um JWT é apenas Base64 — qualquer código JavaScript pode lê-lo sem precisar da chave secreta do servidor.

**O que implementar:**

1. Na `src/stores/auth.js`, crie um computed `userEmail` que:
   - Retorna `null` se não houver access token
   - Decodifica o payload do token (segunda parte, separada por `.`) com `atob()` e `JSON.parse()`
   - Retorna o campo `sub` do payload (que contém o email)
2. No `src/components/AppHeader.vue`, exiba o email ao lado do botão "Sair":

```vue
<span
  v-if="authStore.userEmail"
  class="user-email"
>{{ authStore.userEmail }}</span>
```

**Dica:** a segunda parte de um JWT pode ser decodificada assim:

```javascript
const payload = JSON.parse(atob(token.split('.')[1]));
```

Lembre-se de que `atob` pode falhar se o token for inválido — use um `try/catch` para retornar `null` nesses casos.

**Resultado esperado:** o email do usuário aparece no cabeçalho enquanto ele está logado.

---

## Atividade 3 – Feedback de sessão expirada

**Objetivo:** melhorar a experiência do usuário quando a sessão expira e o refresh automático falha.

**Contexto:** no estado atual, quando o refresh token expira, o interceptor do Axios redireciona para `/login` via `window.location.href`. Isso funciona, mas não avisa o usuário do motivo. Um usuário que estava usando a aplicação de repente se vê na tela de login sem explicação.

**O que implementar:**

1. No interceptor de response em `src/api/config.js`, antes de redirecionar para `/login`, salve uma mensagem no `sessionStorage`:

```javascript
sessionStorage.setItem(
  'auth_message',
  'Sua sessão expirou. Faça login novamente.',
);
window.location.href = '/login';
```

2. Na `LoginView`, ao montar o componente, verifique se existe essa mensagem no `sessionStorage`:

```javascript
import { onMounted } from 'vue';

onMounted(() => {
  const msg = sessionStorage.getItem('auth_message');
  if (msg) {
    errorMessage.value = msg;
    sessionStorage.removeItem('auth_message');
  }
});
```

**Resultado esperado:** quando a sessão expira e o refresh falha, o usuário vê a mensagem "Sua sessão expirou. Faça login novamente." na tela de login.

---

**Anterior:** [Passo 4 – Login, guards e logout](tutorial/04-login-e-guards.md)
