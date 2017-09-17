import chalk from 'chalk'
import fetch from 'isomorphic-fetch'
import { log } from '../utilities/logger'
import { stripLeadingTrailingSlashes } from '../utilities/cache-manager'
import fetchOptions from '../shared/fetch-options'

export default ({ server, config }) => {

  server.route({
    method: 'GET',
    path: '/api/preview/v1/{query*}',
    handler: (request, reply) => {

      const base = `${stripLeadingTrailingSlashes(config.siteUrl)}/wp-json/revision/v1`
      const path = `${request.params.query}${request.url.search}`
      const remote = `${base}/${path}`

      fetch(remote, fetchOptions)
        .then(resp => resp.json())
        .then(resp => {

          log.debug(`Preview API response via HTTP for ${chalk.green(remote)}`)
          reply(resp)
        })
        .catch(err => log.error(err))
    }
  })
}
