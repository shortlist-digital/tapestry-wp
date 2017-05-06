// This file is required in mocha.opts
// The only purpose of this file is to ensure the babel transpiler is activated prior to any test code, and using the same babel options

require('babel-register')({
  presets: ['es2015', 'react'],
  plugins: ['transform-object-rest-spread']
})
