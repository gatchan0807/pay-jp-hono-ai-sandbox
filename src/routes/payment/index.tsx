import { Context } from "hono"
import { env } from "hono/adapter"
import { setSignedCookie } from "hono/cookie"
import { BlankEnv, BlankInput } from "hono/types"
import { createCustomer, createSubscription } from "../../hooks/fetchPayJp"
import { useCredentials } from "../../hooks/useCredentials"
import { usePayJpCardToken } from "../../hooks/usePayJpCardToken"
import { ConfirmedPage } from "../../pages/subscription/confirmed"

export const PaymentHandler = async (ctx: Context<BlankEnv, string, BlankInput>) => {
    const { credentials, error: credentialError } = useCredentials(ctx)
    if (credentialError) {
        return credentialError
    }

    const { token, error: tokenError } = await usePayJpCardToken(ctx)
    if (tokenError) {
        return tokenError
    }

    const { customer, error: customerFetchError } = await createCustomer(ctx, credentials, token)
    if (customerFetchError) {
        return customerFetchError
    }

    const { subscription, error: subscriptionFetchError } = await createSubscription(ctx, credentials, customer.id)
    if (subscriptionFetchError) {
        return subscriptionFetchError
    }

    const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(ctx)
    await setSignedCookie(ctx, 'customer_id', customer.id, COOKIE_SECRET) // todo: prefix: 'secure' をつける
    await setSignedCookie(ctx, 'subscription_id', subscription.id, COOKIE_SECRET) // todo: prefix: 'secure' をつける
    await setSignedCookie(ctx, 'plan_id', subscription.plan.id, COOKIE_SECRET) // todo: prefix: 'secure' をつける

    return ctx.render(<ConfirmedPage subscription={subscription} />)
}