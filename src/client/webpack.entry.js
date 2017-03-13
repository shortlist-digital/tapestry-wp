import React from 'react'
import { render } from 'react-dom'
import { Router, match, browserHistory } from 'react-router'
import AsyncProps from 'async-props'
import 'location-origin'
import DefaultRoutes from '../shared/default-routes'
import config from 'tapestry.config.js'
import runtime from 'service-worker-plugin/runtime'

// methods in use on the <Router />
const onUpdate = () =>
  typeof config.onPageUpdate === 'function' && config.onPageUpdate()
const renderAsyncProps = props =>
  <AsyncProps loadContext={config} {...props} />

// define routes/history for react-router
const routes = DefaultRoutes(config)
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
