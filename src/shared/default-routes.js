import React, { PropTypes } from 'react'
import { Route } from 'react-router'
import MissingView from './missing-view'
import fetchData from '../fetch-data'

const DefaultRoutes = ({
  components = {},
  routes = []
}) => {

  const Error = components.Error || MissingView

  // return static Route with component directly
  const renderStaticRoute = (route, i) => {
    // on 'route' event:
    // getComponent will fetch the component async
    // component will read the component from the bundle
    const component = route.getComponent ?
      { getComponent: (loc, cb) => route.getComponent(loc, cb) } :
      { component: route.component }
    // return static route with async or bundled component
    return (
      <Route
        key={i}
        path={route.path}
        {...component} />
    )
  }

  const {
    FrontPage,
    Page,
    Category,
    Post
  } = components

  return (
    <div>
      {
        routes.map(renderStaticRoute)
      }
      <Route
        path='/'
        component={fetchData(FrontPage || Page || Error)}  />
      <Route
        path=':page(/:subpage)'
        component={fetchData(Page || MissingView)} />
      <Route
        path='/category/:category(/:subcategory)'
        component={fetchData(Category || MissingView)} />
      <Route
        path='/:year/:monthnum/:day/:postname'
        component={fetchData(Post || MissingView)} />
      <Route
        path='*'
        component={Error} />
    </div>
  )
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
