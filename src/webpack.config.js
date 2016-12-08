import path from 'path'
import CleanWebpackPlugin from 'clean-webpack-plugin'

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
    new CleanWebpackPlugin(['public'], {
      root: context
    })
  ]
})