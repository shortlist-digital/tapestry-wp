import fs from 'fs'
import path from 'path'

const setRedirects = (server, redirects ) => {
  Object.keys(redirects).forEach(fromPath => {
    server.route({
      method: 'GET',
      path: `${fromPath}`,
      handler: (request, reply) => {
        reply
          .redirect(redirects[fromPath])
          .permanent()
          .rewritable(false)
      }
    })
  })
}

export default ({ server, config }) => {
  // Handle legacy redirect paths
  if (config.redirectPaths) {
    setRedirects(server, config.redirectPaths)
  }
  // Handle redirects.json
  const redirectsFile = path.resolve(process.cwd(), 'redirects.json')
  if (fs.existsSync(redirectsFile)) {
    const redirectsFromFile = JSON.parse(fs.readFileSync(redirectsFile, 'utf8'))
    setRedirects(server, redirectsFromFile)
  }
}
