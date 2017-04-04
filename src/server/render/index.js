import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import AsyncProps from 'async-props'
import { renderStaticOptimized } from 'glamor/server'
import { minify } from 'html-minifier'
import { has } from 'lodash'

import DefaultHTML from './default-html'
import MissingView from '../../shared/missing-view'


export const renderHtml = ({
  renderProps = false,
  loadContext,
  asyncProps,
  assets
}) => {

  const CustomError = has(loadContext, 'loadContext.components.CustomError') ?
    loadContext.components.CustomError :
    MissingView
  // get html from props
  const data = {
    markup: renderStaticOptimized(() =>
      renderToString(
        renderProps ?
          <AsyncProps
            {...renderProps}
            {...asyncProps}
            loadContext={loadContext} /> :
          <CustomError />
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
