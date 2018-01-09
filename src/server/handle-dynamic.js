import { match } from 'react-router'
import { loadPropsOnServer } from '../shared/third-party/async-props'
import idx from 'idx'
import chalk from 'chalk'
import HTTPStatus from 'http-status'

import RouteWrapper from '../shared/route-wrapper'
import handleApiResponse from '../shared/handle-api-response'
import renderHtml from './render'
import { log } from '../utilities/logger'
import CacheManager from '../utilities/cache-manager'
import normaliseUrlPath from '../utilities/normalise-url-path'

let cacheManager = new CacheManager()

export default ({ server, config, assets }) => {
  // Create a new cache
  const cache = cacheManager.createCache('html')

  server.route({
    config: {
      cache: {
        expiresIn:
          (parseInt(process.env.CACHE_CONTROL_MAX_AGE, 10) || 0) * 1000, // 1 Minute
        privacy: 'public'
      }
    },
    method: 'GET',
    path: '/{path*}',
    handler: (request, reply) => {
      const isPreview = idx(request, _ => _.query.tapestry_hash)
      match(
        {
          routes: RouteWrapper(config),
          location: normaliseUrlPath(request.url.path)
        },
        (err, redirectLocation, renderProps) => {
          // 500 if error from Router
          if (err) {
            log.error(err)
            return reply(err.message).code(HTTPStatus.INTERNAL_SERVER_ERROR)
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
            ).code(HTTPStatus.NOT_FOUND)
          }

          // 301/2 if redirect
          if (redirectLocation) return reply.redirect(redirectLocation)

          loadContext.location = renderProps.location

          // get all the props yo
          loadPropsOnServer(
            renderProps,
            loadContext,
            async (err, asyncProps) => {
              // 500 if error from AsyncProps
              if (err) {
                log.error({ err })
                return reply(err, HTTPStatus.INTERNAL_SERVER_ERROR)
              }

              const response = handleApiResponse(
                idx(asyncProps, _ => _.propsArray[0].data),
                renderProps.routes[1]
              )

              const status = idx(response, _ => _.code)
                ? response.code
                : HTTPStatus.OK

              const cacheKey = normaliseUrlPath(request.url.pathname)

              // Find HTML based on path - might be undefined
              const cachedHTML = await cache.get(cacheKey)
              log.debug(
                `Cache contains ${chalk.green(cacheKey)} in html: ${Boolean(
                  cachedHTML
                )}`
              )

              // respond with HTML from cache if not undefined
              if (cachedHTML && isPreview) {
                log.silly(
                  `HTML is in cache but skipped for preview ${chalk.green(
                    cacheKey
                  )}`
                )
              }
              if (cachedHTML && !isPreview) {
                log.debug(
                  `HTML rendered from cache for ${chalk.green(cacheKey)}`
                )
                reply(cachedHTML).code(status)
              } else {
                // No HTML found for this path, or cache expired
                // Regenerate HTML from scratch
                const html = renderHtml({
                  response,
                  renderProps,
                  loadContext,
                  asyncProps,
                  assets
                })

                // 200 with rendered HTML
                log.debug(
                  `HTML rendered from scratch for ${chalk.green(cacheKey)}`
                )
                if (isPreview) {
                  reply(html).header('cache-control', 'no-cache')
                } else {
                  reply(html).code(status)
                }

                // We can only get here if there's nothing cached for this URL path
                // Bung the HTML into the cache, if not a preview link

                if (!isPreview) {
                  log.debug(`Cache set ${chalk.green(cacheKey)} in html`)
                  cache.set(cacheKey, html)
                }
              }
            }
          )
        }
      )
    }
  })
}
