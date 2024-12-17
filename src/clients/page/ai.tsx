import { render } from 'hono/jsx/dom'
import { AttentionBox, Container } from '../../components/box';
import { Footer } from '../../components/footer';
import { Title } from '../../components/text';
import { AILanguageModelFactory, useLanguageModel } from '../hooks/useLanguageModels';
import { useLanguageModelStatus } from '../hooks/useLanguageModelStatus';

export function ClientAiPage() {
    const languageModel = useLanguageModel();
    const languageModelStatus = useLanguageModelStatus({ languageModel });
    const isOnChrome = languageModelStatus === 'readily';

    return (
        <Container gap={4}>
            <Title text="機能限定版AI機能" />
            <AttentionBox type="warn">
                <p>機能限定版AI機能を利用するには、最新版のChrome（Windows / macOS / Linux用）が必要です。</p>
                <p>また、Chromeの実験的機能をONにする必要があります。詳しくは以下のページの手順を参考にしてください。</p>
                <p class="mt-4 underline">
                    <a href="https://qiita.com/pitao/items/f1355b8002e360f83c93#%E8%A8%AD%E5%AE%9A%E3%81%AE%E6%9C%89%E5%8A%B9%E5%8C%96" target="_blank" rel="noreferrer">Chromeの実験的機能をONにする方法</a>
                </p>
            </AttentionBox>

            {isOnChrome ? <UsableLimitedAi languageModel={languageModel} languageModelStatus={languageModelStatus} /> : <NoUsableLimitedAi />}

            <Footer />
        </Container>
    )
}

function UsableLimitedAi({ languageModel, languageModelStatus }: { languageModel: AILanguageModelFactory | null, languageModelStatus: string }) {
    return (
        <div class="p-4 border-2 border-blue-600 shadow-lg shadow-blue-500/30 rounded">
            <p>Can I use on-chrome LLM?: {JSON.stringify(languageModelStatus)}</p>
        </div>
    )
}

function NoUsableLimitedAi() {
    return <>

    </>
}

const root = document.getElementById('client-ai-page')!
render(<ClientAiPage />, root)
