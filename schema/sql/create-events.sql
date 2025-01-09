CREATE TABLE events (
    id TEXT PRIMARY KEY,
    type TEXT,
    description TEXT,
    livemode BOOLEAN,
    object TEXT,
    created INTEGER,
    pending_webhooks INTEGER,
    subscription_id TEXT, -- subscriptions テーブルへの外部キー (subscription関連イベントの場合のみ使用)
    charge_id TEXT, -- charges テーブルへの外部キー (charge関連イベントの場合のみ使用)
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
    FOREIGN KEY (charge_id) REFERENCES charges(id)
);