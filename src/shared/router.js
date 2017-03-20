import React from 'react'
import { Route } from 'react-router'
import defaultRoutes from '../constants/default-routes'
import fetchData from './fetch-data'

const Router = (config) => {
  // if user routes have been defined, take those in preference to the defaults
  const routes = config.routes || defaultRoutes(config.components)
  // loops over routes and return react-router <Route /> components
  return routes.map((route, i) => {
    // cancel if component not defined in user config, joi will validate user routes for component/path keys
    if (!route.component) {
      return null
    }
    // default routes require an endpoint, assign it to the function
    // if custom routes have an endpoint
    if (!route.component.endpoint && route.endpoint) {
      route.component.endpoint = route.endpoint
    }
    // on 'route' event:
    // 'getComponent' will fetch the component async
    // 'component' will read the component from the bundle
    const component = route.getComponent ?
    {
      getComponent: (loc, cb) => route
        .getComponent()
        .then(module => cb(null, fetchData(module.default)))
        .catch(err => cb(err))
    } : {
      component: fetchData(route.component)
    }
    // return individual route
    return (
      <Route
        key={i}
        path={route.path}
        {...component}
      />
    )
  })
}

export default Router
