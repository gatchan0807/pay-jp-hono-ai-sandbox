import { EventType } from "./types"

export function EventDivider(event: EventType, data: unknown) {
    switch (event) {
        case "subscription.created":
            console.log("Subscription created", data)
            break
        case "subscription.renewed":
            console.log("Subscription renewed", data)
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