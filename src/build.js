import webpack from 'webpack'
import config from './webpack.config'
import { success, error } from './logger'
import bytes from 'pretty-bytes'

export default class Build {

  constructor (opts) {
    // bundle client scripts
    new webpack(config(opts), (err, stats) => {
      // handle error
      if (err)
        error(err)
      // log output
      const output = stats.toJson()
      success(`Client built: ${bytes(output.assets[0].size)}`)
      // run callback
      if (typeof opts.onComplete === 'function')
        opts.onComplete(output)
    })
  }
}
