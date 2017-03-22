import React from 'react'
import { Route } from 'react-router'
import MissingView from './missing-view'
import defaultRoutes from './default-routes'
import fetchData from './fetch-data'
import shortid from 'shortid'

const maybeWrapComponent = (component, route) => {
  return route.endpoint ?
    fetchData(component, route.endpoint) :
    component
}

const RouteWrapper = (config) => {
  // if user routes have been defined, take those in preference to the defaults
  const routes = config.routes || defaultRoutes(config.components)
  // loops over routes and return react-router <Route /> components
  return (
    <div>
      {
        routes.map((route) => {
          // cancel if component not defined in user config, joi will validate user routes for component/path keys
          if (!route.component) {
            route.component = MissingView
          }
          // on 'route' event:
          // 'getComponent' will fetch the component async
          // 'component' will read the component from the bundle
          const component = route.getComponent ?
          {
            getComponent: (loc, cb) => route
            .getComponent()
            .then(module => cb(null, maybeWrapComponent(module.default, route)))
            .catch(err => cb(err))
          } : {
            component: maybeWrapComponent(route.component, route)
          }
          // return individual route
          return (
            <Route
              key={shortid.generate()}
              path={route.path}
              {...component}
            />
          )
        })
      }
    </div>
  )
}

export default RouteWrapper
