import { Header } from "./header"
import { Footer } from "./footer"

export function Layout({ children }: { children?: any }) {
    return (
        <div class="min-h-screen">
            <Header />
            <main class="min-h-screen">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export function Container({ children, gap = 0 }: { gap?: number, children?: any }) {
    return (
        <div class={`container mx-auto w-10/12 mt-4 flex flex-col gap-${gap}`}>
            {children}
        </div>
    )
}

