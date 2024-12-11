import { Hono } from 'hono'
import { renderer } from './renderer'
import { TopPage } from './page/top'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<TopPage />)
})

app.get('/hello/:name', (c) => {
  return c.text(`Hello ${c.req.param("name")}!`)
})

export default app
