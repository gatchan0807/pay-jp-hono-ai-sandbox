import { FC, Suspense } from "hono/jsx";
import { Footer } from "../components/footer";
import { Title } from "../components/text";
import { Container } from "../components/box";

export const TopPage: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Container>
        <Title text="Hello World from Cloudflare Pages!" />

        <p>
          PAY.JPで支払いを行う（テストカードしか使えません）
          <p>テストカード番号：4242 4242 4242 4242</p>
          <form action="/payment" method="post">
            <script src="https://checkout.pay.jp" class="payjp-button" data-key="pk_test_52f40932ba5a099b40ed9974"></script>
          </form>
        </p>

        <Footer />
      </Container>
    </Suspense>
  )
}