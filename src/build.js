import webpack from 'webpack'
import config from './webpack.config'
import { success, error } from './logger'
import bytes from 'pretty-bytes'

let devNotified = false

export default class Build {

  constructor (opts) {

    this.opts = opts
    this.compiler = webpack(config(opts))

    if (opts.env !== 'development') {
      this.compiler.run((err, stats) => this.run(err, stats))
    } else {
      this.compiler.watch({}, this.watch.bind(this))
    }
  }

  run (err, stats) {
    // handle error
    if (err)
      error(err)
    // log complete
    this.complete(stats)
  }
  watch (err, stats) {
    // handle error
    if (err)
      error(err)
    // log complete
    if (!devNotified) {
      this.complete(stats)
      devNotified = true
    }
  }
  complete (stats) {
    // log output
    const output = stats.toJson()
    success(`Client built: ${bytes(output.assets[0].size)}`)
    // run callback
    if (typeof this.opts.onComplete === 'function')
      this.opts.onComplete()
  }
}
