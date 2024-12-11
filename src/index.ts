import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello/:name', (c) => {
  return c.text(`Hello ${c.req.param("name")}!`)
})

export default app
