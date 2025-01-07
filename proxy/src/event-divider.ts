import { Context } from "hono"
import { BlankEnv, BlankInput } from "hono/types"

import { EventType } from "./types"
import { fetchSubscriptionRenewed } from "./internal-api-client"

export async function EventDivider(event: EventType, data: unknown, ctx: Context<BlankEnv, string, BlankInput>) {
    switch (event) {
        case "subscription.created":
            console.log("Subscription created", data)
            break
        case "subscription.renewed":
            console.log("Subscription renewed", data)
            await fetchSubscriptionRenewed(data, ctx)
            break
        case "charge.succeeded":
            console.log("Charge succeeded", data)
            break
        case "charge.failed":
            console.log("Charge failed", data)
            break
        default:
            console.log("Unknown event", event, data)
            break
    }
}