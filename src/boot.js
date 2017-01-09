import path from 'path'
import fs from 'fs'
import Build from './build'
import Server from './server'

// We have to do a bit of code duplication here... for now
if (global.TAPESTRY_PRODUCTION) {
  const configPath = path.resolve(process.cwd(), './dist/tree.js')
  // throw an error if no config exists
  if (!fs.existsSync(configPath)) throw Error('tree.js not found')

  // define parent config and current working directory
  const config = require(configPath)
  const cwd = process.cwd()

  // create client bundle and start node server
  new Build(cwd)
  new Server({ config, cwd })
} else {
  const configPath = path.resolve(process.cwd(), 'tapestry.js')

  // throw an error if no config exists
  if (!fs.existsSync(configPath)) throw Error('tapestry.js not found')

  // define parent config and current working directory
  const config = require(configPath)
  const cwd = process.cwd()

  // create client bundle and start node server
  new Build(cwd)
  new Server({ config, cwd })
}
