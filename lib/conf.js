const fs = require('fs')
const yaml = require('js-yaml')
const shell = require('shelljs')
const chalk = require('chalk')
const red = chalk.red
const green = chalk.green
const log = console.log

const confs = {}

try {
  if (shell.ls('config/*').code === 0) {
    confs._exists = true
  } else {
    log(red('No configuration files!'))
    process.exit()
  }
} catch (err) {
  log(err)
  process.exit()
}

// Get config yaml, or throw exception on error
shell.ls('config/*.yml').forEach(function (file) {
  const name = file
    .split('.')[0]
    .split('/')
    .slice(-1)[0]
  try {
    confs[name] = yaml.safeLoad(
      fs.readFileSync(`${file}`, 'utf8')
    )
    log(green('Loaded ' + file))
  } catch (err) {
    log(red('Failed to load config ' + file))
    log(err)
  }
})

module.exports = confs
