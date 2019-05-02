const rlite = require('rlite-router')
const { assertIsFunction } = require('../asserts')

const defaultGetPath = () => window.location.href.replace(window.location.origin, '')

module.exports = (getPath = defaultGetPath) => {
  assertIsFunction(getPath, 'getPath')

  const onNonMatchingPath = () => false
  const returnParams = params => params

  return (pattern = '*') => rlite(onNonMatchingPath, { [pattern]: returnParams })(getPath())
}
