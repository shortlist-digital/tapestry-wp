import chalk from 'chalk'

const msg = chalk.white
const err = chalk.bold.red

export const log = str =>
  console.log(msg(str))

export const error = (str, quit) => {
  console.log(chalk.bold.red('ERR!'), chalk.red(str))
  if (quit) process.exit(0)
}
