import webpack from 'webpack'
import config from './webpack.config'

export default class Build {

  constructor (context) {
    this.compiler = new webpack(
      config(context),
      (err, stats) => console.log(stats.toString({ colors: true }))
    )
  }
}
