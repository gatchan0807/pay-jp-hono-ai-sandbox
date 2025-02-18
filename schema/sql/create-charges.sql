CREATE TABLE charges (
    id TEXT PRIMARY KEY,
    card_id TEXT, -- cards テーブルへの外部キー
    paid BOOLEAN,
    amount INTEGER,
    object TEXT,
    created INTEGER,
    term_id TEXT,
    captured BOOLEAN,
    currency TEXT,
    customer TEXT,
    fee_rate TEXT,
    livemode BOOLEAN,
    refunded BOOLEAN,
    expired_at INTEGER,
    captured_at INTEGER,
    description TEXT,
    failure_code TEXT,
    subscription TEXT,
    refund_reason TEXT,
    amount_refunded INTEGER,
    failure_message TEXT,
    three_d_secure_status TEXT,
    FOREIGN KEY (card_id) REFERENCES cards(id)
);