import webpack from 'webpack'
// import bytes from 'pretty-bytes'
import config from '../webpack/client.config'
import { error } from '../utilities/logger'

export default class Build {

  constructor (opts) {
    // allow class access
    this.opts = opts
    this.compiler = webpack(config(opts))
    this.devNotified = false
    // run once if production, watch if development
    if (opts.env !== 'development') {
      this.compiler.run((err, stats) => this.run(err, stats))
    } else {
      this.compiler.watch({}, this.watch.bind(this))
    }
  }

  run (err, stats) {
    // handle error
    if (err) error(err)
    // log complete
    this.complete(stats)
  }
  watch (err, stats) {
    // handle error
    if (err) error(err)
    // log complete
    if (!this.devNotified) {
      this.complete(stats)
      this.devNotified = true
    }
  }
  complete () {
    // log output
    // const output = stats.toJson()
    // success(`Client built: ${bytes(output.assets[0].size)}`)
    // run callback
    if (typeof this.opts.onComplete === 'function')
      this.opts.onComplete()
  }
}
