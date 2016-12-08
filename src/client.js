import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import AsyncProps from 'async-props'
import { rehydrate } from 'glamor'

import DefaultRoutes from './default-routes'
import config from 'tapestry.js'

rehydrate(window._glam)

render(
  <Router
    history={browserHistory}
    render={props =>
      <AsyncProps loadContext={config} {...props} />
    }
    routes={DefaultRoutes(config.components)}>
  </Router>,
  document.getElementById('root')
)
