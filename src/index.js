import fs from 'fs-extra'
import path from 'path'
import Server from './server'
import Client from './client'

const config = require('tapestry.config.js')

// console.log(config)

// allows destructured imports
// import { boot } from 'tapestry-wp'
// boot()

// boots the Tapestry server
export const server = (options, devOptions) => new Server(options, devOptions)
// creates the client bundle
export const client = (options) => new Client(options)
// create client bundle and boot server on callback, avoids the server booting without the client ready. Object.assign() used instead of spread operator as we're only supporting es2015 (currently)
export const boot = (options) =>{
  console.log(options, config)
}

// allows default import
// import tapestry from 'tapestry-wp'
// tapestry.boot()
export default {
  server,
  client,
  boot
}
