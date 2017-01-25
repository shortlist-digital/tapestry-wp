import webpack from 'webpack'
import config from './webpack.config'
import { log, error } from './logger'
import bytes from 'pretty-bytes'

export default class Build {

  constructor (options) {
    new webpack(config(options), this.handleComplete)
  }

  handleComplete (err, stats) {
    if (err) error(err, true)
    const output = stats.toJson()
    log(`Client bundle size: ${bytes(output.assets[0].size)}`)
  }
}
