import CacheManager from '../utilities/cache-manager'
import fetcher from '../shared/fetcher'
import { log } from '../utilities/logger'
import chalk from 'chalk'

const cacheManager = new CacheManager()

const AFAR = (url, serverReplyObject, cacheKey = false) => {
  const reply = serverReplyObject
  fetcher(url)
    .then(resp => {
      if (!resp.ok) {
        throw {
          // Fetch library properties
          name: 'FetchError',
          type: 'http-error',
          // Traditional request properties
          status: resp.status,
          statusText: resp.statusText,
          // Tapestry properties
          message: resp.statusText,
          code: resp.status
        }
      } else {
        return resp
      }
    })
    .then(resp => resp.json())
    .then(resp => {
      log.debug(`API response via HTTP for ${chalk.green(url)}`)
      reply(resp)

      // We can only get here if there's nothing cached
      // Put the response into the cache using the request path as a key
      if (cacheKey) {
        const cache = cacheManager.getCache('api')
        log.debug(`Cache set ${chalk.green(cacheKey)} in api`)
        log.silly(`Cache set for ${cacheKey}`)
        cache.set(cacheKey, { response: resp })
      }
    })
    .catch(error => {
      log.debug(
        `AFAR is replying with HTTP error:\n`,
        error,
        `\nError was just handled for ${url}`
      )
      reply(error).code(error.status)
    })
}

export default AFAR
