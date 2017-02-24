const path = require('path')
const nodeExternals = require('webpack-node-externals')
const rules = require('./rules')
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
    bundle: path.resolve(cwd, 'src', 'index.js')
  },
  // output bundle to dist dir, commonjs2 exports the bundle as module.exports
  output: {
    path: path.resolve(cwd, 'dist'),
    filename: 'server.[name].js',
    libraryTarget: 'commonjs2'
  },
  // share module rules with client config
  module: rules,
  // ignore any node_modules packages, rely on native node require
  externals: [nodeExternals()]
}
