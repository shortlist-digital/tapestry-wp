import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import { renderStaticOptimized } from 'glamor/server'

import AsyncProps from '../../shared/third-party/async-props'
import DefaultHTML from './default-html'
import RenderError from '../../shared/render-error'

export default ({
  response,
  renderProps = false,
  loadContext,
  asyncProps,
  assets
}) => {

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
  return `<!doctype html>${renderToStaticMarkup(<DefaultHTML {...data} />)}`
}
