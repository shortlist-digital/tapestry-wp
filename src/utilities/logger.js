const chalk = require('chalk')
const winston = require('winston')

const tsFormat = () => (new Date()).toLocaleTimeString()

const log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      prettyPrint: true
    })
  ]
})

log.cli()
log.level = process.env.LOG_LEVEL || 'info'

module.exports.log = log

// success: green arrow, white text
module.exports.notify = (str) => {
  console.log(`${chalk.green('→')} ${chalk.white(str)}`) // eslint-disable-line
}
