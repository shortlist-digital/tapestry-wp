import React, { PropTypes } from 'react'
import './default-style'

const defaultHtml = ({ markup, head, asyncProps, assets = {} }) => {
  const attr = head.htmlAttributes.toComponent()
  return (
    <html lang="en" {...attr}>
      <head>
        { head.title.toComponent() }
        { head.base.toComponent() }
        { head.meta.toComponent() }
        { head.link.toComponent() }
        { head.script.toComponent() }
        { assets.vendor && <script defer src={assets.vendor.js} /> }
        { assets.bundle && <script defer src={assets.bundle.js} /> }
        <style dangerouslySetInnerHTML={{ __html: markup.css }} />
        <link rel="shortcut icon" href="/public/favicon.ico" />
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: markup.html }} />
        <script dangerouslySetInnerHTML={{ __html: `window.__ASYNC_PROPS__ = ${JSON.stringify(asyncProps.propsArray)}` }} />
      </body>
    </html>
  )
}

defaultHtml.propTypes = {
  markup: PropTypes.shape({
    html: PropTypes.string.isRequired,
    ids: PropTypes.array.isRequired,
    css: PropTypes.string.isRequired
  }).isRequired,
  head: PropTypes.object.isRequired,
  asyncProps: PropTypes.shape({
    propsArray: PropTypes.array.isRequired
  }),
  assets: PropTypes.object
}

export default defaultHtml