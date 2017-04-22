import React from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'
import './default-style'

const defaultHtml = ({ markup, head, asyncProps, assets = {} }) => {
  const attr = head.htmlAttributes.toComponent()
  const hasProps = has(asyncProps, 'propsArray')
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
          hasProps &&
            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `window.__ASYNC_PROPS__ = ${
                  // Add a stringify template helper for outputting JSON with forward
                  // slashes escaped to prevent '</script>' tag output in JSON within
                  // script tags. See http://stackoverflow.com/questions/66837/when-is-a-cdata-section-necessary-within-a-script-tag/1450633#1450633
                  JSON.stringify(asyncProps.propsArray)
                    .replace(/\//g, '\\/')
                    // Escape u2028 and u2029
                    // http://timelessrepo.com/json-isnt-a-javascript-subset
                    // https://github.com/mapbox/tilestream-pro/issues/1638
                    .replace(/\u2028/g, "\\u2028")
                    .replace(/\u2029/g, "\\u2029")
                }`
              }}
            />
        }
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
