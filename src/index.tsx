import { Hono } from 'hono'

import { renderer } from './renderer'
import { useCredentials } from './hooks/useCredentials'
import { getSubscription } from './hooks/fetchPayJp'
import { getSignedCookie } from 'hono/cookie'
import { env } from 'hono/adapter'
import OpenAI from 'openai'
import { streamSSE } from 'hono/streaming'
import { OpenAIPremiumPrompt } from './prompts/openai'

import { TopHandler } from './routes/top'
import { PaymentHandler } from './routes/payment'
import { PaymentCancelHandler } from './routes/payment/cancel'
import { AiPremiumRequiredHandler } from './routes/ai/premium-required'
import { AiPremiumHandler } from './routes/ai/premium'
import { AiLimitedHandler } from './routes/ai/limited'

const app = new Hono()

app.use(renderer)

app.get('/', TopHandler)
app.post('/payment', PaymentHandler)
app.get('/payment/cancel', PaymentCancelHandler)
app.get('/ai/premium-required', AiPremiumRequiredHandler)
app.get('/ai/premium', AiPremiumHandler) // CSR
app.get('/ai/limited', AiLimitedHandler) // CSR

const openaiRoute = app.get('/ai/premium/openai', async (c) => {
  const { credentials, error: credentialError } = useCredentials(c)
  if (credentialError) {
    return credentialError
  }

  const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(c)
  const subscriptionId = await getSignedCookie(c, COOKIE_SECRET, 'subscription_id') ?? '' // todo: 'secure' をつける

  if (!subscriptionId) {
    return c.json({ error: 'subscription_id is not found' }, 400)
  }

  const { subscription, error } = await getSubscription(credentials, subscriptionId)
  if (error) {
    return c.json({ error: 'subscription fetch failed' }, 500)
  }

  if ("error" in subscription) {
    return c.json({ error: 'subscription fetch failed' }, 500)
  }

  const { OPENAI_API_KEY } = env<{ OPENAI_API_KEY: string }>(c)
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY })
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: OpenAIPremiumPrompt(),
    stream: true,
  });

  return streamSSE(c, async (stream) => {
    for await (const chunk of completion) {
      await stream.write(chunk.choices[0]?.delta.content ?? '')
    }
  })
})
// note: CSRされたコンポーネントのfetchをRPCでサポートするためにエクスポートしている
export type OpenAIAppType = typeof openaiRoute

export default app