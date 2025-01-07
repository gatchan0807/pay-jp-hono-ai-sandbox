import { Context } from "hono"
import { BlankEnv, BlankInput } from "hono/types"

import { EventType } from "./types"
import { fetchSubscriptionRenewed } from "./internal-api-client"

export async function EventDivider(event: EventType, data: unknown, ctx: Context<BlankEnv, string, BlankInput>) {
    switch (event) {
        case "subscription.created":
            console.info("[INFO] EventDivider: Subscription created: ", data)
            break
        case "subscription.renewed":
            console.info("[INFO] EventDivider: Subscription renewed: ", data)
            await fetchSubscriptionRenewed(data, ctx)
            break
        case "charge.succeeded":
            console.info("[INFO] EventDivider: Charge succeeded: ", data)
            break
        case "charge.failed":
            console.info("[INFO] EventDivider: Charge failed: ", data)
            break
        default:
            console.warn("[WARN] EventDivider: Unknown event: ", event, data)
            break
    }
}