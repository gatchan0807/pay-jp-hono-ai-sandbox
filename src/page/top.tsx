import { Suspense } from "hono/jsx";
import { Footer } from "../components/footer";
import { Title } from "../components/text";
import { AttentionBox, Container } from "../components/box";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";
import { PlanResponse } from "../types/payjp";

export type Cookie = {
  customerId: string | false
  subscriptionId: string | false
  planId: string | false
}

export async function TopPage({ cookie, credentials }: { cookie: Cookie, credentials: string }) {
  const { status: subscriptionStatus, plan } = await useSubscriptionStatus(cookie, credentials)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Container>
        <Title text="PAY.JPを使ったサブスク登録ページ" />

        {subscriptionStatus === 'active' && plan && (
          <Plan plan={plan} />
        )}
        {subscriptionStatus !== 'active' && (
          <PayJpSubscriptionForm />
        )}

        <Footer />
      </Container>
    </Suspense>
  )
}

function Plan({ plan }: { plan: PlanResponse }) {
  return (
    <div class="my-4 p-4 bg-slate-100 text-slate-600">
      <ul>
        <p>現在のサブスクリプション情報</p>
        <li>プラン: {plan.name}</li>
        <li>金額: {plan.amount}円</li>
        <li>次回支払日: {plan.billing_day}日</li>
        <li>トライアル期間: {plan.trial_days}日</li>
      </ul>

      <div class="w-full flex justify-end">
        <a href="/payment/cancel" class="mr-4 mt-4 px-4 py-2 bg-red-100 text-red-800 rounded">解約する</a>
      </div>
    </div>
  )
}

function PayJpSubscriptionForm() {
  return (
    <>
      <AttentionBox type="info">
        <>PAY.JP API経由で顧客情報とサブスク登録、テストカードの登録までやってみよう！</>
      </AttentionBox>
      <div>
        <div class="w-full p-4 bg-cyan-50">
          <h2 class="text-lg font-bold">PAY.JPで支払いを行う</h2>
          <span class="font-bold">※ <a href="https://pay.jp/docs/testcard" target="_blank" rel="noreferrer" class="underline text-cyan-700">テストカード</a>のみ利用可能です</span>
          <p>例）テスト用カード番号：4242 4242 4242 4242</p>

          <div class="pt-4 w-full flex justify-center">

            <form action="/payment" method="post">
              <script src="https://checkout.pay.jp" class="payjp-button" data-key="pk_test_52f40932ba5a099b40ed9974" data-text="サブスクリプション登録をする"></script>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}