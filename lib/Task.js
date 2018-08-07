class Task {
  constructor (task, instance) {
    this.task = task
    this.title = task.title
    this.instance = instance
    this.subtasks = null
    this.result = null
    this.cache = null

    this.status = null
    this.summary = null
    this.progress = null
    this.errors = []

    this.totalTime = null
    this.isCurrent = false
    this.isPending = false
    this.isDone = false
    this.skipped = false
  }

  async run (context) {
    this.isCurrent = true
    const result = await this.task.task(context, this)
    this.isCurrent = false
    return result
  }

  async skip (context) {
    return typeof this.task.skip === 'function'
      ? await this.task.skip(context)
      : !!this.task.skip
  }

  setProgress (done, total, options = {}) {
    const { force = total < 1000, skip = total / 1000 } = options
    
    this.progress = { done, total }
    this.instance.log(force, skip)
  }

  setStatus (status, options = {}) {
    const { force = this.status !== status, skip } = options
    
    this.status = status
    this.instance.log(force, skip)
  }

  setSummary (summary, options = {}) {
    const { force = this.summary !== summary, skip } = options
    
    this.summary = summary
    this.instance.log(force, skip)
  }

  fail (reason) {
    this.errors.push(reason)
  }
}

module.exports = Task
