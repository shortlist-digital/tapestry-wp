#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const throng = require('throng')
const log = require('../src/utilities/logger').log
const cwd = process.cwd()
const env = 'production'

module.exports = () => {

  const serverPath = path.resolve(cwd, '.tapestry/server.js')
  // detect scripts have been created before running server
  if (!fs.existsSync(serverPath)) {
    log.error('Tapestry scripts missing, make sure to run tapestry build before running')
    process.exit(0)
  }
  // require server and boot
  const server = require(serverPath).default
  if (process.env.ENABLE_CONCURRENCY) {
    const WORKERS = process.env.WEB_CONCURRENCY || require('os').cpus().length || 1
    throng(WORKERS, () => server({ cwd, env }))
  } else {
    server({ cwd, env })
  }
}
