import chalk from 'chalk'
import fetch from 'isomorphic-fetch'
import CacheManager from '../utilities/cache-manager'
import log from '../utilities/logger'

let cacheManager = new CacheManager()

export default ({ server, config }) => {

  // Create a new cache | 100 requests only, expire after 2 minutes
  const cache = cacheManager.createCache('api')

  server.route({
    method: 'GET',
    path: '/api/v1/{query*}',
    handler: (req, reply) => {

      const base = `${config.siteUrl}/wp-json/wp/v2`
      const path = `${req.params.query}${req.url.search}`
      const remote = `${base}/${path}`
      // Look for a cached response - maybe undefined
      const cacheRecord = cache.get(remote)
      // If we find a response in the cache send it back
      if (cacheRecord) {
        log.debug(`Server loading API response from cache for ${chalk.green(remote)}`)
        reply(cacheRecord.response)
      } else {
        fetch(remote)
          .then(resp => resp.json())
          .then(resp => {
            // We can only get here if there's nothing cached
            // Put the response into the cache using the request path as a key
            cache.set(remote, {
              response: resp
            })
            log.debug(`Server returned a fresh API response over HTTP for ${chalk.green(remote)}`)
            reply(resp)
          })
          .catch(error => log.error(error))
      }
    }
  })
}
