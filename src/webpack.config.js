import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import CleanPlugin from 'clean-webpack-plugin'

const env = process.env.NODE_ENV


export default (ctx) => {

  const config = {
    entry: 'tapestry-wp/dist/client.js',
    output: {
      path: path.resolve(ctx, 'public'),
      filename: 'bundle.js'
    },
    resolve: {
      modules: [ctx, `${ctx}/node_modules`]
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { presets: ['es2015', 'react'] }
      }]
    },
    plugins: [
      new CleanPlugin(['public'], {
        root: ctx,
        verbose: false
      })
    ]
  }

  if (env === 'production') {
    config.plugins.push(
      new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      function () {
        this.plugin('done', stats =>
          fs.writeFileSync(
            path.resolve(ctx, 'stats.json'),
            JSON.stringify(stats.toJson())
          )
        )
      }
    )
  }

  return config
}
