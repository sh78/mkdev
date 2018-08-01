const shell = require('shelljs')

const session = {}
session.diskLowOverride = shell.exec('ls session/diskLowOverride').code === 0

module.exports = session
