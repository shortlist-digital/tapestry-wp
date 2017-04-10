import { match } from 'react-router'
import RouteWrapper from '../shared/route-wrapper'
const purgePath = process.env.SECRET_PURGE_PATH || 'purge'

export default ({ server, config }) => {
  const calculateApiRoute = (path, cb) => {
    match({
      routes: RouteWrapper(config),
      location: path
    }, (err, redirectLocation, renderProps) => {
      // The HOC data loader component is always at index [1] while there is progres bar
      let endpoint = renderProps.components[1].endpoint
      if (typeof endpoint == 'function') {
        endpoint = endpoint(renderProps.params)
      }
      cb(endpoint)
    })
  }

  server.route({
    method: 'GET',
    path: `/${purgePath}/{path*}`,
    handler: (request, reply) => {
      calculateApiRoute(request.params.path, (apiRoute) => {
        const remote = `${config.siteUrl}/wp-json/wp/v2/${apiRoute}`
        server.emit('purge-html-cache-by-key', `/${request.params.path}`)
        server.emit('purge-api-cache-by-key', `${remote}`)
        reply({status: `Purged ${request.params.path}`}, 200)
      })
    }
  })
}
