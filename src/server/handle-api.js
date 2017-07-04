import chalk from 'chalk'
import fetch from 'isomorphic-fetch'
import CacheManager, { normalizePath } from '../utilities/cache-manager'
import log from '../utilities/logger'

let cacheManager = new CacheManager()

export default ({ server, config }) => {

  // Create a new cache | 100 requests only, expire after 2 minutes
  const cache = cacheManager.createCache('api')

  server.route({
    method: 'GET',
    path: '/api/v1/{query*}',
    handler: (req, reply) => {

      const base = `${normalizePath(config.siteUrl)}/wp-json/wp/v2`
      const path = `${req.params.query}${req.url.search}`
      const remote = `${base}/${path}`
      const cacheKey = normalizePath(path)

      // Look for a cached response - maybe undefined
      const cacheRecord = cache.get(cacheKey)
      log.debug(`Cache attempting to access ${chalk.green(cacheKey)} in API: ${Boolean(cacheRecord)}`)

      // If we find a response in the cache send it back
      if (cacheRecord) {

        log.debug(`API response via cache for ${chalk.green(cacheKey)}`)
        reply(cacheRecord.response)

      } else {

        fetch(remote)
          .then(resp => resp.json())
          .then(resp => {

            log.debug(`API response via HTTP for ${chalk.green(path)}`)
            reply(resp)

            // We can only get here if there's nothing cached
            // Put the response into the cache using the request path as a key
            log.debug(`Cache set ${chalk.green(cacheKey)} in API`)
            cache.set(cacheKey, { response: resp })
            log.debug(`Cache has ${chalk.green(cache.keys())} in API`)
          })
          .catch(error => log.error(error))
      }
    }
  })
}
