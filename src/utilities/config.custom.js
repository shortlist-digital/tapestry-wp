
export default ({ userConfig, defaultConfig, options, webpack }) => {

  const defaultThing = (typeof defaultConfig === 'function') ?
    defaultConfig(options) : defaultConfig

  return userConfig
    ? userConfig(defaultThing, options, webpack)
    : defaultThing
}
