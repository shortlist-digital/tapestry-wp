import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import AsyncProps from 'async-props'
import { renderStaticOptimized } from 'glamor/server'
import { minify } from 'html-minifier'
import DefaultHTML from './default-html'
import RenderError from '../../shared/render-error'


export const renderHtml = ({
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
            config={loadContext}
          />
      )
    ),
    head: Helmet.rewind(),
    assets,
    asyncProps
  }

  // render html with data
  return `
    <!doctype html>
    ${minify(renderToStaticMarkup(<DefaultHTML {...data} />))}
  `
}
