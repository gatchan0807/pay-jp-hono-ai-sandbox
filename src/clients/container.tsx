import { render } from 'hono/jsx/dom'
import { Footer } from '../components/footer';

export function Container() {
  return <>
    <h1>Hello world from Client side rendering!</h1>

    <Footer />
  </>
}

const root = document.getElementById('client-container')!
render(<Container />, root)
