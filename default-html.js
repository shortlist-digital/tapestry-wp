import React from 'react'

let DefaultHTML = (props) =>
  <html class="no-js" lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />

      <meta name="description" content="" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{props.title}</title>

      <link rel="stylesheet" type="text/css" href="/public/style.css" />
    </head>
    <body>
      <div id="root"
        dangerouslySetInnerHTML={{__html: props.appString}}
      ></div>

      <script src="/public/main.js"></script>
    </body>
  </html>

export default DefaultHTML
