import { match } from 'react-router'
import { loadPropsOnServer } from 'async-props'
import has from 'lodash/has'
import idx from 'idx'
import chalk from 'chalk'

import RouteWrapper from '../shared/route-wrapper'
import { renderHtml } from './render'
import log from '../utilities/logger'
import CacheManager, { stripLeadingTrailingSlashes } from '../utilities/cache-manager'
let cacheManager = new CacheManager()

export default ({ server, config, assets }) => {

  // Create a new cache
  const cache = cacheManager.createCache('html')

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: (request, reply) => {

      match({
        routes: RouteWrapper(config),
        location: request.url.path
      }, (err, redirectLocation, renderProps) => {

        // 500 if error from Router
        if (err) {
          log.error(err)
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

        loadContext.location = renderProps.location

        // get all the props yo
        loadPropsOnServer(renderProps, loadContext, (err, asyncProps) => {
          // 500 if error from AsyncProps
          if (err) {
            log.error(err)
            return reply(err).code(500)
          }

          let status = 200

          const failApi = has(asyncProps.propsArray[0], 'data.data.status')
          const failRoute = renderProps.routes[1].path === '*'
          const cacheKey = stripLeadingTrailingSlashes(request.url.path)

          if (failApi || failRoute)
            status = 404

          // Find HTML based on path - might be undefined
          const cachedHTML = cache.get(cacheKey)
          log.debug(`Cache attempting to access ${chalk.green(cacheKey)} in HTML: ${Boolean(cachedHTML)}`)

          // respond with HTML from cache if not undefined
          if (cachedHTML) {
            log.debug(`HTML rendered from cache for ${chalk.green(cacheKey)}`)
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
            log.debug(`HTML rendered from scratch for ${chalk.green(cacheKey)}`)
            reply(html).code(status)

            // We can only get here if there's nothing cached for this URL path
            // Bung the HTML into the cache, if not a preview link
            const isPreview = idx(renderProps, _ => _.location.query.tapestry_hash)

            if (!isPreview) {
              log.debug(`Cache set ${chalk.green(cacheKey)} in HTML`)
              cache.set(cacheKey, html)
              log.debug(`Cache has ${chalk.green(cache.keys())} in HTML`)
            }
          }
        })
      })
    }
  })
}
