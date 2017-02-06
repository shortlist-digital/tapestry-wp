import fs from 'fs-extra'
import path from 'path'
import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { match } from 'react-router'
import Helmet from 'react-helmet'
import { renderStaticOptimized } from 'glamor/server'

import { Server } from 'hapi'
import h2o2 from 'h2o2'
import Inert from 'inert'
import AsyncProps, { loadPropsOnServer } from 'async-props'

import { has, isEmpty } from 'lodash'
import { minify } from 'html-minifier'

import DefaultRoutes from './default-routes'
import DefaultHTML from './default-html'

import { success, error } from './logger'


export default class Tapestry {

  constructor ({ config, cwd, env, configPath }, { silent }) {
    // allow access from class
    this.config = config.default
    this.configPath = configPath
    this.context = cwd
    this.env = env
    this.silent = silent
    // override defaults
    this.assets = null
    if (env === 'production')
      this.assets = fs.readJsonSync(path.resolve(cwd, '.tapestry/assets.json'))
    // run server
    this.bootServer()
    this.registerProxies()
    // set routes
    this.routeApi()
    this.routeStatic()
    this.routeDynamic()
    this.startServer()
  }

  registerProxies () {
    if (this.config.proxyPaths)
      this.config.proxyPaths.map(this.routeProxy.bind(this))
  }

  bootServer () {
    // create new Hapi server and register required plugins
    this.server = new Server()
    this.server.register([h2o2, Inert])
    this.server.connection({
      host: this.config.host || '0.0.0.0',
      port: this.config.port || process.env.PORT || 3030
    })
    this.config.serverUri = this.server.info.uri
  }
  startServer () {
    // run server
    this.server.start(err => {
      if (err) error(err)
      if (!this.silent) success(`Server ready: ${this.server.info.uri}`)
    })
  }

  routeApi () {
    this.server.route({
      method: 'GET',
      path: `/api/v1/{query*}`,
      handler: {
        proxy: {
          mapUri: (request, callback) => {
            const url = this.config.siteUrl + '/wp-json/wp/v2/' + request.params.query + request.url.search
            callback(null, url)
          }
        }
      }
    })
  }
  routeProxy (path) {
    this.server.route({
      method: 'GET',
      path: `${path}`,
      handler: {
        proxy: {
          uri: this.config.siteUrl + path,
          passThrough: true
        }
      }
    })
  }
  routeStatic () {
    this.server.route({
      method: 'GET',
      path: '/_scripts/{param*}',
      handler: {
        directory: {
          path: '_scripts'
        }
      }
    })
    this.server.route({
      method: 'GET',
      path: '/public/{param*}',
      handler: {
        directory: {
          path: 'public'
        }
      }
    })
  }
  routeDynamic () {
    this.server.route({
      method: 'GET',
      path: '/{path*}',
      handler: (request, reply) => {

        if (this.env === 'development') {
          // clear the cached modules in memory
          Object
            .keys(require.cache)
            .forEach(key => delete require.cache[key])
          // re-require that config from the parent project to get the latest
          const updatedConfig = require(this.configPath).default
          // combine with previously set values (serverUri etc.)
          Object.assign(this.config, updatedConfig)
        }

        match({
          routes: DefaultRoutes(this.config.components || {}),
          location: request.url.path
        }, (error, redirectLocation, renderProps) => {

          // 500 if error from Router
          if (error)
            return reply(error.message).code(500)

          // 301/2 if redirect
          if (redirectLocation)
            return reply.redirect(redirectLocation)

          // 404 if no Router match
          if (!renderProps)
            return reply('No matched Route').code(404)

          // define global deets for nested components
          const loadContext = this.config

          // get all the props yo
          loadPropsOnServer(renderProps, loadContext, (err, asyncProps) => {

            // 404 if no data from API, yeah sorry for this, I'll change it
            if (isEmpty(asyncProps))
              return reply('No API data').code(404)
            if (has(asyncProps.propsArray[0], 'resp') && isEmpty(asyncProps.propsArray[0].resp))
              return reply('No API data').code(404)
            if (has(asyncProps.propsArray[0], 'data') && isEmpty(asyncProps.propsArray[0].data))
              return reply('No API data').code(404)

            // 500 if error from AsyncProps
            if (err)
              return reply(err).code(500)

            // get html from props
            const data = {
              markup: renderStaticOptimized(() =>
                renderToString(
                  <AsyncProps
                    {...renderProps}
                    {...asyncProps}
                    loadContext={loadContext} />
                )
              ),
              head: Helmet.rewind(),
              assets: this.assets,
              asyncProps
            }

            // render html with data
            const html = renderToStaticMarkup(
              <DefaultHTML {...data} />
            )

            reply(
              minify(`<!doctype html>${html}`, {
                minifyCSS: true
              })
            ).code(200)
          })
        })
      }
    })
  }
}
