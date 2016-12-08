import path from 'path'
import webpack from 'webpack'
import webpackCleanPlugin from 'clean-webpack-plugin'

export default (context) => ({
  resolve: {
    modulesDirectories: ['node_modules', context]
  },
  entry: 'tapestry/src/client.js',
  output: {
    path: path.resolve(context, 'public'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  plugins: [
    new webpackCleanPlugin(['public'], { root: context })
    // new webpack.optimize.UglifyJsPlugin(),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'NODE_ENV': JSON.stringify('production')
    //   }
    // })
  ]
})