import webpack from 'webpack'
import bytes from 'pretty-bytes'

import configDefault from '../webpack/client.config'
import { success, error } from '../utilities/logger'
import mergeConfigs from '../utilities/merge-config'


export default class Client {

  constructor ({ cwd, env, configCustom, onComplete }) {
    // allow class access
    this.onComplete = onComplete
    this.devNotified = false
    // combine default/user webpack config
    const webpackConfig = mergeConfigs({
      configCustom,
      configDefault,
      options: { cwd, env },
      webpack
    })
    // kick off webpack compilation
    this.compiler = webpack(webpackConfig)
    // run once if production, watch if development
    if (env !== 'development') {
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
  complete (stats) {
    // log output
    const output = stats.toJson()
    if (output.assets.length)
      success(`Client built: ${bytes(output.assets[0].size)}`)
    // run callback
    if (typeof this.onComplete === 'function')
      this.onComplete()
  }
}
