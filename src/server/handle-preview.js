import chalk from 'chalk'
import fetch from 'isomorphic-fetch'
import logger from '../utilities/logger'

export default ({ server, config }) => {

  server.route({
    method: 'GET',
    path: '/api/preview/v1/{query*}',
    handler: (req, reply) => {

      const base = `${config.siteUrl}/wp-json/revision/v1`
      const path = `${req.params.query}${req.url.search}`
      const remote = `${base}/${path}`

      logger.debug(`Preview: Server loading API response over HTTP for ${chalk.green(remote)}`)

      fetch(remote)
        .then(resp => resp.json())
        .then(resp => {
          logger.debug(`Preview: Server returned a fresh API response over HTTP for ${chalk.green(remote)}`)
          reply(resp)
        })
        .catch(err => logger.error(err))
    }
  })
}
