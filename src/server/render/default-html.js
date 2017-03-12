import React, { PropTypes } from 'react'
import './default-style'

const defaultHtml = ({ markup, head, asyncProps, assets = {} }) => {
  const attr = head.htmlAttributes.toComponent()
  const hasProps = asyncProps.propsArray.length > 0
  return (
    <html lang="en" {...attr}>
      <head>
        { head.title.toComponent() }
        { head.base.toComponent() }
        { head.meta.toComponent() }
        { head.link.toComponent() }
        { assets.vendor && <script defer src={assets.vendor.js} /> }
        { assets.bundle && <script defer src={assets.bundle.js} /> }
        { head.script.toComponent() }
        <style dangerouslySetInnerHTML={{ __html: markup.css }} />
        <link rel="shortcut icon" href="/public/favicon.ico" />
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: markup.html }} />
        { hasProps && <script dangerouslySetInnerHTML={{ __html: `window.__ASYNC_PROPS__ = ${JSON.stringify(asyncProps.propsArray)}` }} /> }
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
    propsArray: PropTypes.array
  }),
  assets: PropTypes.object
}

export default defaultHtml
