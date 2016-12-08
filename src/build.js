import Webpack from 'webpack'
import config from './webpack.config'

export default class Build {

  constructor (context) {
    this.compiler = new Webpack(config(context))
    this.compiler.run((err, stats) => {
      const jsonStats = stats.toJson()
      if (err) return console.log(err)
      if (jsonStats.length) {
        console.log('errors', jsonStats.errors)
        console.log('warnings', jsonStats.warnings)
      }
    })
  }
}