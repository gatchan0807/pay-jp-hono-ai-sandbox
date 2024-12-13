import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";

export type ErrorObject = {
    message: string,
    code: number | string,
}

export function ClientError(ctx: Context<BlankEnv, string, BlankInput>, error: ErrorObject) {
    return ctx.render(<>
        <h1>Client Error [ {error.code} ]</h1>
        <pre>{error.message}</pre>
        <p>
            <a href="/">return to TOP</a>
        </p>
    </>)
}

export function ServerError(ctx: Context<BlankEnv, string, BlankInput>, error: ErrorObject) {
    return ctx.render(<>
        <h1>Server Error [ {error.code} ]</h1>
        <pre>{error.message}</pre>
        <p>
            <a href="/">return to TOP</a>
        </p>
    </>)
}