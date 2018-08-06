const Tasks = require('.')

const list = new Tasks([
  {
    title: 'Simple task',
    task: () => heavyTask()
  },
  {
    title: 'Progress bar',
    task: (_, task) => {
      for (let i = 0; i <= 5; i++) {
        heavyTask()
        task.setProgress(i, 5)
      }
    }
  },
  {
    title: 'Status and summary',
    task: (_, task) => {
      for (let i = 1; i < 5; i++) {
        task.setStatus(`Working with ${i} of 5`)
        heavyTask(4)
      }
      task.setSummary('All tasks completed successfully')
    }
  },
  {
    title: 'Subtasks',
    task: () => new Tasks([
      {
        title: 'With progressbar',
        task: (_, task) => {
          const length = 1000000
          for (let i = 0; i <= length; i++) {
            task.setProgress(i, length)
          }
        }
      },
      {
        title: 'Another subtask',
        task: () => new Tasks([
          {
            title: 'With progressbar',
            task: (_, task) => {
              for (let i = 0; i <= 10; i++) {
                heavyTask()
                task.setProgress(i, 10)
              }
            }
          },
          {
            title: 'Another subtask',
            task: () => {
              heavyTask()
            }
          }
        ], {
          showTasks: false
        })
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
