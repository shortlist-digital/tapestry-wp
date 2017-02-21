import { match } from 'react-router'

import { loadPropsOnServer } from 'async-props'
import { has } from 'lodash'

import DefaultRoutes from '../shared/default-routes'
import { renderHtml } from './render'
import { error } from '../utilities/logger'

export default ({ server, config, assets }) => {

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: (request, reply) => {

      match({
        routes: DefaultRoutes(config.components || {}),
        location: request.url.path
      }, (err, redirectLocation, renderProps) => {

        // define global deets for nested components
        const loadContext = config

        // 404 if non-matched route
        if (!renderProps) {
          return reply(
            renderHtml({
              loadContext,
              assets: this.assets
            })
          ).code(404)
        }

        // 500 if error from Router
        if (err) {
          error(err)
          return reply(err.message).code(500)
        }

        // 301/2 if redirect
        if (redirectLocation)
          return reply.redirect(redirectLocation)

        // get all the props yo
        loadPropsOnServer(renderProps, loadContext, (err, asyncProps) => {
          let status = 200

          const failApi = has(asyncProps.propsArray[0], 'data.data.status')
          const failRoute = renderProps.routes[1].path === '*'

          if (failApi || failRoute)
            status = 404

          // 500 if error from AsyncProps
          if (err) {
            error(err)
            return reply(err).code(500)
          }

          // 200 with rendered HTML
          reply(
            renderHtml({
              renderProps,
              loadContext,
              asyncProps,
              assets
            })
          ).code(status)
        })
      })
    }
  })
}
