const chalk = require('chalk')

module.exports = (value, valueName, shouldBe, results) => {
  const passed = value === shouldBe
  const type = passed ? 'pass' : 'error'
  const prefix = passed ? '✔' : '✘'

  results.push({ type, message: chalk.green(`${prefix} ${valueName} should be ${shouldBe}`) })
}
