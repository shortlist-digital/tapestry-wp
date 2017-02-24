
export default ({ server }) => {

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
