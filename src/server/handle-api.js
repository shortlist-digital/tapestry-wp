import chalk from 'chalk'
import CacheManager, { stripLeadingTrailingSlashes } from '../utilities/cache-manager'
import { log } from '../utilities/logger'
import idx from 'idx'
import AFAR from './api-fetch-and-respond'

let cacheManager = new CacheManager()

const buildBaseUrl = config => {
  if (idx(config, _ => _.options.wordpressDotComHosting)) {
    // Remove protocol
    const noProtocolSiteUrl = config.siteUrl.replace(/^https?:\/\//i, "")
    const siteUrl = stripLeadingTrailingSlashes(noProtocolSiteUrl)
    return `https://public-api.wordpress.com/wp/v2/sites/${siteUrl}`
  } else {
    return `${stripLeadingTrailingSlashes(config.siteUrl)}/wp-json/wp/v2`
  }
}

export default ({ server, config }) => {

  // Create a new cache | 100 requests only, expire after 2 minutes
  const cache = cacheManager.createCache('api')

  server.route({
    method: 'GET',
    path: '/api/v1/{query*}',
    config: {
      cache: {
        expiresIn: (parseInt(process.env.CACHE_CONTROL_MAX_AGE, 10) || 0) * 1000, // 1 Minute
        privacy: 'public'
      }
    },
    handler: async (request, reply) => {

      const base = buildBaseUrl(config)
      const path = `${request.params.query}${request.url.search}`
      const remote = `${base}/${path}`
      const cacheKey = stripLeadingTrailingSlashes(path)
      log.silly(`API request with cacheKey ${cacheKey}`)

      // Look for a cached response - maybe undefined
      const cacheRecord = await cache.get(cacheKey)
      log.debug(`Cache contains ${chalk.green(cacheKey)} in api: ${Boolean(cacheRecord)}`)

      // If we find a response in the cache send it back
      if (cacheRecord) {
        log.debug(`API response via cache for ${chalk.green(cacheKey)}`)
        log.silly(`Retreived cache record: `, cacheRecord)
        reply(cacheRecord.response)

      } else {
        AFAR(remote, reply, cacheKey)
      }
    }
  })
}
