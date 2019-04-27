const rlite = require('rlite-router')
const { assertIsFunction, assertIsDefined } = require('../asserts')

const defaultGetPath = () => window.location.href.replace(window.location.origin, '')

module.exports = (getPath = defaultGetPath) => {
  assertIsFunction(getPath, 'getPath')

  return (pattern) => {
    assertIsDefined(pattern, 'pattern')

    return rlite(() => false, {
      [pattern]: (params) => params
    })(getPath())
  }
}
