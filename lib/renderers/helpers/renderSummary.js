const chalk = require('chalk')

module.exports = task => {
  return chalk.dim(`- ${task.summary}`)
}
