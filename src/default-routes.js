import React, { PropTypes } from 'react'
import { Route } from 'react-router'
import CategoriesLoader from './loader-categories'
import PostLoader from './loader-post'
import PageLoader from './loader-page'
import HomeLoader from './loader-home'

const DefaultRoutes = ({ Category, Post, Page, Home }) =>
  <div>
    <Route
      path='/'
      component={HomeLoader}
      tag={Home} />
    <Route
      path='about/:slug'
      component={PageLoader}
      tag={Page} />
    <Route
      path=':category(/:subcategory)'
      component={CategoriesLoader}
      tag={Category} />
    <Route
      path=':category(/:subcategory)/:slug/:id'
      component={PostLoader}
      tag={Post} />
  </div>

DefaultRoutes.propTypes = {
  Category: PropTypes.element,
  Home: PropTypes.element,
  Page: PropTypes.element,
  Post: PropTypes.element
}

export default DefaultRoutes
