const path = require('path')
const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const sharedModules = require('./shared')

// exporting function to allow process.cwd() and environment to get passed through
module.exports = ({ cwd, env, babelrc }) => {
  // expose environment to user
  const __DEV__ = env === 'development'
  const __SERVER__ = false
  const config = {
    // target the browser as runtime
    target: 'web',
    // enable sourcemap
    devtool: 'source-map',
    entry: {
      bundle: 'tapestry-wp/src/client/index.js'
    },
    // output bundle to _assets, no caching required in dev mode so bundle.js is sufficient
    output: {
      path: path.resolve(cwd, '_assets'),
      sourceMapFilename: '[name].map',
      filename: '[name].js',
      publicPath: '/_assets/'
    },
    // when tapestry config is called from webpack.entry.js, resolve from the root of cwd
    resolve: {
      alias: {
        'tapestry.config.js': path.resolve(cwd, 'tapestry.config.js')
      }
    },
    // share module rules with server config
    module: sharedModules(babelrc),
    plugins: [
      // expose environment to user
      new webpack.DefinePlugin({ __DEV__, __SERVER__ }),
      // output public path data for each bundle
      new AssetsPlugin({
        filename: 'assets.json',
        path: path.resolve(cwd, '.tapestry'),
        prettyPrint: true
      }),
      // remove output directory before saving new bundle
      new CleanPlugin(['_assets'], {
        root: cwd,
        verbose: false
      }),
      // output chunk stats (path is relative to output path)
      new StatsPlugin('../.tapestry/stats.json', {
        chunkModules: true
      })
    ]
  }

  // development specific config
  if (env === 'development') {
    config.entry.bundle = [
      'core-js/es6/map',
      'core-js/es6/set',
      'core-js/es6/symbol',
      config.entry.bundle
    ]
  }

  // production specific config
  if (env === 'production') {
    // disable sourcemap
    config.devtool = false
    // expose chunkhash naming for long-life caching
    config.output.filename = '[name].[chunkhash].js'
    // non-changing vendor packages to combine in a vendor bundle
    // react-helmet/glamor aren't required by Tapestry on the client, but they're very likely be put to use by the user so including it in the vendor file
    config.entry.vendor = [
      'core-js/es6/map',
      'core-js/es6/set',
      'core-js/es6/symbol',
      'glamor',
      'react-dom',
      'react-helmet',
      'react-router',
      'react'
    ]
    // config.plugins already defined so lets push any extras
    config.plugins.push(
      // production flag for React/others to minify correctly
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      // output common chunks into a vendor bundle
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.[chunkhash].js'
      }),
      // https://webpack.js.org/plugins/loader-options-plugin/
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      // minify/optimize output bundle, screw_ie8 a bunch
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
          screw_ie8: true,
          warnings: false
        },
        mangle: {
          screw_ie8: true
        },
        output: {
          comments: false,
          screw_ie8: true
        }
      })
    )
  }

  return config
}
