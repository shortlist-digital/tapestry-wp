if (process.env.NODE_ENV === 'development') {
  module.hot.accept()
}

if (module.hot) {
  module.hot.decline('./default-routes')
}

import React from 'react'
import { render } from 'react-dom'
import AsyncProps from 'async-props'
import { Router, browserHistory } from 'react-router'
// import routes and pass them into <Router/>
import routes from './default-routes'
import Base from './example-app/base'
import Post from './example-app/components/post'

const appRoutes = routes(Base)
const loadContext = {
  siteUrl: 'http://shortliststudio.foundry.press',
  components: {
    Base: Base,
    Post: Post
  }
}

const AppRouter =
  <Router
    key={Math.random()}
    routes={appRoutes}
    history={browserHistory}
    render={(props) => (
      <AsyncProps
        {...props}
        loadContext={loadContext}
      />
    )}
  />

render(
  AppRouter,
  document.getElementById('root')
)
