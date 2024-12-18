import { Context } from "hono"
import { BlankEnv, BlankInput } from "hono/types"

type FilePath = {
  prd: string
  dev: string
}

export function RenderingClientComponent(ctx: Context<BlankEnv, string, BlankInput>, filePath: FilePath) {
  return ctx.html(
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <script src="https://cdn.tailwindcss.com"></script>
        {import.meta.env.PROD ? (
          <script type="module" src={`${filePath.prd}`}></script>
        ) : (
          <script type="module" src={`${filePath.dev}`}></script>
        )}
      </head>
      <body>
        <div id="client-ai-page"></div>
      </body>
    </html>
  )
}