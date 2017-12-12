import React from 'react'
import idx from 'idx'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import { renderStaticOptimized } from 'glamor/server'

import AsyncProps from '../../shared/third-party/async-props'
import RenderError from '../../shared/render-error'

export default ({
  response,
  renderProps = false,
  loadContext,
  asyncProps,
  assets
}) => {

  let Document = (
    idx(renderProps, _ => _.components[1].options.document) ||
    require('./default-html').default
  )

  // get html from props
  const data = {
    markup: renderStaticOptimized(() =>
      renderToString(
        renderProps ?
          <AsyncProps
            {...renderProps}
            {...asyncProps}
            loadContext={loadContext}
          /> :
          <RenderError
            response={response}
            config={loadContext}
          />
      )
    ),
    head: Helmet.rewind(),
    assets,
    asyncProps
  }

  // render html with data
  return `<!doctype html>${renderToStaticMarkup(<Document {...data} />)}`
}
