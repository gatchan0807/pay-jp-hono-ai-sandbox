import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";

export async function ChargeHandler(ctx: Context<BlankEnv, string, BlankInput>) {
    console.info("[INFO] Charge succeeded")
    console.info(await ctx.req.json())
    return ctx.json({ message: 'Charge succeeded' })
}