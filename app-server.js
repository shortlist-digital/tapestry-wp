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


class Tapestry {

  constructor(components, baseUrl) {
    this.components = components
    this.baseUrl = baseUrl
    this.routes = routes
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
      let url = this.baseUrl + proxyPath
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
    this.server.route({
      method: 'GET',
      path: '/public/{param*}',
      handler: {
        directory: {
          path: 'public'
        }
      }
    })

    let routes = this.routes(this.components.App)
    this.server.route({
      method: 'GET',
      path: '/{path*}',
      handler: (request, reply) => {
        const url = request.url.path
        // Create Router
        match({ routes, location: url }, (error, redirectLocation, renderProps) => {
          // Hapi can handle promises
          if (error) return reply(error.message)
          if (renderProps) {
            let loadContext = {
              baseUrl: this.baseUrl,
              components: this.components
            }
            loadPropsOnServer(renderProps, loadContext, (err, asyncProps, scriptTag) => {
              let appData = {
                // Get our "inner app" markup
                markup: ReactDOMServer.renderToString(
                  <AsyncProps {...renderProps} {...asyncProps} loadContext={loadContext}/>
                ),
                // Pull out the <head> data to pass to our "outer app html"
                head: Helmet.rewind(),
                // Echo out a script tag containing all the on page load data
                scriptTag: scriptTag
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
      if (err) throw err
      console.log(`🌎  Server running at: ${this.server.info.uri} 👍`)
    })
  }
}

export default Tapestry
