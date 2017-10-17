module.exports = (babelrc) => ({
  rules: [{
    test: /\.js$/,
    exclude: /node_modules(?!\/tapestry-wp)/,
    use: [{
      loader: 'babel-loader',
      options: babelrc || {
        cacheDirectory: true,
        presets: [
          'env',
          'react'
        ],
        plugins: [
          'transform-object-rest-spread',
          'syntax-dynamic-import',
          'idx'
        ]
      }
    }]
  }, {
    test: /\.(jpe?g|png|gif|svg|woff|woff2)$/,
    use: [{ loader: 'file-loader' }]
  }]
})
