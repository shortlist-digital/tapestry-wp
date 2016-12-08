import React from 'react'
import './default-style'

export default ({ markup, head, asyncProps }) =>
  <html lang="en">
    <head>
      {head.title.toComponent()}
      {head.base.toComponent()}
      {head.meta.toComponent()}
      {head.link.toComponent()}
      {head.script.toComponent()}
      {head.style.toComponent()}
      <style dangerouslySetInnerHTML={{ __html: markup.css }} />
    </head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{ __html: markup.html }} />
      <script dangerouslySetInnerHTML={{ __html: `window.__ASYNC_PROPS__ = ${JSON.stringify(asyncProps.propsArray)}` }} />
      <script dangerouslySetInnerHTML={{ __html: `window._glam = ${JSON.stringify(markup.ids)}` }} />
      <script src="/public/bundle.js" />
    </body>
  </html>
