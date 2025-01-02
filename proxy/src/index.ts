import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { EventDivider } from './event-divider'
import { PayJpEvent, EventType } from './types'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'Server is running.' })
})

app.post('/webhook', async (c) => {
  const body = await c.req.json() as PayJpEvent
  const payjpWebhookToken = c.req.header('X-Payjp-Webhook-Token')

  const storedToken = env<{ PAYJP_WEBHOOK_TOKEN: string }>(c)

  if (payjpWebhookToken !== storedToken.PAYJP_WEBHOOK_TOKEN) {
    console.log('Invalid token: ', payjpWebhookToken);
    return c.json({ error: 'Invalid token' }, { status: 401 })
  }

  EventDivider(body.type as EventType, body.data)

  return c.json(body)
})

export default app
