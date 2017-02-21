
export default ({ server, config }) => {

  server.route({
    method: 'GET',
    path: '/api/v1/{query*}',
    handler: {
      proxy: {
        mapUri: (req, cb) =>
          cb(null, `${config.siteUrl}/wp-json/wp/v2/${req.params.query}${req.url.search}`)
      }
    }
  })
}
