import { render } from 'hono/jsx/dom'
import { Container } from '../../components/box';
import { Footer } from '../../components/footer';
import { Title } from '../../components/text';
import { useLanguageModel } from '../hooks/useLanguageModels';
import { useLanguageModelStatus } from '../hooks/useLanguageModelStatus';

export function ClientAiPage() {
  const languageModel = useLanguageModel();
  const languageModelStatus = useLanguageModelStatus({ languageModel });

  return (
    <Container>
      <Title text="Hello world from Client side rendering!" />
      <p>Can I use on-chrome LLM?: {JSON.stringify(languageModelStatus)}</p>

      <Footer />
    </Container>
  )
}

const root = document.getElementById('client-ai-page')!
render(<ClientAiPage />, root)
