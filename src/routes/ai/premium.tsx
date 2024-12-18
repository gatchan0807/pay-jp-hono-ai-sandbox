import { Context } from "hono"
import { env } from "hono/adapter"
import { getSignedCookie } from "hono/cookie"
import { BlankEnv, BlankInput } from "hono/types"
import { RenderingClientComponent } from "../../csr/utils/client-component"
import { getSubscription } from "../../hooks/fetchPayJp"
import { useCredentials } from "../../hooks/useCredentials"

export const AiPremiumHandler = async (ctx: Context<BlankEnv, string, BlankInput>) => {
    const { credentials, error: credentialError } = useCredentials(ctx)
    if (credentialError) {
        return credentialError
    }

    const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(ctx)
    const subscriptionId = await getSignedCookie(ctx, COOKIE_SECRET, 'subscription_id') ?? '' // todo: 'secure' をつける

    if (!subscriptionId) {
        return ctx.redirect('/ai/premium-required')
    }

    const { subscription, error } = await getSubscription(credentials, subscriptionId)
    if (error) {
        return ctx.redirect('/ai/premium-required')
    }

    if ("error" in subscription) {
        return ctx.redirect('/ai/premium-required')
    }

    return RenderingClientComponent(ctx, { dev: "/src/csr/pages/ai-premium.tsx", prd: "/static/ai/premium.js" })
}