import { FC, Suspense } from "hono/jsx";

export const TopPage:FC = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <h1>Hello World from Cloudflare Pages!</h1>
      </Suspense>
    )
  }