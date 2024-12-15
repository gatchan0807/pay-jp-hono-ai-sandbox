import { Hono } from 'hono'

import { renderer } from './renderer'
import { TopPage } from './page/top'
import { useCredentials } from './hooks/useCredentials'
import { usePayJpCardToken } from './hooks/usePayJpCardToken'
import { createCustomer, createSubscription } from './hooks/fetchPayJp'
import { ConfirmedPage } from './page/subscription/confirmed'
import { setSignedCookie } from 'hono/cookie'
import { env } from 'hono/adapter'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<TopPage />)
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

  return c.render(`Subscription Created! ${JSON.stringify(subscription.id)}`)
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
