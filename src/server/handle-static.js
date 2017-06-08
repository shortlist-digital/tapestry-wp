
export default ({ server }) => {

  // Default favicon redirect
  server.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: (request, reply) => {
      reply
        .redirect('/public/favicon.ico')
        .permanent()
        .rewritable(false)
    }
  })

  // Static folders
  const staticPaths = ['_scripts', 'public']

  staticPaths.map(path => {
    server.route({
      method: 'GET',
      path: `/${path}/{param*}`,
      handler: {
        directory: {
          path: path
        }
      }
    })
  })

}
