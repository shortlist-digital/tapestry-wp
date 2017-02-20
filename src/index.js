import Server from './server'
import Client from './client'


// tapestry() creates a client bundle and only starts the server once complete, this avoids the server booting without the client ready
const tapestry = (opts) => {
  // create the client bundle, then boot server
  return new Client(Object.assign({
    onComplete: () => new Server(opts)
  }, opts))
}

export default tapestry
