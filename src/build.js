import webpack from 'webpack'
import config from './webpack.config'

export default class Build {

  constructor (options) {
    this.compiler = new webpack(
      config(options),
      (err, stats) => console.log(stats.toString({ colors: true }))
    )
  }
}
