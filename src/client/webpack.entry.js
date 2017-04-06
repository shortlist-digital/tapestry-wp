import React from 'react'
import { render } from 'react-dom'
import { Router, match, browserHistory } from 'react-router'
import AsyncProps from 'async-props'
import 'location-origin'
import 'es6-promise/auto'
import RouteWrapper from '../shared/route-wrapper'
import config from 'tapestry.config.js'
const runtime = require('service-worker-plugin/runtime')
import mitt from 'mitt'

if (window !== 'undefined') {
  window.tapestryEmitter = mitt()
}

// methods in use on the <Router />
const onUpdate = () =>
  typeof config.onPageUpdate === 'function' && config.onPageUpdate()
const renderAsyncProps = props =>
  <AsyncProps loadContext={config} {...props} />

// define routes/history for react-router
const routes = RouteWrapper(config)
const history = browserHistory
const targetNode = document.getElementById('root')

// run a router match (not sure why this is necessary)
match({ routes, history }, (error, redirectLocation, renderProps) =>
  render(
    <Router
      onUpdate={onUpdate}
      render={renderAsyncProps}
      routes={routes}
      {...renderProps}
    />,
    targetNode
  )
)

runtime.register()
