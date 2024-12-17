import { Hono } from 'hono'

import { renderer } from './renderer'
import { TopPage } from './page/top'
import { useCredentials } from './hooks/useCredentials'
import { usePayJpCardToken } from './hooks/usePayJpCardToken'
import { cancelSubscription, createCustomer, createSubscription, getSubscription } from './hooks/fetchPayJp'
import { ConfirmedPage } from './page/subscription/confirmed'
import { deleteCookie, getSignedCookie, setSignedCookie } from 'hono/cookie'
import { env } from 'hono/adapter'
import { AttentionBox, Container } from './components/box'
import { PremiumPage } from './page/ai/premium'
import { PremiumRequiredPage } from './page/ai/premium-required'

const app = new Hono()

app.use(renderer)

app.get('/', async (c) => {
  const { credentials, error: credentialError } = useCredentials(c)
  if (credentialError) {
    return credentialError
  }

  const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(c)
  const customerId = await getSignedCookie(c, COOKIE_SECRET, 'customer_id') ?? '' // todo: 'secure' をつける
  const subscriptionId = await getSignedCookie(c, COOKIE_SECRET, 'subscription_id') ?? '' // todo: 'secure' をつける
  const planId = await getSignedCookie(c, COOKIE_SECRET, 'plan_id') ?? '' // todo: 'secure' をつける

  return c.render(<TopPage cookie={{ customerId, subscriptionId, planId }} credentials={credentials} />)
})

app.post('/payment', async (c) => {
  const { credentials, error: credentialError } = useCredentials(c)
  if (credentialError) {
    return credentialError
  }

  const { token, error: tokenError } = await usePayJpCardToken(c)
  if (tokenError) {
    return tokenError
  }

  const { customer, error: customerFetchError } = await createCustomer(c, credentials, token)
  if (customerFetchError) {
    return customerFetchError
  }

  const { subscription, error: subscriptionFetchError } = await createSubscription(c, credentials, customer.id)
  if (subscriptionFetchError) {
    return subscriptionFetchError
  }

  const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(c)
  await setSignedCookie(c, 'customer_id', customer.id, COOKIE_SECRET) // todo: prefix: 'secure' をつける
  await setSignedCookie(c, 'subscription_id', subscription.id, COOKIE_SECRET) // todo: prefix: 'secure' をつける
  await setSignedCookie(c, 'plan_id', subscription.plan.id, COOKIE_SECRET) // todo: prefix: 'secure' をつける

  return c.render(<ConfirmedPage subscription={subscription} />)
})

app.get('/payment/cancel', async (c) => {
  const { credentials, error: credentialError } = useCredentials(c)
  if (credentialError) {
    return credentialError
  }
  const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(c)
  const subscriptionId = await getSignedCookie(c, COOKIE_SECRET, 'subscription_id') ?? '' // todo: 'secure' をつける

  if (!subscriptionId) {
    return c.render(<Container><AttentionBox type='error'>サブスクリプションが見つかりませんでした。</AttentionBox></Container>)
  }

  const { subscription, error } = await cancelSubscription(credentials, subscriptionId)
  if (error) {
    return c.render(<Container><AttentionBox type='error'>サブスクリプションのキャンセルに失敗しました。</AttentionBox></Container>)
  }

  if ("error" in subscription) {
    return c.render(<Container><AttentionBox type='error'>サブスクリプションのキャンセルに失敗しました。</AttentionBox></Container>)
  }

  console.log("subscription canceled: ", subscription.id, 'plan:', subscription.plan.id, 'customer:', subscription.customer);

  deleteCookie(c, 'customer_id')
  deleteCookie(c, 'subscription_id')
  deleteCookie(c, 'plan_id')

  return c.redirect('/')
})

app.get('/ai/premium', async (c) => {
  // TODO: リダイレクトをするかの判定処理はミドルウェアにまとめたい
  const { credentials, error: credentialError } = useCredentials(c)
  if (credentialError) {
    return credentialError
  }

  const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(c)
  const subscriptionId = await getSignedCookie(c, COOKIE_SECRET, 'subscription_id') ?? '' // todo: 'secure' をつける

  if (!subscriptionId) {
    return c.redirect('/ai/premium-required')
  }

  const { subscription, error } = await getSubscription(credentials, subscriptionId)
  if (error) {
    return c.redirect('/ai/premium-required')
  }

  if ("error" in subscription) {
    return c.redirect('/ai/premium-required')
  }

  return c.render(<PremiumPage />)
})

app.get('/ai/premium-required', async (c) => {
  return c.render(<PremiumRequiredPage />)
})

app.get('/ai/limited', (c) => {
  return c.html(
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <script src="https://cdn.tailwindcss.com"></script>
        {import.meta.env.PROD ? (
          <script type="module" src="/static/ai/limited.js"></script>
        ) : (
          <script type="module" src="/src/clients/page/ai.tsx"></script>
        )}
      </head>
      <body>
        <div id="client-ai-page"></div>
      </body>
    </html>
  )
})

export default app
