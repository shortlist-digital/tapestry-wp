const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const winston = require('winston')

const __PROD__ = process.env.NODE_ENV === 'production'
const tsFormat = () => (new Date()).toLocaleTimeString()

const cwd = process.cwd()
const outputDir = path.resolve(cwd, '.tapestry')
const outputFile = path.resolve(outputDir, 'tapestry.log')

fs.ensureDir(outputDir)

const transports = [
  new (winston.transports.Console)({
    timestamp: tsFormat,
    colorize: true,
    prettyPrint: true
  })
]

if (__PROD__) {
  transports.push(
    new (winston.transports.File)({
      filename: outputFile,
      timestamp: tsFormat
    })
  )
}

const log = new (winston.Logger)({
  level: process.env.LOG_LEVEL || 'info',
  stripColors: __PROD__,
  transports: transports
})

log.cli()

// instance of Winston logger for debug/error/silly logs
module.exports.log = log

// console log for terminal messages
module.exports.notify = (str) => {
  console.log(`${chalk.green('→')} ${chalk.white(str)}`) // eslint-disable-line
}
