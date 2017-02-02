import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import AsyncProps from 'async-props'
import { renderStaticOptimized } from 'glamor/server'
import DefaultHTML from './default-html'


export const renderHtml = ({
  renderProps,
  loadContext,
  asyncProps,
  assets
}) => {

  // get html from props
  const data = {
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

  // render html with data
  return `
    <!doctype html>
    ${renderToStaticMarkup(<DefaultHTML {...data} />)}
  `
}
