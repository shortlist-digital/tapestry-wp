import { Server } from 'hapi'
import h2o2 from 'h2o2'
import Inert from 'inert'
import idx from 'idx'

// Configure Logging
import winston from 'winston'
winston.level = process.env.LOG_LEVEL || 'info'
winston.cli()

import { success, errorObject } from '../utilities/logger'
import handleStatic from './handle-static'
import handleApi from './handle-api'
import handleDynamic from './handle-dynamic'
import handleProxies from './handle-proxies'
import handlePurge from './handle-purge'
import handleRedirects from './handle-redirects'
import CacheManager from '../utilities/cache-manager'

const cacheManager = new CacheManager

export default class Tapestry {

  constructor ({ config, assets = {} }, { silent } = {}) {

    // allow access from class
    this.config = config
    this.silent = silent

    // create server instance
    this.server = this.bootServer()

    // Important bit:
    this.server.ext('onPreResponse', (request, reply) => {
      request.response.headers &&
        (request.response.headers['X-Powered-By'] = 'Tapestry')
      reply.continue()
    })

    // Register server events
    // ----------
    // Register reset-cache event
    this.server.event('reset-cache')
    // Clear all caches on reset-cache event

    // handle server routing
    const data = {
      server: this.server,
      config: this.config,
      assets
    }
    handleRedirects(data)
    handleStatic(data)
    handlePurge(data)
    handleApi(data)
    handleProxies(data)
    handleDynamic(data)

    this.server.on('reset-cache', cacheManager.clearAll)

    // kick off server
    this.startServer()
  }

  bootServer () {
    const host = idx(this.config, _ => _.options.host)
    const port = idx(this.config, _ => _.options.port)
    // create new Hapi server and register required plugins
    const server = new Server()
    server.register([h2o2, Inert])
    server.connection({
      host: host || '0.0.0.0',
      port: process.env.PORT || port || 3030
    })
    this.config.serverUri = server.info.uri
    return server
  }
  startServer () {
    // run server
    this.server.start(err => {
      if (err) errorObject(err)
      if (!this.silent)
        success(`Server ready: ${this.server.info.uri}`)
    })
  }
}
