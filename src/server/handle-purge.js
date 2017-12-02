import chalk from 'chalk'
import { match } from 'react-router'
import HTTPStatus from 'http-status'

import RouteWrapper from '../shared/route-wrapper'

import { log } from '../utilities/logger'
import CacheManager from '../utilities/cache-manager'
import resolvePaths from '../utilities/resolve-paths'

const cacheManager = new CacheManager()
const purgePath = process.env.SECRET_PURGE_PATH || 'purge'

const clearCacheItem = ({ path, endpoint }) => {
  log.debug(`Purge path ${chalk.green(path)} mapped to ${chalk.green(endpoint)}`)
  cacheManager.clearCache('api', endpoint)
  cacheManager.clearCache('html', path)
}

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

        resolvePaths({
          paths: renderProps.components[1].endpoint,
          params: renderProps.params,
          cb: endpoint => clearCacheItem({ endpoint, path })
        })

        reply({ status: `Purged ${path}` }, HTTPStatus.OK)
      })
    }
  })
}
