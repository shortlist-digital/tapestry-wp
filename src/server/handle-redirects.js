import fs from 'fs'
import path from 'path'
import fetcher from '../shared/fetcher'
import { log } from '../utilities/logger'

const setRedirects = (server, redirects) => {
  server.ext('onPreHandler', (request, reply) => {
    if (typeof redirects[request.url.pathname.toLowerCase()] !== "undefined")
    {
      return reply
        .redirect(`${redirects[request.url.pathname]}${request.url.search}`)
        .permanent()
        .rewritable(true)
    } else {
      reply.continue()
    }
  })
}

export default ({ server, config }) => {

  // Handle legacy redirects
  let redirects  = config.redirectPaths || {}

  const redirectsFile = path.resolve(process.cwd(), 'redirects.json')

  if (fs.existsSync(redirectsFile)) {
    const redirectsFromFile = JSON.parse(fs.readFileSync(redirectsFile, 'utf8'))
    setRedirects(server, Object.assign({}, redirects, redirectsFromFile))
  }

  if (config.redirectsEndpoint) {
    fetcher(`${config.redirectsEndpoint}?cacheBust=${Date.now()}`)
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
      .catch(err => {
        log.error(`Redirects Endpoint FAILED: `, err)
      })
  }
}
