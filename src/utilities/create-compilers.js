const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')

const mergeConfigs = require('./merge-config').default
const configClientDefault = require('../src/webpack/client.config')
const configServerDefault = require('../src/webpack/server.config')

module.exports = ({ cwd, env }) => {

  const configCustomPath = path.resolve(cwd, 'webpack.config.js')
  const babelCustomPath = path.resolve(cwd, '.babelrc')

  // fetch user webpack config
  let configCustom = null
  if (fs.existsSync(configCustomPath)) {
    const module = require(configCustomPath)
    configCustom = module.default || module
  }
  // fetch user babelrc
  let babelCustom = null
  if (fs.existsSync(babelCustomPath)) {
    babelCustom = fs.readJsonSync(babelCustomPath)
  }

  const createCompiler = (configDefault) => {
    // combine default/user webpack config
    const webpackConfig = mergeConfigs({
      configCustom,
      configDefault,
      options: { cwd, env, babelrc: babelCustom },
      webpack
    })
    // kick off webpack compilation
    return webpack(webpackConfig)
  }

  const serverCompiler = createCompiler(configServerDefault)
  const clientCompiler = createCompiler(configClientDefault)

  return {
    serverCompiler,
    clientCompiler
  }
}
