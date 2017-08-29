import React from 'react'
import { render } from 'react-dom'
import { match, browserHistory } from 'react-router'
import mitt from 'mitt'
import 'location-origin'
import 'es6-promise/auto'

import AsyncProps from '../shared/third-party/async-props'
import RouteWrapper from '../shared/route-wrapper'

import config from 'tapestry.config.js'
import { AppContainer } from 'react-hot-loader'
import Root from './root'

if (window !== 'undefined') {
  window.tapestryEmitter = mitt()
}

// methods in use on the <Router />
const renderAsyncProps = props =>
  <AsyncProps loadContext={config} {...props} />

// define routes/history for react-router
const routes = RouteWrapper(config)
const history = browserHistory
const targetNode = document.getElementById('root')

// run a router match (not sure why this is necessary)
match({ routes, history }, (error, redirectLocation, renderProps) =>
  render(
    <AppContainer>
      <Root
        renderAsyncProps={renderAsyncProps}
        routes={routes}
        renderProps={renderProps}
      />
    </AppContainer>,
    targetNode
  )
)

if (module.hot) {
  module.hot.accept(() => {
    match({ routes, history }, (error, redirectLocation, renderProps) =>
      render(
        <AppContainer>
          <Root
            renderAsyncProps={renderAsyncProps}
            routes={routes}
            renderProps={renderProps}
          />
        </AppContainer>,
        targetNode
      )
    )
  })
}
