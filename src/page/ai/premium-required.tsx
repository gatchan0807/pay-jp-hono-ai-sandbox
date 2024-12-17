import { AttentionBox, Container } from '../../components/box';
import { Footer } from '../../components/footer';
import { Title } from '../../components/text';

export function PremiumRequiredPage() {
    return (
        <Container gap={4}>
            <Title text="プレミアムAI機能" />

            <AttentionBox type="error" >
                <p>プレミアムAI機能を利用するには、サブスクリプション登録が必要です。</p>
                <p>サブスクリプション登録がまだの方は、下記のページから登録をお願いします。</p>
                <p class="mt-4">
                    <a href="/" class="underline">サブスクリプション登録</a>
                </p>
            </AttentionBox>

            <Footer />
        </Container>
    )
}