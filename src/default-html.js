import React from 'react'
import './default-style'

export default ({ markup, head, asyncProps }) => {
  const attr = head.htmlAttributes.toComponent()
  return (
    <html {...attr}>
      <head>
        {head.title.toComponent()}
        {head.base.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}
        <style dangerouslySetInnerHTML={{ __html: markup.css }} />
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: markup.html }} />
        <script dangerouslySetInnerHTML={{ __html: `window.__ASYNC_PROPS__ = ${JSON.stringify(asyncProps.propsArray)}` }} />
        <script src="/public/bundle.js" />
      </body>
    </html>
  )
}
