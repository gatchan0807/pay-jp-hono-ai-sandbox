// @see: https://pay.jp/docs/api/#event%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88
export type PayJpEvent = {
    object: "event",
    id: string,
    livemode: boolean,
    created: number,
    type: EventType,
    pending_webhooks: number,
    data: unknown,
}

// @see: https://pay.jp/docs/api/#%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%81%A8webhook
export const EVENT_TYPE = [
    "charge.succeeded", // 支払いの成功
    "charge.failed", // 支払いの失敗
    "charge.updated", // 支払いの更新
    "charge.refunded", // 支払いの返金
    "charge.captured", // 支払いの確定
    "dispute.created", // チャージバック発生
    "token.created", // トークンの作成
    "customer.created", // 顧客の作成
    "customer.updated", // 顧客の更新
    "customer.deleted", // 顧客の削除
    "customer.card.created", // 顧客のカード作成
    "customer.card.updated", // 顧客のカード更新
    "customer.card.deleted", // 顧客のカード削除
    "plan.created", // プランの作成
    "plan.updated", // プランの更新
    "plan.deleted", // プランの削除
    "subscription.created", // 定期課金の作成
    "subscription.updated", // 定期課金の更新
    "subscription.deleted", // 定期課金の削除
    "subscription.paused", // 定期課金の停止
    "subscription.resumed", // 定期課金の再開
    "subscription.canceled", // 定期課金のキャンセル
    "subscription.renewed", // 定期課金の期間更新
    "transfer.succeeded", // 入金内容の確定 (通常加盟店、プラットフォーマー)
    "tenant.created", // テナント作成(PAY.JP Platformのみ)
    "tenant.deleted", // テナント削除(PAY.JP Platformのみ)
    "tenant.updated", // テナント情報の更新、本番申請(初回・更新含む)、弊社による審査結果反映(PAY.JP Platformのみ)
    "tenant_transfer.succeeded", // テナントの入金内容の確定(PAY.JP Platformのみ)
    "term.created", // 区間の作成
    "term.closed", // 区間の売上締め処理が終了
    "statement.created", // 取引明細の作成
    "balance.created", // 残高の作成
    "balance.fixed", // 残高が振込もしくは請求に確定した
    "balance.closed", // 残高の精算が完了
    "balance.merged", // 残高がマージされた
] as const
export type EventType = typeof EVENT_TYPE[number]