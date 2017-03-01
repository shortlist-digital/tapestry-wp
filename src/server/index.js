import fs from 'fs-extra'
import path from 'path'
import { Server } from 'hapi'
import h2o2 from 'h2o2'
import Inert from 'inert'

import { success, error } from '../utilities/logger'
import handleStatic from './handle-static'
import handleApi from './handle-api'
import handleDynamic from './handle-dynamic'
import handleProxies from './handle-proxies'


export default class Tapestry {

  constructor ({ config, cwd, env }, { silent } = {}) {

    // allow access from class
    this.config = config
    this.silent = silent

    // get client bundle data
    if (env !== 'test') {
      const assetsPath = path.resolve(cwd, '.tapestry', 'assets.json')
      this.assets = fs.ensureFileSync(assetsPath)
    }

    // create server instance
    this.server = this.bootServer()

    // handle server routing
    const data = {
      server: this.server,
      config: this.config,
      assets: this.assets
    }
    handleStatic(data)
    handleApi(data)
    handleProxies(data)
    handleDynamic(data)

    // kick off server
    this.startServer()
  }

  bootServer () {
    // create new Hapi server and register required plugins
    const server = new Server()
    server.register([h2o2, Inert])
    server.connection({
      host: this.config.host || '0.0.0.0',
      port: this.config.port || process.env.PORT || 3030
    })
    this.config.serverUri = server.info.uri
    return server
  }
  startServer () {
    // run server
    this.server.start(err => {
      if (err)
        error(err)
      if (!this.silent)
        success(`Server ready: ${this.server.info.uri}`)
    })
  }
}
