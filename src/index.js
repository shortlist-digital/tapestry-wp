import fs from 'fs-extra'
import path from 'path'

import Server from './server'
import Client from './client'
import validator from './utilities/validator'

// parent project tapestry config, aliased through webpack/client.config.js
import config from 'tapestry.config.js'

// create client bundle and boot server on callback, avoids the server booting without the client ready.
export default (options) =>
  validator(config, (sanitizedConfig) => {
    // collect bundle asset info and boot server
    const onComplete = () => {
      const assetsPath = path.resolve(options.cwd, '.tapestry', 'assets.json')
      const assets = fs.readJsonSync(assetsPath)
      return new Server({
        ...options,
        assets,
        ...{ config: sanitizedConfig }
      })
    }
    return new Client({
      ...options,
      onComplete,
      ...{ config: sanitizedConfig }
    })
  })
