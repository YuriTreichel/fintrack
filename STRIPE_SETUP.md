# Configuração do Stripe para Sistema Financeiro

## Passo 1: Criar conta no Stripe
1. Acesse https://stripe.com e crie uma conta
2. Ative o modo de teste (Test Mode)

## Passo 2: Obter chaves de API
1. No painel do Stripe, vá para **Developers > API keys**
2. Copie as chaves:
   - **Publishable key** (STRIPE_KEY)
   - **Secret key** (STRIPE_SECRET)

## Passo 3: Configurar variáveis de ambiente
No arquivo `.env` do seu projeto, adicione:

```
STRIPE_KEY=pk_test_sua_chave_publica_aqui
STRIPE_SECRET=sk_test_sua_chave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui
```

## Passo 4: Criar produtos e preços no Stripe
No painel do Stripe, crie 3 produtos com os seguintes preços:

### 1. Plano Família
- **Nome do produto:** FinTrack - Plano Família
- **Preço:** R$ 34,90/mês (recorrente mensal)
- **ID do preço:** Copie o `price_id` (ex: `price_1QXXXXXXXXXXXXX`)

### 2. Premium Mensal
- **Nome do produto:** FinTrack - Premium Mensal
- **Preço:** R$ 19,90/mês (recorrente mensal)
- **ID do preço:** Copie o `price_id`

### 3. Plano Anual
- **Nome do produto:** FinTrack - Plano Anual
- **Preço:** R$ 199,90/ano (recorrente anual)
- **ID do preço:** Copie o `price_id`

## Passo 5: Atualizar configuração do frontend
No arquivo `resources/js/config/stripePlans.js`, substitua os placeholders pelos seus Price IDs reais:

```javascript
const stripePlans = {
  // Plano Família - R$ 34,90/mês
  FAMILY_MONTHLY: 'price_1QXXXXXXXXXXXXX', // Seu Price ID real
  
  // Premium Mensal - R$ 19,90/mês
  PREMIUM_MONTHLY: 'price_1QXXXXXXXXXXXXX', // Seu Price ID real
  
  // Plano Anual - R$ 199,90/ano
  ANNUAL: 'price_1QXXXXXXXXXXXXX', // Seu Price ID real
};
```

## Passo 6: Configurar Webhooks
1. No painel do Stripe, vá para **Developers > Webhooks**
2. Clique em **Add endpoint**
3. URL do endpoint: `https://seu-dominio.com/stripe/webhook`
   - Para desenvolvimento local: use `ngrok` ou similar
4. Selecione os eventos a serem ouvidos:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
5. Copie o **Signing secret** e adicione ao `.env` como `STRIPE_WEBHOOK_SECRET`

## Passo 7: Testar a integração
1. Execute as migrações: `php artisan migrate`
2. Inicie o servidor: `npm run dev` e `php artisan serve`
3. Teste o fluxo completo:
   - Cadastre um usuário
   - Faça login
   - Clique em "Assinar" em algum plano
   - Use o cartão de teste do Stripe: `4242 4242 4242 4242`
   - Verifique se o usuário é atualizado no banco de dados

## Cartões de teste do Stripe
- **Cartão válido:** `4242 4242 4242 4242`
- **Data de expiração:** Qualquer data futura
- **CVC:** Qualquer 3 dígitos
- **CEP:** Qualquer 5 dígitos

## Solução de problemas

### Erro: "Plano não configurado"
Verifique se os Price IDs no `stripePlans.js` estão corretos.

### Erro: "Invalid API Key"
Verifique se as chaves no `.env` estão corretas e se o modo de teste está ativo.

### Webhook não funcionando
1. Verifique se a URL do webhook está acessível publicamente
2. Use `ngrok` para desenvolvimento local: `ngrok http 8000`
3. Atualize a URL no painel do Stripe

### Usuário não é atualizado após pagamento
1. Verifique os logs do webhook no painel do Stripe
2. Verifique se o webhook está configurado corretamente
3. Verifique se o usuário tem o email correto no banco de dados

## Migração para produção
1. Altere para modo **Live** no painel do Stripe
2. Atualize as chaves no `.env` para as chaves de produção
3. Configure webhooks de produção
4. Teste com cartões reais em modo sandbox primeiro

## Recursos úteis
- [Documentação do Stripe PHP](https://stripe.com/docs/api?lang=php)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks do Stripe](https://stripe.com/docs/webhooks)