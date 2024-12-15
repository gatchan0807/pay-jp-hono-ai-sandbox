import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { CustomerResponse, ErrorResponse, SubscriptionResponse } from "../types/payjp";
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

    if ("error" in customer && customer.error.type === "auth_error") {
        return { customer: null, error: ServerError(ctx, { message: "Internal Server Error", code: 500 }) }
    }

    if ("error" in customer) {
        return { customer: null, error: ServerError(ctx, { message: "Unknown error", code: 500 }) }
    }

    return { customer, error: null }
}

export async function createSubscription(
    ctx: Context<BlankEnv, string, BlankInput>,
    credentials: string,
    customerId: string
) {
    const payload = new URLSearchParams({
        customer: customerId,
        plan: "test-gatchan-ai-premium",
    }).toString();

    const result = await fetch("https://api.pay.jp/v1/subscriptions", {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}:`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload,
    })

    const subscription = await result.json<SubscriptionResponse | ErrorResponse>()

    console.log(subscription)

    if ("error" in subscription && subscription.error.type === "client_error") {
        return { subscription: null, error: ClientError(ctx, { message: subscription.error.message, code: subscription.error.code }) }
    }
    if ("error" in subscription && subscription.error.type === "server_error") {
        return { subscription: null, error: ServerError(ctx, { message: subscription.error.message, code: subscription.error.code }) }
    }
    if ("error" in subscription) {
        return { subscription: null, error: ServerError(ctx, { message: "Unknown error", code: 500 }) }
    }

    return { subscription, error: null }
}

export async function getSubscription(
    credentials: string,
    subscriptionId: string
) {
    const result = await fetch(`https://api.pay.jp/v1/subscriptions/${subscriptionId}`, {
        method: "GET",
        headers: {
            Authorization: `Basic ${credentials}:`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })

    const subscription = await result.json<SubscriptionResponse | ErrorResponse>()

    console.log(subscription)

    if ("error" in subscription && subscription.error.type === "client_error") {
        return { subscription: null, error: { message: subscription.error.message, code: subscription.error.code } }
    }

    return { subscription, error: null }
}

export async function cancelSubscription(
    credentials: string,
    subscriptionId: string
) {
    const result = await fetch(`https://api.pay.jp/v1/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}:`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })

    const subscription = await result.json<SubscriptionResponse | ErrorResponse>()

    console.log(subscription)

    if ("error" in subscription && subscription.error.type === "client_error") {
        return { subscription: null, error: { message: subscription.error.message, code: subscription.error.code } }
    }

    return { subscription, error: null }
}