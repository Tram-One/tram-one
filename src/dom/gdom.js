const assert = require('assert')
const belit = require('belit')
const ninlil = require('ninlil')
const hyperz = require('hyperz')

const { pushWorkingKeyBranch, popWorkingKeyBranch } = require('../working-key')

/**
 * function to generate a tagged template function for any namespace
 * - for complete documentation, please refer to http://tram-one.io/#tram-dom
 *
 * @param {string} namespace
 * @param {object} registry
 *
 * @return {function}
 */
const registerDom = (globalSpace = window) => {
  return (namespace, registry = {}) => {
    assert.equal(typeof registry, 'object', 'Tram-One: registry should be an object')
    assert.ok(!(Array.isArray(registry)), 'Tram-One: registry should be an object')

    const hookedRegistry = Object.keys(registry).reduce((newRegistry, tagName) => {
      const tagFunction = registry[tagName]
      const hookedTagFunction = (...args) => {
        pushWorkingKeyBranch(globalSpace, 'hookKey')(tagName)
        const tagResult = tagFunction(...args)
        popWorkingKeyBranch(globalSpace, 'hookKey')()
        return tagResult
      }

      return Object.assign({}, newRegistry, {[tagName]: hookedTagFunction})
    }, {})

    return ninlil(hyperz, belit(namespace), hookedRegistry || {})
  }
}

/**
 * function to generate a tagged template function for XHTML
 * - for complete documentation, please refer to http://tram-one.io/#tram-html
 *
 * @param {object} registry
 * @return {function}
 */
const registerHtml = (globalSpace = window) => (registry) => {
  return registerDom(globalSpace)(null, registry)
}

/**
 * function to generate a tagged template function for SVG
 * - for complete documentation, please refer to http://tram-one.io/#tram-svg
 *
 * @param {object} registry
 * @return {function}
 */
const registerSvg = (globalSpace = window) => (registry) => {
  return registerDom(globalSpace)('http://www.w3.org/2000/svg', registry)
}

module.exports = { registerDom, registerHtml, registerSvg }
