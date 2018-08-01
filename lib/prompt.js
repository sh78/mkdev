const prompt = function (question) {
  var rl = require('readline')
  var r = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })
  return new Promise((resolve, reject) => {
    r.question(question, answer => {
      r.close()
      resolve(answer)
    })
  })
}

module.exports = prompt
