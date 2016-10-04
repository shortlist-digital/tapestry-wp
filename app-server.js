import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import Helmet from 'react-helmet'
import DefaultHTML from './default-html'
import Hapi from 'hapi'
import WP from 'wpapi'
import { Promise } from 'es6-promise'
import fetch from 'isomorphic-fetch'
import h2o2 from 'h2o2'
import Inert from 'inert'
import routes from './default-routes'
import AsyncProps, { loadPropsOnServer } from 'async-props'
import Webpack from 'webpack'
import WebpackPlugin from 'hapi-webpack-plugin'
import WebpackConfig from './webpack.config.babel.js'
import { StyleSheetServer } from 'aphrodite'


class Tapestry {

  constructor(config) {
    this.components = config.components
    this.siteUrl = config.siteUrl
    this.routes = config.routes || routes
    this.server = new Hapi.Server()
    this.server.register({
      register: h2o2
    })
    this.server.register(Inert, () => {})
    this.setupConnection({
      host: '0.0.0.0',
      port: process.env.PORT || 3030
    })
    this.setupServerRoutes()
  }

  setupConnection(connectionConfig) {
    this.server.connection(connectionConfig)
  }

  proxy(path) {
    this.proxyPaths = this.proxyPaths || []
    this.proxyPaths.push(path)
  }

  registerProxies() {
    this.proxyPaths.map((proxyPath, index) => {
      let url = this.siteUrl + proxyPath
      this.server.route({
        method: 'GET',
        path: `${proxyPath}`,
        handler: {
          proxy: {
            uri: url,
            passThrough: true
          }
        }
      })
    })
  }

  //  Catch-all routes
  setupServerRoutes () {
    // DEV SETUP
    if (process.env.NODE_ENV === 'development') {
    // Proxy webpack assets requests to webpack-dev-server
    // Note: in development webpack bundles are served from memory, not filesystem
      // this.server.route({
      //   method: 'GET',
      //   path: '/bundle.js', // this includes HMR patches, not just webpack bundle files
      //   handler: {
      //     proxy: {
      //       host: '0.0.0.0',
      //       port: '3050',
      //       passThrough: true
      //     }
      //   }
      // })
    }

    this.server.route({
      method: 'GET',
      path: '/public/{param*}',
      handler: {
        directory: {
          path: 'public'
        }
      }
    })

    this.server.route({
      method: 'GET',
      path: '/{path*}',
      handler: (request, reply) => {
        let routes = this.routes(this.components.Base)
        const url = request.url.path
        // Create Router
        match({ routes, location: url }, (error, redirectLocation, renderProps) => {
          // Hapi can handle promises
          if (error) return reply(error.message)
          if (renderProps) {
            let loadContext = {
              siteUrl: this.siteUrl,
              components: this.components
            }
            loadPropsOnServer(renderProps, loadContext, (err, asyncProps, scriptTag) => {
              let appData = {
                // Get our "inner app" markup
                markup: StyleSheetServer.renderStatic(() => {
                  return ReactDOMServer.renderToString(
                    <AsyncProps {...renderProps} {...asyncProps} loadContext={loadContext}/>
                  )
                }),
                // Pull out the <head> data to pass to our "outer app html"
                head: Helmet.rewind(),
                // Echo out a script tag containing all the on page load data
                asyncProps: asyncProps
              }
              let html = ReactDOMServer.renderToStaticMarkup(
                // Render our "outer app" html with head data and "inner html"
                <DefaultHTML
                  {...appData}
                  title='Tapestry'
                />
              )
              reply(html)
            })

          } else {
            console.log('request 404: ', request.params.path)
            reply(404)
          }
        })
      }
    })
  }


  start() {
    //  Start the server last
    this.registerProxies()
    this.server.start(err => {
      if (err) {
        console.log(err)
      }
      console.log(`🌎  Server running at: ${this.server.info.uri} 👍`)
    })
  }
}

export default Tapestry
