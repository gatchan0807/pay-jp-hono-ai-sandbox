import { Context } from "hono"
import { env } from "hono/adapter"
import { getSignedCookie, deleteCookie } from "hono/cookie"
import { BlankEnv, BlankInput } from "hono/types"
import { AttentionBox } from "../../components/box"
import { Container, Layout } from "../../components/layout"
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
        return ctx.render(ErrorPage("サブスクリプションが見つかりませんでした。"))
    }

    const { subscription, error } = await cancelSubscription(credentials, subscriptionId)
    if (error) {
        return ctx.render(ErrorPage("サブスクリプションのキャンセルに失敗しました"))
    }

    if ("error" in subscription) {
        return ctx.render(ErrorPage("サブスクリプションのキャンセルに失敗しました"))
    }

    console.log("subscription canceled: ", subscription.id, 'plan:', subscription.plan.id, 'customer:', subscription.customer);

    deleteCookie(ctx, 'customer_id')
    deleteCookie(ctx, 'subscription_id')
    deleteCookie(ctx, 'plan_id')

    return ctx.redirect('/')
}

function ErrorPage(text: string) {
    return (
        <Layout>
            <Container>
                <AttentionBox type='error'>{text}</AttentionBox>
            </Container>
        </Layout>
    )
}