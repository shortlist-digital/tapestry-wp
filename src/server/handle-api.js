import axios from 'axios'
import CacheManager from '../utilities/cache-manager'
import { logErrorObject } from '../utilities/logger'

export default ({ server, config }) => {

  // Create a new cache | 100 requests only, expire after 2 minutes
  const cache = CacheManager.createCache('api')

  server.route({
    method: 'GET',
    path: '/api/v1/{query*}',
    handler: (req, reply) => {
      const remote = `${config.siteUrl}/wp-json/wp/v2/${req.params.query}${req.url.search}`
      // Look for a cached response - maybe undefined
      const cacheRecord = cache.get(remote)
      // If we find a response in the cache send it back
      if (cacheRecord) {
        const response = reply(cacheRecord.response)
        if (cacheRecord.contentLength) {
          response.header('X-Content-Length', cacheRecord.contentLength)
        }
        return response
      } else {
        axios.get(remote)
          .then(resp => {
            // catch server error
            if (resp.statusText !== 'OK') throw new Error(resp)
            return resp
          })
          .then(resp => {
            const contentLength = resp.headers['content-length'] || resp.headers['Content-Length'] || null
            // We can only get here if there's nothing cached
            // Put the response into the cache using the request path as a key
            cache.set(remote, {
              response: resp.data,
              contentLength: contentLength
            })
            const response = reply(resp.data)
            if (contentLength) {
              response.header('X-Content-Length', contentLength)
            }
            return response
          })
          .catch(error => {
            logErrorObject(error)
          })
      }
    }
  })
}
