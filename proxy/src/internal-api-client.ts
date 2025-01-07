import { Context } from "hono";
import { env } from "hono/adapter";
import { BlankEnv, BlankInput } from "hono/types";

export async function fetchSubscriptionRenewed(data: unknown, ctx: Context<BlankEnv, string, BlankInput>) {
    const { APPLICATION_HOST: host } = env<{ APPLICATION_HOST: string }>(ctx)
    const res = await fetch(`${host}/api/subscription/renew`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // STG環境などで必要なら Authorization ヘッダを付与する
        },
        body: JSON.stringify({ data }),
    })
    console.info("[INFO] Subscription Renewed API response");
    console.info("[INFO] Response: ", await res.json());
}