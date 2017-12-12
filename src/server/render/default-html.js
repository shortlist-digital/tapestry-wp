import React from 'react'
import idx from 'idx'
import propTypes from './prop-types'
import escapeJsonContent from '../../utilities/escape-json-content'

const defaultHtml = ({ markup, head, asyncProps, assets = {} }) => {
  const attr = head.htmlAttributes.toComponent()
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
        {
          idx(asyncProps, _ => _.propsArray) &&
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `window.__ASYNC_PROPS__ = ${
                escapeJsonContent(asyncProps.propsArray)
              }`
            }}
          />
        }
      </body>
    </html>
  )
}

defaultHtml.propTypes = propTypes

export default defaultHtml
