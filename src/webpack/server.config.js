const path = require('path')
const webpack = require('webpack')
const idx = require('idx')
const nodeExternals = require('webpack-node-externals')
const sharedModules = require('./shared')

// temp fix for webpack loader-utils deprecated message
// waiting on babel-loader 7.0
// https://github.com/webpack/loader-utils/issues/56
process.noDeprecation = true

// module.exports to enable CLI usage
module.exports = ({ cwd, env, babelrc }) => {
  // expose environment to user
  const __DEV__ = env === 'development'
  const __SERVER__ = true
  // return webpack config
  let serverConfig = {
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
      filename: '[name].js',
      libraryTarget: 'commonjs2'
    },
    // share module rules with client config
    module: sharedModules(babelrc),
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
      new webpack.DefinePlugin({ __DEV__, __SERVER__ }),
      new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false
      })
    ]
  }

  // Always ignore server files using async await

  const ignoreAwaitFiles = [
    'node_modules/tapestry-wp/src/utilities/cache-manager.js',
    'node_modules/tapestry-wp/src/server/handle-api.js',
    'node_modules/tapestry-wp/src/server/handle-daynamic'
  ]

  let babelConfig = serverConfig.module

  const isIgnoreSet = idx(babelConfig, _ => _.rules[0].use[0].options.ignore)

  if (isIgnoreSet) {
    babelConfig.rules[0].use[0].options.ignore.push(ignoreAwaitFiles)
  } else {
    babelConfig.rules[0].use[0].options.ignore = ignoreAwaitFiles
  }
  serverConfig.module = babelConfig

  return serverConfig
}
