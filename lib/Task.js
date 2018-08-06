class Task {
  constructor (task, instance) {
    this.task = task
    this.title = task.title
    this.instance = instance
    this.totalTime = null
    this.subtasks = null

    this.status = null
    this.summary = null
    this.progress = null

    this.isPending = false
    this.isDone = false
    this.isFailed = false
    this.errors = []
  }

  async run (context) {
    this.result = await this.task.task(context, this)
  }

  setProgress (done, total, message, options = {}) {
    const { force = total < 1000, skip = total / 1000 } = options
    
    this.progress = { done, total, message }
    this.instance.render(force, skip)
  }

  setStatus (status, options = {}) {
    const { force = this.status !== status, skip } = options
    
    this.status = status
    this.instance.render(force, skip)
  }

  setSummary (summary, options = {}) {
    const { force = this.summary !== summary, skip } = options
    
    this.summary = summary
    this.instance.render(force, skip)
  }

  fail (reason) {
    this.errors.push(reason)
  }
}

module.exports = Task
