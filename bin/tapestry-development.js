#!/usr/bin/env node

const path = require('path')
const createCompilers = require('../src/utilities/create-compilers')
const log = require('../src/utilities/logger')
const notify = log.notify
const winston = log.default
const cwd = process.cwd()
const env = 'development'

module.exports = () => {

  notify(`Preparing Tapestry… \n`)

  // create webpack node compilers
  const {
    serverCompiler,
    clientCompiler
  } = createCompilers({ cwd, env })

  // set flag to track server status
  let serverBooted = false

  // run server webpack build
  serverCompiler.run(err => {
    if (err) {
      winston.error(err)
      process.exit(0)
    }
    // run client webpack build when complete as a watch command
    clientCompiler.watch({}, err => {
      if (err) {
        winston.error(err)
        process.exit(0)
      }
      // boot server if not already running
      if (!serverBooted) {
        // server path relative to root
        const serverPath = path.resolve(cwd, '.tapestry/server.js')
        // require server and boot
        const server = require(serverPath).default
        server({ cwd, env })
        serverBooted = true
      }
    })
  })
}
