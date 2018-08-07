const chalk = require('chalk')

module.exports = error => {
  return chalk.dim(`- ${error}`)
}
