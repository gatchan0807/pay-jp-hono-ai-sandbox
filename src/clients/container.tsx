import { render } from 'hono/jsx/dom'
import { useLanguageModelStatus } from './hooks/useLanguageModelStatus'
import { useLanguageModel } from './hooks/useLanguageModels';
import { Footer } from '../components/footer';

export function Container() {
  const languageModel = useLanguageModel();
  const languageModelStatus = useLanguageModelStatus({ languageModel });

  return <>
    <h1>Hello world from Client side rendering!</h1>
    <h1>Can I use on-chrome LLM?: {JSON.stringify(languageModelStatus)}</h1>

    <Footer />
  </>
}

const root = document.getElementById('client-container')!
render(<Container />, root)
