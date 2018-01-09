const chalk = require('chalk')
const winston = require('winston')

const tsFormat = () => new Date().toLocaleTimeString()

const log = new winston.Logger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: true,
      prettyPrint: true
    })
  ]
})

log.cli()

// instance of Winston logger for debug/error/silly logs
module.exports.log = log

// console log for terminal messages
module.exports.notify = str => {
  console.log(`${chalk.green('→')} ${chalk.white(str)}`) // eslint-disable-line
}
