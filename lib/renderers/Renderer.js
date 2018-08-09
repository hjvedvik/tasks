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
    return task.totalTime !== null ? `${task.totalTime}s` : ''
  }

  renderTimestamp (task) {
    return dateFormat(new Date(), this.options.dateFormat)
  }

  renderIcon (task, level = 0) {
    return level === 0 ? figures.pointer : figures.pointerSmall
  }

  renderStatus (task) {
    let status = ''

    if (task.isSkipped) status = 'Skipped'
    else if (task.isFailed) status = 'Failed'
    else if (task.isDone) status = 'Finished'

    return status
  }

  renderSubtitle (string) {
    return `• ${string}`
  }

  renderError (string) {
    return `• ${string}`
  }
}

module.exports = Renderer
