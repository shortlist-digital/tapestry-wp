require('babel-register')({
  presets: ['es2015', 'react']
})

const config = require('./tapestry.config')
const tapestry = require('../dist/server.bundle').default

const cwd = process.cwd()

tapestry({
  cwd: cwd,
  env: 'development',
  config: config
})
