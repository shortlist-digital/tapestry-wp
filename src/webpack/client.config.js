import path from 'path'
import webpack from 'webpack'
import CleanPlugin from 'clean-webpack-plugin'
import AssetsPlugin from 'assets-webpack-plugin'
import StatsPlugin from 'stats-webpack-plugin'
import { module } from './shared'

// exporting function to allow process.cwd() and environment to get passed through
export default ({ cwd, env }) => {

  const config = {
    // target the browser as runtime
    target: 'web',
    entry: {
      bundle: 'tapestry-wp/src/client/webpack.entry.js'
    },
    // output bundle to _scripts, no caching required in dev mode so bundle.js is sufficient
    output: {
      path: path.resolve(cwd, '_scripts'),
      filename: '[name].js',
      publicPath: '/_scripts/'
    },
    // when tapestry config is called from webpack.entry.js, resolve from the root of cwd
    resolve: {
      alias: {
        'tapestry.config.js': path.resolve(cwd, 'tapestry.config.js')
      }
    },
    // share module rules with server config
    module: module,
    plugins: [
      // output public path data for each bundle
      new AssetsPlugin({
        filename: 'assets.json',
        path: path.resolve(cwd, '.tapestry'),
        prettyPrint: true
      }),
      // remove output directory before saving new bundle
      new CleanPlugin(['_scripts'], {
        root: cwd,
        verbose: false
      })
    ]
  }

  // production specific config
  if (env === 'production') {
    // expose chunkhash naming for long-life caching
    config.output.filename = '[name].[chunkhash].js'
    // non-changing vendor packages to combine in a vendor bundle
    config.entry.vendor = [
      'async-props',
      'glamor',
      'react-dom',
      'react-helmet',
      'react-router',
      'react'
    ]
    config.plugins.push(
      // production flag for React/others to minify correctly
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      // output common chunks into a vendor bundle
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.[chunkhash].js'
      }),
      //
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      // output chunk stats (path is relative to output path)
      new StatsPlugin('../.tapestry/stats.json', {
        chunkModules: true
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
