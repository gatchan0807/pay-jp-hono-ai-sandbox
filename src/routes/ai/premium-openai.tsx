import OpenAI from "openai"

import { Context } from "hono"
import { env } from "hono/adapter"
import { getSignedCookie } from "hono/cookie"
import { streamSSE } from "hono/streaming"
import { BlankEnv, BlankInput } from "hono/types"

import { getSubscription } from "../../hooks/fetchPayJp"
import { useCredentials } from "../../hooks/useCredentials"
import { OpenAIPremiumPrompt } from "../../prompts/openai"

export const AiPremiumOpenaiHandler = async (ctx: Context<BlankEnv, string, BlankInput>) => {
    const { credentials, error: credentialError } = useCredentials(ctx)
    if (credentialError) {
        return credentialError
    }

    const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(ctx)
    const subscriptionId = await getSignedCookie(ctx, COOKIE_SECRET, 'subscription_id') ?? '' // todo: 'secure' をつける

    if (!subscriptionId) {
        return ctx.json({ error: 'subscription_id is not found' }, 400)
    }

    const { subscription, error } = await getSubscription(credentials, subscriptionId)
    if (error) {
        return ctx.json({ error: 'subscription fetch failed' }, 500)
    }

    if ("error" in subscription) {
        return ctx.json({ error: 'subscription fetch failed' }, 500)
    }

    const { OPENAI_API_KEY } = env<{ OPENAI_API_KEY: string }>(ctx)
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY })
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: OpenAIPremiumPrompt(),
        stream: true,
    });

    return streamSSE(ctx, async (stream) => {
        for await (const chunk of completion) {
            await stream.write(chunk.choices[0]?.delta.content ?? '')
        }
    })
}