import React from 'react'
import { Route, IndexRoute } from 'react-router'
import PostLoader from './loader-post'

export default ({ Base, Post }) =>
  <Route component={Base}>
    <Route path=':category/:slug/:id' component={PostLoader} post={Post} />
    <Route path=':category/:subcategory/:slug/:id' component={PostLoader} post={Post} />
  </Route>