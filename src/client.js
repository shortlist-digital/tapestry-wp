import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import AsyncProps from 'async-props'

import DefaultRoutes from './default-routes'
import config from 'tapestry.js'

render(
  <Router
    history={browserHistory}
    render={props => <AsyncProps {...props} />}
    routes={DefaultRoutes(config.components)}>
  </Router>,
  document.getElementById('root')
)