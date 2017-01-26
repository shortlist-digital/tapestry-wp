import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import CleanPlugin from 'clean-webpack-plugin'

export default ({ cwd, env }) => {

  const config = {
    entry: 'tapestry-wp/dist/client.js',
    output: {
      path: path.resolve(cwd, '_scripts'),
      filename: 'bundle.js'
    },
    resolve: {
      alias: {
        'tapestry.js': path.resolve(cwd, 'tapestry.js')
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
    config.resolve.alias = {
      'tapestry.js': path.resolve(cwd, '.tapestry/tapestry.js')
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
        this.plugin('done', stats =>
          fs.writeFileSync(
            path.resolve(cwd, 'stats.json'),
            JSON.stringify(stats.toJson())
          )
        )
      }
    )
  }

  return config
}
