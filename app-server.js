import React from 'react'
import ReactDOMServer from 'react-dom/server'
import DefaultHTML from './default-html'
import Hapi from 'hapi'
import WP from 'wpapi'
import { Promise } from 'es6-promise'


class Tapestry {

  constructor(App, apiUrl) {
    this.App = App
    this.api = new WP({endpoint: apiUrl})
    this.server = new Hapi.Server()
    this.setupConnection({
      host: '0.0.0.0',
      port: process.env.PORT || 3000
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
            return values.reduce((prev, next) => {
              return prev.concat(next)
            })
          }).then(data => {
            return ReactDOMServer.renderToString(
              <App post={data[0]}/>
            )
          }).then(appString => {
            return ReactDOMServer.renderToStaticMarkup(
              <DefaultHTML
                appString={appString}
                title='Tapestry'
              />
            )
          })
          .catch((error) => {
            return console.log('Promise rejected: ', error)
          }).then(html => {
            reply(html)
          })

      }
    })
  }

  start() {
    //  Start the server last
    this.server.start(err => {
      if (err) throw err
      console.log(`🌎  Server running at: ${this.server.info.uri} 👍`)
    })
  }
}

export default Tapestry
