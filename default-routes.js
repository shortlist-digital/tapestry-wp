import React from 'react'
import { Route, IndexRoute, DefaultRoute } from 'react-router'
import PostLoader from './loaders/post-loader'

const routes = (Base) => {
  return (
    <Route component={Base}>
      <Route path=':category/:slug/:id' component={PostLoader} />
      <Route path=':category/:subcategory/:slug/:id' component={PostLoader} />
    </Route>
  )
}

export default routes
