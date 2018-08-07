const Tasks = require('.')

const list = new Tasks([
  {
    title: 'Simple task',
    task: () => heavyTask()
  },
  {
    title: 'Allways skip this task',
    skip: () => true,
    task: () => {}
  },
  {
    title: 'Progress bar',
    task: (_, task) => {
      for (let i = 0; i <= 5; i++) {
        heavyTask(5)
        task.setProgress(i, 5)
      }
    }
  },
  {
    title: 'Status and summary',
    task: (_, task) => {
      for (let i = 1; i < 5; i++) {
        task.setStatus(`I'm now working with ${i} of 5`)
        heavyTask(4)
      }
      task.setSummary('I finished them all!')
    }
  },
  {
    title: 'Subtasks',
    task: () => new Tasks([
      {
        title: 'Subtask can also have progress bar',
        task: (_, task) => {
          const length = 100000000
          for (let i = 0; i <= length; i++) {
            task.setProgress(i, length)
          }
        }
      },
      {
        title: 'Another subtask',
        task: () => heavyTask()
      }
    ])
  },
  {
    title: 'Failing task',
    task: (_, task) => {
      heavyTask()
      task.fail('This task failed')
    }
  }
])

list.run()

function heavyTask (l = 1) {
  for (let i = 0; i < l * 100000000; i++) {}
}
