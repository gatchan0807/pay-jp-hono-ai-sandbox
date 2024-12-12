import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { CustomerResponse, ErrorResponse } from "../types/payjp";
import { ClientError, ServerError } from "../page/error";

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


    if ("error" in customer && customer.error.type === "client_error") {
        return { customer: null, error: ClientError(ctx, { message: customer.error.message, code: customer.error.code }) }
    }
    
    if ("error" in customer && customer.error.type === "server_error") {
        return { customer: null, error: ServerError(ctx, { message: customer.error.message, code: customer.error.code }) }
    }

    if ("error" in customer) {
        return { customer: null, error: ServerError(ctx, { message: "Unknown error", code: 500 }) }
    }

    return { customer, error: null }
}