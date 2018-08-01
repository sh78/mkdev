const fs = require('fs')
// const yaml = require('js-yaml')
// const shell = require('shelljs')
const prompt = require('./lib/prompt')
const chalk = require('chalk')
// const red = chalk.red
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

if (system.diskFreeIsGb && system.diskFreeNum > 5) {
  log(yellow(
    `You have ${system.diskFree} of free disk space.` + '\n' +
    `Are you sure you want to continue the install?`
  ))
  // TODO: if file session/diskLowOverride ! exists
  prompt('(y/n): ')
    .then((answer) => {
      if (answer === 'y' || answer === 'yes') {
        log('Ok, proceeding...')
        fs.writeFile('session/diskLowOverride', '', function (err) {
          if (err) return log(err)
        })
      } else {
        process.exit()
      }
    })
    .catch((error) => {
      log("There's an error!")
      log(error)
      process.exit()
    })
}
