import React from 'react'
import { hydrate } from 'react-dom'
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

const renderApp = config => {

  // define routes/history for react-router
  const routes = RouteWrapper(config)
  const history = browserHistory
  const targetNode = document.getElementById('root')


  // run a router match (not sure why this is necessary)
  match({ routes, history }, (error, redirectLocation, renderProps) =>
    hydrate(
      <AppContainer key={Math.random()}>
        <Root
          renderAsyncProps={renderAsyncProps}
          routes={routes}
          renderProps={renderProps}
        />
      </AppContainer>,
      targetNode
    )
  )
}

renderApp(config)

if (module.hot) {
  module.hot.accept('tapestry.config.js', () => {
    const newConfig = require('tapestry.config.js').default
    renderApp(newConfig)
  })
}
