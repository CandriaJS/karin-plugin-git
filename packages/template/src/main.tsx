import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import styles from '@/styles/global.css?inline'


export const render = (element: ReactNode) => {
  const html = renderToStaticMarkup(element)
  const result = `
<!doctype html>
<html>
  <head>
    <style>${styles}</style>
  </head>
  <body>
    ${html}
  </body>
</html>
`
  return result
}
