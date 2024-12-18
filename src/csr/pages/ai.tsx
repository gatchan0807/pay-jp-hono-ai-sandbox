import { render, useState } from 'hono/jsx/dom'
import { AttentionBox } from '../../components/box';
import { Title } from '../../components/text';
import { AILanguageModelFactory, useLanguageModel } from '../hooks/useLanguageModels';
import { useLanguageModelStatus } from '../hooks/useLanguageModelStatus';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { Layout, Container } from '../../components/layout';
import { GeminiNanoInChromePrompt } from '../../prompts/gemini-nano-in-chrome';

export function ClientAiPage() {
    const languageModel = useLanguageModel();
    const languageModelStatus = useLanguageModelStatus({ languageModel });
    const isOnChrome = languageModelStatus === 'readily';

    return (
        <Layout>
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

            </Container>
        </Layout>
    )
}

function UsableLimitedAi({ languageModel }: { languageModel: AILanguageModelFactory | null, languageModelStatus: string }) {
    const [generatedText, setGeneratedText] = useState<string>("")
    const [isGenerating, setIsGenerating] = useState<boolean>(false)

    const handler = async () => {
        try {
            setIsGenerating(true)
            const session = await languageModel?.create();
            if (session === undefined) {
                setIsGenerating(false)
                return
            }

            const prompt = GeminiNanoInChromePrompt();
            const result = await session.prompt(prompt);

            if ('translation' in self) {
                const html = await unified()
                    .use(remarkParse)
                    .use(remarkRehype)
                    .use(rehypeStringify)
                    .process(result);
                console.log(String(html));

                // @ts-expect-error - AI object is usable only in the already setting completed Chrome
                const translator = await self.translation.createTranslator({
                    sourceLanguage: 'en',
                    targetLanguage: 'ja',
                });

                const translated = await translator.translate(String(html))
                console.log(translated);

                setGeneratedText(String(translated));
            }
            setIsGenerating(false)
        } catch (e) {
            setGeneratedText(`生成中にエラーが発生しました`)
        } finally {
            setIsGenerating(false)
        }
    }


    return (
        <div class="flex flex-col gap-4 p-4 border-2 border-blue-600 shadow-lg shadow-blue-500/30 rounded">
            <h2 class="text-lg font-bold">今日の晩ごはんの献立候補を考えてもらう</h2>

            <AttentionBox type="sub">
                <p>この機能は、ブラウザに搭載されたAIを使って実装されています。</p>
                <p>一般的な生成AI（LLM）に比べるとかなり精度が低い点について、ご容赦ください。</p>
                <p>また、一度英語で出力されたAIの生成結果を日本語に翻訳して表示します。</p>
                <p>翻訳結果は、出力元の文脈によっては意味が変わることがありますので、ご注意ください。</p>
            </AttentionBox>

            <button
                onClick={() => handler()}
                class="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded shadow-lg shadow-blue-500/30"
            >
                AIに考えてもらう
            </button>
            {isGenerating ? <Generating /> : (<div class="p-4 bg-slate-100 rounded">
                {generatedText === "" ? <p class="text-center">ここに生成結果が表示されます</p> :
                    <div dangerouslySetInnerHTML={{ __html: generatedText }}></div>}
            </div>)}
        </div>
    )
}

function Generating() {
    return (
        <div class="p-4 bg-slate-100 rounded text-center">
            <p class="text-blue-400 font-bold">検討中...</p>
        </div>
    )
}

function NoUsableLimitedAi() {
    return <div class="p-4 border-2 border-red-600 bg-red-50 text-red-700 shadow-lg shadow-red-500/30 rounded">
        <p>この機能は、Chrome組み込みのAIを利用した機能であるため、最新版のChrome（Windows / macOS / Linux用）でのみ利用可能です。</p>
        <p>また、Chromeの実験的機能をONにする必要があります。詳しくは以下のページの手順を参考にしてください。</p>
        <ul class="list-disc list-inside">
            <li class="mt-4 underline">
                <a href="https://qiita.com/pitao/items/f1355b8002e360f83c93#%E8%A8%AD%E5%AE%9A%E3%81%AE%E6%9C%89%E5%8A%B9%E5%8C%96" target="_blank" rel="noreferrer">Chromeの実験的機能をONにする方法</a>
            </li>
            <li class="mt-4 underline">
                <a href="https://www.docswell.com/s/gatchan0807/ZN1V6G-2024-11-23-110000" target="_blank" rel="noreferrer">Chrome組み込みのAIとは</a>
            </li>
            <li class="mt-4 underline">
                <a href="https://developer.chrome.com/docs/ai?hl=ja" target="_blank" rel="noreferrer">Chrome組み込みのAIとは（公式Docs）</a>
            </li>
        </ul>
    </div>
}

const root = document.getElementById('client-ai-page')!
render(<ClientAiPage />, root)
