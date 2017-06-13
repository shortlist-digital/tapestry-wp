import chalk from 'chalk'
import winston from 'winston'
import path from 'path'

const cwd = process.cwd()
const tsFormat = () => (new Date()).toLocaleTimeString()

const log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      prettyPrint: true
    }),
    new (winston.transports.File)({
      filename: path.resolve(cwd, '.tapestry/tapestry-log.log'),
      timestamp: tsFormat
    })
  ]
})

log.cli()
log.level = process.env.LOG_LEVEL || 'info'

// success: green arrow, white text
export const notify = (str) => {
  console.log(`${chalk.green('→')} ${chalk.white(str)}`) // eslint-disable-line
}

export default log
