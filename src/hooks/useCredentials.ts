import { env } from "hono/adapter"
import { Context } from "hono"
import { BlankEnv, BlankInput } from "hono/types"
import { ServerError } from "../pages/error"

export function useCredentials(ctx: Context<BlankEnv, string, BlankInput>) {
    const { PAYJP_SECRET_KEY } = env<{ PAYJP_SECRET_KEY: string }>(ctx)
    if (PAYJP_SECRET_KEY === "") {
        return { credentials: null, error: ServerError(ctx, { message: "PAYJP_SECRET_KEY not found", code: 500 }) }
    }

    return { credentials: Buffer.from(`${PAYJP_SECRET_KEY}:`).toString("base64"), error: null }
}