const Renderer = require('./Renderer')
const indentString = require('./helpers/indentString')

class NonTTYRenderer extends Renderer {
  render (task) {
    let output = ''

    const isFailed = task.isFailed && task.exitOnError && !task.__finished
    const isFinished = ((task.isDone && task.totalTime) || task.isSkipped) && !task.__finished

    if (task.isCurrent && !task.__started) {
      task.__started = true
      output += this.renderTask(task)
    }

    if (isFailed || isFinished) {
      task.__finished = true
      output += this.renderTask(task)
    }

    return output
  }

  renderTask (task) {
    const duration = this.renderDuration(task)
    const status = this.renderStatus(task)
    const icon = this.renderIcon(task)

    let title = this.renderTitle(task)

    if (duration) title += ` ${duration}`

    let output = `${status} ${icon} ${title}\n`

    if (task.summary) {
      const summary = this.renderSubtitle(task.summary)
      output += indentString(`${summary}\n`, 12)
    }

    if (task.isFailed) {
      task.errors.forEach(message => {
        const error = this.renderError(message)
        output += indentString(`${error}\n`, 12)
      })
    }

    return output
  }

  renderTimestamp (task) {
    return this.theme.dim(super.renderTimestamp(task))
  }

  renderTitle (task) {
    return task.isFailed
      ? this.theme.error(task.title)
      : task.isSkipped
        ? this.theme.dim(task.title)
        : task.title
  }

  renderDuration (task) {
    const duration = super.renderDuration(task)
    return duration ? this.theme.dim(`[${duration}]`) : null
  }

  renderStatus (task) {
    const status = task.__finished ? super.renderStatus(task) : 'Started'
    const string = status.padEnd(8, ' ')

    switch (status) {
      case 'Finished': return this.theme.success(string)
      case 'Failed': return this.theme.error(string)
    }

    return this.theme.dim(string)
  }

  renderIcon (task) {
    const icon = super.renderIcon(task)

    if (task.isFailed) return this.theme.error(icon)
    else if (task.isCurrent) return icon
    else if (task.isSkipped) return this.theme.dim(icon)
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
