#!/usr/bin/env node

const createCompilers = require('../src/utilities/create-compilers')
const log = require('../src/utilities/logger')
const notify = log.notify
const winston = log.log
const cwd = process.cwd()
const env = 'production'

module.exports = () => {

  notify(`Building Tapestry… \n`)

  // create webpack node compilers
  const {
    serverCompiler,
    clientCompiler
  } = createCompilers({ cwd, env })

  // run server webpack build
  serverCompiler.run(err => {
    if (err) {
      winston.error(err)
      process.exit(0)
    }
    // run client webpack build
    clientCompiler.run(err => {
      if (err) {
        winston.error(err)
        process.exit(0)
      }
      notify(`Tapestry scripts built\n`)
    })
  })
}
