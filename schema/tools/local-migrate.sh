#bin/bash

npx wrangler d1 execute pay-jp-hono-ai-sandbox --file ./schema/sql/create-events.sql -y
npx wrangler d1 execute pay-jp-hono-ai-sandbox --file ./schema/sql/create-subscriptions.sql -y
npx wrangler d1 execute pay-jp-hono-ai-sandbox --file ./schema/sql/create-cards.sql -y
npx wrangler d1 execute pay-jp-hono-ai-sandbox --file ./schema/sql/create-charges.sql -y
npx wrangler d1 execute pay-jp-hono-ai-sandbox --command "SELECT name FROM sqlite_schema WHERE type ='table'" -y