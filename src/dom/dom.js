const assert = require('assert')
const belit = require('belit')
const ninlil = require('ninlil')
const hyperz = require('hyperz')

/**
 * function to generate a tagged template function for any namespace
 * - for complete documentation, please refer to http://tram-one.io/#tram-dom
 *
 * @param {string} namespace
 * @param {object} registry
 *
 * @return {function}
 */
const dom = (namespace, registry) => {
  if (registry) {
    assert.equal(typeof registry, 'object', 'Tram-One: registry should be an object')
    assert.ok(!(Array.isArray(registry)), 'Tram-One: registry should be an object')
  }

  return ninlil(hyperz, belit(namespace), registry || {})
}

/**
 * function to generate a tagged template function for XHTML
 * - for complete documentation, please refer to http://tram-one.io/#tram-html
 *
 * @param {object} registry
 * @return {function}
 */
const html = (registry) => {
  return dom(null, registry)
}

/**
 * function to generate a tagged template function for SVG
 * - for complete documentation, please refer to http://tram-one.io/#tram-svg
 *
 * @param {object} registry
 * @return {function}
 */
const svg = (registry) => {
  return dom('http://www.w3.org/2000/svg', registry)
}

module.exports = { dom, html, svg }
