import { Container } from "../../components/box"
import { Footer } from "../../components/footer"
import { Title } from "../../components/text"
import { SubscriptionResponse } from "../../types/payjp"

export function ConfirmedPage({ subscription }: { subscription: SubscriptionResponse }) {
    return (
        <Container gap={4}>
            <Title text="サブスクリプション登録完了" />
            <h2 class="text-lg">サブスクリプション登録が完了しました！（テストカードなので、実際には決済されません）</h2>
            <div class="p-4 rounded border-2 border-teal-600 shadow-lg shadow-teal-600/30">
                    <ul>
                        <p>サブスクリプションID: {subscription.id}</p>
                        <li>プラン: {subscription.plan.name}</li>
                        <li>金額: {subscription.plan.amount}円</li>
                        <li>サブスクリプション開始日: {new Date((subscription.current_period_start ?? 0) * 1000).toLocaleDateString('ja-JP')}</li>
                        <li>次回支払い日（トライアル終了日）: {new Date((subscription.trial_end ?? 0) * 1000).toLocaleDateString('ja-JP')}</li>
                    </ul>
                <div class="w-full flex justify-center">
                    <a href="/ai/premium" class="block p-4 w-1/3 text-center text-white bg-teal-600 shadow-lg shadow-teal-600/50 rounded">プレミアム版AIを使ってみる</a>
                </div>
            </div>
            <Footer />
        </Container>
    )
}