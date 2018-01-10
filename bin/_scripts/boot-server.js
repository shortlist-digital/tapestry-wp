const path = require('path')
const cwd = process.cwd()
// server path relative to root
const serverPath = path.resolve(cwd, '.tapestry/server.js')
// require server and boot
const server = require(serverPath).default
server({ cwd, env: 'development' })
