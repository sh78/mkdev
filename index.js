const fs = require('fs')
const shell = require('shelljs')
const prompt = require('./lib/prompt')
const chalk = require('chalk')
const red = chalk.red
const yellow = chalk.yellow
// const green = chalk.green
const log = console.log

/**
 * Prep
 * Get system and config info.
 */
log(yellow('Running prep...'))

const conf = require('./lib/conf.js')
log(conf)

const system = require('./lib/system.js')
log(system)

if (system.diskFreeIsGb && system.diskFreeNum > 10) {
  log(yellow(
    `You have ${system.diskFree} of free disk space.` + '\n' +
    `Are you sure you want to continue the install?`
  ))
  prompt('(y/n): ')
    .then((answer) => {
      answer = answer.toLowerCase()
      if (answer === 'y' || answer === 'yes') {
        log('Ok, proceeding...')
      } else {
        process.exit()
      }
    })
    .catch((error) => {
      log(red("There's an error!"))
      log(error)
      process.exit()
    })
}
