const assert = require('assert')
const belit = require('belit')
const ninlil = require('ninlil')
const hyperz = require('hyperz')

const { } = require('../working-key')

/**
 * function to generate a tagged template function for any namespace
 * - for complete documentation, please refer to http://tram-one.io/#tram-dom
 *
 * @param {string} namespace
 * @param {object} registry
 *
 * @return {function}
 */
const dom = (globalSpace = window) => {
  return (namespace, registry) => {
    if (registry) {
      assert.equal(typeof registry, 'object', 'Tram-One: registry should be an object')
      assert.ok(!(Array.isArray(registry)), 'Tram-One: registry should be an object')
    }

    const hookedRegistry = Object.keys(registry).reduce((newRegistry, tagName) => {
      const tagFunction = registry[tagName]
      const hookedTagFunction = (...args) => {
        getKey(globalSpace, 'hookKey').push(tagName)
        const tagResult = tagFunction(...args)
        getKey(globalSpace, 'hookKey').pop()
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
const html = (globalSpace = window) => (registry) => {
  return dom(null, registry)
}

/**
 * function to generate a tagged template function for SVG
 * - for complete documentation, please refer to http://tram-one.io/#tram-svg
 *
 * @param {object} registry
 * @return {function}
 */
const svg = (globalSpace = window) => (registry) => {
  return dom('http://www.w3.org/2000/svg', registry)
}

module.exports = { dom, html, svg }
