import { Hono } from 'hono'
import { renderer } from './renderer'

import { TopHandler } from './routes/top'
import { PaymentHandler } from './routes/payment'
import { PaymentCancelHandler } from './routes/payment/cancel'
import { AiPremiumHandler } from './routes/ai/premium'
import { AiPremiumOpenaiHandler } from './routes/api/premium-openai'
import { AiPremiumRequiredHandler } from './routes/ai/premium-required'
import { AiLimitedHandler } from './routes/ai/limited'
import { ChargeHandler } from './routes/api/charge'
import { SubscriptionRenewHandler } from './routes/api/subscription-renew'

const app = new Hono()

app.use(renderer)

app.get('/', TopHandler)
app.post('/payment', PaymentHandler)
app.get('/payment/cancel', PaymentCancelHandler)
app.get('/ai/premium-required', AiPremiumRequiredHandler)
app.get('/ai/premium', AiPremiumHandler) // CSR
app.get('/ai/limited', AiLimitedHandler) // CSR

app.post('/api/charge', ChargeHandler)
app.post('/api/subscription/renew', SubscriptionRenewHandler)
const openaiRoute = app.get('/api/ai/premium/openai', AiPremiumOpenaiHandler)
export type OpenAIAppType = typeof openaiRoute // note: CSRされたコンポーネントのfetchをRPCでサポートするためにエクスポートしている

export default app