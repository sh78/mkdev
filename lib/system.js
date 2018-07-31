const shell = require('shelljs')

const system = {}
system.uname = shell.exec('uname').stdout.trim()
system.hasMackup = shell.which('mackup').code === 0
system.diskFree = shell.exec('df -h / | tail -1 | awk \'{print $4}\'').stdout.trim()

module.exports = system
