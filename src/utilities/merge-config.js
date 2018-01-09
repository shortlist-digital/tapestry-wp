module.exports = ({ configCustom, configDefault, options, webpack }) => {
  // return finalised tapestry config
  const configTapestry =
    typeof configDefault === 'function' ? configDefault(options) : configDefault
  // if user webpack config is :thumbsup: then run it otherwise return default
  return configCustom
    ? configCustom(configTapestry, options, webpack)
    : configTapestry
}
