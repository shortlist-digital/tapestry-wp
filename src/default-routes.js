import React from 'react'
import { Route } from 'react-router'
import PostLoader from './loader-post'
import PageLoader from './loader-page'
import HomeLoader from './loader-home'

export default ({ Base, Post, Page, Home }) =>
  <Route component={Base}>
    <Route path='/' component={HomeLoader} home={Home} />
    <Route path='about/:slug' component={PageLoader} page={Page} />
    <Route path=':category/:slug/:id' component={PostLoader} post={Post} />
    <Route path=':category/:subcategory/:slug/:id' component={PostLoader} post={Post} />
  </Route>
