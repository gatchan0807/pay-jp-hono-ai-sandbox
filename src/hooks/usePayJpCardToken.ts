import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";

export async function usePayJpCardToken(ctx: Context<BlankEnv, string, BlankInput>) {
    const body = await ctx.req.parseBody()
    const token = body["payjp-token"] // PAY.JPから提供される JS でできるUIのPOST時のデフォルト値

    if (!token || typeof token !== "string") {
        return { token: null, error: ctx.render("Token not found") }
    }

    return { token, error: null }
}