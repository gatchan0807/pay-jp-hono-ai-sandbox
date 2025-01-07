import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { EventDivider } from './event-divider'
import { PayJpEvent } from './types'

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

  try {
    await EventDivider(body.type, body.data, c)
  } catch (e) {
    console.error('Error in EventDivider', e)
    return c.json({ error: 'Error in EventDivider' }, { status: 500 })
  }

  return c.json(body)
})

export default app
