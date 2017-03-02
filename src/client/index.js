import webpack from 'webpack'
import bytes from 'pretty-bytes'

import config from '../webpack/client.config'
import { success, error } from '../utilities/logger'


export default class Client {

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
  complete (stats) {
    // got some assets? cool, log em out
    const jsonStats = stats.toJson()
    if (jsonStats.assets.length)
      success(`Client built: ${this.logAssets(jsonStats)}`)
    // run callback
    if (typeof this.opts.onComplete === 'function')
      this.opts.onComplete()
  }

  logAssets (stats) {
    // log out name/size with a 4 space indent
    const printAsset = asset =>
      asset.chunkNames.length > 0 && `
    ${asset.name} ${bytes(asset.size)}`
    const assets = stats.assets
    // if multiple assets
    if (assets.length > 1) {
      // break onto new lines and loop through each
      return assets
        .map(printAsset)
        .filter(Boolean)
    } else {
      // return inline
      return `${assets[0].name} ${bytes(assets[0].size)}`
    }
  }
}
