
export default ({ server, config }) => {
  if (!config.redirectPaths) return

  Object.keys(config.redirectPaths).forEach(fromPath => {
    server.route({
      method: 'GET',
      path: `${fromPath}`,
      handler: (request, reply) => {
        reply
          .redirect(config.redirectPaths[fromPath])
          .permanent()
          .rewritable(false)
      }
    })
  })
}
