const fs = require('fs-extra')
const chalk = require('chalk')
const winston = require('winston')
const path = require('path')

const tsFormat = () => (new Date()).toLocaleTimeString()

const cwd = process.cwd()
const outputDir = path.resolve(cwd, '.tapestry')
const outputFile = path.resolve(outputDir, 'tapestry.log')

fs.ensureDir(outputDir)

const log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      prettyPrint: true
    }),
    new (winston.transports.File)({
      filename: outputFile,
      timestamp: tsFormat
    })
  ]
})
log.stripColors = !process.stdout.isTTY
log.cli()
log.level = process.env.LOG_LEVEL || 'info'

module.exports.log = log

// success: green arrow, white text
module.exports.notify = (str) => {
  console.log(`${chalk.green('→')} ${chalk.white(str)}`) // eslint-disable-line
}
