import path from 'path'
import webpackCleanPlugin from 'clean-webpack-plugin'

export default (context, isTree = false) => ({
  resolve: {
    modulesDirectories: [context, `${context}/node_modules`]
  },
  entry: isTree ? `${context}/tapestry.js` : 'tapestry-wp/dist/client.js',
  output: {
    path: path.resolve(context, isTree ? 'dist' : 'public'),
    filename: isTree ? 'tree.js' : 'bundle.js',
    libraryTarget: isTree ? 'commonjs2' : 'var'
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
  externals: isTree ? [
    {
      'isomorphic-fetch': {
        commonjs2: 'isomorphic-fetch'
      }
    }
  ] : [],
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
})
