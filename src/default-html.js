import React, { PropTypes } from 'react'
import './default-style'

const defaultHtml = ({ markup, head, asyncProps }) => {
  const attr = head.htmlAttributes.toComponent()
  return (
    <html lang="en" {...attr}>
      <head>
        {head.title.toComponent()}
        {head.base.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}
        <style dangerouslySetInnerHTML={{ __html: markup.css }} />
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: markup.html }} />
        <script dangerouslySetInnerHTML={{ __html: `window.__ASYNC_PROPS__ = ${JSON.stringify(asyncProps.propsArray)}` }} />
        <script src="/public/bundle.js" />
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
  }).isRequired
}

export default defaultHtml
