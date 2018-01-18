process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})
// This file is required in mocha.opts
// The only purpose of this file is to ensure the babel transpiler is activated prior to any test code, and using the same babel options
require('babel-register')({
  sourceMap: 'inline',
  presets: [['env', { targets: { node: 'current' } }], 'react'],
  plugins: ['transform-object-rest-spread']
})
