#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const WebpackDevServer = require('webpack-dev-server')
const createCompilers = require('../src/utilities/create-compilers')
const log = require('../src/utilities/logger')
const notify = log.notify
const winston = log.default

const cwd = process.cwd()
const env = 'development'

module.exports = () => {

  notify('Starting Webpack Hot Reload Server\n')

  const indexFilePath = path.resolve(
    __dirname,
    '../',
    'src',
    'webpack',
    'index.html'
  )

  const tapestryFaviconFilePath = path.resolve(
    __dirname,
    '../',
    'logo',
    'favicon.ico'
  )

  const projectFaviconFilePath = path.resolve(
    cwd,
    'public',
    'favicon.ico'
  )

  // create webpack node compilers
  const {
    devCompiler
  } = createCompilers({ cwd, env })

  let cmsTarget = process.argv[2]

  if (!cmsTarget) {
    return winston.error('FAILED: No CMS endpoint provided - [Usage: tapestry http://cms.url.com]')
  }

  let rewritePath = '/wp-json/wp/v2'
  const isWordpressCom = cmsTarget.indexOf('wordpress.com') !== -1

  if (isWordpressCom) {
    const domain = cmsTarget.replace(/^https?:\/\//i, "")
    rewritePath = `/wp/v2/sites/${domain}`
    cmsTarget = 'https://public-api.wordpress.com'
  }


  const server = new WebpackDevServer(devCompiler, {
    stats: {
      colors: true
    },
    hot: true,
    publicPath: '/_assets/',
    proxy: {
      '/api/v1/**': {
        target: cmsTarget,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api/v1': rewritePath
        }
      }
    },
    setup: (app) => {
      app.get('/favicon.ico', (req, res) => {
        if (!fs.existsSync(projectFaviconFilePath)) {
          res.sendFile(tapestryFaviconFilePath)
        } else {
          res.redirect('/public/favicon.ico')
        }
      })
      app.get(/^(?!\/api\/|\/public\/|\/_assets\/).+/, (req, res) => {
        res.sendFile(indexFilePath)
      })
    }
  })

  server.listen(8080, '127.0.0.1',() => {
    notify('Tapestry Hot Dev Server started on http://localhost:8080')
  })
}
