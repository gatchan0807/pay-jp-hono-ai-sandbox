import { env } from "hono/adapter"
import { Context } from "hono"
import { BlankEnv, BlankInput } from "hono/types"

export function useCredentials(ctx: Context<BlankEnv, string, BlankInput>) {
    const { PAYJP_SECRET_KEY } = env<{ PAYJP_SECRET_KEY: string }>(ctx)
    if (PAYJP_SECRET_KEY === "") {
        return { credentials: null, error: ctx.render("PAYJP_SECRET_KEY is not found") }
    }

    return { credentials: Buffer.from(`${PAYJP_SECRET_KEY}:`).toString("base64"), error: null }
}