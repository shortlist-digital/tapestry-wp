import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import CleanPlugin from 'clean-webpack-plugin'

export default ({ cwd, env }) => {

  const config = {
    entry: {
      bundle: 'tapestry-wp/dist/client.js'
    },
    output: {
      path: path.resolve(cwd, '_scripts'),
      filename: '[name].js'
    },
    resolve: {
      alias: {
        'tapestry.config.js': path.resolve(cwd, 'tapestry.config.js')
      }
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }],
            'react'
          ]
        }
      }]
    },
    plugins: [
      new CleanPlugin(['_scripts'], {
        root: cwd,
        verbose: false
      })
    ]
  }

  if (env === 'production') {
    config.output.filename = '[name].[chunkhash].js'
    config.resolve.alias = {
      'tapestry.config.js': path.resolve(cwd, '.tapestry/app/tapestry.config.js')
    }
    config.plugins.push(
      new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      function () {
        this.plugin('done', stats => {
          const jsonStats = stats.toJson()
          return fs.writeFileSync(
            path.resolve(cwd, '.tapestry/assets.json'),
            JSON.stringify(jsonStats.assetsByChunkName)
          )
        })
      }
    )
  }

  return config
}
