import { match } from 'react-router'
import { loadPropsOnServer } from 'async-props'
import { has } from 'lodash'

import Routes from '../shared/router'
import { renderHtml } from './render'
import { error } from '../utilities/logger'
import CacheManager from '../utilities/cache-manager'

export default ({ server, config, assets }) => {

  // Create a new cache
  const cache = CacheManager.createCache('html')

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: (request, reply) => {

      match({
        routes: Routes(config),
        location: request.url.path
      }, (err, redirectLocation, renderProps) => {

        // 500 if error from Router
        if (err) {
          error(err)
          return reply(err.message).code(500)
        }

        // define global deets for nested components
        const loadContext = config

        // 404 if non-matched route
        if (!renderProps) {
          return reply(
            renderHtml({
              loadContext,
              assets
            })
          ).code(404)
        }

        // 301/2 if redirect
        if (redirectLocation)
          return reply.redirect(redirectLocation)

        // get all the props yo
        loadPropsOnServer(renderProps, loadContext, (err, asyncProps) => {
          // 500 if error from AsyncProps
          if (err) {
            error(err)
            return reply(err).code(500)
          }

          let status = 200

          const failApi = has(asyncProps.propsArray[0], 'data.data.status')
          const failRoute = renderProps.routes[1].path === '*'

          if (failApi || failRoute)
            status = 404

          // Find HTML based on path - might be undefined
          const cachedHTML = cache.get(request.url.path)

          // respond with HTML from cache if not undefined
          if (cachedHTML) {
            reply(cachedHTML).code(status)
          } else {
            // No HTML found for this path, or cache expired
            // Regenerate HTML from scratch
            const html = renderHtml({
              renderProps,
              loadContext,
              asyncProps,
              assets
            })

            // 200 with rendered HTML
            // We can only get here if there's nothing cached for this URL path
            // Bung the HTML into the cache
            cache.set(request.url.path, html)
            reply(html).code(status)
          }
        })
      })
    }
  })
}
