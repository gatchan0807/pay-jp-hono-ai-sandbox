import { Context } from "hono"
import { BlankEnv, BlankInput } from "hono/types"
import { PremiumRequiredPage } from "../../pages/ai/premium-required"

export const AiPremiumRequiredHandler = (ctx: Context<BlankEnv, string, BlankInput>) => {
    return ctx.render(<PremiumRequiredPage />)
}