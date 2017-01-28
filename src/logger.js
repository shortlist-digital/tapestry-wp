import chalk from 'chalk'


// method to log message to console and optionally cancel current process
const log = (message, quit) => {
  console.log(message)
  if (quit)
    process.exit(0)
}


export const info = (str) =>
  log(chalk.white(str))

export const success = (str, quit) =>
  log(`${chalk.green('→')} ${chalk.white(str)}`, quit)

export const error = (str, quit) =>
  log(`${chalk.bold.red('Error:')} ${chalk.red(str)}\n`, quit)
