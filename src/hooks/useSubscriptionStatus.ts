import { Cookie } from "../pages/top"
import { getSubscription } from "./fetchPayJp"


export async function useSubscriptionStatus(
    cookie: Cookie, credentials: string) {
    if (!cookie.customerId || !cookie.subscriptionId || !cookie.planId) {
        return { status: 'guest', plan: null }
    }

    const { subscription, error } = await getSubscription(credentials, cookie.subscriptionId)
    if (error) {
        return { status: 'inactive', plan: null }
    }

    if ("error" in subscription) {
        return { status: 'inactive', plan: null }
    }

    return { status: 'active', plan: subscription.plan }
}