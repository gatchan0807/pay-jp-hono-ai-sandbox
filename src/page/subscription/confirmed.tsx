import { Container } from "../../components/box"
import { Footer } from "../../components/footer"
import { Title } from "../../components/text"
import { SubscriptionResponse } from "../../types/payjp"

export function ConfirmedPage({ subscription }: { subscription: SubscriptionResponse }) {
    return (
        <Container gap={4}>
            <Title text="サブスクリプション登録完了" />
            <h2 class="text-xl">サブスクリプション登録が完了しました！（テストカードなので、実際には決済されません）</h2>
            <div class="p-4 bg-slate-100 text-slate-600">
                <ul>
                    <p>サブスクリプションID: {subscription.id}</p>
                    <li>プラン: {subscription.plan.name}</li>
                    <li>金額: {subscription.plan.amount}円</li>
                    <li>サブスクリプション開始日: {new Date((subscription.current_period_start ?? 0) * 1000).toLocaleDateString('ja-JP')}</li>
                    <li>次回支払い日（トライアル終了日）: {new Date((subscription.trial_end ?? 0) * 1000).toLocaleDateString('ja-JP')}</li>
                </ul>
            </div>
            <div class="w-full flex justify-center">
                <a href="/ai/premium" class="block p-4 w-1/ text-center bg-teal-200 hover:bg-teal-100 text-teal-600 rounded">プレミアム版AIを使ってみる</a>
            </div>
            <Footer />
        </Container>
    )
}