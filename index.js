// const fs = require('fs')
// const yaml = require('js-yaml')
// const shell = require('shelljs')
const chalk = require('chalk')
// const red = chalk.red
const yellow = chalk.yellow
// const green = chalk.green
const log = console.log

log(yellow('Running prep...'))

const conf = require('./lib/conf.js')
log(conf)

const system = require('./lib/system.js')
log(system)
