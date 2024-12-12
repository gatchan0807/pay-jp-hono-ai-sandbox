// @see: https://pay.jp/docs/api

export type ErrorResponse = {
    error: {
        code: string,
        message: string,
        param: string,
        status: number,
        type: string,
    }
}

export type CustomerResponse = {
    created: number,
    description: string | null,
    email: string | null,
    id: string,
    livemode: boolean,
    object: "customer",
}

export type SubscriptionResponse = {
    canceled_at: number | null,
    created: number,
    current_period_end: number,
    current_period_start: number,
    customer: CustomerResponse['id'],
    id: string,
    livemode: number,
    metadata: unknown | null,
    next_cycle_plan: PlanResponse | null, // 次回課金時からプランが変わる場合のみ中身が入る
    object: "subscription",
    paused_at: number | null,
    plan: PlanResponse
    resumed_at: number | null,
    start: number,
    status: 'trial' | 'active' | 'canceled' | 'paused',
    trial_end: number | null,
    trial_start: number | null,
    prorate: boolean
}

export type PlanResponse = {
    amount: number,
    billing_day: number | null,
    created: number,
    currency: "jpy", // 今は日本円のみらしい
    id: string,
    interval: "month" | "year",
    livemode: boolean,
    metadata: unknown | null,
    name: string,
    object: "plan",
    trial_days: number
}