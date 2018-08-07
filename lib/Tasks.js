const pMap = require('p-map')
const Task = require('./Task')
const hirestime = require('hirestime')
const DefaultRenderer = require('./renderers/DefaultRenderer')

class Tasks {
  constructor (tasks, options = {}) {
    this.tasks = tasks

    this.options = Object.assign({
      concurrent: false,
      showSummary: false,
      showSubtasks: true,
      collapseSubtasks: true,
      renderer: DefaultRenderer
    }, options)
  }

  /**
   * Add a new task.
   * @param {Object} task
   */
  add (task) {
    this.tasks.push(task)
  }

  /**
   * Render tasks.
   *
   * @param  {Boolean} force Force a render.
   * @param  {Number}  skip  Amount of renders to skip before actually
   *                         rendering new output. Useful to prevent
   *                         tasks from reducing perfomance.
   */
  render (force = false, skip = 150) {
    if (force) {
      this.renderer.render()
      this.__skipped = skip
    } else if (!this.__skipped) {
      this.renderer.render()
      this.__skipped = skip
    }

    this.__skipped--
  }

  /**
   * Run tasks.
   *
   * @param  {Object}     context User defined context that will
   *                              be passed down to all tasks
   * @param  {Tasks|null} main    The main Tasks instance
   * @return {Promise}
   */
  async run (context = {}, main = this) {
    const totalTimer = hirestime()
    const isMain = main === this

    // initialize each task in this set
    this.tasks = this.tasks.map(task => {
      return new Task(task, this)
    })

    if (isMain) {
      // initialize the renderer when the main instance will run
      const { renderer } = this.options
      this.renderer = new renderer(this.tasks, this.options)
    } else {
      // subtasks inherits the main renderer
      this.render = main.render.bind(main)
    }
    
    const renderSleep = async (force = true) => {
      this.render(force)
      await sleep()
    }

    const concurrency = taskConcurrency(this.options.concurrent)
    const promises = pMap(this.tasks, async task => {
      const taskTimer = hirestime()
      
      task.isPending = true
      this.render(true)

      const skip = await task.skip(context)

      if(skip) {
        task.skipped = true
        if (typeof skip === 'string') task.summary = skip
      } else {
        await task.run(context, main)
      }

      // rerender and wait some milliseconds after a progress bar is finished
      if (task.progress) await renderSleep()

      if (task.result instanceof Tasks) {
        task.subtasks = task.result
        task.result = null
        
        await task.subtasks.run(context, main)
        
        // also rerender and wait some milliseconds after subtasks is finished
        await renderSleep()

        // remove all subtasks when collapsing, except tasks with errors
        if (this.options.collapseSubtasks) {
          task.subtasks.tasks = task.subtasks.tasks.filter(task => !!task.errors.length)
        }
      }

      task.isDone = true
      task.isPending = false
      task.totalTime = taskTimer(hirestime.S)

      this.render(true)
    }, { concurrency })
    

    return promises.then(() => {
      if (isMain) {
        const totalTime = totalTimer(hirestime.S)
        this.renderer.done({ totalTime })
      }

      return context
    })
  }
}

function sleep (ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function taskConcurrency (concurrent) {
  if (concurrent === true) return Infinity
  if (concurrent !== false) return concurrent

  return 1
}

module.exports = Tasks
