import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Helmet from 'react-helmet'
import DefaultHTML from './default-html'
import Hapi from 'hapi'
import WP from 'wpapi'
import { Promise } from 'es6-promise'
import fetch from 'isomorphic-fetch'
import h2o2 from 'h2o2'


class Tapestry {

  constructor(App, baseUrl) {
    this.baseUrl = baseUrl
    this.App = App
    this.api = new WP({endpoint: baseUrl + '/wp-json'})
    this.server = new Hapi.Server()
    this.server.register({
      register: h2o2
    })
    this.setupConnection({
      host: '0.0.0.0',
      port: process.env.PORT || 3030
    })
    this.registerRoutes()
  }

  setupConnection(connectionConfig) {
    this.server.connection(connectionConfig)
  }

  queryWordpress (slug) {
    return Promise.all([
      this.api.posts().filter({name: slug}).embed(),
      this.api.pages().filter({name: slug}).embed()
    ])
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
  registerRoutes() {
    let App = this.App
    let api = this.api
    this.server.route({
      method: 'GET',
      path: '/{path*}',
      handler: (request, reply) => {
        const pathArray = request.params.path.split('/')
        const slug = pathArray[pathArray.length - 1]
        // Hapi can handle promises
        this.queryWordpress(slug)
          .then(values => {
            // Reduce the results from multiple arrays to one
            return values.reduce((prev, next) => {
              return prev.concat(next)
            })
          }).then(data => {
            return {
              // Get our "inner app" markup
              markup: ReactDOMServer.renderToString(
                <App post={data[0]}/>
              ),
              // Pull out the <head> data to pass to our "outer app html"
              head: Helmet.rewind()
            }
          }).then(pageData => {
            return ReactDOMServer.renderToStaticMarkup(
              // Render our "outer app" html with head data and "inner html"
              <DefaultHTML
                {...pageData}
                title='Tapestry'
              />
            )
          })
          .catch((error) => {
            // Catch the myriad errors that could happen
            return console.log('Promise rejected: ', error)
          }).then(html => {
            // Reply with the HTML
            reply(html)
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
