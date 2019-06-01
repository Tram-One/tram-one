const rlite = require('rlite-router')
const { assertIsFunction } = require('../asserts')

const defaultGetPath = () => window.location.href.replace(window.location.origin, '')

/**
 * This file defines one function, useUrlParams, which is a hook that
 * that enables client side routing and variable resolution.
 *
 * This is accomplished by effectively exposing the rlite-router package
 * as a single function and returning false by default.
 *
 * Rather than using XML templates to define routes, this method enables
 * routing in javascript.
 *
 * @see https://tram-one.io/api/#Tram-One#useUrlParams
 */

module.exports = (getPath = defaultGetPath) => {
  assertIsFunction(getPath, 'getPath')

  const onNonMatchingPath = () => false
  const returnParams = params => params

  return (pattern = '*') => rlite(onNonMatchingPath, { [pattern]: returnParams })(getPath())
}
