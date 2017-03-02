import React, { PropTypes } from 'react'
import { Route } from 'react-router'

import CategoriesLoader from './loader-categories'
import PostLoader from './loader-post'
import PageLoader from './loader-page'
import FrontPageLoader from './loader-front-page'
import MissingView from './missing-view'


const DefaultRoutes = ({
  components = {},
  routes = []
}) => {

  // access components from config
  const {
    Category,
    FrontPage,
    Page,
    Post
  } = components
  const Error = components.Error || MissingView

  // return Route with component directly
  const renderStaticRoute = (route, i) =>
    <Route
      component={route.component}
      key={i}
      path={route.path} />

  return (<div>
    {
      routes.map(renderStaticRoute)
    }
    <Route
      path='/'
      component={FrontPageLoader}
      tag={FrontPage}
      fallback={Error} />
    <Route
      path='about/:slug'
      component={PageLoader}
      tag={Page}
      fallback={Error} />
    <Route
      path=':category(/:subcategory)'
      component={CategoriesLoader}
      tag={Category}
      fallback={Error} />
    <Route
      path=':category(/:subcategory)/:slug/:id'
      component={PostLoader}
      tag={Post}
      fallback={Error} />
    <Route
      path='*'
      component={Error} />
  </div>)
}

DefaultRoutes.propTypes = {
  components: PropTypes.shape({
    Category: PropTypes.element,
    FrontPage: PropTypes.element,
    Page: PropTypes.element,
    Post: PropTypes.element,
    Error: PropTypes.element
  }).isRequired,
  routes: PropTypes.array
}

export default DefaultRoutes