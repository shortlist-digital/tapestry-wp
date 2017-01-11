import path from 'path'
import webpack from 'webpack'
import CleanPlugin from 'clean-webpack-plugin'

const env = process.env.NODE_ENV


export default (ctx, isTree = false) => {

  const config = {
    resolve: {
      modules: [ctx, `${ctx}/node_modules`]
    },
    plugins: [
      new CleanPlugin(['public'], {
        root: ctx,
        verbose: false
      })
    ],
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react']
        }
      }]
    }
  }

  if (isTree) {
    config.entry = `${ctx}/tapestry.js`
    config.output = {
      path: path.resolve(ctx, 'dist'),
      filename: 'tree.js',
      libraryTarget: 'commonjs2'
    }
    config.externals = [{
      'isomorphic-fetch': {
        commonjs2: 'isomorphic-fetch'
      }
    }]
  } else {
    config.entry = 'tapestry-wp/dist/client.js'
    config.output = {
      path: path.resolve(ctx, 'public'),
      filename: 'bundle.js'
    }
  }

  if (env === 'production') {
    config.plugins.push(
      new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    )
  }

  return config
}
