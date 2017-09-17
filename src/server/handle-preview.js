import chalk from 'chalk'
import { log } from '../utilities/logger'
import { stripLeadingTrailingSlashes } from '../utilities/cache-manager'
import fetcher from '../shared/fetcher'

export default ({ server, config }) => {

  server.route({
    method: 'GET',
    path: '/api/preview/v1/{query*}',
    handler: (request, reply) => {

      const base = `${stripLeadingTrailingSlashes(config.siteUrl)}/wp-json/revision/v1`
      const path = `${request.params.query}${request.url.search}`
      const remote = `${base}/${path}`

      fetcher(remote)
        .then(resp => resp.json())
        .then(resp => {

          log.debug(`Preview API response via HTTP for ${chalk.green(remote)}`)
          reply(resp)
        })
        .catch(err => log.error(err))
    }
  })
}
