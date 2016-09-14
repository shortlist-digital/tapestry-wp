import webpack from 'webpack'
import path from 'path'

export default {
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:3050/__webpack_hmr',
    __dirname + '/test-client.js'
  ],
  output: {
    path: __dirname + '/public',
    publicPath: 'http://localhost:3050/'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        plugins: [
          ['react-transform', {
            transforms: [
              {
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              }
            ]
          }]
        ]
      }
    }]
  },
  devServer: {
    port: 3050,
    hot: true,
    inline: true,
    reload: true,
    stats: {
      colors: true
    },
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3030',
      'Access-Control-Allow-Credentials': 'true'
    }

  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
