import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import CleanPlugin from 'clean-webpack-plugin'
import AssetsPlugin from 'assets-webpack-plugin'
import rules from './rules'

export default ({ cwd, env }) => {

  const config = {
    target: 'web',
    entry: {
      bundle: '../src/client/webpack.entry.js'
    },
    output: {
      path: path.resolve(cwd, '_scripts'),
      filename: '[name].js',
      publicPath: `/_scripts/`
    },
    resolve: {
      alias: {
        'tapestry.config.js': path.resolve(cwd, 'tapestry.config.js')
      }
    },
    module: rules,
    plugins: [
      new AssetsPlugin({
        filename: 'assets.json',
        path: path.resolve(cwd, '.tapestry'),
        prettyPrint: true
      }),
      new CleanPlugin(['_scripts'], {
        root: cwd,
        verbose: false
      })
    ]
  }

  if (env === 'production') {
    config.output.filename = '[name].[chunkhash].js'
    config.entry.vendor = [
      'react',
      'react-dom',
      'react-router',
      'lodash',
      'async-props'
    ]
    config.plugins.push(
      new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.[chunkhash].js'
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      function () {
        this.plugin('done', stats => {
          const jsonStats = stats.toJson({
            chunkModules: true
          })
          return fs.writeFileSync(
            path.resolve(cwd, '.tapestry', 'stats.json'),
            JSON.stringify(jsonStats)
          )
        })
      },
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
