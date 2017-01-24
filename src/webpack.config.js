import path from 'path'
import webpackCleanPlugin from 'clean-webpack-plugin'

export default (context) => {
    const config = {
      resolve: {
        root: [context, path.resolve(context, 'node_modules')]
      },
      entry: 'tapestry-wp/dist/client.js',
      output: {
        path: 'public',
        filename: 'bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'react']
            }
          }
        ]
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
  return config
}
