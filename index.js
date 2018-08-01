const fs = require('fs')
// const yaml = require('js-yaml')
const shell = require('shelljs')
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

const session = require('./lib/session.js')
log(session)

if (system.diskFreeIsGb && system.diskFreeNum > 10) {
  log(yellow(`You have ${system.diskFree} of free disk space.`))
  if (!session.diskLowOverride) {
    log(yellow(`Are you sure you want to continue the install?`))
    prompt('(y/n): ')
      .then((answer) => {
        answer = answer.toLowerCase()
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
}
