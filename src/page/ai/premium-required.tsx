import { AttentionBox, Container } from '../../components/box';
import { Footer } from '../../components/footer';
import { Title } from '../../components/text';

export function PremiumRequiredPage() {
    return (
        <Container gap={2}>
            <Title text="プレミアムAI機能" />

            <AttentionBox type="error" >
                <p>プレミアムAI機能を利用するには、サブスクリプション登録が必要です。</p>
                <p>サブスクリプション登録がまだの方は、下記のページから登録をお願いします。</p>
            </AttentionBox>
            <div class="w-full flex justify-center">
                <a href="/" class="p-4 bg-cyan-100 hover:bg-cyan-200 rounded">サブスクリプション登録</a>
            </div>

            <Footer />
        </Container>
    )
}