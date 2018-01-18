import normaliseUrlPath from '../utilities/normalise-url-path'
import AFAR from './api-fetch-and-respond'

export default ({ server, config }) => {
  server.route({
    method: 'GET',
    path: '/api/preview/v1/{query*}',
    handler: (request, reply) => {
      const base = `${normaliseUrlPath(config.siteUrl)}/wp-json/revision/v1`
      const path = `${request.params.query}${request.url.search}`
      const remote = `${base}/${path}`
      AFAR(remote, reply)
    }
  })
}
