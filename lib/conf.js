const fs = require('fs')
const yaml = require('js-yaml')
const shell = require('shelljs')
const chalk = require('chalk')
const red = chalk.red
// const yellow = chalk.yellow
const green = chalk.green
const log = console.log

const confs = {}

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
