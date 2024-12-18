import { Context } from "hono"
import { BlankEnv, BlankInput } from "hono/types"
import { RenderingClientComponent } from "../../csr/utils/client-component"

export const AiLimitedHandler = (ctx: Context<BlankEnv, string, BlankInput>) => {
    return RenderingClientComponent(ctx, { dev: "/src/csr/pages/ai.tsx", prd: "/static/ai/limited.js" })
}      