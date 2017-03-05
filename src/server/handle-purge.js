const purgePath = process.env.SECRET_PURGE_PATH || 'purge'
export default ({ server }) => {
  server.route({
    method: 'GET',
    path: `/${purgePath}/{path*}`,
    handler: (request, reply) => {
      server.emit('purge-html-cache-by-key', `/${request.params.path}`)
      reply({status: `Purged ${request.params.path}`}, 200)
    }
  })
}
