import fs from 'fs'
import path from 'path'
import fetch from 'isomorphic-fetch'
import { log } from '../utilities/logger'

const setRedirects = (server, redirects) => {
  Object
    .keys(redirects)
    .forEach(fromPath => {
      server.route({
        method: 'GET',
        path: `${fromPath}`,
        handler: (request, reply) => {
          reply
            .redirect(`${redirects[fromPath]}${request.url.search}`)
            .permanent()
            .rewritable(true)
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
  // Set redirects from a dynamic endpoint
  if (config.redirectsEndpoint) {
    fetch(config.redirectsEndpoint)
      .then(resp => {
        if (resp.status === 200) {
          return resp.json()
        } else {
          // Mimic fetch error API
          throw {
            name: 'FetchError',
            message: `Non 200 response ${resp.status}`,
            type: 'http-error'
          }
        }
      })
      .then(data => {
        setRedirects(server, data)
      })
      .catch(err => log.error(`Redirects Endpoint FAILED: ${JSON.stringify(err)}`))
  }
}
