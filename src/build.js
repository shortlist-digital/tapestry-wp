import webpack from 'webpack'
import config from './webpack.config'

export default class Build {

  constructor (context) {
    this.compiler = new webpack(config(context))

    this.compiler.watch({
      aggregateTimeout: 300
    }, (err, stats) => {
      const jsonStats = stats.toJson()
      if (err)
        console.error('Build Client Errors: ', err)
      if (jsonStats.errors.length > 0)
        console.error('Build Client jsonStats Errors: ', jsonStats.errors)
      if (jsonStats.warnings.length > 0)
        console.warn('Build client jsonStats Warnings: ', jsonStats.warnings)
    })
  }
}
