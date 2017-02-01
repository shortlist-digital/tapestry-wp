import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import AsyncProps from 'async-props'
import { renderStaticOptimized } from 'glamor/server'

import DefaultHTML from './default-html'


const addDocType = data => `
  <!doctype html>
  ${renderToStaticMarkup(<DefaultHTML {...data} />)}
`

export const renderHtml = ({ renderProps, loadContext, asyncProps }) => {

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
    asyncProps
  }

  // render html with data
  return addDocType(data)
}
export const renderError = ({ loadContext, error }) => {

  // const Error = loadContext.components.Error
  //
  // // get html from props
  // const data = {
  //   markup: renderStaticOptimized(() =>
  //     renderToString(
  //       <Error {...error} />
  //     )
  //   ),
  //   head: Helmet.rewind()
  // }
  //
  // // render html with data
  // return addDocType(data)
  return ''
}
