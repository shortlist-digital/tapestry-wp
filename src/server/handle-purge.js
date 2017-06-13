import chalk from 'chalk'
import { match } from 'react-router'
import RouteWrapper from '../shared/route-wrapper'
import log from '../utilities/logger'
import CacheManager from '../utilities/cache-manager'
const cacheManager = new CacheManager()
const purgePath = process.env.SECRET_PURGE_PATH || 'purge'

export default ({ server, config }) => {
  const calculateApiRoute = (path, cb) => {
    match({
      routes: RouteWrapper(config),
      location: path
    }, (err, redirectLocation, renderProps) => {
      // The HOC data loader component is always at index [1] while there is progres bar
      let endpoint = renderProps.components[1].endpoint
      if (typeof endpoint == 'function') {
        endpoint = endpoint(renderProps.params)
      }
      log.debug(`Purge request for endpoint ${chalk.green(endpoint)}`)
      cb(endpoint)
    })
  }

  server.route({
    method: 'GET',
    path: `/${purgePath}/{path*}`,
    handler: (request, reply) => {
      calculateApiRoute(request.params.path, (apiRoute) => {

        log.debug(`Request: ${chalk.green(request.params.path)} mapped to API: ${apiRoute}`)
        const remote = `${config.siteUrl}/wp-json/wp/v2/${apiRoute}`

        log.debug(`Directly clearing html cache for ${chalk.green(request.params.path)}`)
        cacheManager.clearCache('html', request.params.path)

        log.debug(`Directly clearing api cache for ${chalk.green(remote)}`)
        cacheManager.clearCache('api', remote)

        reply({status: `Purged ${request.params.path}`}, 200)
      })
    }
  })
}
