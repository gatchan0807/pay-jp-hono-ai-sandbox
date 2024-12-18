import { Hono } from 'hono'

import { renderer } from './renderer'
import { useCredentials } from './hooks/useCredentials'
import { getSubscription } from './hooks/fetchPayJp'
import { getSignedCookie } from 'hono/cookie'
import { env } from 'hono/adapter'
import { PremiumRequiredPage } from './pages/ai/premium-required'
import OpenAI from 'openai'
import { streamSSE } from 'hono/streaming'
import { OpenAIPremiumPrompt } from './prompts/openai'
import { RenderingClientComponent } from './csr/utils/client-component'

import { TopHandler } from './routes/top'
import { PaymentHandler } from './routes/payment'
import { PaymentCancelHandler } from './routes/payment/cancel'

const app = new Hono()

app.use(renderer)

app.get('/', TopHandler)
app.post('/payment', PaymentHandler)
app.get('/payment/cancel', PaymentCancelHandler)


app.get('/ai/premium-required', async (c) => {
  return c.render(<PremiumRequiredPage />)
})

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


// --- CSR ---
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

  return RenderingClientComponent(c, { dev: "/src/csr/pages/ai-premium.tsx", prd: "/static/ai/premium.js" })
})


app.get('/ai/limited', (c) => {
  return RenderingClientComponent(c, { dev: "/src/csr/pages/ai.tsx", prd: "/static/ai/limited.js" })
})

export default app