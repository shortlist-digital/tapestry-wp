import path from 'path'
import fs from 'fs'
import Build from './build'
import Server from './server'

// resolve the parent config object
console.log(global.TAPESTRY_PRODUCTION)

var configPath
if (global.TAPESTRY_PRODUCTION) {
  configPath = path.resolve(__dirname, 'app/tapestry.js')
} else {
  configPath = path.resolve(process.cwd(), 'tapestry.js')
}
// throw an error if no config exists
if (!fs.existsSync(configPath)) throw Error('tapestry.js not found')

// define parent config and current working directory
const config = require(configPath)
const cwd = process.cwd()

// create client bundle and start node server
new Build(cwd)
new Server({ config, cwd })
