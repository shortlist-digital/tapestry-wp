import { errorObject } from '../utilities/logger'

export default ({ server, config }) => {

  server.route({
    method: 'GET',
    path: '/api/preview/v1/{query*}',
    handler: (req, reply) => {
      const remote = `${config.siteUrl}/wp-json/revision/v1/${req.params.query}${req.url.search}`
      fetch(remote)
        .then(resp => resp.json())
        .then(resp => {
          reply(resp)
        })
        .catch(error => errorObject(error))
    }
  })
}
