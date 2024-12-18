import { AttentionBox } from "../components/box";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";
import { PlanResponse } from "../types/payjp";
import { Container, Layout } from "../components/layout";

export type Cookie = {
  customerId: string | false
  subscriptionId: string | false
  planId: string | false
}

export async function TopPage({ cookie, credentials }: { cookie: Cookie, credentials: string }) {
  const { status: subscriptionStatus, plan } = await useSubscriptionStatus(cookie, credentials)

  return (
    <Layout>
      <Container gap={4}>
        {subscriptionStatus === 'active' && plan && (
          <Plan plan={plan} />
        )}
        {subscriptionStatus !== 'active' && (
          <PayJpSubscriptionForm />
        )}

      </Container>
    </Layout>
  )
}

function Plan({ plan }: { plan: PlanResponse }) {
  return (
    <>
      <AttentionBox type="sub">
        <p>解約してプレミアム版AIが使えなくなっていることを確認してみよう！</p>
      </AttentionBox>
      <div class="p-4 border-slate-600 border-2 rounded shadow-lg shadow-slate-600/30">
        <ul class="text-slate-600">
          <p class="text-lg font-bold">現在のサブスクリプション情報</p>
          <li>プラン: {plan.name}</li>
          <li>金額: {plan.amount}円</li>
          <li>次回支払日: {plan.billing_day}日</li>
          <li>トライアル期間: {plan.trial_days}日</li>
        </ul>

        <div class="w-full flex justify-end">
          <a href="/payment/cancel" class="mr-4 mt-4 px-4 py-2 border-2 border-red-500 hover:bg-red-50 text-red-500 shadow-lg shadow-red-500/30 rounded">解約する</a>
        </div>
      </div>
    </>
  )
}

function PayJpSubscriptionForm() {
  return (
    <>
      <AttentionBox type="sub">
        <>PAY.JP API経由で顧客情報とサブスク登録、テストカードの登録までやってみよう！</>
      </AttentionBox>
      <div>
        <div class="w-full p-4 border-blue-500 border-2 shadow-lg shadow-blue-500/30 rounded">
          <h2 class="text-lg mb-2 font-bold text-blue-500">PAY.JPで支払いを行う</h2>
          <p class="mb-4 font-bold">※ <a href="https://pay.jp/docs/testcard" target="_blank" rel="noreferrer" class="underline text-blue-500">テストカード</a>のみ利用可能です</p>
          <div class="text-slate-500 mb-4">
            <p>例）テスト用カード番号：4242 4242 4242 4242</p>
            <p>※ 有効期限 / CVC番号 / 名前はダミーの値で問題ありません</p>
          </div>
          <p class="p-2 my-2 text-center font-bold bg-red-100 text-red-500">念の為、テストカード以外のクレジットカード番号を入れないでください！</p>

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