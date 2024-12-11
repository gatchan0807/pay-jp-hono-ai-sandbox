import { Hono } from 'hono'
import { renderer } from './renderer'
import { TopPage } from './page/top'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<TopPage />)
})

app.post('/pay', async (c) => {
  const body = await c.req.parseBody()
  const token = body["payjp-token"] // PAY.JPから提供される JS でできるUIのPOST時のデフォルト値
  return c.render(`Payment completed! ${token}`)
})

app.get('/hello/:name', (c) => {
  return c.text(`Hello ${c.req.param("name")}!`)
})

export default app
