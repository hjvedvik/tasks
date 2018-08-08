const Theme = require('./Theme')
const figures = require('figures')
const dateFormat = require('dateformat')

class Renderer {
  /**
   * @param  {Tasks} tasks
   */
  constructor (tasks) {
    this.options = tasks.options
    this.level = tasks.level
    this.theme = new Theme(tasks)
  }

  render () { return '' }
  done () { return '' }
  log () {}

  renderTitle (task) {
    return task.title
  }

  renderDuration (task) {
    return task.totalTime ? `${task.totalTime}s` : ''
  }

  renderTimestamp (task) {
    return dateFormat(new Date(), this.options.dateFormat)
  }

  renderIcon (task, level = 0) {
    return level === 0 ? figures.pointer : figures.pointerSmall
  }

  renderStatus (task, fixedWidth = false) {
    let status = ''

    if (task.isSkipped) status = 'skipped'
    else if (task.errors.length) status = 'failed'
    else if (task.isDone) status = 'success'

    return fixedWidth ? status.padEnd(7, ' ') : status
  }

  renderSubtitle (string) {
    return `• ${string}`
  }

  renderError (string) {
    return `• ${string}`
  }
}

module.exports = Renderer
