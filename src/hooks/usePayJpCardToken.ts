import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { ClientError } from "../pages/error";

export async function usePayJpCardToken(ctx: Context<BlankEnv, string, BlankInput>) {
    const body = await ctx.req.parseBody()
    const token = body["payjp-token"] // PAY.JPから提供される JS でできるUIのPOST時のデフォルト値

    if (!token || typeof token !== "string") {
        return { token: null, error: ClientError(ctx, {message: "Token not found", code: 401}) }
    }

    return { token, error: null }
}