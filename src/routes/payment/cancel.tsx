import { Context } from "hono"
import { env } from "hono/adapter"
import { getSignedCookie, deleteCookie } from "hono/cookie"
import { BlankEnv, BlankInput } from "hono/types"
import { AttentionBox } from "../../components/box"
import { Container } from "../../components/layout"
import { cancelSubscription } from "../../hooks/fetchPayJp"
import { useCredentials } from "../../hooks/useCredentials"

export const PaymentCancelHandler = async (ctx: Context<BlankEnv, string, BlankInput>) => {
    const { credentials, error: credentialError } = useCredentials(ctx)
    if (credentialError) {
        return credentialError
    }
    const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(ctx)
    const subscriptionId = await getSignedCookie(ctx, COOKIE_SECRET, 'subscription_id') ?? '' // todo: 'secure' をつける

    if (!subscriptionId) {
        return ctx.render(<Container><AttentionBox type='error'>サブスクリプションが見つかりませんでした。</AttentionBox></Container>)
    }

    const { subscription, error } = await cancelSubscription(credentials, subscriptionId)
    if (error) {
        return ctx.render(<Container><AttentionBox type='error'>サブスクリプションのキャンセルに失敗しました。</AttentionBox></Container>)
    }

    if ("error" in subscription) {
        return ctx.render(<Container><AttentionBox type='error'>サブスクリプションのキャンセルに失敗しました。</AttentionBox></Container>)
    }

    console.log("subscription canceled: ", subscription.id, 'plan:', subscription.plan.id, 'customer:', subscription.customer);

    deleteCookie(ctx, 'customer_id')
    deleteCookie(ctx, 'subscription_id')
    deleteCookie(ctx, 'plan_id')

    return ctx.redirect('/')
}