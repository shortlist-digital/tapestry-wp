const path = require('path')
const nodeExternals = require('webpack-node-externals')
const shared = require('./shared')
const cwd = process.cwd()

// module.exports to enable CLI usage
module.exports = {
  // target node as runtime
  target: 'node',
  // enable webpack node polyfill for __dirname
  node: {
    __dirname: true
  },
  entry: {
    server: 'tapestry-wp/src/index.js'
  },
  // output bundle to dist dir, commonjs2 exports the bundle as module.exports
  output: {
    path: '.tapestry',
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2'
  },
  // share module rules with client config
  module: shared.module,
  resolve: {
    alias: {
      'tapestry.config.js': path.resolve(cwd, 'tapestry.config.js')
    }
  },
  // ignore any node_modules packages, rely on native node require
  externals: [
    nodeExternals({
      whitelist: ['tapestry-wp/src/index.js']
    })
  ]
}
