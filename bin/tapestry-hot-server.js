#!/usr/bin/env node
const nodemon = require('nodemon')
const path = require('path')
const createCompilers = require('../src/utilities/create-compilers')
const log = require('../src/utilities/logger')

const notify = log.notify
const winston = log.default
const cwd = process.cwd()
const env = 'development'
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
        script: path.resolve(
          cwd,
          'node_modules',
          'tapestry-wp',
          'bin',
          '_scripts',
          'boot-server.js'
        ),
        watch: path.resolve(cwd, '.tapestry')
      }).on('quit', process.exit)
    }
    serverBooted = true
  })
}
