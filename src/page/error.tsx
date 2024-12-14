import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { Title } from "../components/text";
import { Container } from "../components/box";
import { Footer } from "../components/footer";

export type ErrorObject = {
    message: string,
    code: number | string,
}

export function ClientError(ctx: Context<BlankEnv, string, BlankInput>, error: ErrorObject) {
    return ctx.render(
        <Container>
            <Title text={`Client Error [ ${error.code} ]`} />
            <ErrorMessageBox message={error.message} />
            <Footer />
        </Container>
    )
}

export function ServerError(ctx: Context<BlankEnv, string, BlankInput>, error: ErrorObject) {
    return ctx.render(
        <Container>
            <Title text={`Server Error [ ${error.code} ]`} />
            <ErrorMessageBox message={error.message} />
            <Footer />
        </Container>
    )
}

function ErrorMessageBox({ message }: { message: string }) {
    return <div class="text-red-700 bg-red-100 p-4 rounded-md">
        {message}
    </div>
}