#bin/bash

npx wrangler d1 execute pay-jp-hono-ai-sandbox --file ./schema/sql/create-events.sql --remote -y
npx wrangler d1 execute pay-jp-hono-ai-sandbox --file ./schema/sql/create-subscriptions.sql --remote -y
npx wrangler d1 execute pay-jp-hono-ai-sandbox --command "SELECT name FROM sqlite_schema WHERE type ='table'" --remote -y