const chalk = require('chalk')
const figures = require('figures')
const logUpdate = require('log-update')
const progressBar = require('./progressBar')
const taskIcon = require('./taskIcon')

class TasksRenderer {
  constructor (tasks, options) {
    this.tasks = tasks
    this.options = options
  }

  render () {
    const indentString = (string, count) => {
      return new Array(count).join(' ') + string
    }

    const genOutput = (tasks, level = 0, output = '') => {
      for (const task of tasks) {
        const icon = taskIcon(task, level)
        const indent = level * 2
        const messageIndent = indent + 2
        let title = task.title

        if (task.isDone && task.totalTime) {
          title += chalk.dim(` ${task.totalTime}s`)
        }

        output += indentString(`${icon} ${title}\n`, indent)

        if (task.progress && task.isPending) {
          const { done, total } = task.progress
          const progess = progressBar(done, total)
          const percent = Math.ceil((done / total) * 100)
          const status = chalk.dim(`${percent}%`)
          output += indentString(`${progess} ${status}\n`, messageIndent)
        } else if (task.status && task.isPending) {
          output += indentString(chalk.dim(`${figures.arrowRight} ${task.status}\n`), messageIndent)
        } else if (task.summary && task.isDone) {
          output += indentString(chalk.dim(`- ${task.summary}\n`), messageIndent)
        }

        if (task.errors.length) {
          task.errors.forEach(message => {
            output += indentString(chalk.dim(`- ${message}\n`), messageIndent)
          })
        }

        if (task.subtasks && this.options.showSubtasks) {
          output = genOutput(task.subtasks.tasks, level + 1, output)
        }
      }

      return output
    }

    logUpdate(genOutput(this.tasks))
  }
}

module.exports = TasksRenderer
