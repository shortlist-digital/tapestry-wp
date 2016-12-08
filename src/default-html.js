import React from 'react'

export default ({ markup, head, asyncProps }) =>
  <html lang="en" {...head.htmlAttributes.toComponent()}>
    <head>
      {head.title.toComponent()}
      {head.base.toComponent()}
      {head.meta.toComponent()}
      {head.link.toComponent()}
      {head.script.toComponent()}
      {head.style.toComponent()}
    </head>
    <body>
      <div
        id="root"
        style={{ width: '100%' }}
        dangerouslySetInnerHTML={{ __html: markup }} />
      <script dangerouslySetInnerHTML={{ __html: `window.__ASYNC_PROPS__ = ${JSON.stringify(asyncProps.propsArray)}` }} />
      <script src="/public/bundle.js" />
    </body>
  </html>
