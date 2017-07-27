module.exports = (babelrc) => ({
  rules: [{
    test: /\.js$/,
    exclude: /node_modules(?!\/tapestry-wp)/,
    use: [{
      loader: 'babel-loader',
      options: babelrc || {
        cacheDirectory: true,
        presets: [
          'es2015',
          'react'
        ],
        plugins: [
          'transform-object-rest-spread',
          'syntax-dynamic-import',
          'idx'
        ]
      }
    }]
  }]
})
