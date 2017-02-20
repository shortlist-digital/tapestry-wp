import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import AsyncProps from 'async-props'
import 'location-origin'

import DefaultRoutes from './default-routes'
import config from 'tapestry.config.js'

var onUpdateMethod = () => {}
if (typeof config.onPageUpdate === 'function') {
  onUpdateMethod = config.onPageUpdate
}

render(
  <Router
    onUpdate={onUpdateMethod}
    history={browserHistory}
    render={props =>
      <AsyncProps loadContext={config} {...props} />
    }
    routes={DefaultRoutes(config.components)}>
  </Router>,
  document.getElementById('root')
)
