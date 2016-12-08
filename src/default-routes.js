import React from 'react'
import { Route, IndexRoute } from 'react-router'
import PostLoader from './loader-post'
import PageLoader from './loader-page'

export default ({ Base, Post, Page }) =>
  <Route component={Base}>
    <Route path='about/:slug' component={PageLoader} page={Page} />
    <Route path=':category/:slug/:id' component={PostLoader} post={Post} />
    <Route path=':category/:subcategory/:slug/:id' component={PostLoader} post={Post} />
  </Route>