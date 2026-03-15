import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import styles from '@/styles/global.css?inline'

export const render = (element: ReactNode) => {
  const html = renderToStaticMarkup(element)

  const result = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      ${styles}
    </style>
  </head>
  <body>
    <div id="root">${html}</div>
  </body>
</html>`

  return result
}
