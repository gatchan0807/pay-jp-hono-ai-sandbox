-- subscriptions テーブル
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    plan_id TEXT,
    start INTEGER,
    object TEXT,
    status TEXT,
    created INTEGER,
    prorate BOOLEAN,
    customer TEXT,
    livemode BOOLEAN,
    paused_at INTEGER,
    trial_end INTEGER,
    resumed_at INTEGER,
    canceled_at INTEGER,
    trial_start INTEGER,
    current_period_end INTEGER,
    current_period_start INTEGER
);