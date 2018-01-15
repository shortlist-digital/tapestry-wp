export default ({ server, config }) => {
  if (!config.proxyPaths) return

  config.proxyPaths.map(path => {
    server.route({
      method: 'GET',
      path: `${path}`,
      handler: {
        proxy: {
          uri: config.siteUrl + path,
          passThrough: true
        }
      }
    })
  })
}
