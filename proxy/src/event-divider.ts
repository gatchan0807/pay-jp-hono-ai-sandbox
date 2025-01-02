import { EventType } from "./types"

export function EventDivider(event: EventType, data: unknown) {
    switch (event) {
        case "subscription.created":
            console.log("Subscription created", data)
            break
        default:
            console.log("Unknown event", event, data)
            break
    }
}