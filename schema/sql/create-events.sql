-- events テーブル
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    type TEXT,
    description TEXT,
    livemode BOOLEAN,
    object TEXT,
    created INTEGER,
    pending_webhooks INTEGER,
    subscription_id TEXT, -- subscriptions テーブルへの外部キー
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);
