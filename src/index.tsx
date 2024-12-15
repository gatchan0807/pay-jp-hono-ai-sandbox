import { Hono } from 'hono'

import { renderer } from './renderer'
import { TopPage } from './page/top'
import { useCredentials } from './hooks/useCredentials'
import { usePayJpCardToken } from './hooks/usePayJpCardToken'
import { createCustomer, createSubscription } from './hooks/fetchPayJp'
import { ConfirmedPage } from './page/subscription/confirmed'
import { getSignedCookie, setSignedCookie } from 'hono/cookie'
import { env } from 'hono/adapter'

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
