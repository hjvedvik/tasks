const chalk = require('chalk')

class Theme {
  /**
   * @param  {Tasks} tasks
   */
  constructor (tasks) {
    this.options = tasks.options
  }

  dim (string) {
    return chalk.gray(string)
  }

  error (string) {
    return chalk[this.options.errorColor](string)
  }

  progress (string) {
    return chalk[this.options.progressColor](string)
  }

  success (string) {
    return chalk[this.options.successColor](string)
  }
}

module.exports = Theme
