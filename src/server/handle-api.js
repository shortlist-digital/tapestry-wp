
import LRU from 'lru-cache'
import fetch from 'isomorphic-fetch'


export default ({ server, config }) => {

  // Create a new cache | 100 requests only, expire after 2 minutes
  const cache = LRU({
    max: 100,
    maxAge: 1000*60*2
  })

  server.on('reset-cache', cache.reset)

  server.route({
    method: 'GET',
    path: '/api/v1/{query*}',
    handler: (req, reply) => {
      const remote = `${config.siteUrl}/wp-json/wp/v2/${req.params.query}${req.url.search}`
      // Look for a cached response - maybe undefined
      const cacheResponse = cache.get(remote)
      // If we find a response in the cache send it back
      if (cacheResponse) {
        reply(cacheResponse)
      } else {
        fetch(remote)
          .then(response => response.json())
          .then(resp => {
            const data = ('0' in resp) || resp instanceof Array ?
              resp[0] :
              resp
            // We can only get here if there's nothing cached
            // Put the response into the cache using the request path as a key
            cache.set(remote, data)
            reply(data)
          })
      }
    }
  })
}
