module.exports = (string, count, char = ' ') => {
  return new Array(count).join(char) + string
}
