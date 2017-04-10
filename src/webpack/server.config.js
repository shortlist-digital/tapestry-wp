const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const shared = require('./shared')

// module.exports to enable CLI usage
module.exports = ({ cwd, env }) => {
  // expose environment to user
  const __DEV__ = env === 'development'
  // return webpack config
  return {
    // target node as runtime
    target: 'node',
    // enable sourcemaps
    devtool: 'sourcemap',
    // enable webpack node polyfill for __dirname
    node: {
      __dirname: true
    },
    entry: {
      server: 'tapestry-wp/src/index.js'
    },
    // output bundle to .tapestry dir, commonjs2 exports the bundle as module.exports
    output: {
      path: path.resolve(cwd, '.tapestry'),
      filename: '[name].bundle.js',
      libraryTarget: 'commonjs2'
    },
    // share module rules with client config
    module: shared.module,
    // aliasing the users config
    resolve: {
      alias: {
        'tapestry.config.js': path.resolve(cwd, 'tapestry.config.js')
      }
    },
    // ignore any node_modules packages, rely on native node require
    // whitelist entry point otherwise ignored
    externals: [
      nodeExternals({
        whitelist: ['tapestry-wp/src/index.js']
      })
    ],
    plugins: [
      // expose environment to user
      new webpack.DefinePlugin({ __DEV__ }),
      new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false
      })
    ]
  }
}
