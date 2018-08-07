exports.sleep = (ms = 150) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

exports.taskConcurrency = concurrent => {
  if (concurrent === true) return Infinity
  if (concurrent !== false) return concurrent

  return 1
}

exports.logAndSleep = async (instance, force = true) => {
  instance.log(force)
  await exports.sleep()
}
