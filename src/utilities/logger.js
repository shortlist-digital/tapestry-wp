import chalk from 'chalk'

// log message to console and optionally cancel current process
const log = (message, quit) => {
  console.log(message) // eslint-disable-line
  if (quit) process.exit(0)
}

// wrappers to visually change message

// error message: red text with 'Error:'
export const errorMessage = (str, quit = false)  =>
  log(`${chalk.bold.red('Error:')} ${chalk.red(str)}\n`, quit)

// error object: red text with 'Error:' followed by stack trace
export const errorObject = (obj, quit = true) => {
  errorMessage(obj.message)
  log(obj, quit)
}

// info: white text
export const info = (str) =>
  log(chalk.white(str))

// success: green arrow, white text
export const success = (str, quit = false) =>
  log(`${chalk.green('→')} ${chalk.white(str)}`, quit)
