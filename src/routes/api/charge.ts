import { Context } from "hono";

export async function ChargeHandler(ctx: Context) {
    const body = await ctx.req.json();
    console.info("[INFO] Charge succeeded")
    console.info(body)

    const {
        id: eventId,
        type: eventType,
        description: eventDescription,
        livemode: eventLivemode,
        object: eventObject,
        created: eventCreated,
        pending_webhooks: eventPendingWebhooks,
        data: {
            id: chargeId,
            card: {
                id: cardId,
                name: cardName,
                brand: cardBrand,
                email: cardEmail,
                last4: cardLast4,
                phone: cardPhone,
                object: cardObject,
                country: cardCountry,
                created: cardCreated,
                customer: cardCustomer,
                exp_year: cardExpYear,
                livemode: cardLivemode,
                cvc_check: cardCvcCheck,
                exp_month: cardExpMonth,
                address_zip: cardAddressZip,
                fingerprint: cardFingerprint,
                address_city: cardAddressCity,
                address_line1: cardAddressLine1,
                address_line2: cardAddressLine2,
                address_state: cardAddressState,
                address_zip_check: cardAddressZipCheck,
                three_d_secure_status: cardThreeDSecureStatus,
            },
            paid: chargePaid,
            amount: chargeAmount,
            object: chargeObject,
            created: chargeCreated,
            term_id: chargeTermId,
            captured: chargeCaptured,
            currency: chargeCurrency,
            customer: chargeCustomer,
            fee_rate: chargeFeeRate,
            livemode: chargeLivemode,
            refunded: chargeRefunded,
            expired_at: chargeExpiredAt,
            captured_at: chargeCapturedAt,
            description: chargeDescription,
            failure_code: chargeFailureCode,
            subscription: chargeSubscription,
            refund_reason: chargeRefundReason,
            amount_refunded: chargeAmountRefunded,
            failure_message: chargeFailureMessage,
            three_d_secure_status: chargeThreeDSecureStatus,
        },
    } = body;

    try {
        // cards テーブルへのデータ挿入
        await ctx.env.DB.prepare(
            `INSERT INTO cards (
            id, name, brand, email, last4, phone, object, country, created, customer, exp_year, livemode,
            cvc_check, exp_month, address_zip, fingerprint, address_city,
            address_line1, address_line2, address_state, address_zip_check,
            three_d_secure_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
            .bind(
                cardId ?? null,
                cardName ?? null,
                cardBrand ?? null,
                cardEmail ?? null,
                cardLast4 ?? null,
                cardPhone ?? null,
                cardObject ?? null,
                cardCountry ?? null,
                cardCreated ?? null,
                cardCustomer ?? null,
                cardExpYear ?? null,
                cardLivemode ?? null,
                cardCvcCheck ?? null,
                cardExpMonth ?? null,
                cardAddressZip ?? null,
                cardFingerprint ?? null,
                cardAddressCity ?? null,
                cardAddressLine1 ?? null,
                cardAddressLine2 ?? null,
                cardAddressState ?? null,
                cardAddressZipCheck ?? null,
                cardThreeDSecureStatus ?? null
            )
            .run();

        // charges テーブルへのデータ挿入
        await ctx.env.DB.prepare(
            `INSERT INTO charges (
            id, card_id, paid, amount, object, created, term_id, captured,
            currency, customer, fee_rate, livemode, refunded,
            expired_at, captured_at, description, failure_code, subscription,
            refund_reason, amount_refunded, failure_message, three_d_secure_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
            .bind(
                chargeId ?? null,
                cardId ?? null,
                chargePaid ?? null,
                chargeAmount ?? null,
                chargeObject ?? null,
                chargeCreated ?? null,
                chargeTermId ?? null,
                chargeCaptured ?? null,
                chargeCurrency ?? null,
                chargeCustomer ?? null,
                chargeFeeRate ?? null,
                chargeLivemode ?? null,
                chargeRefunded ?? null,
                chargeExpiredAt ?? null,
                chargeCapturedAt ?? null,
                chargeDescription ?? null,
                chargeFailureCode ?? null,
                chargeSubscription ?? null,
                chargeRefundReason ?? null,
                chargeAmountRefunded ?? null,
                chargeFailureMessage ?? null,
                chargeThreeDSecureStatus ?? null
            )
            .run();

        // events テーブルへのデータ挿入 (charge_id を使用)
        await ctx.env.DB.prepare(
            `INSERT INTO events (
            id, type, description, livemode, object, created, pending_webhooks, charge_id
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
                chargeId ?? null
            )
            .run();
        return ctx.json({ message: 'Charge succeeded' })
    } catch (error) {
        console.error(error);
        return ctx.json({ error: 'Failed to insert data' }, 500);
    }
}