import fs from 'fs-extra'
import path from 'path'

import Server from './server'
import validator from './utilities/validator'

// parent project tapestry config, aliased through webpack/client.config.js
import config from 'tapestry.config.js'

// create client bundle and boot server on callback, avoids the server booting without the client ready.
export default (options) =>
  validator(config, (sanitizedConfig) => {
    // collect bundle asset info and boot server
    const assetsPath = path.resolve(options.cwd, '.tapestry', 'assets.json')
    // assets.json won't exist if running hot-server
    fs.ensureFileSync(assetsPath)
    const assets = fs.readJsonSync(assetsPath, { throws: false })
    return new Server({
      ...options,
      assets: assets || {}, // if assets is null, default to object to allow property access further down the chain e.g. assets.vender
      ...{ config: sanitizedConfig }
    })
  })
