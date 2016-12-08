import React from 'react'

export default ({ markup }) =>
  <html lang="en">
    <body>
      <div
        id="root"
        style={{ width: '100%' }}
        dangerouslySetInnerHTML={{ __html: markup }} />
      <script src="/public/bundle.js" />
    </body>
  </html>
