const Renderer = require('./Renderer')
const indentString = require('./helpers/indentString')

class NonTTYRenderer extends Renderer {
  render (task) {
    let output = ''

    if (((task.isDone && task.totalTime) || task.isSkipped) && !task.__finished) {
      const timestamp = this.renderTimestamp(task)
      const duration = this.renderDuration(task)
      const status = this.renderStatus(task)
      const title = this.renderTitle(task)
      const icon = this.renderIcon(task)

      const left = `${timestamp} ${status}`

      output += `${left} ${icon} ${title} ${duration}\n`

      if (task.summary) {
        const summary = this.renderSubtitle(task.summary)
        output += indentString(`${summary}\n`, 20)
      }

      if (task.errors.length) {
        task.errors.forEach(message => {
          const error = this.renderError(message)
          output += indentString(`${error}\n`, 20)
        })
      }

      task.__finished = true
    }

    return output
  }

  renderTimestamp (task) {
    return this.theme.dim(super.renderTimestamp(task))
  }

  renderTitle (task) {
    return task.errors.length
      ? this.theme.error(task.title)
      : task.isSkipped
        ? this.theme.dim(task.title)
        : task.title
  }

  renderDuration (task) {
    return this.theme.dim(super.renderDuration(task))
  }

  renderStatus (task) {
    const status = super.renderStatus(task, true)

    switch (status.trim()) {
      case 'success': return this.theme.success(status)
      case 'failed': return this.theme.error(status)
    }

    return this.theme.dim(status)
  }

  renderIcon (task) {
    const icon = super.renderIcon(task)

    if (task.isCurrent) return icon
    else if (task.isSkipped) return this.theme.dim(icon)
    else if (task.errors.length) return this.theme.error(icon)
    else if (task.isDone) return this.theme.success(icon)

    return icon
  }

  renderSubtitle (string) {
    return this.theme.dim(super.renderSubtitle(string))
  }

  renderError (string) {
    return this.theme.dim(super.renderError(string))
  }

  log (output) {
    console.log(output)
  }
}

module.exports = NonTTYRenderer
