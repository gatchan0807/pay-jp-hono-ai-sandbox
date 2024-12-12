import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { CustomerResponse, ErrorResponse } from "../types/payjp";

export async function createCustomer(
    ctx: Context<BlankEnv, string, BlankInput>,
    credentials: string,
    token: string
) {
    const payload = new URLSearchParams({
        card: token ?? "",
    }).toString();

    const result = await fetch("https://api.pay.jp/v1/customers", {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}:`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload,
    })
    const customer = await result.json<CustomerResponse | ErrorResponse>()

    console.log(customer)

    if ("error" in customer) {
        return { customer: null, error: ctx.render(`Error: ${customer.error.message}`) }
    }

    return { customer, error: null }
}