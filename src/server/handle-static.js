
export default ({ server }) => {

  const cacheConfig = {
    // cache static assets for 1 year
    privacy: 'public',
    expiresIn: parseInt(process.env.STATIC_CACHE_CONTROL_MAX_AGE, 10) || 0
  }

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
      config: {
        cache: path === '_scripts' && cacheConfig
      },
      handler: {
        directory: {
          path: path
        }
      }
    })
  })

}
