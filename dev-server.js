import React from 'react'
import Webpack from 'webpack'
import WebpackPlugin from 'hapi-webpack-plugin'
import WebpackConfig from './webpack.config.babel.js'
import Hapi from 'hapi'

const devServer = new Hapi.Server()
devServer.connection({port: 3050})
const compiler = new Webpack(WebpackConfig)
const assets = {}
const hot = {}
devServer.register({
  register: WebpackPlugin,
  options: {compiler, assets, hot}
},
error => {
  if (error) {
    return console.error(error)
  }
  devServer.start(() => {
    console.log('Server running at:', devServer.info.uri)
  })
})
