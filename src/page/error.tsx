import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { Title } from "../components/text";
import { AttentionBox, Container } from "../components/box";
import { Footer } from "../components/footer";

export type ErrorObject = {
    message: string,
    code: number | string,
}

export function ClientError(ctx: Context<BlankEnv, string, BlankInput>, error: ErrorObject) {
    return ctx.render(
        <Container gap={4}>
            <Title text={`Client Error [ ${error.code} ]`} />
            <ErrorMessageBox message={error.message} />
            <Footer />
        </Container>
    )
}

export function ServerError(ctx: Context<BlankEnv, string, BlankInput>, error: ErrorObject) {
    return ctx.render(
        <Container gap={4}>
            <Title text={`Server Error [ ${error.code} ]`} />
            <ErrorMessageBox message={error.message} />
            <Footer />
        </Container>
    )
}

function ErrorMessageBox({ message }: { message: string }) {
    return <AttentionBox type="error">
        {message}
    </AttentionBox>
}