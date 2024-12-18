import { Context } from "hono"
import { env } from "hono/adapter"
import { getSignedCookie } from "hono/cookie"
import { BlankEnv, BlankInput } from "hono/types"

import { useCredentials } from "../hooks/useCredentials"
import { TopPage } from "../pages/top"

export const TopHandler = async (ctx: Context<BlankEnv, string, BlankInput>) => {
    const { credentials, error: credentialError } = useCredentials(ctx)
    if (credentialError) {
        return credentialError
    }

    const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(ctx)
    const customerId = await getSignedCookie(ctx, COOKIE_SECRET, 'customer_id') ?? '' // todo: 'secure' をつける
    const subscriptionId = await getSignedCookie(ctx, COOKIE_SECRET, 'subscription_id') ?? '' // todo: 'secure' をつける
    const planId = await getSignedCookie(ctx, COOKIE_SECRET, 'plan_id') ?? '' // todo: 'secure' をつける

    return ctx.render(<TopPage cookie={{ customerId, subscriptionId, planId }} credentials={credentials} />)
}
