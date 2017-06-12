import fetch from 'isomorphic-fetch'
import winston from 'winston'
import { errorObject } from '../utilities/logger'

export default ({ server, config }) => {

  server.route({
    method: 'GET',
    path: '/api/preview/v1/{query*}',
    handler: (req, reply) => {

      const base = `${config.siteUrl}/wp-json/revision/v1`
      const path = `${req.params.query}${req.url.search}`
      const remote = `${base}/${path}`

      winston.log('debug', `Server loading API response over HTTP for ${remote}`)

      fetch(remote)
        .then(resp => resp.json())
        .then(resp => {
          winston.log('debug', `Server returned a fresh API response over HTTP for ${remote}`)
          reply(resp)
        })
        .catch(error => errorObject(error))
    }
  })
}
