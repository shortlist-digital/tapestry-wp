import chalk from 'chalk'

// log message to console and optionally cancel current process
const log = (message, quit) => {
  console.log(message)
  if (quit)
    // exit(0) avoids the irrelevant npm errors
    process.exit(0)
}

// wrappers to visually change message
// info: white text
export const info = (str) =>
  log(chalk.white(str))
// success: green arrow, white text
export const success = (str, quit = false) =>
  log(`${chalk.green('→')} ${chalk.white(str)}`, quit)
// error: red text with 'Error:'
export const error = (str, quit = true) =>
  log(`${chalk.bold.red('Error:')} ${chalk.red(str)}\n`, quit)
