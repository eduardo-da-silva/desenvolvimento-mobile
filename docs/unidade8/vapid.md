# VAPID – Autenticação do servidor

## O problema sem VAPID

O protocolo Web Push define como uma mensagem é entregue ao browser. Mas quem garante que foi o _seu_ servidor que a enviou?

Sem autenticação, qualquer servidor na internet poderia enviar mensagens para qualquer endpoint de push — bastaria conhecer a URL. Isso abriria espaço para spam, phishing e abusos de push services alheios.

O VAPID resolve exatamente isso.

## O que é VAPID

**VAPID** (_Voluntary Application Server Identification for Web Push_) é um mecanismo de autenticação para servidores de push. Com VAPID, o servidor assina cada requisição ao Push Service usando uma chave privada. O Push Service verifica a assinatura com a chave pública correspondente — e só entrega a mensagem se a assinatura for válida.

É como um envelope lacrado com um selo pessoal: o carteiro (Push Service) só entrega se reconhecer que o selo é genuíno.

## O par de chaves

VAPID usa criptografia de curva elíptica P-256 — o mesmo algoritmo usado em TLS e JWT com ES256.

| Chave           | Formato                          | Onde fica          | Quem vê               |
| --------------- | -------------------------------- | ------------------ | --------------------- |
| **Pública**     | base64url, 65 bytes (ponto não comprimido) | Frontend + Backend | Todos — é pública por definição |
| **Privada**     | base64url, 32 bytes (escalar)    | Apenas no Backend  | Somente o servidor    |

!!! warning "A chave privada nunca vai para o frontend"

    A chave pública é exposta intencionalmente — o browser precisa dela para verificar que a subscription pertence ao seu servidor. A chave privada deve permanecer no servidor e nunca ser commitada em repositórios públicos.

## Como a chave pública é usada no frontend

Quando o PWA chama `pushManager.subscribe()`, passa a chave pública VAPID como `applicationServerKey`. Isso "vincula" a subscription ao seu servidor: somente quem tiver a chave privada correspondente poderá enviar mensagens para aquele endpoint.

```javascript
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
})
```

O browser verifica internamente que a chave está no formato correto (um ponto não comprimido de 65 bytes na curva P-256) antes de criar a subscription.

## A conversão urlBase64ToUint8Array

A chave pública VAPID é uma string base64url sem padding (`=`). O browser precisa dela como `Uint8Array`. A conversão é uma etapa obrigatória — sem ela, `pushManager.subscribe()` lança um erro:

```javascript
function urlBase64ToUint8Array(base64String) {
  // Restaura o padding removido
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  // Converte base64url para base64 padrão
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  // Decodifica e converte para Uint8Array
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}
```

## Como o servidor usa a chave privada

Ao enviar uma mensagem push, o servidor monta um token JWT assinado com a chave privada. Esse token vai no cabeçalho `Authorization` da requisição ao Push Service:

```
Authorization: vapid t=eyJhbGci...,k=BEBiQ5Zw...
```

O Push Service valida o token contra a chave pública e, se válido, entrega a mensagem.

Bibliotecas como `pywebpush` fazem todo esse trabalho:

```python
from pywebpush import webpush

webpush(
    subscription_info={"endpoint": "...", "keys": {"p256dh": "...", "auth": "..."}},
    data='{"event": "task_updated", "task": {...}}',
    vapid_private_key="XtwefVVsg-DVxVBWkeXiADqkYHJ3JZ0u7C4IdLhAPaw",
    vapid_claims={"sub": "mailto:admin@example.com"},
)
```

## As chaves desta unidade

Nesta unidade, o backend já está configurado com um par de chaves VAPID fixo, embutido na imagem Docker. Você só precisa configurar a chave pública no frontend.

!!! info "Em produção, gere o seu próprio par"

    Para um projeto real, gere suas próprias chaves com:

    ```python
    from py_vapid import Vapid
    from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
    import base64

    v = Vapid()
    v.generate_keys()

    pub = base64.urlsafe_b64encode(
        v.public_key.public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
    ).decode().rstrip('=')

    priv_scalar = v.private_key.private_numbers().private_value.to_bytes(32, 'big')
    priv = base64.urlsafe_b64encode(priv_scalar).decode().rstrip('=')

    print('VAPID_PUBLIC_KEY=' + pub)
    print('VAPID_PRIVATE_KEY=' + priv)
    ```

    A chave privada vai para o `.env` do servidor (e nunca para o repositório). A chave pública vai para o `.env` do frontend como `VITE_VAPID_PUBLIC_KEY`.

---

**Anterior:** [Como funciona o Web Push](web-push.md) | **Próximo:** [Tutorial prático](tutorial/index.md)
