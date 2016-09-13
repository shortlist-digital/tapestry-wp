import React from 'react'

let DefaultHTML = ({markup, head, scriptTag}) =>
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
     <div dangerouslySetInnerHTML={{__html: scriptTag}}></div>
    </body>
  </html>

export default DefaultHTML
