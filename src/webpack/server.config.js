const path = require('path')
const nodeExternals = require('webpack-node-externals')

const rules = require('./rules')
const cwd = process.cwd()


// module.exports to enable CLI usage
module.exports = {
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  entry: path.resolve(cwd, 'src', 'index.js'),
  output: {
    path: path.resolve(cwd, 'dist'),
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: rules,
  externals: [nodeExternals(), 'fs']
}
