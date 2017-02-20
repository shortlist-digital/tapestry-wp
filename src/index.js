import Server from './server'
import Client from './client'


export default {
  // boots the Tapestry server
  serverOnly: (options, devOptions) => new Server(options, devOptions),
  // creates the client bundle
  clientOnly: options => new Client(options),
  // create client bundle and boot server on callback, avoids the server booting without the client ready. Object.assign() used instead of spread operator as we're only supporting es2015 (currently)
  boot: options => new Client(Object.assign({
    onComplete: () => new Server(options)
  }, options))
}
