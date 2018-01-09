#!/usr/bin/env node
const path = require('path')
const nodemon = require('nodemon')
const log = require('../src/utilities/logger')
const createCompilers = require('../src/utilities/create-compilers')
const notify = log.notify
const cwd = process.cwd()
const env = 'development'
const winston = log.default

let serverBooted = false

module.exports = () => {

  notify(`Building Tapestry… \n`)

  // create webpack node compilers
  const { serverCompiler } = createCompilers({ cwd, env })

  // run server webpack build
  serverCompiler.watch({}, err => {
    if (err) {
      winston.error(err)
      process.exit(0)
    }
    if (!serverBooted) {
      nodemon({
        script: './node_modules/tapestry-wp/bin/_nodemon-hot-server.js',
        watch: path.resolve(cwd, '.tapestry')
      }).on('quit', process.exit)
    }
    serverBooted = true
  })
}
