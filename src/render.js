import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import AsyncProps from 'async-props'
import { renderStaticOptimized } from 'glamor/server'
import { minify } from 'html-minifier'
import DefaultHTML from './default-html'
import MissingView from './missing-view'


export const renderHtml = ({
  renderProps = false,
  loadContext,
  asyncProps,
  assets
}) => {

  let data = null

  if (!renderProps) {
    const Error = loadContext.components.Error || MissingView
    data = {
      markup: renderStaticOptimized(() =>
        renderToString(
          <Error />
        )
      ),
      head: Helmet.rewind(),
      assets
    }
  } else {
    // get html from props
    data = {
      markup: renderStaticOptimized(() =>
        renderToString(
          <AsyncProps
            {...renderProps}
            {...asyncProps}
            loadContext={loadContext} />
        )
      ),
      head: Helmet.rewind(),
      assets,
      asyncProps
    }
  }

  // render html with data
  return `
    <!doctype html>
    ${minify(renderToStaticMarkup(<DefaultHTML {...data} />))}
  `
}
