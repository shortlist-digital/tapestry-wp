import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { match } from 'react-router'

import { Server } from 'hapi'
import h2o2 from 'h2o2'
import Inert from 'inert'
import AsyncProps, { loadPropsOnServer } from 'async-props'

import DefaultRoutes from './default-routes'
import DefaultHTML from './default-html'


export default class TapestryServer {

  constructor ({ config, cwd }) {
    // allow access from class
    this.config = config.default
    this.context = cwd
    // override defaults
    this.routes = this.config.routes || DefaultRoutes
    // run server
    this.bootServer()
    this.startServer()
    // set routes
    this.handleRouteStatic()
    this.handleRouteDynamic()
  }

  bootServer () {
    // create new Hapi server and register required plugins
    this.server = new Server()
    this.server.register([h2o2, Inert])
    this.server.connection({
      host: this.config.host || '0.0.0.0',
      port: this.config.port || 3030
    })
  }
  startServer () {
    // run server
    this.server.start(err => {
      if (err) console.log(err)
      console.log(`🌎  Server running at: ${this.server.info.uri} 👍`)
    })
  }

  handleRouteStatic () {
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
  handleRouteDynamic () {
    this.server.route({
      method: 'GET',
      path: '/{path*}',
      handler: (request, reply) => {
        match({
          routes: this.routes(this.config.components),
          location: request.url.path
        }, (error, redirectLocation, renderProps) => {
          // 404 if error from Hapi
          if (error) return reply(error.message)
          // 404 if no props
          if (!renderProps) reply(404)
          // define global deets for nested components
          const loadContext = this.config
          // get all the props yo
          loadPropsOnServer(renderProps, loadContext, (err, asyncProps, scriptTag) => {
            // 404 if error from Hapi
            if (err) console.log(err)
            // get html from props
            const data = {
              markup: renderToString(
                <AsyncProps
                  {...renderProps}
                  {...asyncProps}
                  loadContext={loadContext} />
              ),
              asyncProps
            }
            // render html with data
            const html = renderToStaticMarkup(
              <DefaultHTML {...data} />
            )
            reply(html)
          })
        })
      }
    })
  }
}