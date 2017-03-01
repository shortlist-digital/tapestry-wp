module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules(?!\/tapestry-wp)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react'],
          plugins: ['lodash']
        }
      }]
    }]
  }
}
