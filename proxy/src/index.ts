import { Hono } from 'hono'
import { env } from 'hono/adapter'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/webhook', async (c) => {
  const body = await c.req.json()
  const payjpToken = c.req.header('X-Payjp-Webhook-Token')

  const storedToken = env<{ PAYJP_WEBHOOK_TOKEN: string }>(c)

  if (payjpToken !== storedToken.PAYJP_WEBHOOK_TOKEN) {
    return c.json({ error: 'Invalid token' }, { status: 401 })
  }

  return c.json(body)
})

export default app
