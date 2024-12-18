import { AttentionBox } from "../../components/box"
import { Container, Layout } from "../../components/layout"
import { Title } from "../../components/text"
import { SubscriptionResponse } from "../../types/payjp"

export function ConfirmedPage({ subscription }: { subscription: SubscriptionResponse }) {
    return (
        <Layout>
            <Container gap={4}>
                <Title text="サブスクリプション登録完了" />
                <AttentionBox type="success">
                    <p>サブスクリプション登録が完了しました！（テストカードなので、実際には決済されません）</p>
                </AttentionBox>
                <div class="p-4 rounded border-2 border-blue-600 shadow-lg shadow-blue-600/30 flex flex-col gap-4">
                    <ul class="text-slate-500">
                        <p>サブスクリプションID: {subscription.id}</p>
                        <li>プラン: {subscription.plan.name}</li>
                        <li>金額: {subscription.plan.amount}円</li>
                        <li>サブスクリプション開始日: {new Date((subscription.current_period_start ?? 0) * 1000).toLocaleDateString('ja-JP')}</li>
                        <li>次回支払い日（トライアル終了日）: {new Date((subscription.trial_end ?? 0) * 1000).toLocaleDateString('ja-JP')}</li>
                    </ul>
                    <div class="w-full flex justify-center">
                        <a href="/ai/premium" class="block p-4 w-1/3 text-center text-white bg-blue-600 shadow-lg shadow-blue-600/50 rounded">プレミアム版AIを使ってみる</a>
                    </div>
                </div>
            </Container>
        </Layout>
    )
}