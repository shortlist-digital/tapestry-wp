import { stripLeadingTrailingSlashes } from '../utilities/cache-manager'
import AFAR from './api-fetch-and-respond'

export default ({ server, config }) => {

  server.route({
    method: 'GET',
    path: '/api/preview/v1/{query*}',
    handler: (request, reply) => {
      const base = `${stripLeadingTrailingSlashes(config.siteUrl)}/wp-json/revision/v1`
      const path = `${request.params.query}${request.url.search}`
      const remote = `${base}/${path}`

      AFAR(remote, reply)
    }
  })
}
