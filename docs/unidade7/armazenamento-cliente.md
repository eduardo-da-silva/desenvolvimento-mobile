# Onde guardar o token

## O problema do armazenamento

O frontend recebe o JWT após o login e precisa guardá-lo em algum lugar para usá-lo nas requisições seguintes. Diferente de uma variável comum — que some ao recarregar a página —, o token precisa sobreviver a recargas e ao fechamento da aba.

Há três lugares comuns para guardar tokens no navegador:

| Opção             | Persiste ao recarregar? | Persiste ao fechar o navegador? | Vulnerável a XSS? |
| ----------------- | ----------------------- | ------------------------------- | ----------------- |
| `localStorage`    | Sim                     | Sim                             | Sim               |
| `sessionStorage`  | Não                     | Não                             | Sim               |
| Cookie `HttpOnly` | Sim                     | Configurável                    | Não               |

## Por que usamos o `localStorage`

O cookie `HttpOnly` é a opção mais segura: o JavaScript não consegue lê-lo, o que elimina a vulnerabilidade de XSS. No entanto, ele exige configuração adicional no backend (cabeçalhos `Set-Cookie`, política de `SameSite`, HTTPS em produção) e torna o frontend mais dependente de decisões do servidor.

Para este projeto, optamos pelo **`localStorage`** por três motivos:

1. **Simplicidade**: a leitura e escrita são operações síncronas com uma linha de código
2. **Independência**: o frontend não precisa de configuração especial no backend
3. **Adequação ao contexto didático**: o objetivo é entender o fluxo de autenticação; a segurança avançada é um tema para um curso posterior

!!! note "Em produção"

    Em aplicações reais que lidam com dados sensíveis, cookies `HttpOnly` combinados com HTTPS são a recomendação padrão. O `localStorage` é aceitável em aplicações internas, protótipos ou quando o risco de XSS é mitigado por outras camadas de segurança.

## O padrão adotado

Dois tokens são armazenados com chaves fixas:

```javascript
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('refresh_token', data.refresh_token);
```

Ao inicializar a store de autenticação, os tokens são lidos do `localStorage`:

```javascript
const accessToken = ref(localStorage.getItem('access_token'));
const refreshToken = ref(localStorage.getItem('refresh_token'));
```

Isso garante que, ao recarregar a página, o usuário continua logado — sem precisar fazer login novamente a cada acesso.

No logout, ambos os tokens são removidos:

```javascript
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

---

**Anterior:** [Autenticação com JWT](autenticacao-jwt.md) | **Próximo:** [Tutorial prático](tutorial/index.md)
