import { Hono } from 'hono'
import { env } from 'hono/adapter'

import { renderer } from './renderer'
import { TopPage } from './page/top'
import { CustomerResponse, ErrorResponse } from './types/payjp'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<TopPage />)
})

app.post('/payment', async (c) => {
  const body = await c.req.parseBody()
  const token = body["payjp-token"] // PAY.JPから提供される JS でできるUIのPOST時のデフォルト値
  if (!token) {
    return c.render("Token not found")
  }

  if (typeof token !== "string") {
    return c.render("Token is not string")
  }

  const { PAYJP_SECRET_KEY } = env<{ PAYJP_SECRET_KEY: string }>(c)
  if (PAYJP_SECRET_KEY === "") {
    return c.render("PAYJP_SECRET_KEY is not found")
  }

  const encodedCredentials = Buffer.from(`${PAYJP_SECRET_KEY}:`).toString("base64")

  const params = new URLSearchParams({
    card: token,
  });
  const formData = params.toString(); 

  const customer = await fetch("https://api.pay.jp/v1/customers", {
    method: "POST",
    
    headers: {
      Authorization: `Basic ${encodedCredentials}:`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  })
  const customerJson = await customer.json<CustomerResponse | ErrorResponse>()
  
  console.log(customerJson)

  if ("error" in customerJson) {
    return c.render(`Error: ${customerJson.error.message}`)
  }

  return c.render(`Customer Created! ${JSON.stringify(customerJson.id)}`)
})

export default app
