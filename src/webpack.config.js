import path from 'path'
import fs from 'fs'
import webpackCleanPlugin from 'clean-webpack-plugin'

export default (context, isServer = false) => {
  const config = {
    resolve: {
      modulesDirectories: [context, `${context}/node_modules`]
    },
    entry: isServer ? 'tapestry-wp/dist/boot.js' : 'tapestry-wp/src/client.js',
    output: {
      path: path.resolve(context, isServer ? 'server' : 'public'),
      filename: isServer ? 'server.js' : 'bundle.js',
      libraryTarget: isServer ? 'commonjs2' : 'var'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }]
    },
    plugins: [
      new webpackCleanPlugin(['public'], { root: context, verbose: false })
      // new webpack.optimize.UglifyJsPlugin(),
      // new webpack.optimize.OccurrenceOrderPlugin(),
      // new webpack.optimize.DedupePlugin(),
      // new webpack.DefinePlugin({
      //   'process.env': {
      //     'NODE_ENV': JSON.stringify('production')
      //   }
      // })
    ]
  }
  if (isServer) {

      config.node = {
        fs: "empty"
      }

      config.externals = fs.readdirSync('node_modules')
        .filter((x) => {
          return ['.bin'].indexOf(x) === -1
        })
        .reduce((accumulator, mod) => {
          accumulator[mod] = `commonjs2 ${mod}`
          return accumulator
        }, {})
      config.externals['glamor/server'] = 'commonjs2 glamor/server'
  }

  return config

}
