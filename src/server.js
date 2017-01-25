import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { match } from 'react-router'
import Helmet from 'react-helmet'
import { renderStaticOptimized } from 'glamor/server'

import { Server } from 'hapi'
import h2o2 from 'h2o2'
import Inert from 'inert'
import AsyncProps, { loadPropsOnServer } from 'async-props'

import DefaultRoutes from './default-routes'
import DefaultHTML from './default-html'


export default class Tapestry {

  constructor ({ config, cwd }) {
    // allow access from class
    this.config = config.default
    this.context = cwd
    // override defaults
    this.routes = this.config.routes || DefaultRoutes
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
      port: process.env.PORT || 3030
    })
    this.config.serverUri = this.server.info.uri
  }
  startServer () {
    // run server
    this.server.start(err => {
      if (err) {
        console.error(err)
        return
      }
      console.log(`🌎  Server running at: ${this.server.info.uri} 👍`)
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
            callback(null, url);
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
  }
  routeDynamic () {
    this.server.route({
      method: 'GET',
      path: '/{path*}',
      handler: (request, reply) => {
        match({
          routes: this.routes(this.config.components || {}),
          location: request.url.path
        }, (error, redirectLocation, renderProps) => {
          // 404 if error from Hapi
          if (error) return reply(error.message)
          // 404 if no props
          if (!renderProps) reply(404)
          // define global deets for nested components
          const loadContext = this.config
          // get all the props yo
          loadPropsOnServer(renderProps, loadContext, (err, asyncProps) => {
            // 404 if error from Hapi
            if (err) {
              console.error(err)
              return
            }
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
              asyncProps
            }
            // render html with data
            const html = renderToStaticMarkup(
              <DefaultHTML {...data} />
            )
            reply(`<!doctype html>${html}`)
          })
        })
      }
    })
  }
}
