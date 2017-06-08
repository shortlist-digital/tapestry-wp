import Server from '../src/server'

const cwd = process.cwd()
const env = 'test'

export const bootServer = (config, options = {}) => {
  // mock webpack provided environment variable
  global.__DEV__ = options.__DEV__ === false ? false : true
  // create and return a new Tapestry instance
  return new Server({
    config: {
      ...config,
      options: {
        port: 5050
      }
    },
    cwd,
    env
  }, {
    silent: true
  })
}
