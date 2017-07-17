const path = require('path')
const webpack = require('webpack')
const sharedModules = require('./shared')

// exporting function to allow process.cwd() and environment to get passed through
module.exports = ({ cwd, env, babelrc }) => {
  // expose environment to user
  const __DEV__ = env === 'development'
  const config = {
    // target the browser as runtime
    target: 'web',
    // enable sourcemap
    devtool: 'eval',
    entry: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      'tapestry-wp/src/client/index.js'
    ],
    // output bundle to _scripts, no caching required in dev mode so bundle.js is sufficient
    output: {
      path: path.resolve(cwd, '_scripts'),
      sourceMapFilename: '[name].map',
      filename: '[name].js',
      publicPath: '/_scripts/'
    },
    // when tapestry config is called from webpack.entry.js, resolve from the root of cwd
    resolve: {
      alias: {
        'tapestry.config.js': path.resolve(cwd, 'tapestry.config.js')
      }
    },
    // share module rules with server config
    module: sharedModules(babelrc),
    plugins: [
      new webpack.NamedModulesPlugin(),
      // enable hot reload
      new webpack.HotModuleReplacementPlugin(),
      // expose environment to user
      new webpack.DefinePlugin({ __DEV__ })
      // output public path data for each bundle
    ]
  }

  return config
}
