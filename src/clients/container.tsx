import { render } from 'hono/jsx/dom'
import { useLanguageModelStatus } from './hooks/useLanguageModelStatus'
import { useLanguageModel } from './hooks/useLanguageModels';
import { Footer } from '../components/footer';
import { Container } from '../components/box';
import { Title } from '../components/text';

export function ClientAiPage() {
  const languageModel = useLanguageModel();
  const languageModelStatus = useLanguageModelStatus({ languageModel });

  return (
    <Container>
      <Title text="Hello world from Client side rendering!" />
      <h1>Can I use on-chrome LLM?: {JSON.stringify(languageModelStatus)}</h1>

      <Footer />
    </Container>
  )
}

const root = document.getElementById('client-ai-page')!
render(<ClientAiPage />, root)
