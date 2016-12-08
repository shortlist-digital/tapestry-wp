import React from 'react'

export default ({ markup, asyncProps }) =>
  <html lang="en">
    <body>
      <div
        id="root"
        style={{ width: '100%' }}
        dangerouslySetInnerHTML={{ __html: markup }} />
      <script dangerouslySetInnerHTML={{ __html: `window.__ASYNC_PROPS__ = ${JSON.stringify(asyncProps.propsArray)}` }} />
      <script src="/public/bundle.js" />
    </body>
  </html>
