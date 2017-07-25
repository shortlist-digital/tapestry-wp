import chalk from 'chalk'
import { match } from 'react-router'
import HTTPStatus from 'http-status'
import isFunction from 'lodash/isFunction'

import RouteWrapper from '../shared/route-wrapper'
import { log } from '../utilities/logger'
import CacheManager from '../utilities/cache-manager'

const cacheManager = new CacheManager()
const purgePath = process.env.SECRET_PURGE_PATH || 'purge'

export default ({ server, config }) => {

  server.route({
    method: 'GET',
    path: `/${purgePath}/{path*}`,
    handler: (request, reply) => {

      // as hapi strips the trailing slash
      const path = request.params.path || '/'

      match({
        routes: RouteWrapper(config),
        location: path
      }, (err, redirectLocation, renderProps) => {

        if (err) {
          return log.error(err)
        }

        let endpoint = renderProps.components[1].endpoint
        let pathToPurge = endpoint

        // resolve function if required
        if (isFunction(endpoint)) {
          pathToPurge = endpoint(renderProps.params)
        }

        log.debug(`Purge path ${chalk.green(path)} mapped to ${chalk.green(pathToPurge)}`)

        log.debug(`Cache clear ${chalk.green(pathToPurge)} in API`)
        cacheManager.clearCache('api', pathToPurge)

        log.debug(`Cache clear ${chalk.green(path)} in HTML`)
        cacheManager.clearCache('html', path)

        reply({
          status: `Purged ${path}`
        }, HTTPStatus.OK)
      })
    }
  })
}
