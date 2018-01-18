import React from 'react'
import { Route } from 'react-router'
import { generate as uid } from 'shortid'
import HTTPStatus from 'http-status'

import defaultRoutes from './default-routes'
import fetchData from './fetch-data'
import ProgressIndicator from './components/progress-indicator'
import RenderError from './render-error'

const ComponentWrapper = (component, route) => {
  // return component with AsyncProps wrapper if endpoint declared
  if (route.endpoint) {
    return fetchData(component, route)
  }
  component.options = route.options
  return component
}

const RouteWrapper = config => {
  // if user routes have been defined, take those in preference to the defaults
  const errorResponse = {
    code: HTTPStatus.NOT_FOUND,
    message: HTTPStatus[HTTPStatus.NOT_FOUND]
  }
  const routes = config.routes || defaultRoutes(config.components)
  const ErrorComponent = () =>
    RenderError({
      config,
      response: errorResponse
    })
  // loops over routes and return react-router <Route /> components
  return (
    <Route component={ProgressIndicator} config={config}>
      {routes.map(route => {
        // cancel if component not defined in user config, joi will validate user routes for component/path keys
        if (!route.component && !route.getComponent) {
          route.component = null
        }
        // on 'route' event:
        // 'getComponent' will fetch the component async
        // 'component' will read the component from the bundle
        const component = route.getComponent
          ? {
              getComponent: (loc, cb) =>
                route
                  .getComponent()
                  .then(module =>
                    cb(null, ComponentWrapper(module.default, route))
                  )
                  .catch(err => cb(err))
            }
          : {
              component: ComponentWrapper(route.component, route)
            }
        const onEnter = () => {
          // if we're not delaying load with AsyncProps and we're in the client
          if (!route.endpoint && typeof window !== 'undefined') {
            // reset scroll position
            window.scrollTo(0, 0)
            // run project callback
            if (typeof config.onPageUpdate === 'function') {
              config.onPageUpdate(null)
            }
          }
        }
        // return individual route
        return (
          <Route
            key={uid()}
            path={route.path}
            config={config}
            onEnter={onEnter}
            {...component}
          />
        )
      })}
      <Route path="*" component={ErrorComponent} />
    </Route>
  )
}

export default RouteWrapper
