import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";

export async function SubscriptionRenewHandler(ctx: Context<BlankEnv, string, BlankInput>) {
    console.info("[INFO] Subscription Renew succeeded")
    console.info(await ctx.req.json())
    return ctx.json({ message: 'Subscription Renew succeeded' })
}