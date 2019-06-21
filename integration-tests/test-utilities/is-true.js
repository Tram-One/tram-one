const chalk = require('chalk')

module.exports = (value, valueName, shouldBe, results) => {
  const passed = value === shouldBe
  const type = passed ? 'pass' : 'error'
  const prefix = passed ? '✔' : '✘'
  const color = passed ? 'green' : 'red'

  results.push({ type: type, message: chalk[color](`${prefix} ${valueName} should be ${shouldBe}${passed ? '' : `, but was ${value}`}`) })
}
