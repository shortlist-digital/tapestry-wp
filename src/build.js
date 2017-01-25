import webpack from 'webpack'
import config from './webpack.config'

export default class Build {

  constructor (options) {
    new webpack(config(options), this.handleComplete)
  }

  handleComplete (err, stats) {
    if (err) {
      console.error(err)
      return
    }
    const output = stats.toString({
      hash: false,
      timings: false,
      version: false,
      chunks: false,
      colors: true
    })
    console.log(output)
  }
}
