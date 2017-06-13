import chalk from 'chalk'
import winston from 'winston'

const tsFormat = () => (new Date()).toLocaleTimeString()

winston.cli()

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      prettyPrint: true
    })
  ]
})

logger.level = process.env.LOG_LEVEL || 'info'

// success: green arrow, white text
export const notify = (str) => {
  console.log(`${chalk.green('→')} ${chalk.white(str)}`) // eslint-disable-line
}

export default logger
