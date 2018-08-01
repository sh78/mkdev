const shell = require('shelljs')

const system = {}
system.uname = shell.exec('uname').stdout.trim()
system.hasMackup = shell.which('mackup').code === 0
system.diskFree = shell.exec('df -h / | tail -1 | awk \'{print $4}\'').stdout.trim()
system.diskFreeNum = system.diskFree.match(/\d*/).join('')
if (system.diskFree.match(/[G]/)) system.diskFreeIsGb = true

module.exports = system
