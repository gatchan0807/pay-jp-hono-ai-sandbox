import { Context } from "hono";

export async function SubscriptionRenewHandler(ctx: Context) {
    const body = await ctx.req.json();
    console.info("[INFO] Subscription Renew succeeded")
    console.info(body)

    const {
        id: eventId,
        type: eventType,
        description: eventDescription,
        livemode: eventLivemode,
        object: eventObject,
        created: eventCreated,
        pending_webhooks: eventPendingWebhooks
    } = body;

    const {
        id: subscriptionId,
        plan: { id: planId },
        start: subscriptionStart,
        object: subscriptionObject,
        status: subscriptionStatus,
        created: subscriptionCreated,
        prorate: subscriptionProrate,
        customer: subscriptionCustomer,
        livemode: subscriptionLivemode,
        paused_at: subscriptionPausedAt,
        trial_end: subscriptionTrialEnd,
        resumed_at: subscriptionResumedAt,
        canceled_at: subscriptionCanceledAt,
        trial_start: subscriptionTrialStart,
        current_period_end: subscriptionCurrentPeriodEnd,
        current_period_start: subscriptionCurrentPeriodStart
    } = body.data;

    try {
        // subscriptions テーブルへのデータ挿入
        await ctx.env.DB.prepare(
            `INSERT INTO subscriptions (
          id, plan_id, start, object, status, created, prorate, customer, livemode,
          paused_at, trial_end, resumed_at, canceled_at, trial_start,
          current_period_end, current_period_start
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
            .bind(
                subscriptionId ?? null,
                planId ?? null, // planId をバインド
                subscriptionStart ?? null,
                subscriptionObject ?? null,
                subscriptionStatus ?? null,
                subscriptionCreated ?? null,
                subscriptionProrate ?? null,
                subscriptionCustomer ?? null,
                subscriptionLivemode ?? null,
                subscriptionPausedAt ?? null,
                subscriptionTrialEnd ?? null,
                subscriptionResumedAt ?? null,
                subscriptionCanceledAt ?? null,
                subscriptionTrialStart ?? null,
                subscriptionCurrentPeriodEnd ?? null,
                subscriptionCurrentPeriodStart ?? null
            )
            .run();

        // events テーブルへのデータ挿入
        await ctx.env.DB.prepare(
            `INSERT INTO events (
          id, type, description, livemode, object, created, pending_webhooks, subscription_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
            .bind(
                eventId ?? null,
                eventType ?? null,
                eventDescription ?? null,
                eventLivemode ?? null,
                eventObject ?? null,
                eventCreated ?? null,
                eventPendingWebhooks ?? null,
                subscriptionId ?? null
            )
            .run();

        console.info("[INFO] Subscription Renew Register succeeded")
        return ctx.json({ message: 'Subscription Renew succeeded' })
    } catch (error) {
        console.error(error);
        return ctx.json({ error: 'Failed to insert data' }, 500);
    }
}