import React from 'react'
import { Route, IndexRoute, DefaultRoute } from 'react-router'
import PostLoader from './loaders/post-loader'

let routes = (App) => {
  return (
    <Route component={App}>
      <Route path=':category/:slug/:id' component={PostLoader} />
      <Route path=':category/:subcategory/:slug/:id' component={PostLoader} />
    </Route>
  )
}

export default routes
