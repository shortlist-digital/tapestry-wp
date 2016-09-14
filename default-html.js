import React from 'react'

let DefaultHTML = ({markup, head, asyncProps}) =>
  <html class="no-js" lang="en">
    <head>
      {head.title.toComponent()}
      {head.meta.toComponent()}
      {head.link.toComponent()}
    </head>
  <body>
    <div id="root"
      style={{
        margin: 'auto',
        maxWidth:'700px',
        width: '100%',
        overflow: 'hidden'
      }}
      dangerouslySetInnerHTML={{__html: markup}}
    ></div>
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__ASYNC_PROPS__ = ${JSON.stringify(asyncProps.propsArray)};`,
      }}
    />
  <script src="http://localhost:3050/bundle.js" />
  </body>
  </html>

export default DefaultHTML
