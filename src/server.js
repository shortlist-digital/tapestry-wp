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

import DefaultRoutes from './default-routes'
import DefaultHTML from './default-html'

import { renderHtml, renderError } from './render'

import { success, error, info } from './logger'
import prettyjson from 'prettyjson'


export default class Tapestry {

  constructor ({ config, cwd, env }) {
    // allow access from class
    this.config = config.default
    this.context = cwd
    this.env = env
    // override defaults
    this.routes = this.config.routes || DefaultRoutes
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
      port: process.env.PORT || 3030
    })
    this.config.serverUri = this.server.info.uri
  }
  startServer () {
    // run server
    this.server.start(err => {
      if (err) error(err)
      success(`Server ready: ${this.server.info.uri}`)
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

        match({
          routes: this.routes(this.config.components || {}),
          location: request.url.path
        }, (error, redirectLocation, renderProps) => {

          // 500 if error from Router
          if (error)
            return reply(error.message).code(500)

          // 301/2 if redirect
          if (redirectLocation)
            return reply.redirect(redirectLocation)

          // define global deets for nested components
          const loadContext = this.config

          // get all the props yo
          loadPropsOnServer(renderProps, loadContext, (err, asyncProps) => {

            // if (isEmpty(asyncProps.propsArray))
            //   return reply(renderError({ loadContext }))

            // const data = {renderProps, loadContext, err, asyncProps}

            // const has404ed = asyncProps.propsArray[0].data

            // console.log(asyncProps.propsArray[0])

            // if (isEmpty(asyncProps))
            //   return reply(
            //     renderError({ loadContext })
            //   ).code(404)

            // if (asyncProps.propsArray[0] &&
            //   (asyncProps.propsArray[0].data.data.status < 200 ||
            // asyncProps.propsArray[0].data.data.status > 300))
            //   return reply(
            //     renderError({
            //       loadContext,
            //       error: asyncProps.propsArray[0].data
            //     })
            //   ).code(404)

            // 500 if error from AsyncProps
            if (err)
              return reply(err).code(500)

            // 200 with rendered HTML
            reply(
              renderHtml({
                renderProps,
                loadContext,
                asyncProps,
                assets: this.env === 'production' ? this.assets : null
              })
            ).code(200)

            // // get html from props
            // const data = {
            //   markup: renderStaticOptimized(() =>
            //     renderToString(
            //       <AsyncProps
            //         {...renderProps}
            //         {...asyncProps}
            //         loadContext={loadContext} />
            //     )
            //   ),
            //   head: Helmet.rewind(),
            //   assets: this.env === 'production' ? this.assets : null,
            //   asyncProps
            // }
            //
            // // render html with data
            // const html = renderToStaticMarkup(
            //   <DefaultHTML {...data} />
            // )
            //
            // reply(`<!doctype html>${html}`).code(200)
          })
        })
      }
    })
  }
}
