import { render, useState } from 'hono/jsx/dom'
import { AttentionBox } from '../../components/box';
import { Title } from '../../components/text';


import { hc } from 'hono/client'
import { OpenAIAppType } from '../..';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { Container, Layout } from '../../components/layout';

export function ClientPremiumAiPage() {
    const [generatedText, setGeneratedText] = useState<string>("")

    const handler = async () => {
        const client = hc<OpenAIAppType>('/')
        const result = await client.api.ai.premium.openai.$get()

        const data = result.body;

        if (!data) {
            return;
        }
        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let fullText = '';

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            fullText += chunkValue;

            const html = await unified()
                .use(remarkParse)
                .use(remarkRehype)
                .use(rehypeStringify)
                .process(fullText);

            setGeneratedText(String(html));
        }
    }

    return (
        <Layout>
            <Container gap={4}>
                <Title text="プレミアムAI機能" />

                <div class="flex flex-col gap-4 p-4 border-2 border-blue-600 shadow-lg shadow-blue-500/30 rounded">
                    <h2 class="text-lg font-bold">今日の晩ごはんの献立候補を考えてもらう</h2>

                    <AttentionBox type="sub">
                        <p>この機能は、OpenAI（ChatGPT）のGPT-4o-miniを利用して出力しています</p>
                        <p>生成AIの出力はその性質上、出力結果に誤りがある場合があります。</p>
                        <p>あくまで出力結果は参考にする程度に留めておき、必ず個人の判断のもとご利用ください。</p>
                    </AttentionBox>

                    <button
                        onClick={() => handler()}
                        class="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded shadow-lg shadow-blue-500/30"
                    >
                        AIに考えてもらう
                    </button>
                    <div class="p-4 bg-slate-100 rounded">
                        {generatedText === "" ? <p class="text-center">ここに生成結果が表示されます</p> :
                            <div dangerouslySetInnerHTML={{ __html: generatedText }}></div>}
                    </div>
                </div>

                <AttentionBox type="info">
                    <p>プレミアム機能のAPI Keyは個人開発用に利用料上限リミットをかけたKeyを利用しています。</p>
                    <p>もし多くの方に利用いただいた場合、上限にかかって他のお客様が使えなくなる可能性があるので、</p>
                    <p>良識の範囲内で動作を試すよう、ご協力のほどよろしくお願いいたします。</p>
                </AttentionBox>

            </Container>
        </Layout>
    )
}


const root = document.getElementById('client-ai-page')!
render(<ClientPremiumAiPage />, root)
