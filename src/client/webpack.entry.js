import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import AsyncProps from 'async-props'
import 'location-origin'

import DefaultRoutes from '../shared/default-routes'
import config from 'tapestry.config.js'

let onUpdateMethod = () => {}
if (typeof config.onPageUpdate === 'function') {
  onUpdateMethod = config.onPageUpdate
}
const renderAsyncProps = props =>
  <AsyncProps loadContext={config} {...props} />

render(
  <Router
    onUpdate={onUpdateMethod}
    history={browserHistory}
    render={renderAsyncProps}
    routes={DefaultRoutes(config)}>
  </Router>,
  document.getElementById('root')
)
