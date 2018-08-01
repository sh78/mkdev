const chalk = require('chalk')
const red = chalk.red
const yellow = chalk.yellow
const log = console.log
const shell = require('shelljs')

const system = {}
system.uname = shell.exec('uname').stdout.trim()
system.hasMackup = shell.which('mackup').code === 0
system.diskFree = shell.exec('df -h / | tail -1 | awk \'{print $4}\'').stdout.trim()
system.diskFreeNum = system.diskFree.match(/\d*/).join('')
if (system.diskFree.match(/[G]/)) system.diskFreeIsGb = true

switch (system.uname) {
  case 'Darwin':
    log("Looks like you're on macOS")
    try {
      if (shell.which('brew').code === 0) {
        system.packager = 'brew'
      }
    } catch (err) {
      log(yellow('Installing homebrew...'))
      shell.exec('/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"')
    }
    break
  case 'Linux':
    const packagers = ['apt-get', 'brew', 'pkg', 'dnf', 'yum']
    try {
      packagers.forEach(program => {
        if (shell.which(program).code === 0) {
          system.packager = program
        }
      })
    } catch (err) {
      log(red(
        `Could not locate a supported package manager.` + '\n' +
        `Please set one up and try again.` + '\n' +
        packagers
      ))
      process.exit()
    }
    break
  default:
    log(red("Couldn't identify a package manager to use"))
    process.exit()
}

module.exports = system
